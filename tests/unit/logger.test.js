import { describe, test, expect } from "bun:test";
import logger, { logger as namedLogger } from "../../src/shared/logger.js";

describe("Logger Unit Tests", () => {
    test("exports logger instance as both default and named export", () => {
        expect(logger).toBeDefined();
        expect(namedLogger).toBeDefined();
        expect(logger).toBe(namedLogger);
    });

    test("exposes all standard Pino logging methods", () => {
        expect(typeof logger.info).toBe("function");
        expect(typeof logger.error).toBe("function");
        expect(typeof logger.warn).toBe("function");
        expect(typeof logger.debug).toBe("function");
        expect(typeof logger.trace).toBe("function");
        expect(typeof logger.fatal).toBe("function");
    });

    test("executes logging methods without throwing", () => {
        expect(() => logger.info("Unit test info log")).not.toThrow();
        expect(() => logger.warn("Unit test warn log")).not.toThrow();
        expect(() => logger.error("Unit test error log")).not.toThrow();
        expect(() => logger.debug("Unit test debug log")).not.toThrow();
    });
});
