module.exports = (sequelize, type) => {
    return sequelize.define('calificaciones', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoincrement: true
        },
        idSolicitud: type.INTEGER,
        idCalificante: type.INTEGER,
        idCalificado: type.INTEGER,
        comentario: {
            type: type.STRING,
            allowNull: true
        },
        calificacion: type.INTEGER
    })

}