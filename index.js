import express, {request, response} from 'express';
import 'dotenv/config';
import cors from 'cors';
import morgan from 'morgan';
//Import de RUTAS
import devRoutes from './app/routes/dev.route.js';

//Creo la aplicación Express
const app = express();
//Configuro la seguridad con el protocolo CORS
app.use(cors());
//Configuro la aplicación para que pueda recibir datos en formato JSON
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
};

//RUTAS
app.use('/api/dev', devRoutes);

app.all(/(.*)/, (req, res, next) => {
    next(new Error(`The route ${req.originalUrl} was not found on this server`, 404));
});
//--------------------------------------------------------------------------------------------

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})
