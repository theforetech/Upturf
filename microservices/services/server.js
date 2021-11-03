const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");

const RazorpayLib = require('razorpay')
const razorpayLib = new RazorpayLib({
  key_id: 'rzp_test_abiH700LsWApe9',
  key_secret: 'hoycXTVAs1KiMYGuZ7hct9ap'
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

    const GET_DATA_MUTATION = `query ($list: [bigint!], $facilityID: Int!, $date: date) {
        facilities_by_pk(id: $facilityID) {
          price
          weekendPrice
          slots(where: {id: {_in: $list}}) {
            id
            disabled
            start_time
            end_time
            booked_slots_aggregate(where: {_and: {date: {_eq: $date}, booking: {_and: {booking_status: {_in: [0, 1]}, payment_status: {_in: [processing, success]}}}}}) {
              aggregate {
                count
              }
            }
          }
        }
      }`;
    const variables_getData = {
      list: slots,
      facilityID: facility,
      date: date
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
      if (slot.disabled || slot.booked_slots_aggregate.aggregate.count !== 0) {
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
    let razorpayOrder = null;
    await razorpayLib.orders.create({
        amount: amountBooking * 100,
        currency: "INR",
        receipt: booking.id
      }, function(err, order) {
        console.log(order)
        razorpay_orderID = order.id
        razorpayOrder = order
      }
    )

    const Payment_MUTATION = `
     mutation ($amount: numeric, $id: String, $booking: uuid) {
        insert_payments(objects: {id: $id, amount: $amount, booking_id: $booking}) {
          affected_rows
        }
      }`;
    const variables_payment = {
      amount: razorpayOrder.amount,
      id: razorpay_orderID,
      booking: razorpayOrder.receipt
    };
    // execute the parent mutation in Hasura
    await require('axios')({
      url: 'http://graphql-engine:8080/v1/graphql',
      // url: 'https://backend.upturf.in/v1/graphql',
      method: 'post',
      data: {
        query: Payment_MUTATION,
        variables: variables_payment
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
        return resp.data.data.insert_payments;
      })
      .catch(err => {
        return {
          message: err.message
        }
      });

    return res.status(200).json({
      id: booking.id,
      amount: booking.amount,
      razorpay: razorpay_orderID
    });
  } catch (e) {
    next(e);
  }
});
app.post('/book', async (req, res) => {

app.post('/cleanBookings', async (req, res, next) => {
  try {
    // const userID = req.body.session_variables['x-hasura-user-id']
    // const userRole = req.body.session_variables['x-hasura-role']
    // let { bookingID } = req.body.input;

    // const GET_DATA_MUTATION = `query ($ID: uuid!) {
    //     bookings_by_pk(id: $ID) {
    //       amount
    //       booking_status
    //       reservation_date
    //       payment_status
    //       id
    //       payments {
    //         id
    //         payment_status
    //         payment_captured
    //       }
    //       contact_name
    //       contact_phone
    //       split_payment
    //     }
    //   }`;
    // const variables_getData = {
    //   ID: bookingID
    // }
    // // let facilityData = null
    // const bookingData = await require('axios')({
    //   url: 'http://graphql-engine:8080/v1/graphql',
    //   // url: 'https://backend.upturf.in/v1/graphql',
    //   method: 'post',
    //   data: {
    //     query: GET_DATA_MUTATION,
    //     variables: variables_getData
    //   },
    //   headers: {
    //     "x-hasura-admin-secret": "SurfATurf"
    //   }
    // })
    //   .then(resp => {
    //     if ('errors' in resp.data) {
    //       return {
    //         message: resp.data.errors[0].message
    //       }
    //     }
    //     // facilityData = resp.data.data.facilities_by_pk;
    //     return resp.data.data.bookings_by_pk;
    //   })
    //   .catch(err => {
    //     return {
    //       message: err.message
    //     }
    //   });
    //
    // if ('message' in bookingData) {
    //   return res.status(401).json({
    //     message: bookingData.message
    //   });
    // }
    // const response = {
    //   id: bookingID,
    //   refundID: null,
    //   status: bookingData.booking_status
    // }
    // let cancelBooking = false
    // if (userRole === 'vendor') {
    //   // check booking status
    //   if (bookingData.booking_status === 1) {
    //     cancelBooking = true
    //     // booking is successful
    //     if (bookingData.payment_status === 'success') {
    //       // initiate 100% refund
    //     } else {
    //       // if (bookingData.payment_status === 'refunded') {
    //       //   // else mark booking as cancelled
    //       //   response.
    //       // }
    //     }
    //   } else if (bookingData.booking_status === 2) {
    //     // booking is cancelled
    //     return res.status(401).json({
    //       message: "Booking already cancelled!"
    //     });
    //   }
    // } else if (userRole === 'user') {
    //   // check booking status
    //   if (bookingData.booking_status === 0) {
    //     // booking is processing
    //     cancelBooking = true
    //   } else if (bookingData.booking_status === 1) {
    //     // booking is successful
    //     cancelBooking = true
    //     // refund logic here
    //
    //   } else {
    //     // booking is cancelled
    //     return res.status(401).json({
    //       message: "Booking already cancelled!"
    //     });
    //   }
    // }
    // if (cancelBooking) {
    //   const Cancel_MUTATION = `
    //   mutation ($id: uuid!) {
    //     update_bookings_by_pk(pk_columns: {id: $id}, _set: {booking_status: 2}) {
    //       booking_status
    //       id
    //     }
    //   }`;
    //   const variables = {
    //     id: bookingID
    //   };
    //
    //   // execute the parent mutation in Hasura
    //   const booking = await require('axios')({
    //     url: 'http://graphql-engine:8080/v1/graphql',
    //     // url: 'https://backend.upturf.in/v1/graphql',
    //     method: 'post',
    //     data: {
    //       query: Cancel_MUTATION,
    //       variables
    //     },
    //     headers: {
    //       "x-hasura-admin-secret": "SurfATurf"
    //     }
    //   })
    //     .then(resp => {
    //       if ('errors' in resp.data) {
    //         return {
    //           message: resp.data.errors[0].message
    //         }
    //       }
    //       return resp.data.data.update_bookings_by_pk;
    //     })
    //     .catch(err => {
    //       return {
    //         message: err.message
    //       }
    //     });
    //
    //   if ('message' in booking) {
    //     return res.status(401).json({
    //       message: booking.message
    //     });
    //   }
    //
    //   response.status = 2;
    // }
    return res.status(200).json({ status: 200 });
  } catch (e) {
    next(e);
  }
});

app.post('/cancel', async (req, res, next) => {
  try {
    // const userID = req.body.session_variables['x-hasura-user-id']
    const userRole = req.body.session_variables['x-hasura-role']
    let { bookingID } = req.body.input;

    const GET_DATA_MUTATION = `query ($ID: uuid!) {
        bookings_by_pk(id: $ID) {
          amount
          booking_status
          reservation_date
          payment_status
          id
          payments {
            id
            amount
            payment_status
            payment_captured
            payment_id
          }
          contact_name
          contact_phone
          split_payment
          created_at
          booked_slots(order_by: {startTime: asc}, limit: 1) {
            created_at
            startTime
          }
        }
      }`;
    const variables_getData = {
      ID: bookingID
    }
    // let facilityData = null
    const bookingData = await require('axios')({
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
        return resp.data.data.bookings_by_pk;
      })
      .catch(err => {
        return {
          message: err.message
        }
      });

    if ('message' in bookingData) {
      return res.status(401).json({
        message: bookingData.message
      });
    }
    const response = {
      id: bookingID,
      refund: null,
      status: bookingData.booking_status
    }
    let cancelBooking = false
    let refund = false
    const refundVars = []
    let percentage = 0
    console.log(bookingData)
    if (userRole === 'vendor') {
      // check booking status
      if (bookingData.booking_status === 1) {
        cancelBooking = true
        // booking is successful
        if (bookingData.payment_status === 'success') {
          // initiate 100% refund
          refund = true
          percentage = 100
        } else {
          // if (bookingData.payment_status === 'refunded') {
          //   // else mark booking as cancelled
          //   response.
          // }
        }
      } else if (bookingData.booking_status === 2) {
        // booking is cancelled
        return res.status(401).json({
          message: "Booking already cancelled!"
        });
      }
    } else if (userRole === 'user') {
      // check booking status
      if (bookingData.booking_status === 0) {
        // booking is processing
        cancelBooking = true
      } else if (bookingData.booking_status === 1) {
        // booking is successful
        cancelBooking = true
        refund = true
        // refund logic here
        let date = moment(bookingData.reservation_date, 'YYYY-MM-DD');
        const [hours, minutes, seconds] = bookingData.booked_slots[0].startTime.split(':');
        date = date.utcOffset('+0530')
        date.set({ hours, minutes, seconds })
        const curr = moment().utcOffset('+0530')
        const createdAt = moment(bookingData.created_at).utcOffset('+0530')
        const bookDiff = Math.abs(moment.duration(date.diff(createdAt)).asHours());
        const startDiff = Math.abs(moment.duration(date.diff(curr)).asHours());
        if (bookDiff >= 24) {
          if (startDiff >= 24) {
            percentage = 100
          } else if (startDiff >= 12) {
            percentage = 50
          } else {
            refund = false
          }
        } else {
          if (startDiff >= 8) {
            percentage = 100
          } else if (startDiff >= 6) {
            percentage = 50
          } else {
            refund = false
          }
        }
      } else {
        // booking is cancelled
        return res.status(401).json({
          message: "Booking already cancelled!"
        });
      }
    }
    if (cancelBooking) {
      console.log('cancelling ' + bookingID)
      const Cancel_MUTATION = `
      mutation ($id: uuid!) {
        update_bookings_by_pk(pk_columns: {id: $id}, _set: {booking_status: 2}) {
          booking_status
          id
        }
      }`;
      const variables = {
        id: bookingID
      };

      // execute the parent mutation in Hasura
      const booking = await require('axios')({
        url: 'http://graphql-engine:8080/v1/graphql',
        // url: 'https://backend.upturf.in/v1/graphql',
        method: 'post',
        data: {
          query: Cancel_MUTATION,
          variables
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
          return resp.data.data.update_bookings_by_pk;
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

      response.status = 2;
    }
    let tot = 0
    if (refund) {
      console.log('refunding ' + bookingID)
      bookingData.payments.forEach(payment => {
        refundVars.push({
          amount: payment.amount * (percentage/100.0),
          id: payment.payment_id
        })
        tot += payment.amount * (percentage/100.0)
      })
      response.refund = tot
      console.log(refundVars)

      for (const x of refundVars) {
        await razorpayLib.payments.refund(x.id, {
          amount: x.amount
        })
      }
    }
    console.log('res')
    console.log(response)
    return res.status(200).json(response);
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
  let timeStops = await getTimeStops(req.body.event.data.new.start_time, req.body.event.data.new.end_time, req.body.event.data.new.slot_size);
  timeStops = timeStops.filter(timeStop => timeStop !== req.body.event.data.new.end_time)

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
