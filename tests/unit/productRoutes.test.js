import { describe, test, expect, spyOn, afterEach } from "bun:test";
import router from "../../src/router/products.js";
import Product from "../../src/models/Product.js";
import { createMockReq, createMockRes } from "../helpers/mockHttp.js";

function getHandler(method, path) {
    const layer = router.stack.find(
        (l) => l.route && l.route.path === path && l.route.methods[method.toLowerCase()]
    );
    if (!layer) throw new Error(`Handler not found for ${method} ${path}`);
    return layer.route.stack[0].handle;
}

describe("Product Routes Handler Unit Tests", () => {
    let spies = [];

    afterEach(() => {
        spies.forEach((s) => s.mockRestore());
        spies = [];
    });

    describe("GET / (get all products)", () => {
        const handler = getHandler("get", "/");

        test("returns 200 with product list and count on success", async () => {
            const mockProducts = [
                { _id: "1", name: "Mouse", price: 29.99, stock: 10 },
                { _id: "2", name: "Keyboard", price: 79.99, stock: 5 }
            ];
            const findSpy = spyOn(Product, "find").mockResolvedValueOnce(/** @type {any} */(mockProducts));
            spies.push(findSpy);

            const req = createMockReq();
            const res = createMockRes();

            await handler(req, res);

            expect(res.statusCode).toBe(200);
            expect(res.sentJson).toBeDefined();
            expect(res.sentJson.success).toBe(true);
            expect(res.sentJson.result.count).toBe(2);
            expect(res.sentJson.result.data).toEqual(mockProducts);
        });

        test("returns 500 when database find throws", async () => {
            const findSpy = spyOn(Product, "find").mockRejectedValueOnce(new Error("DB connection failure"));
            spies.push(findSpy);

            const req = createMockReq();
            const res = createMockRes();

            await handler(req, res);

            expect(res.statusCode).toBe(500);
            expect(res.sentJson.success).toBe(false);
            expect(res.sentJson.error).toBe("DB connection failure");
        });
    });

    describe("POST / (create new product)", () => {
        const handler = getHandler("post", "/");

        test("returns 201 with created product data on success", async () => {
            const newProductData = {
                name: "Webcam",
                description: "1080p HD Webcam",
                price: 49.99,
                category: "Electronics",
                stock: 15
            };
            const createdRecord = { _id: "66f4b23c8a32d1e57c6b4920", ...newProductData };
            const createSpy = spyOn(Product, "create").mockResolvedValueOnce(/** @type {any} */(createdRecord));
            spies.push(createSpy);

            const req = createMockReq({ body: newProductData });
            const res = createMockRes();

            await handler(req, res);

            expect(res.statusCode).toBe(201);
            expect(res.sentJson.success).toBe(true);
            expect(res.sentJson.result.data).toEqual(createdRecord);
        });

        test("returns 400 when validation or creation fails", async () => {
            const createSpy = spyOn(Product, "create").mockRejectedValueOnce(new Error("Product validation failed"));
            spies.push(createSpy);

            const req = createMockReq({ body: {} });
            const res = createMockRes();

            await handler(req, res);

            expect(res.statusCode).toBe(400);
            expect(res.sentJson.success).toBe(false);
            expect(res.sentJson.error).toBe("Product validation failed");
        });
    });

    describe("GET /:id (get single product)", () => {
        const handler = getHandler("get", "/:id");

        test("returns 200 with product data when found", async () => {
            const product = { _id: "item123", name: "Headphones", price: 59.99 };
            const findByIdSpy = spyOn(Product, "findById").mockResolvedValueOnce(/** @type {any} */(product));
            spies.push(findByIdSpy);

            const req = createMockReq({ params: { id: "item123" } });
            const res = createMockRes();

            await handler(req, res);

            expect(findByIdSpy).toHaveBeenCalledWith("item123");
            expect(res.sentJson.success).toBe(true);
            expect(res.sentJson.result.data).toEqual(product);
        });

        test("returns 404 when product is not found", async () => {
            const findByIdSpy = spyOn(Product, "findById").mockResolvedValueOnce(null);
            spies.push(findByIdSpy);

            const req = createMockReq({ params: { id: "nonexistent" } });
            const res = createMockRes();

            await handler(req, res);

            expect(res.statusCode).toBe(404);
            expect(res.sentJson.success).toBe(false);
            expect(res.sentJson.error).toContain("Product nonexistent not found");
        });

        test("returns 400 when findById throws CastError or other error", async () => {
            const findByIdSpy = spyOn(Product, "findById").mockRejectedValueOnce(new Error("Cast to ObjectId failed"));
            spies.push(findByIdSpy);

            const req = createMockReq({ params: { id: "invalid-id" } });
            const res = createMockRes();

            await handler(req, res);

            expect(res.statusCode).toBe(400);
            expect(res.sentJson.success).toBe(false);
            expect(res.sentJson.error).toBe("Cast to ObjectId failed");
        });
    });

    describe("PATCH /:id (update product)", () => {
        const handler = getHandler("patch", "/:id");

        test("returns 200 with updated product data when found", async () => {
            const updatedProduct = { _id: "item123", name: "Headphones Pro", price: 69.99 };
            const updateSpy = spyOn(Product, "findByIdAndUpdate").mockResolvedValueOnce(/** @type {any} */(updatedProduct));
            spies.push(updateSpy);

            const req = createMockReq({
                params: { id: "item123" },
                body: { price: 69.99 }
            });
            const res = createMockRes();

            await handler(req, res);

            expect(updateSpy).toHaveBeenCalledWith("item123", { price: 69.99 }, { new: true, runValidators: true });
            expect(res.sentJson.success).toBe(true);
            expect(res.sentJson.result.data).toEqual(updatedProduct);
        });

        test("returns 404 when product to update is not found", async () => {
            const updateSpy = spyOn(Product, "findByIdAndUpdate").mockResolvedValueOnce(null);
            spies.push(updateSpy);

            const req = createMockReq({ params: { id: "item999" }, body: { price: 10 } });
            const res = createMockRes();

            await handler(req, res);

            expect(res.statusCode).toBe(404);
            expect(res.sentJson.success).toBe(false);
            expect(res.sentJson.error).toContain("Product item999 not found. No updates done.");
        });

        test("returns 400 when findByIdAndUpdate throws validation error", async () => {
            const updateSpy = spyOn(Product, "findByIdAndUpdate").mockRejectedValueOnce(new Error("Validation error: price min 0"));
            spies.push(updateSpy);

            const req = createMockReq({ params: { id: "item123" }, body: { price: -5 } });
            const res = createMockRes();

            await handler(req, res);

            expect(res.statusCode).toBe(400);
            expect(res.sentJson.success).toBe(false);
            expect(res.sentJson.error).toBe("Validation error: price min 0");
        });
    });

    describe("DELETE /:id (delete product)", () => {
        const handler = getHandler("delete", "/:id");

        test("returns 200 with deleted product data when found", async () => {
            const deletedProduct = { _id: "item123", name: "Discontinued Mouse" };
            const deleteSpy = spyOn(Product, "findByIdAndDelete").mockResolvedValueOnce(/** @type {any} */(deletedProduct));
            spies.push(deleteSpy);

            const req = createMockReq({ params: { id: "item123" } });
            const res = createMockRes();

            await handler(req, res);

            expect(deleteSpy).toHaveBeenCalledWith("item123");
            expect(res.sentJson.success).toBe(true);
            expect(res.sentJson.result.data).toEqual(deletedProduct);
        });

        test("returns 404 when product to delete is not found", async () => {
            const deleteSpy = spyOn(Product, "findByIdAndDelete").mockResolvedValueOnce(null);
            spies.push(deleteSpy);

            const req = createMockReq({ params: { id: "item999" } });
            const res = createMockRes();

            await handler(req, res);

            expect(res.statusCode).toBe(404);
            expect(res.sentJson.success).toBe(false);
            expect(res.sentJson.error).toContain("Product item999 not found. No product removed.");
        });

        test("returns 400 when findByIdAndDelete throws error", async () => {
            const deleteSpy = spyOn(Product, "findByIdAndDelete").mockRejectedValueOnce(new Error("Invalid ID"));
            spies.push(deleteSpy);

            const req = createMockReq({ params: { id: "invalid-id" } });
            const res = createMockRes();

            await handler(req, res);

            expect(res.statusCode).toBe(400);
            expect(res.sentJson.success).toBe(false);
            expect(res.sentJson.error).toBe("Invalid ID");
        });
    });
});
