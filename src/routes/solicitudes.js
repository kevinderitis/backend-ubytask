const { Router } = require('express');
const router = Router();
const fetch = require('node-fetch');
const { solicitud } = require('../database');


router.get('/', async (req, res) => {
    //const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    const solicitudes = await solicitud.findAll();
    res.json(solicitudes);
});



module.exports = router;