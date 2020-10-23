const { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
const { user } = require('../database');
const { validarToken, validarRolAdmin } = require('../controllers/authController');

router.post('/login', async (req, res) => {
    const usuario = await user.findAll({
        where: { "nombre": req.body.nombre }
    });

    if (usuario == "") {
        res.sendStatus(403);
    } else {

        jwt.sign({ usuario }, 'secretkey' ,(err, token) => {
            res.json({
                token
            });
        });
    }


});

router.get('/', validarToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Token validado',
                authData
            });
        }
    });

});




module.exports = router;