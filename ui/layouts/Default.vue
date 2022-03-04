<template>
    <nav class="navbar navbar-white sticky-top bg-white flex-md-nowrap p-0">
      <a class="bg-primary d-flex justify-content-center py-4 navbar-brand col-12 col-md-3 col-lg-2 me-0" href="#">
          <img src="../assets/img/logo-white.svg" alt="Logo" height="24">          
      </a>      
      <div class="d-flex py-4 bg-primary col-12 col-md-9 col-lg-10 mx-0">
          &nbsp;
      </div>
    </nav>
    <div class="container-fluid">
        <div class="row">
            <Sidebar></Sidebar>
            <main role="main" class="col-md-9 col-lg-9 ms-sm-auto col-lg-10 pt-3 px-4">
                <slot></slot>
            </main>
        </div>
    </div>
</template>
<script>
    import Sidebar from '../components/sidebar.vue';
    export default {
        components: {
            Sidebar
        }
    }
</script>
<style lang="less" >
    #app {
        min-height: 100%;
        background-color: var(--bs-gray-200);
    }
    html, body {
        height: 100%!important;
        min-height: 100%!important;
    }
</style>