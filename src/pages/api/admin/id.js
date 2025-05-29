
import{id_admin}from '../../../../controller/admin'


export default async function handler(req,res) {
    if (req.method === "GET") {
    return await id_admin(req,res)
}   
return res.status(400).json({status:false,message:"methods not found"})
}