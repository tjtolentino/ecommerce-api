import { describe, test, expect, beforeAll, afterAll, spyOn } from "bun:test";
import express from "express";
import productsRouter from "../../src/router/products.js";
import Product from "../../src/models/Product.js";

describe("Products API HTTP Integration Unit Tests", () => {
    let app;
    let server;
    let baseUrl;
    let spies = [];

    beforeAll(async () => {
        app = express();
        app.use(express.json());

        // Root health check endpoint as defined in server.js
        app.get("/", (req, res) => {
            res.status(200).json({ message: "Welcome to e-Commerce API" });
        });

        // Mount products router
        app.use("/api/products", productsRouter);

        await new Promise((resolve) => {
            server = app.listen(0, () => {
                const port = server.address().port;
                baseUrl = `http://localhost:${port}`;
                resolve(null);
            });
        });
    });

    afterAll(async () => {
        spies.forEach((s) => s.mockRestore());
        spies = [];
        if (server) {
            await new Promise((resolve) => server.close(resolve));
        }
    });

    describe("GET /", () => {
        test("returns 200 with welcome message", async () => {
            const res = await fetch(`${baseUrl}/`);
            expect(res.status).toBe(200);

            const body = await res.json();
            expect(body.message).toBe("Welcome to e-Commerce API");
        });
    });

    describe("GET /api/products", () => {
        test("returns 200 and list of products with envelope", async () => {
            const mockList = [
                { _id: "1", name: "Laptop Stand", price: 34.99, stock: 15 }
            ];
            const spy = spyOn(Product, "find").mockResolvedValueOnce(/** @type {any} */(mockList));
            spies.push(spy);

            const res = await fetch(`${baseUrl}/api/products`);
            expect(res.status).toBe(200);

            const body = await res.json();
            expect(body.success).toBe(true);
            expect(body.result.count).toBe(1);
            expect(body.result.data).toEqual(mockList);
            expect(body.error).toBeNull();
        });

        test("returns 500 when database find fails", async () => {
            const spy = spyOn(Product, "find").mockRejectedValueOnce(new Error("Database disconnected"));
            spies.push(spy);

            const res = await fetch(`${baseUrl}/api/products`);
            expect(res.status).toBe(500);

            const body = await res.json();
            expect(body.success).toBe(false);
            expect(body.result).toBeNull();
            expect(body.error).toBe("Database disconnected");
        });
    });

    describe("POST /api/products", () => {
        test("returns 201 with created product payload", async () => {
            const newProduct = {
                name: "USB Hub",
                description: "4-port USB 3.0 Hub",
                price: 19.99,
                category: "Accessories",
                stock: 30
            };
            const created = { _id: "prod123", ...newProduct };
            const spy = spyOn(Product, "create").mockResolvedValueOnce(/** @type {any} */(created));
            spies.push(spy);

            const res = await fetch(`${baseUrl}/api/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct)
            });

            expect(res.status).toBe(201);
            const body = await res.json();
            expect(body.success).toBe(true);
            expect(body.result.data.name).toBe("USB Hub");
        });

        test("returns 400 when product creation fails validation", async () => {
            const spy = spyOn(Product, "create").mockRejectedValueOnce(new Error("Validation failed: name is required"));
            spies.push(spy);

            const res = await fetch(`${baseUrl}/api/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({})
            });

            expect(res.status).toBe(400);
            const body = await res.json();
            expect(body.success).toBe(false);
            expect(body.error).toContain("Validation failed");
        });
    });

    describe("GET /api/products/:id", () => {
        test("returns 200 when product is found", async () => {
            const product = { _id: "66f4b23c8a32d1e57c6b4920", name: "Mousepad", price: 14.99 };
            const spy = spyOn(Product, "findById").mockResolvedValueOnce(/** @type {any} */(product));
            spies.push(spy);

            const res = await fetch(`${baseUrl}/api/products/66f4b23c8a32d1e57c6b4920`);
            expect(res.status).toBe(200);

            const body = await res.json();
            expect(body.success).toBe(true);
            expect(body.result.data.name).toBe("Mousepad");
        });

        test("returns 404 when product is not found", async () => {
            const spy = spyOn(Product, "findById").mockResolvedValueOnce(null);
            spies.push(spy);

            const res = await fetch(`${baseUrl}/api/products/missing-id`);
            expect(res.status).toBe(404);

            const body = await res.json();
            expect(body.success).toBe(false);
            expect(body.error).toContain("not found");
        });

        test("returns 400 when findById encounters error", async () => {
            const spy = spyOn(Product, "findById").mockRejectedValueOnce(new Error("Invalid ID format"));
            spies.push(spy);

            const res = await fetch(`${baseUrl}/api/products/bad-id`);
            expect(res.status).toBe(400);

            const body = await res.json();
            expect(body.success).toBe(false);
            expect(body.error).toBe("Invalid ID format");
        });
    });

    describe("PATCH /api/products/:id", () => {
        test("returns 200 with updated product", async () => {
            const updated = { _id: "prod123", name: "Mousepad XL", price: 19.99 };
            const spy = spyOn(Product, "findByIdAndUpdate").mockResolvedValueOnce(/** @type {any} */(updated));
            spies.push(spy);

            const res = await fetch(`${baseUrl}/api/products/prod123`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ price: 19.99 })
            });

            expect(res.status).toBe(200);
            const body = await res.json();
            expect(body.success).toBe(true);
            expect(body.result.data.price).toBe(19.99);
        });

        test("returns 404 when product to update does not exist", async () => {
            const spy = spyOn(Product, "findByIdAndUpdate").mockResolvedValueOnce(null);
            spies.push(spy);

            const res = await fetch(`${baseUrl}/api/products/missing-id`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ price: 20 })
            });

            expect(res.status).toBe(404);
            const body = await res.json();
            expect(body.success).toBe(false);
        });

        test("returns 400 when update fails validation", async () => {
            const spy = spyOn(Product, "findByIdAndUpdate").mockRejectedValueOnce(new Error("Validation failed: price must be >= 0"));
            spies.push(spy);

            const res = await fetch(`${baseUrl}/api/products/prod123`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ price: -10 })
            });

            expect(res.status).toBe(400);
            const body = await res.json();
            expect(body.success).toBe(false);
            expect(body.error).toContain("Validation failed");
        });
    });

    describe("DELETE /api/products/:id", () => {
        test("returns 200 when product deleted successfully", async () => {
            const deleted = { _id: "prod123", name: "Mousepad" };
            const spy = spyOn(Product, "findByIdAndDelete").mockResolvedValueOnce(/** @type {any} */(deleted));
            spies.push(spy);

            const res = await fetch(`${baseUrl}/api/products/prod123`, {
                method: "DELETE"
            });

            expect(res.status).toBe(200);
            const body = await res.json();
            expect(body.success).toBe(true);
            expect(body.result.data.name).toBe("Mousepad");
        });

        test("returns 404 when product to delete is not found", async () => {
            const spy = spyOn(Product, "findByIdAndDelete").mockResolvedValueOnce(null);
            spies.push(spy);

            const res = await fetch(`${baseUrl}/api/products/missing-id`, {
                method: "DELETE"
            });

            expect(res.status).toBe(404);
            const body = await res.json();
            expect(body.success).toBe(false);
        });

        test("returns 400 when delete throws error", async () => {
            const spy = spyOn(Product, "findByIdAndDelete").mockRejectedValueOnce(new Error("Database error"));
            spies.push(spy);

            const res = await fetch(`${baseUrl}/api/products/error-id`, {
                method: "DELETE"
            });

            expect(res.status).toBe(400);
            const body = await res.json();
            expect(body.success).toBe(false);
            expect(body.error).toBe("Database error");
        });
    });
});
