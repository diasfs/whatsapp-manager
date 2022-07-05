<template>
    <tr>
        <td class="text-end">
            <label>
                <input type="checkbox" class="form-check-input mx-1" @input="select" :checked="selected" :value="lista.id" />
            </label>
        </td>
        <td>
            {{ lista.nome }}
        </td>
        <td class="text-center">{{ lista.contact_count}}</td>
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
    props: ['lista', 'value'],
    data() {
        return {
            Value: []
        }
    },
    computed: {
        selected() {
            return this.Value.includes(this.lista.id);
        }
    },
    methods: {
        select() {
            let values;
            if (this.Value.includes(this.lista.id)) {
                values = this.Value.filter(v => v != this.lista.id);
            } else {
                values = [...this.Value, this.lista.id];
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