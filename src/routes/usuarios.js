const { Router } = require('express');
const router = Router();
const { user } = require('../database');
const { validarToken, validarRolAdmin } = require('../controllers/authController');


router.get('/', validarToken, validarRolAdmin, async (req, res) => {
    const usuarios = await user.findAll();
    res.json(usuarios);
});

router.post('/', validarToken, validarRolAdmin, async (req, res) => {
    const { nombre, apellido, mail, contraseña, rol } = req.body;
    if (nombre && apellido && mail && contraseña && rol) {
        const newUser = { ...req.body };
        try {
            const idUsuarioProv = await user.max('id');
            const idUsuarioDef = idUsuarioProv + 1;
            newUser.id = idUsuarioDef;
            const usuarios = await user.create(newUser);
        } catch (error) {
            console.log(error);
        }

        res.json(newUser);

    } else {
        res.status(500).json({ "error": "Hubo un error al cargar usuario" });
    }

});

router.delete('/:idUser', validarToken, validarRolAdmin, async (req, res) => {
    const idUsuario = req.params.idUser;
    if (idUsuario) {
        await user.destroy({
            where: { id: idUsuario }
        });
        res.json({ success: "Se ha eliminado el usuario." })
    } else {
        res.status(500).json({ "error": "Hubo un error al modificar el usuario" });
    }
});

router.put('/:idUser', validarToken, async (req, res) => {

    const idUsuario = req.params.idUser;
    const { nombre, apellido, mail, contraseña, rol } = req.body;

    if (nombre && apellido && mail && contraseña && rol) {
        await user.update(req.body, {
            where: { id: idUsuario }
        });
        res.json({ success: "Se ha modificado el usuario." })
    } else {
        res.status(500).json({ "error": "Hubo un error al modificar el usuario" });
    }


});

module.exports = router;