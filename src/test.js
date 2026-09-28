import { connectDB } from "./config/db";
import logger from "./shared/logger";
import mongoose from "mongoose";

await connectDB();
logger.info("test ok");
await mongoose.disconnect();