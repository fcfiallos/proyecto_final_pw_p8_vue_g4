import axios from 'axios';

const API_URL = 'http://localhost:8081/api/inventario/v1/clientes';

const guardarcliente = async (clienteBody) => {
    try {
        const response = await axios.post(API_URL, clienteBody);
        return response.data;
    } catch (error) {
        console.error("Error en guardarClienteFachada:", error.response?.data || error.message);
        throw error;
    }
};


export const guardarClienteFachada = async (clienteBody) => {
    return await guardarcliente(clienteBody);
};

const consultarClientePorCedula = async (cedula) => {
    try {
        const response = await axios.get(`${API_URL}/${cedula}`);
        return response.data;
    } catch (error) {
        console.error(`Error en consultarClientePorCedulaFachada con cédula ${cedula}:`, error.response?.data || error.message);
        throw error;
    }
}

export const consultarClientePorCedulaFachada = async (cedula) => {
    return await consultarClientePorCedula(cedula);
};


const actualizarCliente = async (cedula, clienteBody) => {
    try {
        const response = await axios.put(`${API_URL}/${cedula}`, clienteBody);
        return response.data;
    } catch (error) {
        console.error(`Error en actualizarClienteFachada con cédula ${cedula}:`, error.response?.data || error.message);
        throw error;
    }
}

export const actualizarClienteFachada = async (cedula, clienteBody) => {
    return await actualizarCliente(cedula, clienteBody);
};

const eliminarClientePorCedula = async (cedula) => {
    try {
        const response = await axios.delete(`${API_URL}/${cedula}`);
        return response.data;
    } catch (error) {
        console.error(`Error en eliminarClientePorCedulaFachada con cédula ${cedula}:`, error.response?.data || error.message);
        throw error;
    }
}
export const eliminarClientePorCedulaFachada = async (cedula) => {
    return await eliminarClientePorCedula(cedula);
};


const obtenerTodosLosClientes = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error en obtenerTodosLosClientesFachada:", error.response?.data || error.message);
        throw error;
    }
}

export const obtenerTodosLosClientesFachada = async () => {
    return await obtenerTodosLosClientes();
}

const obtenerFacturasPorCedula = async (cedula) => {
    const response = await axios.get(`${API_URL}/${cedula}/facturas`);
    return response.data;
}

export const obtenerFacturasPorCedulaFachada = async (cedula) => {
    return await obtenerFacturasPorCedula(cedula);

};