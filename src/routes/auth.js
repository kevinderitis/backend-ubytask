const { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
const { user } = require('../database');

router.post('/login', async (req, res) => {
    const usuario = await user.findAll({
        where: { "nombre": req.body.nombre }
    });
    jwt.sign({ usuario }, 'secretkey', (err, token) => {
        res.json({
            token
        });
    });

});

router.get('/', validarToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
res.sendStatus(403);
        } else {
            res.json({ message: 'Token validado',
            authData 
        });
        }
    });
    
});

function validarToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}


module.exports = router;