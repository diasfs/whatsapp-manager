<template>
    <div class="container">
        <!--<div
            class="d-flex align-items-center p-3 my-3 text-white bg-secondary rounded shadow-sm"
        >
            <div class="lh-1">
                <h1 class="h6 mb-0 text-white lh-1">Mensagens</h1>
                <small>Contatos</small>
            </div>
        </div>
        -->

        <div class="text-end mt-5">
            <button @click.prevent.stop="nova" class="btn btn-primary text-white"
                >Nova Mensagem</button>
        </div>

        <h3>Encontrar Mensagem</h3>
        <div class="my-3 p-3 bg-body rounded shadown-sm">
            <form @submit.prevent.stop="buscar" class="position-relative">
                <input
                    type="text"
                    class="form-control"
                    placeholder="Buscar mensagem pelo nome"
                    v-model="keyword"
                />
                <svg-icon
                    @click="buscar"
                    type="mdi"
                    :path="icons.magnify"
                    class="position-absolute top-50 end-0 translate-middle"
                    style="cursor: pointer"
                ></svg-icon>
            </form>
        </div>


        <Transmissions :transmissions="rascunhos" v-if="rascunhos.length > 0">
            <h3>Rascunhos</h3>
        </Transmissions>

        <Transmissions :transmissions="enviando" v-if="enviando.length > 0">
            <h3>Enviando</h3>
        </Transmissions>
        <Transmissions :transmissions="interrompidas" v-if="interrompidas.length > 0">
            <h3>Interrompidas</h3>
        </Transmissions>
        <Transmissions :transmissions="enviadas" v-if="enviadas.length > 0">
            <h3>Enviadas</h3>
        </Transmissions>

        <!--
        <h3>Mensagens interrompidas</h3>
        <div class="my-3 p-3 bg-body rounded shadow-sm">
            <table class="table table-borderless">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Mensagem</th>
                        <th width="100px">Data</th>
                        <th width="120px"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>nome</td>
                        <td>mensagem</td>
                        <td>10/10/2022</td>
                        <td class="text-end">
                            <a
                                class="text-secondary text-decoration-none"
                                @click="importar(message)"
                            >
                                <svg-icon
                                    type="mdi"
                                    :path="icons.magnify"
                                    size="1.25em"
                                ></svg-icon>
                                Retomar
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        -->
    </div>
</template>
<script>

import api from '../../lib/api';

import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

import Transmissions from '~/components/mensagens/mensagens.vue';

import SvgIcon from "@jamescoyle/vue-icon";
import { mdiMagnify } from "@mdi/js";


export default {
    components: {
        SvgIcon,
        Transmissions
    },
    data() {
        return {
            icons: {
                magnify: mdiMagnify
            },
            carregando: false,
            transmissions: [],
            keyword: '',
        };
    },
    created() {
        this.loadData();
    },
    computed: {
        Transmissions() {
            let records = [...this.transmissions];

            if (this.keyword != "") {
                let keywords = `${this.keyword}`
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .trim()
                    .split(/\s+/gim);
                for (let keyword of keywords) {
                    records = records.filter((row) => {
                        let nome = row.nome
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .toLowerCase()
                            .trim();
                        let regex = new RegExp(keyword, "igm");
                        return regex.test(nome);
                    });
                }
            }

            return records;
        },
        rascunhos() {
            return this.Transmissions.filter(transmission => transmission.status == 'RASCUNHO');
        },
        enviadas() {
            return this.Transmissions.filter(transmission => transmission.status == 'ENVIADA');
        },
        interrompidas() {
            return this.Transmissions.filter(transmission => transmission.status == 'INTERROMPIDA');
        },
        enviando() {
            return this.Transmissions.filter(transmission => transmission.status == 'ENVIANDO');
        }
    },
    methods: {
        async loadData() {
            let { data: transmissions } = await api.get('transmission');
            this.transmissions = transmissions;
            
        },
        async buscar() {

        },
        async nova() {
            try {
               
               let { value: nome } = await Swal.fire({
                   title: "Informe o nome da mensagem",
                   input: 'text',
                   inputLabel: "Nome da mensagem",
                   inputValue: '',
                   showCancelButton: true,
                   inputValidator(value) {
                       if (!value) {
                           return "Você precisa informar um nome para a mensagem!";
                       }
                   }
               });
               if (!nome) {
                   return;
               }
               let { data: transmission } = await api.post('/transmission/create', {
                   nome,
                   contact_ids: []
               })
               this.$router.push(`/mensagens/${transmission.id}/escolher-lista`);
           } catch(err) {
               let text = err.message;
               if (err.response && err.response.data) {
                   text = err.response.data.error;
               }
               Swal.fire({
                   title: 'Oops...',
                   text,
                   icon: 'error'
               });
           }
        }
    }
};
</script>
