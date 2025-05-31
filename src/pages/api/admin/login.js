import { login_admin } from "../../../../controller/admin";

export default async function handler(req, res) {
  if (req.method === "POST") {

    return await login_admin(req, res);
  }
  return res.status(400).json({ status: false, message: "method not allowed" });
}
