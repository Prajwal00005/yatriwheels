const mongoose = require("mongoose");


const connectdb = async()=>{

  try{
    if(!process.env.DATABASE_URL){
        throw new Error("Database url not defined");
    }
    
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("DB connected sucessfull");

  }catch(e){
    console.log("db connection error");
  }

}

module.exports = connectdb;