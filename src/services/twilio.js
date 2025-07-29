const environment = require("dotenv");

environment.config();

const twilio = require("twilio")(
  process.env.TWILIO_ACCOUNT_ID,
  process.env.TWILIO_AUTH_TOKEN
);

module.exports = {
  VerificationCode: async (user) => {
    const message = await twilio.messages
      .create({
        body: `Dear ${user.name}!\nThank you for choosing Pinoyaya. Your verification code is ${user.phoneVerificationCode}.`,
        to: user.phone,
        from: process.env.TWILIO_SENDER_NUMBER,
      })
      .then((message) => {
        console.log(message);
        return {
          status: "Success",
        };
      })
      .catch((error) => {
        return error;
      });
  }
};
