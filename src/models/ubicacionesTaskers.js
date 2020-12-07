module.exports = (sequelize, type) => {
    return sequelize.define('ubicacionesTaskers', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoincrement: true
        },
        idTasker: type.INTEGER,
        latitud: type.STRING,
        longitud: type.STRING,
    })

}