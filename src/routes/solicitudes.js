const { Router } = require('express');
const router = Router();
const fetch = require('node-fetch');
const { solicitud } = require('../database');
const { validarToken, validarRolTasker, validarRolCustomer, validarRolAdmin } = require('../controllers/authController');
const {Op} = require('sequelize')

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
router.get('/:mailCustomer', async (req, res) => {
    const mailCustomer = req.params.mailCustomer;
    // const solicitudes = await solicitud.findAll({where: {customer: idCustomer} [and] {[estado.in]:[1,2]}})
    const solicitudes = await solicitud.findAll({where:{[Op.and]:[{mailCustomer:mailCustomer},{[Op.or]:[{estado:1},{estado:2}]}]}})
    res.json(solicitudes);
});

module.exports = router;