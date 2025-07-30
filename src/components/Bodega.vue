<template>
  <div class="container-bodega">
    <div class="header-container">
      <BotonRegresar :accion="regresarAOpciones" v-if="opcionSeleccionada" />
      <h2 v-if="!opcionSeleccionada">
        ¿Qué acción deseas realizar con las bodegas?
      </h2>
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
      <h3>Consultar Bodega</h3>
      <label>Ingresa el c&oacute;digo de la bodega que deseas consultar</label>
      <input type="text" v-model="codigo" placeholder="Código de bodega" />
      <span v-if="mensaje.codigoMensaje"
        ><i class="bi bi-exclamation-circle"></i>
        {{ mensaje.codigoMensaje }}</span
      >
      <button class="boton" @click="consultar">Consultar</button>
      <div class="resultado mb-3" v-if="resultado">
        <p>Nombre: {{ nombre }}</p>
        <p>Ubicaci&oacute;n: {{ ubicacion }}</p>
      </div>
    </div>
    <div class="container-guardar" v-if="opcionSeleccionada === 'guardar'">
      <h3>Crear una Nueva Bodega</h3>
      <p>Es necesario llenar todos los campos para guardar la bodega.</p>
      <div class="formulario">
        <label for="codigo">C&oacute;digo</label>
        <input
          type="text"
          v-model="codigo"
          id="codigo"
          placeholder="Código de bodega"
        />
        <span v-if="mensaje.codigoMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.codigoMensaje }}</span
        >
        <label for="nombre">Nombre</label>
        <input
          type="text"
          v-model="nombre"
          id="nombre"
          placeholder="Nombre de la bodega"
        />
        <span v-if="mensaje.nombreMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.nombreMensaje }}</span
        >
        <label for="ubicacion">Ubicaci&oacute;n</label>
        <input
          type="text"
          v-model="ubicacion"
          id="ubicacion"
          placeholder="Ubicación de la bodega"
        />
        <span v-if="mensaje.ubicacionMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.ubicacionMensaje }}</span
        >
      </div>
      <button class="boton" @click="guardar">Guardar</button>
    </div>
    <div
      class="container-actualizar"
      v-if="opcionSeleccionada === 'actualizar'"
    >
      <h3>Modificar Bodega</h3>
      <input type="text" v-model="codigo" placeholder="Código de bodega" />
      <span v-if="mensaje.codigoMensaje"
        ><i class="bi bi-exclamation-circle"></i>
        {{ mensaje.codigoMensaje }}</span
      >
      <button class="boton" @click="consultar">Consultar</button>
      <div class="formulario">
        <label for="nombre">Nombre</label>
        <input
          type="text"
          v-model="nombre"
          id="nombre"
          placeholder="Nombre de la bodega"
        />
        <span v-if="mensaje.nombreMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.nombreMensaje }}</span
        >
        <label for="ubicacion">Ubicaci&oacute;n</label>
        <input
          type="text"
          v-model="ubicacion"
          id="ubicacion"
          placeholder="Ubicación de la bodega"
        />
        <span v-if="mensaje.ubicacionMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.ubicacionMensaje }}</span
        >
      </div>
      <button class="boton" @click="actualizar">Actualizar</button>
    </div>
    <div class="container-eliminar" v-if="opcionSeleccionada === 'eliminar'">
      <h3>Eliminar Bodega</h3>
      <p>Ingresa el c&oacute;digo de la bodega que deseas eliminar</p>
      <input type="text" v-model="codigo" placeholder="Código de bodega" />
      <span v-if="mensaje.codigoMensaje"
        ><i class="bi bi-exclamation-circle"></i>
        {{ mensaje.codigoMensaje }}</span
      >
      <button class="boton" @click="eliminar">Eliminar</button>
    </div>
  </div>
</template>

<script>
import {
  consultarPorCodigoFachada,
  guardarFachada,
  actualizarFachada,
  eliminarFachada,
} from "@/client/BodegaClient";
import BotonRegresar from "@/components/BotonRegresar.vue";
import OpcionesSeleccion from "@/components/OpcionesSeleccion.vue";

