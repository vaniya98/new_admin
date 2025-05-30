import { create } from "../../../../controller/admin.js";
import upload from '../../../lib/multerConfig.js';

export const config = {
  api: {
    bodyParser: false, // Required to use multer
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return await upload.single('symbol')(req, res, async () => {
      await create(req, res);
    });
  }
  return res.status(405).json({ status: false, message: 'Method not allowed' });
}
