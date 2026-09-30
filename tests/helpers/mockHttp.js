/**
 * Test helper utilities to construct mock Express Request and Response objects.
 */
export function createMockReq(options = {}) {
    return {
        body: {},
        params: {},
        query: {},
        headers: {},
        ...options
    };
}

export function createMockRes(initialStatusCode = 200) {
    const res = {
        statusCode: initialStatusCode,
        headersSent: false,
        sentBody: null,
        sentJson: null,
        sentFilePath: null,
        sendFileCallback: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        send(body) {
            this.sentBody = body;
            this.headersSent = true;
            return this;
        },
        json(data) {
            this.sentJson = data;
            this.headersSent = true;
            return this;
        },
        sendFile(filePath, callback) {
            this.sentFilePath = filePath;
            this.headersSent = true;
            if (callback) {
                this.sendFileCallback = callback;
            }
            return this;
        }
    };
    return res;
}
