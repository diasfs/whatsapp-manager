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
            <button  class="btn btn-primary text-white mx-2" v-if="salvando">
                SALVANDO...
            </button>
            <button @click="salvar" class="btn btn-primary text-white mx-2" v-else>
                SALVAR
            </button>
        </div>

        <h3>Nome da Lista</h3>
        <div class="my-3 p-3 bg-body rounded shadow-sm">
            <input
                type="text"
                v-model="nome"
                class="w-100 p-2 border bg-light rounded"
            />
        </div>

        <MeusContatos title="Contatos" v-model:value="contatos"></MeusContatos>

        <div class="text-end my-5">
            <button @click="salvar" class="btn btn-primary text-white mx-2">
                SALVAR
            </button>
        </div>
    </div>
</template>
<script>
import api from "~/lib/api";

import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

import SvgIcon from "@jamescoyle/vue-icon";
import { mdiMagnify } from "@mdi/js";

import MeusContatos from "~/components/mensagens/meus-contatos.vue";
import Nav from '~/components/mensagens/nav.vue';

export default {
    components: {
        SvgIcon,
        MeusContatos,
        Nav
    },
    data() {
        return {
            icons: {
                magnify: mdiMagnify,
            },
            carregando: false,
            salvando: false,
            contatos: [],
            record: null,
            nome: '',
            changed: false
        };
    },
    created() {
        this.loadData();
    },    
    beforeRouteUpdate(to, from) {
        this.loadData();
    },
    methods: {
        async loadData() {
            try {
                let id = this.$route.params.id;
                let { data: record } = await api.get(
                    `contact-list/${id}`
                );
                this.record = record;
                this.nome = record.nome;
                this.contatos = record.Contacts.map(({ id }) => id);
                this.$nextTick(()=>{
                    this.changed = false;
                });
            } catch (err) {
                let text = "Não foi possível carregar a lista.";
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
        async buscar() {},
        async salvar() {
            try {
                this.salvando = true;
                let { data: record } = await api.post(`/contact-list/save`, {
                    id: this.record.id,
                    nome: this.nome,
                    contact_ids: this.contatos
                });
                await this.loadData();
                await Swal.fire({
                    icon: "success",
                    title: "Registro salvo com sucesso!"
                });
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
            this.salvando = false;
        }
    },
    watch: {
        nome() {
            this.changed = true;
            
        },
        contatos() {
            this.changed = true;
            
        }
    }
};
</script>
