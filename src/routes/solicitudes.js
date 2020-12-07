const { Router } = require('express');
const router = Router();
const fetch = require('node-fetch');
const { solicitud, taskerCategoria, categoria, user, Calificacion } = require('../database');
const { validarToken, validarRolTasker, validarRolCustomer, validarRolAdmin } = require('../controllers/authController');
const solicitudes = require('../models/solicitudes');
const { Op } = require("sequelize");
// const { substring } = require('sequelize/types/lib/operators');


router.get('/', validarToken, async (req, res) => {
    const solicitudes = await solicitud.findAll();
    res.json(solicitudes);
});

router.get('/solTasker/:idTasker', validarToken, async (req, res) => {
    const idtask = req.params.idTasker;
    const solicitudes = await solicitud.findAll({
        where: { tasker: idtask }
    });
    res.json(solicitudes);
});


router.get('/categorias/:id', validarToken, async (req, res) => {
    const idcategoria = req.params.id;
    let solicitudes = "";
    try {
        solicitudes = await solicitud.findAll({
            where: { categoria: idcategoria }
        });
    } catch (error) {
        res.send(error);
    }
    res.json(solicitudes);
});


router.post('/', validarToken, async (req, res) => {
    const { customer, categoria, descripcion, latitud, longitud, ubicacion } = req.body;
    if (customer && categoria && descripcion && latitud && longitud && ubicacion) {
        const newSolicitud = { ...req.body };
        try {
            const idSolProv = await solicitud.max('id');
            var idSolDef
            if (!idSolProv) {
                idSolDef = 1;
            } else {
                idSolDef = idSolProv + 1;
            }
            newSolicitud.id = idSolDef;
            newSolicitud.estado = 1;
            const sol = await solicitud.create(newSolicitud);
        } catch (error) {
            res.send(error);
        }

        res.json(newSolicitud);
    } else {
        res.send({ "rc": 3, "msg": "Error al cargar solicitud, compruebe los datos." });

    }
});

router.put('/estado/:idSol', validarToken, async (req, res) => {
    const idSol = req.params.idSol;
    const { estado } = req.body;


    const result = await solicitud.findAll({
        where: { id: idSol }
    });
    const estadoactual = result[0].estado;
    console.log(req.body)
    switch (estado) {

        case 2:
            if (estadoactual === 1 || estadoactual === 4) {
                try {
                    // await solicitud.update(req.body, {
                    await solicitud.update({ estado: req.body.estado }, {
                        where: { id: idSol }
                    });
                    await solicitud.update({ tasker: req.body.idTasker }, {
                        where: { id: idSol }
                    });
                    res.json({ success: "Se ha modificado solicitud." })
                } catch (error) {
                    res.json({ "rc": 3, "msg": "Error de conexion" })
                }
            } else {
                res.json({ "rc": "No se puede modificar el estado" })
            }

            break;
        case 3:
            if (estadoactual === 2) {
                try {
                    // await solicitud.update(req.body, {
                    await solicitud.update({ estado: req.body.estado }, {
                        where: { id: idSol }
                    });
                    res.json({ success: "Se ha modificado solicitud." })
                } catch (error) {
                    res.json({ "rc": 3, "msg": "Error de conexion" })
                }
            } else {
                res.json({ "rc": "No se puede modificar el estado" })
            }

            break;
        case 4:
            try {
                // await solicitud.update(req.body, {
                await solicitud.update({ estado: req.body.estado }, {
                    where: { id: idSol }
                });
                res.json({ success: "Se ha modificado solicitud." })
            } catch (error) {
                res.json({ "rc": 3, "msg": "Error de conexion" })
            }

            break;
        case 5:
            try {
                // await solicitud.update(req.body, {
                await solicitud.update({ estado: req.body.estado }, {
                    where: { id: idSol }
                });
                res.json({ success: "Se ha modificado solicitud." })
            } catch (error) {
                res.json({ "rc": 3, "msg": "Error de conexion" })
            }

            break;

        case 6:
            try {
                // await solicitud.update(req.body, {
                // await solicitud.update({estado:req.body.estado}, {
                await solicitud.update(
                    {
                        estado: req.body.estado,
                        motivoCancelacion: req.body.comentario,
                    },
                    { where: { id: idSol } });
                res.json({ success: "Se ha modificado solicitud." })
            } catch (error) {
                res.json({ "rc": 3, "msg": "Error de conexion" })
            }

            break;

        default:
            res.json({ "rc": "No se puede modificar el estado" })
            break;
    }
    // if (estado) {
    // try {
    //     await solicitud.update(req.body, {
    //         where: { id: idSol }
    //     });
    //     res.json({ success: "Se ha modificado solicitud." })
    // } catch (error) {
    //     res.json({ "rc": 3, "msg": "Error de conexion" })
    // }

    // } else {
    //     res.send({ "rc": 3, "msg": "Error al modificar solicitud, compruebe los datos." });
    // }
});

