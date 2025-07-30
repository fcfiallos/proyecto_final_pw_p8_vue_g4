<template>
  <div class="container factura-container">
    <h1 class="text-center mb-4">Generar Facturas</h1>

    <!-- Alertas para mensajes -->
    <div
      v-if="mostrarMensajeExito"
      class="alert alert-success alert-dismissible fade show mb-3"
      role="alert"
    >
      {{ mensajeExito }}
      <button
        type="button"
        class="btn-close"
        @click="mostrarMensajeExito = false"
        aria-label="Close"
      ></button>
    </div>

    <div
      v-if="mostrarMensajeError"
      class="alert alert-danger alert-dismissible fade show mb-3"
      role="alert"
    >
      {{ mensajeError }}
      <button
        type="button"
        class="btn-close"
        @click="mostrarMensajeError = false"
        aria-label="Close"
      ></button>
    </div>

    <!-- Cabecera -->
    <div class="section card p-4 mb-4">
      <h2 class="mb-3">Datos Empresa:</h2>
      <div class="row g-3">
        <div class="col-12 col-md-6 col-lg-4">
          <div class="form-group text-start">
            <label class="form-label">RUC Empresa</label>
            <input
              v-model="ruc"
              type="text"
              class="form-control"
              placeholder="Ingrese el RUC (13 dígitos)"
              maxlength="13"
              pattern="[0-9]{13}"
              @input="validarRuc"
              :class="{
                'is-invalid': mostrarErrorRuc && errorRuc && ruc.length > 0,
              }"
              required
            />
            <div v-if="mostrarErrorRuc && errorRuc" class="invalid-feedback">
              El RUC debe contener exactamente 13 dígitos numéricos
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-4">
          <div class="form-group text-start">
            <label class="form-label">N&uacute;mero de documento</label>
            <input
              v-model="numeroDocumento"
              type="text"
              class="form-control"
              placeholder="Ingrese ..."
              required
            />
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-4">
          <div class="form-group text-start">
            <label class="form-label">Establecimiento</label>
            <input
              v-model="establecimiento"
              type="text"
              class="form-control"
              placeholder="Ej: Calle principal y Secundaria"
              required
            />
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-4">
          <div class="form-group text-start">
            <label class="form-label">Punto de Emisi&oacute;n</label>
            <input
              v-model="puntoEmision"
              type="text"
              class="form-control"
              placeholder="Ej: Sucursal"
              required
            />
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-4">
          <div class="form-group text-start">
            <label class="form-label">Fecha de Emisi&oacute;n</label>
            <input
              type="date"
              class="form-control"
              v-model="fechaActual"
              readonly
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Cliente -->
    <div class="section card p-4 mb-4">
      <h2 class="mb-3">Detalles del cliente:</h2>
      <div class="row g-3">
        <div class="col-12 col-md-6 col-lg-3">
          <div class="form-group text-start">
            <label class="form-label">Identificaci&oacute;n</label>
            <div class="input-group">
              <input
                v-model="clienteCedula"
                class="form-control"
                type="text"
                placeholder="Ingrese su c&eacute;dula (10 dígitos)"
                maxlength="10"
                pattern="[0-9]{10}"
                @input="validarCedula"
                :class="{
                  'is-invalid':
                    mostrarErrorCedula &&
                    errorCedula &&
                    clienteCedula?.length > 0,
                }"
                required
              />
              <button
                class="btn btn-primary"
                @click="consultarCliente(clienteCedula)"
                :disabled="
                  errorCedula || !clienteCedula || clienteCedula.length !== 10
                "
              >
                Buscar
              </button>
            </div>
            <div
              v-if="mostrarErrorCedula && errorCedula"
              class="text-danger small mt-1 d-block"
            >
              La cédula debe contener exactamente 10 dígitos numéricos
            </div>
            <span v-if="mensajeCliente" class="text-danger small mt-1 d-block"
              >Cliente inexistente</span
            >
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-3">
          <div class="form-group text-start">
            <label class="form-label">Nombre</label>
            <input
              :value="cliente.nombre"
              type="text"
              class="form-control"
              placeholder="Ingrese su nombre"
              readonly
            />
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-3">
          <div class="form-group text-start">
            <label class="form-label">Direcci&oacute;n</label>
            <input
              :value="cliente.direccion"
              type="text"
              class="form-control"
              placeholder="Ingrese su direcci&oacute;n"
              readonly
            />
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-3">
          <div class="form-group text-start">
            <label class="form-label">Correo Electr&oacute;nico</label>
            <input
              :value="cliente.email"
              type="email"
              class="form-control"
              placeholder="Ej: micorreo@gmail.com"
              readonly
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Detalles de la orden -->
    <div class="section card p-4 mb-4">
      <h2 class="mb-3">Detalles de la orden:</h2>
      <div class="row g-3">
        <div class="col-12 col-md-6 col-lg-4">
          <div class="form-group text-start">
            <label for="prod_cod_bar" class="form-label"
              >C&oacute;digo de barras</label
            >
            <div class="input-group">
              <input
                v-model="codigoBarraProducto"
                id="prod_cod_bar"
                type="text"
                class="form-control"
                placeholder="Ej: 123456"
                @input="validarCodigoBarras"
                :class="{
                  'is-invalid': mostrarErrorCodigoBarras && errorCodigoBarras,
                }"
                required
              />
              <button
                class="btn btn-primary"
                @click="consultarProducto(codigoBarraProducto)"
                :disabled="errorCodigoBarras || !codigoBarraProducto"
              >
                Buscar
              </button>
            </div>
            <div
              v-if="mostrarErrorCodigoBarras && errorCodigoBarras"
              class="text-danger small mt-1 d-block"
            >
              El código de barras no puede estar vacío
            </div>
            <span v-if="mensajeProducto" class="text-danger small mt-1 d-block"
              >Producto inexistente</span
            >
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-4">
          <div class="form-group text-start">
            <label class="form-label">Nombre del producto</label>
            <input
              :value="producto.nombre"
              type="text"
              class="form-control"
              readonly
            />
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-4">
          <div class="form-group text-start">
            <label class="form-label">Cantidad</label>
            <input
              v-model.number="cantidad"
              type="number"
              class="form-control"
              min="1"
              placeholder="1 - 999"
              required
            />
            <span v-if="mensajeStock" class="text-danger small mt-1 d-block"
              >Stock insuficiente</span
            >
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-4">
          <div class="form-group text-start">
            <label class="form-label">Precio</label>
            <input
              :value="precio"
              type="text"
              class="form-control"
              placeholder="$0.00"
              readonly
            />
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-4">
          <div class="form-group text-start">
            <label class="form-label">Subtotal</label>
            <input
              :value="subtotal"
              type="number"
              class="form-control"
              placeholder="$0.00"
              readonly
            />
          </div>
        </div>
      </div>
      <button
        class="btn btn-success mt-4 mb-4 mx-auto d-block"
        @click="agregarItem"
      >
        Agregar
      </button>
      <div class="table-responsive">
        <table class="table table-hover">
          <thead class="table-light">
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
              <td colspan="6" class="text-center text-muted fst-italic">
                No hay productos agregados a la factura.
              </td>
            </tr>
            <tr v-for="(item, idx) in items" :key="idx">
              <td>{{ item.codigo }}</td>
              <td>{{ item.nombre }}</td>
              <td>{{ item.cantidad }}</td>
              <td>{{ item.precio }}</td>
              <td>{{ item.subtotal }}</td>
              <td>
                <button
                  class="btn btn-danger btn-sm"
                  @click="eliminarItem(idx)"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Totales -->
    <div class="section card p-4 mb-4">
      <div class="row">
        <div class="col-12 col-md-6 ms-auto">
          <div class="totals">
            <div class="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span>${{ subtotalGeneral }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span>Total Impuestos:</span>
              <span>${{ totalImpuestos.toFixed(2) }}</span>
            </div>
            <hr class="my-3" />
            <div class="d-flex justify-content-between fw-bold fs-5">
              <span>TOTAL:</span>
              <span>${{ totalFactura.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button
      class="btn btn-lg btn-primary d-block mx-auto mb-5"
      @click="guardarFactura"
    >
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
      errorRuc: false,
      errorCedula: false,
      errorCodigoBarras: false,
      mostrarErrorRuc: false,
      mostrarErrorCedula: false,
      mostrarErrorCodigoBarras: false,
      mensajeExito: "",
      mensajeError: "",
      mostrarMensajeExito: false,
      mostrarMensajeError: false,
    };
  },
  methods: {
    validarRuc() {
      const soloNumeros = /^\d+$/.test(this.ruc);
      this.errorRuc = !(soloNumeros && this.ruc.length === 13);
    },
    validarCedula() {
      if (!this.clienteCedula) {
        this.errorCedula = true;
        return;
      }
      const soloNumeros = /^\d+$/.test(this.clienteCedula);
      this.errorCedula = !(soloNumeros && this.clienteCedula.length === 10);

      if (!soloNumeros) {
        this.clienteCedula = this.clienteCedula.replace(/\D/g, "");
      }
    },
    validarCodigoBarras() {
      this.errorCodigoBarras =
        !this.codigoBarraProducto || this.codigoBarraProducto.trim() === "";
    },
    async consultarProducto(codigo) {
      this.validarCodigoBarras();
      this.mostrarErrorCodigoBarras = true;

      if (this.errorCodigoBarras) {
        this.mostrarError("El código de barras no puede estar vacío.");
        return;
      }

      try {
        const respuesta = await consultarPorCodigoBarrasFachada(codigo);
        this.producto = respuesta;
        this.precio = respuesta.precio;
        this.productoConsultado = true;
        this.mensajeProducto = false;
        this.mostrarExito(
          `Producto "${respuesta.nombre}" encontrado correctamente.`
        );
        setTimeout(() => {
          this.mostrarExito(null);
        }, 3000);
      } catch (error) {
        this.mensajeProducto = true;
        this.mostrarError(
          "No se encontró ningún producto con ese código de barras."
        );
        setTimeout(() => (this.mensajeProducto = false), 3000);
        this.producto = {};
        this.precio = 0;
      }
    },
    async consultarCliente(cedula) {
      this.validarCedula();
      this.mostrarErrorCedula = true;

      if (this.errorCedula) {
        this.mostrarError(
          "La cédula ingresada no es válida. Debe contener 10 dígitos numéricos."
        );
        return;
      }

      try {
        const respuesta = await consultarClientePorCedulaFachada(cedula);
        this.cliente = respuesta;
        this.mensajeCliente = false;
        this.mostrarExito(
          `Cliente ${respuesta.nombre} encontrado correctamente.`
        );
      } catch (error) {
        this.mensajeCliente = true;
        this.mostrarError("No se encontró ningún cliente con esa cédula.");
        setTimeout(() => (this.mensajeCliente = false), 3000);
      }
    },
    async guardarFactura() {
      this.validarRuc();
      this.validarCedula();
      this.mostrarErrorRuc = true;
      this.mostrarErrorCedula = true;

      if (this.errorRuc || this.errorCedula) {
        this.mostrarError(
          "Por favor, corrija los errores de validación antes de continuar."
        );
        return;
      }

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
        this.mostrarError(
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
        const facturaGuardada = await guardarFacturaFachada(factura);
        console.log("Factura guardada:", facturaGuardada);

        const detalles = this.items.map((item) => {
          const totalImpuestosDetalle = (item.impuestos || []).reduce(
            (sum, imp) => {
              const porcentaje = imp.valor;
              return sum + item.subtotal * porcentaje;
            },
            0
          );
          return {
            codigoBarras: item.codigo,
            cantidad: item.cantidad,
            precio: item.precio,
            subtotal: item.subtotal,
            totalImpuestos: totalImpuestosDetalle,
            facturaId: facturaGuardada,
          };
        });

        await guardarDetalleFacturaFachada(detalles);
        console.log("Detalles guardados:", detalles);

        this.mostrarExito("¡Factura guardada exitosamente!");

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

        // Reset error displays
        this.mostrarErrorRuc = false;
        this.mostrarErrorCedula = false;
        this.mostrarErrorCodigoBarras = false;
      } catch (error) {
        console.error("Error al guardar la factura o detalles:", error);
        this.mostrarError(
          "Ocurrió un error al guardar la factura. Por favor, inténtelo nuevamente."
        );
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
        // Mostrar mensaje de éxito
        this.mostrarExito(
          `Producto "${this.producto.nombre}" añadido a la factura.`
        );

        this.codigoBarraProducto = null;
        this.producto = {};
        this.cantidad = 0;
        this.precio = 0;
        this.productoConsultado = false;
        this.mensajeStock = false;
        this.mostrarErrorCodigoBarras = false;
      } else {
        this.mensajeStock = true;
        if (
          !this.productoConsultado ||
          Object.keys(this.producto).length === 0
        ) {
          this.mostrarError("Debe seleccionar un producto válido primero.");
        } else if (this.cantidad <= 0) {
          this.mostrarError("La cantidad debe ser mayor a cero.");
        } else if (this.producto.stock < this.cantidad) {
          this.mostrarError(
            `Stock insuficiente. Solo hay ${this.producto.stock} unidades disponibles.`
          );
        }
        setTimeout(() => (this.mensajeStock = false), 3000);
      }
    },
    eliminarItem(idx) {
      const itemEliminado = this.items[idx];
      this.items.splice(idx, 1);
      this.mostrarExito(
        `Producto "${itemEliminado.nombre}" eliminado de la factura.`
      );
    },
    mostrarExito(mensaje) {
      this.mensajeExito = mensaje;
      this.mostrarMensajeExito = true;
      this.$nextTick(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      setTimeout(() => {
        this.mostrarMensajeExito = false;
      }, 3000);
    },
    mostrarError(mensaje) {
      this.mensajeError = mensaje;
      this.mostrarMensajeError = true;
      this.$nextTick(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      setTimeout(() => {
        this.mostrarMensajeError = false;
      }, 3000);
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
    const now = new Date();
    now.setHours(now.getHours() - 5);
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    this.fechaActual = `${yyyy}-${mm}-${dd}`;

    this.errorRuc = false;
    this.errorCedula = true;
    this.errorCodigoBarras = true;

    // Inicializar variables para ocultar los mensajes de error al inicio
    this.mostrarErrorRuc = false;
    this.mostrarErrorCedula = false;
    this.mostrarErrorCodigoBarras = false;
  },
};
</script>

<style scoped>
.factura-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
}

h1 {
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.section {
  background: #f8f9fa;
  border-radius: 0.5rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
}

h2 {
  font-weight: 600;
}

.form-group {
  margin-bottom: 0.5rem;
}

.form-label {
  font-weight: 500;
  color: #374151;
}

.form-control[readonly] {
  background-color: #f3f4f6;
}

.totals {
  max-width: 350px;
  margin-left: auto;
}

.btn-success {
  background-color: #22c55e;
  border-color: #22c55e;
  font-weight: bold;
  max-width: 250px;
  width: 80%;
}

.btn-success:hover {
  background-color: #16a34a;
  border-color: #16a34a;
}

.btn-primary {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.btn-primary:hover {
  background-color: #2563eb;
  border-color: #2563eb;
}

@media (max-width: 767.98px) {
  .section {
    padding: 1rem;
  }
}
</style>