<template>
    <div class="container">
        <div class="text-end mt-5">
            <button @click="enviar" class="btn btn-secondary text-white" v-if="transmission && ['RASCUNHO', 'INTERROMPIDA'].includes(transmission.status)">
                ENVIAR
            </button>
        </div>
        <div class="my-3 p-3 bg-body rounded shadown-sm">
            <Nav :transmission_id="$route.params.id" :status="transmission.status" v-if="transmission"  />
        </div>
        <h3>Nome da Mensagem</h3>
        <div class="my-3 p-3 bg-body rounded shadow-sm">
            <input
                type="text"
                v-model="nome"
                readonly
                class="w-100 p-2 border bg-light rounded disabled"
            />
        </div>

        <h3>Lista</h3>
        <div class="my-3 p-3 bg-body rounded shadow-sm">
            <div class="table-responsive">
                <table class="table table-borderless">
                    <thead>
                        <tr>
                            <th colspan="2">Contato</th>
                            <th width="100px"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <Row v-for="contact in contacts" :key="contact.id" :transmission="transmission" :contact_id="contact.id" :preview_id="preview_id" @preview="preview"></Row>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import Nav from "~/components/mensagens/nav.vue";

import Row from '~/components/mensagens/preview/row.vue';

import SvgIcon from "@jamescoyle/vue-icon";
import { mdiEye } from "@mdi/js";

import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

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
                await api.post(
                    `/whatsapp/transmission/${this.transmission.id}/send`
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
    },
    beforeRouteUpdate(to, from) {
        this.loadTransmission(to.params.id);
    },
};
</script>