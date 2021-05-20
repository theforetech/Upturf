const nodemailer = require('nodemailer')
// const mg = require('nodemailer-mailgun-transport')

/**
 * Sends email
 * @param {Object} data - data
 * @param {boolean} callback - callback
 */
const sendEmail = async (data = {}, callback) => {
  // const auth = {
  //   auth: {
  //     // eslint-disable-next-line camelcase
  //     api_key: process.env.EMAIL_SMTP_API_MAILGUN,
  //     domain: process.env.EMAIL_SMTP_DOMAIN_MAILGUN
  //   }
  //   // host: 'api.eu.mailgun.net' // THIS IS NEEDED WHEN USING EUROPEAN SERVERS
  // }
  // const transporter = nodemailer.createTransport(mg(auth))
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_DOMAIN_MAILGUN,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_FROM_ADDRESS,
      pass: process.env.EMAIL_SMTP_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  })
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: `${data.user.name} <${data.user.email}>`,
    subject: data.subject,
    html: data.htmlMessage
  }
  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      return callback(false)
    }
    return callback(true)
  })
}

module.exports = { sendEmail }
