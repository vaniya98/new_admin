export const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const getOtpExpiry = () => {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 5);
  
  
  console.log(new Date());
  return expiry;    
  
};