export default {
  components: {
    BotonRegresar,
    OpcionesSeleccion,
  },
  data() {
    return {
      opcionSeleccionada: "",
      cartas: [
        {
          titulo: "Consultar Bodega",
          boton: "Consultar",
          valor: "consultar",
          icono: "bi bi-search",
        },
        {
          titulo: "Crear Bodega",
          boton: "Crear",
          valor: "guardar",
          icono: "bi bi-plus-circle",
        },
        {
          titulo: "Actualizar Bodega",
          boton: "Actualizar",
          valor: "actualizar",
          icono: "bi bi-pencil-square",
        },
        {
          titulo: "Eliminar Bodega",
          boton: "Eliminar",
          valor: "eliminar",
          icono: "bi bi-trash",
        },
      ],
      codigo: null,
      nombre: null,
      ubicacion: null,
      errorMensaje: null,
      exitoMensaje: null,
      mensaje: { nombreMensaje: "", codigoMensaje: "", ubicacionMensaje: "" },
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
      this.codigo = null;
      this.nombre = null;
      this.ubicacion = null;
    },
    limpiarMensajes() {
      this.errorMensaje = null;
      this.exitoMensaje = null;
      this.mensaje = {
        nombreMensaje: "",
        codigoMensaje: "",
        ubicacionMensaje: "",
      };
      this.resultado = false;
    },
    async consultar() {
      try {
        this.limpiarMensajes();
        if (!this.codigo) {
          this.mensaje.codigoMensaje = "El código es obligatorio";
          this.$nextTick(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          });
          setTimeout(() => {
            this.mensaje.codigoMensaje = "";
          }, 3000);
          return;
        }
        if (this.codigo.trim() === "") {
          this.mensaje.codigoMensaje = "El código no puede estar vacío";
          this.$nextTick(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          });
          setTimeout(() => {
            this.mensaje.codigoMensaje = "";
          }, 3000);
          return;
        }

        const response = await consultarPorCodigoFachada(this.codigo);
        if (!response) {
          this.errorMensaje = "No se encontró ninguna bodega con ese código.";
          this.resultado = false;
          this.$nextTick(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          });
          setTimeout(() => {
            this.errorMensaje = null;
          }, 3000);
          return;
        }
        this.nombre = response.nombre;
        this.ubicacion = response.ubicacion;
        this.exitoMensaje = "Consulta exitosa";
        this.resultado = true;
        this.$nextTick(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        setTimeout(() => {
          this.exitoMensaje = null;
        }, 3000);
      } catch (error) {
        this.errorMensaje = "Error al consultar la bodega";
        this.resultado = false;
        this.$nextTick(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        setTimeout(() => {
          this.errorMensaje = null;
        }, 3000);
      }
    },
    async guardar() {
      try {
        this.limpiarMensajes();
        let hayErrores = false;

        // Validar todos los campos obligatorios
        if (!this.codigo || this.codigo.trim() === "") {
          this.mensaje.codigoMensaje = "El código es obligatorio";
          hayErrores = true;
          setTimeout(() => {
            this.mensaje.codigoMensaje = "";
          }, 3000);
        }
        if (!this.nombre || this.nombre.trim() === "") {
          this.mensaje.nombreMensaje = "El nombre es obligatorio";
          hayErrores = true;
          setTimeout(() => {
            this.mensaje.nombreMensaje = "";
          }, 3000);
        }
        if (!this.ubicacion || this.ubicacion.trim() === "") {
          this.mensaje.ubicacionMensaje = "La ubicación es obligatoria";
          hayErrores = true;
          setTimeout(() => {
            this.mensaje.ubicacionMensaje = "";
          }, 3000);
        }

        // Si hay errores, no continuar
        if (hayErrores) {
          return;
        }

        const bodega = {
          nombre: this.nombre.trim(),
          codigo: this.codigo.trim(),
          ubicacion: this.ubicacion.trim(),
        };

        if (await consultarPorCodigoFachada(bodega.codigo)) {
          this.errorMensaje = "Ya existe una bodega con ese código";
          this.$nextTick(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          });
          setTimeout(() => {
            this.errorMensaje = null;
          }, 3000);
          return;
        }
        await guardarFachada(bodega);
        this.exitoMensaje = "Bodega guardada exitosamente";
        this.$nextTick(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        setTimeout(() => {
          this.exitoMensaje = null;
        }, 3000);
        this.limpiarFormularios();
      } catch (error) {
        this.errorMensaje = "Error al guardar la bodega";
        this.$nextTick(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        setTimeout(() => {
          this.errorMensaje = null;
        }, 3000);
      }
    },
    async actualizar() {
      try {
        this.limpiarMensajes();
        let hayErrores = false;

        // Validar que al menos tengamos el código (necesario para identificar la bodega)
        if (!this.codigo || this.codigo.trim() === "") {
          this.mensaje.codigoMensaje = "El código es obligatorio";
          return;
        }

        // Crear un objeto que solo contendrá los campos modificados
        const bodegaActualizada = {};

        // Solo incluir campos si tienen valor y han sido modificados
        if (this.nombre && this.nombre.trim() !== "") {
          bodegaActualizada.nombre = this.nombre.trim();
        }

        if (this.ubicacion && this.ubicacion.trim() !== "") {
          bodegaActualizada.ubicacion = this.ubicacion.trim();
        }

        // Verificar que al menos hay un campo para actualizar
        if (Object.keys(bodegaActualizada).length === 0) {
          this.mensaje.generalMensaje = "No hay cambios para actualizar";
          setTimeout(() => {
            this.mensaje.generalMensaje = "";
          }, 3000);
          return;
        }

        await actualizarFachada(bodegaActualizada, this.codigo.trim());
        this.exitoMensaje = "Bodega actualizada exitosamente";
        this.$nextTick(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        setTimeout(() => {
          this.exitoMensaje = null;
        }, 3000);
        this.limpiarFormularios();
      } catch (error) {
        this.errorMensaje = "Error al actualizar la bodega";
        this.$nextTick(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        setTimeout(() => {
          this.errorMensaje = null;
        }, 3000);
      }
    },
    async eliminar() {
      try {
        this.limpiarMensajes();
        if (!this.codigo || this.codigo.trim() === "") {
          this.mensaje.codigoMensaje = "El código es obligatorio";
          return;
        }
        await eliminarFachada(this.codigo.trim());
        this.exitoMensaje = "Bodega eliminada exitosamente";
        this.$nextTick(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        setTimeout(() => {
          this.exitoMensaje = null;
        }, 3000);
        this.limpiarFormularios();
      } catch (error) {
        this.errorMensaje = "Error al eliminar la bodega";
        this.$nextTick(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        setTimeout(() => {
          this.errorMensaje = null;
        }, 3000);
      }
    },
  },
};
</script>

<style src="@/css/EstilosCards.css"  scoped>
.container-bodega {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  background: #e3edff;
  border-radius: 0;
  padding: 20px;
  min-height: 100vh;
}
</style>