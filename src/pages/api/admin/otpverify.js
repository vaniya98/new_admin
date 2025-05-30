import { otpverify } from "../../../../controller/admin";

export default async function handler(req, res) {
  if (req.method === "POST") {

    return await otpverify(req, res);
  }
  return res.status(400).json({ status: false, message: "method not allowed" });
}
