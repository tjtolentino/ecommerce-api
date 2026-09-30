import { describe, test, expect, mock } from "bun:test";
import errorHandler from "../../src/middleware/errorHandler.js";
import { createMockReq, createMockRes } from "../helpers/mockHttp.js";

describe("errorHandler Middleware Unit Tests", () => {
    test("converts default status 200 to 500 and returns formatted message", () => {
        const req = createMockReq();
        const res = createMockRes(200);
        const next = mock(() => {});
        const err = new Error("Database crashed");

        errorHandler(err, req, res, next);

        expect(res.statusCode).toBe(500);
        expect(res.sentBody).toBe("Error 500: Database crashed");
        expect(next).not.toHaveBeenCalled();
    });

    test("preserves existing non-200 status code on response", () => {
        const req = createMockReq();
        const res = createMockRes(503);
        const next = mock(() => {});
        const err = new Error("Service Unavailable");

        errorHandler(err, req, res, next);

        expect(res.statusCode).toBe(503);
        expect(res.sentBody).toBe("Error 503: Service Unavailable");
    });

    test("falls back to 'Server error' if error has no message", () => {
        const req = createMockReq();
        const res = createMockRes(500);
        const next = mock(() => {});
        const err = {};

        errorHandler(err, req, res, next);

        expect(res.statusCode).toBe(500);
        expect(res.sentBody).toBe("Error 500: Server error");
    });

    test("handles Mongoose CastError by setting status 400 and message 'Invalid ID format'", () => {
        const req = createMockReq();
        const res = createMockRes(200);
        const next = mock(() => {});
        const castErr = new Error("Cast to ObjectId failed");
        castErr.name = "CastError";

        errorHandler(castErr, req, res, next);

        expect(res.statusCode).toBe(400);
        expect(res.sentBody).toBe("Error 400: Invalid ID format");
    });

    test("handles 404 status by sending 404.html template", () => {
        const req = createMockReq();
        const res = createMockRes(404);
        const next = mock(() => {});
        const err = new Error("Resource not found");

        errorHandler(err, req, res, next);

        expect(res.statusCode).toBe(404);
        expect(res.sentFilePath).toContain("404.html");
    });

    test("passes file sending errors to next() in 404 handler callback", () => {
        const req = createMockReq();
        const res = createMockRes(404);
        const next = mock(() => {});
        const err = new Error("Not found");

        errorHandler(err, req, res, next);

        expect(typeof res.sendFileCallback).toBe("function");

        const sendErr = new Error("Failed to read file");
        res.sendFileCallback(sendErr);

        expect(next).toHaveBeenCalledWith(sendErr);
    });
});
