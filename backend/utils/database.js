const mongoose = require("mongoose");

require("dotenv").config();


exports.dbConnect = async ()=>{
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(()=>{
        console.log("DB connection is successfull");
    }).catch((error)=>{
        console.log("DB connection has failed");
        console.error(error);
        process.exit(1);
    })
};