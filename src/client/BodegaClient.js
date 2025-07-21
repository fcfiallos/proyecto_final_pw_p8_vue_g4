import axios from "axios";

const API_URL_BODEGAS = "http://localhost:8081/api/inventario/v1/bodegas";

const consultarPorCodigo = async (codigo)=>{
    const respuesta = axios.get(`${API_URL_BODEGAS}/${codigo}`).then(resp=> resp.data);
    return respuesta;
}

const guardar = async (bodega)=>{
     axios.post(API_URL_BODEGAS, bodega).then(resp => resp.data);
    
}

const actualizar = async (bodega, codigo)=>{
    axios.patch(`${API_URL_BODEGAS}/${codigo}`, bodega).then(resp => resp.data);
    
}

const eliminar = async (codigo)=>{
    axios.delete(`${API_URL_BODEGAS}/${codigo}`).then(resp => resp.data);
    
}

export const consultarPorCodigoFachada = async (codigo)=>{
    return await consultarPorCodigo(codigo);
}

export const guardarFachada = async (bodega)=>{
    await guardar(bodega);
}
export const actualizarFachada = async (bodega, codigo)=>{
    await actualizar(bodega, codigo);
}
export const eliminarFachada = async (codigo)=>{
    await eliminar(codigo);
}