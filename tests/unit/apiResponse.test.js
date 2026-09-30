import { describe, test, expect } from "bun:test";
import ApiResponse from "../../src/shared/ApiResponse.js";

describe("ApiResponse Unit Tests", () => {
    describe("Constructor", () => {
        test("creates default instance with expected initial values", () => {
            const response = new ApiResponse({});
            expect(response.success).toBe(true);
            expect(response.result).toBeNull();
            expect(response.error).toBeNull();
            expect(typeof response.timestamp).toBe("string");
            expect(new Date(response.timestamp).toString()).not.toBe("Invalid Date");
        });

        test("creates instance with custom arguments", () => {
            const customData = { id: 101, name: "Sample Item" };
            const response = new ApiResponse({
                success: false,
                data: customData,
                error: "Operation failed"
            });

            expect(response.success).toBe(false);
            expect(response.result).toEqual(customData);
            expect(response.error).toBe("Operation failed");
            expect(typeof response.timestamp).toBe("string");
        });
    });

    describe("ApiResponse.success", () => {
        test("returns envelope with success=true and result data", () => {
            const payload = { count: 1, data: [{ name: "Keyboard", price: 99 }] };
            const response = ApiResponse.success(payload);

            expect(response.success).toBe(true);
            expect(response.error).toBeNull();
            expect(response.result).toEqual(payload);
            expect(typeof response.timestamp).toBe("string");
        });

        test("handles null or undefined payload correctly", () => {
            const nullResponse = ApiResponse.success(null);
            expect(nullResponse.success).toBe(true);
            expect(nullResponse.result).toBeNull();
            expect(nullResponse.error).toBeNull();

            const undefResponse = ApiResponse.success(undefined);
            expect(undefResponse.success).toBe(true);
            expect(undefResponse.result).toBeNull();
            expect(undefResponse.error).toBeNull();
        });
    });

    describe("ApiResponse.fail", () => {
        test("returns envelope with success=false, null result, and error message", () => {
            const errorMessage = "Product 123 not found.";
            const response = ApiResponse.fail(errorMessage);

            expect(response.success).toBe(false);
            expect(response.result).toBeNull();
            expect(response.error).toBe(errorMessage);
            expect(typeof response.timestamp).toBe("string");
        });

        test("handles object error input", () => {
            const errorObj = { code: 400, details: "Invalid input" };
            const response = ApiResponse.fail(errorObj);

            expect(response.success).toBe(false);
            expect(response.result).toBeNull();
            expect(response.error).toEqual(errorObj);
        });
    });

    describe("Timestamp", () => {
        test("generates valid and recent ISO timestamp", () => {
            const before = Date.now();
            const response = ApiResponse.success("ok");
            const after = Date.now();
            const responseTime = new Date(response.timestamp).getTime();

            expect(responseTime).toBeGreaterThanOrEqual(before - 2000);
            expect(responseTime).toBeLessThanOrEqual(after + 2000);
            expect(response.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        });
    });
});
