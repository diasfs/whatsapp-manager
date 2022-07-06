import { Router } from 'express';
import { Tag as TagModel } from '../models/index.js';

const router = new Router();

router.get('/', async (req, res) => {
    try {
        let tags = await TagModel.findAll({
            where: {
                UserId: req.userId
            }
        });

        res.json(tags);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});



export default router;