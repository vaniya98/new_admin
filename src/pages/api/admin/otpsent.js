import { otpsent } from "../../../../controller/admin";

export default async function handler(req, res) {
  if (req.method === "POST") {

    return await otpsent(req, res);
  }
  return res.status(400).json({ status: false, message: "method not allowed" });
}
