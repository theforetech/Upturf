const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");

const RazorpayLib = require('razorpay')
const razorpayLib = new RazorpayLib({
  key_id: 'rzp_live_OSVbHyJriFdrB3',
  key_secret: '5FnYkOCk2NxGTVcdCx8iz8Lb'
})

const app = express();

const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());

// app.post('/razorpay', async (req, res) => {
//
//   return res.status(200).json({
//     status: "ok"
//   });
// });

app.post('/book', async (req, res, next) => {
  try {
    const userID = req.body.session_variables['x-hasura-user-id']
    const userRole = req.body.session_variables['x-hasura-role']
    let { facility, slots, contactName, contactPhone, date } = req.body.input;

    const GET_DATA_MUTATION = `query ($list: [bigint!], $facilityID: Int!) {
        facilities_by_pk(id: $facilityID) {
          price
          weekendPrice
          slots(where: {id: {_in: $list}}) {
            id
            disabled
            start_time
            end_time
          }
        }
      }`;
    const variables_getData = {
      list: slots,
      facilityID: 13
    }
    // let facilityData = null
    const facilityData = await require('axios')({
      url: 'http://graphql-engine:8080/v1/graphql',
      // url: 'https://backend.upturf.in/v1/graphql',
      method: 'post',
      data: {
        query: GET_DATA_MUTATION,
        variables: variables_getData
      },
      headers: {
        "x-hasura-admin-secret": "SurfATurf"
      }
    })
      .then(resp => {
        if ('errors' in resp.data) {
          return {
            message: resp.data.errors[0].message
          }
        }
        // facilityData = resp.data.data.facilities_by_pk;
        return resp.data.data.facilities_by_pk;
      })
      .catch(err => {
        return {
          message: err.message
        }
      });

    if ('message' in facilityData) {
      return res.status(401).json({
        message: facilityData.message
      });
    }

    let slotPrice = facilityData.price
    if (moment(date).day() === 0 || moment(date).day() === 6) {
      slotPrice = facilityData.weekendPrice
    }

    let err = null
    const slotsObj = []
    facilityData.slots.forEach(slot => {
      if (slot.disabled) {
        err = {
          message: 'Slot is unavailable'
        }
      }
      slotsObj.push({
        slot_id: slot.id,
        startTime: slot.start_time,
        endTime: slot.end_time,
        date: date,
        price: slotPrice,
      })
    })
    if (err) {
      return res.status(401).json(err);
    }
    const amountBooking = slotPrice * slotsObj.length
    const Booking_MUTATION = `
      mutation ($contactName: String, $contactPhone: String, $data: [booked_slots_insert_input!]!, $reservationDate: date, $userID: String, $facilityID:Int, $amount: Int) {
        insert_bookings_one(object: {contact_name: $contactName, contact_phone: $contactPhone, facility_id: $facilityID, reservation_date: $reservationDate, user_id: $userID, booked_slots: {data: $data}, amount: $amount}) {
          id
          booking_status
          amount
        }
      }`;
    const variables = {
      contactName: contactName,
      contactPhone: contactPhone,
      reservationDate: date,
      userID: userID,
      data: slotsObj,
      facilityID: facility,
      amount: amountBooking
    };

    // execute the parent mutation in Hasura
    const booking = await require('axios')({
      url: 'http://graphql-engine:8080/v1/graphql',
      // url: 'https://backend.upturf.in/v1/graphql',
      method: 'post',
      data: {
        query: Booking_MUTATION,
        variables
      },
      headers: {
        "x-hasura-admin-secret": "SurfATurf"
      }
    })
      .then(resp => {
        // console.log(resp.data)
        if ('errors' in resp.data) {
          return {
            message: resp.data.errors[0].message
          }
        }
        return resp.data.data.insert_bookings_one;
      })
      .catch(err => {
        return {
          message: err.message
        }
      });

    if ('message' in booking) {
      return res.status(401).json({
        message: booking.message
      });
    }

    let razorpay_orderID = 'error';

    await razorpayLib.orders.create({
        amount: amountBooking,
        currency: "INR",
        receipt: booking.id
      }, function(err, order) {
        console.log(order)
        razorpay_orderID = order.id
      }
    )

    return res.status(200).json({
      id: booking.id,
      amount: booking.amount,
      razorpay: razorpay_orderID
    });
  } catch (e) {
    next(e);
  }
});

app.post('/createSlots', async (req, res) => {
  async function getTimeStops(start, end, interval){
    const startTime = moment(start, 'HH:mm:ss');
    const endTime = moment(end, 'HH:mm:ss');

    if( endTime.isBefore(startTime) ){
      endTime.add(1, 'day');
    }

    const timeStops = [];

    while(startTime <= endTime){
      timeStops.push(new moment(startTime).format('HH:mm:ss'));
      startTime.add(interval, 'minutes');
    }
    return timeStops;
  }
  // console.log(req.body.event.data.new)
  let timeStops = await getTimeStops(req.body.event.data.new.start_time, req.body.event.data.new.end_time, req.body.event.data.new.slot_size);
  timeStops = timeStops.filter(timeStop => timeStop !== req.body.event.data.new.end_time)
  // console.log('timeStops ', timeStops);

  async function createSlot(start, end, id) {
    // insert into db
    const HASURA_MUTATION = `
      mutation ($start_time: time!, $end_time: time!, $facility_id: Int!) {
        insert_slots(objects: {start_time: $start_time, end_time: $end_time, facility_id: $facility_id}) {
          affected_rows
        }
      }
    `;
    const variables = { start_time: start, end_time: end, facility_id: id };

    // execute the parent mutation in Hasura
    await require('axios')({
      url: 'http://graphql-engine:8080/v1/graphql',
      // url: 'https://backend.upturf.in/v1/graphql',
      method: 'post',
      data: {
        query: HASURA_MUTATION,
        variables
      },
      headers: {
        "x-hasura-admin-secret": "SurfATurf"
      }
    })
      .then(resp => {
        // console.log(resp.data)
        if ('errors' in resp.data) {
          return {
            message: resp.data.errors[0].message
          }
        }
        return resp.data.data.insert_slots;
      })
      .catch(err => {
        return {
          message: err.message
        }
      });
  }
  for (const timeStop of timeStops) {
    await createSlot(timeStop, moment(timeStop, 'HH:mm:ss').add(req.body.event.data.new.slot_size, 'minutes').format('HH:mm:ss'), req.body.event.data.new.id)
  }

  const HASURA_MUTATION = `
      mutation t($id: Int!) {
        update_facilities_by_pk(pk_columns: {id: $id}, _set: {status: 2}) {
          id
          status
        }
      }
    `;
  const variables = { id: req.body.event.data.new.id };

  // execute the parent mutation in Hasura
  await require('axios')({
    url: 'http://graphql-engine:8080/v1/graphql',
    // url: 'https://backend.upturf.in/v1/graphql',
    method: 'post',
    data: {
      query: HASURA_MUTATION,
      variables
    },
    headers: {
      "x-hasura-admin-secret": "SurfATurf"
    }
  })
    .then(resp => {
      // console.log(resp.data)
      if ('errors' in resp.data) {
        return {
          message: resp.data.errors[0].message
        }
      }
      return resp.data.data.insert_slots;
    })
    .catch(err => {
      return {
        message: err.message
      }
    });

  return res.status(200).json({
    timeStops: timeStops
  })
});

app.listen(PORT);
