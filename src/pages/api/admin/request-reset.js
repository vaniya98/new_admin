import { passwordreset } from "../../../../controller/admin";

export default async function handler(req, res) {
  if (req.method === "POST") {

    return await passwordreset(req, res);
  }
  return res.status(400).json({ status: false, message: "method not allowed" });
}
