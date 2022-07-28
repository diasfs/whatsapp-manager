import { Router } from 'express';
import { router as RolesRouter } from './roles.js';

export const router = Router();

router.use('/roles', RolesRouter);

router.use((err, req, res, next) => {
    res.status(500).json({
        error: err.message
    });
});

export default router;