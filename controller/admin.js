import admin from '../services/admin'



const adminController = () => {
  let methods = {};
  methods.create = async (req, res, next) => {
    admin.create(req, res, next);
  };
  methods.update_admin = async(req,res,next)=>{
    admin.update(req,res,next)
  }
  methods.delete_admin = async(req,res,next)=>{
    admin.deletee(req,res,next)
  }
  methods.list_admin =async(req,res,next)=>{
      admin.list(req,res,next)
  }
  methods.id_admin  =async (req,res,next)=>{
    admin.byid(req,res,next)
  }
  return methods;
};
module.exports = adminController("Admin");
