import multer from 'multer';



/// set multer to file store in  / public/uploads


///diskstorage return  storeengine  implementation configured to store files on the local file system.
const storage = multer.diskStorage({
    
destination:(req,file,callback)=>{
console.log("this is the file",file);

    callback(null,'./public/uploads')    /// specify  folder destination
    
   
    
},
filename:(req,file,callback)=>{
const setDate = Date.now();
console.log("this is the file name",file);

callback(null,setDate + '-'+file.originalname)




}
})

const upload = multer({storage})
console.log("this is the upload",upload);

export default upload