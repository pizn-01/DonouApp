type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    data?: unknown;
}

const formatLog = (entry: LogEntry): string => {
    const { timestamp, level, message, data } = entry;
    const levelColors: Record<LogLevel, string> = {
        debug: '\x1b[36m', // Cyan
        info: '\x1b[32m',  // Green
        warn: '\x1b[33m',  // Yellow
        error: '\x1b[31m', // Red
    };
    const reset = '\x1b[0m';
    const color = levelColors[level];

    let output = `${color}[${timestamp}] [${level.toUpperCase()}]${reset} ${message}`;
    if (data) {
        output += `\n${JSON.stringify(data, null, 2)}`;
    }
    return output;
};

const createLogEntry = (level: LogLevel, message: string, data?: unknown): LogEntry => ({
    timestamp: new Date().toISOString(),
    level,
    message,
    data,
});

export const logger = {
    debug: (message: string, data?: unknown): void => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(formatLog(createLogEntry('debug', message, data)));
        }
    },

    info: (message: string, data?: unknown): void => {
        console.log(formatLog(createLogEntry('info', message, data)));
    },

    warn: (message: string, data?: unknown): void => {
        console.warn(formatLog(createLogEntry('warn', message, data)));
    },

    error: (message: string, data?: unknown): void => {
        console.error(formatLog(createLogEntry('error', message, data)));
    },
};
