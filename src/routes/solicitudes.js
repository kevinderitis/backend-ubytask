const { Router } = require('express');
const router = Router();
const fetch = require('node-fetch');
const { solicitud } = require('../database');
const { validarToken, validarRolTasker, validarRolCustomer, validarRolAdmin } = require('../controllers/authController');
const solicitudes = require('../models/solicitudes');

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


router.get('/categorias/:id', async (req, res) => {
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

// agregar put para modificar estado
// validacion por si ya esta en estado activo o cancelado la solicitud
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
            res.send(error);
        }

        res.json(newSolicitud);
    } else {
        res.send({ "rc": 3, "msg": "Error al cargar solicitud, compruebe los datos." });

    }
});

router.put('/:idSol', async (req, res) => {
    const idSol = req.params.idSol;
    const { customer, categoria, descripcion, latitud, longitud, estado } = req.body;
    if (estado) {
        try {
            await solicitud.update(req.body, {
                where: { id: idSol }
            });
            res.json({ success: "Se ha modificado solicitud." })
        } catch (error) {
            res.json({ "rc": 3, "msg": "Error de conexion" })
        }

    } else {
        res.send({ "rc": 3, "msg": "Error al modificar solicitud, compruebe los datos." });
    }
});

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

module.exports = router;