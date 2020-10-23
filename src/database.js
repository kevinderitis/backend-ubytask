const { Sequelize } = require('sequelize');
const userModel = require('./models/usuarios');
const solicitudes = require('./models/solicitudes');


const sequelize = new Sequelize('ubytask', 'sa', 'Vadigu2020DEV', {
  host: '200.73.130.147',
  dialect: 'mssql',
  port: '1414',
  dialectOptions: {
      options:{
        enableArithAbort: true
      }
     
  }
});

// const sequelize = new Sequelize('ubytask', 'ubytask', 'uby123', {
//   dialect: 'mssql',
//   host: 'localhost',
//   port: '1433',
//   dialectOptions: {
//     options: {
//       enableArithAbort: true
//     }
//   }
// })

const user = userModel(sequelize, Sequelize);
const solicitud = solicitudes(sequelize, Sequelize);
sequelize.sync({force: false})
.then(()=>{
  console.log('Tablas sincronizadas');
});



module.exports = {
  user,
  solicitud
};





