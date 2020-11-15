const { Router } = require('express');
const router = Router();
const { user } = require('../database');
const { validarToken, validarRolAdmin } = require('../controllers/authController');
const taskerCategoriaService = require('../services/taskerCategoriasService');

router.get('/', validarToken, validarRolAdmin, async (req, res) => {
    const usuarios = await user.findAll();
    res.json(usuarios);
});

// agregar get user por mail



router.post('/', validarToken, validarRolAdmin, async (req, res) => {
    const { nombre, apellido, mail, contraseña, rol } = req.body;
    if (nombre && apellido && mail && contraseña && rol) {
        const newUser = { ...req.body };
        try {
            const idUsuarioProv = await user.max('id');
            const idUsuarioDef = idUsuarioProv + 1;
            newUser.id = idUsuarioDef;
            const usuarios = await user.create(newUser);
        } catch (error) {
            console.log(error);
        }

        res.json(newUser);

    } else {
        res.status(500).json({ "error": "Hubo un error al cargar usuario" });
    }

});

router.post('/tasker', async (req,res) => {
    const { nombre, apellido, mail, rol, categorias, contraseña } = req.body;
    if (nombre && apellido && mail && rol && categorias) {
        const newUser = {
            nombre,
            apellido,
            mail,
            contraseña,
            rol
        }
        try {
            const idUsuarioProv = await user.max('id');
            const idUsuarioDef = idUsuarioProv + 1;
            newUser.id = idUsuarioDef;
            const usuarios = await user.create(newUser);
            let newTaskerCategoria = {};
            for (let index = 0; index < categorias.length; index++) {
                const categoria = categorias[index];
                newTaskerCategoria = {
                    idTasker:newUser.id,
                    idCategoria:categoria
                }
                newTaskerCategoria.id = await  taskerCategoriaService.getMaxId() +1
                const result =  await taskerCategoriaService.crearTaskerCategoria(newTaskerCategoria);
                    
            
            }
        } catch (error) {
            console.log(error);
        }

        res.json("El tasker fue creado con exito!");

    } else {
        res.status(500).json({ "error": "Hubo un error al cargar tasker" });
    }

});


router.delete('/:idUser', validarToken, validarRolAdmin, async (req, res) => {
    const idUsuario = req.params.idUser;
    if (idUsuario) {
        await user.destroy({
            where: { id: idUsuario }
        });
        res.json({ success: "Se ha eliminado el usuario." })
    } else {
        res.status(500).json({ "error": "Hubo un error al modificar el usuario" });
    }
});

router.put('/:idUser', validarToken, async (req, res) => {

    const idUsuario = req.params.idUser;
    const { nombre, apellido, mail, contraseña, rol } = req.body;

    if (nombre && apellido && mail && contraseña && rol) {
        await user.update(req.body, {
            where: { id: idUsuario }
        });
        res.json({ success: "Se ha modificado el usuario." })
    } else {
        res.status(500).json({ "error": "Hubo un error al modificar el usuario" });
    }


});

// ingresar como tasker (enviar confirmacion de que es tasker) pru

router.get('/ingresatasker/:iduser', async (req, res) => {
    const iduser = req.params.iduser;
    const usuario = await user.findAll({
        where: { "id": iduser }
    })

    if (Object.entries(usuario).length > 0 && (usuario.rol === 2 || usuario.rol === 3)) {
        res.json(usuario);
    } else {
        res.json({ "rc": 1, "msg": "No es tasker" });
    }
});

// router.get('/:mailTasker', async (req, res) => {
//     const mailABuscar = req.params.mailTasker
//     const tasker = await user.findAll({where:{mail:mailABuscar,rol:2}})
//     if(tasker.length > 0){
//         // res.json(tasker);
//         res.json({rta:true,idTasker:tasker[0].id});
//     } else {
//         // res.json({msj:'El mail no es de un tasker'})
//         res.json({rta:false});
//     }
// });



router.get('/:mailCustomer', async (req, res) => {
    console.log(req.params.mailCustomer)
    const mailABuscar = req.params.mailCustomer
    const customer = await user.findAll({where:{mail:mailABuscar,rol:1}})
    if(customer.length > 0){
        // res.json(tasker);
        res.json({rta:true,idCustomer:customer[0].id});
    } else {
        // res.json({msj:'El mail no es de un tasker'})
        res.json({rta:false, });
    }
});








module.exports = router;