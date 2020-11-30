const { Router } = require('express');
const router = Router();
const fetch = require('node-fetch');
const { Calificacion } = require('../database');
// const { validarToken, validarRolTasker, validarRolCustomer, validarRolAdmin } = require('../controllers/authController');
const calificaciones = require('../models/calificaciones');
const { Op } = require("sequelize");
const { validarToken } = require('../controllers/authController');


router.get('/', validarToken, async (req, res) => {
    const calificaciones = await calificaciones.findAll();
    res.json(calificaciones);
});

router.post('/', validarToken, async (req, res) => {
    console.log(req.body)
    const { idSolicitud, idCalificante, idCalificado, comentario, calificacion } = req.body;
    if (idSolicitud && idCalificante && idCalificado && calificacion) {
        const newCalificacion = { ...req.body };
        try {
            const idSolProv = await Calificacion.max('id');
            var idSolDef
            if (!idSolProv) {
                idSolDef = 1;
            } else {
                idSolDef = idSolProv + 1;
            }
            newCalificacion.id = idSolDef;
            await Calificacion.create(newCalificacion);
        } catch (error) {
            res.send(error);
        }
        res.json(newCalificacion);
    } else {
        res.send({ "rc": 3, "msg": "Error al cargar la calificación, compruebe los datos." });

    }
});

module.exports = router;