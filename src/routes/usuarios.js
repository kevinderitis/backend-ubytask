const { Router } = require('express');
const router = Router();
const { user } = require('../database');


router.get('/', async (req, res) => {
    const usuarios = await user.findAll();
    res.json(usuarios);
});

router.post('/', (req, res) => {
    const { nombre, apellido } = req.body;
    if (nombre && apellido) {
        const newUser = { ...req.body};
        const usuarios = user.create(newUser);
        res.json(usuarios);

    } else {
        res.status(500).json({ "error": "Hubo un error al cargar usuario" });
    }

});

router.delete('/:id', (req, res) => {
    const { } = req.params;
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, apellido } = req.body;

    if (nombre && apellido) {

    }


});

module.exports = router;