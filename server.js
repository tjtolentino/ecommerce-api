import { products } from "./data/products.js";
import express from "express";
import { logger } from "./logger.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// -------------------------------------------------------------
//logging
app.use((req, res, next) => {
    // console.log(`[${req.method}] ${req.url}`);
    logger.info(`[${req.method}] ${req.url}`);
    next();
});


//root
app.get("/", (req, res) => {
    res.status(201).send("MSTCONNECT PH API is running");
});

//products
app.get("/api/products", (req, res) => {
    // res.send(JSON.stringify(products));
    res.status(201).json(products);
});

//find product id
app.get("/api/products/:id", (req, res) => {
    res.json(products.find(product => product.id === Number(req.params.id)));
});



// -------------------------------------------------------------



//404
app.use((req, res) => {
    logger.error("Route not found");

    res.status(404).json({
        message: "Route not found"
    });
});

app.listen(PORT, () => logger.info(`Server running on http://localhost:${PORT}`));