router.put('/modificar/:idSol', validarToken, async (req, res) => {
    const idSol = req.params.idSol;
    const solicitudAModificar = solicitud.findAll({ where: { id: idSol } })
    if (solicitudAModificar) {
        console.log(req.body)
        await solicitud.update(
            {
                ubicacion: req.body.ubicacion
                , latitud: req.body.latitud
                , longitud: req.body.longitud
                , descripcion: req.body.descripcion
            },
            {
                where: { id: idSol }
            }
        );
        res.json({ success: "Se ha modificado solicitud." })
    } else {
        res.send({ "rc": 3, "msg": "Error al modificar solicitud, compruebe los datos." });
    }
});



router.delete('/:idSol', validarToken, async (req, res) => {
    const idSol = req.params.idSol;
    if (idSol) {
        await solicitud.destroy({
            where: { id: idSol }
        });
        res.json({ success: "Se ha eliminado la solicitud" })
    } else {
        res.send({ "rc": 3, "msg": "Error al eliminar solicitud." });
    }
});

router.get('/:idCustomer', validarToken, async (req, res) => {
    const idCustomer = req.params.idCustomer;
    const solicitudes = await solicitud.findAll({ where: { customer: idCustomer } })
    res.json(solicitudes);
});

//  SOLITUDES EN ESTADO 1 2 y 3 : PENDIENTE , CON TASKER  y FINALIZADA 
router.get('/pendientes/:idCustomer', validarToken, async (req, res) => {
    const idCustomer = req.params.idCustomer;
    // const solicitudes = await solicitud.findAll({ where: { customer: idCustomer } })
    const solicitudes = await solicitud.findAll({ where: { [Op.and]: [{ estado: { [Op.in]: [1, 2, 3] } }, { customer: idCustomer }] } })
    if (solicitudes.length > 0) {
        for (let i = 0; i < solicitudes.length; i++) {
            // traeme el nombre y promedio del tasker de esta solicitud solicitudes[i]
            // siempre y cuando el tasker no sea null
            const idTasker = solicitudes[i].tasker
            const tasker = await user.findAll({ where: { id: idTasker } })
            var datosTasker = {}
            if (tasker.length > 0) {
                console.log(tasker)
                //guardar nombre y apellido en un objeto
                datosTasker.nombre = tasker[0].nombre + ' ' + tasker[0].apellido
                console.log(datosTasker)
                solicitudes[i].dataValues.nombreTasker = datosTasker.nombre
                //traer calificaciones, calcular promedio y guardar en el obj también
                datosTasker.prom = await damePromCalificacionesTasker(idTasker)
                solicitudes[i].dataValues.califTasker = datosTasker.prom
                console.log(datosTasker)
                console.log(solicitudes[i])
            }
        }
    }
    res.json(solicitudes);
});

