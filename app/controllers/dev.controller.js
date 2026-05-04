//Controllers - For debugging purposes only
import * as devService from "../services/dev.service.js";
import { getPongMessage } from "../services/dev.service.js";

export const ping = (req, res) => {
    try {
        const message =  devService.getPongMessage();
        res.json({message});
    }catch (error) {
        res.status(500).json({message: 'An error occurred while processing the request.'});
    };
};

export const supabaseDev = async (req, res) => {
    try {
        console.log('Received request body:', req.body); 
        const name = req.body.name;
        
        if (!name) {
            return res.status(400).json({ message: 'Name is required in the request body.' });
        }

        // Si esto falla, el "await" lanza el error directamente al "catch"
        await devService.supabaseDev(name);

        res.status(201).json({ message: `Hello, ${name}! Data saved` });
    } catch (error) {
        // Capturamos el error para que la ruta no se quede pensando
        console.error('Error atrapado en el controller:', error.message);
        
        // Cerramos la petición devolviendo un error 500
        res.status(500).json({ 
            message: 'Hubo un error interno al guardar en Supabase', 
            error: error.message 
        });
    }
};