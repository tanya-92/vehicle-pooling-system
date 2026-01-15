const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());       //allows frontend and postman access backend
app.use(express.json());

// app.get("/api/test",(req,res)=>{
//     res.json({message: "Backend + MongoDB connected"});
// });
const testRoute = require("./routes/test.route");
app.use("/api", testRoute);


module.exports = app;