<template>
    <nav class="col-md-3 col-lg-2 d-md-block px-0 bg-secondary sidebar" :class="{ 'd-none': !show }"  style="z-index: 99">
        <div class="sidebar-sticky bg-secondary">
            <div class="bg-primary">
                <div class="bg-secondary py-2 rounded-top"></div>
            </div>

            <h6
                class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
            >
                <span>Configurações</span>
            </h6>

            <ul class="nav flex-column mb-2">
                <li class="nav-item">
                    <router-link to="/configuracoes/help" class="nav-link"  active-class="active">Textos de Ajuda</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/configuracoes/roles" class="nav-link"  active-class="active">Roles</router-link>
                </li>
            </ul>

            <h6
                class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
            >
                <span>WhatsApp</span>
            </h6>

            <ul class="nav flex-column mb-2">
                <!--
                <li class="nav-item">
                    <a class="nav-link" href="#">Minhas Tags</a>
                </li>
                -->
                <li class="nav-item">
                    <router-link class="nav-link" active-class="active" to="/configuracoes/whatsapp">Aparelhos Conectados</router-link>
                </li>
                <li class="nav-item">                    
                    <router-link class="nav-link" active-class="active" to="/importar/whatsapp/contatos">Importar Contatos</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/mensagens" class="nav-link"  active-class="active">Mensagens</router-link>
                </li>
                
                <!--
                <li class="nav-item">
                    <a class="nav-link" href="#">Trocar Senha</a>
                </li>
                -->
            </ul>

            <h6
                class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
            >
                <span>CRM</span>
            </h6>
            <ul class="nav flex-column">
                <!--
                <li class="nav-item">
                    <router-link class="nav-link" to="/">Início</router-link>
                </li>
                -->
                <!--
                <li class="nav-item">
                    <a class="nav-link" href="#">Atendimento</a>
                </li>
                -->
                <li class="nav-item">
                    <router-link to="/crm" class="nav-link"  active-class="active">Contatos</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/listas" class="nav-link"  active-class="active">Listas</router-link>
                </li>
                
                <!--
                <li class="nav-item">
                    <a class="nav-link" href="#">Funil</a>
                </li>
                -->
            </ul>

            <!--
            <h6
                class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
            >
                <span>Transmissão</span>
            </h6>

            <ul class="nav flex-column mb-2">
                <li class="nav-item">
                    <a class="nav-link" href="#">WhatsApp</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Mensagens enviadas</a>
                </li>
            </ul>
            -->
            

            
            <ul class="nav flex-column mb-2">
                <li class="nav-item">
                    <a class="nav-link" @click="logout" href="javascript:void(0)">Sair</a>
                </li>
            </ul>
        </div>
    </nav>
</template>
<script>
import SessionStorage from '../lib/session-storage';
export default {
    props: ['show'],
    methods: {
        logout() {
            SessionStorage.removeItem('access_token');
            this.$router.replace('/login');
        }
    }
}
</script>
<style lang="less" >
.sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    padding: 0;
    padding-top: 72px;
    box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.1);
    .rounded-top {
        border-top-left-radius: 1.5rem !important;
        border-top-right-radius: 1.5rem !important;
        margin-bottom: 10px;
    }
    .nav-item {
        padding-left: 1em;
        a.nav-link {
            color: white;
            font-size: 0.65em;

            &.active {
                background-color: white;
                border-radius: 200px 0 0 200px;
                position: relative;
                color: var(--bs-secondary);
                &::after,
                &::before {
                    content: "";
                    position: absolute;
                    background: var(--bs-secondary);
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

    ul.nav:last-child {
        margin-top: 3em;
    }
}
.sidebar-sticky {
    position: -webkit-sticky;
    position: sticky;
    top: 48px;
    height: ~"calc(100vh - 72px)";
    //padding-top: 0.5rem;
    overflow-x: hidden;
    overflow-y: auto;
}
.sidebar-heading {
    font-size: 0.65rem;
    text-transform: uppercase;
    span {
        padding-left: 1em;

        color: rgba(255, 255, 255, 0.75);
    }
}
</style>