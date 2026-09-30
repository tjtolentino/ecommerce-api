import { describe, test, expect } from "bun:test";
import Product from "../../src/models/Product.js";

describe("Product Model Schema Unit Tests", () => {
    const validProductData = {
        name: "Mechanical Keyboard",
        description: "RGB backlight hot-swappable keyboard",
        price: 79.99,
        category: "Electronics",
        stock: 20
    };

    describe("Valid Product Creation", () => {
        test("validates successfully with all required fields", async () => {
            const product = new Product(validProductData);
            let error = null;

            try {
                await product.validate();
            } catch (err) {
                error = err;
            }

            expect(error).toBeNull();
            expect(product.name).toBe("Mechanical Keyboard");
            expect(product.price).toBe(79.99);
            expect(product.stock).toBe(20);
            expect(product.isAvailable).toBe(true);
        });
    });

    describe("Required Field Constraints", () => {
        test("fails validation if name is missing", async () => {
            const { name, ...dataWithoutName } = validProductData;
            const product = new Product(dataWithoutName);

            try {
                await product.validate();
                expect(true).toBe(false); // Should not reach here
            } catch (err) {
                expect(err.errors.name).toBeDefined();
                expect(err.errors.name.kind).toBe("required");
            }
        });

        test("fails validation if description is missing", async () => {
            const { description, ...dataWithoutDesc } = validProductData;
            const product = new Product(dataWithoutDesc);

            try {
                await product.validate();
                expect(true).toBe(false);
            } catch (err) {
                expect(err.errors.description).toBeDefined();
                expect(err.errors.description.kind).toBe("required");
            }
        });

        test("fails validation if price is missing", async () => {
            const { price, ...dataWithoutPrice } = validProductData;
            const product = new Product(dataWithoutPrice);

            try {
                await product.validate();
                expect(true).toBe(false);
            } catch (err) {
                expect(err.errors.price).toBeDefined();
                expect(err.errors.price.kind).toBe("required");
            }
        });

        test("fails validation if category is missing", async () => {
            const { category, ...dataWithoutCategory } = validProductData;
            const product = new Product(dataWithoutCategory);

            try {
                await product.validate();
                expect(true).toBe(false);
            } catch (err) {
                expect(err.errors.category).toBeDefined();
                expect(err.errors.category.kind).toBe("required");
            }
        });

        test("fails validation if stock is missing", async () => {
            const { stock, ...dataWithoutStock } = validProductData;
            const product = new Product(dataWithoutStock);

            try {
                await product.validate();
                expect(true).toBe(false);
            } catch (err) {
                expect(err.errors.stock).toBeDefined();
                expect(err.errors.stock.kind).toBe("required");
            }
        });
    });

    describe("Trimming Behaviors", () => {
        test("trims leading and trailing whitespace from name", async () => {
            const product = new Product({
                ...validProductData,
                name: "   Ergonomic Mouse   "
            });

            await product.validate();
            expect(product.name).toBe("Ergonomic Mouse");
        });

        test("trims leading and trailing whitespace from category", async () => {
            const product = new Product({
                ...validProductData,
                category: "   Peripherals   "
            });

            await product.validate();
            expect(product.category).toBe("Peripherals");
        });
    });

    describe("Numeric Validation and Limits", () => {
        test("fails validation when price is negative", async () => {
            const product = new Product({
                ...validProductData,
                price: -10.5
            });

            try {
                await product.validate();
                expect(true).toBe(false);
            } catch (err) {
                expect(err.errors.price).toBeDefined();
                expect(err.errors.price.kind).toBe("min");
            }
        });

        test("allows price of 0 (free product boundary)", async () => {
            const product = new Product({
                ...validProductData,
                price: 0
            });

            let error = null;
            try {
                await product.validate();
            } catch (err) {
                error = err;
            }

            expect(error).toBeNull();
            expect(product.price).toBe(0);
        });

        test("fails validation when stock is negative", async () => {
            const product = new Product({
                ...validProductData,
                stock: -1
            });

            try {
                await product.validate();
                expect(true).toBe(false);
            } catch (err) {
                expect(err.errors.stock).toBeDefined();
                expect(err.errors.stock.kind).toBe("min");
            }
        });

        test("allows stock of 0 (out of stock boundary)", async () => {
            const product = new Product({
                ...validProductData,
                stock: 0
            });

            let error = null;
            try {
                await product.validate();
            } catch (err) {
                error = err;
            }

            expect(error).toBeNull();
            expect(product.stock).toBe(0);
        });
    });

    describe("Default Values & Boolean Handling", () => {
        test("defaults isAvailable to true when omitted", () => {
            const product = new Product(validProductData);
            expect(product.isAvailable).toBe(true);
        });

        test("allows isAvailable to be set to false", async () => {
            const product = new Product({
                ...validProductData,
                isAvailable: false
            });

            await product.validate();
            expect(product.isAvailable).toBe(false);
        });
    });
});
