<template>
    <tr>
        <td width="50px">
            <img v-if="contact.WhatsappContact && contact.WhatsappContact.profilePictureUrl" :src="contact.WhatsappContact.profilePictureUrl" height="48" class="rounded-circle" />
        </td>
        <td>
            {{ contact.nome }} {{ contact.sobrenome }}
        </td>
        <td>
            {{ contact.email }} <br />
            {{ contact.instagram }}
        </td>
        <td>{{ telefone }}</td>
        <td class="text-end">
            <label>
                <input type="checkbox" class="form-check-input mx-1" @input="select" :checked="selected" :value="contact.id" />
                Selecionar
            </label>
        </td>
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