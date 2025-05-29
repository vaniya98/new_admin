
import{delete_admin}from '../../../../controller/admin'


export default async function handler(req,res) {
    if (req.method === "DELETE") {
    return await delete_admin(req,res)
}   
return res.status(400).json({status:false,message:"methods not found"})
}