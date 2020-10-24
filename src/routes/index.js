const {Router} = require('express');
const router = Router();

router.get('/', (req, res) => {
    res.json({"Bienvenida": "Bienvenidos a Ubytask"});
    });



    module.exports = router;