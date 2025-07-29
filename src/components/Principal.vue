<template>
  <div class="hello">
    <h1>Bienvenido, ¿por donde desea empezar?</h1>
    <div class="row justify-content-center">
      <div class="col-lg-4 col-md-4 col-sm-6 mb-3 mb-sm-4" v-for="carta in cartas" :key="carta.titulo" >
        <div class="card">
          <div class="card-body">
            <i :class="carta.icono"></i>
            <h3>{{ carta.titulo }}</h3>
            <button @click="irARuta(carta.redireccion)">
              {{ carta.boton }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Principal",
  data() {
    return {
      cartas: [
        {
          titulo: "Bodega",
          boton: "Ir",
          redireccion: "bodega",
          icono: "bi bi-box2-fill",
        },
        {
          titulo: "Cliente",
          boton: "Ir",
          redireccion: "cliente",
          icono: "bi bi-person-circle",
        },
        {
          titulo: "Producto",
          boton: "Ir",
          redireccion: "producto",
          icono: "bi bi-basket",
        },
        {
          titulo: "Factura",
          boton: "Ir",
          redireccion: "factura",
          icono: "bi bi-receipt",
        },
        {
          titulo: "Reporte de Factura",
          boton: "Ir",
          redireccion: "reporteFactura",
          icono: "bi bi-file-earmark-ruled-fill",
        },
      ],
    };
  },
  methods: {
    irARuta(redireccion) {
      this.$router.push({ name: redireccion });
    },
  },
};
</script>

<style scoped>
.hello {
  margin: 10px auto;
  padding: 20px;
  width: 90%;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
}

i {
  font-size: 3rem;
  color: #42b983;
  margin-bottom: 10px;
}

h3 {
  margin: 10px 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.card {
  height: 200px;
  display: flex;
  align-items: center;
  text-align: center;
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

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
  width: 100%;
}

button:hover {
  color: #369870;
  border: #369870 solid 2px;
  background: #fff;
}
</style>
