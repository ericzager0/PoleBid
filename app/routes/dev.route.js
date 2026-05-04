//Routes - For debugging purposes only
import { Router } from "express";
import * as devController from "../controllers/dev.controller.js";

const router = Router();

router.get('/ping', devController.ping);
router.post('/supabase_dev', devController.supabaseDev);

export default router;