import { create } from "../../../../controller/admin.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("hqq");
    return await create(req, res);
  }
  return res.status(400).json({ status: false, message: "method not allowed" });
}
