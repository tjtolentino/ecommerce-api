// Global test setup for Bun unit tests
process.env.NODE_ENV = "test";
process.env.LOG_LEVEL = process.env.LOG_LEVEL || "silent";
process.env.PORT = process.env.PORT || "3001";
process.env.MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/test_ecommerce";
