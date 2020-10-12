module.exports = (sequelize, type) => {
    return sequelize.define('solicitudes', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoincrement: true
        },
        categoria: type.STRING,
        descripcion: type.STRING,
        estado: type.INTEGER

    })

}