import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api/inventario/v1/facturas";
const API_DETALLE_URL = "http://localhost:8081/api/inventario/v1/detalle";

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

const guardarFactura = async (facturabody) => {
  try {
    const response = await axios.post(API_BASE_URL, facturabody);
    return response.data;
  } catch (error) {
    console.error("Error al guardar Factura:", error.response?.data || error.message);
    throw error;
  }
};

const guardarDetalleFactura = async (detalleFacturaBody) => {
  try {
    const response = await axios.post(API_DETALLE_URL, detalleFacturaBody);
    return response.data;
  } catch (error) {
    console.error("Error al guardar detalle de factura:", error.response?.data || error.message);
    throw error;
  }
};

//Fachadas

export const obtenerReporteFacturasFachada = async () => {
  return await _obtenerReporteFacturas();
};

export const obtenerReporteFacturasPorCedulaFachada = async (cedula) => {
  return await _obtenerReporteFacturasPorCedula(cedula);
};

export const guardarFacturaFachada = async (facturabody) => {
  return await guardarFactura(facturabody);
};

export const guardarDetalleFacturaFachada = async (detalleFacturaBody) => {
  return await guardarDetalleFactura(detalleFacturaBody);
}
