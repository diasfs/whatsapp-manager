<template>
    <tr>
        <td valign="middle" class="text-center">
            <input
                type="checkbox"
                class="form-check-input mx-1"
                @input="select"
                :checked="selected"
                :value="contact.id"
            />
        </td>
        <td class="text-center" width="60px">
            <img
                :src="contact.WhatsappContact.profilePictureUrl"
                width="48"
                height="48"
                alt=""
                class="rounded-circle"
                v-if="
                    contact.WhatsappContact &&
                    contact.WhatsappContact.profilePictureUrl
                "
            />
        </td>

        <td>
            {{ contact.nome }} {{ contact.sobrenome }} <br />
            <span v-if="contact.email"> {{ contact.email }}<br /> </span>
            <span v-if="contact.instagram">
                Instagram: {{ contact.instagram }}<br />
            </span>
            <span v-if="contact.celular">
                {{ contact.celular }}
            </span>
        </td>
        <td>
            <span
                v-for="tag in contact.Tags"
                :key="tag.id"
                class="badge-secondary badge me-1"
                >{{ tag.name }}</span
            >
        </td>
        
        <td class="text-center">
            {{ ultima_atualizacao }}
        </td>
        <td class="text-end">
            <router-link :to="`/crm/${this.contact.id}`">
                <svg-icon
                    type="mdi"
                    :path="icons.pencil"
                    class=""
                    style="cursor: pointer"
                ></svg-icon>
            </router-link>
        </td>

    </tr>
</template>
<script>
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiPencil as pencil } from "@mdi/js";

export default {
    props: ["contact", "value"],
    components: {
        SvgIcon,
    },
    data() {
        return {            
            Value: [],
            icons: {
                pencil,
            },
        };
    },
    computed: {
        selected() {
            
            return this.Value.includes(this.contact.id);
        },
        ultima_atualizacao() {
            
            let date = new Date(this.contact.updatedAt);
            return new Intl.DateTimeFormat("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
            }).format(date);
        },
    },
    methods: {
        
        select() {
            let values;
            if (this.Value.includes(this.contact.id)) {
                values = this.Value.filter((v) => v != this.contact.id);
            } else {
                values = [...this.Value, this.contact.id];
            }
            return this.$emit("update:value", values);
        },
    },
    watch: {
        value: {
            handler(value) {
                this.Value = value;
            },
            immediate: true,
        },
    }
};
</script>
<style scoped>
.badge-primary {
    background: var(--bs-primary);
}
.badge-secondary {
    background: var(--bs-secondary);
}
</style>