router.get('/historicoCustomer/:idCustomer', validarToken, async (req, res) => {
    const idCustomer = req.params.idCustomer;
    const solicitudes = await solicitud.findAll({ where: { customer: idCustomer } })
    if (solicitudes.length > 0) {
        for (let i = 0; i < solicitudes.length; i++) {
            // traeme el nombre del tasker de esta solicitud solicitudes[i]
            // siempre y cuando el tasker no sea null
            const idTasker = solicitudes[i].tasker
            const tasker = await user.findAll({ where: { id: idTasker } })
            var datosTasker = {}
            if (tasker.length > 0) {
                console.log(tasker)
                //guardar nombre y apellido en un objeto
                datosTasker.nombre = tasker[0].nombre + ' ' + tasker[0].apellido
                console.log(datosTasker)
                solicitudes[i].dataValues.nombreTasker = datosTasker.nombre
                console.log(datosTasker)
                console.log(solicitudes[i])
            }
            // mejoro formato fecha creación y finalización
            const fecCr = solicitudes[i].dataValues.createdAt
            const fecFi = solicitudes[i].dataValues.updatedAt
            const fecCreacion = dameFecha(fecCr)
            const fecFinalizacion = dameFecha(fecFi)
            solicitudes[i].dataValues.fechaCreacion = fecCreacion
            solicitudes[i].dataValues.fechaFinalizacion = fecFinalizacion
        }
    }
    res.json(solicitudes);
});

function dameFecha(fecha) {
    var mesAux = fecha.getMonth()
    var mes = mesAux + 1
    var diaAux = fecha.getDate()
    var dia
    if (diaAux < 10) {
        dia = '0' + diaAux
    } else {
        dia = diaAux
    }
    var horaAux = fecha.getHours()
    var hora
    if (segsAux < 10) {
        let aux = horaAux
        hora = '0' + aux
    } else {
        hora = horaAux
    }
    var minutosAux = fecha.getMinutes()
    var minutos
    if (minutosAux < 10) {
        minutos = '0' + minutosAux
    } else {
        minutos = minutosAux
    }
    var segsAux = fecha.getSeconds()
    var segundos
    if (segsAux < 10) {
        segundos = '0' + segsAux
    } else {
        segundos = segsAux
    }
    const fechaFinal =
        dia + '/' + mes + '/' + fecha.getFullYear() + ' ' + hora + ':' + minutos + ':' + segundos
    return fechaFinal
}




// Me tiene que devolver las solicitudes con mis servicios
// Modificar para hacer una sola vez las consultas
router.get('/solicitudesPendientes/:idTasker', validarToken, async (req, res) => {
    const idTasker = req.params.idTasker;
    //busco el id del tasker en la tabla taskerCategorias, recibo las categorias del tasker
    //busco las solicitudes con estado 1 y de categoria igual a las que recibí recién
    const categoriasDelTasker = await taskerCategoria.findAll({ where: { idTasker: idTasker, estado: 1 } })
    // console.log(categoriasDelTasker)
    var solicitudesParaElTasker = []
    if (categoriasDelTasker.length > 0) {
        for (let i = 0; i < categoriasDelTasker.length; i++) {
            let cat = await categoria.findAll({ where: { id: categoriasDelTasker[i].idCategoria } })
            //console.log(cat)
            //busco mi id como customer para filtrarlo en las solicitudes
            let usuarioTasker = await user.findOne({ where: { id: idTasker } })
            // console.log(usuario.dataValues.mail)
            let usuarioCustomer = await user.findOne({ where: { mail: usuarioTasker.dataValues.mail } })
            // console.log(usuarioCustomer.dataValues.id)
            const soli = await solicitud.findAll({
                where: {
                    [Op.and]: [
                        { estado: 1 },
                        { categoria: cat[0].nombre },
                        { customer: { [Op.ne]: usuarioCustomer.dataValues.id } },
                    ]
                }
            })
            //console.log(soli)
            for (let j = 0; j < soli.length; j++) {
                if (soli[j] != null) solicitudesParaElTasker.push(soli[j])
            }

        }
        if (solicitudesParaElTasker.length > 0) {
            res.json({ rta: 200, solicitudes: solicitudesParaElTasker })
        } else {
            res.json({ rta: 201, solicitudes: solicitudesParaElTasker })
        }
    } else {
        res.json({ rta: 'No hay categorias para este tasker', solicitudes: solicitudesParaElTasker })
    }
});



router.get('/SoliEstado/:id', validarToken, async (req, res) => {
    const id = req.params.id;
    const solicitudes = await solicitud.findAll({ where: { id: id } })
    res.json({ estado: solicitudes[0].estado });
});




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