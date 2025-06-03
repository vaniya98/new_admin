import { passwordreset } from "../../../../controller/admin";

export default async function handler(req, res) {
  if (req.method === "POST") {
console.log("101");

    return await passwordreset(req, res);
  }
  return res.status(400).json({ status: false, message: "method not allowed" });
}
