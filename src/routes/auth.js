const { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
const { user } = require('../database');
const { validarToken, validarRolAdmin } = require('../controllers/authController');



router.post('/login', async (req, res) => {
    const usuario = await user.findAll({
        where: { "mail": req.body.mail }
    });

    if (usuario == "") {
        res.json({ "rc": 1, "msg": "Usuario inexistente" });
    } else {

        jwt.sign({ usuario }, 'secretkey', (err, token) => {
            res.json({
                token
            });
        });
    }


});

// Se agrega metodo post para loguear usuario con los datos que pasan de google. Los datos que deben enviar en el json son Nombre, apellido, mail y contraseña
// Devuelve un json con el id del nuevo user en caso de exito o en caso de error, el de conexion o porque el usuario ya exista
// router.post('/signin', async (req, res) => {
//     const { nombre, apellido, mail, contraseña } = req.body;
//     const nuevoUsuario = {}
//     const usuario = await user.findAll({
//         where: { "mail": req.body.mail }
//     });
//     const ultimoid = await user.max('id');

//     if (nombre && apellido && mail && contraseña && Object.entries(usuario).length === 0) {

//         nuevoUsuario.id = ultimoid + 1;
//         nuevoUsuario.nombre = nombre;
//         nuevoUsuario.apellido = apellido;
//         nuevoUsuario.mail = mail;
//         nuevoUsuario.contraseña = contraseña;
//         nuevoUsuario.rol = 1;
//         try {
//             await user.create(nuevoUsuario);
//             res.send({ "rc": 2, "msg": `Usuario creado id: ${nuevoUsuario.id}` });
//         } catch (error) {
//             res.send({ "rc": 1, "msg": "Error de conexion" });
//         }

//         res.send({ "rc": 4, "msg": "Compruebe los datos ingresados, puede que el usuario exista o falte alguno." })
//     }
// });

//PRUEBA EMA !

router.post('/signin', async (req, res) => {
    const { nombre, apellido, mail, contraseña } = req.body;
    var idCustomer = null
    var idTasker = null

    const nuevoUsuario = {}
    const usuarios = await user.findAll({
        where: { "mail": req.body.mail }
    });

    const ultimoid = await user.max('id');
    console.log(usuarios.length)

    var tk
    console.log('creo la variable', tk)
    if (usuarios.length === 0) {

        if(!ultimoid){
            nuevoUsuario.id = 1;
        } else {
            nuevoUsuario.id = ultimoid + 1;
        }
        nuevoUsuario.nombre = nombre;
        nuevoUsuario.apellido = apellido;
        nuevoUsuario.mail = mail;
        nuevoUsuario.contraseña = contraseña;
        nuevoUsuario.rol = 1;
        try {
            await user.create(nuevoUsuario);
            
            tk = await callJwt(nuevoUsuario)
            console.log('creando el usuario', tk)
            res.send( {idCustomer:nuevoUsuario.id, idTasker:idTasker, tokenUser: tk});
        } catch (error) {
            res.send({ "rc": 1, "msg": "Error de conexion" });
        }

        res.send({ "rc": 4, "msg": "Compruebe los datos ingresados, puede que el usuario exista o falte alguno." })
    }else{
        tk = await callJwt(usuarios)
        // jwt.sign({ usuarios }, 'secretkey', async function (err, token) {
        //     // res.json({
        //     //     token
        //     // });
        //     // console.log('imprimo token', token)
        //     tk = await token
        //     // console.log('imprimo tk', tk)
        //     // return token
        // });
        console.log('ya sali del jwt', tk)
        for(let i = 0; i < usuarios.length; i++){
            
            let rol = usuarios[i].rol
            console.log(rol)

            switch(rol){
                
                case 1:
                    try{
                        
                        idCustomer = usuarios[i].id
                        break;
                    }catch(error){
                        res.send({error})

                    }
                case 2:
                    try{
                        console.log("CASE 2 ")
                        idTasker = usuarios[i].id
                        break;
                    }catch(error){
                        res.send({error})

                    }
                case 3:
                    try{
                        console.log("CASE 3 ")
                        idTasker = -1
                        break;
                    }catch(error){
                        res.send({error})

                    }
                case 4:
                    try{
                        console.log("CASE 4 ")
                        idTasker = -2
                        break;
                    }catch(error){
                        res.send({error})

                    }
                    
                                   
            }  
          
           }

        res.send({idCustomer:idCustomer,idTasker:idTasker, tokenUser: tk})
        

       
    }
});

async function callJwt(usuarios){
    var tk = new Promise((resolve, reject) => {
        jwt.sign({ usuarios }, 'secretkey', (err, token) => {
            if (err) reject(err);
            else resolve(token)
            // res.json({
            //     token
            // });
            // console.log('imprimo token', token)
            // tk = await token
            // console.log('imprimo tk', tk)
            // return token
        });
    })
    console.log('retornando tk', tk)
    return tk
}

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