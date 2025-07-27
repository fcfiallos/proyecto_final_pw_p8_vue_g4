import axios from "axios";

const API_URL_BODEGAS = "http://localhost:8081/api/inventario/v1/bodegas";

const obtenerTodas = async () => {
    try {
        const respuesta = await axios.get(API_URL_BODEGAS);
        return respuesta.data;
    } catch (error) {
        console.error('Error al obtener todas las bodegas:', error);
        
        // Si es error 405, probablemente el endpoint no está implementado
        if (error.response && error.response.status === 405) {
            console.warn('Endpoint GET /bodegas no está implementado en el backend');
            // Retornar array vacío como fallback
            return [];
        }
        
        throw error;
    }
}

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

export const obtenerTodasFachada = async () => {
    return await obtenerTodas();
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