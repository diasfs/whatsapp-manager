<template>
    <div class="container">
        <div class="text-end mt-5">
            <button @click="enviar" class="btn btn-secondary text-white" v-if="transmission && ['RASCUNHO', 'INTERROMPIDA'].includes(transmission.status)">
                ENVIAR
            </button>
        </div>
        <div class="my-3 p-3 bg-body rounded shadown-sm">
            <Nav :transmission_id="$route.params.id" :status="transmission.status" v-if="transmission" />
        </div>
        <h3>Mensagem</h3>
        <div class="my-3 p-3 bg-body rounded shadow-sm"  v-if="transmission">

            <p>Nome: {{ transmission.nome }}</p>
            <p>Status: {{ transmission.status }}</p>
            <p v-if="transmission.enviadas > 0">Enviadas: {{ transmission.enviadas }}</p>
            <p v-if="transmission.errors > 0">Erros: {{ transmission.erros }}</p>
            <p v-if="transmission.pendentes > 0">Pendentes: {{ transmission.pendentes }}</p>
            <p v-if="transmission.respondidas > 0">Respondidas: {{ transmission.respondidas }}</p>
            <p v-if="transmission.visualizadas > 0">Visualizadas: {{ transmission.visualizadas }}</p>

        </div>

        <h3>Lista</h3>
        <div class="my-3 p-3 bg-body rounded shadow-sm">
            <div class="table-responsive">
                <table class="table table-borderless">
                    <thead>
                        <tr>
                            <th colspan="2">Contato</th>
                            <th></th>
                            <th width="100px"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <Row v-for="contact in contacts" :key="contact.id" :erro="contact.TransmissionQueue.error" :status="contact.TransmissionQueue.status" :transmission="transmission" :contact_id="contact.id" :preview_id="preview_id" @preview="preview"></Row>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import Nav from "~/components/mensagens/nav.vue";

import Row from '~/components/mensagens/status/row.vue';

import SvgIcon from "@jamescoyle/vue-icon";
import { mdiEye } from "@mdi/js";

import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import SessionStorage from '~/lib/session-storage';
import api from "~/lib/api";

export default {
    components: {
        Nav,
        SvgIcon,        
        Row
    },
    data() {
        return {
            nome: "",
            transmission: null,
            preview_id: null,
            icons: {
                eye: mdiEye,
            },
            eventSource: null
        };
    },
    computed: {
        contacts() {
            if (!this.transmission) {
                return [];
            }
            let contacts = this.transmission.Queue;

            return contacts;
        },
    },
    methods: {
        async enviar() {
            try {
                let { data: conexoes} = await api.get('/whatsapp/conexoes')
                let inputOptions= conexoes.filter(conn => {
                    return conn.state == 'CONNECTED';
                });

                if (0 === inputOptions.length) {
                    return Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Você não possui nenhum aparelho conectado",
                    });
                }
                inputOptions = inputOptions.reduce((acc, conn) => {
                    
                    acc[conn.id] = `[${conn.state}] ${conn.WhatsappContact.number}`
                    return acc;
                },{})
                
                const { value: connection_id, isDismissed } = await Swal.fire({
                    title: "Aparelhos conectados para envio",
                    input: 'select',
                    inputOptions,
                    inputPlaceholder: "Selecione um aparelho",
                    showCancelButton: true
                });
                
                if (isDismissed) {
                    return;
                }

                if (!connection_id) {
                    return Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Você não selecionou um aparelho",
                    });
                }


                
                await api.post(
                    `/whatsapp/transmission/${this.transmission.id}/send`, {
                        connection_id
                    }
                );
                
                this.$router.push(`/mensagens/${this.$route.params.id}/status`)
                
            } catch (err) {
                console.error(err);
                let text = "Não foi possível enviar a mensagem.";
                if (err.response && err.response.data) {
                    text = err.response.data.error;
                }
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text,
                });
            }
        },
        preview(contact_id) {
            this.preview_id = contact_id
        },
        async loadTransmission(transmission_id) {
            try {
                let { data: transmission } = await api.get(
                    `transmission/${transmission_id}/preview`
                );

                for(let item of transmission.Queue) {
                    let {data:contato} = await api.get(`crm/contatos/${item.id}`);
                    
                    item.nome = contato.nome;
                    item.sobrenome = contato.sobrenome;
                    item.WhatsappContact = contato.WhatsappContact
                    break;
                }

                this.transmission = transmission;
                this.nome = transmission.nome;
            } catch (err) {
                console.error(err);
                let text = "Não foi possível carregar a mensagem.";
                if (err.response && err.response.data) {
                    text = err.response.data.error;
                }
                Swal.fire({
                    icon: "error",
                    title: "oops...",
                    text,
                });
            }
        },
    },
    created() {
        this.loadTransmission(this.$route.params.id);

        let access_token = SessionStorage.getItem('access_token');
        let events;
        if (import.meta.env.DEV) {
            events = new EventSource(`${import.meta.env.VITE_API_ENDPOINT}/transmission/${this.$route.params.id}/sse?access_token=${access_token}`)
        } else {
            events = new EventSource(`${location.origin}/api/transmission/${this.$route.params.id}/sse?access_token=${access_token}`)
        }
        this.events = events;

        events.addEventListener('transmission.save', evt => {
            const data = JSON.parse(evt.data);
            
            this.transmission = {
                ...this.transmission,
                ...data
            }
        });
    },
    beforeDestroy() {
        this.events.close();
        this.events = null;
    },
    beforeRouteUpdate(to, from) {
        this.loadTransmission(to.params.id);
    },
};
</script>