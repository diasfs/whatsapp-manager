<template>
    <div class="container">
        <!--
        <div class="text-end mt-5">
            <button class="btn btn-primary text-white mx-2" v-if="salvando">
                SALVANDO...
            </button>
            <button
                @click="salvar"
                class="btn btn-primary text-white mx-2"
                v-else
            >
                SALVAR
            </button>
        </div>
        -->

        <div class="my-3 p-3 bg-body rounded shadow-sm">
            <form>
                <div class="form-group">
                    <label>Nome</label>
                    <input
                        type="text"
                        v-model="record.nome"
                        class="
                            w-100
                            p-2
                            mb-3
                            border
                            bg-light
                            rounded
                            form-control
                        "
                    />
                </div>
                <div class="form-group">
                    <label>Sobrenome</label>
                    <input
                        type="text"
                        v-model="record.sobrenome"
                        class="
                            w-100
                            p-2
                            mb-3
                            border
                            bg-light
                            rounded
                            form-control
                        "
                    />
                </div>
                <div class="form-group">
                    <label>Empresa</label>
                    <input
                        type="text"
                        v-model="record.empresa"
                        class="
                            w-100
                            p-2
                            mb-3
                            border
                            bg-light
                            rounded
                            form-control
                        "
                    />
                </div>
                <div class="form-group">
                    <label>Cargo</label>
                    <input
                        type="text"
                        v-model="record.cargo"
                        class="
                            w-100
                            p-2
                            mb-3
                            border
                            bg-light
                            rounded
                            form-control
                        "
                    />
                </div>
                <div class="form-group">
                    <label>E-mail</label>
                    <input
                        type="email"
                        v-model="record.email"
                        class="
                            w-100
                            p-2
                            mb-3
                            border
                            bg-light
                            rounded
                            form-control
                        "
                    />
                </div>
                <div class="form-group">
                    <label>Facebook</label>
                    <input
                        type="text"
                        v-model="record.facebook"
                        class="
                            w-100
                            p-2
                            mb-3
                            border
                            bg-light
                            rounded
                            form-control
                        "
                    />
                </div>
                <div class="form-group">
                    <label>Instagram</label>
                    <input
                        type="text"
                        v-model="record.instagram"
                        class="
                            w-100
                            p-2
                            mb-3
                            border
                            bg-light
                            rounded
                            form-control
                        "
                    />
                </div>
                <div class="form-group mb-3">
                    <label>Celular</label>
                    <PhoneInput v-model="record.celular" />
                </div>
                <div class="form-group mb-3">
                    <label>Telefone</label>
                    <PhoneInput v-model="record.telefone" />
                </div>
                <div class="form-group">
                    <label>Aniversário</label>
                    <input
                        type="date"
                        v-model="record.aniversario"
                        class="
                            w-100
                            p-2
                            mb-3
                            border
                            bg-light
                            rounded
                            form-control
                        "
                    />
                </div>
                <div class="form-group">
                    <label>Indicação</label>
                    <input
                        type="text"
                        v-model="record.indicacao"
                        class="
                            w-100
                            p-2
                            mb-3
                            border
                            bg-light
                            rounded
                            form-control
                        "
                    />
                </div>
                <div class="form-group">
                    <label>CEP</label>
                    <input
                        type="text"
                        v-model="Address.cep"
                        class="
                            w-100
                            p-2
                            mb-3
                            border
                            bg-light
                            rounded
                            form-control
                        "
                    />
                </div>
                <div class="form-group">
                    <label>Logradouro</label>
                    <input
                        type="text"
                        v-model="Address.logradouro"
                        class="
                            w-100
                            p-2
                            mb-3
                            border
                            bg-light
                            rounded
                            form-control
                        "
                    />
                </div>
                <div class="form-group">
                    <label>Número</label>
                    <input
                        type="text"
                        v-model="Address.numero"
                        class="
                            w-100
                            p-2
                            mb-3
                            border
                            bg-light
                            rounded
                            form-control
                        "
                    />
                </div>
                <div class="form-group">
                    <label>Complemento</label>
                    <input
                        type="text"
                        v-model="Address.complemento"
                        class="
                            w-100
                            p-2
                            mb-3
                            border
                            bg-light
                            rounded
                            form-control
                        "
                    />
                </div>
                <div class="form-group">
                    <label>Bairro</label>
                    <input
                        type="text"
                        v-model="Address.bairro"
                        class="
                            w-100
                            p-2
                            mb-3
                            border
                            bg-light
                            rounded
                            form-control
                        "
                    />
                </div>
                <div class="form-group">
                    <label>Cidade</label>
                    <input
                        type="text"
                        v-model="Address.cidade"
                        class="
                            w-100
                            p-2
                            mb-3
                            border
                            bg-light
                            rounded
                            form-control
                        "
                    />
                </div>
                <div class="form-group">
                    <label>UF</label>
                    <input
                        type="text"
                        v-model="Address.uf"
                        class="
                            w-100
                            p-2
                            mb-3
                            border
                            bg-light
                            rounded
                            form-control
                        "
                    />
                </div>
                <div>
                    <vue-tags-input
                        :autocomplete-items="filteredItems"
                        v-model="tag"
                        :tags="tags"
                        @tags-changed="(newTags) => (tags = newTags)"
                    />
                </div>
            </form>
        </div>

        <div class="text-end my-5">
            <button @click="salvar" class="btn btn-primary text-white mx-2">
                SALVAR
            </button>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import api from "~/lib/api";

