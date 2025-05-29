import { list_admin } from "../../../../controller/admin";

export default async function handler(req, res) {
  if (req.method === "GET") {

    return await list_admin(req, res);
  }
  return res.status(400).json({ status: false, message: "method not allowed" });
}
