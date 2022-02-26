<template>
    <nav class="navbar navbar-white sticky-top bg-white flex-md-nowrap p-0">
      <a class="bg-primary d-flex justify-content-center py-4 navbar-brand col-sm-12 col-md-3 col-lg-2 mr-0" href="#">
          <img src="../assets/img/logo-white.svg" alt="Logo">
          
      </a>
                    
    </nav>
    <div class="container-fluid">
        <div class="row">
            <nav class="col-md-3 col-lg-2 d-none d-md-block px-0 bg-secondary sidebar">
                <div class="sidebar-sticky bg-secondary">
                    <div class="bg-primary">
                        <div class="bg-secondary py-2 rounded-top"></div>
                    </div>
                    <ul class="nav flex-column">
                        <li class="nav-item">
                            <a class="nav-link text-secondary active" href="#">
                                <span data-feather="home"></span>
                                Início
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">
                                <span data-feather="file"></span>
                                Atendimento
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">
                                <span data-feather="shopping-cart"></span>
                                CRM
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">
                                <span data-feather="users"></span>
                                Funil
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">
                                <span data-feather="bar-chart-2"></span>
                                Transmissão
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">
                                <span data-feather="layers"></span>
                                Importar
                            </a>
                        </li>
                    </ul>

                    <h6
                        class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
                    >
                        <span>Saved reports</span>
                        <a class="d-flex align-items-center text-muted" href="#">
                            <span data-feather="plus-circle"></span>
                        </a>
                    </h6>

                    <ul class="nav flex-column mb-2">
                        <li class="nav-item">
                            <a class="nav-link" href="#">
                                <span data-feather="file-text"></span>
                                Current month
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">
                                <span data-feather="file-text"></span>
                                Last quarter
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">
                                <span data-feather="file-text"></span>
                                Social engagement
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">
                                <span data-feather="file-text"></span>
                                Year-end sale
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
            <main role="main" class="col-md-8 col-lg-9 ml-sm-auto col-lg-10 pt-3 px-4">
                <slot></slot>
            </main>
        </div>
    </div>
</template>
<style lang="less" >
    #app {
        height: 100%;
    }
    .sidebar{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        padding: 0;
        padding-top: 83px;
        box-shadow: inset -1px 0 0 rgba(0,0,0,0.1);
        .rounded-top {
            border-top-left-radius: 1.5rem!important;
            border-top-right-radius: 1.5rem!important;
            margin-bottom: 10px;
        }
        .nav-item {
            padding-left: 1em;
            a.nav-link {
                color: white;
                font-size: 0.75em;
                &.active {
                    background-color: white;
                    border-radius: 200px 0 0 200px;
                    position: relative;
                    &::after, &::before {
                        content: '';
                        position: absolute;
                        background: var(--bs-secondary);;
                        width: 10px;
                        height: 10px;
                        right: 0px;
                        
                    }
                    &::after {
                        bottom: -10px;
                        border-top-right-radius: 10px;
                        box-shadow: 5px -3px 0 2px white;
                    }
                    &::before {                        
                        top: -10px;
                        border-bottom-right-radius: 10px;
                        box-shadow: 5px 3px 0 2px white;
                    }
                }
                margin-top: 0.25em;
                margin-bottom: 0.25em;
            }
        }
    }
    .sidebar-sticky {
        position: -webkit-sticky;
        position: sticky;
        top: 48px;
        height: ~"calc(100vh - 83px)";
        //padding-top: 0.5rem;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .sidebar-heading {
        font-size: 0.75rem;
        text-transform: uppercase;
    }
    
</style>