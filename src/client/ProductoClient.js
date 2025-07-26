import axios from "axios";

const API_URL_PRODUCTOS = "http://localhost:8081/api/inventario/v1/productos";

const consultarPorCodigoBarras = async (codigoBarras) => {
    try {
        const respuesta = await axios.get(`${API_URL_PRODUCTOS}/${codigoBarras}`);
        return respuesta.data;
    } catch (error) {
        console.error('Error al consultar producto:', error);
        throw error;
    }
}

const guardar = async (producto) => {
    try {
        console.log('Enviando producto al backend:', producto);
        const respuesta = await axios.post(API_URL_PRODUCTOS, producto);
        return respuesta.data;
    } catch (error) {
        console.error('Error al guardar producto:', error);
        console.error('Datos enviados:', producto);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        }
        throw error;
    }
}

const actualizar = async (producto, codigoBarras) => {
    try {
        console.log('Actualizando producto:', codigoBarras, producto);
        const respuesta = await axios.patch(`${API_URL_PRODUCTOS}/${codigoBarras}`, producto);
        return respuesta.data;
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        console.error('Datos enviados:', producto);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        throw error;
    }
}

const eliminar = async (codigoBarras) => {
    try {
        const respuesta = await axios.delete(`${API_URL_PRODUCTOS}/${codigoBarras}`);
        return respuesta.data;
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        throw error;
    }
}

export const consultarPorCodigoBarrasFachada = async (codigoBarras)=>{
    return await consultarPorCodigoBarras(codigoBarras);
}

export const guardarFachada = async (producto)=>{
    await guardar(producto);
}
export const actualizarFachada = async (producto, codigoBarras)=>{
    await actualizar(producto, codigoBarras);
}
export const eliminarFachada = async (codigoBarras)=>{
    await eliminar(codigoBarras);
}