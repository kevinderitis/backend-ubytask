const { direccion } = require('../database');


async function createAddress(newAddress){
    try {
        const result = await direccion.create(newAddress);
        return result;  
    } catch (error) {
        return error;
    }
    
}

async function updateAddress(updatedAddress){
    console.log('updatedAdd',updatedAddress);
    const result = await direccion.update(
        {
            idUsuario: updatedAddress.idUsuario,
            ubicacion: updatedAddress.ubicacion,
            latitud: updatedAddress.latitud,
            longitud: updatedAddress.longitud,
            estado: updatedAddress.estado
            
        },
        {
            where: { id: updatedAddress.id }
        }
    );
}

async function getAllAddress(){
    return await direccion.findAll();
}

async function getActiveAddress(idUsuario){
    const activeAddress = await direccion.findOne({
        where: {
          idUsuario: idUsuario,  
          estado: 1
        }
    });
    return activeAddress.dataValues;
}

async function getMaxId(){
   try {
    const id = await direccion.max('id');
    return id
       
   } catch (error) {
        return error 
   }      
}

async function disablePreviousAddress(idUsuario){
    const oldAddress = await getActiveAddress(idUsuario);
    if(oldAddress){
        oldAddress.estado = 0;
        await updateAddress(oldAddress);
    }
}


module.exports = {createAddress, getAllAddress, getMaxId, getActiveAddress,updateAddress, disablePreviousAddress};