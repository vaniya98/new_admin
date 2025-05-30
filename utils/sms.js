import twilio from "twilio";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export const sendOTPviaSMS = async (phoneNumber, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your OTP code is: ${otp}`,
      from: twilioPhone,
      to: phoneNumber,
    });
    return { success: true, sid: message.sid };
  } catch (err) {
    console.error("Twilio SMS Error:", err);
    return { success: false, error: err.message };
  }
};