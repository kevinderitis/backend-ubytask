module.exports = (sequelize, type) => {
    return sequelize.define('taskerCategorias', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoincrement: true
        },
        idTasker: type.INTEGER,
        idCategoria: type.INTEGER,
    })

}