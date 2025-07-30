<template>
  <div class="factura-container">
    <h1>Gesti&oacute;n de Facturas</h1>

    <!-- Cabecera -->
    <div class="section">
      <h2>Datos Empresa:</h2>
      <div class="grid">
        <div class="form-group">
          <label>RUC Empresa</label>
          <input
            v-model="ruc"
            type="number"
            placeholder="Ingrese el RUC"
            required
          />
        </div>
        <div class="form-group">
          <label>N&uacute;mero de documento</label>
          <input
            v-model="numeroDocumento"
            type="number"
            placeholder="Ingrese ..."
            required
          />
        </div>
        <div class="form-group">
          <label>Establecimiento</label>
          <input
            v-model="establecimiento"
            type="text"
            placeholder="Ej: "
            required
          />
        </div>
        <div class="form-group">
          <label>Punto de Emisi&oacute;n</label>
          <input
            v-model="puntoEmision"
            type="text"
            placeholder="Ej: "
            required
          />
        </div>
        <div class="form-group">
          <label>Fecha de Emisi&oacute;n</label>
          <input type="date" v-model="fechaActual" readonly />
        </div>
      </div>
    </div>

    <!-- Cliente -->
    <div class="section">
      <h2>Detalles del cliente:</h2>
      <div class="grid">
        <div class="form-group">
          <label>Identificaci&oacute;n</label>
          <div class="input-boton-inline">
            <input
              v-model="clienteCedula"
              class="input_busqueda"
              type="number"
              placeholder="Ingrese su c&eacute;dula"
              required
            />
            <button @click="consultarCliente(clienteCedula)">Buscar</button>
          </div>
          <span v-if="mensajeCliente" class="mensaje-error"
            >Cliente inexistente</span
          >
        </div>
        <div class="form-group">
          <label>Nombre</label>
          <input
            :value="cliente.nombre"
            type="text"
            placeholder="Ingrese su nombre"
            readonly
          />
        </div>
        <div class="form-group">
          <label>Direcci&oacute;n</label>
          <input
            :value="cliente.direccion"
            type="text"
            placeholder="Ingrese su direcci&oacute;n"
            readonly
          />
        </div>
        <div class="form-group">
          <label>Correo Electr&oacute;nico</label>
          <input
            :value="cliente.email"
            type="email"
            placeholder="Ej: micorreo@gmail.com"
            readonly
          />
        </div>
      </div>
    </div>

    <!-- Detalles de la orden -->
    <div class="section">
      <h2>Detalles de la orden:</h2>
      <div class="grid grid-4">
        <div class="form-group">
          <label for="prod_cod_bar">C&oacute;digo de barras</label>
          <div class="input-boton-inline">
            <input
              v-model="codigoBarraProducto"
              id="prod_cod_bar"
              type="number"
              placeholder="Ej: 123456"
              class="input_busqueda"
              required
            />
            <button @click="consultarProducto(codigoBarraProducto)">
              Buscar
            </button>
          </div>
          <span v-if="mensajeProducto" class="mensaje-error"
            >Producto inexistente</span
          >
        </div>
        <div class="form-group">
          <label>Nombre del producto</label>
          <input :value="producto.nombre" type="text" readonly />
        </div>
        <div class="form-group">
          <label>Cantidad</label>
          <input
            v-model.number="cantidad"
            type="number"
            min="1"
            placeholder="1 - 999"
            required
          />
          <span v-if="mensajeStock" class="mensaje-error"
            >Stock insuficiente</span
          >
        </div>
        <div class="form-group">
          <label>Precio</label>
          <input :value="precio" type="text" placeholder="$0.00" readonly />
        </div>
        <div class="form-group">
          <label>Subtotal</label>
          <input :value="subtotal" type="number" placeholder="$0.00" readonly />
        </div>
      </div>
      <button class="boton-agregar" @click="agregarItem">Agregar</button>
      <div>
        <table>
          <thead>
            <tr>
              <th>C&oacute;digo</th>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="items.length === 0">
              <td
                :colspan="6"
                style="text-align: center; color: #888; font-style: italic"
              >
                No hay productos agregados a la factura.
              </td>
            </tr>
            <tr v-for="(item, idx) in items" :key="idx">
              <td data-label="Código">{{ item.codigo }}</td>
              <td data-label="Nombre">{{ item.nombre }}</td>
              <td data-label="Cantidad">{{ item.cantidad }}</td>
              <td data-label="Precio">{{ item.precio }}</td>
              <td data-label="Subtotal">{{ item.subtotal }}</td>
              <td data-label="Opciones">
                <button class="delete-btn" @click="eliminarItem(idx)">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Totales -->
    <div class="section">
      <div class="totals">
        <p>
          <span>Subtotal: $</span>
          <span>{{ subtotalGeneral }}</span>
        </p>
        <p>
          <span>Total Impuestos: $</span>
          <span>{{ totalImpuestos.toFixed(2) }}</span>
        </p>
        <hr class="totals-divider" />
        <p class="total">
          <span>TOTAL: $</span>
          <span class="total-bold">{{ totalFactura.toFixed(2) }}</span>
        </p>
      </div>
    </div>

    <button class="boton-guardar" @click="guardarFactura">
      Guardar Factura
    </button>
  </div>
