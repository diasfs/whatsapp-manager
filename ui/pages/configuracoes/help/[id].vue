<template>
    <main class="container">
        <div
            class="
                d-flex
                align-items-center
                p-3
                my-3
                text-white
                bg-secondary
                rounded
                shadow-sm
            "
        >
            <div class="lh-1">
                <h1 class="h6 mb-0 text-white lh-1">Configurações</h1>
                <small>Textos de Ajuda</small>
            </div>
        </div>

        <div class="my-3 p-3 bg-body rounded shadow-sm">
            <h6 class="border-bottom pb-2 mb-0">Texto de Ajuda</h6>

            <form class="p-2">
                <div class="form-group">
                    <label>Nome</label>
                    <input
                        type="text"
                        v-model="record.name"
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
                    <label>Texto</label>

                    <Editor :init="init" v-model="record.text"></Editor>
                </div>
            </form>

            <small class="d-flex justify-content-between mt-3 px-2">
                <button
                    class="btn btn-secondary btn-sm text-white px-4"
                    @click="voltar"
                >
                    <!--<svg-icon type="mdi" :path="icons.whatsapp" size="1.5em"></svg-icon>-->
                    VOLTAR
                </button>

                <button
                    class="btn btn-primary btn-sm text-white px-4"
                    @click="salvar"
                    v-if="!saving"
                >
                    <!--<svg-icon type="mdi" :path="icons.whatsapp" size="1.5em"></svg-icon>-->
                    SALVAR
                </button>
                <button
                    class="btn btn-primary btn-sm text-white px-4"
                    disabled
                    v-else
                >
                    <!--<svg-icon type="mdi" :path="icons.whatsapp" size="1.5em"></svg-icon>-->
                    SALVANDO...
                </button>
            </small>
        </div>
    </main>
</template>
<script>
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import api from "@/lib/api";

import "@/lib/editor";
import Editor from "@tinymce/tinymce-vue";

import { v4 as uuid } from "uuid";

export default {
    components: {
        Editor,
    },
    data() {
        return {
            loading: false,
            alterado: false,
            record: {
                id: null,
                name: "",
                text: "",
            },
            init: {
                height: 500,
                menubar: false,
                skin: false,
                file_picker_types: "image",
                file_picker_callback(cb, value, meta) {
                    let input = document.createElement("input");
                    input.setAttribute("type", "file");
                    input.setAttribute("accept", "image/*");
                    input.addEventListener("change", () => {
                        console.log('change')
                        let [file] = input.files;
                        let reader = new FileReader();
                        reader.addEventListener("load", () => {
                            console.log('ready');
                            let id = "blobid" + uuid();
                            let blobCache =
                                tinymce.activeEditor.editorUpload.blobCache;
                            let base64 = reader.result.split(",")[1];
                            let blobInfo = blobCache.create(id, file, base64);
                            blobCache.add(blobInfo);
                            console.log(blobInfo.blobUri());
                            cb(blobInfo.blobUri(), { title: file.name });
                        });
                        reader.readAsDataURL(file);
                    });
                    input.click();
                },
                plugins: `advlist autolink lists link anchor image charmap print preview anchor
                    searchreplace visualblocks code fullscreen emoticons
                    insertdatetime media table paste code help wordcount`,
                toolbar: `
                    undo redo | formatselect | bold italic backcolor | 
                    alignleft aligncenter alignright alignjustify | link anchor image media |
                    table bullist numlist outdent indent | removeformat code charmap emoticons | help
                `,
            },
        };
    },
    computed: {
        saving() {
            return this.$store.state.help.saving;
        },
    },
    methods: {
        async voltar() {
            this.$router.go(-1);
        },
        async salvar() {
            try {
                if (!this.record.name) {
                    return;
                }

                let record = await this.$store.dispatch("help/save", {
                    id: this.record.id,
                    name: this.record.name,
                    text: this.record.text,
                });

                Swal.fire("Sucesso", "Registro salvo com sucesso.", "success");
                this.alterado = false;
                if (!this.record.id) {
                    this.$router.replace(`/configuracoes/help/${record.id}`);
                }
            } catch (err) {
                let text = err.message || "Não foi possível salvar o registro";
                if (
                    err.response &&
                    err.response.data &&
                    err.response.data.error
                ) {
                    text = err.response.data.error;
                }
                Swal.fire("Oops", text, "error");
            }
        },
        async loadData() {
            try {
                if (this.loading) {
                    return;
                }
                let { id } = this.$route.params;
                if (!id) {
                    this.record = {
                        id: null,
                        name: "",
                        text: "",
                    };
                    setTimeout(() => {
                        this.alterado = false;
                    });
                    return;
                }

                this.loading = true;

                let { data: record } = await api.get(`/config/help/${id}`);
                this.record = record;
                setTimeout(() => {
                    this.alterado = false;
                });
            } catch (err) {
                let text =
                    err.message || "Não foi possível carregar o registro";
                if (
                    err.response &&
                    err.response.data &&
                    err.response.data.error
                ) {
                    text = err.response.data.error;
                }
                Swal.fire("Oops", text, "error");
            }
            this.loading = false;
        },
    },
    watch: {
        record: {
            deep: true,
            handler(value) {
                this.alterado = true;
            },
        },
    },
    created() {
        this.loadData();
    },
    beforeRouteUpdate() {
        this.loadData();
    },
    async beforeRouteLeave(to, from) {
        if (!this.alterado) {
            return true;
        }
        let { isConfirmed } = await Swal.fire({
            icon: "warning",
            text: "Você possui alterações não salvas, deseja descartar as alterações?",
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "Sim",
            cancelButtonText: "Não",
        });

        if (isConfirmed) {
            return true;
        }
        return false;
    },
};
</script>