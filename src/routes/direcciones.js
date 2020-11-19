const { Router } = require('express');
const router = Router();
const fetch = require('node-fetch');
const { direccion } = require('../database');
const { validarToken, validarRolTasker, validarRolCustomer, validarRolAdmin } = require('../controllers/authController');
const {Op} = require('sequelize')
const direccionesService = require('../services/direccionesService');

router.get('/:idUsuario', async (req, res) => {
    console.log('iduser', req.params.idUsuario);
    const direcciones = await direccion.findAll({
        where: {
           idUsuario: req.params.idUsuario,
        }
    });
    console.log('direcciones',direcciones);
    res.json(direcciones);
});

router.post('/', async (req, res) => {
    const { idUsuario, ubicacion, longitud, latitud } = req.body;
    if (idUsuario && ubicacion && longitud && latitud) {
        const newAddress = { ...req.body };
        try {
            const addressMaxId = await direccionesService.getMaxId();
            const addressId = addressMaxId + 1;
            newAddress.id = addressId;
            const addresses = await direccion.create(newAddress);
             await direccionesService.disablePreviousAddress();
        } catch (error) {
            console.log(error);
        }

        res.json(newAddress);

    } else {
        res.status(500).json({ "error": "Hubo un error al cargar la direccion" });
    }

});

router.put('/:addressId',async (req, res) => {
   const addressId = req.params.addressId;
   const previousAdress = await direccion.findAll({ where: { id: addressId } });
   const ACTIVE = 1;
   if(previousAdress){
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
    await direccionesService.disablePreviousAddress();
    res.json({ success: "Se ha modificado solicitud." })
    } else {
    res.send({ "rc": 3, "msg": "Error al modificar la direccion, compruebe los datos." });
    }
});


module.exports = router;