import { createAdminSchema } from "../validation/admin";

import AdminRepository from "../repository/admin.js";
import bcrypt from "bcrypt";
import {sendOTPviaSMS} from '../utils/sms'
import { v4 as uuidv4 } from "uuid";
import{generateOtp,getOtpExpiry} from '../utils/otp'

const adminRepo = new AdminRepository();
console.log("service1");

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
  profilePhoto: profilePhotoPath
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
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
     if (!admin.isActive) {
      return res.status(403).json({ message: "Admin account is inactive or suspended" });
    }
    
  
console.log("Admin found:", admin);
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
     console.log("Admin found:", admin);
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

    console.log("new Date() <= new Date(admin.otpExpiry):", new Date() > new Date(admin.otpExpiry));
    
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

    if (!admin.isOtpVerified) {
      return res.status(400).json({ message: "Please verify OTP first" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);      
    if (!isMatch) {
       console.log(admin.password, password);
      return res.status(400).json({ message: "Incorrect password" });
     
      
    }

    await adminRepo.updateByPhone(phoneNumber, { lastLogin: new Date() });

    res.status(200).json({ message: "Login successful", result: { phoneNumber } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};






export const passwordreset = async (req, res) => {
try {
  const {phoneNumber} = req.body
  if(!phoneNumber) {
    return res.status(400).json({ message: "phoneNumber is required" });
  }

      const admin = await adminRepo.findByPhone(phoneNumber);
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
    const uuid = uuidv4();
      await adminRepo.updateByPhone(phoneNumber, {
         adminId: admin.id,
      otpCode,
      otpExpiry,
      uuid, // Store UUID for tracking
 // Ensure OTP is not verified yet
    });
      await sendOTPviaSMS(phoneNumber, otpCode);

    res.status(200).json({ message: "OTP sent to your phone", result: { phoneNumber, otpCode } });
} catch (error) {
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
}

  }



export const newpasswordverify = async (req, res) => {
     try {
    const { phoneNumber, otpCode, newPassword,  confirmPassword   } = req.body;

    if (!phoneNumber || !otpCode || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const admin = await adminRepo.findByPhone(phoneNumber);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    if (!admin.isActive) {
      return res.status(403).json({ message: "Admin account is inactive or suspended" });
    }
  
  
    
 
    if (!admin.otpCode || !admin.otpExpiry) {
      return res.status(400).json({ message: "OTP not sent or already used" });
    }

    if (String(admin.otpCode) !== String(otpCode)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
     
      const resetRecord = await adminRepo.findByToken(token);
    if (!resetRecord || resetRecord.adminId !== admin.id) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
     if (resetRecord.usedAt) {
      return res.status(400).json({ message: "Token already used" });
    }


    if (new Date() > new Date(admin.otpExpiry)) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const isSame = await bcrypt.compare(newPassword, admin.password);
    console.log("New password hashed:", hashed);
    if (isSame) {
      return res.status(400).json({ message: "New password must be different from the old password" });
    }
    const hashed = await bcrypt.hash(newPassword,10);
    

   const result = await adminRepo.updateByPhone(phoneNumber, {
      password: hashed,
      otpCode: null,
      otpExpiry: null,
    });
  await adminRepo.markUsed(token);

    return res.status(200).json({ message: "Password reset successful",result: { phoneNumber ,newPassword,hashed} });
  } catch (err) {
    console.log(err);
    
    return res.status(500).json({ message: "Server error" });
  }
}