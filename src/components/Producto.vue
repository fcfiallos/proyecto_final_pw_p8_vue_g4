<template>
  <div class="container-producto">
    <h1>¿Qué acción deseas realizar con los productos?</h1>
    
    <!-- Cartas para seleccionar opciones -->
    <div class="row justify-content-center" v-if="!opcionSeleccionada">
      <div class="col-lg-3 col-md-6 col-sm-6 mb-3 mb-sm-4" v-for="carta in cartas" :key="carta.titulo">
        <div class="card">
          <div class="card-body">
            <i :class="carta.icono"></i>
            <h3>{{ carta.titulo }}</h3>
            <button @click="seleccionarOpcion(carta.valor)">
              {{ carta.boton }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Botón para regresar -->
    <div class="container-regresar" v-if="opcionSeleccionada">
      <button @click="regresarAOpciones" class="btn-regresar">
        <i class="bi bi-arrow-left"></i> Regresar a opciones
      </button>
    </div>

    <div class="container-mensaje">
      <p v-if="exitoMensaje" id="exitoMensaje">
        <i class="bi bi-check-square"></i> {{ exitoMensaje }}
      </p>
      <p v-if="errorMensaje" id="errorMensaje">
        <i class="bi bi-exclamation-square"></i> {{ errorMensaje }}
      </p>
    </div>
    <div class="container-consultar" v-if="opcionSeleccionada === 'consultar'">
      <h3>Consultar Producto</h3>
      <p>Ingresa el c&oacute;digo de barras del producto que deseas consultar</p>
      <input type="text" v-model="codigoBarras" placeholder="Código de barras" />
      <span v-if="mensaje.codigoBarrasMensaje"
        ><i class="bi bi-exclamation-circle"></i>
        {{ mensaje.codigoBarrasMensaje }}</span
      >
      <button @click="consultar">Consultar</button>
      <div class="resultado" v-if="resultado">
        <p>Nombre: {{ nombre }}</p>
        <p>Precio: ${{ precio }}</p>
        <p>Stock: {{ stock }}</p>
        <p>Categor&iacute;a: {{ categoria }}</p>
        <div v-if="impuestos && impuestos.length > 0">
          <p><strong>Impuestos:</strong></p>
          <ul class="impuestos-lista">
            <li v-for="(impuesto, index) in impuestos" :key="index">
              {{ obtenerNombreImpuesto(impuesto.tipo) }}: {{ impuesto.valor }}%
            </li>
          </ul>
        </div>
        <p v-else>Sin impuestos aplicados</p>
      </div>
    </div>
    <div class="container-guardar" v-if="opcionSeleccionada === 'guardar'">
      <h3>Crear un Nuevo Producto</h3>
      <p>Es necesario llenar todos los campos para guardar el producto.</p>
      <div class="formulario">
        <label for="codigoBarras">C&oacute;digo de Barras</label>
        <input type="text" v-model="codigoBarras" id="codigoBarras" />
        <span v-if="mensaje.codigoBarrasMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.codigoBarrasMensaje }}</span
        >
        <label for="nombre">Nombre</label>
        <input type="text" v-model="nombre" id="nombre" />
        <span v-if="mensaje.nombreMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.nombreMensaje }}</span
        >
        <label for="categoria">Categor&iacute;a</label>
        <select v-model="categoria" id="categoria">
          <option value="">Selecciona una categoría</option>
          <option value="PRODUCTO">Producto</option>
          <option value="SERVICIO">Servicio</option>
        </select>
        <span v-if="mensaje.categoriaMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.categoriaMensaje }}</span
        >
        <label for="precio">Precio</label>
        <input type="number" step="0.01" v-model="precio" id="precio" />
        <span v-if="mensaje.precioMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.precioMensaje }}</span
        >
        <label for="stock">Stock</label>
        <input type="number" v-model="stock" id="stock" />
        <span v-if="mensaje.stockMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.stockMensaje }}</span
        >
        
        <!-- Sección de Impuestos -->
        <label>Impuestos</label>
        <div class="impuestos-container">
          <div class="impuesto-item" v-for="(impuesto, index) in impuestos" :key="index">
            <select v-model="impuesto.tipo" class="impuesto-select">
              <option value="">Selecciona impuesto</option>
              <option value="iva">IVA (Impuesto al Valor Agregado)</option>
              <option value="ice">ICE (Impuesto a Consumos Especiales)</option>
              <option value="arancel">Aranceles de Importación</option>
              <option value="isd">ISD (Impuesto a la Salida de Divisas)</option>
            </select>
            <input 
              type="number" 
              step="0.01" 
              v-model="impuesto.valor" 
              placeholder="Valor (%)" 
              class="impuesto-valor"
            />
            <button type="button" @click="eliminarImpuesto(index)" class="btn-eliminar-impuesto">
              <i class="bi bi-trash"></i>
            </button>
          </div>
          <button type="button" @click="agregarImpuesto" class="btn-agregar-impuesto">
            <i class="bi bi-plus"></i> Agregar Impuesto
          </button>
        </div>
        <span v-if="mensaje.impuestosMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.impuestosMensaje }}</span
        >
      </div>
      <button @click="guardar">Guardar</button>
    </div>
    <div
      class="container-actualizar"
      v-if="opcionSeleccionada === 'actualizar'"
    >
      <h3>Modificar Producto</h3>
      <input type="text" v-model="codigoBarras" placeholder="Código de barras" />
      <span v-if="mensaje.codigoBarrasMensaje"
        ><i class="bi bi-exclamation-circle"></i>
        {{ mensaje.codigoBarrasMensaje }}</span
      >
      <button @click="consultar">Consultar</button>
      <div class="formulario">
        <label for="nombre">Nombre</label>
        <input type="text" v-model="nombre" id="nombre" />
        <span v-if="mensaje.nombreMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.nombreMensaje }}</span
        >
        <label for="categoria">Categor&iacute;a</label>
        <select v-model="categoria" id="categoria">
          <option value="">Selecciona una categoría</option>
          <option value="PRODUCTO">Producto</option>
          <option value="SERVICIO">Servicio</option>
        </select>
        <span v-if="mensaje.categoriaMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.categoriaMensaje }}</span
        >
        <label for="precio">Precio</label>
        <input type="number" step="0.01" v-model="precio" id="precio" />
        <span v-if="mensaje.precioMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.precioMensaje }}</span
        >
        <label for="stock">Stock</label>
        <input type="number" v-model="stock" id="stock" />
        <span v-if="mensaje.stockMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.stockMensaje }}</span
        >
        
        <!-- Sección de Impuestos -->
        <label>Impuestos</label>
        <div class="impuestos-container">
          <div class="impuesto-item" v-for="(impuesto, index) in impuestos" :key="index">
            <select v-model="impuesto.tipo" class="impuesto-select">
              <option value="">Selecciona impuesto</option>
              <option value="iva">IVA (Impuesto al Valor Agregado)</option>
              <option value="ice">ICE (Impuesto a Consumos Especiales)</option>
              <option value="arancel">Aranceles de Importación</option>
              <option value="isd">ISD (Impuesto a la Salida de Divisas)</option>
            </select>
            <input 
              type="number" 
              step="0.01" 
              v-model="impuesto.valor" 
              placeholder="Valor (%)" 
              class="impuesto-valor"
            />
            <button type="button" @click="eliminarImpuesto(index)" class="btn-eliminar-impuesto">
              <i class="bi bi-trash"></i>
            </button>
          </div>
          <button type="button" @click="agregarImpuesto" class="btn-agregar-impuesto">
            <i class="bi bi-plus"></i> Agregar Impuesto
          </button>
        </div>
        <span v-if="mensaje.impuestosMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.impuestosMensaje }}</span
        >
      </div>
      <button @click="actualizar">Actualizar</button>
    </div>
    <div class="container-eliminar" v-if="opcionSeleccionada === 'eliminar'">
      <h3>Eliminar Producto</h3>
      <p>Ingresa el c&oacute;digo de barras del producto que deseas eliminar</p>
      <input type="text" v-model="codigoBarras" placeholder="Código de barras" />
      <span v-if="mensaje.codigoBarrasMensaje"
        ><i class="bi bi-exclamation-circle"></i>
        {{ mensaje.codigoBarrasMensaje }}</span
      >
      <button @click="eliminar">Eliminar</button>
    </div>
  </div>
</template>

<script>
import {
  consultarPorCodigoBarrasFachada,
  guardarFachada,
  actualizarFachada,
  eliminarFachada,
} from "@/client/ProductoClient";
export default {
  data() {
    return {
      opcionSeleccionada: "",
      cartas: [
        {
          titulo: "Consultar Producto",
          boton: "Consultar",
          valor: "consultar",
          icono: "bi bi-search",
        },
        {
          titulo: "Crear Producto",
          boton: "Crear",
          valor: "guardar",
          icono: "bi bi-plus-circle",
        },
        {
          titulo: "Actualizar Producto",
          boton: "Actualizar",
          valor: "actualizar",
          icono: "bi bi-pencil-square",
        },
        {
          titulo: "Eliminar Producto",
          boton: "Eliminar",
          valor: "eliminar",
          icono: "bi bi-trash",
        },
      ],
      codigoBarras: null,
      nombre: null,
      precio: null,
      stock: null,
      categoria: null,
      impuestos: [],
      errorMensaje: null,
      exitoMensaje: null,
      mensaje: { 
        nombreMensaje: "", 
        codigoBarrasMensaje: "", 
        precioMensaje: "",
        stockMensaje: "",
        categoriaMensaje: "",
        impuestosMensaje: ""
      },
      resultado: false,
    };
  },
  methods: {
    seleccionarOpcion(opcion) {
      this.opcionSeleccionada = opcion;
      this.limpiarMensajes();
    },
    regresarAOpciones() {
      this.opcionSeleccionada = "";
      this.limpiarFormularios();
      this.limpiarMensajes();
    },
    limpiarFormularios() {
      this.codigoBarras = null;
      this.nombre = null;
      this.precio = null;
      this.stock = null;
      this.categoria = null;
      this.impuestos = [];
    },
    limpiarMensajes() {
      this.errorMensaje = null;
      this.exitoMensaje = null;
      this.mensaje = { 
        nombreMensaje: "", 
        codigoBarrasMensaje: "", 
        precioMensaje: "",
        stockMensaje: "",
        categoriaMensaje: "",
        impuestosMensaje: ""
      };
      this.resultado = false;
    },
    agregarImpuesto() {
      this.impuestos.push({ tipo: '', valor: 0 });
    },
    eliminarImpuesto(index) {
      this.impuestos.splice(index, 1);
    },
    obtenerNombreImpuesto(tipo) {
      const nombres = {
        'iva': 'IVA (Impuesto al Valor Agregado)',
        'ice': 'ICE (Impuesto a Consumos Especiales)',
        'arancel': 'Aranceles de Importación',
        'isd': 'ISD (Impuesto a la Salida de Divisas)'
      };
      return nombres[tipo] || tipo;
    },
    convertirImpuestosDesdeBackend(impuestosBackend) {
      // Convierte desde formato backend List<String> a formato frontend
      if (!impuestosBackend || !Array.isArray(impuestosBackend)) return [];
      
      return impuestosBackend.map(impuestoStr => {
        // Suponiendo formato "tipo:valor" como "iva:15"
        const [tipo, valor] = impuestoStr.split(':');
        return {
          tipo: tipo || '',
          valor: parseFloat(valor) || 0
        };
      });
    },
    convertirImpuestosParaBackend(impuestosFrontend) {
      // Convierte desde formato frontend a formato backend List<String>
      return impuestosFrontend
        .filter(impuesto => impuesto.tipo && impuesto.valor !== null && impuesto.valor !== '')
        .map(impuesto => `${impuesto.tipo}:${impuesto.valor}`);
    },
    async consultar() {
      try {
        this.limpiarMensajes();
        if (!this.codigoBarras) {
          this.mensaje.codigoBarrasMensaje = "El código de barras es obligatorio";
          return;
        }
        const response = await consultarPorCodigoBarrasFachada(this.codigoBarras);
        this.nombre = response.nombre;
        this.precio = response.precio;
        this.stock = response.stock;
        this.categoria = response.categoria;
        this.impuestos = this.convertirImpuestosDesdeBackend(response.impuestos);
        this.exitoMensaje = "Consulta exitosa";
        this.resultado = true;
        // No limpiar formularios aquí para mantener los datos consultados
      } catch (error) {
        this.errorMensaje = "Error al consultar el producto";
        this.resultado = false;
      }
    },
    async guardar() {
      try {
        this.limpiarMensajes();
        let hayErrores = false;

        // Validar todos los campos obligatorios
        if (!this.codigoBarras || this.codigoBarras.trim() === "") {
          this.mensaje.codigoBarrasMensaje = "El código de barras es obligatorio";
          hayErrores = true;
        }
        if (!this.nombre || this.nombre.trim() === "") {
          this.mensaje.nombreMensaje = "El nombre es obligatorio";
          hayErrores = true;
        }
        if (!this.categoria || this.categoria === "") {
          this.mensaje.categoriaMensaje = "La categoría es obligatoria";
          hayErrores = true;
        }
        if (!this.precio || this.precio <= 0) {
          this.mensaje.precioMensaje = "El precio es obligatorio y debe ser mayor a 0";
          hayErrores = true;
        }
        if (this.stock === null || this.stock < 0) {
          this.mensaje.stockMensaje = "El stock es obligatorio y no puede ser negativo";
          hayErrores = true;
        }

        // Si hay errores, no continuar
        if (hayErrores) {
          return;
        }

        // Convertir impuestos al formato del backend (List<String>)
        const impuestosBackend = this.convertirImpuestosParaBackend(this.impuestos);

        const producto = {
          codigoBarras: this.codigoBarras.trim(),
          nombre: this.nombre.trim(),
          categoria: this.categoria,
          precio: parseFloat(this.precio),
          stock: parseInt(this.stock),
          impuestos: impuestosBackend,
        };
        
        console.log('Producto a enviar:', producto); // Debug
        await guardarFachada(producto);
        this.exitoMensaje = "Producto guardado exitosamente";
        this.limpiarFormularios();
      } catch (error) {
        this.errorMensaje = "Error al guardar el producto";
      }
    },
    async actualizar() {
      try {
        this.limpiarMensajes();
        let hayErrores = false;

        // Validar todos los campos obligatorios
        if (!this.codigoBarras || this.codigoBarras.trim() === "") {
          this.mensaje.codigoBarrasMensaje = "El código de barras es obligatorio";
          hayErrores = true;
        }
        if (!this.nombre || this.nombre.trim() === "") {
          this.mensaje.nombreMensaje = "El nombre es obligatorio";
          hayErrores = true;
        }
        if (!this.categoria || this.categoria === "") {
          this.mensaje.categoriaMensaje = "La categoría es obligatoria";
          hayErrores = true;
        }
        if (!this.precio || this.precio <= 0) {
          this.mensaje.precioMensaje = "El precio es obligatorio y debe ser mayor a 0";
          hayErrores = true;
        }
        if (this.stock === null || this.stock < 0) {
          this.mensaje.stockMensaje = "El stock es obligatorio y no puede ser negativo";
          hayErrores = true;
        }

        // Si hay errores, no continuar
        if (hayErrores) {
          return;
        }

        // Convertir impuestos al formato del backend (List<String>)
        const impuestosBackend = this.convertirImpuestosParaBackend(this.impuestos);

        const producto = {
          nombre: this.nombre.trim(),
          categoria: this.categoria,
          precio: parseFloat(this.precio),
          stock: parseInt(this.stock),
          impuestos: impuestosBackend,
        };
        
        console.log('Producto a actualizar:', producto); // Debug
        await actualizarFachada(producto, this.codigoBarras.trim());
        this.exitoMensaje = "Producto actualizado exitosamente";
        this.limpiarFormularios();
      } catch (error) {
        this.errorMensaje = "Error al actualizar el producto";
      }
    },
    async eliminar() {
      try {
        this.limpiarMensajes();
        if (!this.codigoBarras || this.codigoBarras.trim() === "") {
          this.mensaje.codigoBarrasMensaje = "El código de barras es obligatorio";
          return;
        }
        await eliminarFachada(this.codigoBarras.trim());
        this.exitoMensaje = "Producto eliminado exitosamente";
        this.limpiarFormularios();
      } catch (error) {
        this.errorMensaje = "Error al eliminar el producto";
      }
    },
  },
};
</script>

<style scoped>
.container-producto {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  background: #efefef;
  border-radius: 10px;
  padding: 20px;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
}

/* Estilos para las cartas */
.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -15px;
}

