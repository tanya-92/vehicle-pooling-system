const app = require("./src/app");       //importing express app(routes and middleware)
const connectDB = require("./src/config/db");
require("dotenv").config();       //loading .env variables

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server running on port: ${PORT}`);
});

//without server.js nothing runs