const { Router } = require('express');
const router = Router();
const { categoria } = require('../database');
const { validarToken, validarRolTasker, validarRolCustomer, validarRolAdmin } = require('../controllers/authController');

router.get('/', validarToken, async (req, res) => {
    const categorias = await categoria.findAll();
    res.json(categorias);
});

router.post('/', validarToken, async (req, res) => {
    const newCategoria = req.body;
    const { nombre, descripcion, imagen } = req.body;
    if (nombre && imagen) {
        // const newCategoria = { ...req.body };
        const idCatProv = await categoria.max('id');
        var idCatDef
        if (!idCatProv) {
            idCatDef = 1;
        } else {
            idCatDef = idCatProv + 1;
        }
        newCategoria.id = idCatDef
        await categoria.create(newCategoria);
        res.json({ rc: 'Categoria cargada correctamente', categoriaCargada: newCategoria })
    } else {
        res.send({ "rc": 3, "msg": "Error al cargar las categorías, compruebe los datos." });
    }
});

router.delete('/:idCategoria', validarToken, async (req, res) => {
    const cat = req.params.idCategoria;
    if (cat) {
        await categoria.destroy({
            where: { id: cat }
        });
        res.json({ success: "Se eliminó la categoría" })
    } else {
        res.status(500).json({ "error": "Hubo un error al modificar la categoría" });
    }
})

module.exports = router