.col-lg-3, .col-md-6, .col-sm-6 {
  padding: 0 15px;
  flex: 0 0 auto;
}

.col-lg-3 {
  width: 25%;
}

.col-md-6 {
  width: 50%;
}

.col-sm-6 {
  width: 50%;
}

.mb-3 {
  margin-bottom: 1rem;
}

.mb-sm-4 {
  margin-bottom: 1.5rem;
}

.justify-content-center {
  justify-content: center;
}

.card {
  height: 200px;
  display: flex;
  align-items: center;
  text-align: center;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.card-body {
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.card i {
  font-size: 3rem;
  color: #4297b9;
  margin-bottom: 10px;
}

.card h3 {
  margin: 10px 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.card button {
  background-color: #4297b9;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  width: 100%;
}

.card button:hover {
  color: #3688a1;
  border: #3688a1 solid 2px;
  background: #fff;
}

/* Estilos para el botón regresar */
.container-regresar {
  margin-bottom: 20px;
}

.btn-regresar {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn-regresar:hover {
  background-color: #5a6268;
}

.btn-regresar i {
  margin-right: 5px;
}

/* Responsive design */
@media (max-width: 768px) {
  .col-lg-3, .col-md-6 {
    width: 100%;
  }
}

@media (min-width: 769px) and (max-width: 1199px) {
  .col-lg-3 {
    width: 50%;
  }
}

/* Estilos existentes para los formularios */
select {
  padding: 10px;
  font-size: 1rem;
  width: 100%;
  border-radius: 10px;
  border: 2px solid #4297b9;
}
select:focus {
  outline: none;
}
.container-consultar,
.container-guardar,
.container-actualizar,
.container-eliminar {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
input {
  padding: 10px;
  font-size: 1rem;
  width: 100%;
  border-radius: 5px;
  border: none;
  border-bottom: 3px solid #4297b9;
  margin-bottom: 10px;
}
input:focus {
  outline: none;
}
select {
  padding: 10px;
  font-size: 1rem;
  width: 100%;
  border-radius: 5px;
  border: none;
  border-bottom: 3px solid #4297b9;
  margin-bottom: 10px;
  background-color: white;
}
select:focus {
  outline: none;
}
button {
  background: #4297b9;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
}
button:hover {
  color: #3688a1;
  background: #efefef;
  border: #3688a1 2px solid;
}
.formulario {
  display: flex;
  flex-direction: column;
}
label {
  margin-top: 10px;
  font-weight: bold;
  text-align: left;
  color: #4297b9;
}
.container-mensaje {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
}
#exitoMensaje {
  padding: 10px;
  border-radius: 5px;
  color: #fff;
  background-color: #4caf50;
}
#errorMensaje {
  padding: 10px;
  border-radius: 5px;
  color: #fff;
  background-color: #f44336;
}
span {
  padding: 5px;
  border-radius: 5px;
  color: #fff;
  background-color: #ff9800;
  margin: 5px;
}
i {
  margin-right: 5px;
  font-size: 1.2rem;
}
.resultado {
  margin-top: 15px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 5px;
  border-left: 4px solid #4297b9;
}
.resultado p {
  margin: 5px 0;
  font-weight: 500;
}

/* Estilos para la sección de impuestos */
.impuestos-container {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  margin: 10px 0;
  background-color: #f8f9fa;
}

.impuesto-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding: 10px;
  background-color: white;
  border-radius: 5px;
  border: 1px solid #dee2e6;
}

.impuesto-select {
  flex: 2;
  padding: 8px;
  border: 1px solid #4297b9;
  border-radius: 4px;
  font-size: 0.9rem;
}

.impuesto-valor {
  flex: 1;
  padding: 8px;
  border: 1px solid #4297b9;
  border-radius: 4px;
  font-size: 0.9rem;
}

.btn-eliminar-impuesto {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  width: auto;
  margin: 0;
}

.btn-eliminar-impuesto:hover {
  background-color: #c82333;
  border: 2px solid #c82333;
  color: white;
}

.btn-agregar-impuesto {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  width: 100%;
  margin-top: 10px;
}

.btn-agregar-impuesto:hover {
  background-color: #218838;
  border: 2px solid #218838;
  color: white;
}

.impuestos-lista {
  list-style-type: none;
  padding: 0;
  margin: 10px 0;
}

.impuestos-lista li {
  padding: 8px 12px;
  margin: 5px 0;
  background-color: #e9ecef;
  border-radius: 4px;
  border-left: 4px solid #4297b9;
}

/* Responsive para impuestos */
@media (max-width: 768px) {
  .impuesto-item {
    flex-direction: column;
    gap: 5px;
  }
  
  .impuesto-select,
  .impuesto-valor {
    width: 100%;
  }
}
</style>