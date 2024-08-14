const express = require("express");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
require("dotenv").config();
const {
  validate,
  update_validate,
  delete_validate,
} = require("./Middleware/userMiddleware");
const { get_user_data, add_user } = require("./utils");
const { DBConnect } = require("./config/Db");
const { userModel } = require("./Module/userModule");
const { cloudniary_upload } = require("./utils/cloudinary_uploader");
const { Multer_upload } = require("./utils/multer_upload");
const { eventRouter } = require("./router/eventRouter");

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use('/event',eventRouter)

var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
app.use(morgan("combined", { stream: accessLogStream }));

app.get("/", async(req, res) => {
  // const users = await userModel.find({},{password:0,_id:0,__v:0});
  res.json({message:'response from server'});
});

app.post("/register", Multer_upload.single("image"), async (req, res) => {
  let status = 0;
  let message = "All fields Are required name,email,password,image";
  let return_data = [];
  const { name, email, password } = req.body;
  if (name && email && password && name != "" && email != "" && password != "") {
    const emailFind = await userModel.findOne({ email: email });
    //console.log(emailFind);
    message = "Email is Already Registered";
    if (emailFind == null) {
      message = "Image upload failed";
      if (req.file) {
        try {
          const profile_image = await cloudniary_upload(req);
          const hashpass =await bcrypt.hash(password, 20);
          const newUser = {
            id: parseInt(Math.random() * 10000000),
            name,
            email,
            password:hashpass,
            profile_image,
          };
          const new_user = await userModel.create(newUser);
          message = "You are registered";
          status = 1;
          return_data = new_user;
          //res.json({ message: 'You are registered', ...newUser });
        } catch (error) {
          //res.status(500).json({ message: `Image upload failed: ${error.message}` });
          message = `Image upload failed: ${error.message}`;
        }
      }
    }
  }
  res.json({ status: status, message: message, data: return_data });
});

app.post('/login',async(req,res)=>{
  let status = 0;
  let message = "All fields Are required email,password";
  let return_data = [];
  const{email,password} = req.body;
  if(email && password && email!='' && password!=''){
    const user = await userModel.findOne({email:email});
    message="User not availbale"
    if(user!=null){
      message="Wrong Password"
      //console.log(user.password)
      const password_match = await bcrypt.compare(password, user.password);
      if(password_match) {
          message="Login successfully";
          status=1;
          let token = jwt.sign({ email: user.email }, process.env.JWT_PRIVATE_KEY);
          return_data = [{token:token}]
      }
    }
  }
  res.json({ status: status, message: message, data: return_data });
})

app.patch("/update", update_validate, (req, res) => {
  const { id, name, email } = req.body;
  const data = get_user_data();
  let new_data = data.map((d) => (d.id === id ? { ...d, name, email } : d));
  add_user(new_data);
  res.json({ message: "User update success" });
});

app.delete("/delete/:id", delete_validate, (req, res) => {
  const { id } = req.params;
  const data = get_user_data();
  const new_data = data.filter((d) => d.id !== id);
  add_user(new_data);
  res.json({ message: "User deleted success" });
});

app.listen(process.env.PORT, () => {
  try {
    DBConnect(process.env.DB_URL);
    console.log(`Server is at PORT http://localhost:${process.env.PORT}`);
  } catch (error) {
    console.log(error);
  }
});
