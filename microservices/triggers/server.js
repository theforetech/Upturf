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

app.post('/razorpay', async (req, res) => {

  return res.status(200).json({
    status: "ok"
  });
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
  console.log(req.body.event.data.new)
  let timeStops = await getTimeStops(req.body.event.data.new.start_time, req.body.event.data.new.end_time, req.body.event.data.new.slot_size);
  timeStops = timeStops.filter(timeStop => timeStop !== req.body.event.data.new.end_time)
  console.log('timeStops ', timeStops);

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
        console.log(resp.data)
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
        console.log(resp.data)
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

  return res.status(200).json({
    timeStops: timeStops
  })
});

app.listen(PORT);
