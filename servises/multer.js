const multer = require('multer');
const fs = require('fs');
const path = require('path');
const {nanoid} = require('nanoid');

const extentions = {
    image:['image/jpeg', 'image/png', 'image/gif'],
    file:['application/pdf','application/rar']
}
function my_multer (customPath,extention){
      if (!customPath) {
        customPath = 'general';
      } 
      const fullPath = path.join(__dirname,`../uploads/${customPath}`);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath,{recursive:true});
      }
      const storage = multer.diskStorage({
        destination:(req,file,cb)=>{
             req.finalDestination = `uploads/${customPath}`;
             cb(null,fullPath);
        },
        filename:(req,file,cb)=>{
           cb(null,nanoid()+'_'+file.originalname);
        }
      });

      const fileFilter = (req,file,cb)=>{
             if (extention.includes(file.mimetype)) {
                cb(null,true);
             } else {
                req.fileErr = true;
                cb(null,false)
             }
      };

      const uplode = multer({
             dest:fullPath,
              fileFilter,
              storage
      });
      return uplode
};


module.exports = {my_multer,extentions};