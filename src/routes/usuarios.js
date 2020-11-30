const { Router } = require('express');
const router = Router();
const { user } = require('../database');
const { validarToken, validarRolAdmin } = require('../controllers/authController');
const taskerCategoriaService = require('../services/taskerCategoriasService');
const { Calificacion, categoria } = require('../database');
const { Op } = require("sequelize")

// router.get('/', validarToken, validarRolAdmin, async (req, res) => {
//     const usuarios = await user.findAll();
//     res.json(usuarios);
// });

router.get('/', async (req, res) => {
    const usuarios = await user.findAll();
    res.json(usuarios);
});

// COMENTARIO PARA EMA: Este era el anterior, el de ahora es el de abajo
// router.get('/postulaciones', async (req, res) => {
//     // const usuarios = await user.findAll();
//     const usuarios = await user.findAll({
//         where: { rol: 3 }
//     });
//     if(usuarios.length > 0){
//         res.json(usuarios);
//     } else {
//         res.json({rta: 'Actualmente no hay postulaciones'})
//     }
// });

router.get('/postulaciones', async (req, res) => {
    const postulaciones = await taskerCategoriaService.getTaskerCategoriasPostulados()
    const postulados = []
    var us, cat
    for (let i = 0; i < postulaciones.length; i++) {
        us = await user.findOne({ where: { id: postulaciones[i].dataValues.idTasker } })
        cat = await categoria.findOne({ where: { id: postulaciones[i].dataValues.idCategoria } })
        let idPost = postulaciones[i].dataValues.id
        if (us && cat) {
            let postulacion = {}
            postulacion.idPostulacion = idPost
            postulacion.idUsuario = us.id
            postulacion.nombre = us.nombre + ' ' + us.apellido
            postulacion.mail = us.mail
            postulacion.categoria = cat.nombre
            postulados.push(postulacion)
        }
    }
    console.log(postulados)
    if (postulados.length > 0) {
        res.json(postulados);
    } else {
        res.json({ rta: 'Actualmente no hay postulaciones' })
    }
});

// agregar get user por mail

router.get('/tasker/:mail', async (req, res) => {
    const usuarios = await user.findAll({
        where: { [Op.and]: [{ mail: req.params.mail }, { rol: { [Op.in]: [2, 3, 4] } }] }
    });
    if (usuarios.length > 0) {
        res.json(usuarios);
    } else {
        res.json({ rta: 'no es tasker' })
    }
});

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

router.post('/tasker', async (req, res) => {
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
                const idTaskerCategoriaMax = await taskerCategoriaService.getMaxId()
                let idTaskerCategoria
                if (!idTaskerCategoriaMax) {
                    idTaskerCategoria = 1
                } else {
                    idTaskerCategoria = idTaskerCategoriaMax + 1
                }
                newTaskerCategoria = {
                    id: idTaskerCategoria,
                    idTasker: newUser.id,
                    idCategoria: categoria,
                    estado: 0,
                }
                const result = await taskerCategoriaService.crearTaskerCategoria(newTaskerCategoria);
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
    const tasker = await user.findAll({ where: { mail: mailABuscar } })

    if (tasker.length > 0) {
        console.log(tasker)
        for (let i = 0; i < tasker.length; i++) {
            if (tasker[i].rol == 2) {
                res.json({ rta: true, idTasker: tasker[i].id })
            } else {
                if (tasker[i].rol == 3) {
                    res.json({ rta: true, idTasker: -1 })
                } else {
                    if (tasker[i].rol == 4) {
                        res.json({ rta: true, idTasker: -2 })
                    }
                }
            }

        }
        res.json({ rta: false });
        // res.json(tasker);
        // res.json({rta:true,idTasker:tasker[0].id});
    } else {
        // res.json({msj:'El mail no es de un tasker'})
        res.json({ rta: false, });
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

// COMENTARIO PARA EMA: Este era el anterior, el de ahora es el de abajo
// // router.put('/:idTasker', validarToken, async (req, res) => {
// router.put('/:idTasker', async (req, res) => {
//     const idTasker = req.params.idTasker;
//     if (idTasker) {
//         await user.update({rol:2}, {
//             where: { id: idTasker }
//         });
//         res.json({ success: "Se generó el alta del tasker" })
//     } else {
//         res.status(500).json({ "error": "Hubo un error al modificar el usuario" });
//     }
// })
router.put('/:idPostulacion', async (req, res) => {
    const idPostulacion = req.params.idPostulacion;
    if (idPostulacion) {
        // - reviso estado postulación (taskerCategorias): si es -1 no la habilito
        // - esto porque puede pasar que se confundan de nro de postulación
        //      y acepten una que no corresponde
        if (await taskerCategoriaService.getEstadoPostulacion(idPostulacion)) {
            await taskerCategoriaService.habilitarPostulacion(idPostulacion)
            const postulacion = await taskerCategoriaService.getTaskerById(idPostulacion)
            await user.update({ rol: 2 }, {
                where: { id: postulacion.idTasker }
            });
            res.json({ success: "Se generó el alta del tasker" })
        } else {
            res.json({ success: "El número de postulación es incorrecto" })
        }
    } else {
        res.status(500).json({ "error": "Hubo un error al modificar el usuario" });
    }
})

router.get('/datosTasker/:idTasker', async (req, res) => {
    const idTasker = req.params.idTasker
    const tasker = await user.findAll({ where: { id: idTasker } })
    var datosTasker = {}
    if (tasker.length > 0) {
        console.log(tasker)
        //guardar nombre y apellido en un objeto
        datosTasker.nombre = tasker[0].nombre + ' ' + tasker[0].apellido
        console.log(datosTasker)
        //traer calificaciones, calcular promedio y guardar en el obj también
        datosTasker.prom = await damePromCalificacionesTasker(idTasker)
        console.log(datosTasker)
        res.json({ datosTasker })
    }
    res.json({ datosTasker: {}, rta: 'Sin datos' });
})

module.exports = router;

async function damePromCalificacionesTasker(idTasker) {
    const calificaciones = await Calificacion.findAll({ where: { idCalificado: idTasker } })
    var sumaDeCalificaciones = 0
    for (let i = 0; i < calificaciones.length; i++) {
        sumaDeCalificaciones += calificaciones[i].calificacion
    }
    var prom = sumaDeCalificaciones / calificaciones.length
    return prom
}