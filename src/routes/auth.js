const { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
const { user } = require('../database');
const { validarToken, validarRolAdmin } = require('../controllers/authController');


// modificar para hacer registro directamente con los datos

router.post('/login', async (req, res) => {
    console.log(req.body.mail);
    const usuario = await user.findAll({
        where: { "mail": req.body.mail }
    });
    console.log(usuario);

    if (usuario == "") {
        res.json({ "rc": 1, "msg": "Datos incorrectos" });
    } else {

        jwt.sign({ usuario }, 'secretkey', (err, token) => {
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