<template>
   
    <tr v-if="contact">
        <td width="50px">
            <img
                class="rounded-circle"
                width="48"
                v-if="
                    contact.WhatsappContact &&
                    contact.WhatsappContact.profilePictureUrl != ''
                "
                :src="contact.WhatsappContact.profilePictureUrl"
                alt=""
            />
        </td>
        <td>
            <div style="min-width: 200px">
                {{ contact.nome }} {{ contact.sobrenome }}<br />
                <span v-if="contact.celular">{{ contact.celular }}<br /></span>
                <span v-if="contact.email">{{ contact.email }}<br /></span>
                <span v-if="contact.instagram">{{ contact.instagram }}<br /></span>                
            </div>
        </td>
        <td>
            <button class="btn" @click="preview">
                <svg-icon type="mdi" :path="icons.eye" size="1.25em"></svg-icon>
            </button>
            <Preview
                @close="close"
                :key="contact.id"
                :contact="contact"
                :template="transmission.template"
                v-if="preview_id == contact.id"
            />
        </td>
    </tr>
    <tr v-else>
        <td colspan="3" ref="obs">
             <p>Carregando...</p>
        </td>
    </tr>
</template>
<script>


import Preview from "~/components/mensagens/preview.vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiEye } from "@mdi/js";
import api from "~/lib/api";

export default {
    props: ["contact_id", "preview_id", "transmission"],
    components: {
        Preview,
        SvgIcon,
        
    },
    data() {
        return {
            observer: null,
            contact: null,
            icons: {
                eye: mdiEye,
            },
        };
    },
    methods: {
        onChange(entries, observer) {
            entries.forEach(({ target, isIntersecting }) => {
                if (isIntersecting) {
                    this.loadData();
                    observer.unobserve(target);
                }
            })
        },
        preview() {
            this.$emit("preview", this.contact_id);
        },
        close() {
            this.$emit("preview", null);
        },

        async loadData() {
            if (this.contact !== null) {
                return;
            }
            let { data: contact } = await api.get(
                `crm/contatos/${this.contact_id}`
            );
            this.contact = contact;
        },
    },
    beforeDestroy() {
        this.observer.disconnect();
    },
    mounted() {
        this.observer.observe(this.$refs.obs)
    },
    created() {
        //this.loadData();
        this.observer = new IntersectionObserver(this.onChange, {
            root: this.$el,
            threshold: 0.1,
        })
    },
};
</script>