import { Router } from "express";
import { Help } from "../../models/Help.js";
import { Op } from 'sequelize';

export const router = Router();

router.get('/', async (req, res, next) => {
    try {
        let help = await Help.findAll({
            order: [
                ["name", "asc"]
            ]
        });
        res.json(help);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        let { id } = req.params;
        let help = await Help.findOne({
            where: {
                id
            }
        });
        if (!help) {
            return res.status(404).json({
                error: 'Help not found'
            });
        }
        res.json(help);
    } catch (err) {
        next(err);
    }
});

const save = async (req, res, next) => {
    try {
        let { name, text = '', id } = req.body;
        if (!name) {
            throw new Error("Nome inválido.");
        }
        if (!id) {
            id = req.params.id;
        }
        let help;
        let exists = await Help.findOne({
            where: {
                name,
                id: {
                    [Op.ne]: id + ''
                }
            }
        });
        if (exists) {
            throw new Error("Já um registro com este nome.");
        }
        if (!id) {
            help = await Help.create({
                name,
                text
            });
        } else {
            help = await Help.findOne({
                where: {
                    id
                }
            });
        }
        help.set({
            name,
            text
        });
        await help.save();
        res.json(help);
    } catch (err) {
        next(err);
    }
};
router.post('/', save);
router.put('/:id', save);


const remove = async (req, res, next) => {
    try {
        let { ids = [] } = req.body;
        if (0 === ids.length) {
            throw new Error("Lista de registros vazia");
        }

        await Help.destroy({
            where: {
                id: ids
            }
        });

        res.json({
            sucess: true
        });
    } catch (err) {
        next(err);
    }
};
router.delete('/', remove);
router.delete('/:id', async (req, res, next) => {
    req.body = { ids: [req.params.id] };
    remove(req, res, next);
});


router.use((err, req, res, next) => {
    res.status(500).json({
        error: err.message
    });
});

export default router;