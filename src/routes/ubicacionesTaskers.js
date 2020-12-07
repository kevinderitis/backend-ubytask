const { Router } = require('express');
const router = Router();
const fetch = require('node-fetch');
const { ubicacionTasker } = require('../database');
const { validarToken, validarRolTasker, validarRolCustomer, validarRolAdmin } = require('../controllers/authController');
// const solicitudes = require('../models/solicitudes');
// const { Op } = require("sequelize")


router.get('/', validarToken, async (req, res) => {
    const ubicacion = await ubicacionTasker.findAll();
    if (ubicacion.length > 0) {
        res.json(ubicacion);
    } else {
        res.json({ rta: 'No hay ubicación disponible' })
    }
});

router.get('/:idTasker', validarToken, async (req, res) => {
    const idtask = req.params.idTasker;
    const ubicacion = await ubicacionTasker.findOne({
        where: { idTasker: idtask }
    });
    if (ubicacion) {
        res.json(ubicacion);
    } else {
        res.json({ rta: 'No existe ubicación para el tasker indicado' })
    }
});

router.post('/', validarToken, async (req, res) => {
    const idtask = req.body.idTasker;
    const latitud = req.body.latitud;
    const longitud = req.body.longitud;

    const ubicacion = await ubicacionTasker.findOne({
        where: { idTasker: idtask }
    });

    const idUbicacionMax = await ubicacionTasker.max('id')
    let idUbicacion
    if (!idUbicacionMax) {
        idUbicacion = 1
    } else {
        idUbicacion = idUbicacionMax + 1
    }

    if (ubicacion) {
        await ubicacionTasker.update({ latitud: latitud, longitud: longitud },
            { where: { idTasker: idtask } });
        res.json({rta: 'Ubicación actualizada'});
    } else {
        newUbicacionTasker = {
            id: idUbicacion,
            idTasker: idtask,
            latitud: latitud,
            longitud: longitud,
        }
        const result = await ubicacionTasker.create(newUbicacionTasker);
        res.json({rta: 'Ubicación dada de alta'});
    }
});

module.exports = router;