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

// GET product ID
router.get("/:id", async (req, res) => {

    const productid = req.params.id;
    logger.info(`GET --> /products/${productid}`);

    try {
        const product = await Product.findById(productid);
        if (!product){
            const response = Response.fail(`Product ${productid} not found.`);

            res.status(404).json(response);
        }else{
            const response = Response.success({data: product});

            res.json(response);
        }
    } catch (error) {
        const response = Response.fail(error.message);
        res.status(400).json(response);
    }
});

// PATCH product ID
router.patch("/:id", async (req, res) => {

    const productid = req.params.id;
    logger.info(`PATCH --> /products/${productid}`);

    try {
        const product = await Product.findByIdAndUpdate(productid, req.body, {new: true, runValidators: true});
        if (!product){
            const response = Response.fail(`Product ${productid} not found. No updates done.`);
            res.status(404).json(response);

        }else{
            const response = Response.success({data: product});
            res.json(response)
        }


    } catch (error) {
        const response = Response.fail(error.message);
        res.status(400).json(response);     
    }
});

// DELETE product ID
router.delete("/:id", async (req, res) => {

    const productid = req.params.id;
    logger.info(`DELETE --> /products/${productid}`);

    try {
        const product = await Product.findByIdAndDelete(productid);
        if (!product){
            const response = Response.fail(`Product ${productid} not found. No product removed.`);
            res.status(404).json(response);

        }else{
            const response = Response.success({data: product});
            res.json(response)
        }
        
    } catch (error) {
        const response = Response.fail(error.message);
        res.status(400).json(response);
    }
});

// SEARCH, SORT & FILTER
router.get("/", async(req, res) => {

    logger.info(`QUERY --> /products`);
    
    const filters = {};

    if(req.query.category){
        FinalizationRegistry.category = req.query.category;
    }

    const products = await Product.find(filters).sort(req.query.sort || 'name');

    if (!product){
        const response = Response.fail(`No products found.`);

        res.status(404).json(response);
    }else{
        const response = Response.success({data: product});

        res.json(response);
    }
});







export default router;