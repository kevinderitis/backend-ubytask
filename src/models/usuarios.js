module.exports = (sequelize, type) => {
    return sequelize.define('usuarios', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoincrement: true,
         
            
        },
        nombre: type.STRING,
        apellido: type.STRING,
        mail: type.STRING,
        contraseña: type.STRING,
        rol: type.INTEGER


    })

}