<template>
  <div class="home">
    <span class="home-text"></span>
    <img alt="Vue logo" src="../assets/logo.png" />
    <img alt="Vue logo" src="../assets/tab3_.png" />

    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    HelloWorld
  }
};
</script>
<style>
.home-text {
  color: blue;
}
</style>
