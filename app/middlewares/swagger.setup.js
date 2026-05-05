import fs from 'fs';
import path from 'path';
import swaggerUI from 'swagger-ui-express';

export const mountSwaggerUI = (app) => {
    try {
        const swaggerPath = path.resolve(process.cwd(), 'swagger.json');
        
        if (fs.existsSync(swaggerPath)) {
            const swaggerFile = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));

            app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerFile));
            console.log('[Swagger] Documentation ready at /doc');
        } else {
            console.warn('[Swagger] swagger.json not found. Run "npm run swagger" to generate it.');
        }
    } catch (error) {
        console.error(`[Swagger] Failed to load documentation artifact: ${error.message}`);
    }
};