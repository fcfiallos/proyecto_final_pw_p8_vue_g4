<template>
  <div class="container-producto">
    <div class="header-container">
      <BotonRegresar :accion="regresarAOpciones" v-if="opcionSeleccionada" />
      <h2 v-if="!opcionSeleccionada">¿Qué acción deseas realizar con los productos?</h2>
    </div>
    <OpcionesSeleccion
      :cartas="cartas"
      :opcion-seleccionada="opcionSeleccionada"
      @opcion-seleccionada="seleccionarOpcion"
    />
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
      <label>
        Ingresa el c&oacute;digo de barras del producto que deseas consultar
      </label>
      <input
        type="text"
        v-model="codigoBarras"
        placeholder="Código de barras"
      />
      <span v-if="mensaje.codigoBarrasMensaje"
        ><i class="bi bi-exclamation-circle"></i>
        {{ mensaje.codigoBarrasMensaje }}</span
      >
      <button class="boton" @click="consultar">Consultar</button>
      <div class="resultado" v-if="resultado">
        <p>Nombre: {{ nombre }}</p>
        <p>Precio: ${{ precio }}</p>
        <p>Stock: {{ stock }}</p>
        <p>Categor&iacute;a: {{ categoria }}</p>
        <p v-if="bodegaNombre">Bodega: {{ bodegaNombre }}</p>
        <div v-if="impuestosSeleccionados && impuestosSeleccionados.length > 0">
          <p><strong>Impuestos:</strong></p>
          <ul class="impuestos-lista">
            <li v-for="impuestoId in impuestosSeleccionados" :key="impuestoId">
              {{ obtenerNombreImpuesto(impuestoId) }}
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
        <input
          type="text"
          v-model="codigoBarras"
          id="codigoBarras"
          placeholder="Código de barras"
        />
        <span v-if="mensaje.codigoBarrasMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.codigoBarrasMensaje }}</span
        >
        <label for="nombre">Nombre</label>
        <input
          type="text"
          v-model="nombre"
          id="nombre"
          placeholder="Nombre del producto"
        />
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
        <input
          type="number"
          step="0.01"
          v-model="precio"
          id="precio"
          placeholder="Precio del producto"
        />
        <span v-if="mensaje.precioMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.precioMensaje }}</span
        >
        <label for="stock">Stock</label>
        <input
          type="number"
          v-model="stock"
          id="stock"
          placeholder="Stock del producto"
        />
        <span v-if="mensaje.stockMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.stockMensaje }}</span
        >

        <label for="bodega">Bodega</label>
        <select v-model.number="bodegaId" id="bodega">
          <option value="">Selecciona una bodega</option>
          <option v-for="bodega in bodegasDisponibles" :key="bodega.id || bodega.codigo" :value="bodega.id || bodega.codigo">
            {{ bodega.nombre }} - {{ bodega.ubicacion }}
          </option>
        </select>
        <span v-if="mensaje.bodegaMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.bodegaMensaje }}</span
        >

        <!-- Sección de Impuestos -->
        <label>Impuestos</label>
        <GeneradorImpuesto
          :impuestos-seleccionados="impuestosSeleccionados"
          @update:impuestos-seleccionados="impuestosSeleccionados = $event"
          @error="errorMensaje = $event"
          @exito="exitoMensaje = $event"
          @error-impuesto="mensaje.impuestosMensaje = $event"
          @limpiar-mensajes="limpiarMensajes()"
        />
        <span v-if="mensaje.impuestosMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.impuestosMensaje }}</span
        >
      </div>
      <button class="boton" @click="guardar">Guardar</button>
    </div>
    <div
      class="container-actualizar"
      v-if="opcionSeleccionada === 'actualizar'"
    >
      <h3>Modificar Producto</h3>
      <input
        type="text"
        v-model="codigoBarras"
        placeholder="Código de barras"
      />
      <span v-if="mensaje.codigoBarrasMensaje"
        ><i class="bi bi-exclamation-circle"></i>
        {{ mensaje.codigoBarrasMensaje }}</span
      >
      <button class="boton" @click="consultar">Consultar</button>
      <div class="formulario">
        <label for="nombre">Nombre</label>
        <input type="text" v-model="nombre" id="nombre" placeholder="Nombre del producto"/>
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
        <input type="number" step="0.01" v-model="precio" id="precio" placeholder="Precio del producto"/>
        <span v-if="mensaje.precioMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.precioMensaje }}</span
        >
        <label for="stock">Stock</label>
        <input type="number" v-model="stock" id="stock" placeholder="Stock del producto"/>
        <span v-if="mensaje.stockMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.stockMensaje }}</span
        >

        <label for="bodega2">Bodega</label>
        <select v-model.number="bodegaId" id="bodega2">
          <option value="">Selecciona una bodega</option>
          <option v-for="bodega in bodegasDisponibles" :key="bodega.id || bodega.codigo" :value="bodega.id || bodega.codigo">
            {{ bodega.nombre }} - {{ bodega.ubicacion }}
          </option>
        </select>
        <span v-if="mensaje.bodegaMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.bodegaMensaje }}</span
        >

        <!-- Sección de Impuestos -->
        <label>Impuestos</label>
        <GeneradorImpuesto
          :impuestos-seleccionados="impuestosSeleccionados"
          @update:impuestos-seleccionados="impuestosSeleccionados = $event"
          @error="errorMensaje = $event"
          @exito="exitoMensaje = $event"
          @error-impuesto="mensaje.impuestosMensaje = $event"
          @limpiar-mensajes="limpiarMensajes()"
        />
        <span v-if="mensaje.impuestosMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.impuestosMensaje }}</span
        >
      </div>
      <button class="boton" @click="actualizar">Actualizar</button>
    </div>
    <div class="container-eliminar" v-if="opcionSeleccionada === 'eliminar'">
      <h3>Eliminar Producto</h3>
      <p>Ingresa el c&oacute;digo de barras del producto que deseas eliminar</p>
      <input
        type="text"
        v-model="codigoBarras"
        placeholder="Código de barras"
      />
      <span v-if="mensaje.codigoBarrasMensaje"
        ><i class="bi bi-exclamation-circle"></i>
        {{ mensaje.codigoBarrasMensaje }}</span
      >
      <button class="boton" @click="eliminar">Eliminar</button>
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
import { obtenerTodasFachada as obtenerTodasBodegasFachada } from "@/client/BodegaClient";
import BotonRegresar from "@/components/BotonRegresar.vue";
import OpcionesSeleccion from "@/components/OpcionesSeleccion.vue";
import GeneradorImpuesto from "@/components/GeneradorImpuesto.vue";

