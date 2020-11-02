const { Router } = require('express');
const router = Router();
const { categoria } = require('../database');
const { validarToken, validarRolTasker, validarRolCustomer, validarRolAdmin } = require('../controllers/authController');

router.get('/', async (req, res) => {
    const categorias = await categoria.findAll();
    res.json(categorias);
});


module.exports =  router ;