<script>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
    export default {
        async mounted() {
            let data = await fetch('/api').then(resp => resp.json());
            console.log(data);
        }
    }
</script>

<template>
  <h1>teste</h1>
  <router-view></router-view>
</template>

<style>
</style>
