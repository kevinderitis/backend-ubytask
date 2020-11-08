const { Router } = require('express');
const router = Router();
const fetch = require('node-fetch');
const { solicitud } = require('../database');
const { validarToken, validarRolTasker, validarRolCustomer, validarRolAdmin } = require('../controllers/authController');
const {Op} = require('sequelize')
const { taskerCategoria } = require('../database');
const { categoria } = require('../database');

router.get('/', async (req, res) => {
    const solicitudes = await solicitud.findAll();
    res.json(solicitudes);
});

router.get('/solTasker/:idTasker', async (req, res) => {
    const idtask = req.params.idTasker;
    const solicitudes = await solicitud.findAll({
        where: { tasker: idtask }
    });
    res.json(solicitudes);
});

router.post('/', async (req, res) => {
    const { customer, categoria, descripcion, latitud, longitud } = req.body;
    if (customer && categoria && descripcion && latitud && longitud) {
        const newSolicitud = { ...req.body };
        try {
            const idSolProv = await solicitud.max('id');
            const idSolDef = idSolProv + 1;
            newSolicitud.id = idSolDef;
            newSolicitud.estado = 1;
            const sol = await solicitud.create(newSolicitud);
        } catch (error) {
            console.log(error);
        }
        
        res.json(newSolicitud);
    } else {
        res.send({ "rc": 3, "msg": "Error al cargar solicitud, compruebe los datos." });
        
    }
});

router.put('/:idSol', async (req, res) => {
    const idSol = req.params.idSol;
    const solicitudAModificar = solicitud.findAll({where:{id:idSol}})
    if (solicitudAModificar) {
        console.log(req.body.estado)
        await solicitud.update({estado:req.body.estado}, {
            where: { id: idSol }
        });
        await solicitud.update({tasker:req.body.idTasker}, {
            where: { id: idSol }
        })
        res.json({ success: "Se ha modificado solicitud." })
    } else {
        res.send({ "rc": 3, "msg": "Error al modificar solicitud, compruebe los datos." });
    }
});

router.put('/modificar/:idSol', async (req, res) => {
    const idSol = req.params.idSol;
    const solicitudAModificar = solicitud.findAll({where:{id:idSol}})
    if (solicitudAModificar) {
        console.log(req.body)
        await solicitud.update(
            {ubicacion:req.body.ubicacion
            ,latitud:req.body.latitud
            ,longitud:req.body.longitud
            ,descripcion:req.body.descripcion
            }, 
            {
            where: { id: idSol }}
        );
        res.json({ success: "Se ha modificado solicitud." })
    } else {
        res.send({ "rc": 3, "msg": "Error al modificar solicitud, compruebe los datos." });
    }
});

// Modificar para que cambie el estado de la solicitud a 3
router.delete('/:idSol', async (req, res) => {
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

///////////////////////////////////////////////////////////////////////

// Llega id de customer y devuelvo array con sus solicitudes con estado 1
router.get('/:idCustomer', async (req, res) => {
    const idCustomer = req.params.idCustomer;
    // const solicitudes = await solicitud.findAll({where: {customer: idCustomer} [and] {[estado.in]:[1,2]}})
    const solicitudes = await solicitud.findAll({where:{[Op.and]:[{customer:idCustomer},{[Op.or]:[{estado:1},{estado:2}]}]}})
    res.json(solicitudes);
});

// Me tiene que devolver las solicitudes con mis servicios
router.get('/solicitudesPendientes/:idTasker', async (req, res) => {
    const idTasker = req.params.idTasker;
    //busco el id del tasker en la tabla taskerCategorias, recibo las categorias del tasker
    //busco las solicitudes con estado 1 y de categoria igual a las que recibí recién
    const categoriasDelTasker = await taskerCategoria.findAll({where:{idTasker:idTasker}})
    // console.log(categoriasDelTasker)
    var solicitudesParaElTasker = []
    if(categoriasDelTasker.length > 0){
        for(let i = 0 ; i < categoriasDelTasker.length ; i++){
            let cat = await categoria.findAll({where:{id:categoriasDelTasker[i].idCategoria}})
            // console.log(cat)
            const soli = await solicitud.findAll({where:{[Op.and]:[{estado:1},{categoria:cat[0].nombre}]}})
            // console.log(soli[0])
            solicitudesParaElTasker.push(soli[0])
        }
        if(solicitudesParaElTasker.length > 0){
            res.json({rta:200,solicitudes:solicitudesParaElTasker})
        } else {
            res.json({rta:201,solicitudes:solicitudesParaElTasker})
        }
    } else {
        res.json({rta:'No hay categorias para este tasker'})
    }
});
router.get('/:mailCustomer', async (req, res) => {
    const mailCustomer = req.params.mailCustomer;
    // const solicitudes = await solicitud.findAll({where: {customer: idCustomer} [and] {[estado.in]:[1,2]}})
    const solicitudes = await solicitud.findAll({where:{[Op.and]:[{mailCustomer:mailCustomer},{[Op.or]:[{estado:1},{estado:2}]}]}})
    res.json(solicitudes);
});

module.exports = router;