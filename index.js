import express, {request, response} from 'express';
import 'dotenv/config';
import cors from 'cors';
import morgan from 'morgan'; //Logs en dev
import { mountSwaggerUI } from './app/middlewares/swagger.setup.js';
//Import de RUTAS
import devRoutes from './app/routes/dev.route.js';
import authRoutes from './app/routes/auth.route.js';

//Creo la aplicación Express
const app = express();

async function start(){
    mountSwaggerUI(app);

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    };    
    
    //Configuro la seguridad con el protocolo CORS
    app.use(cors());
    //Configuro la aplicación para que pueda recibir datos en formato JSON
    app.use(express.json());

    /*RUTAS*/
    app.use('/api/dev', devRoutes);
    app.use('/api/auth', authRoutes);
    
    app.all(/(.*)/, (req, res, next) => {
        next(new Error(`The route ${req.originalUrl} was not found on this server`, 404));
    });
    //--------------------------------------------------------------------------------------------

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

start().catch(err => {
    console.error(err);
    process.exit(1);
});