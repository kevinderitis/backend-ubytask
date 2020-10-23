module.exports = (sequelize, type) => {
    return sequelize.define('solicitudes', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoincrement: true
        },
        customer: type.INTEGER,
        categoria: type.STRING,
        ubicacion: type.STRING,
        descripcion: type.STRING,
        estado: type.INTEGER,
        tasker: type.INTEGER

    })

}