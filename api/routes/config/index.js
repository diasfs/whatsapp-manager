import { Router } from 'express';
import { router as RolesRouter } from './roles.js';
import { router as HelpRouter } from './help.js';

export const router = Router();

router.use('/roles', RolesRouter);
router.use('/help', HelpRouter);

router.use((err, req, res, next) => {
    res.status(500).json({
        error: err.message
    });
});

export default router;