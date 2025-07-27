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
        <p v-if="bodegaNombre">Bodega: {{ bodegaNombre }}</p>
        <div v-if="impuestosSeleccionadosCompletos && impuestosSeleccionadosCompletos.length > 0">
          <p><strong>Impuestos:</strong></p>
          <ul class="impuestos-lista">
            <li v-for="impuesto in impuestosSeleccionadosCompletos" :key="impuesto.id">
              {{ impuesto.nombre }}: {{ (impuesto.valor * 100).toFixed(2) }}%
              <small v-if="impuesto.descripcion" class="text-muted"> - {{ impuesto.descripcion }}</small>
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
        
        <label for="bodega">Bodega</label>
        <select v-model.number="bodegaId" id="bodega">
          <option value="">Selecciona una bodega</option>
          <option v-for="bodega in bodegasDisponibles" :key="bodega.id" :value="bodega.id">
            {{ bodega.nombre }} - {{ bodega.ubicacion }}
          </option>
        </select>
        <span v-if="mensaje.bodegaMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.bodegaMensaje }}</span
        >
        
        <!-- Sección de Impuestos -->
        <label>Impuestos</label>
        <div class="impuestos-section">
          <div class="impuestos-disponibles">
            <h5>Impuestos Disponibles</h5>
            <div class="loading" v-if="cargandoImpuestos">
              <i class="bi bi-arrow-clockwise"></i> Cargando impuestos...
            </div>
            <div v-else-if="impuestosDisponibles.length === 0" class="no-impuestos">
              <p>No hay impuestos registrados.</p>
              <button type="button" @click="mostrarFormularioImpuesto = true" class="btn-crear-impuesto">
                <i class="bi bi-plus"></i> Crear Primer Impuesto
              </button>
            </div>
            <div v-else class="impuestos-grid">
              <div 
                v-for="impuesto in impuestosDisponibles" 
                :key="impuesto.id"
                class="impuesto-checkbox"
              >
                <label>
                  <input 
                    type="checkbox" 
                    :value="impuesto.id"
                    v-model="impuestosSeleccionados"
                  />
                  <span class="checkmark"></span>
                  <div class="impuesto-info">
                    <strong>{{ impuesto.nombre }}</strong>
                    <span class="impuesto-valor">{{ (impuesto.valor * 100).toFixed(2) }}%</span>
                    <small v-if="impuesto.descripcion" class="impuesto-descripcion">{{ impuesto.descripcion }}</small>
                  </div>
                </label>
              </div>
            </div>
            <button 
              type="button" 
              @click="mostrarFormularioImpuesto = !mostrarFormularioImpuesto" 
              class="btn-toggle-formulario"
              v-if="impuestosDisponibles.length > 0"
            >
              <i class="bi" :class="mostrarFormularioImpuesto ? 'bi-dash' : 'bi-plus'"></i>
              {{ mostrarFormularioImpuesto ? 'Cancelar' : 'Crear Nuevo Impuesto' }}
            </button>
          </div>

          <!-- Formulario para crear nuevo impuesto -->
          <div v-if="mostrarFormularioImpuesto" class="formulario-impuesto">
            <h5>Crear Nuevo Impuesto</h5>
            <div class="form-group">
              <label for="nuevoImpuestoNombre">Nombre</label>
              <input 
                type="text" 
                id="nuevoImpuestoNombre"
                v-model="nuevoImpuesto.nombre" 
                placeholder="Ej: IVA, ICE, etc."
                maxlength="50"
              />
            </div>
            <div class="form-group">
              <label for="nuevoImpuestoValor">Valor (%)</label>
              <input 
                type="number" 
                step="0.0001" 
                min="0"
                max="100"
                id="nuevoImpuestoValor"
                v-model="nuevoImpuesto.valor" 
                placeholder="Ej: 15.0000"
              />
              <small class="text-muted">Ingrese el porcentaje (ej: 15 para 15%)</small>
            </div>
            <div class="form-group">
              <label for="nuevoImpuestoDescripcion">Descripción (Opcional)</label>
              <textarea 
                id="nuevoImpuestoDescripcion"
                v-model="nuevoImpuesto.descripcion" 
                placeholder="Descripción del impuesto..."
                maxlength="200"
                rows="3"
              ></textarea>
            </div>
            <div class="botones-formulario">
              <button type="button" @click="crearImpuesto" class="btn-guardar-impuesto">
                <i class="bi bi-check"></i> Guardar
              </button>
              <button type="button" @click="cancelarCreacionImpuesto" class="btn-cancelar">
                <i class="bi bi-x"></i> Cancelar
              </button>
            </div>
          </div>
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
        
        <label for="bodega2">Bodega</label>
        <select v-model.number="bodegaId" id="bodega2">
          <option value="">Selecciona una bodega</option>
          <option v-for="bodega in bodegasDisponibles" :key="bodega.id" :value="bodega.id">
            {{ bodega.nombre }} - {{ bodega.ubicacion }}
          </option>
        </select>
        <span v-if="mensaje.bodegaMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.bodegaMensaje }}</span
        >
        
        <!-- Sección de Impuestos -->
        <label>Impuestos</label>
        <div class="impuestos-section">
          <div class="impuestos-disponibles">
            <h5>Impuestos Disponibles</h5>
            <div class="loading" v-if="cargandoImpuestos">
              <i class="bi bi-arrow-clockwise"></i> Cargando impuestos...
            </div>
            <div v-else-if="impuestosDisponibles.length === 0" class="no-impuestos">
              <p>No hay impuestos registrados.</p>
              <button type="button" @click="mostrarFormularioImpuesto = true" class="btn-crear-impuesto">
                <i class="bi bi-plus"></i> Crear Primer Impuesto
              </button>
            </div>
            <div v-else class="impuestos-grid">
              <div 
                v-for="impuesto in impuestosDisponibles" 
                :key="impuesto.id"
                class="impuesto-checkbox"
              >
                <label>
                  <input 
                    type="checkbox" 
                    :value="impuesto.id"
                    v-model="impuestosSeleccionados"
                  />
                  <span class="checkmark"></span>
                  <div class="impuesto-info">
                    <strong>{{ impuesto.nombre }}</strong>
                    <span class="impuesto-valor">{{ impuesto.valor }}%</span>
                  </div>
                </label>
              </div>
            </div>
            <button 
              type="button" 
              @click="mostrarFormularioImpuesto = !mostrarFormularioImpuesto" 
              class="btn-toggle-formulario"
              v-if="impuestosDisponibles.length > 0"
            >
              <i class="bi" :class="mostrarFormularioImpuesto ? 'bi-dash' : 'bi-plus'"></i>
              {{ mostrarFormularioImpuesto ? 'Cancelar' : 'Crear Nuevo Impuesto' }}
            </button>
          </div>

          <!-- Formulario para crear nuevo impuesto -->
          <div v-if="mostrarFormularioImpuesto" class="formulario-impuesto">
            <h5>Crear Nuevo Impuesto</h5>
            <div class="form-group">
              <label for="nuevoImpuestoNombre2">Nombre</label>
              <input 
                type="text" 
                id="nuevoImpuestoNombre2"
                v-model="nuevoImpuesto.nombre" 
                placeholder="Ej: IVA, ICE, etc."
                maxlength="50"
              />
            </div>
            <div class="form-group">
              <label for="nuevoImpuestoValor2">Valor (%)</label>
              <input 
                type="number" 
                step="0.0001" 
                min="0"
                max="100"
                id="nuevoImpuestoValor2"
                v-model="nuevoImpuesto.valor" 
                placeholder="Ej: 15.0000"
              />
              <small class="text-muted">Ingrese el porcentaje (ej: 15 para 15%)</small>
            </div>
            <div class="form-group">
              <label for="nuevoImpuestoDescripcion2">Descripción (Opcional)</label>
              <textarea 
                id="nuevoImpuestoDescripcion2"
                v-model="nuevoImpuesto.descripcion" 
                placeholder="Descripción del impuesto..."
                maxlength="200"
                rows="3"
              ></textarea>
            </div>
            <div class="botones-formulario">
              <button type="button" @click="crearImpuesto" class="btn-guardar-impuesto">
                <i class="bi bi-check"></i> Guardar
              </button>
              <button type="button" @click="cancelarCreacionImpuesto" class="btn-cancelar">
                <i class="bi bi-x"></i> Cancelar
              </button>
            </div>
          </div>
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
import {
  obtenerTodosFachada as obtenerTodosImpuestosFachada,
  guardarFachada as guardarImpuestoFachada,
  eliminarFachada as eliminarImpuestoFachada,
} from "@/client/ImpuestoClient";
import {
  obtenerTodasFachada as obtenerTodasBodegasFachada,
} from "@/client/BodegaClient";
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
      bodegaId: null, // ID de la bodega seleccionada (number)
      bodegaNombre: null, // Nombre de la bodega para mostrar en consulta
      bodegasDisponibles: [], // Lista de bodegas del backend
      cargandoBodegas: false, // Estado de carga de bodegas
      impuestosDisponibles: [], // Lista de impuestos del backend
      impuestosSeleccionados: [], // Impuestos seleccionados para este producto
      nuevoImpuesto: { nombre: '', valor: 0, descripcion: '' }, // Para crear nuevos impuestos
      mostrarFormularioImpuesto: false, // Control para mostrar/ocultar formulario
      cargandoImpuestos: false, // Estado de carga
      errorMensaje: null,
      exitoMensaje: null,
      mensaje: { 
        nombreMensaje: "", 
        codigoBarrasMensaje: "", 
        precioMensaje: "",
        stockMensaje: "",
        categoriaMensaje: "",
        bodegaMensaje: "",
        impuestosMensaje: ""
      },
      resultado: false,
    };
  },
  watch: {
    // Watch para detectar cambios en bodegaId
    bodegaId(newVal, oldVal) {
      console.log('bodegaId cambió de:', oldVal, 'a:', newVal, 'tipo:', typeof newVal);
    }
  },
  computed: {
    // Computed property para mostrar los impuestos seleccionados como objetos completos
    impuestosSeleccionadosCompletos() {
      if (!this.impuestosSeleccionados || this.impuestosSeleccionados.length === 0) {
        return [];
      }
      
      return this.impuestosSeleccionados.map(impuestoId => {
        return this.impuestosDisponibles.find(imp => imp.id === impuestoId);
      }).filter(impuesto => impuesto !== undefined);
    }
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
      this.nuevoImpuesto = { nombre: '', valor: 0, descripcion: '' };
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
        impuestosMensaje: ""
      };
      this.resultado = false;
    },
    async cargarImpuestosDisponibles() {
      try {
        this.impuestosDisponibles = await obtenerTodosImpuestosFachada();
      } catch (error) {
        console.error('Error al cargar impuestos:', error);
        this.errorMensaje = "Error al cargar los impuestos disponibles";
      }
    },
    async cargarBodegasDisponibles() {
      try {
        this.bodegasDisponibles = await obtenerTodasBodegasFachada();
        console.log('Bodegas cargadas:', this.bodegasDisponibles);
        console.log('Número de bodegas:', this.bodegasDisponibles.length);
        
        // Debug: Mostrar estructura de cada bodega
        if (this.bodegasDisponibles.length > 0) {
          console.log('Primera bodega completa:', this.bodegasDisponibles[0]);
          console.log('Campos disponibles:', Object.keys(this.bodegasDisponibles[0]));
        }
      } catch (error) {
        console.error('Error al cargar bodegas:', error);
        
        // Si es error 405, mostrar mensaje más específico
        if (error.response && error.response.status === 405) {
          console.warn('El endpoint para obtener bodegas no está disponible');
          this.bodegasDisponibles = [];
        } else {
          this.errorMensaje = "Error al cargar las bodegas disponibles";
        }
      }
    },
    toggleImpuesto(impuesto, event) {
      if (event.target.checked) {
        // Agregar impuesto si no está ya seleccionado
        if (!this.estaSeleccionado(impuesto.id)) {
          this.impuestosSeleccionados.push(impuesto);
        }
      } else {
        // Remover impuesto
        this.removerImpuesto(impuesto.id);
      }
    },
    estaSeleccionado(impuestoId) {
      return this.impuestosSeleccionados.includes(impuestoId);
    },
    removerImpuesto(impuestoId) {
      this.impuestosSeleccionados = this.impuestosSeleccionados.filter(id => id !== impuestoId);
    },
    async crearNuevoImpuesto() {
      if (!this.nuevoImpuesto.nombre || !this.nuevoImpuesto.valor) {
        this.mensaje.impuestosMensaje = "Nombre y valor son obligatorios para crear un impuesto";
        return;
      }
      
      if (parseFloat(this.nuevoImpuesto.valor) < 0 || parseFloat(this.nuevoImpuesto.valor) > 100) {
        this.mensaje.impuestosMensaje = "El valor debe estar entre 0 y 100";
        return;
      }
      
      try {
        // Convertir el porcentaje a decimal para el backend (15% -> 0.15)
        const impuestoParaEnviar = {
          nombre: this.nuevoImpuesto.nombre.trim(),
          valor: parseFloat(this.nuevoImpuesto.valor) / 100,
          descripcion: this.nuevoImpuesto.descripcion ? this.nuevoImpuesto.descripcion.trim() : null
        };
        
        console.log('Enviando impuesto al backend:', impuestoParaEnviar);
        await guardarImpuestoFachada(impuestoParaEnviar);
        this.exitoMensaje = "Impuesto creado exitosamente";
        this.nuevoImpuesto = { nombre: '', valor: 0, descripcion: '' };
        this.mostrarFormularioImpuesto = false;
        
        // Recargar lista de impuestos disponibles
        await this.cargarImpuestosDisponibles();
      } catch (error) {
        console.error('Error al crear impuesto:', error);
        if (error.response && error.response.status === 409) {
          this.mensaje.impuestosMensaje = "Ya existe un impuesto con ese nombre";
        } else if (error.response && error.response.status === 400) {
          this.mensaje.impuestosMensaje = "Datos inválidos. Verifique el nombre y valor";
        } else {
          this.errorMensaje = "Error al crear el impuesto";
        }
      }
    },
    // Función para crear impuesto (alias para compatibilidad con template)
    async crearImpuesto() {
      await this.crearNuevoImpuesto();
    },
    // Función para cancelar la creación de impuesto
    cancelarCreacionImpuesto() {
      this.mostrarFormularioImpuesto = false;
      this.nuevoImpuesto = { nombre: '', valor: 0, descripcion: '' };
      this.limpiarMensajes();
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
        // Usar ID de bodega (ahora disponible en BodegaTO)
        this.bodegaId = response.bodega ? response.bodega.id : null;
        this.bodegaNombre = response.bodega ? `${response.bodega.nombre} - ${response.bodega.ubicacion}` : null;
        
        // Convertir los impuestos del backend (objetos) a IDs para los checkboxes
        this.impuestosSeleccionados = response.impuestos ? response.impuestos.map(imp => imp.id) : [];
        
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
        
        // Debug: Verificar el valor de bodegaId
        console.log('Valor de bodegaId:', this.bodegaId, 'Tipo:', typeof this.bodegaId);
        
        if (!this.bodegaId || this.bodegaId === "" || this.bodegaId === null) {
          this.mensaje.bodegaMensaje = "La bodega es obligatoria";
          hayErrores = true;
        }

        // Si hay errores, no continuar
        if (hayErrores) {
          return;
        }

        // Encontrar la bodega seleccionada por ID
        const bodegaSeleccionada = this.bodegasDisponibles.find(b => 
          b.id === this.bodegaId
        );
        
        console.log('Bodega seleccionada:', bodegaSeleccionada);
        console.log('BodegaId a buscar:', this.bodegaId, 'tipo:', typeof this.bodegaId);
        console.log('IDs disponibles:', this.bodegasDisponibles.map(b => b.id));
        
        // Si no se encontró la bodega por ID, buscar por código como fallback
        if (!bodegaSeleccionada) {
          console.warn('No se encontró bodega por ID, intentando buscar por código...');
          const bodegaPorCodigo = this.bodegasDisponibles.find(b => 
            b.codigo === String(this.bodegaId)
          );
          console.log('Bodega encontrada por código:', bodegaPorCodigo);
        }

        const producto = {
          codigoBarras: this.codigoBarras.trim(),
          nombre: this.nombre.trim(),
          categoria: this.categoria,
          precio: parseFloat(this.precio),
          stock: parseInt(this.stock),
          bodega: bodegaSeleccionada ? {
            id: bodegaSeleccionada.id,
            codigo: bodegaSeleccionada.codigo,
            nombre: bodegaSeleccionada.nombre,
            ubicacion: bodegaSeleccionada.ubicacion
          } : { id: this.bodegaId },
          impuestos: this.impuestosSeleccionados.map(impuestoId => {
            const impuesto = this.impuestosDisponibles.find(imp => imp.id === impuestoId);
            return {
              id: impuesto.id,
              nombre: impuesto.nombre,
              valor: impuesto.valor
            };
          }),
        };
        
        console.log('=== PRODUCTO A ENVIAR ===');
        console.log('Estructura completa:', JSON.stringify(producto, null, 2));
        console.log('bodega.id:', producto.bodega?.id);
        console.log('bodega.codigo:', producto.bodega?.codigo);
        console.log('bodega.nombre:', producto.bodega?.nombre);
        console.log('Verificando tipos:');
        console.log('- ID es:', typeof producto.bodega?.id, producto.bodega?.id);
        console.log('- Codigo es:', typeof producto.bodega?.codigo, producto.bodega?.codigo);
        console.log('========================');
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
        if (!this.bodegaId) {
          this.mensaje.bodegaMensaje = "La bodega es obligatoria";
          hayErrores = true;
        }

        // Si hay errores, no continuar
        if (hayErrores) {
          return;
        }

        // Encontrar la bodega seleccionada por ID
        const bodegaSeleccionada = this.bodegasDisponibles.find(b => 
          b.id === this.bodegaId
        );
        
        console.log('Bodega seleccionada para actualizar:', bodegaSeleccionada);
        console.log('BodegaId a buscar:', this.bodegaId, 'tipo:', typeof this.bodegaId);
        console.log('IDs disponibles:', this.bodegasDisponibles.map(b => b.id));

        const producto = {
          nombre: this.nombre.trim(),
          categoria: this.categoria,
          precio: parseFloat(this.precio),
          stock: parseInt(this.stock),
          bodega: bodegaSeleccionada ? {
            id: bodegaSeleccionada.id,
            codigo: bodegaSeleccionada.codigo,
            nombre: bodegaSeleccionada.nombre,
            ubicacion: bodegaSeleccionada.ubicacion
          } : { id: this.bodegaId },
          impuestos: this.impuestosSeleccionados.map(impuestoId => {
            const impuesto = this.impuestosDisponibles.find(imp => imp.id === impuestoId);
            return {
              id: impuesto.id,
              nombre: impuesto.nombre,
              valor: impuesto.valor
            };
          }),
        };
        
        console.log('=== PRODUCTO A ACTUALIZAR ===');
        console.log('Estructura completa:', JSON.stringify(producto, null, 2));
        console.log('bodega.id:', producto.bodega?.id);
        console.log('bodega.codigo:', producto.bodega?.codigo);
        console.log('============================');
        
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
  async mounted() {
    await this.cargarImpuestosDisponibles();
    await this.cargarBodegasDisponibles();
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
.impuestos-section {
  margin: 20px 0;
  padding: 20px;
  border: 2px solid #ddd;
  border-radius: 10px;
  background-color: #f9f9f9;
}

.impuestos-disponibles h5 {
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
}

.loading {
  text-align: center;
  color: #666;
  padding: 20px;
}

.loading i {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.no-impuestos {
  text-align: center;
  padding: 20px;
  color: #666;
}

.btn-crear-impuesto {
  background: linear-gradient(45deg, #28a745, #20c997);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-crear-impuesto:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
}

.impuestos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.impuesto-checkbox {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 15px;
  transition: all 0.3s ease;
  cursor: pointer;
  display: block;
}

.impuesto-checkbox:hover {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
}

.impuesto-checkbox label {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 0;
}

.impuesto-checkbox input[type="checkbox"] {
  margin-right: 12px;
  transform: scale(1.2);
}

.impuesto-info {
  display: flex;
  flex-direction: column;
}

.impuesto-info strong {
  color: #333;
  font-size: 14px;
}

.impuesto-valor {
  color: #666;
  font-size: 12px;
  margin-top: 2px;
}

.impuesto-descripcion {
  display: block;
  color: #888;
  font-size: 11px;
  font-style: italic;
  margin-top: 2px;
}

.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  resize: vertical;
  font-family: inherit;
}

.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
}

.form-group .text-muted {
  font-size: 12px;
  color: #6c757d;
  margin-top: 5px;
  display: block;
}

.btn-toggle-formulario {
  background: linear-gradient(45deg, #17a2b8, #6f42c1);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 10px;
}

.btn-toggle-formulario:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(23, 162, 184, 0.3);
}

.formulario-impuesto {
  background: white;
  border: 2px solid #007bff;
  border-radius: 10px;
  padding: 20px;
  margin-top: 15px;
}

.formulario-impuesto h5 {
  color: #007bff;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
}

.botones-formulario {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-guardar-impuesto {
  background: linear-gradient(45deg, #28a745, #20c997);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  flex: 1;
}

.btn-guardar-impuesto:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
}

.btn-cancelar {
  background: linear-gradient(45deg, #dc3545, #c82333);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  flex: 1;
}

.btn-cancelar:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
}
</style>