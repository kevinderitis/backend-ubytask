const express =  require('express');
const app = express();
const morgan =  require('morgan');
const sql = require('mssql');


//Settings
app.set('port', process.env.PORT || 3977);

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Routes
app.use(require('./routes/index'));
app.use('/api/usuarios',require('./routes/usuarios'));
app.use('/api/categorias',require('./routes/categorias'));
app.use('/api/solicitudes', require('./routes/solicitudes'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/taskerCategorias', require('./routes/taskerCategorias'));

//Starting server
app.listen(app.get('port'), () =>{
console.log('Server on port');
});

