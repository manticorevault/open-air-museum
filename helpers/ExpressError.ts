class ExpressError extends Error {
    statusCode: any;
    constructor(message: string, statusCode: any) {
        super();

        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;