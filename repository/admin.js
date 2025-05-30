
import { symbol } from "joi";
import prisma from "../src/lib/prima";

class AdminRepository {
  constructor() {
    this.model = prisma["Admin"];
  }
  async create(req, res) {
    try {
      const { name, email, age,phoneNumber,profilePhoto,password,isSuperAdmin } = req.body;
    
      const result = await this.model.create({
        data: {
          name,
          email,
          age,
          phoneNumber,
          profilePhoto,
          password,
          isSuperAdmin
        },
      });
      if (!result)
        return res
          .status(400)
          .json({ status: false, message: "admin not created " });
      return {
        name: result.name,
        email: result.email,
        age: result.age,
        phoneNumber: result.phoneNumber,
profilePhoto:result.profilePhoto,
        password: result.password,
        isSuperAdmin:result.isSuperAdmin
      };
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
       const {id}=req.query
     const {name}=req.body
      if(!name)return res.status(400).json({status:false,message:"name is required"})
      const result = await this.model.update({
        where:
        {
            id
        },
        data:{
          name 
        }
      });
      if (!result)
        return res
          .status(400)
          .json({ status: false, message: "admin not created " });
      return {
        name: result.name
       
      };
      
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  }


async delete(req,res){
  try {
    const{id}=req.query
    const result= await  this.model.delete({
where:{
    id
}
    })
    if(!result) return res.status(400).json({status:false,message:"admin not delete "})
 return{
}
  } catch (error) {
     return res.status(500).json({ status: false, message: error.message });
  }

}
async findMany(req,res){
    try {
        const result = await this.model.findMany()
        if(!result ) return res.status(400).json({status:false,message:"admin detail not show "})
            return result
    } catch (error) {
             return res.status(500).json({ status: false, message: error.message });
    }
}
async findUnique(req,res){
    try {
        const {id}=req.query
        const result = await this.model.findUnique({
            where:{
                id
            }
        })
          if(!result ) return res.status(400).json({status:false,message:"admin detail not show "})
            return {
        age:result.age}
    } catch (error) {
         return res.status(500).json({ status: false, message: error.message });
    }
}

async findByPhone(phoneNumber){
try {
  // const {phoneNumber}=req.body 
  const result  = await this.model.findUnique({
     where: { phoneNumber: phoneNumber },
  })
  // if(!result) return res.status(400).json({status:false,message:"findbyphone not find "})
    return result
} catch (error) {
   throw new Error("Error finding admin by phone: " + error.message);
}
}
async updateByPhone(phoneNumber,data ){
try {
  // const {phoneNumber}=req.body 
  const result  = await this.model.update({
     where: { phoneNumber: phoneNumber },
     data:data
  })
  // if(!result) return res.status(400).json({status:false,message:"updateByPhone not update "})
    return result
} catch (error) {
    throw new Error("Error finding admin by phone: " + error.message);
}
}


} 
// module.exports = AdminRepository;
export default AdminRepository;






