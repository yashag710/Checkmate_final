const OpenAI = require("openai")
// import express from "express";
const Patient = require('../models/patientModel');
const fs = require("fs");

require("dotenv").config();
// import path from "path";
// import { json } from "stream/consumers";

// Configuration for OpenAI and server
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o";
// const upload = multer({ dest: "uploads/" }); // Middleware to handle image uploads
// const app = express();
// const PORT = 3000;
const token = process.env.TOKEN;
// Initialize OpenAI client
const client = new OpenAI({ baseURL: endpoint, apiKey: token });

// Define the GET route
// app.get("/", (req, res) => {
//   res.send(`
//     <html>
//       <body>
//         <form action="/analyze" method="POST" enctype="multipart/form-data">
//           <input type="file" name="image" accept="image/*" required />
//           <button type="submit">Analyze Image</button>
//         </form>
//       </body>
//     </html>
//   `);
// });

// Define the POST route to handle the image analysis

exports.analysisCon = async(req, res)=>{
    try{
        const {userId} = req.body
        const foundUser = await Patient.findById(userId);
        const imagePath = foundUser.image;
        // const imageFormat = path.extname(req.file.originalname).slice(1); // Get file extension

    // Read and encode the image
    // const imageBuffer = fs.readFileSync(imagePath);
    // const imageBase64 = imageBuffer.toString("base64");
    // const imageDataUrl = ``;

    // Send image data to OpenAI
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant for analyzing images of human nails or faces." },
        { 
          role: "user", 
          content: [
            {
            type: "text",
            text: "If the image is of human nails or human face then analyse it thorougly and particularly include the causes and write only three point regarding the causes with the json key name as (causes), some information about the infection again only three points with the key name as (about) and include color, texture , shape and skin around the nail in case of face include skin coloration of the face and along with that analyze the facial emotional expressions also within a single key name as (info) abnormalities and along with that provide remedies to cure it with key name as remedy and be specific and to the point as aryudic expert. And if there is nothing serious or abnormal on the face or nails then dont try to provide unnecessary information. And also keep in mind that i dont want tripple backticks encoded response. I want simple json string."},
            {   type: "image_url", image_url: {
                url: imagePath, details: "low"}}
            ]
        }
      ],
      model: modelName,
    });

    // Cleanup uploaded file
    // fs.unlinkSync(imagePath);

    // Send OpenAI response back to the user
    res.send(`
      <h1>Image Analysis Result</h1>
      <pre>${response.choices[0].message.content}</pre>
      <a href="/">Analyze another image</a>
    `);
     console.log(response.choices[0].message.content);
    let analysisResult;
    let final_res;
    try {
      analysisResult = JSON.parse(response.choices[0].message.content);
      final_res = analysisResult["causes"];
    } catch (err) {
      console.error("Error parsing JSON:", err);
      analysisResult = { error: "Unable to parse response into JSON format" };
    }
    }
    catch(error){
        console.error("Error processing image:", error);
        return res.status(500).send("An error occurred while processing your request.");
    }
}
// app.post("/analyze", upload.single("image"), async (req, res) => {
//   try {
//     const imagePath = req.file.path;
//     const imageFormat = path.extname(req.file.originalname).slice(1); // Get file extension

//     // Read and encode the image
//     const imageBuffer = fs.readFileSync(imagePath);
//     const imageBase64 = imageBuffer.toString("base64");
//     const imageDataUrl = ``;

//     // Send image data to OpenAI
//     const response = await client.chat.completions.create({
//       messages: [
//         { role: "system", content: "You are a helpful assistant for analyzing images of human nails or faces." },
//         { 
//           role: "user", 
//           content: [
//             {
//             type: "text",
//             text: "If the image is of human nails or human face then analyse it thorougly and particularly include the causes and write only three point regarding the causes with the json key name as (causes), some information about the infection again only three points with the key name as (about) and include color, texture , shape and skin around the nail in case of face include skin coloration of the face and along with that analyze the facial emotional expressions also within a single key name as (info) abnormalities and along with that provide remedies to cure it with key name as remedy and be specific and to the point as aryudic expert. And if there is nothing serious or abnormal on the face or nails then dont try to provide unnecessary information. And also keep in mind that i dont want tripple backticks encoded response. I want simple json string."},
//             {   type: "image_url", image_url: {
//                 url: imageDataUrl, details: "low"}}
//             ]
//         }
//       ],
//       model: modelName,
//     });

//     // Cleanup uploaded file
//     fs.unlinkSync(imagePath);

//     // Send OpenAI response back to the user
//     res.send(`
//       <h1>Image Analysis Result</h1>
//       <pre>${response.choices[0].message.content}</pre>
//       <a href="/">Analyze another image</a>
//     `);
//      console.log(response.choices[0].message.content);
//     let analysisResult;
//     let final_res;
//     try {
//       analysisResult = JSON.parse(response.choices[0].message.content);
//       final_res = analysisResult["causes"];
//     } catch (err) {
//       console.error("Error parsing JSON:", err);
//       analysisResult = { error: "Unable to parse response into JSON format" };
//     }
//     console.log(final_res[0]);
//   } catch (error) {
//     console.error("Error processing image:", error);
//     res.status(500).send("An error occurred while processing your request.");
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(Server is running on http://localhost:${PORT});
// });
