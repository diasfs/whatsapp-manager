<template>
    <div class="modal d-block" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title d-flex">
                        <img v-if="contact.WhatsappContact && contact.WhatsappContact.profilePictureUrl" :src="contact.WhatsappContact.profilePictureUrl" height="48" class="rounded-circle me-3" />
                        <span>
                            {{ contact.nome }} {{ contact.sobrenome }}
                            <small>
                                <br />
                                {{ contact.celular }}
                            </small>
                        </span>
                    </h5>
                </div>
                <div class="modal-body">
                    <div v-for="block in blocks" :key="block.id"  class="message p-3 mb-3 text-end">                        
                        <div v-if="block.type == 'paragraph'" v-html="block.data.text"></div>
                        <img v-if="block.type == 'image'" class="img-fluid mb-3" :src="block.data.file.url" alt="">
                        <div v-if="block.type == 'audio'">
                            <audio :src="block.data.file.url" controls class="my-2"></audio>
                            
                        </div>
                        <div v-if="block.type == 'video'">
                            <VideoPlayer :url="block.data.file.url" ></VideoPlayer>
                        </div>
                        <div v-if="block.type == 'attaches'" class="attaches">
                            <a :href="block.data.file.url" target="_blank" :download="block.data.title" class="d-block text-start">
                                <span class="d-flex align-items-center p-2">
                                    <svg-icon type="mdi" :path="icons.file" size="2em"></svg-icon>
                                    <span >{{ block.data.title }}</span>
                                </span>
                                <span>{{ formatSize(block.data.file.size) }}</span>                            
                                
                            </a>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button
                        type="button"
                        class="btn btn-secondary text-white"
                        data-dismiss="modal"
                        @click="$emit('close')"
                    >
                        FECHAR
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import VideoPlayer from '~/components/mensagens/video.vue'
import prettyBytes from 'pretty-bytes';
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiFile } from "@mdi/js";

export default {
    props: ['template', 'contact'],
    components: {
        VideoPlayer,
        SvgIcon
    },
    data() {
        return {
            icons: {
                file: mdiFile
            }
        }
    },
    computed: {
        blocks() {
            let blocks = this.template.blocks.map(block => {
                let row = {...block};
                if (row.type == 'paragraph') {
                    row.data = {...row.data};
                    row.data.text = row.data.text
                        .replace(/\{\{\s*nome\s*\}\}/igm,this.contact.nome || '')
                        .replace(/\{\{\s*sobrenome\s*\}\}/igm,this.contact.sobrenome || '')
                        .replace(/\{\{\s*telefone\s*\}\}/igm,this.contact.telefone || '')
                        .replace(/\{\{\s*celular\s*\}\}/igm,this.contact.celular || '')
                        .replace(/\{\{\s*email\s*\}\}/igm,this.contact.email || '')
                        .replace(/\{\{\s*instagram\s*\}\}/igm,this.contact.instagram || '')
                }
                if (row.type == 'attaches') {
                    if (/\.(mp3|wav|ogg)$/.test(row.data.file.name)) {
                        row.type = 'audio'
                    }
                    if (/\.(mp4|mpeg4|avi|mkv|mpeg)$/.test(row.data.file.name)) {
                        row.type = 'video'
                    }
                }
                return row
            });
            
            return blocks
        }
    },
    methods: {
        formatSize(size) {
            return prettyBytes(size)
        }
    }
}
</script>
<style lang="less" scoped>
    .modal-body {
        max-height: ~"calc(80vh - 60px)";
        overflow-y: scroll;
        background-color: var(--bs-gray-900);
        audio {
            width: 100%;
        }
        .message {
            display: block;
            background-color: #ccffcc;
            
            border-radius: 0.5em;
            a {
                color: black;
                text-decoration: none;
            }
            .attaches {
                a {
                    span.d-flex {
                        background-color: rgba(0,0,0,0.25);
                    }
                }
            }
        }
    }
    .modal-title {
        line-height: 1;
        small {
            font-size: 0.75em;
        }
    }
</style>