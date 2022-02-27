<template>
    <nav class="navbar navbar-white sticky-top bg-white flex-md-nowrap p-0">
      <a class="bg-primary d-flex justify-content-center py-4 navbar-brand col-sm-12 col-md-3 col-lg-2 mr-0" href="#">
          <img src="../assets/img/logo-white.svg" alt="Logo">
          
      </a>
                    
    </nav>
    <div class="container-fluid">
        <div class="row">
            <Sidebar></Sidebar>
            <main role="main" class="col-md-8 col-lg-9 ml-sm-auto col-lg-10 pt-3 px-4">
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
        height: 100%;
    }
    
</style>