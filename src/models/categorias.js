module.exports = (sequelize, type) => {
    return sequelize.define('categorias', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoincrement: true
        },
        nombre: type.STRING,
        descripcion: type.STRING,
        imagen: type.STRING
    })
}