
import { symbol } from "joi";
import prisma from "../src/lib/prima";

class AdminRepository {
  constructor() {
    this.model = prisma["admin"];
     this.Passwordreset = prisma["Passwordreset"]; 
  }
  async create(req, res) {
    try {
      const { name, email, age,phoneNumber,profilePhoto,password,isSuperAdmin,isActive } = req.body;
    
      const result = await this.model.create({
        data: {
          name,
          email,
          age,
          phoneNumber,
          profilePhoto,
          password,
          isSuperAdmin,
           isActive: true, 
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
        isSuperAdmin:result.isSuperAdmin,
         isActive: result.isActive
        
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


async updateByPhone(phoneNumber,data ){
try {
  // const {phoneNumber}=req.body 
  const result  = await this.model.update({
     where: { phoneNumber },
     
     data
  })
  // if(!result) return res.status(400).json({status:false,message:"updateByPhone not update "})
    return result
} catch (error) {
    return res.status(500).json({ status: false, message: error.message });
}

}

async findByPhone(phoneNumber){
  try {

  
    const result = await this.model.findFirst({
      where:{phoneNumber},
      // select: {
      //   id: true,
      //   name: true,
      //   email: true,
      //   age: true,
      //   phoneNumber: true,
      //     otpCode: true,
      //   otpExpiry: true,
      //   password: true,
        
      //   profilePhoto: true,
      // isOtpVerified: true,
      //   isActive: true
      // }      
    })
     return result
  } catch (error) {
            throw new Error(`DB error in findByPhone: ${error.message}`);
  }

}
async updateByPhones(phoneNumber,data ){
try {
  // const {phoneNumber}=req.body 
  const res  = await this.model.update({
     where: { phoneNumber },
     data
  })
  // if(!result) return res.status(400).json({status:false,message:"updateByPhone not update "})
    return result
} catch (error) {
    return res.status(500).json({ status: false, message: error.message });
}

}


async deleteResetTokenByAdminId(adminId) {
  try {
    console.log("Deleting tokens for adminId:", adminId);
  const result =   await prisma.Passwordreset.deleteMany({
    where: {
      adminId
    },
    
  })

  
  
  return result;
  } catch (error) {
        throw new Error(`DB error in findByPhone: ${error.message}`);
  }
}
async createResetToken(data) {
  try {
    const result = await prisma.Passwordreset.create({
      data: {
        adminId: data.adminId,
        token: data.token,
        expiresAt: data.expiresAt,
        uuid  : data.uuid,
      },
    });
    return result;
  } catch (error) {
    throw new Error(`DB error in findByPhone: ${error.message}`);
  }
}

async findResetTokenByuuid(uuid) {
  try {
    const result = await prisma.Passwordreset.findFirst({
      where: {
        uuid,
      },
    });
    return result;
  } catch (error) {
    throw new Error(`DB error in findByPhone: ${error.message}`);
  }
}
async updateResetToken(tokenId, data) {
  try {
    const result = await prisma.Passwordreset.update({
      where: {
        id: tokenId
      },
      data: {
        ...data,
      },
    });
    return result;
  } catch (error) {
    throw new Error(`DB error in findByPhone: ${error.message}`);
  }
  
}
}
export default AdminRepository;






