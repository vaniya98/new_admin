
import prisma from "../src/lib/prima";
class AdminRepository {
  constructor() {
    this.model = prisma["Admin"];
  }
  async create(req, res) {
    try {
      const { name, email, age,phoneNumber,password } = req.body;
      const result = await this.model.create({
        data: {
          name,
          email,
          age,
          phoneNumber,
          password
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
        password: result.password
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
}
module.exports = AdminRepository;






