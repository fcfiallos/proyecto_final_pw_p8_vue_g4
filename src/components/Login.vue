<template>
  <section class="login-background">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <div class="card bg-light text-dark" style="border-radius: 1rem">
            <div class="card-body p-5 text-center">
              <!-- === FORMULARIO DE LOGIN === -->
              <div v-if="!mostrarRegistro" class="form-container">
                <form @submit.prevent="iniciarSesion" novalidate>
                  <h2 class="fw-bold mb-2 text-uppercase">Iniciar Sesión</h2>
                  <p class="text-dark-50 mb-5">
                    Por favor, ingrese su cédula y apellido
                  </p>

                  <div class="form-outline form-black mb-4">
                    <input
                      type="text"
                      id="typeCedulaX"
                      class="form-control form-control-lg"
                      v-model="loginData.cedula"
                    />
                    <label class="form-label" for="typeCedulaX">Cédula</label>
                  </div>

                  <div class="form-outline form-black mb-4">
                    <input
                      type="password"
                      id="typePasswordX"
                      class="form-control form-control-lg"
                      v-model="loginData.apellido"
                    />
                    <label class="form-label" for="typePasswordX"
                      >Contraseña (su Apellido)</label
                    >
                  </div>

                  <button class="btn btn-verde btn-lg px-5" type="submit">
                    Login
                  </button>
                </form>
              </div>

              <!-- === FORMULARIO DE REGISTRO === -->
              <div v-else class="form-container">
                <form @submit.prevent="registrarCliente" novalidate>
                  <h2 class="fw-bold mb-2 text-uppercase">Registro</h2>
                  <p class="text-dark-50 mb-5">Cree su cuenta de cliente</p>

                  <div class="form-outline form-black mb-4">
                    <input
                      type="text"
                      id="registerCedula"
                      class="form-control form-control-lg"
                      v-model="cliente.cedula"
                    />
                    <label class="form-label" for="registerCedula"
                      >Cédula</label
                    >
                    <span
                      class="error-campo"
                      v-if="mensajesValidacion.cedula"
                      >{{ mensajesValidacion.cedula }}</span
                    >
                  </div>

                  <div class="form-outline form-black mb-4">
                    <input
                      type="text"
                      id="registerNombre"
                      class="form-control form-control-lg"
                      v-model="cliente.nombre"
                    />
                    <label class="form-label" for="registerNombre"
                      >Nombre</label
                    >
                    <span
                      class="error-campo"
                      v-if="mensajesValidacion.nombre"
                      >{{ mensajesValidacion.nombre }}</span
                    >
                  </div>

                  <div class="form-outline form-black mb-4">
                    <input
                      type="text"
                      id="registerApellido"
                      class="form-control form-control-lg"
                      v-model="cliente.apellido"
                    />
                    <label class="form-label" for="registerApellido"
                      >Apellido (será su contraseña)</label
                    >
                    <span
                      class="error-campo"
                      v-if="mensajesValidacion.apellido"
                      >{{ mensajesValidacion.apellido }}</span
                    >
                  </div>

                  <div class="form-outline form-black mb-4">
                    <input
                      type="text"
                      id="registerDireccion"
                      class="form-control form-control-lg"
                      v-model="cliente.direccion"
                    />
                    <label class="form-label" for="registerDireccion"
                      >Dirección</label
                    >
                    <span
                      class="error-campo"
                      v-if="mensajesValidacion.direccion"
                      >{{ mensajesValidacion.direccion }}</span
                    >
                  </div>

                  <div class="form-outline form-black mb-4">
                    <input
                      type="text"
                      id="registerTelefono"
                      class="form-control form-control-lg"
                      v-model="cliente.telefono"
                    />
                    <label class="form-label" for="registerTelefono"
                      >Teléfono</label
                    >
                    <span
                      class="error-campo"
                      v-if="mensajesValidacion.telefono"
                      >{{ mensajesValidacion.telefono }}</span
                    >
                  </div>

                  <div class="form-outline form-black mb-4">
                    <input
                      type="email"
                      id="registerEmail"
                      class="form-control form-control-lg"
                      v-model="cliente.email"
                    />
                    <label class="form-label" for="registerEmail">Email</label>
                    <span class="error-campo" v-if="mensajesValidacion.email">{{
                      mensajesValidacion.email
                    }}</span>
                  </div>

                  <button class="btn btn-verde btn-lg px-5" type="submit">
                    Registrarse
                  </button>
                </form>
              </div>

              <!-- === ENLACE PARA ALTERNAR === -->
              <div class="mt-4">
                <p v-if="!mostrarRegistro" class="mb-0">
                  ¿No tienes una cuenta?
                  <a
                    href="#"
                    @click.prevent="cambiarPestana(true)"
                    class="text-dark-50 fw-bold"
                    >Regístrate</a
                  >
                </p>
                <p v-else class="mb-0">
                  ¿Ya tienes una cuenta?
                  <a
                    href="#"
                    @click.prevent="cambiarPestana(false)"
                    class="text-dark-50 fw-bold"
                    >Inicia Sesión</a
                  >
                </p>
              </div>

              <!-- Mensajes de feedback general -->
              <div v-if="mensajeError" class="alert alert-danger mt-4">
                {{ mensajeError }}
              </div>
              <div v-if="mensajeExito" class="alert alert-success mt-4">
                {{ mensajeExito }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {
  consultarClientePorCedulaFachada,
  guardarClienteFachada,
} from "@/client/ClienteClient.js";

export default {
  name: "LoginView",
  data() {
    return {
      mostrarRegistro: false,
      loginData: {
        cedula: "",
        apellido: "",
      },
      cliente: {
        cedula: "",
        nombre: "",
        apellido: "",
        razonSocial: "",
        direccion: "",
        telefono: "",
        email: "",
      },
      mensajesValidacion: {
        cedula: "",
        nombre: "",
        apellido: "",
        direccion: "",
        telefono: "",
        email: "",
      },
      mensajeError: "",
      mensajeExito: "",
    };
  },
  methods: {
    cambiarPestana(esRegistro) {
      this.mostrarRegistro = esRegistro;
      this.mensajeError = "";
      this.mensajeExito = "";
      this.mensajesValidacion = {
        cedula: "",
        nombre: "",
        apellido: "",
        direccion: "",
        telefono: "",
        email: "",
      };
    },
    limpiarMensajesValidacion() {
      this.mensajesValidacion = {
        cedula: "",
        nombre: "",
        apellido: "",
        direccion: "",
        telefono: "",
        email: "",
      };
    },

    async iniciarSesion() {
      this.mensajeError = "";
      this.mensajeExito = "";
      if (!this.loginData.cedula || !this.loginData.apellido) {
        this.mensajeError = "La cédula y el apellido son requeridos.";
        return;
      }
      try {
        const clienteEncontrado = await consultarClientePorCedulaFachada(
          this.loginData.cedula
        );
        if (
          clienteEncontrado.apellido.toLowerCase() ===
          this.loginData.apellido.toLowerCase()
        ) {
          localStorage.setItem("cedula_usuario", this.loginData.cedula);
          this.$router.push("/");
        } else {
          this.mensajeError = "La contraseña (apellido) es incorrecta.";
        }
      } catch (error) {
        this.mensajeError = `La cédula '${this.loginData.cedula}' no está registrada.`;
      }
    },

    async registrarCliente() {
      this.mensajeError = "";
      this.mensajeExito = "";
      this.limpiarMensajesValidacion();

      let hayErrores = false;
      const cedulaStr = String(this.cliente.cedula || "").trim();
      if (cedulaStr === "") {
        this.mensajesValidacion.cedula = "La cédula es obligatoria.";
        hayErrores = true;
      } else if (!/^[0-9]+$/.test(cedulaStr)) {
        this.mensajesValidacion.cedula =
          "La cédula solo debe contener números.";
        hayErrores = true;
      } else if (cedulaStr.length !== 10) {
        this.mensajesValidacion.cedula = "La cédula debe tener 10 dígitos.";
        hayErrores = true;
      }

      // Validación para Nombre
      if (!this.cliente.nombre || this.cliente.nombre.trim() === "") {
        this.mensajesValidacion.nombre = "El nombre es obligatorio.";
        hayErrores = true;
      }

      // Validación para Apellido
      if (!this.cliente.apellido || this.cliente.apellido.trim() === "") {
        this.mensajesValidacion.apellido = "El apellido es obligatorio.";
        hayErrores = true;
      }

      // Validación para Dirección
      if (!this.cliente.direccion || this.cliente.direccion.trim() === "") {
        this.mensajesValidacion.direccion = "La dirección es obligatoria.";
        hayErrores = true;
      }

      // Validación para Teléfono
      const telefonoStr = String(this.cliente.telefono || "").trim();
      if (telefonoStr === "") {
        this.mensajesValidacion.telefono = "El teléfono es obligatorio.";
        hayErrores = true;
      } else if (!/^[0-9]+$/.test(telefonoStr)) {
        this.mensajesValidacion.telefono =
          "El teléfono solo debe contener números.";
        hayErrores = true;
      } else if (telefonoStr.length !== 10) {
        this.mensajesValidacion.telefono = "El teléfono debe tener 10 dígitos.";
        hayErrores = true;
      }

      // Validación para Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.cliente.email || this.cliente.email.trim() === "") {
        this.mensajesValidacion.email = "El email es obligatorio.";
        hayErrores = true;
      } else if (!emailRegex.test(this.cliente.email)) {
        this.mensajesValidacion.email = "El formato del email no es válido.";
        hayErrores = true;
      }

      // Si se encontró algún error, detenemos la ejecución.
      if (hayErrores) {
        return;
      }
      try {
        await guardarClienteFachada(this.cliente);
        this.mensajeExito =
          "¡Registro exitoso! Por favor, ahora inicie sesión.";
        this.cambiarPestana(false); 
        this.loginData.cedula = this.cliente.cedula;
        this.loginData.apellido = this.cliente.apellido;
        this.cliente = {
          cedula: "",
          nombre: "",
          apellido: "",
          razonSocial: "",
          direccion: "",
          telefono: "",
          email: "",
        };
      } catch (error) {
        this.mensajeError =
          "Error en el registro: " +
          (error.response?.data || "La cédula podría ya estar en uso.");
      }
    },
  },
};
</script>

<style scoped>
.login-background {
  background-color: #42b983;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.card.bg-light {
  border: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-verde {
  background-color: #42b983;
  color: white;
  font-weight: bold;
  border: none;
  transition: background-color 0.3s ease;
}

.btn-verde:hover {
  background-color: #2e855d;
}

.form-outline.form-black .form-control {
  color: #212529;
}

.error-campo {
  color: #dc3545;
  font-size: 0.8em;
  text-align: left;
  display: block;

  margin-top: 0.25rem;

  margin-bottom: 1rem;
}

.card-body {
  position: relative;
}
</style>