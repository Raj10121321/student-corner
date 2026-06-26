// services/smsService.js
const twilio = require("twilio");
require("dotenv").config();

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

function sendSMS(to, body) {
  return client.messages.create({
    body,
    from: process.env.TWILIO_PHONE_NUMBER || "+12563635932",
    to,
  });
}

module.exports = { sendSMS };
