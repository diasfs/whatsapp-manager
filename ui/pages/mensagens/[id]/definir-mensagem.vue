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
            <button @click="enviar" class="btn btn-secondary text-white">
                PRÓXIMA ETAPA
            </button>
        </div>

        <h3>Nova mensagem</h3>

        <div class="my-3 p-3 bg-body rounded shadown-sm">
            <ul class="nav">
                <li class="nav-item">
                    <a class="nav-link disabled">Escolher lista</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link active">Definir mensagem</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link disabled">Revisar</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link disabled">Enviar</a>
                </li>
            </ul>
        </div>

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

        <div class="d-flex justify-content-between mt-5">
            <h3>Mensagem</h3>
            <div>
                <ul class="nav">
                    <li class="nav-item">
                        <a
                            class="nav-link text-secondary"
                            @click.stop.prevent="adicionarImage"
                            >Anexar arquivo</a
                        >
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-secondary">Personalizar</a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="d-flex justify-content-between">
            <div class="my-3 p-1 bg-body rounded shadown-sm" style="width: 500px">
                <form @submit.prevent.stop="salvar" class="position-relative">
                    <!--
                        <textarea
                        type="text"
                        class="form-control rounded border-0"
                        rows="5"
                        placeholder="Escreva sua mensagem"
                        v-model="template"
                    ></textarea>
                    -->
                    <div ref="editorjs" class="border bg-body"></div>
                    <ul class="nav">
                        <li class="nav-item">
                            <a href="" class="nav-link">
                                <span class="badge bg-primary"  @click.prevent.stop="() => insertVariable('Nome', '{{ nome }}')">Nome</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="" class="nav-link">
                                <span class="badge bg-primary"  @click.prevent.stop="() => insertVariable('Sobrenome', '{{ sobrenome }}')">Sobrenome</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="" class="nav-link"  @click.prevent.stop="() => insertVariable('Telefone', '{{ telefone }}')">
                                <span class="badge bg-primary">Telefone</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="" class="nav-link" @click.prevent.stop="() => insertVariable('Celular', '{{ celular }}')">
                                <span class="badge bg-primary">Celular</span>
                            </a>
                        </li>
                    </ul>
                </form>
            </div>
            <div class="bg-body p-3 mx-4 emoji-list" style="flex:1">
                <ul class="nav emoji-nav">
                    <li class="nav-item" :class="{active: title == emoji_category}" v-for="({ title }) in emojiGroups" :key="title" @click="emoji_category=title">
                        <a href="javascript:void(0)" class="nav-link" >{{ title }}</a>
                    </li>
                </ul>
                <div class="emoji-list-content">
                    <a @click.prevent.stop="() => insertEmoji(emoji.emoji)" v-for="emoji in emojis" :key="emoji.emoji" href="javascript:void(0)" class="emoji text-decoration-none"><span>{{ emoji.emoji }}</span></a>                    
                </div>
            </div>
        </div>

        <div class="my-5 text-end">
            <button
                @click="salvar"
                class="btn btn-secondary text-white rounded-pill px-5"
            >
                Salvar Mensagem
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

import EditorJS from "@editorjs/editorjs";
import ImageTool from "@editorjs/image";
import AttachesTool from "@editorjs/attaches";

import * as unicodeEmoji from 'unicode-emoji'


