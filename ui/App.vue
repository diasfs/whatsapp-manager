<script>
  import DefaultLayout from './layouts/Default.vue';
  import LoginLayout from './layouts/Login.vue';

  import SessionStore from './lib/session-storage';

  export default {
    components: {
      DefaultLayout,
      LoginLayout
    },
    data() {
      return {
        access_token: SessionStore.getItem('access_token')
      }
    },
    mounted() {
      window.addEventListener('storage', () => {
        this.access_token = SessionStore.getItem('access_token')
      })
    }
  }
</script>

<template>  

  <LoginLayout v-if="!access_token">
    <router-view></router-view>
  </LoginLayout>
  <DefaultLayout v-else>
    <router-view></router-view>
  </DefaultLayout>
</template>

<style>
</style>
