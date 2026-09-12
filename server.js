require("dotenv").config();




const express= require("express");
const cors= require("cors");

const db= require("./config/db")
const applicationRoutes=require("./routes/applicationRoutes");
const authRoutes=require("./routes/authRoutes");



const app= express();
app.use(cors());
app.use(express.json());

app.get("/", (req,res) => {
    res.json({message: "Job Application Tracker API is running!"});
});

app.use("/api/applications", applicationRoutes);
app.use("/api/auth", authRoutes);

const PORT= process.env.PORT || 5000;

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
})