const { Router } = require('express');
const router = Router();
const fetch = require('node-fetch');
const { solicitud } = require('../database');

router.get('/', async (req, res) => {
    const solicitudes = await solicitud.findAll();
    res.json(solicitudes);
});

router.post('/', async (req, res) => {
    const { customer, categoria, ubicacion, descripcion } = req.body;
    if (customer && categoria && ubicacion && descripcion) {
        const newSolicitud = { ...req.body };
        try {
            const idSolProv = await solicitud.max('id');
            const idSolDef = idSolProv + 1;
            newSolicitud.id = idSolDef;
            const sol = await solicitud.create(newSolicitud);
        } catch (error) {
            console.log(error);
        }

        res.json(newSolicitud);
    } else {
        res.status(500).json({ "error": "Hubo un error al cargar la solicitud" });
    }
});

router.put('/:idSol', async (req, res) => {
    const idSol = req.params.idSol;
    const { customer, categoria, ubicacion, descripcion } = req.body;
    if (customer && categoria && ubicacion && descripcion) {
        await solicitud.update(req.body, {
            where: { id: idSol }
        });
        res.json({ success: "Se ha modificado solicitud." })
    } else {
        res.status(500).json({ "error": "Hubo un error al cargar la solicitud" });
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
        res.status(500).json({ "error": "Hubo un error al eliminar solicitud." })
    }
});

module.exports = router;