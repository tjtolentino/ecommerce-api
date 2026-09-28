import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
        targets: [
            // 1. Output to console (optionally with pino-pretty for readable dev logs)
            {
                target: 'pino-pretty',
                options: {
                    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
                    ignore: 'pid,hostname',
                    colorize: true
                },
                level: 'info'
            },
            // 2. Output to file as structured JSON
            {
                target: 'pino/file',
                options: {
                    destination: './logs/app.log',
                    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
                    ignore: 'pid,hostname',
                    mkdir: true // Automatically creates directory if it doesn't exist
                },
                level: 'info'
            }
        ]
    }
});
 
export default logger;
