import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { Errors } from './errorHandler';

type ValidationTarget = 'body' | 'query' | 'params';

/**
 * Middleware factory for request validation using Zod schemas
 */
export const validate = (
    schema: ZodSchema,
    target: ValidationTarget = 'body'
) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        try {
            const data = req[target];
            const validated = schema.parse(data);

            // Replace the request data with validated (and potentially transformed) data
            req[target] = validated;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const details = error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                }));
                next(Errors.validation(details));
            } else {
                next(error);
            }
        }
    };
};

/**
 * Validate multiple targets at once
 */
export const validateMultiple = (schemas: {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
}) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        const allDetails: { field: string; message: string }[] = [];

        for (const [target, schema] of Object.entries(schemas)) {
            if (!schema) continue;

            try {
                const data = req[target as ValidationTarget];
                const validated = schema.parse(data);
                req[target as ValidationTarget] = validated;
            } catch (error) {
                if (error instanceof ZodError) {
                    const details = error.issues.map((issue) => ({
                        field: `${target}.${issue.path.join('.')}`,
                        message: issue.message,
                    }));
                    allDetails.push(...details);
                }
            }
        }

        if (allDetails.length > 0) {
            next(Errors.validation(allDetails));
        } else {
            next();
        }
    };
};
