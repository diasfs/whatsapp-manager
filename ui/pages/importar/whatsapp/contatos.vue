<template>
    <main class="container">
        <div
            class="d-flex align-items-center p-3 my-3 text-white bg-secondary rounded shadow-sm"
        >
            <div class="lh-1">
                <h1 class="h6 mb-0 text-white lh-1">Importar</h1>
                <small>Contatos do WhatsApp</small>
            </div>
        </div>

        <div class="my-3 p-3 bg-body rounded shadow-sm">
            <h6 class="border-bottom pb-2 mb-0">Números disponíveis</h6>
            
            <div v-if="carregando">Carregando...</div>
            <div v-else-if="connections.length == 0">
                <p>Nenhum número disponível.</p>
            </div>
            <div v-if="connections.length > 0">
                <Connection @importando="loadConnections" v-for="connection in connections" :key="connection.id" :connection="connection"></Connection>
            </div>
        </div>
    </main>
</template>
<script>

import api from '../../../lib/api';

import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

import SvgIcon from "@jamescoyle/vue-icon";
import { mdiWhatsapp } from "@mdi/js";
import Connection from '../../../components/importar/whatsapp/connection.vue'
export default {
    components: {
        SvgIcon,
        Connection
    },
    data() {
        return {
            icons: {
                whatsapp: mdiWhatsapp
            },
            carregando: false,
            connections: []
        };
    },
    created() {
        this.loadConnections();
    },
    methods: {
        async loadConnections() {
            this.carregando = true;
            try {
                let { data: connections } = await api.get('/whatsapp/conexoes');
                this.connections = connections;
            } catch (err) {
                this.connections = [];
                Swal.fire({
                    title: 'Oops...',
                    icon: 'error',
                    text: "Não foi possível carregar as conexões"
                });
            }
            this.carregando = false;
        },
    }
};
</script>
