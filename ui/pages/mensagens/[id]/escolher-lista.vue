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
            <button @click="salvar" class="btn btn-primary text-white mx-2">
                SALVAR
            </button>
            <button @click="proxima" class="btn btn-secondary text-white">
                PRÓXIMA ETAPA
            </button>
        </div>

        <div class="my-3 p-3 bg-body rounded shadown-sm">
            <Nav :transmission_id="$route.params.id" :status="transmission.status" v-if="transmission" />
        </div>

        <h3>Nome da Mensagem</h3>
        <div class="my-3 p-3 bg-body rounded shadow-sm">
            <input
                type="text"
                v-model="nome"
                class="w-100 p-2 border bg-light rounded"
            />
        </div>     

        <div class="my-3 p3 bg-body rounded shadow-sm">
            <div class="accordion">
                <h2 class="accordion-header">
                    <button
                        class="accordion-button bg-light text-black collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#listasAccordion"
                        aria-expanded="true"
                        aria-controls="listasAccordion"
                        
                    >
                        Listas &nbsp;
                        <span v-if="listas.length == 1"> (1 selecionada)</span>
                        <span v-if="listas.length > 1"> ({{ listas.length }} selecionadas)</span>
                    </button>
                </h2>
                <div id="listasAccordion" class="accordion-collapse collapse">
                    <div class="accordion-body">
                        <MinhasListas v-model:value="listas"></MinhasListas>
                    </div>
                </div>
            </div>
        </div>

        <div class="my-3 p3 bg-body rounded shadow-sm">
            <div class="accordion">
                <h2 class="accordion-header">
                    <button
                        class="accordion-button bg-light text-black collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#contatosAccordion"
                        aria-expanded="true"
                        aria-controls="contatosAccordion"
                        
                    >
                        Contatos &nbsp;
                        <span v-if="contatos.length == 1"> (1 selecionado)</span>
                        <span v-if="contatos.length > 1"> ({{ contatos.length }} selecionados)</span>
                    </button>
                </h2>
                <div id="contatosAccordion" class="accordion-collapse collapse">
                    <div class="accordion-body">
                        <MeusContatos v-model:value="contatos"></MeusContatos>
                    </div>
                </div>
            </div>
        </div>

        <div class="text-end my-5">
            <button @click="salvar" class="btn btn-primary text-white mx-2">
                SALVAR
            </button>
            <button @click="proxima" class="btn btn-secondary text-white">
                PRÓXIMA ETAPA
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
import MinhasListas from "~/components/mensagens/minhas-listas.vue";

import Nav from "~/components/mensagens/nav.vue";

export default {
    components: {
        SvgIcon,
        MeusContatos,
        MinhasListas,
        Nav,
    },
    data() {
        return {
            icons: {
                magnify: mdiMagnify,
            },
            carregando: false,
            contatos: [],
            listas: [],
            transmission: null,
            nome: "",
            changed: false,
        };
    },
    created() {
        this.loadTransmission();
    },
    beforeRouteUpdate(to, from) {
        this.loadTransmission();
    },
    methods: {
        async loadTransmission() {
            try {
                let transmission_id = this.$route.params.id;
                let { data: transmission } = await api.get(
                    `transmission/${transmission_id}`
                );
                this.transmission = transmission;
                if (transmission.status != 'RASCUNHO') {
                    await this.$router.replace(`/mensagens/${this.$route.params.id}/status`);
                }
                this.nome = transmission.nome;
                this.contatos = transmission.Contacts.map(({ id }) => id);
                this.listas = transmission.ContactLists.map(({ id }) => id);
                this.$nextTick(() => {
                    this.changed = false;
                });
            } catch (err) {
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
        async salvar() {
            try {
                let { data: transmission } = await api.post(
                    `/transmission/${this.transmission.id}/save`,
                    {
                        nome: this.nome,
                        contact_ids: this.contatos,
                        contact_list_ids: this.listas
                    }
                );
                await this.loadTransmission();
                await Swal.fire({
                    icon: "success",
                    title: "Registro salvo com sucesso!",
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
        },
        async proxima() {
            try {
                if (this.changed) {
                    let { isConfirmed } = await Swal.fire({
                        title: "Deseja continuar sem salvar?",
                        text: "Você possui alterações não salvas, deseja continuar mesmo assim?",
                        icon: "warning",
                        showConfirmButton: true,
                        showCancelButton: true,
                        confirmButtonText: "Sim",
                        cancelButtonText: "Não",
                    });
                    if (!isConfirmed) {
                        return;
                    }
                }

                this.$router.push(
                    `/mensagens/${this.transmission.id}/definir-mensagem`
                );
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
    },
    watch: {
        nome() {
            this.changed = true;
        },
        contatos() {
            this.changed = true;
        },
        listas() {
            this.changed = true;
        }
    },
};
</script>
