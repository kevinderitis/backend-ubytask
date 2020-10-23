const express =  require('express');
const app = express();
const morgan =  require('morgan');
const sql = require('mssql');


//Settings
app.set('port', process.env.port || 8080);

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Routes
app.use(require('./routes/index'));
app.use('/api/usuarios',require('./routes/usuarios'));
app.use('/api/solicitudes', require('./routes/solicitudes'));
app.use('/api/auth', require('./routes/auth'));

//Starting server
app.listen(app.get('port'), () =>{
console.log('Server on port 3000');
});

