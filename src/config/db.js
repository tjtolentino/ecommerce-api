import mongoose from "mongoose";
import logger from "../shared/logger";

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        logger.info("MongoDB connected sucessfully");

    } catch (error) {
        logger.error(`MongoDB error: ${error.message}`);
        //process.exit(1);
    }
}


// export default connectDB;