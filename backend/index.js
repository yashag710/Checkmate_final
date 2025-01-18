// routes/authRoutes.js
const express = require("express");
// const fileUpload = require("express-fileupload");
const path = require('path');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const app = express();
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

require("dotenv").config();
const PORT = process.env.PORT || 5000
const userRoutes = require("./routes/authRoutes");
const uploadRoute = require("./routes/imageUpload");
const  {dbConnect} = require("./utils/database");
dbConnect();

app.use("/api/user",userRoutes);
app.use("/api/uploadImage",uploadRoute);

// app.use(
//     fileUpload({
//       useTempFiles: true, // Enable temporary file storage
//       tempFileDir: "/tmp/", // Directory for temporary files
//     })
// );

app.get("/", (req,res)=>{
    res.status(200).json({
        message: "Welcome to the API"
    })
});
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message
    });
});
app.listen(PORT, ()=>{
    console.log(`Server is running at Port no. ${PORT}`)
});
