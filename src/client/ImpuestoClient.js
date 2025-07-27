import axios from "axios";

const API_URL_IMPUESTOS = "http://localhost:8081/api/inventario/v1/impuestos";

const obtenerTodos = async () => {
    try {
        const respuesta = await axios.get(API_URL_IMPUESTOS);
        return respuesta.data;
    } catch (error) {
        console.error('Error al obtener todos los impuestos:', error);
        throw error;
    }
}

const consultarPorId = async (id) => {
    try {
        const respuesta = await axios.get(`${API_URL_IMPUESTOS}/${id}`);
        return respuesta.data;
    } catch (error) {
        console.error('Error al consultar impuesto por ID:', error);
        throw error;
    }
}

const consultarPorNombre = async (nombre) => {
    try {
        const respuesta = await axios.get(`${API_URL_IMPUESTOS}/nombre/${nombre}`);
        return respuesta.data;
    } catch (error) {
        console.error('Error al consultar impuesto por nombre:', error);
        throw error;
    }
}

const guardar = async (impuesto) => {
    try {
        console.log('Enviando impuesto al backend:', impuesto);
        const respuesta = await axios.post(API_URL_IMPUESTOS, impuesto);
        return respuesta.data;
    } catch (error) {
        console.error('Error al guardar impuesto:', error);
        console.error('Datos enviados:', impuesto);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        throw error;
    }
}

const actualizar = async (id, impuesto) => {
    try {
        console.log('Actualizando impuesto:', id, impuesto);
        const respuesta = await axios.put(`${API_URL_IMPUESTOS}/${id}`, impuesto);
        return respuesta.data;
    } catch (error) {
        console.error('Error al actualizar impuesto:', error);
        console.error('Datos enviados:', impuesto);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        throw error;
    }
}

const eliminar = async (id) => {
    try {
        const respuesta = await axios.delete(`${API_URL_IMPUESTOS}/${id}`);
        return respuesta.data;
    } catch (error) {
        console.error('Error al eliminar impuesto:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        throw error;
    }
}

// Funciones fachada para exportar
export const obtenerTodosFachada = async () => {
    return await obtenerTodos();
}

export const consultarPorIdFachada = async (id) => {
    return await consultarPorId(id);
}

export const consultarPorNombreFachada = async (nombre) => {
    return await consultarPorNombre(nombre);
}

export const guardarFachada = async (impuesto) => {
    return await guardar(impuesto);
}

export const actualizarFachada = async (id, impuesto) => {
    return await actualizar(id, impuesto);
}

export const eliminarFachada = async (id) => {
    return await eliminar(id);
}
