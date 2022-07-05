<template>
    <tr>
        <td valign="middle" class="text-center"><input type="checkbox" /></td>
        <td class="text-center">
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
            <span v-if="contact.email">
                {{ contact.email }}<br />
            </span>
            <span v-if="contact.instagram">
                Instagram: {{ contact.instagram }}<br />
            </span>
            <span v-if="contact.celular">
                {{ contact.celular }}
            </span>
        </td>
        <td></td>
        <td></td>
        <td>
            {{ ultima_atualizacao }}
        </td>
    </tr>
</template>
<script>
export default {
    props: ["contact"],
    computed: {
        ultima_atualizacao() {
            let date = new Date(this.contact.updatedAt);
            return new Intl.DateTimeFormat("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
            }).format(date);
        },
    },
};
</script>