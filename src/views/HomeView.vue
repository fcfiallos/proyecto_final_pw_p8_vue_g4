<template>
  <div class="home">
    <Principal />
  </div>
</template>

<script>
// @ is an alias to /src
import Principal from "@/components/Principal.vue";

export default {
  name: "HomeView",
  components: {
    Principal,
  },
};
</script>
