const { Router } = require('express');
const router = Router();
const fetch = require('node-fetch');
const { taskerCategoria } = require('../database');
const { user } =require('../database');
const { validarToken, validarRolTasker, validarRolCustomer, validarRolAdmin } = require('../controllers/authController');
const {Op} = require('sequelize')
const taskerCategoriaService = require('../services/taskerCategoriasService');
// const { taskerCategorias } = require('../database');

router.get('/', async (req, res) => {
    const taskerCategorias = await taskerCategoria.findAll();
    res.json(taskerCategorias);
});

router.get('/:mail', async (req, res) => {
    const usuarios = await user.findAll({
    //     where: { mail: req.params.mail,
    //               rol: 3          
    // }
    where: { [Op.and]: [ {mail: req.params.mail}, { rol: {[Op.in]: [2,3,4] }} ]}
    });
    if(usuarios.length > 0){
        console.log('usuariooooooooooooooo',usuarios[0].dataValues);
        const taskerCategorias = await taskerCategoria.findAll({
            where: {
                idTasker: usuarios[0].dataValues.id
              }
        });
        let taskerCategoriasIds = taskerCategorias.map(tc => tc.idCategoria);
        res.json(taskerCategoriasIds);
    }else {
        res.status(500).json({ "error": 'Verifique los datos'})
    }

  
});

router.post('/:idTasker',async(req,res) => {
try {
    const selectedCategories = req.body.selectedCategories;
    const taskerCategorias = await taskerCategoriaService.getTaskerCategoriasById(req.params.idTasker);
    console.log('taskercategorias',taskerCategorias);

    // DESHABILITO CATEGORIAS
    let deleteTaskerCategories = taskerCategorias.filter(categorie => {
        return !selectedCategories.includes(categorie.idCategoria);
    });
    console.log('NEWtASKERCATEGORIES',deleteTaskerCategories);
    for (let index = 0; index < deleteTaskerCategories.length; index++) {
        const tc = deleteTaskerCategories[index];
        await taskerCategoriaService.deleteTaskerCategoria(tc.dataValues.id);
    }
    // INSERTO CATEGORIAS
    let ids = taskerCategorias.map(a => a.idCategoria);
    let insertTaskerCategorias = selectedCategories.filter( selected => {
        return !ids.includes(selected);
    })
    console.log('insertCat', insertTaskerCategorias);
    let newTaskerCategoria = {};
    for (let index = 0; index < insertTaskerCategorias.length; index++) {
        const categoria = insertTaskerCategorias[index];
        newTaskerCategoria = {
            idTasker:req.params.idTasker,
            idCategoria:categoria,
            estado: 0,
        }
        newTaskerCategoria.id = await  taskerCategoriaService.getMaxId() +1
        const result =  await taskerCategoriaService.crearTaskerCategoria(newTaskerCategoria);
    }

    // HABILITO CATEGORIAS QUE ESTABAN DESHABILITADAS
    let taskerCategoriasDeshabilitadas = taskerCategorias.filter(postulacion => {return postulacion.estado == -1})
    let idsTaskerCategoriasDeshabilitadas = taskerCategoriasDeshabilitadas.map(a => a.idCategoria);
    let habilitarTaskerCategorias = selectedCategories.filter( selected => {
        return idsTaskerCategoriasDeshabilitadas.includes(selected);
    })
    console.log('habilitarTaskerCategorias', habilitarTaskerCategorias);
    for (let index = 0; index < habilitarTaskerCategorias.length; index++) {
        const categoria = habilitarTaskerCategorias[index];
        await taskerCategoriaService.rehabilitarPostulacion(categoria, req.params.idTasker);
    }

    const estadoDeMisCategorias = await taskerCategoriaService.getTaskerCategoriasById(req.params.idTasker);
    let habilitado
    for(let i = 0; i < estadoDeMisCategorias.length ; i++){
        if(estadoDeMisCategorias[i].estado == -1){
            habilitado = false
        } else {
            habilitado = true
        }
    }
    if(habilitado){
        await user.update({rol:4}, {
            where: { id: req.params.idTasker }
        });
    }
  
    res.json({ success: "Se han modificado las categorias a las que pertenece." })
} catch (error) {
    res.status(500).json({ "error": error});
}
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