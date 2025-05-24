require("dotenv").config();
const mongoose=require("mongoose");
const {MONGO_DB_URL,MONGO_DB_NAME} = process.env;
 mongoose.connect(MONGO_DB_URL,{
    dbName:MONGO_DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
 
 })
 .then (()=>console.log("MongoDB connected"))
 .catch((err)=>console.log(err))


