<template>
    <ul class="nav">
        <li class="nav-item">            
            <router-link
                :to="`/mensagens/${transmission_id}/escolher-lista`"
                active-class="active"
                class="nav-link"
                v-if="status && status == 'RASCUNHO'"
                >Escolher lista</router-link
            >
            <a v-else class="nav-link disabled">Escolher lista</a>
        </li>
        <li class="nav-item">
            <router-link
                :to="`/mensagens/${transmission_id}/definir-mensagem`"
                active-class="active"
                class="nav-link"
                v-if="status && status == 'RASCUNHO'"
                >Definir mensagem</router-link
            >
            <a v-else class="nav-link disabled">Definir mensagem</a>
        </li>
        <li class="nav-item">
            <router-link
                :to="`/mensagens/${transmission_id}/revisar`"
                active-class="active"
                class="nav-link"
                >Revisar</router-link
            >
        </li>
        <li class="nav-item">
            <router-link
                :to="`/mensagens/${transmission_id}/status`"
                active-class="active"
                class="nav-link"
                >Acompanhar</router-link
            >
        </li>
    </ul>
</template>
<script>
export default {
    props: ['transmission_id', 'status']
}
</script>
<style lang="less" scoped>
.nav {
    .nav-item {
        a.nav-link:not(.active) {
            color: grey;
        }
    }
}
</style>