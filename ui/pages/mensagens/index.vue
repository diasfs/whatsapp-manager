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
            <router-link to="/mensagens/nova" class="btn btn-primary text-white">Nova Mensagem</router-link>
        </div>

        <h3>Encontrar Mensagem</h3>
        <div class="my-3 p-3 bg-body rounded shadown-sm">
            <form @submit.prevent.stop="buscar" class="position-relative">
                <input type="text" class="form-control" placeholder="Buscar mensagem pelo nome">
                <svg-icon @click="buscar" type="mdi" :path="icons.magnify" class="position-absolute top-50 end-0 translate-middle" style="cursor: pointer" ></svg-icon>
            </form>
        </div>

        <h3>Rascunhos</h3>
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
                    <tr >
                        <td>nome</td>
                        <td>mensagem</td>
                        <td>10/10/2022</td>
                        <td class="text-end">
                            <a class="text-secondary text-decoration-none" @click="importar(message)">
                                <svg-icon type="mdi" :path="icons.magnify" size="1.25em"></svg-icon>
                                Retomar
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>Mensagens enviadas</h3>
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
                    <tr >
                        <td>nome</td>
                        <td>mensagem</td>
                        <td>10/10/2022</td>
                        <td class="text-end">
                            <a class="text-secondary text-decoration-none" @click="importar(message)">
                                <svg-icon type="mdi" :path="icons.magnify" size="1.25em"></svg-icon>
                                Retomar
                            </a>
                        </td>
                    </tr>
                    <tr >
                        <td>nome</td>
                        <td>mensagem</td>
                        <td>10/10/2022</td>
                        <td class="text-end">
                            <a class="text-secondary text-decoration-none" @click="importar(message)">
                                <svg-icon type="mdi" :path="icons.magnify" size="1.25em"></svg-icon>
                                Retomar
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

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
                    <tr >
                        <td>nome</td>
                        <td>mensagem</td>
                        <td>10/10/2022</td>
                        <td class="text-end">
                            <a class="text-secondary text-decoration-none" @click="importar(message)">
                                <svg-icon type="mdi" :path="icons.magnify" size="1.25em"></svg-icon>
                                Retomar
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>


    </div>
</template>
<script>

import api from '../../lib/api';

import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

import SvgIcon from "@jamescoyle/vue-icon";
import { mdiMagnify } from "@mdi/js";


export default {
    components: {
        SvgIcon,
    },
    data() {
        return {
            icons: {
                magnify: mdiMagnify
            },
            carregando: false,
        };
    },
    created() {
    },
    methods: {
       async buscar() {

       }
    }
};
</script>
