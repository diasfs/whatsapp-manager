<template>
    <nav class="navbar navbar-white sticky-top bg-white flex-md-nowrap p-0">
      <div class="bg-primary d-flex justify-content-between py-4 navbar-brand col-12 col-md-3 col-lg-2 me-0" href="#">          
            <a class="px-2 d-md-none" @click="toggleSideBar">
                <svg-icon
                    type="mdi"
                    :path="icons.menu"
                    class=""
                    style="cursor: pointer;color: white;"
                />
            </a>
          <img src="../assets/img/logo-white.svg" alt="Logo" height="24">      
          <div style="width: 40px;" class="d-md-none"></div>    
      </div>      
      <div class="d-none d-md-flex py-4 bg-primary col-12 col-md-9 col-lg-10 mx-0">
          &nbsp;
      </div>
    </nav>
    <div class="container-fluid">
        <div class="row">
            <Sidebar :show="show_side_bar"></Sidebar>
            <main role="main" class="col-md-9 col-lg-9 ms-sm-auto col-lg-10 pt-3 px-4">
                <slot></slot>
            </main>
        </div>
    </div>
</template>
<script>
    import SvgIcon from "@jamescoyle/vue-icon";
    import { mdiMenu } from "@mdi/js";

    import Sidebar from '../components/sidebar.vue';
    export default {
        components: {
            Sidebar,
            SvgIcon
        },
        data() {
            return {                
                icons: {
                    menu: mdiMenu
                }
            }
        },
        computed: {
            show_side_bar: {
                get() {
                    return this.$store.state.show_side_bar;
                }
            }
        },
        methods: {
            toggleSideBar() {
                this.$store.commit('toggleSideBar');
            }
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