// import { v4 as uuidv4 } from 'uuid'
import { createAdminSchema } from "../validation/admin";

import { sendOTPviaSMS } from "../utils/sms";
import { sendOTPviaEmail } from "../utils/email";
 import jwt from "jsonwebtoken";
 import { serialize } from "cookie";
 const { v4: uuidv4 } = require('uuid'); 




import AdminRepository from "../repository/admin.js";
import bcrypt from "bcrypt";


 
import{generateOtp,getOtpExpiry} from '../utils/otp'
// import { v4 as uuidv4 } from 'uuid';
const adminRepo = new AdminRepository();
// console.log("service1111");

export const create = async (req, res, next) => {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Please upload a file" });
    }
  try {
    const {
      name,
      email,
      age,
      phoneNumber,
      
      password,
      isSuperAdmin,
   
    } = req.body;
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
    if (!phoneNumber) {
      return res
        .status(400)
        .json({ status: false, message: "phoneNumber is required" });
    }
    if (!password)
      return res
        .status(400) 
        .json({ status: false, message: "password is required" });
    if (!isSuperAdmin)
      return res
        .status(400)
        .json({ status: false, message: "isSuperAdmin is required" });
  
    const { error } = createAdminSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ status: false, message: error?.message });
    }

     

    
   const profilePhotoPath = `/uploads/${file.filename}`;




    const plainPassword = await bcrypt.hash(password, 10);

    const parsedData = {
  name,
  email,
  age: parseInt(age),
  phoneNumber,
  password: plainPassword,
  isSuperAdmin: String(isSuperAdmin).toLowerCase() === "true",
  profilePhoto: profilePhotoPath,
   isActive: true
  
};

const result = await adminRepo.create({ ...req, body: parsedData }, res);
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

export const update = async (req, res, next) => {
  try {
    const { id } = req.query;
    const { name } = req.body;
    if (!id || id === undefined)
      return res.status(400).json({ status: false, message: "id is required" });
    if (!name)
      return res
        .status(400)
        .json({ status: false, message: "name is required" });
    var result = await adminRepo.update(req, res);
    if (!result)
      return res
        .status(400)
        .json({ status: false, message: "admin not update" });
    return res
      .status(200)
      .json({ status: true, result: result, message: "admin updated " });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      result: null,
      message: error,
    });
  }
};

export const deletee = async (req, res, next) => {
  try {
    const { id } = req.query;
    const result = await adminRepo.delete(req, res);
    if (!result)
      return res
        .status(400)
        .json({ status: false, message: " admin not  delete" });

    return res
      .status(200)
      .json({ status: true, message: "admin delete successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      result: null,
      message: error,
    });
  }
};

