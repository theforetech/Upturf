const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const RazorpayLib = require('razorpay')
const razorpayLib = new RazorpayLib({
  key_id: 'rzp_live_OSVbHyJriFdrB3',
  key_secret: '5FnYkOCk2NxGTVcdCx8iz8Lb'
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

  console.log(digest, req.headers['x-razorpay-signature'])

  if (digest === req.headers['x-razorpay-signature']) {
    if (req.body.event === 'payment.captured') {
      // payment.captured flow
    } else if (req.body.event === 'payment.failed') {
      // payment.failed flow
    } else if (req.body.event === 'refund.processed') {
      // refund flow
    } else if (req.body.event === 'refund.created') {
      // refund flow
    }
  } else {
    // pass it
    console.log('Unathorized attempt RAZORPAY')
    return res.status(403).json({ peeking: 'around? :\'p' })
  }
  return res.json({ status: 'ok' })
});

app.listen(PORT);
