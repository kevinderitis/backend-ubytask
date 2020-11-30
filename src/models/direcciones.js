module.exports = (sequelize, type) => {
    return sequelize.define('direcciones', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoincrement: true
        },
        idUsuario: type.INTEGER,
        ubicacion: type.STRING,
        latitud: type.STRING,
        longitud: type.STRING,
        estado: type.INTEGER,
    })

}