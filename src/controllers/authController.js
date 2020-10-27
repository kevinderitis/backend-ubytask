const jwt = require('jsonwebtoken');

function validarToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        // next();
    } else {
        res.sendStatus(403);
    }

    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            // res.json({
            //     message: 'Token validado',
            //     authData
            // });
            req.rol = authData.usuario[0].rol;
           
            next();
        }
    });

}

function  validarRolAdmin(req, res,next) {
if(req.rol === 1){
    next();
}else{
    res.sendStatus(400);
}

}

function  validarRolTasker(req, res,next) {
    if(req.rol === 2 || req.rol ===1){
        next();
    }else{
        res.sendStatus(400);
    }
    
    }

    function  validarRolCustomer(req, res,next) {
        if(req.rol === 3 || req.rol ===1){
            next();
        }else{
            res.sendStatus(400);
        }
        
        }

module.exports = {validarToken, validarRolAdmin, validarRolCustomer, validarRolTasker};