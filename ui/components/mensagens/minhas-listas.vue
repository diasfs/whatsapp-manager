<template>
    <h3 v-if="!title">Minhas Listas</h3>
    <h3 v-else>{{ title }}</h3>
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
        <div class="table-responsive">
            <table class="table table-borderless">
                <thead>
                    <tr>
                        <th class="text-center" width="50">
                            <label style="font-size:1rem">
                                <input
                                    type="checkbox"
                                    class="form-check-input mx-1"
                                    @click="selectAll"
                                />                                
                            </label>
                        </th>
                        
                        <th>Lista</th>
                        <th width="150px" class="text-center">Contatos</th>
                        <!--
                        <th>E-mail/Instagram</th>
                        <th>Telefone</th>
                        -->
                    </tr>
                </thead>
                <tbody>
                    <Lista
                        :lista="lista"
                        v-model:value="listas_selecionadas"
                        v-for="lista in listas"
                        :key="lista.id"
                    ></Lista>
                </tbody>
            </table>

        </div>
    </div>
</template>
<script>
import Lista from "./lista.vue";

import api from "~/lib/api";

import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

import SvgIcon from "@jamescoyle/vue-icon";
import { mdiMagnify } from "@mdi/js";

export default {
    props: ['value', 'title'],
    components: {
        Lista,
        SvgIcon,
    },
    data() {
        return {
            Listas: [],
            listas_selecionadas: [],
            icons: {
                magnify: mdiMagnify,
            },
            carregando: false,
            keyword: "",
        };
    },
    created() {
        this.loadListas();
    },
    computed: {
        listas() {
            let listas = [...this.Listas];
            if (this.keyword != "") {
                let keywords = `${this.keyword}`
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .trim()
                    .split(/\s+/gim);
                for (let keyword of keywords) {
                    listas = listas.filter((lista) => {
                        let nome = lista.nome
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .toLowerCase()
                            .trim();
                        let regex = new RegExp(keyword, "igm");
                        return regex.test(nome);
                    });
                }
            }
            listas.sort((a, b) => {
                let a_full = a.nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                            .toLowerCase()
                            .trim();
                
                let b_full = b.nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                            .toLowerCase()
                            .trim();
                if (a_full != '' && b_full != '') {
                    return a_full < b_full ? -1 : 1;
                } else if (a_full != '' && b_full == '') {
                    return -1;
                }
                return 1;
                
                
            })
            return listas;
        },
    },
    methods: {
        async buscar() {},
        selectAll(e) {
            if (e.target.checked) {
                this.listas_selecionadas = [
                    ...this.listas.map(({ id }) => id),
                ];
            } else {
                this.listas_selecionadas = [];
            }
        },
        async loadListas() {
            try {
                this.carregando = true;
                this.Listas = [];

                let { data: listas } = await api.get("/contact-list");
                this.Listas = listas;
            } catch (err) {
                console.error(err);
            }
            this.carregando = false;
        },
    },
    watch: {
        value: {
            handler(value) {
                
                this.listas_selecionadas = value||[];
            },
            immediate: true,
        },
        listas_selecionadas() {
            this.$emit('update:value', this.listas_selecionadas);
        }
    },
};
</script>