const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());       //allows frontend and postman access backend
app.use(express.json());

// app.get("/api/test",(req,res)=>{
//     res.json({message: "Backend + MongoDB connected"});
// });
const authRoute = require("./routes/auth.route");
const rideRoute = require("./routes/ride.route");

app.use("/api/auth", authRoute);
app.use("/api/rides", rideRoute);


module.exports = app;