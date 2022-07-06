<template>
    <div class="container">
        <!--
        <div
            class="d-flex align-items-center p-3 my-3 text-white bg-secondary rounded shadow-sm"
        >
            <div class="lh-1">
                <h1 class="h6 mb-0 text-white lh-1">CRM</h1>
                <small>Contatos</small>
            </div>
        </div>
        -->

        <div class="text-end mt-5">
            <button
                v-if="contatos_selecionados.length != 0"
                @click.prevent.stop="remover"
                class="btn btn-danger text-white mx-2"
            >
                Excluir
            </button>
            <router-link to="/crm/novo" class="btn btn-primary text-white"
                >Novo Contato</router-link
            >
        </div>

        <h3>Encontrar Contato</h3>
        <div class="my-3 p-3 bg-body rounded shadown-sm">
            <form class="position-relative">
                <input
                    type="text"
                    class="form-control"
                    placeholder="Buscar contato pelo nome"
                    v-model="keyword"
                />
                <svg-icon
                    type="mdi"
                    :path="icons.magnify"
                    class="position-absolute top-50 end-0 translate-middle"
                    style="cursor: pointer"
                ></svg-icon>
            </form>
            <div>
                <span
                    class="badge badge-secondary mt-2 me-1"
                    :class="{ selected: tags_selecionadas.includes(tag.id) }"
                    @click="(e) => toggleTag(tag.id)"
                    v-for="tag in tags"
                    :key="tag.id"
                    >{{ tag.name }}</span
                >
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
                            <th class="text-center" width="50px">
                                <label style="font-size: 1rem">
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
                            -->
                            <th width="300px">Tags</th>
                            <!--
                            <th class="text-center" width="170px">
                                Último Contato
                            </th>
                            -->
                            <th class="text-center" width="170px">
                                Última Atualização
                            </th>
                            <th width="60px"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <Contact
                            v-for="contact in contatos"
                            :contact="contact"
                            v-model:value="contatos_selecionados"
                            v-show="contact.show"
                            :key="contact.id"
                        ></Contact>
                        <tr v-if="quantidade == 0">
                            <td colspan="7">Nenhum contato</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import api from "../../lib/api";

import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

import SvgIcon from "@jamescoyle/vue-icon";
import { mdiWhatsapp, mdiMagnify } from "@mdi/js";

import Contact from "../../components/crm/contato.vue";

export default {
    components: {
        SvgIcon,
        Contact,
    },
    data() {
        return {
            icons: {
                whatsapp: mdiWhatsapp,
                magnify: mdiMagnify,
            },
            carregando: false,
            Contatos: [],
            contatos_selecionados: [],
            tags_selecionadas: [],
            keyword: "",
            tags: [],
        };
    },
    created() {
        this.loadContatos();
        this.loadTags();
    },
    computed: {
        quantidade() {
            let contatos = this.contatos.filter(c => c.show);
            return contatos.length;
        },
        contatos() {
            let keywords = [];
            if (this.keyword != "") {
                keywords = `${this.keyword}`
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .trim()
                    .split(/\s+/gim);
            }

            let contatos = [...this.Contatos].map((c) => {
                let show = true;
                if (this.tags_selecionadas.length != 0) {
                    let encontrou = false;
                    for (let tag_id of this.tags_selecionadas) {
                        let tag = c.Tags.find((t) => t.id == tag_id);

                        if (tag) {
                            encontrou = true;
                            break;
                        }
                    }
                    show = encontrou;
                }

                if (keywords.length != 0 && show) {
                    for (let keyword of keywords) {
                        let nome = `${c.nome} ${c.sobrenome}`
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .toLowerCase()
                            .trim();
                        let regex = new RegExp(keyword, "igm");
                        if (!regex.test(nome)) {
                            show = false;
                            break;
                        }
                    }
                }

                return {
                    ...c,
                    show,
                };
            });

            return contatos;
        },
    },
    methods: {
        toggleTag(id) {
            if (this.tags_selecionadas.includes(id)) {
                this.tags_selecionadas = this.tags_selecionadas.filter(
                    (t) => t != id
                );
            } else {
                this.tags_selecionadas = [...this.tags_selecionadas, id];
            }
        },
        async remover() {
            try {
                if (this.contatos_selecionados.length == 0) {
                    return;
                }

                let { isConfirmed } = await Swal.fire({
                    icon: "warning",
                    title: "Deseja remover o(s) registro(s) selecionado(s)?",
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Sim",
                    cancelButtonText: "Não",
                });

                if (!isConfirmed) {
                    return;
                }

                let {
                    data: { success },
                } = await api.delete("/crm/contatos/delete", {
                    data: {
                        ids: this.contatos_selecionados,
                    },
                });

                this.contatos_selecionados = [];
                await this.loadContatos();
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
        selectAll(e) {
            if (e.target.checked) {
                this.contatos_selecionados = [
                    ...this.contatos.map(({ id }) => id),
                ];
            } else {
                this.contatos_selecionados = [];
            }
        },
        async loadContatos() {
            try {
                this.carregando = true;
                let { data: contatos } = await api.get("/crm/contatos");
                contatos.sort((a, b) => {
                    let nome_completo_a = `${a.nome} ${a.sobrenome}`.trim();
                    let nome_completo_b = `${b.nome} ${b.sobrenome}`.trim();
                    if (nome_completo_a == "" && nome_completo_b == "") {
                        if (a.WhatsappContact && b.WhatsappContact) {
                            if (
                                a.WhatsappContact.profilePictureUrl != "" &&
                                b.WhatsappContact.profilePictureUrl == ""
                            ) {
                                return -1;
                            }
                            if (
                                a.WhatsappContact.profilePictureUrl == "" &&
                                b.WhatsappContact.profilePictureUrl != ""
                            ) {
                                return 1;
                            }
                        }
                        if (a.WhatsappContact && !b.WhatsappContact) {
                            return -1;
                        }
                        if (!a.WhatsappContact && b.WhatsappContact) {
                            return 1;
                        }
                        return a.celular < b.celular ? -1 : 1;
                    }
                    if (nome_completo_a == "" && nome_completo_b != "") {
                        return 1;
                    }
                    if (nome_completo_a != "" && nome_completo_b == "") {
                        return -1;
                    }
                    return nome_completo_a < nome_completo_b ? -1 : 1;
                });

                this.Contatos = contatos;
            } catch (err) {}
            this.carregando = false;
        },
        async loadTags() {
            try {
                let { data: tags } = await api.get("/tags");
                this.tags = tags;
            } catch (err) {
                console.error(err);
            }
        },
    },
};
</script>
<style lang="less" scoped>
.badge-secondary {
    cursor: pointer;
    background: var(--bs-secondary);
    opacity: 0.7;
    user-select: none;
    &.selected {
        opacity: 1;
    }
}
</style>