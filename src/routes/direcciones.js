const { Router } = require('express');
const router = Router();
const fetch = require('node-fetch');
const { direccion } = require('../database');
const { validarToken, validarRolTasker, validarRolCustomer, validarRolAdmin } = require('../controllers/authController');
const { Op } = require('sequelize')
const direccionesService = require('../services/direccionesService');

router.get('/:idUsuario', validarToken, async (req, res) => {
    console.log('iduser', req.params.idUsuario);
    const direcciones = await direccion.findAll({
        where: {
            idUsuario: req.params.idUsuario,
        }
    });
    console.log('direcciones', direcciones);
    res.json(direcciones);
});
router.get('/active/:idUsuario', validarToken, async (req, res) => {
    try {
        const tempDirection = await direccionesService.getActiveAddress(req.params.idUsuario)
        const direction = {
            latitude: parseFloat(tempDirection.latitud),
            longitude: parseFloat(tempDirection.longitud),
            address: tempDirection.ubicacion
        }
        res.json(direction);
    } catch (error) {
        res.status(500).json({ "error": "Hubo un error al buscar la direccion" });
    }

});
router.post('/', validarToken, async (req, res) => {
    const { idUsuario, ubicacion, longitud, latitud } = req.body;
    if (idUsuario && ubicacion && longitud && latitud) {
        const newAddress = { ...req.body };
        try {
            const existingAdress = await direccionesService.getUserAdress(newAddress);
            if (!existingAdress) {
                const addressMaxId = await direccionesService.getMaxId();
                let addressId
                if (!addressMaxId) {
                    addressId = 1
                } else {
                    addressId = addressMaxId + 1
                }
                newAddress.id = addressId;
                await direccionesService.disablePreviousAddress(idUsuario);
                const addresses = await direccion.create(newAddress);
            } else {
                console.log('existss', existingAdress);
                newAddress.id = existingAdress[0].dataValues.id;
                await direccionesService.disablePreviousAddress(idUsuario);
                await direccionesService.updateAddress(newAddress);
            }
        } catch (error) {
            console.log(error);
        }

        res.json(newAddress);

    } else {
        res.status(500).json({ "error": "Hubo un error al cargar la direccion" });
    }

});

router.put('/:addressId', validarToken, async (req, res) => {
    const addressId = req.params.addressId;
    const previousAdress = await direccion.findAll({ where: { id: addressId } });
    const ACTIVE = 1;

    if (previousAdress) {
        await direccionesService.disablePreviousAddress(req.body.idUsuario);
        await direccion.update(
            {
                idUsuario: req.body.idUsuario,
                ubicacion: req.body.ubicacion,
                latitud: req.body.latitud,
                longitud: req.body.longitud,
                estado: ACTIVE

            },
            {
                where: { id: addressId }
            }
        );
        res.json({ success: "Se ha modificado la direccion." })
    } else {
        res.send({ "rc": 3, "msg": "Error al modificar la direccion, compruebe los datos." });
    }
});


module.exports = router;