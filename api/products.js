import express from "express";
import Product from "../models/Product";
import Response from "../shared/ApiResponse";
import logger from "../shared/logger";

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {

    logger.info("GET --> /products");

    try {
        const products = await Product.find(req.body);
        const response = Response.success({count: products.length, data: products});

        res.status(200).json(response);
        
    } catch (error) {
        // @ts-ignore
        const response = Response.fail(error.message);
        res.status(500).json(response);
    }
});

// POST new product
router.post('/', async (req, res) => {

    logger.info("POST --> /products");

    try {
        const product = await Product.create(req.body);
        const response = Response.success({ data: product });

        res.status(201).json(response);

    } catch (error) {
        // @ts-ignore
        const response = Response.fail(error.message);

        res.status(400).json(response);
    }
});

export default router;