<template>
    <h3 v-if="!title">Meus contatos</h3>
    <h3 v-else>{{ title }}</h3>
    <div class="my-3 p-3 bg-body rounded shadown-sm">
        <form @submit.prevent.stop="buscar" class="position-relative">
            <input
                type="text"
                class="form-control"
                placeholder="Buscar contato pelo nome"
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
                        
                        <th colspan="2">Contato</th>
                        <!--
                        <th>E-mail/Instagram</th>
                        <th>Telefone</th>
                        -->
                    </tr>
                </thead>
                <tbody>
                    <Contato
                        :contact="contact"
                        v-model:value="contatos_selecionados"
                        v-for="contact in contacts"
                        :key="contact.id"
                    ></Contato>
                </tbody>
            </table>

        </div>
    </div>
</template>
<script>
import Contato from "./contato.vue";

import api from "../../lib/api";

import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

import SvgIcon from "@jamescoyle/vue-icon";
import { mdiMagnify } from "@mdi/js";

export default {
    props: ['value', 'title'],
    components: {
        Contato,
        SvgIcon,
    },
    data() {
        return {
            Contacts: [],
            contatos_selecionados: [],
            icons: {
                magnify: mdiMagnify,
            },
            carregando: false,
            keyword: "",
        };
    },
    created() {
        this.loadContacts();
    },
    computed: {
        contacts() {
            let contacts = [...this.Contacts];
            if (this.keyword != "") {
                let keywords = `${this.keyword}`
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .trim()
                    .split(/\s+/gim);
                for (let keyword of keywords) {
                    contacts = contacts.filter((contact) => {
                        let nome = `${contact.nome} ${contact.sobrenome}`
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .toLowerCase()
                            .trim();
                        let regex = new RegExp(keyword, "igm");
                        return regex.test(nome);
                    });
                }
            }
            contacts.sort((a, b) => {
                let a_full = `${a.nome} ${a.sobrenome}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                            .toLowerCase()
                            .trim();
                
                let b_full = `${b.nome} ${b.sobrenome}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                            .toLowerCase()
                            .trim();
                if (a_full != '' && b_full != '') {
                    return a_full < b_full ? -1 : 1;
                } else if (a_full != '' && b_full == '') {
                    return -1;
                }
                return 1;
                
                
            })
            return contacts;
        },
    },
    methods: {
        async buscar() {},
        selectAll(e) {
            if (e.target.checked) {
                this.contatos_selecionados = [
                    ...this.contacts.map(({ id }) => id),
                ];
            } else {
                this.contatos_selecionados = [];
            }
        },
        async loadContacts() {
            try {
                this.carregando = true;
                this.Contacts = [];

                let { data: contacts } = await api.get("/crm/contatos");
                this.Contacts = contacts;
            } catch (err) {
                console.error(err);
            }
            this.carregando = false;
        },
    },
    watch: {
        value: {
            handler(value) {
                
                this.contatos_selecionados = value||[];
            },
            immediate: true,
        },
        contatos_selecionados() {
            this.$emit('update:value', this.contatos_selecionados);
        }
    },
};
</script>