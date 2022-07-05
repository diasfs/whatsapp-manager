<template>
    <tr>
        <td class="text-end">
            <label>
                <input type="checkbox" class="form-check-input mx-1" @input="select" :checked="selected" :value="contact.id" />
            </label>
        </td>
        <td width="50px">
            <img v-if="contact.WhatsappContact && contact.WhatsappContact.profilePictureUrl" :src="contact.WhatsappContact.profilePictureUrl" height="48" class="rounded-circle" />
        </td>
        <td>
            {{ contact.nome }} {{ contact.sobrenome }}<br />
            <span v-if="contact.email">
                {{ contact.email }}<br />
            </span>
            <span v-if="contact.instagram">
                Instagram: {{ contact.instagram }}<br />
            </span>
            <span v-if="telefone">
                {{ telefone }}
            </span>
        </td>
        <!--
        <td>
            <div style="min-width:120px"></div>
            {{ contact.email }} <br />
            {{ contact.instagram }}
        </td>
        <td>
            <div style="min-width:130px"></div>
                {{ telefone }}                
        </td>
        -->
    </tr>
</template>
<script>
export default {
    props: ['contact', 'value'],
    data() {
        return {
            Value: []
        }
    },
    computed: {
        telefone() {
            if (this.contact.celular != '') {
                return this.contact.celular;
            }
            return this.contact.telefone;
        },
        selected() {
            return this.Value.includes(this.contact.id);
        }
    },
    methods: {
        select() {
            let values;
            if (this.Value.includes(this.contact.id)) {
                values = this.Value.filter(v => v != this.contact.id);
            } else {
                values = [...this.Value, this.contact.id];
            }            
            return this.$emit('update:value', values);
        }
    },
    watch: {
        value: {
            handler(value) {
                
                this.Value = value
            },
            immediate: true
        }
    }
}
</script>