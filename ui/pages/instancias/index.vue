<template>
    <div class="container">
        <table>
            <thead>
                <tr>
                    <th>wid</th>
                    <th>session_id</th>
                    <th>state</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="instancia in instancias" :key="instancia.wid">
                    <td>{{ instancia.wid }}</td>
                    <td>{{ instancia.session_id }}</td>
                    <td>{{ instancia.state }}</td>
                    <td><img :src="`data:image/jpeg;base64,${instancia.screen}`" height="100" v-if="instancia.screen" /></td>
                    <td><button class="btn bg-danger text-white btn-sm mx-1" @click="e => logout(instancia.session_id)">Desconectar</button></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    data() {
        return {
            instancias: []
        }
    },
    methods: {
        async loadData() {
            let { data: instancias } = await axios.get('https://oraclecloud.altgrupo.com.br/wapi/instances');
            this.instancias = instancias;
        },
        async logout(session_id) {
            await axios.get(`https://oraclecloud.altgrupo.com.br/wapi/${session_id}/disconnect`);
            await this.loadData();
        }
    },
    created() {
        this.loadData();
    }
}
</script>