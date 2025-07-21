<template>
  <div class="container-bodega">
    <select name="bodega" v-model="opcionSeleccionada">
      <option value="">Selecciona una opci&oacute;n</option>
      <option value="consultar">Consultar Bodega</option>
      <option value="guardar">Crear Bodega</option>
      <option value="actualizar">Actualizar Bodega</option>
      <option value="eliminar">Eliminar Bodega</option>
    </select>

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
      <p>Ingresa el c&oacute;digo de la bodega que deseas consultar</p>
      <input type="text" v-model="codigo" />
      <span v-if="mensaje.codigoMensaje"
        ><i class="bi bi-exclamation-circle"></i>
        {{ mensaje.codigoMensaje }}</span
      >
      <button @click="consultar">Consultar</button>
      <div class="resultado" v-if="resultado">
        <p >Nombre: {{ nombre }}</p>
        <p >Ubicaci&oacute;n: {{ ubicacion }}</p>
      </div>
    </div>
    <div class="container-guardar" v-if="opcionSeleccionada === 'guardar'">
      <h3>Crear una Nueva Bodega</h3>
      <p>Es necesario llenar todos los campos para guardar la bodega.</p>
      <div class="formulario">
        <label for="codigo">C&oacute;digo</label>
        <input type="text" v-model="codigo" id="codigo" />
        <span v-if="mensaje.codigoMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.codigoMensaje }}</span
        >
        <label for="nombre">Nombre</label>
        <input type="text" v-model="nombre" id="nombre" />
        <span v-if="mensaje.nombreMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.nombreMensaje }}</span
        >
        <label for="ubicacion">Ubicaci&oacute;n</label>
        <input type="text" v-model="ubicacion" id="ubicacion" />
        <span v-if="mensaje.ubicacionMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.ubicacionMensaje }}</span
        >
      </div>
      <button @click="guardar">Guardar</button>
    </div>
    <div
      class="container-actualizar"
      v-if="opcionSeleccionada === 'actualizar'"
    >
      <h3>Modificar Bodega</h3>
      <input type="text" v-model="codigo" />
      <span v-if="mensaje.codigoMensaje"
        ><i class="bi bi-exclamation-circle"></i>
        {{ mensaje.codigoMensaje }}</span
      >
      <button @click="consultar">Consultar</button>
      <div class="formulario">
        <label for="nombre">Nombre</label>
        <input type="text" v-model="nombre" id="nombre" />
        <span v-if="mensaje.nombreMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.nombreMensaje }}</span
        >
        <label for="ubicacion">Ubicaci&oacute;n</label>
        <input type="text" v-model="ubicacion" id="ubicacion" />
        <span v-if="mensaje.ubicacionMensaje"
          ><i class="bi bi-exclamation-circle"></i>
          {{ mensaje.ubicacionMensaje }}</span
        >
      </div>
      <button @click="actualizar">Actualizar</button>
    </div>
    <div class="container-eliminar" v-if="opcionSeleccionada === 'eliminar'">
      <h3>Eliminar Bodega</h3>
      <p>Ingresa el c&oacute;digo de la bodega que deseas eliminar</p>
      <input type="text" v-model="codigo" />
      <span v-if="mensaje.codigoMensaje"
        ><i class="bi bi-exclamation-circle"></i>
        {{ mensaje.codigoMensaje }}</span
      >
      <button @click="eliminar">Eliminar</button>
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
export default {
  data() {
    return {
      opcionSeleccionada: "",
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
    limpiarFormularios() {
      this.codigo = null;
      this.nombre = null;
      this.ubicacion = null;
    },
    limpiarMensajes() {
      this.errorMensaje = null;
      this.exitoMensaje = null;
      this.mensaje = { nombreMensaje: "", codigoMensaje: "", ubicacionMensaje: "" };
      this.resultado = false;
    },
    async consultar() {
      try {
        this.limpiarMensajes();
        if (!this.codigo) {
          this.mensaje.codigoMensaje = "El código es obligatorio";
          return;
        }
        const response = await consultarPorCodigoFachada(this.codigo);
        this.nombre = response.nombre;
        this.ubicacion = response.ubicacion;
        this.exitoMensaje = "Consulta exitosa";
        this.resultado = true;
        // No limpiar formularios aquí para mantener los datos consultados
      } catch (error) {
        this.errorMensaje = "Error al consultar la bodega";
        this.resultado = false;
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
        }
        if (!this.nombre || this.nombre.trim() === "") {
          this.mensaje.nombreMensaje = "El nombre es obligatorio";
          hayErrores = true;
        }
        if (!this.ubicacion || this.ubicacion.trim() === "") {
          this.mensaje.ubicacionMensaje = "La ubicación es obligatoria";
          hayErrores = true;
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
        await guardarFachada(bodega);
        this.exitoMensaje = "Bodega guardada exitosamente";
        this.limpiarFormularios();
      } catch (error) {
        this.errorMensaje = "Error al guardar la bodega";
      }
    },
    async actualizar() {
      try {
        this.limpiarMensajes();
        let hayErrores = false;

        // Validar todos los campos obligatorios
        if (!this.codigo || this.codigo.trim() === "") {
          this.mensaje.codigoMensaje = "El código es obligatorio";
          hayErrores = true;
        }
        if (!this.nombre || this.nombre.trim() === "") {
          this.mensaje.nombreMensaje = "El nombre es obligatorio";
          hayErrores = true;
        }
        if (!this.ubicacion || this.ubicacion.trim() === "") {
          this.mensaje.ubicacionMensaje = "La ubicación es obligatoria";
          hayErrores = true;
        }

        // Si hay errores, no continuar
        if (hayErrores) {
          return;
        }

        const bodega = {
          nombre: this.nombre.trim(),
          ubicacion: this.ubicacion.trim(),
        };
        await actualizarFachada(bodega, this.codigo.trim());
        this.exitoMensaje = "Bodega actualizada exitosamente";
        this.limpiarFormularios();
      } catch (error) {
        this.errorMensaje = "Error al actualizar la bodega";
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
        this.limpiarFormularios();
      } catch (error) {
        this.errorMensaje = "Error al eliminar la bodega";
      }
    },
  },
};
</script>

<style scoped>
.container-bodega {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  background: #efefef;
  border-radius: 10px;
  padding: 20px;
}

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
</style>