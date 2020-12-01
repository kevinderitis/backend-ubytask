const jwt = require('jsonwebtoken');

function validarToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        // console.log(req.token)
        next();
    } else {
        res.sendStatus(403);
    }
    
    // jwt.verify(req.token, 'secretkey', (err, authData) => {
    //     if (err) {
    //         console.log('otra cosa')
    //         res.send({"rc":0, "msg": "token invalido"});
    //     } else {
    //         console.log('authData',authData)
    //         req.rol = authData.usuarios[0].rol;
           
    //         next();
    //     }
    // });
    // await next()

}

function  validarRolAdmin(req, res,next) {
if(req.token === 'tkn0101'){
    next();
}else{
    res.send({"rc": 1 , "msg": "No tiene permisos para acceder a estar ruta."});
}

}

function  validarRolTasker(req, res,next) {
    if(req.rol === 2 || req.rol ===1){
        next();
    }else{
        res.send({"rc": 1 , "msg": "No tiene permisos para acceder a estar ruta."});
    }
    
    }

    function  validarRolCustomer(req, res,next) {
        if(req.rol === 3 || req.rol ===1){
            next();
        }else{
            res.send({"rc": 1 , "msg": "No tiene permisos para acceder a estar ruta."});
        }
        
        }

    

module.exports = {validarToken, validarRolAdmin, validarRolCustomer, validarRolTasker};