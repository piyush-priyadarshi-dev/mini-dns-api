import cors from 'cors';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter, expressWrapper } from 'next-connect';
import { sanitizeDBError } from '../common/errors/dbErrorSanitizer';
import { logger } from '../common/logger';


export const onError = (
    err: unknown,
    req: NextApiRequest,
    res: NextApiResponse
) => {
    const isDev = process.env.ENVIRONMENT !== "production";
    const error = err instanceof Error ? err : new Error("Unexpected error");

    const { isDbError, message: sanitizedMessage } = sanitizeDBError(error);

    logger.error("API ERROR", {
        method: req.method,
        url: req.url,
        message: error.message,
        code: (error as any)?.code,
        isDbError,
        stack: error.stack,
    });

    res.status(500).json({
        success: false,
        message: isDev ? error.message : sanitizedMessage,
    });
};

export const onMethodNotSupported = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
};

export interface ApiRequest<
    T extends {
        body?: unknown;
        query?: Record<string, string | string[] | number>;
    } = {}
> extends Omit<NextApiRequest, 'body' | 'query'> {
    body: T['body'];
    query: T['query'];
}

export type ApiResponse<T> = NextApiResponse<T | { message: string }>;

export const createEndpoint = () => {
    const router = createRouter<NextApiRequest, NextApiResponse>();

    const corsOptions = {
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    };

    router.use(expressWrapper(cors(corsOptions)));

    return router;
};

export const endpointsWrapper = (endpoints: any) => {
    return endpoints.handler({
        onError,
        onNoMatch: onMethodNotSupported,
    });
};