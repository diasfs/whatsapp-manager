<template>
    <main class="container">
        <div
            class="
                d-flex
                align-items-center
                p-3
                my-3
                text-white
                bg-secondary
                rounded
                shadow-sm
            "
        >
            <div class="lh-1">
                <h1 class="h6 mb-0 text-white lh-1">Configurações</h1>
                <small>Textos de Ajuda</small>
            </div>
        </div>

        <div class="my-3 p-3 bg-body rounded shadow-sm">
            <h6 class="border-bottom pb-2 mb-0">Textos de Ajuda</h6>

            <div v-if="loading">Carregando...</div>
            <div v-else-if="records.length == 0">
                <p>Nenhum registro encontrado.</p>
            </div>
            <div v-else>
                <Help v-for="help in records" :help="help" :key="help.id"></Help>
            </div>

            <small
                class="
                    d-flex
                    justify-content-md-end justify-content-center
                    mt-3
                "
            >
                <button class="btn btn-primary btn-sm text-white px-4" @click="novo">
                    <!--<svg-icon type="mdi" :path="icons.whatsapp" size="1.5em"></svg-icon>-->
                    NOVO
                </button>
            </small>
        </div>
    </main>
</template>
<script>

import Help from "@/components/configuracoes/help/help.vue";
import "sweetalert2/src/sweetalert2.scss";

export default {
    components: {
        Help
    },
    data() {
        return {          
            
        };
    },
    computed: {
        loading() {
            return this.$store.state.help.loading;
        },
        records() {
            return this.$store.state.help.records;
        }
    },
    methods: {
        async novo() {
           this.$router.push(`/configuracoes/help/novo`);
        },
    },
    created() {
        //this.loadData();
    },
};
</script>