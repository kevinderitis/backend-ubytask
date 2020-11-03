module.exports = (sequelize, type) => {
    return sequelize.define('estados', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoincrement: true
        },
        nombre: type.STRING

    })

}