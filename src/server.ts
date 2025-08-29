import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

let server: Server;
const PORT = 3000;

async function lms(){
    try {
        await mongoose.connect("mongodb+srv://mongodb:mongodb@cluster0.bmesl.mongodb.net/Library-lms?retryWrites=true&w=majority&appName=Cluster0");
        console.log("Connected to MongoDB");
        server = app.listen(PORT, () => {
            console.log(`Server is running on PORT:${PORT}`);
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error)
    }
}
lms();