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
    if(activeAddress){
        return activeAddress.dataValues;
    }
    return null;
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
    console.log('oldAdress',oldAddress);
    if(oldAddress){
        oldAddress.estado = 0;
        await updateAddress(oldAddress);
    }
}

async function getUserAdress(address){
    const existingAdress = await direccion.findAll({
        where:{
            idUsuario:address.idUsuario,
            ubicacion:address.ubicacion
        }
    })
    if(existingAdress.length > 0){
        return existingAdress;
    }
    return null;
}


module.exports = {createAddress, getAllAddress, getMaxId, getActiveAddress,updateAddress, disablePreviousAddress,getUserAdress};