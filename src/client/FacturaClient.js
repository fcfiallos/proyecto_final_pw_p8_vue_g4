import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api/inventario/v1/facturas";

const _obtenerReporteFacturas = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reporte`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener reporte de facturas:", error);
    throw error;
  }
};

const _obtenerReporteFacturasPorCedula = async (cedula) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reporte/cliente/${cedula}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener reporte de facturas para cliente ${cedula}:`, error);
    throw error;
  }
};

export const obtenerReporteFacturasFachada = async () => {
  return await _obtenerReporteFacturas();
};

export const obtenerReporteFacturasPorCedulaFachada = async (cedula) => {
  return await _obtenerReporteFacturasPorCedula(cedula);
};