export const list = async (req, res, next) => {
  try {
    const result = await adminRepo.findMany();
    if (!result)
      return res
        .status(400)
        .json({ status: false, message: " admin detail not show" });

    return res.status(200).json({
      status: true,
      message: "admin list  successfully",
      result: result,
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
export const byid = async (req, res, next) => {
  try {
    const { id } = req.query;
    if (!id || id === undefined)
      return res.status(400).json({ status: false, message: "id is required" });
    const result = await adminRepo.findUnique(req, res);
    if (!result)
      return res
        .status(400)
        .json({ status: false, message: " admin detail not show" });
    return res.status(200).json({
      status: true,
      result: result,
      message: "admin list  successfully",
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



export const otpsent = async (req,res,next)=>{
 try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ message: "phoneNumber is required" });
    }

    const admin = await adminRepo.findByPhone(phoneNumber);
    console.log("Admin found:", admin?.isActive);
    
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
     if (!admin.isActive) {
      return res.status(403).json({ message: "Admin account is inactive or suspended" });
    }
    
  
// console.log("Admin found:", admin);
    const otpCode = generateOtp();
    const otpExpiry = getOtpExpiry();
  console.log("asssd",otpCode, otpExpiry);
    
    // Save OTP and expiry in DB
   const updatedAdmin = await adminRepo.updateByPhone(phoneNumber, {
      otpCode,
      otpExpiry,
     
    });

    console.log("OTP saved to DB:", updatedAdmin.otpCode);

 
    // Send OTP via SMS
    const smsResult = await sendOTPviaSMS(phoneNumber, otpCode);
    if (!smsResult.success) {
      return res.status(500).json({ message: "Failed to send OTP" });
    }
    console.log(smsResult);
    

    res.status(200).json({ message: "OTP sent successfully",result:{ phoneNumber },otpCode });
  } catch (error) {
      console.log(error);
    return res.status(400).json({
      status: false,
      result: null,
      message: error.message||"somthing error",
    });     
  }
};

export const otpverify = async (req,res,next)=>{
  try {
    const { phoneNumber, otpCode } = req.body;
    if (!phoneNumber || !otpCode) { 
      return res.status(400).json({ message: "phoneNumber and otp are required" });
    }   
 
    const admin = await adminRepo.findByPhone(phoneNumber);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
     console.log("Admin found:", admin.otpCode);
    if (!admin.isActive) {  
      return res.status(403).json({ message: "Admin account is inactive or suspended" });
    }
    if (admin.isOtpVerified) {
      return res.status(400).json({ message: "OTP already verified" });
    }
     
    //    if (!admin.otpCode || !admin.otpExpiry) {
    //   return res.status(400).json({ message: "OTP already verified or not sent" });
    // }

       if (new Date() > new Date(admin.otpExpiry)) {
      return res.status(400).json({ message: "OTP expired" });
    }

console.log("Stored OTP:", admin.otpCode, "Received OTP:", otpCode);
    
     if (String(admin.otpCode) !== String(otpCode)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
 

const result = await adminRepo.updateByPhone(phoneNumber, { otpCode: null, otpExpiry: null, isOtpVerified: true});

    res.status(200).json({ message: "OTP verified successfully" ,result});    
  } catch (err) {   
    console.error(err);  
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login_admin = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
      return res.status(400).json({ message: "phoneNumber and password are required" });
    }

    const admin = await adminRepo.findByPhone(phoneNumber);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (!admin.isActive) {
      return res.status(403).json({ message: "Admin account is inactive. Contact support." });
    }
console.log("Admin found:", admin.isActive, "OTP Verified:", admin.isOtpVerified);

    if (!admin.isOtpVerified) {
      return res.status(400).json({ message: "Please verify OTP first" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);      
    if (!isMatch) {
       console.log(admin.password, password);
      return res.status(400).json({ message: "Incorrect password" });
          
    }
    const token = jwt.sign(
      { id: admin.id, email: admin.email, password: admin.password },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const cookie = serialize("adminToken", token, {
      ///// 'admintoken' ==  name of cookie store jwt token,token ==
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    res.setHeader("Set-Cookie", cookie);
    await adminRepo.updateByPhone(phoneNumber, { lastLogin: new Date() });

    res.status(200).json({ message: "Login successful", result: { phoneNumber } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};






export const passwordreset = async (req, res,next) => {
try {
  console.log("105");
  
  const {phoneNumber,email} = req.body
 
    if (!phoneNumber && !email) {
      return res.status(400).json({ message: "phoneNumber or email is required" });
    }
  

  let admin;
if (phoneNumber) {
  admin = await adminRepo.findByPhone(phoneNumber);
} else {
  admin = await adminRepo.findByEmail(email);
}


    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    if (!admin.isActive) {
      return res.status(403).json({ message: "Admin account is inactive or suspended" });
    }
    if (!admin.isOtpVerified) {
      return res.status(400).json({ message: "user not verified" });
    }

  const otpCode = generateOtp();
  const otpExpiry = getOtpExpiry();
     
    
         await adminRepo.deleteResetTokenByAdminId(admin.id);
         console.log("Deleted previous reset tokens for adminId:", admin.id );
         
         const tokendata = {
    token: otpCode,
    adminId: admin.id,
    expiresAt: otpExpiry,

         } 
         if (email) {
      tokendata.uuid = uuidv4();
         }


  const createtoken = await adminRepo.createResetToken(tokendata);
 console.log("Created Token:", createtoken);
    if (phoneNumber) {
      await sendOTPviaSMS(phoneNumber, otpCode);
      console.log(`OTP sent via SMS to ${phoneNumber}`);
    }
     if (email) {
      await sendOTPviaEmail(email, otpCode,createtoken.uuid);
      console.log(`OTP sent via Email to ${email}`);
    }
    
 

    console.log("OTP Code:", otpCode, "Expiry:", otpExpiry);
      if (email) console.log("UUID:", createtoken.uuid);
     return res.status(200).json({
      message: "OTP sent",
      result: {
        ...(phoneNumber && { phoneNumber }),
        ...(email  && { email, uuid: createtoken.uuid }),
        otpCode, 
      },
    });

} catch (error) {
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
}

  }



  export const newpasswordverify = async (req, res) => {
    try {
      const {phoneNumber, email, otpCode, newPassword, confirmPassword ,uuid } = req.body;

     
       if (!otpCode || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "OTP and passwords are required" });
    }
   if (!phoneNumber && !email) {
      return res.status(400).json({ message: "Either phoneNumber or email is required" });
    }
        if (email && !uuid) {
      return res.status(400).json({ message: "UUID is required for email-based reset" });
    }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      let admin;
 if (email) {
      admin = await adminRepo.findByEmail(email);
    } else {
      admin = await adminRepo.findByPhone(phoneNumber);
    }
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });

      }
      if (!admin.isActive) {
        return res.status(403).json({ message: "Admin account is inactive or suspended" });
      }
 const tokenRecord = email
      ? await adminRepo.findResetTokenByuuid(uuid)
      : await adminRepo.findLatestResetTokenByAdminId(admin.id);
       if (!tokenRecord) {
      return res.status(400).json({ message: "OTP request not found. Please request a new one." });
    }
 
      console.log("OTP Code:", otpCode, tokenRecord.token);
      
  console.log("Token Record:", tokenRecord);

      // Match token 
      if (tokenRecord.token !== otpCode || tokenRecord.adminId !== admin.id) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      // Check if token is expired or already used
      const now = new Date();
      if (tokenRecord.usedAt || now > new Date(tokenRecord.expiresAt)) {
        return res.status(400).json({ message: "OTP expired or already used" });
      }

      //  password is not same as old password
      const isSame = await bcrypt.compare(newPassword, admin.password);
      if (isSame) {
        return res.status(400).json({ message: "New password must be different from the old password" });
      }

  
      const hashed = await bcrypt.hash(newPassword, 10);

      
      
      
      // Update admin password  
      if (email) {
        await adminRepo.updateByemail(email, { password: hashed });
      } else {
        await adminRepo.updateByPhone(phoneNumber, { password: hashed });
      }
      
      // Mark OTP as used
      await adminRepo.updateResetToken(tokenRecord.id, { usedAt: new Date() });
      
      return res.status(200).json({ message: "Password reset successful" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  };

