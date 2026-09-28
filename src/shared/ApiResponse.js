import logger from "../shared/logger";

export default class ApiResponse {
  
    constructor({ success = true, data = null, error = null }) {
        this.success = Boolean(success);
        this.result = data;
        this.error = error;
        this.timestamp = new Date().toISOString();
    }

    static success(data) {
        const response = new ApiResponse({ success: true, data });
        // console.log(data);
        logger.info(`API Success: ${JSON.stringify(data)}`);
        return response;
    }

    static fail(error) {
        const response = new ApiResponse({ success: false, error });
        logger.error(`API Error: ${error}`);
        return response;
    }
}