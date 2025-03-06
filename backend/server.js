import express from "express";
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"
import storeRoutes from "./routes/storeRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import cors from "cors";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use("/api", authRoutes);
app.use("/api/store", storeRoutes)
app.use("/api/user", userRoutes)

const PORT = process.env.PORT || 5000;
app._router.stack.forEach((route) => {
    if (route.route) {
        console.log(`✅ Registered Route: ${route.route.path} [${Object.keys(route.route.methods).join(",").toUpperCase()}]`);
    }
});

app.listen(PORT, ()=>console.log(`Server Running on port ${PORT}`));