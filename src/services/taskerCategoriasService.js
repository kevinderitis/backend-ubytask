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
async function deleteTaskerCategoria(id){
    try {
       await taskerCategoria.destroy({
           where: {
                id:id
           }
       });
    } catch (error) {
        
    }
    }


module.exports = {crearTaskerCategoria, getTaskerCategorias, getMaxId,getTaskerCategoriasById, deleteTaskerCategoria};