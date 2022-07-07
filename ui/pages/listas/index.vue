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
            <button
                v-if="selected.length != 0"
                @click.prevent.stop="remover"
                class="btn btn-danger text-white mx-2"
            >
                Excluir
            </button>
            <button
                @click.prevent.stop="nova"
                class="btn btn-primary text-white"
            >
                Nova Lista
            </button>
        </div>

        <h3>Listas</h3>
        <div class="my-3 p-3 bg-body rounded shadown-sm">
            <form @submit.prevent.stop="buscar" class="position-relative">
                <input
                    type="text"
                    class="form-control"
                    placeholder="Buscar lista pelo nome"
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

        <div class="my-3 p-3 bg-body rounded shadow-sm">
            <div class="table-responsive" v-if="Records.length > 0">
                <table class="table table-borderless">
                    <thead>
                        <tr>
                            <th class="text-center" width="50">
                                <label style="font-size: 1rem">
                                    <input
                                        type="checkbox"
                                        class="form-check-input mx-1"
                                        @click="selectAll"
                                    />
                                </label>
                            </th>
                            <th>Nome</th>
                            <th width="120px"  class="text-center" >Contatos</th>
                            <th width="150px"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in Records" :key="row.id">
                            <td>
                                <label>
                                    <input
                                        type="checkbox"
                                        class="form-check-input mx-1"
                                        @input="(e) => select(row)"
                                        :checked="selected.includes(row.id)"
                                        :value="row.id"
                                    />
                                </label>
                            </td>
                            <td>{{ row.nome }}</td>
                            <td class="text-center">{{ row.contact_count }}</td>
                            <td class="text-end" >
                                <router-link
                                    :to="`/listas/${row.id}`"
                                    class="text-secondary text-decoration-none"
                                >
                                    <svg-icon
                                        type="mdi"
                                        :path="icons.edit"
                                        size="1.25em"
                                    ></svg-icon>
                                </router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else>
                <p>Nenhuma lista</p>
            </div>
        </div>
    </div>
</template>
<script>
import api from "../../lib/api";

import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

import SvgIcon from "@jamescoyle/vue-icon";
import { mdiMagnify, mdiPencil } from "@mdi/js";

export default {
    components: {
        SvgIcon,
    },
    data() {
        return {
            icons: {
                magnify: mdiMagnify,
                edit: mdiPencil,
            },
            carregando: false,
            records: [],
            selected: [],
            nome: '',
            keyword: ''
        };
    },
    computed: {
        Records() {
            let records = [...this.records];


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

            records.sort((a,b) => {
                return a.nome < b.nome ? -1 : 1;
            });
            return records;
        }
    },
    created() {
        this.loadData();
    },
    methods: {
        selectAll(e) {
            if (e.target.checked) {
                this.selected = [...this.records.map(({ id }) => id)];
            } else {
                this.selected = [];
            }
        },
        async loadData() {
            let { data: records } = await api.get("contact-list");
            this.records = records;
            
        },
        select(row) {
            let values;
            if (this.selected.includes(row.id)) {
                values = this.selected.filter((v) => v != row.id);
            } else {
                values = [...this.selected, row.id];
            }
            this.selected = values;
        },
        async remover() {
            try {
                if (this.selected.length == 0) {
                    return;
                }

                let { isConfirmed } = await Swal.fire({
                    icon: "warning",
                    title: "Deseja remover o(s) registro(s) selecionado(s)?",
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Sim",
                    cancelButtonText: 'Não'
                });

                if (!isConfirmed) {
                    return;
                }
                
                let { data: { success }} = await api.delete('/contact-list/delete', {
                    data: {
                        ids: this.selected
                    }
                })

                this.selected = [];
                await this.loadData();
            } catch (err) {
                let text = err.message;
                if (err.response && err.response.data) {
                    text = err.response.data.error;
                }
                Swal.fire({
                    title: "Oops...",
                    text,
                    icon: "error",
                });
            }
        },
        async nova() {
            try {
                let { value: nome } = await Swal.fire({
                    title: "Informe o nome da lista",
                    input: "text",
                    inputLabel: "Nome da lista",
                    inputValue: "",
                    showCancelButton: true,
                    inputValidator(value) {
                        if (!value) {
                            return "Você precisa informar um nome para a lista!";
                        }
                    },
                });
                if (!nome) {
                    return;
                }
                let { data: list } = await api.post("/contact-list/save", {
                    nome,
                    contact_count: 0,
                });
                this.$router.push(`/listas/${list.id}`);
            } catch (err) {
                let text = err.message;
                if (err.response && err.response.data) {
                    text = err.response.data.error;
                }
                Swal.fire({
                    title: "Oops...",
                    text,
                    icon: "error",
                });
            }
        },
        buscar() {
            this.keyword = this.nome;
        }
    },
};
</script>
