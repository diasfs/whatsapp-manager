<template>
    <h1>home</h1>
    <a @click="signOut">Sair</a>
</template>
<script>
    import SessionStorage from "../lib/session-storage"
    export default {
        methods: {
            signOut() {
                SessionStorage.removeItem('access_token');
                this.$router.replace('/login');
            }
        },
        created() {
            const access_token = SessionStorage.getItem('access_token');
            if (!access_token) {
                this.$router.replace('/login')
            }
        }
    }
</script>