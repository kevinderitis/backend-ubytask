const {Router} = require('express');
const router = Router();

router.get('/', (req, res) => {
    res.json({"Titulo": "Elke"});
    });



    module.exports = router;