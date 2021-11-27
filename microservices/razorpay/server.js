const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const RazorpayLib = require('razorpay')
const razorpayLib = new RazorpayLib({
  key_id: 'rzp_test_abiH700LsWApe9',
  key_secret: 'hoycXTVAs1KiMYGuZ7hct9ap'
})

const app = express();

const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());

app.post('/callback', async (req, res) => {
  // if (req.headers.Authorization !== 'SurfATurf') {
  //   return res.status(403).json({ peeking: 'around? :\'p' })
  // }
  const secret = 'SurfATurf'
  const crypto = require('crypto')

  const shasum = crypto.createHmac('sha256', secret)
  shasum.update(JSON.stringify(req.body))
  const digest = shasum.digest('hex')

  // console.log(digest, req.headers['x-razorpay-signature'])
  console.log(req.body)
  console.log(req.body.payload.payment)
  const updateObj = {}
  let refundFlag = false
  if (digest === req.headers['x-razorpay-signature']) {
    updateObj.order_id = req.body.payload.payment.entity.order_id
    if (req.body.event === 'payment.authorized') {
      // payment.authorized flow
      updateObj.payment_status = 'success'
      updateObj.payment_captured = false
      updateObj.payment_id = req.body.payload.payment.entity.id
    } else if (req.body.event === 'payment.captured') {
      // payment.captured flow
      updateObj.payment_status = 'success'
      updateObj.payment_captured = true
      updateObj.payment_id = req.body.payload.payment.entity.id
    } else if (req.body.event === 'payment.failed') {
      // payment.failed flow
      updateObj.payment_status = 'failed'
      updateObj.payment_captured = false
      updateObj.payment_id = req.body.payload.payment.entity.id
    } else if (req.body.event === 'refund.processed') {
      updateObj.payment_status = 'refunded'
      updateObj.amount_refunded = req.body.payload.payment.entity.amount_refunded
      updateObj.refund_status = req.body.payload.payment.entity.refund_status
      // refund flow
      refundFlag = true
    } else if (req.body.event === 'refund.created') {
      updateObj.payment_status = 'refund_initiated'
      updateObj.amount_refunded = req.body.payload.payment.entity.amount_refunded
      updateObj.refund_status = req.body.payload.payment.entity.refund_status
      // refund flow
      refundFlag = true
    }
  } else {
    // pass it
    console.log('Unathorized attempt RAZORPAY')
    return res.status(404).json({ peeking: 'around? :\'p' })
  }

  let Booking_MUTATION = `
      mutation ($id: String!, $status: payment_status_enum_enum, $paymentID: String, $captured: Boolean) {
        update_payments_by_pk(pk_columns: {id: $id}, _set: {payment_captured: $captured, payment_id: $paymentID, payment_status: $status}) {
          id
        }
      }`;
  let variables = {
    id: updateObj.order_id,
    captured: updateObj.payment_captured,
    status: updateObj.payment_status,
    paymentID: updateObj.payment_id
  };

  if (refundFlag) {
    // update for refund
    Booking_MUTATION = `
      mutation ($id: String!, $status: payment_status_enum_enum, $amount: numeric, $refundStatus: String) {
        update_payments_by_pk(pk_columns: {id: $id}, _set: {payment_status: $status, refund_status: $refundStatus, refund_amount: $amount}) {
          id
        }
      }`;
    variables = {
      id: updateObj.order_id,
      amount: updateObj.amount_refunded,
      status: updateObj.payment_status,
      refundStatus: updateObj.refund_status
    };
  }

  // execute the parent mutation in Hasura
  await require('axios')({
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
        console.log(resp.data.errors[0])
        return {
          message: resp.data.errors[0].message
        }
      }
      return resp.data.data.update_payments_by_pk;
    })
    .catch(err => {
      return {
        message: err.message
      }
    });

  if (updateObj.payment_status === 'success' && updateObj.payment_captured) {
    const bookingID = req.body.payload.payment.entity.description.split(': ')[1]
    let MUTATION = `
      mutation ($id: uuid!, $status: payment_status_enum_enum, $bookingStatus: Int) {
        update_bookings_by_pk(pk_columns: {id: $id}, _set: {booking_status: $bookingStatus, payment_status: $status}) {
          id
        }
      }`;
    let vars = {
      id: bookingID,
      status: 'success',
      bookingStatus: 1
    };
    console.log(req.body.payload.payment.entity.description)
    console.log(vars)
    // execute the parent mutation in Hasura
    await require('axios')({
      url: 'http://graphql-engine:8080/v1/graphql',
      // url: 'https://backend.upturf.in/v1/graphql',
      method: 'post',
      data: {
        query: MUTATION,
        variables: vars
      },
      headers: {
        "x-hasura-admin-secret": "SurfATurf"
      }
    })
      .then(resp => {
        if ('errors' in resp.data) {
          console.log(resp.data.errors[0])
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
  } else if (updateObj.payment_status === 'refund_initiated' || updateObj.payment_status === 'refunded') {
    const bookingID = req.body.payload.payment.entity.description.split(': ')[1]
    let MUTATION = `
      mutation ($id: uuid!, $status: payment_status_enum_enum, $bookingStatus: Int) {
        update_bookings_by_pk(pk_columns: {id: $id}, _set: {booking_status: $bookingStatus, payment_status: $status}) {
          id
        }
      }`;
    let vars = {
      id: bookingID,
      status: updateObj.payment_status,
      bookingStatus: 2
    };
    // execute the parent mutation in Hasura
    await require('axios')({
      url: 'http://graphql-engine:8080/v1/graphql',
      // url: 'https://backend.upturf.in/v1/graphql',
      method: 'post',
      data: {
        query: MUTATION,
        variables: vars
      },
      headers: {
        "x-hasura-admin-secret": "SurfATurf"
      }
    })
      .then(resp => {
        if ('errors' in resp.data) {
          console.log(resp.data.errors[0])
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
  }
  return res.json({ status: 'ok' })
});

app.get('*', function(req, res){
  return res.status(404).json({ peeking: 'around? :\'p' })
});

app.listen(PORT);
