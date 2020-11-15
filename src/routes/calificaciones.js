const { Router } = require('express');
const router = Router();
const fetch = require('node-fetch');
const { calificacion } = require('../database');
// const { validarToken, validarRolTasker, validarRolCustomer, validarRolAdmin } = require('../controllers/authController');
const calificaciones = require('../models/calificaciones');
const { Op } = require("sequelize")


router.get('/', async (req, res) => {
    const calificaciones = await calificaciones.findAll();
    res.json(calificaciones);
});

router.post('/', async (req, res) => {
    const { idSolicitud, idCalificante, idCalificado, comentario } = req.body;
    if (idSolicitud && idCalificante && idCalificado) {
        const newCalificacion = { ...req.body };
        try {
            const idSolProv = await calificacion.max('id');
            var idSolDef
            if(!idSolProv){
                idSolDef = 1;
            } else {
                idSolDef = idSolProv + 1;
            }
            newCalificacion.id = idSolDef;
            newCalificacion.estado = 1;
            const cal = await calificacion.create(newCalificacion);
        } catch (error) {
            res.send(error);
        }

        res.json(newCalificacion);
    } else {
        res.send({ "rc": 3, "msg": "Error al cargar calificación, compruebe los datos." });

    }
});

module.exports = router;