const joi= require("joi");
//Both RegisterDTO and LogInDTO are Joi schema objects.
// eg Let’s say a user sends this data during registration:
// You would use RegisterDTO to validate this data:
// {
//     "name": "Neha",
//     "email": "neha@gmail.com",
//     "password": "mypassword",
//     "confirmPassword": "mypassword"
//   }
  
const RegisterDTO=joi.object({
name:joi.string().min(3).required(),
email:joi.string().required(),
image:joi.string(),
password:joi.string().min(6).required(),
confirmPassword:joi.string().valid(joi.ref("password")).required(),
})
const LogInDTO=joi.object({
email:joi.string().required(),
password:joi.string().min(6).required(),


 })
 module.exports={RegisterDTO,LogInDTO}