import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

import VueTagsInput from "@sipec/vue3-tags-input";

import SvgIcon from "@jamescoyle/vue-icon";
import { mdiMagnify } from "@mdi/js";

import PhoneInput from "~/components/inputs/phone.vue";

export default {
    components: {
        SvgIcon,
        PhoneInput,
        VueTagsInput,
    },
    data() {
        return {
            icons: {
                magnify: mdiMagnify,
            },
            carregando: false,
            salvando: false,
            record: {
                nome: "",
                sobrenome: "",
                aniversario: "",
                biografia: "",
                cargo: "",
                celular: "+55 ",
                email: "",
                empresa: "",
                facebook: "",
                indicacao: "",
                instagram: "",
                telefone: "+55 ",
                Address: null,
            },
            autocompleteItems: [],
            tag: "",
            tags: [
            ],
            address: {
                cep: "",
                logradouro: "",
                numero: "",
                complemento: "",
                bairro: "",
                cidade: "",
                uf: "",
            },

            nome: "",
            changed: false,
        };
    },
    async created() {
        this.loadData();
        this.loadTags();
        /*
        try {

            let { data: messags } = await api.get(`/crm/contatos/${this.$route.params.id}/mensagens`);
            console.log(messages);
        } catch (err) {
            console.error(err);
        }
        */
    },
    beforeRouteUpdate(to, from) {
        this.loadData();
    },
    computed: {
        filteredItems() {
            return this.autocompleteItems.filter((i) => {
                return (
                    i.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1
                );
            });
        },
        Address: {
            get() {
                return this.address;
            },
            set(v) {
                console.log(v);
                this.address = v;
                this.record = {
                    ...this.record,
                    Address: v,
                };
            },
        },
    },
    methods: {
        async loadTags() {
            try {
                let { data: tags } = await api.get("/tags");
                this.autocompleteItems = tags.map(({ id, name:text }) => ({ id, text }));
            } catch (err) {
                console.error(err);
            }
        },
        async loadData() {
            try {
                let id = this.$route.params.id;
                if (!id) {
                    return;
                }
                let { data: record } = await api.get(
                    `/crm/contatos/${this.$route.params.id}`
                );
                this.record = record;
                this.nome = record.nome;
                if (record.Address) {
                    this.Address = {
                        ...this.Address,
                        ...record.Address,
                    };
                }
                if (record.Tags && record.Tags.length) {
                    this.tags = record.Tags.map(({ id, name: text }) => ({
                        id,
                        text,
                    }));
                }

                this.$nextTick(() => {
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

        async salvar() {
            try {
                this.salvando = true;
                let data = {
                    ...this.record,
                };
                if ((data.telefone || "").length < 5) {
                    data.telefone = "";
                }
                if ((data.celular || "").length < 5) {
                    data.celular = "";
                }

                if (this.tags.length > 0) {
                    let Tags = this.tags.map(({ id = null, text: name }) => ({
                        id,
                        name,
                    }));
                    data.Tags = Tags;
                }

                let { data: record } = await api.post(
                    `/crm/contatos/save`,
                    data
                );
                if (!this.$route.params.id) {
                    this.$router.replace(`/crm/${record.id}`);
                }
                await this.loadData();
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
            this.salvando = false;
        },
    },
    watch: {
        nome() {
            this.changed = true;
        },
        address: {
            deep: true,
            handler(v) {
                this.record.Address = v;
            },
        },
        "address.cep": {
            async handler(v) {
                let cep = v
                    .replace(/\D+/gim, "")
                    .substr(0, 8)
                    .replace(/^(\d{0,5})(\d{0,3})$/gim, "$1-$2")
                    .replace(/\D+$/gim, "");
                this.address.cep = cep;
                if (9 === cep.length) {
                    let {
                        data: {
                            logradouro,
                            bairro,
                            localidade: cidade,
                            uf,
                            erro = false,
                        },
                    } = await axios.get(
                        `https://viacep.com.br/ws/${cep.replace(
                            /\D+/gim,
                            ""
                        )}/json`
                    );
                    erro = !!erro;
                    if (erro) {
                        return;
                    }
                    this.address.logradouro = logradouro;
                    this.address.bairro = bairro;
                    this.address.cidade = cidade;
                    this.address.uf = uf;
                }
            },
        },
    },
};
</script>
<style lang="less" scoped>
.vue-tags-input {
    width: 100%;
    max-width: unset;
}
</style>