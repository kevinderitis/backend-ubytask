const { Router } = require('express');
const router = Router();
const { user } = require('../database');
const { validarToken, validarRolAdmin } = require('../controllers/authController');
const taskerCategoriaService = require('../services/taskerCategoriasService');
const { Calificacion } = require('../database');

// router.get('/', validarToken, validarRolAdmin, async (req, res) => {
//     const usuarios = await user.findAll();
//     res.json(usuarios);
// });

router.get('/', async (req, res) => {
    const usuarios = await user.findAll();
    res.json(usuarios);
});

router.get('/postulaciones', async (req, res) => {
    // const usuarios = await user.findAll();
    const usuarios = await user.findAll({
        where: { rol: 3 }
    });
    if(usuarios.length > 0){
        res.json(usuarios);
    } else {
        res.json({rta: 'Actualmente no hay postulaciones'})
    }
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

// router.put('/:idUser', validarToken, async (req, res) => {

//     const idUsuario = req.params.idUser;
//     const { nombre, apellido, mail, contraseña, rol } = req.body;

//     if (nombre && apellido && mail && contraseña && rol) {
//         await user.update(req.body, {
//             where: { id: idUsuario }
//         });
//         res.json({ success: "Se ha modificado el usuario." })
//     } else {
//         res.status(500).json({ "error": "Hubo un error al modificar el usuario" });
//     }


// });

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

router.get('/:mailTasker', async (req, res) => {
    const mailABuscar = req.params.mailTasker
    const tasker = await user.findAll({where:{mail:mailABuscar}})
    
    if(tasker.length > 0){
        console.log(tasker)
        for(let i=0; i < tasker.length;i++){
            if(tasker[i].rol == 2){
               res.json({rta:true , idTasker:tasker[i].id})
            }else{
                if(tasker[i].rol == 3){
                    res.json({rta:true , idTasker:-1})
                }
            }

        }
        res.json({rta:false });
        // res.json(tasker);
       // res.json({rta:true,idTasker:tasker[0].id});
    } else {
        // res.json({msj:'El mail no es de un tasker'})
        res.json({rta:false, });
    }
});



// router.get('/:mailCustomer', async (req, res) => {
//     console.log(req.params.mailCustomer)
//     const mailABuscar = req.params.mailCustomer
//     const customer = await user.findAll({where:{mail:mailABuscar,rol:1}})
//     if(customer.length > 0){
//         // res.json(tasker);
//         res.json({rta:true,idCustomer:customer[0].id});
//     } else {
//         // res.json({msj:'El mail no es de un tasker'})
//         res.json({rta:false});
//     }
// });


// router.put('/:idTasker', validarToken, async (req, res) => {
router.put('/:idTasker', async (req, res) => {
    const idTasker = req.params.idTasker;
    if (idTasker) {
        await user.update({rol:2}, {
            where: { id: idTasker }
        });
        res.json({ success: "Se generó el alta del tasker" })
    } else {
        res.status(500).json({ "error": "Hubo un error al modificar el usuario" });
    }
})

router.get('/datosTasker/:idTasker', async (req, res) => {
    const idTasker = req.params.idTasker
    const tasker = await user.findAll({where:{id:idTasker}})
    var datosTasker = {}
    if(tasker.length > 0){
        console.log(tasker)
        //guardar nombre y apellido en un objeto
        datosTasker.nombre = tasker[0].nombre + ' ' + tasker[0].apellido
        console.log(datosTasker)
        //traer calificaciones, calcular promedio y guardar en el obj también
        datosTasker.prom = await damePromCalificacionesTasker(idTasker)
        console.log(datosTasker)
        res.json({datosTasker})
    }
    res.json({datosTasker: {}, rta: 'Sin datos' });
})

module.exports = router;

async function damePromCalificacionesTasker(idTasker){
    const calificaciones = await Calificacion.findAll({where:{idCalificado:idTasker}})
    var sumaDeCalificaciones = 0
    for(let i = 0 ; i < calificaciones.length ; i++){
        sumaDeCalificaciones += calificaciones[i].calificacion
    }
    var prom = sumaDeCalificaciones / calificaciones.length
    return prom
}