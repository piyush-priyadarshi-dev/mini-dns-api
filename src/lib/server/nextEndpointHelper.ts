import cors from 'cors';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter, expressWrapper } from 'next-connect';

export const onError = (error: Error, req: NextApiRequest, res: NextApiResponse) => {
    console.error('API Error:', error);
    return res.status(500).json({ success: false, message: error.message });
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