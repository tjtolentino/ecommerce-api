import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    // In development, format logs nicely; in production, keep raw JSON for performance
    transport: !isProduction
        ? {
            target: 'pino-pretty',
            options: { colorize: true }
        }
        : undefined
});