export default {
    components: {
        SvgIcon,
    },
    data() {
        return {
            icons: {
                magnify: mdiMagnify,
            },
            carregando: false,
            transmission: null,
            template: "",
            editor: null,
            emojiGroups: [],
            emoji_category: '🙂'
        };
    },
    computed: {
        contacts() {
            if (!this.transmission) {
                return [];
            }
            return this.transmission.Contacts;
        },
        emojis() {
            let groups = this.emojiGroups;
            let group = groups.find(({ title }) => title == this.emoji_category);
            if (!group) {
                return []
            };
            return group.emojis;
        }
    },
    created() {
        this.loadTransmission();
        let emojis = unicodeEmoji.getEmojisGroupedBy('category', {versionAbove: '12.0'});
        this.emojiGroups = [
            {
                title: '🙂',
                emojis: [...emojis['face-emotion'], ...emojis['person-people']]
            },
            {
                title: '🐻',
                emojis: emojis['animals-nature'],                
            },
            {
                title: '☕',
                emojis: emojis['food-drink']
            },
            {
                title: '⚽',
                emojis: emojis['activities-events']
            },
            {
                title: '🚘',
                emojis: emojis['travel-places']
            },
            {
                title: '💡',
                emojis: emojis['objects']
            },
            {
                title: '#️⃣',
                emojis: emojis['symbols']
            },
            {
                title: '🏳️',
                emojis: emojis['flags']
            }
        ]
    },
    mounted() {
        let access_token = SessionStorage.getItem("access_token");
        this.editor = new EditorJS({
            holder: this.$refs.editorjs,
            tools: {
                attaches: {
                    class: AttachesTool,
                    config: {
                        endpoint: `${location.origin}/api/transmission/${this.$route.params.id}/upload?access_token=${access_token}`,
                    },
                },
                image: {
                    class: ImageTool,
                    inlineToolbar: true,
                    config: {
                        endpoints: {
                            byFile: `${location.origin}/api/transmission/${this.$route.params.id}/upload?access_token=${access_token}`,
                        },
                    },
                },
            },
        });
    },
    methods: {
        async insertVariable(text, field) {
            let selection = window.getSelection();
            let range = selection.getRangeAt(0);
            range.deleteContents();
            //let node = document.createTextNode(emoji);
            let span = document.createElement('span');
            span.innerHTML = text;
            span.classList.add('badge', 'bg-dark', 'text-uppercase')
            span.setAttribute('field', field);
            span.contentEditable = false;
            let textNode = document.createElement("span")
            textNode.innerHTML = '&nbsp;';            
            range.insertNode(textNode);
            
            range.insertNode(span);
            

            for(let position = 0; position != text.length + 1; position++)
            {
                selection.modify("move", "right", "character");
            };

            
        },
        insertEmoji(emoji) {       
            let selection = window.getSelection();
            let range = selection.getRangeAt(0);
            range.deleteContents();
            let node = document.createTextNode(emoji);
            range.insertNode(node);

            for(let position = 0; position != emoji.length; position++)
            {
                selection.modify("move", "right", "character");
            };          
        },
        async loadTransmission() {
            try {
                let transmission_id = this.$route.params.id;
                let { data: transmission } = await api.get(
                    `transmission/${transmission_id}`
                );
                this.transmission = transmission;
                this.template = transmission.template;
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
                        template,
                    }
                );
                /*
                this.transmission = transmission;
                this.template = transmission.template;
                */
                this.loadTransmission();
                Swal.fire({
                    icon: "success",
                    title: "Sucesso!",
                    text: "Mensagem salva com sucesso.",
                });
            } catch (err) {
                console.log(err);
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
        async adicionarImage() {
            let input = document.createElement("input");
            input.type = "file";
            input.multiple = true;
            input.addEventListener("change", async (evt) => {
                if (!input.files || input.files.length === 0) {
                    return;
                }

                let files = [...input.files].map((file) => {
                    return new Promise((resolve, reject) => {
                        let reader = new FileReader();
                        reader.addEventListener("loadend", (evt) => {
                            resolve(reader.result);

                            let type = "attaches";
                            if (/^image/.test(file.type)) {
                                this.editor.blocks.insert("image", {
                                    file: {
                                        url: reader.result,
                                        name: file.name,
                                        size: file.size,
                                    },
                                    title: file.name,
                                });
                            } else {
                                this.editor.blocks.insert("attaches", {
                                    file: {
                                        url: reader.result,
                                        name: file.name,
                                        size: file.size,
                                    },
                                    title: file.name,
                                });
                            }
                        });
                        reader.readAsDataURL(file);
                    });
                });

                files = await Promise.all(files);
                for (let file of files) {
                }
            });
            input.click();
        },
        async enviar() {
            try {
                await api.post(`/whatsapp/transmission/${this.transmission.id}/send`);
                Swal.fire({
                    icon: "success",
                    title: "Sucesso!",
                    text: "Mensagem salva com sucesso.",
                });
            } catch (err) {
                console.log(err);
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
    },
    watch: {
        template() {
            console.log(this.editor);
            this.editor.isReady.then(() => {
                this.editor.blocks.render(this.template);
            });
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
    max-width: 50%;
}
a.emoji {
    font-size: 24px;
}
.emoji-nav {
    .active {
        background-color: var(--bs-gray-200);

    }
}
</style>