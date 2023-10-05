<template>
  <div class="logo">
    <img class="logo-img" src="@/assets/images/logo.png" alt="logo" />
    <p>orderlines</p>
  </div>
</template>

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
  width: 35px;
  height: 35px;
}
p {
  margin-left: 10px;
  font-size: 25px;
  font-weight: bold;
  color: black;
}
</style>
