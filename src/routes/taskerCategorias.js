const { Router } = require('express');
const router = Router();
const fetch = require('node-fetch');
const { taskerCategoria } = require('../database');
const { validarToken, validarRolTasker, validarRolCustomer, validarRolAdmin } = require('../controllers/authController');
const {Op} = require('sequelize')
// const { taskerCategorias } = require('../database');

router.get('/', async (req, res) => {
    const taskerCategorias = await taskerCategoria.findAll();
    res.json(taskerCategorias);
});

// router.get('/', async (req, res) => {
//     const taskerCategorias = await taskerCategorias.findAll();
//     res.json(taskerCategorias);
// });

// router.post('/', async (req, res) => {
//     const { customer, categoria, descripcion, latitud, longitud } = req.body;
//     if (customer && categoria && descripcion && latitud && longitud) {
//         const newSolicitud = { ...req.body };
//         try {
//             const idSolProv = await solicitud.max('id');
//             const idSolDef = idSolProv + 1;
//             newSolicitud.id = idSolDef;
//             newSolicitud.estado = 1;
//             const sol = await solicitud.create(newSolicitud);
//         } catch (error) {
//             console.log(error);
//         }
        
//         res.json(newSolicitud);
//     } else {
//         res.send({ "rc": 3, "msg": "Error al cargar solicitud, compruebe los datos." });
        
//     }
// });

// router.put('/:idSol', async (req, res) => {
//     const idSol = req.params.idSol;
//     const solicitudAModificar = solicitud.findAll({where:{id:idSol}})
//     if (solicitudAModificar) {
//         console.log(req.body.estado)
//         await solicitud.update({estado:req.body.estado}, {
//             where: { id: idSol }
//         });
//         res.json({ success: "Se ha modificado solicitud." })
//     } else {
//         res.send({ "rc": 3, "msg": "Error al modificar solicitud, compruebe los datos." });
//     }
// });

// router.put('/modificar/:idSol', async (req, res) => {
//     const idSol = req.params.idSol;
//     const solicitudAModificar = solicitud.findAll({where:{id:idSol}})
//     if (solicitudAModificar) {
//         console.log(req.body)
//         await solicitud.update(
//             {ubicacion:req.body.ubicacion
//             ,latitud:req.body.latitud
//             ,longitud:req.body.longitud
//             ,descripcion:req.body.descripcion
//             }, 
//             {
//             where: { id: idSol }}
//         );
//         res.json({ success: "Se ha modificado solicitud." })
//     } else {
//         res.send({ "rc": 3, "msg": "Error al modificar solicitud, compruebe los datos." });
//     }
// });

// Modificar para que cambie el estado de la solicitud a 3
// router.delete('/:idSol', async (req, res) => {
//     const idSol = req.params.idSol;
//     if (idSol) {
//         await solicitud.destroy({
//             where: { id: idSol }
//         });
//         res.json({ success: "Se ha eliminado la solicitud" })
//     } else {
//         res.send({ "rc": 3, "msg": "Error al eliminar solicitud." });
//     }
// });

module.exports = router;