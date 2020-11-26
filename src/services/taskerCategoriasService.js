const { taskerCategoria } = require('../database');


async function crearTaskerCategoria(newTaskerCategoria){
    try {
        const result = await taskerCategoria.create(newTaskerCategoria);
        return result;  
    } catch (error) {
        return error;
    }
    
}

async function getTaskerCategorias(){
    return await taskerCategoria.findAll();
}

async function getMaxId(){
   try {
    const id = await taskerCategoria.max('id');
    return id
       
   } catch (error) {
        return error 
   }      
}
async function getTaskerCategoriasById(id){
    return await taskerCategoria.findAll({
        where: {
            idTasker: id
          }
    });
}
// async function deleteTaskerCategoria(id){
//     try {
//        await taskerCategoria.destroy({
//            where: {
//                 id:id
//            }
//        });
//     } catch (error) {
        
//     }
// }
async function deleteTaskerCategoria(id){
    try {
       await taskerCategoria.update({estado:-1}, {
           where: {
                id:id
           }
       });
    } catch (error) {
        
    }
}

async function getTaskerCategoriasPostulados(){
    return await taskerCategoria.findAll({where: {estado: 0}});
}

async function habilitarPostulacion(idPostulacion){
    await taskerCategoria.update({estado:1}, {
        where: { id: idPostulacion }
    });
}

async function rehabilitarPostulacion(idCategoria, idTasker){
    await taskerCategoria.update({estado:0}, {
        where: { idTasker: idTasker, idCategoria: idCategoria }
    });
}

async function getTaskerById(idPostulacion){
    return await taskerCategoria.findOne({
        where: {
            id: idPostulacion
          }
    });
}

module.exports = {
    crearTaskerCategoria
    , getTaskerCategorias
    , getMaxId
    , getTaskerCategoriasById
    , deleteTaskerCategoria
    , getTaskerCategoriasPostulados
    , habilitarPostulacion
    , getTaskerById
    , rehabilitarPostulacion
};