</template>

<script>
import { consultarPorCodigoBarrasFachada } from "@/client/ProductoClient.js";
import { consultarClientePorCedulaFachada } from "@/client/ClienteClient.js";
import {
  guardarFacturaFachada,
  guardarDetalleFacturaFachada,
} from "@/client/FacturaClient.js";
export default {
  data() {
    return {
      fechaActual: "",
      codigoBarraProducto: null,
      producto: {},
      cantidad: 0,
      precio: 0,
      cliente: {},
      clienteCedula: null,
      items: [],
      productoConsultado: false,
      mensajeStock: false,
      mensajeProducto: false,
      mensajeCliente: false,
      ruc: "",
      numeroDocumento: "",
      establecimiento: "",
      puntoEmision: "",
    };
  },
  methods: {
    async consultarProducto(codigo) {
      try {
        const respuesta = await consultarPorCodigoBarrasFachada(codigo);
        this.producto = respuesta;
        this.precio = respuesta.precio;
        this.productoConsultado = true;
        this.mensajeProducto = false;
      } catch (error) {
        this.mensajeProducto = true;
        setTimeout(() => (this.mensajeProducto = false), 3000);
        this.producto = {};
        this.precio = 0;
      }
    },
    async consultarCliente(cedula) {
      try {
        const respuesta = await consultarClientePorCedulaFachada(cedula);
        this.cliente = respuesta;
        this.mensajeCliente = false;
      } catch (error) {
        this.mensajeCliente = true;
        setTimeout(() => (this.mensajeCliente = false), 3000);
      }
    },
    async guardarFactura() {
      // Validación de campos obligatorios
      if (
        !this.ruc ||
        !this.numeroDocumento ||
        !this.establecimiento ||
        !this.puntoEmision ||
        !this.fechaActual ||
        !this.clienteCedula ||
        !this.cliente.nombre ||
        this.items.length === 0
      ) {
        alert(
          "Por favor, complete todos los campos obligatorios y agregue al menos un producto."
        );
        return;
      }

      try {
        const factura = {
          rucEmpresa: String(this.ruc),
          numeroDocumento: String(this.numeroDocumento),
          establecimiento: String(this.establecimiento),
          puntoEmision: String(this.puntoEmision),
          fechaEmision: this.fechaActual,
          cedulaCliente: String(this.clienteCedula),
          subtotal: Number(this.subtotalGeneral),
          totalImpuestos: Number(this.totalImpuestos.toFixed(2)),
          total: Number(this.totalFactura),
        };
        // Guardar factura y obtener el id
        const facturaGuardada = await guardarFacturaFachada(factura);
        const facturaId = facturaGuardada.id; 

        // Guardar los detalles
        await this.guardarDetalles(facturaId);

        // Limpieza de campos
        this.items = [];
        this.cliente = {};
        this.codigoBarraProducto = null;
        this.clienteCedula = null;
        this.producto = {};
        this.cantidad = 0;
        this.precio = 0;
        this.ruc = "";
        this.numeroDocumento = "";
        this.establecimiento = "";
        this.puntoEmision = "";
      } catch (error) {
        console.error("Error al guardar la factura o detalles:", error);
      }
    },

    async guardarDetalles(facturaId) {
      for (const item of this.items) {
        const totalImpuestosDetalle = (item.impuestos || []).reduce(
          (sum, imp) => {
            const porcentaje = imp.valor - 1;
            return sum + item.subtotal * porcentaje;
          },
          0
        );

        const detalle = {
          codigoBarras: item.codigo,
          cantidad: item.cantidad,
          precio: item.precio,
          subtotal: item.subtotal,
          totalImpuestos: totalImpuestosDetalle,
          facturaId: facturaId,
        };
        await guardarDetalleFacturaFachada(detalle);
      }
    },
    agregarItem() {
      if (
        this.producto &&
        Object.keys(this.producto).length > 0 &&
        this.cantidad > 0 &&
        this.producto.stock >= this.cantidad &&
        this.productoConsultado
      ) {
        this.items.push({
          codigo: this.codigoBarraProducto,
          nombre: this.producto.nombre,
          cantidad: this.cantidad,
          precio: this.precio,
          subtotal: this.cantidad * this.precio,
          impuestos: this.producto.impuestos || [],
        });
        // Limpieza de campos
        this.codigoBarraProducto = null;
        this.producto = {};
        this.cantidad = 0;
        this.precio = 0;
        this.productoConsultado = false;
        this.mensajeStock = false;
      } else {
        this.mensajeStock = true;
        setTimeout(() => (this.mensajeStock = false), 3000);
      }
    },
    eliminarItem(idx) {
      this.items.splice(idx, 1);
    },
  },
  computed: {
    subtotal() {
      const cantidad = parseFloat(this.cantidad) || 0;
      const precio = parseFloat(this.precio) || 0;
      return cantidad * precio;
    },
    subtotalGeneral() {
      return this.items
        .reduce((acc, item) => acc + item.subtotal, 0)
        .toFixed(2);
    },
    totalImpuestos() {
      return this.items.reduce((acc, item) => {
        if (item.impuestos && item.impuestos.length > 0) {
          const totalImpuestoItem = item.impuestos.reduce((sum, imp) => {
            const porcentaje = imp.valor;
            return sum + item.subtotal * porcentaje;
          }, 0);
          return acc + totalImpuestoItem;
        }
        return acc;
      }, 0);
    },
    totalFactura() {
      const subtotal = this.items.reduce((acc, item) => acc + item.subtotal, 0);
      return subtotal + this.totalImpuestos;
    },
  },
  mounted() {
    // Ajuste para que la zona horaria sea UTC-5
    const now = new Date();
    now.setHours(now.getHours() - 5);
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    this.fechaActual = `${yyyy}-${mm}-${dd}`;
  },
};
</script>

