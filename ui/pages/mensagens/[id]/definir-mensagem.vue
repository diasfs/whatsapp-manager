<template>
    <div class="container" >
        <div class="text-end mt-5">
            <button @click="salvar" class="btn btn-primary text-white mx-2">
                SALVAR
            </button>
            <button @click="revisar" class="btn btn-secondary text-white">
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
        <!--
        <h3>Lista</h3>
        <div class="my-3 p-3 bg-body rounded shadow-sm">
            <div class="accordion">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button
                            class="
                                accordion-button
                                bg-light
                                text-black
                                collapsed
                            "
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseOne"
                            aria-expanded="true"
                            aria-controls="collapseOne"
                        >
                            Lista Selecionada
                        </button>
                    </h2>
                    <div
                        id="collapseOne"
                        class="accordion-collapse collapse"
                        aria-labelledby="headingOne"
                        data-bs-parent="#accordionExample"
                    >
                        <div class="accordion-body">
                            <table class="table table-borderless">
                                <thead>
                                    <tr>
                                        <th width="50px"></th>
                                        <th>Contato</th>
                                        <th>Telefone</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="contact in contacts"
                                        :key="contact.id"
                                    >
                                        <td>
                                            <img
                                                class="rounded-circle"
                                                width="48"
                                                v-if="
                                                    contact.WhatsappContact &&
                                                    contact.WhatsappContact
                                                        .profilePictureUrl != ''
                                                "
                                                :src="
                                                    contact.WhatsappContact
                                                        .profilePictureUrl
                                                "
                                                alt=""
                                            />
                                        </td>
                                        <td>
                                            {{ contact.nome }}
                                            {{ contact.sobrenome }}
                                        </td>
                                        <td>{{ contact.celular }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        -->

        <div class="d-flex justify-content-between mt-5">
            <h3>Mensagem</h3>
        </div>
        <div>
            <ul class="nav">
                <li class="nav-item">
                    <a
                        class="nav-link text-secondary"
                        @click.stop.prevent="adicionarImage"
                        >Anexar arquivo</a
                    >
                </li>
            </ul>
        </div>
        <div class="row">
            <div class="col-sm-12 col-lg-6">
                <div class="my-3 p-1 bg-body rounded shadown-sm w-full">
                    <form
                        @submit.prevent.stop="salvar"
                        class="position-relative"
                    >

                        <Editor :template="template" :upload_url="upload_url" @ready="ed => this.editor = ed" />
                        <ul class="nav">
                            <li class="nav-item">
                                <a href="" class="nav-link">
                                    <span
                                        class="badge bg-primary"
                                        @click.prevent.stop="
                                            () =>
                                                insertVariable(
                                                    'Nome',
                                                    '{{ nome }}'
                                                )
                                        "
                                        >Nome</span
                                    >
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="" class="nav-link">
                                    <span
                                        class="badge bg-primary"
                                        @click.prevent.stop="
                                            () =>
                                                insertVariable(
                                                    'Sobrenome',
                                                    '{{ sobrenome }}'
                                                )
                                        "
                                        >Sobrenome</span
                                    >
                                </a>
                            </li>
                            <li class="nav-item">
                                <a
                                    href=""
                                    class="nav-link"
                                    @click.prevent.stop="
                                        () =>
                                            insertVariable(
                                                'Telefone',
                                                '{{ telefone }}'
                                            )
                                    "
                                >
                                    <span class="badge bg-primary"
                                        >Telefone</span
                                    >
                                </a>
                            </li>
                            <li class="nav-item">
                                <a
                                    href=""
                                    class="nav-link"
                                    @click.prevent.stop="
                                        () =>
                                            insertVariable(
                                                'Celular',
                                                '{{ celular }}'
                                            )
                                    "
                                >
                                    <span class="badge bg-primary"
                                        >Celular</span
                                    >
                                </a>
                            </li>
                        </ul>
                    </form>
                </div>
            </div>
            <div class="col-sm-12 col-lg-6">
                <div
                    class="
                        bg-body
                        p-3
                        mx-4
                        emoji-list
                        d-sm-none d-lg-block
                        w-full
                    "
                    style="flex: 1"
                >
                    <ul class="nav emoji-nav">
                        <li
                            class="nav-item"
                            :class="{ active: title == emoji_category }"
                            v-for="{ title } in emojiGroups"
                            :key="title"
                            @click="emoji_category = title"
                        >
                            <a href="javascript:void(0)" class="nav-link">{{
                                title
                            }}</a>
                        </li>
                    </ul>
                    <div class="emoji-list-content">
                        <a
                            @click.prevent.stop="() => insertEmoji(emoji.emoji)"
                            v-for="emoji in emojis"
                            :key="emoji.emoji"
                            href="javascript:void(0)"
                            class="emoji text-decoration-none"
                            ><span>{{ emoji.emoji }}</span></a
                        >
                    </div>
                </div>
            </div>
        </div>
        <div class="d-md-flex justify-content-between"></div>

        <div class="text-end my-5">
            <button @click="salvar" class="btn btn-primary text-white mx-2">
                SALVAR
            </button>
            <button @click="revisar" class="btn btn-secondary text-white">
                PRÓXIMA ETAPA
            </button>
        </div>
    </div>
</template>
<script>
import api from "../../../lib/api";
import SessionStorage from "../../../lib/session-storage";

import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

import SvgIcon from "@jamescoyle/vue-icon";
import { mdiMagnify } from "@mdi/js";

import * as unicodeEmoji from "unicode-emoji";

import Nav from "~/components/mensagens/nav.vue";
import Editor from '~/components/mensagens/editor.vue';

export default {
    components: {
        SvgIcon,
        Nav,
        Editor
    },
    data() {
        return {
            icons: {
                magnify: mdiMagnify,
            },
            carregando: false,
            transmission: null,
            changed: false,
            nome: "",
            template: null,
            editor: null,
            emojiGroups: [],
            emoji_category: "🙂",
        };
    },
    computed: {
        upload_url() {
            let access_token = SessionStorage.getItem("access_token");
            return `${location.origin}/api/transmission/${this.$route.params.id}/upload?access_token=${access_token}`
        },
        contacts() {
            if (!this.transmission) {
                return [];
            }
            return this.transmission.Contacts;
        },
        emojis() {
            let groups = this.emojiGroups;
            let group = groups.find(
                ({ title }) => title == this.emoji_category
            );
            if (!group) {
                return [];
            }
            return group.emojis;
        },
    },
    created() {
        //await this.loadTransmission();
        let emojis = unicodeEmoji.getEmojisGroupedBy("category", {
            versionAbove: "12.0",
        });
        this.emojiGroups = [
            {
                title: "🙂",
                emojis: [...emojis["face-emotion"], ...emojis["person-people"]],
            },
            {
                title: "🐻",
                emojis: emojis["animals-nature"],
            },
            {
                title: "☕",
                emojis: emojis["food-drink"],
            },
            {
                title: "⚽",
                emojis: emojis["activities-events"],
            },
            {
                title: "🚘",
                emojis: emojis["travel-places"],
            },
            {
                title: "💡",
                emojis: emojis["objects"],
            },
            {
                title: "#️⃣",
                emojis: emojis["symbols"],
            },
            {
                title: "🏳️",
                emojis: emojis["flags"],
            },
        ];
    },
    async beforeRouteEnter(to, from, next) {
        let transmission_id = to.params.id;
        let { data: transmission } = await api.get(
            `transmission/${transmission_id}`
        );
        
        next((vm) => {
                   
            vm.setTransmission(transmission);
        });
    },
    async beforeRouteUpdate(to, from, next) {
        
        let transmission_id = to.params.id;
        let { data: transmission } = await api.get(
            `transmission/${transmission_id}`
        );
        this.setTransmission(transmission);
    },
    mounted() {        
        
        //this.setEditor();
    },
    updated() {
        
        //this.setEditor();
    },
    methods: {
        async insertVariable(text, field) {
            let selection = window.getSelection();
            let range = selection.getRangeAt(0);
            range.deleteContents();
            let textNode = document.createElement("span");
            textNode.innerHTML = ` ${field} `;
            range.insertNode(textNode);

            let textNode2 = document.createElement("span");
            textNode2.innerHTML = "&nbsp;";
            range.insertNode(textNode2);

            for (let position = 0; position != text.length + 1; position++) {
                selection.modify("move", "right", "character");
            }

            this.$nextTick(() => {
                let el = textNode2.parentNode;
                el.focus();
                if (
                    typeof window.getSelection != "undefined" &&
                    typeof document.createRange != "undefined"
                ) {
                    var range = document.createRange();
                    range.selectNodeContents(el);
                    range.collapse(false);
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if (
                    typeof document.body.createTextRange != "undefined"
                ) {
                    var textRange = document.body.createTextRange();
                    textRange.moveToElementText(el);
                    textRange.collapse(false);
                    textRange.select();
                }
            });
        },
        insertEmoji(emoji) {
            let selection = window.getSelection();
            let range = selection.getRangeAt(0);
            range.deleteContents();
            let node = document.createTextNode(emoji);
            range.insertNode(node);

            for (let position = 0; position != emoji.length; position++) {
                selection.modify("move", "right", "character");
            }
        },
        setTransmission(transmission) {
            this.transmission = transmission;
            this.template = transmission.template;
            this.nome = transmission.nome;
            this.$nextTick(() => {
                this.changed = false;

            })
        },
        async loadTransmission() {
            try {
                let transmission_id = this.$route.params.id;
                let { data: transmission } = await api.get(
                    `transmission/${transmission_id}`
                );
                this.setTransmission(transmission);
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
                let transmission_id = this.transmission.id;
                let template = await this.editor.save();
                let transmission = await api.post(
                    `/transmission/${transmission_id}/save`,
                    {
                        id: transmission_id,
                        template,
                    }
                );
                this.loadTransmission();
                Swal.fire({
                    icon: "success",
                    title: "Sucesso!",
                    text: "Mensagem salva com sucesso.",
                });
            } catch (err) {
                console.error(err);
                let text = "Não foi possível carregar a mensagem.";
                if (err.response && err.response.data) {
                    text = err.response.data.error;
                }
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text,
                });
            }
        },
        async revisar() {
            try {
                let template = await this.editor.save();
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
                this.$router.push(`/mensagens/${this.transmission.id}/revisar`);
            } catch (err) {}
        },
        async adicionarImage() {
            let access_token = SessionStorage.getItem("access_token");
            let input = document.createElement("input");
            input.type = "file";
            input.multiple = true;
            input.addEventListener("change", async (evt) => {
                if (!input.files || input.files.length === 0) {
                    return;
                }

                let files = [...input.files].map(async (file) => {
                    let data = new FormData();
                    data.append("file", file, file.name);
                    let {
                        data: { success, file: File },
                    } = await api.post(
                        `${location.origin}/api/transmission/${this.$route.params.id}/upload?access_token=${access_token}`,
                        data,
                        {
                            headers: {
                                accept: "application/json",
                                "Content-Type":
                                    "multipart/form-data; bondary=${data._bondary}",
                            },
                        }
                    );
                    if (success) {
                        if (/^image/.test(file.type)) { 
                            this.editor.blocks.insert("image", {
                                file: {
                                    url: File.url,
                                    name: file.name,
                                    size: file.size,
                                },
                                title: file.name,
                            });
                        } else {
                            this.editor.blocks.insert("attaches", {
                                file: {
                                    url: File.url,
                                    name: file.name,
                                    size: file.size,
                                },
                                title: file.name,
                            });
                        }
                    }

                });
            });
            input.click();
        },
    },
    watch: {
        template() {
            
            this.changed = true;
        },
        nome() {
            
            this.changed = true;
        },
    },
};
</script>
<style lang="less">
.codex-editor__redactor {
    padding: 1em;
}
.ce-block__content {
    background-color: #dcf8c6;
    padding: 1em;
    margin-top: 1em;
    border-radius: 1em;
    border-top-right-radius: 0;
}
.emoji-list {
    .emoji-list-content {
        overflow-y: auto;
        max-height: 300px;
    }
    display: inline-block;
    /*max-width: 50%;*/
}
a.emoji {
    font-size: 24px;
}
.emoji-nav {
    .active {
        background-color: var(--bs-gray-200);
    }
}
.nav-item {
    a {
        cursor: pointer;
    }
}
</style>