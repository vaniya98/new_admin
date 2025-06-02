import {create,update,deletee,list,byid,otpsent,otpverify,login_admin,passwordreset,newpasswordverify} from '../services/admin'




// const adminController = () => {
//   let methods = {};
const admin = (modelName) => {
  let model = modelName;
  let methods = {};
  methods.create = async (req, res, next) => {

  create(req, res, next);
  };

  
  methods.update_admin = async(req,res,next)=>{
  
    update(req,res,next)
  }
  methods.delete_admin = async(req,res,next)=>{
    
    deletee(req,res,next)
  }
  methods.list_admin =async(req,res,next)=>{
  
    list(req,res,next)
  }
  methods.id_admin  =async (req,res,next)=>{
 
    byid(req,res,next)
  }
  methods.otpsent = async(req,res,next)=>{
    otpsent(req,res,next)
  }
  methods.otpverify = async(req,res,next)=>{
    otpverify(req,res,next)
  }
  methods.login_admin = async(req,res,next)=>{
    login_admin(req,res,next)
  }
  methods.passwordreset = async(req,res,next)=>{
    passwordreset(req,res,next)
  }
  methods.newpasswordverify = async(req,res,next)=>{
    newpasswordverify(req,res,next)
  }
  return methods;
};
module.exports = admin("Admin");
