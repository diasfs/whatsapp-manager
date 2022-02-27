<template>
    <nav class="col-md-3 col-lg-2 d-none d-md-block px-0 bg-secondary sidebar">
        <div class="sidebar-sticky bg-secondary">
            <div class="bg-primary">
                <div class="bg-secondary py-2 rounded-top"></div>
            </div>
            <ul class="nav flex-column">
                <li class="nav-item">
                    <a class="nav-link text-secondary active" href="#">Início</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Atendimento</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">CRM</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Funil</a>
                </li>
            </ul>

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

            <h6
                class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
            >
                <span>Importar</span>
            </h6>

            <ul class="nav flex-column mb-2">
                <li class="nav-item">
                    <a class="nav-link" href="#">Grupos do WhatsApp</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Contatos do WhatsApp</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Contatos de Conversas do WhatsApp</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Seguidores do Instagram</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Importar CSV</a>
                </li>
            </ul>

            <h6
                class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
            >
                <span>Configurações</span>
            </h6>

            <ul class="nav flex-column mb-2">
                <li class="nav-item">
                    <a class="nav-link" href="#">Minhas Tags</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">WhatsApp</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Trocar Senha</a>
                </li>
            </ul>
            <ul class="nav flex-column mb-2">
                <li class="nav-item">
                    <a class="nav-link" href="#">Sair</a>
                </li>
            </ul>
        </div>
    </nav>
</template>
<style lang="less" >
.sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    padding: 0;
    padding-top: 83px;
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
    height: ~"calc(100vh - 83px)";
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