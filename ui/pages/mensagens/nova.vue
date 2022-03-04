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
            <button @click="criar" class="btn btn-secondary text-white">PRÓXIMA ETAPA</button>
        </div>

        <div class="my-3 p-3 bg-body rounded shadown-sm">
            <ul class="nav">
                <li class="nav-item"><a class="nav-link active">Escolher lista</a></li>
                <li class="nav-item"><a class="nav-link disabled">Definir mensagem</a></li>
                <li class="nav-item"><a class="nav-link disabled">Revisar</a></li>
                <li class="nav-item"><a class="nav-link disabled">Enviar</a></li>
            </ul>
        </div>

        <h3>Minhas listas</h3>

        <div class="my-3 p-3 bg-body rounded shadown-sm">
            <form @submit.prevent.stop="buscar" class="position-relative">
                <input type="text" class="form-control" placeholder="Buscar mensagem pelo nome">
                <svg-icon @click="buscar" type="mdi" :path="icons.magnify" class="position-absolute top-50 end-0 translate-middle" style="cursor: pointer" ></svg-icon>
            </form>
        </div>
        <div class="my-3 p-3 bg-body rounded shadow-sm">
            <table class="table table-borderless">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Contatos</th>                        
                        <th width="140px"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr >
                        <td>nome</td>
                        <td>123</td>
                        
                        <td class="text-end">
                            <label>
                                <input type="checkbox" class="form-check-input mx-1" >
                                Selecionar
                            </label>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <MeusContatos v-model:value="contatos"></MeusContatos>


    </div>
</template>
<script>

import api from '../../lib/api';

import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

import SvgIcon from "@jamescoyle/vue-icon";
import { mdiMagnify } from "@mdi/js";

import MeusContatos from '../../components/mensagens/meus-contatos.vue';


export default {
    components: {
        SvgIcon,
        MeusContatos
    },
    data() {
        return {
            icons: {
                magnify: mdiMagnify
            },
            carregando: false,
            contatos: []
        };
    },
    created() {
    },
    methods: {
       async buscar() {

       },
       async criar() {
           try {
               if (0 === this.contatos.length) {
                   throw new Error('Nenhum contato selecionado.');
               }
               let { data: transmission } = await api.post('/transmission/create', {
                   contact_ids: this.contatos
               })
               this.$router.push(`/mensagens/${transmission.id}/definir-mensagem`);
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
