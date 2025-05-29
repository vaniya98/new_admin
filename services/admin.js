// import adminrepositories  from '../repository/admin';
// const { default: prisma } = require("@/lib/prima");
 const {createAdminSchema} = require ('../validation/admin')

const AdminRepository = require("../repository/admin");

const adminRepo = new AdminRepository();

exports.create = async (req, res, next) => {
  try {
    const {error} =  createAdminSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ status: false, message: error?.message});
    }
    const { name, email, age } = req.body;
    if (!name)
      return res
        .status(400)
        .json({ status: false, message: "name is required" });
    if (!email)
      return res
        .status(400)
        .json({ status: false, message: "email is required" });
    if (!age)
      return res
        .status(400)
        .json({ status: false, message: "age is required" });

    var result = await adminRepo.create(req, res);
    return res.status(200).json({
      status: true,
      result: result,
      message: "Admin document save correctly",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      result: null,
      message: error,
    });
  }
};


exports.update = async (req,res,next) => {
    try{
    const{id}= req.query
     const { name } = req.body;
    if(!id ||id===undefined) return res.status(400).json({status:false,message:"id is required"})
         if(!name) return res.status(400).json({status:false,message:"name is required"})
  var result = await adminRepo.update(req,res)
if(!result) return res.status(400).json({status:false,message:"admin not update"})
    return res.status(200).json({status:true,result:result,message:"admin updated "})
}catch(error){
console.log(error);                                                                 
return res.status(400).json({
      status: false,
      result: null,
      message: error,
    });
}
    }


    exports.deletee=async(req,res,next)=>{
        try {
            const{id}=req.query
const result= await adminRepo.delete(req,res)
if(!result) return res.status(400).json({status:false,message:" admin not  delete"})

    return res.status(200).json({status:true,message:"admin delete successfully"})
}catch(error){
    console.log(error);
    return res.status(400).json({
      status: false,
      result: null,
      message: error,
    });
}
}

exports.list =async (req,res,next)=>{
    try {
     const result = await adminRepo.findMany();
        if(!result) return res.status(400).json({status:false,message:" admin detail not show"})

    return res.status(200).json({status:true,message:"admin list  successfully",result:result})
    } catch (error) {
         console.log(error);
         return res.status(400).json({
      status: false,
      result: null,
      message: error,
    });
    }
}
exports.byid = async(req,res,next)=>{
    try {
        const{id}=req.query
           if(!id ||id===undefined) return res.status(400).json({status:false,message:"id is required"})
            const result = await adminRepo.findUnique(req,res)
           if(!result) return res.status(400).json({status:false,message:" admin detail not show"})
            return res.status(200).json({status:true,result:result,message:"admin list  successfully"})
    } catch (error) {
          console.log(error);
         return res.status(400).json({
      status: false,
      result: null,
      message: error,
    });
    }
}




      