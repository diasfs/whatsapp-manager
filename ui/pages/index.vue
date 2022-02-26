<template>
    <h1>home</h1>
    <a @click="signOut">Sair</a>
</template>
<script>
    import SessionStorage from "../lib/session-storage"
    import api from '../lib/api';

    export default {
        methods: {
            signOut() {
                SessionStorage.removeItem('access_token');
                this.$router.replace('/login');
            }
        },
        async created() {
            const access_token = SessionStorage.getItem('access_token');
            if (!access_token) {
                return this.$router.replace('/login')
            }
            let { data } = await api.get('/user');
            console.log(data)
        }
    }
</script>