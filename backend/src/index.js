import "dotenv/config";
import express from "express"; 
import cors from "cors"; 
import { connectDB } from "./db/connection.js"; 

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

async function main() { 
    const app = express(); 
}

app.use(cors()); 
app.use(express.json()); 


//app.use("/api/"). **FIGURE OUT WHAT TO USE 

app.use(errorHandler); 

await connectDB(); 

app.listen(PORT, () => { 
    console.log("server running on http://localhost:${POST}"); 
}); 


main().catch((err) => { 
    console.error("Failed to start server:", err); 
    process.exit(1)
})