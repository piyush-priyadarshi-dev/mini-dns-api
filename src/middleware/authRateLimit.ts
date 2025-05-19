import { RateLimiterMemory } from 'rate-limiter-flexible';
import { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = process.env.API_KEY

const rateLimiter = new RateLimiterMemory({
    points: 30,
    duration: 60, // 1 minute
});

export function authAndRateLimit() {
    return async (req: NextApiRequest, res: NextApiResponse, next: any) => {
        const key = req.headers['x-api-key'];

        if (!key || key !== API_KEY) {
            return res.status(401).json({ message: 'Unauthorized: Invalid API key' });
        }

        try {
            await rateLimiter.consume(key.toString());
            return next();
        } catch {
            return res.status(429).json({ message: 'Too many requests — rate limit exceeded' });
        }
    };
}