<template>
  <div class="logo" @click="goHome">
    <img class="logo-img" src="@/assets/images/logo.png" alt="logo" />
    <p>ORDERLINES</p>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

const goHome = () => {
  router.push("/home/index");
};
</script>
<script lang="ts">
export default {
  name: "LOGO"
};
</script>
<style scoped>
.logo {
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  padding: 2px;
  color: white;
}
.logo-img {
  width: 25px;
  height: 25px;
}
p {
  margin-left: 10px;
  font-size: 18px;
  font-weight: bold;
  color: black;
}
</style>
