<template>
    <main class="container">
        <div
            class="d-flex align-items-center p-3 my-3 text-white bg-secondary rounded shadow-sm"
        >
            <div class="lh-1">
                <h1 class="h6 mb-0 text-white lh-1">Configurações</h1>
                <small>WhatsApp</small>
            </div>
        </div>

        <div class="my-3 p-3 bg-body rounded shadow-sm">
            <h6 class="border-bottom pb-2 mb-0">Números conectados</h6>
            
            <div v-if="carregando">Carregando...</div>
            <div v-else-if="connections.length == 0">
                <p>Nenhuma conexão encontrada.</p>
            </div>
            <div v-if="connections.length > 0">
                <Connection @authenticated="loadConnections" @disconnected="loadConnections" v-for="connection in connections" :key="connection.id" :connection="connection"></Connection>
            </div>
            
            <small class="d-flex justify-content-md-end justify-content-center  mt-3">
                <button @click="novaConexao" class="btn btn-primary btn-sm text-white">
                    <svg-icon type="mdi" :path="icons.whatsapp" size="1.5em"></svg-icon>
                    Incluir novo número
                </button>
            </small>
        </div>
    </main>
</template>
<script>

import api from '../../../lib/api';

import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import QRCode from 'qrcode';
import SessionStorage from '../../../lib/session-storage';

import SvgIcon from "@jamescoyle/vue-icon";
import { mdiWhatsapp } from "@mdi/js";
import Connection from '../../../components/configuracoes/whatsapp/connection.vue'
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
        async novaConexao() {
            let swal = Swal.fire({                
                text: "Carregando...",
                showConfirmButton: false,
                showCancelButton: true,
                cancelButtonText: "Cancelar",
            });
            let access_token = SessionStorage.getItem('access_token');
            let events;
            if (import.meta.env.DEV) {
                events = new EventSource(`${import.meta.env.VITE_API_ENDPOINT}/whatsapp/conexoes/nova?access_token=${access_token}`)
            } else {
                events = new EventSource(`${location.origin}/api/whatsapp/conexoes/nova?access_token=${access_token}`)
            }
            

            events.addEventListener('message', async event => {
                const data = JSON.parse(event.data);
                let { qr } = data;
                let url = await QRCode.toDataURL(qr);
                
                swal.update({
                    //imageUrl: url,
                    text: null,
                    html: `<img src="${url}" />`,
                });
            });
            events.addEventListener('authenticated', async event => {
                const data = JSON.parse(event.data);                
                swal.close();                
                this.loadConnections();
            });

            await swal;
            events.close();
            events = null;
            
        }
    }
};
</script>
