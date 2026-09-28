import express from "express";
import cors from "cors";

import { connectDB } from "./config/db";
import { logger } from "./shared/logger";
import products from "./api/products";

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to e-Commerce API" });
});

app.use("/api/products", products);


// start the server

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});