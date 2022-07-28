import { Router } from "express";
import { Role } from "../../models/Role.js";
import { Op } from 'sequelize';

export const router = Router();

router.get('/', async (req, res, next) => {
    try {
        let roles = await Role.findAll();
        res.json(roles);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        let { id } = req.params;
        let role = await Role.findOne({
            id
        });
        if (!role) {
            return res.status(404).json({
                error: 'Role not found'
            });
        }
        res.json(role);
    } catch (err) {
        next(err);
    }
});

const save = async (req, res, next) => {
    try {
        let { name, id } = req.body;
        if (!name) {
            throw new Error("Nome inválido.");
        }
        if (!id) {
            id = req.params.id;
        }
        let role;
        let exists = await Role.findOne({
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
            role = await Role.create({
                name
            });
        } else {
            role = await Role.findOne({
                where: {
                    id
                }
            });
        }
        role.set({
            name
        });
        await role.save();
        res.json(role);
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

        await Role.destroy({
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