<style scoped>
.factura-container {
  max-width: 90vw;
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
}

@media (min-width: 900px) {
  .factura-container {
    max-width: 1200px;
    padding: 2rem;
  }
}

h1 {
  font-size: 1.75rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
}

.section {
  background: #e8e8e8;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 3px 4px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
  width: 100%;
  box-sizing: border-box;
}

h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.grid,
.grid-4 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 600px) {
  .grid,
  .grid-4 {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1200px) {
  .grid,
  .grid-4 {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 599px) {
  .grid-4 .form-group:last-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 600px) {
  .section {
    padding: 1rem;
  }
  .boton-agregar {
    width: 100%;
    font-size: clamp(0.9rem, 4vw, 1.1rem);
    padding: 0.75rem 0;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

input[readonly] {
  background: #f3f4f6;
}

.input-boton-inline {
  display: flex;
  gap: 8px;
  align-items: center;
}
.input-boton-inline input {
  flex: 1;
}

.item-form {
  margin-bottom: 1rem;
}

button {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

button:hover {
  background: #2563eb;
}

.delete-btn {
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.delete-btn:hover {
  background: #b91c1c;
  color: #fff;
}
.boton-agregar {
  margin-top: 24px;
  margin-bottom: 24px;
  padding: 0.75rem 2rem;
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  font-weight: bold;
  background: #22c55e;
  color: #fff;
  border: none;
  border-radius: 0.35rem;
  cursor: pointer;
  transition: background 0.2s;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
  min-width: 120px;
  max-width: 250px;
}

.boton-agregar:hover {
  background: #16a34a;
}

.boton-guardar {
  margin-top: 24px;
  margin-bottom: 24px;
  padding: 0.75rem 2rem;
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  font-weight: bold;
  background: #22c59c;
  color: #fff;
  border: none;
  border-radius: 0.35rem;
  cursor: pointer;
  transition: background 0.2s;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
  min-width: 120px;
  max-width: 250px;
}

.boton-guardar:hover {
  background: #1dac88;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-top: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

thead {
  background: #f3f4f6;
}

th,
td {
  padding: 0.75rem 0.5rem;
  text-align: center;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.95rem;
}

th {
  font-weight: 600;
  color: #374151;
  letter-spacing: 0.02em;
  font-style: italic;
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr:hover {
  background: #f1f5f9;
  transition: background 0.2s;
}

@media (max-width: 700px) {
  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }
  thead {
    display: none;
  }
  tbody tr {
    margin-bottom: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
    background: #fff;
    padding: 0.5rem 0;
  }
  td {
    border: none;
    position: relative;
    padding-left: 50%;
    min-height: 2.5rem;
    font-size: 1rem;
    text-align: left;
  }
  td:before {
    position: absolute;
    left: 1rem;
    top: 0.75rem;
    width: 45%;
    white-space: nowrap;
    font-weight: bold;
    color: #64748b;
    content: attr(data-label);
  }
}

.totals {
  text-align: right;
  margin-left: auto;
  margin-right: 0;
  max-width: 350px;
  margin-top: 2rem;
}

.totals p {
  display: block;
  text-align: right;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  font-weight: normal;
  color: #222;
}

.totals .total {
  font-weight: bold;
  font-size: 1.1rem;
  text-align: right;
  margin-top: 0.5rem;
}

.total-bold {
  font-weight: bold;
  font-size: 1.2rem;
  color: #000;
  text-align: right;
}

.totals-divider {
  border: none;
  border-top: 2px solid #000000;
  margin-left: 30%;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.mensaje-error {
  color: #f24e4e;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
  font-style: italic;
}
</style>