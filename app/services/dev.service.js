//Services - For debugging purposes only
import AppError from "../utils/appError.js";
import * as devRepository from "../repositories/dev.repository.js";

export const getPongMessage = () => {
    return 'Pong!';
};

export const supabaseDev = async(name) => {
    const {error} = await devRepository.addPong(name);
    if (error) {
        throw new AppError('Failed to save data to Supabase', 401);
    };
};