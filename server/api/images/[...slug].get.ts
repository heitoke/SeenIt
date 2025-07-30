import { createError } from 'h3';

export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, 'slug')

    try {
        const response = await fetch(`https://image.tmdb.org/${slug}`)
        
        if (!response.ok) {
            throw createError({
                statusCode: response.status,
                statusMessage: response.statusText
            });
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        let contentType = response.headers.get('content-type') || 'image/jpeg';
        
        setResponseHeaders(event, {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000000'
        });

        return buffer;
    } catch (error) {
        console.error('Proxy image error:', error);

        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch the image'
        });
    }

    // https://image.tmdb.org
});