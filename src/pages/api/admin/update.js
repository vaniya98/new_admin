


import{update_admin}from '../../../../controller/admin'




export default async function handler(req,res) {
    if (req.method === "PUT") {
    return await update_admin(req,res)
}   
return res.status(400).json({status:false,message:"methods not found"})
}