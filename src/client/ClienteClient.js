import axios from 'axios';

const API_URL = 'http://localhost:8081/api/inventario/v1/clientes';


export const guardarClienteFachada = async (clienteBody) => {
    try {
        const response = await axios.post(API_URL, clienteBody);
        return response.data;
    } catch (error) {
        console.error("Error en guardarClienteFachada:", error.response?.data || error.message);
        throw error;
    }
};

export const consultarClientePorCedulaFachada = async (cedula) => {
    try {
        const response = await axios.get(`${API_URL}/${cedula}`);
        return response.data;
    } catch (error) {
        console.error(`Error en consultarClientePorCedulaFachada con cédula ${cedula}:`, error.response?.data || error.message);
        throw error;
    }
};


export const actualizarClienteFachada = async (cedula, clienteBody) => {
    try {
        const response = await axios.put(`${API_URL}/${cedula}`, clienteBody);
        return response.data;
    } catch (error) {
        console.error(`Error en actualizarClienteFachada con cédula ${cedula}:`, error.response?.data || error.message);
        throw error;
    }
};


export const eliminarClientePorCedulaFachada = async (cedula) => {
    try {
        const response = await axios.delete(`${API_URL}/${cedula}`);
        return response.data;
    } catch (error) {
        console.error(`Error en eliminarClientePorCedulaFachada con cédula ${cedula}:`, error.response?.data || error.message);
        throw error;
    }
};


export const obtenerTodosLosClientesFachada = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error en obtenerTodosLosClientesFachada:", error.response?.data || error.message);
        throw error;
    }
}