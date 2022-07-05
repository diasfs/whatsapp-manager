<template>
    <div class="container">
        <div
            class="d-flex align-items-center p-3 my-3 text-white bg-secondary rounded shadow-sm"
        >
            <div class="lh-1">
                <h1 class="h6 mb-0 text-white lh-1">CRM</h1>
                <small>Contatos</small>
            </div>
        </div>

        <div class="my-3 p-3 bg-body rounded shadow-sm">
            <h6 class="border-bottom pb-2 mb-0">Contatos</h6>
            
            <div v-if="carregando">Carregando...</div>
            <div v-else-if="contatos.length == 0">
                <p>Nenhum número disponível.</p>
            </div>
            <div v-if="contatos.length > 0" class="table-responsive">
                <table class="table table-borderless">
                    <thead>
                        <tr>
                            <th width="40px" class="text-center">
                                <input type="checkbox">
                            </th>                            
                            <th colspan="2">Contato</th>
                            <!--
                            <th>E-mail/Instagram</th>
                            -->
                            <th>Tags</th>
                            <th class="text-center" width="170px">Último Contato</th>
                            <th class="text-end" width="170px">Última Atualização</th>
                        </tr>
                    </thead>
                    <tbody>
                        <Contact v-for="contact in contatos" :contact="contact" :key="contact.id"></Contact>
                    </tbody>
                </table>                
            </div>
        </div>
    </div>
</template>
<script>

import api from '../../lib/api';

import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

import SvgIcon from "@jamescoyle/vue-icon";
import { mdiWhatsapp } from "@mdi/js";

import Contact from '../../components/crm/contato.vue'

export default {
    components: {
        SvgIcon,
        Contact
    },
    data() {
        return {
            icons: {
                whatsapp: mdiWhatsapp
            },
            carregando: false,
            Contatos: []
        };
    },
    created() {
        this.loadContatos();
    },
    computed: {
        contatos() {
            let contatos = [...this.Contatos];


            contatos.sort((a,b) => {
                let nome_completo_a = `${a.nome} ${a.sobrenome}`.trim();
                let nome_completo_b = `${b.nome} ${b.sobrenome}`.trim();
                if (nome_completo_a == '' && nome_completo_b == '' ) {
                    if (a.WhatsappContact && b.WhatsappContact) {
                        if (a.WhatsappContact.profilePictureUrl != '' && b.WhatsappContact.profilePictureUrl == '') {
                            return -1;
                        }
                        if (a.WhatsappContact.profilePictureUrl == '' && b.WhatsappContact.profilePictureUrl != '') {
                            return 1;
                        }
                    }
                    if (a.WhatsappContact && !b.WhatsappContact) {
                        return -1;
                    }
                    if (!a.WhatsappContact && b.WhatsappContact) {
                        return 1;
                    }
                    return a.celular < b.celular ? - 1 : 1;
                }
                if (nome_completo_a == '' && nome_completo_b != '') {
                    return 1;
                }
                if (nome_completo_a != '' && nome_completo_b == '') {
                    return -1;
                }
                return nome_completo_a < nome_completo_b ? - 1 : 1;
            })

            return contatos;
        }
    },
    methods: {
        async loadContatos() {
            try {
                this.carregando = true;
                let {data: contatos} = await api.get('/crm/contatos');
                this.Contatos = contatos
            } catch (err) {

            }
            this.carregando = false;
        }
    }
};
</script>
