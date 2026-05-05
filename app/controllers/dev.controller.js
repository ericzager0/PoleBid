//Controllers - For debugging purposes only
import * as devService from "../services/dev.service.js";
import catchAsync from "../utils/catchAsync.js";

export const ping = (req, res) => {
    try {
        const message =  devService.getPongMessage();
        res.json({message});
    }catch (error) {
        res.status(500).json({message: 'An error occurred while processing the request.'});
    };
};

export const supabaseDev = catchAsync(async(req, res) => {
    const name = req.body.name;
    
    if (!name) {
        return res.status(400).json({ message: 'Name is required in the request body.' });
    }

    await devService.supabaseDev(name);

    res.status(201).json({ message: `Hello, ${name}! Data saved` });
});