export default {
  components: {
    BotonRegresar,
    OpcionesSeleccion,
    GeneradorImpuesto,
  },
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
      bodegaId: null, // ID de la bodega seleccionada (number)
      bodegaNombre: null, // Nombre de la bodega para mostrar en consulta
      bodegasDisponibles: [], // Lista de bodegas del backend
      cargandoBodegas: false, // Estado de carga de bodegas
      impuestosSeleccionados: [], // Impuestos seleccionados para este producto
      impuestosDisponibles: [], // Lista de impuestos disponibles
      errorMensaje: null,
      exitoMensaje: null,
      mensaje: {
        nombreMensaje: "",
        codigoBarrasMensaje: "",
        precioMensaje: "",
        stockMensaje: "",
        categoriaMensaje: "",
        bodegaMensaje: "",
        impuestosMensaje: "",
      },
      resultado: false,
    };
  },
  watch: {
    // Watch para detectar cambios en bodegaId
    bodegaId(newVal, oldVal) {
      console.log(
        "bodegaId cambió de:",
        oldVal,
        "a:",
        newVal,
        "tipo:",
        typeof newVal
      );
    },
  },
  computed: {
    // Add any computed properties here if needed
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
      this.bodegaId = null;
      this.bodegaNombre = null;
      this.impuestosSeleccionados = [];
      this.nuevoImpuesto = { nombre: "", valor: 0, descripcion: "" };
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
        bodegaMensaje: "",
        impuestosMensaje: "",
      };
      this.resultado = false;
    },
    async cargarBodegasDisponibles() {
      try {
        this.bodegasDisponibles = await obtenerTodasBodegasFachada();
        console.log("Bodegas cargadas:", this.bodegasDisponibles);
        console.log("Número de bodegas:", this.bodegasDisponibles.length);

        // Debug: Mostrar estructura de cada bodega
        if (this.bodegasDisponibles.length > 0) {
          console.log("Primera bodega completa:", this.bodegasDisponibles[0]);
          console.log(
            "Campos disponibles:",
            Object.keys(this.bodegasDisponibles[0])
          );
        }
      } catch (error) {
        console.error("Error al cargar bodegas:", error);

        // Si es error 405, mostrar mensaje más específico
        if (error.response && error.response.status === 405) {
          console.warn("El endpoint para obtener bodegas no está disponible");
          this.bodegasDisponibles = [];
        } else {
          this.errorMensaje = "Error al cargar las bodegas disponibles";
        }
      }
    },
    async consultar() {
      try {
        this.limpiarMensajes();
        if (!this.codigoBarras) {
          this.mensaje.codigoBarrasMensaje =
            "El código de barras es obligatorio";
          return;
        }
        const response = await consultarPorCodigoBarrasFachada(
          this.codigoBarras
        );
        this.nombre = response.nombre;
        this.precio = response.precio;
        this.stock = response.stock;
        this.categoria = response.categoria;
        // Usar ID si existe, sino código
        this.bodegaId = response.bodega ? (response.bodega.id || response.bodega.codigo) : null;
        this.bodegaNombre = response.bodega ? `${response.bodega.nombre} - ${response.bodega.ubicacion}` : null;
        
        // Convertir los impuestos del backend (objetos) a IDs para los checkboxes
        this.impuestosSeleccionados = response.impuestos
          ? response.impuestos.map((imp) => imp.id)
          : [];
          
        // Intentar obtener la lista completa de impuestos disponibles para mostrar nombres
        this.impuestosDisponibles = response.impuestos || [];

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

        // Obtener impuestos disponibles del componente hijo
        this.obtenerImpuestosDisponibles();

        // Validar todos los campos obligatorios
        if (!this.codigoBarras || this.codigoBarras.trim() === "") {
          this.mensaje.codigoBarrasMensaje =
            "El código de barras es obligatorio";
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
          this.mensaje.precioMensaje =
            "El precio es obligatorio y debe ser mayor a 0";
          hayErrores = true;
        }
        if (this.stock === null || this.stock < 0) {
          this.mensaje.stockMensaje =
            "El stock es obligatorio y no puede ser negativo";
          hayErrores = true;
        }

        // Debug: Verificar el valor de bodegaId
        console.log(
          "Valor de bodegaId:",
          this.bodegaId,
          "Tipo:",
          typeof this.bodegaId
        );

        if (!this.bodegaId || this.bodegaId === "" || this.bodegaId === null) {
          this.mensaje.bodegaMensaje = "La bodega es obligatoria";
          hayErrores = true;
        }

        // Si hay errores, no continuar
        if (hayErrores) {
          return;
        }

        // Encontrar la bodega seleccionada
        const bodegaSeleccionada = this.bodegasDisponibles.find(b => 
          (b.id && b.id === this.bodegaId) || 
          (b.codigo && b.codigo === this.bodegaId)
        );
        
        console.log('Bodega seleccionada:', bodegaSeleccionada);

        // Construir el objeto bodega con la información necesaria
        let bodegaObj = {};
        if (bodegaSeleccionada) {
          // Incluir tanto id como codigo si están disponibles
          if (bodegaSeleccionada.id) {
            bodegaObj.id = bodegaSeleccionada.id;
          }
          if (bodegaSeleccionada.codigo) {
            bodegaObj.codigo = bodegaSeleccionada.codigo;
          }
        } else {
          // Si no encontramos la bodega, usar el valor seleccionado como fallback
          bodegaObj.id = this.bodegaId;
        }

        const producto = {
          codigoBarras: this.codigoBarras.trim(),
          nombre: this.nombre.trim(),
          categoria: this.categoria,
          precio: parseFloat(this.precio),
          stock: parseInt(this.stock),
          bodega: bodegaObj,
          impuestos: this.impuestosSeleccionados.map(id => ({ id }))
        };
        
        console.log('=== PRODUCTO A ENVIAR ===');
        console.log('Estructura completa:', JSON.stringify(producto, null, 2));
        console.log('bodega.id:', producto.bodega.id);
        console.log('bodega.codigo:', producto.bodega.codigo);
        console.log('========================');
        await guardarFachada(producto);
        this.exitoMensaje = "Producto guardado exitosamente";
        // Retrasar la limpieza del formulario para que el usuario vea el mensaje
        setTimeout(() => {
          this.limpiarFormularios();
        }, 1500);
      } catch (error) {
        this.errorMensaje = "Error al guardar el producto";
        console.error("Error al guardar el producto:", error);
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
          this.mensaje.precioMensaje = "El precio debe ser mayor que cero";
          hayErrores = true;
        }
        if (this.stock === null || this.stock < 0) {
          this.mensaje.stockMensaje = "El stock no puede ser negativo";
          hayErrores = true;
        }
        if (!this.bodegaId) {
          this.mensaje.bodegaMensaje = "La bodega es obligatoria";
          hayErrores = true;
        }

        // Si hay errores, no continuar
        if (hayErrores) {
          return;
        }

        // Debug: Verificar impuestos seleccionados
        console.log("Impuestos seleccionados para actualizar:", this.impuestosSeleccionados);
        
        // Encontrar la bodega seleccionada
        const bodegaSeleccionada = this.bodegasDisponibles.find(b => 
          (b.id && b.id === this.bodegaId) || 
          (b.codigo && b.codigo === this.bodegaId)
        );
        
        console.log('Bodega seleccionada para actualizar:', bodegaSeleccionada);

        // Construir el objeto bodega con la información necesaria
        let bodegaObj = {};
        if (bodegaSeleccionada) {
          // Incluir tanto id como codigo si están disponibles
          if (bodegaSeleccionada.id) {
            bodegaObj.id = bodegaSeleccionada.id;
          }
          if (bodegaSeleccionada.codigo) {
            bodegaObj.codigo = bodegaSeleccionada.codigo;
          }
        } else {
          // Si no encontramos la bodega, usar el valor seleccionado como fallback
          bodegaObj.id = this.bodegaId;
        }
        
        const producto = {
          nombre: this.nombre.trim(),
          categoria: this.categoria,
          precio: parseFloat(this.precio),
          stock: parseInt(this.stock),
          bodega: bodegaObj,
          impuestos: this.impuestosSeleccionados.map(id => ({ id }))
        };
        
        console.log('=== PRODUCTO A ACTUALIZAR ===');
        console.log('Estructura completa:', JSON.stringify(producto, null, 2));
        console.log('bodega.id:', producto.bodega.id);
        console.log('bodega.codigo:', producto.bodega.codigo);
        console.log('============================');
        
        await actualizarFachada(producto, this.codigoBarras.trim());
        this.exitoMensaje = "Producto actualizado exitosamente";
        // Retrasar la limpieza del formulario para que el usuario vea el mensaje
        setTimeout(() => {
          this.limpiarFormularios();
        }, 1500);
      } catch (error) {
        this.errorMensaje = "Error al actualizar el producto";
      }
    },
    async eliminar() {
      try {
        this.limpiarMensajes();
        if (!this.codigoBarras || this.codigoBarras.trim() === "") {
          this.mensaje.codigoBarrasMensaje =
            "El código de barras es obligatorio";
          return;
        }
        await eliminarFachada(this.codigoBarras.trim());
        this.exitoMensaje = "Producto eliminado exitosamente";
        this.limpiarFormularios();
      } catch (error) {
        this.errorMensaje = "Error al eliminar el producto";
        console.error("Error al eliminar el producto:", error);
      }
    },
    // Método para obtener el nombre de un impuesto a partir de su ID
    obtenerNombreImpuesto(impuestoId) {
      // Primero buscamos en impuestosDisponibles
      if (this.impuestosDisponibles && this.impuestosDisponibles.length > 0) {
        const impuesto = this.impuestosDisponibles.find(imp => imp.id === impuestoId);
        if (impuesto) {
          return `${impuesto.nombre} (${(impuesto.valor * 100).toFixed(2)}%)`;
        }
      }
      
      // Si no lo encontramos, intentamos obtenerlo de los componentes GeneradorImpuesto
      let generadorRef = null;
      if (this.$refs.generadorImpuesto) {
        generadorRef = this.$refs.generadorImpuesto;
      } else if (this.$refs.generadorImpuestoActualizar) {
        generadorRef = this.$refs.generadorImpuestoActualizar;
      }
      
      if (generadorRef && typeof generadorRef.getImpuestosDisponibles === 'function') {
        const impuestos = generadorRef.getImpuestosDisponibles();
        const impuesto = impuestos.find(imp => imp.id === impuestoId);
        if (impuesto) {
          return `${impuesto.nombre} (${(impuesto.valor * 100).toFixed(2)}%)`;
        }
      }
      
      // Si no encontramos información, mostramos solo el ID
      return `Impuesto ID: ${impuestoId}`;
    },
    
    // Método para obtener impuestos disponibles del componente hijo
    obtenerImpuestosDisponibles() {
      // Intentar obtener impuestos desde cualquiera de los componentes GeneradorImpuesto que pueda estar visible
      let generadorRef = null;
      
      if (this.opcionSeleccionada === 'guardar' && this.$refs.generadorImpuesto) {
        generadorRef = this.$refs.generadorImpuesto;
      } else if (this.opcionSeleccionada === 'actualizar' && this.$refs.generadorImpuestoActualizar) {
        generadorRef = this.$refs.generadorImpuestoActualizar;
      }
      
      if (generadorRef && typeof generadorRef.getImpuestosDisponibles === 'function') {
        this.impuestosDisponibles = generadorRef.getImpuestosDisponibles();
        console.log("Impuestos disponibles obtenidos:", this.impuestosDisponibles);
      } else {
        console.warn("No se pudo acceder al método getImpuestosDisponibles");
        // Si no se pudo obtener, simplificar la estructura de impuestos para enviar solo IDs
        this.impuestosDisponibles = [];
      }
    },
  },
  async mounted() {
    await this.cargarBodegasDisponibles();
  },
};
</script>

<style src="@/css/EstilosCards.css" scoped>
.container-producto {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  background: #efefef;
  border-radius: 10px;
  padding: 20px;
}
</style> 