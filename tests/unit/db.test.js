import { describe, test, expect, spyOn } from "bun:test";
import mongoose from "mongoose";
import { connectDB } from "../../src/config/db.js";
import logger from "../../src/shared/logger.js";

describe("Database Configuration (connectDB) Unit Tests", () => {
    test("successfully connects to MongoDB with env URI and logs success", async () => {
        const connectSpy = spyOn(mongoose, "connect").mockResolvedValueOnce(/** @type {any} */({}));
        const loggerInfoSpy = spyOn(logger, "info").mockImplementation(() => {});

        try {
            await connectDB();
            expect(connectSpy).toHaveBeenCalledWith(process.env.MONGODB_URI);
            expect(loggerInfoSpy).toHaveBeenCalledWith("MongoDB connected sucessfully");
        } finally {
            connectSpy.mockRestore();
            loggerInfoSpy.mockRestore();
        }
    });

    test("catches error and logs failure when mongoose.connect fails", async () => {
        const errorMsg = "Authentication failed";
        const connectSpy = spyOn(mongoose, "connect").mockRejectedValueOnce(new Error(errorMsg));
        const loggerErrorSpy = spyOn(logger, "error").mockImplementation(() => {});

        try {
            await connectDB();
            expect(connectSpy).toHaveBeenCalled();
            expect(loggerErrorSpy).toHaveBeenCalledWith(`MongoDB error: ${errorMsg}`);
        } finally {
            connectSpy.mockRestore();
            loggerErrorSpy.mockRestore();
        }
    });
});
