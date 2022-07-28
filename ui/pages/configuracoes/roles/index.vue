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
                <small>Roles</small>
            </div>
        </div>

        <div class="my-3 p-3 bg-body rounded shadow-sm">
            <h6 class="border-bottom pb-2 mb-0">Tipos de Usuários</h6>

            <div v-if="loading">Carregando...</div>
            <div v-else-if="roles.length == 0">
                <p>Nenhum registro encontrado.</p>
            </div>
            <div v-else>
                <Role v-for="role in roles" :role="role" :key="role.id" @updated="loadData"></Role>
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
import Role from "@/components/configuracoes/roles/role.vue";

import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import api from "../../../lib/api";

export default {
    components: {
        Role,
    },
    data() {
        return {
            loading: false,
            saving: false,
            deleting: false,
            roles: [],
        };
    },
    methods: {
        async novo() {
            try {
                let { value: name } = await Swal.fire({
                    title: "Novo",
                    input: 'text',
                    inputLabel: "Nome",
                    showCancelButton: true,
                    cancelButtonText: "Cancelar",
                    showConfirmButton: true,
                    confirmButtonText: "Salvar",
                    inputValidator: (value) => {
                        if (!value) {
                            return "Informe um nome."
                        }
                    }
                });
                if (!name) {
                    return;
                }
                await api.post('/config/roles', {
                    name
                });
                await this.loadData();
            } catch (err) {
                let text = err.message || "Não foi possível salvar o registro";
                if (err.response && err.response.data && err.response.data.error) {
                    text = err.response.data.error;
                }
                Swal.fire("Oops", text, "error");
            }
        },
        async loadData() {
            try {
                if (this.loading) {
                    return;
                }
                this.loading = true;

                let { data: roles } = await api.get("/config/roles");
                this.roles = roles;
            } catch (err) {
                let text = err.message || "Não foi possível carregar os registros";
                if (err.response && err.response.data && err.response.data.error) {
                    text = err.response.data.error;
                }
                Swal.fire("Oops", text, "error");
            }
            this.loading = false;
        },
    },
    created() {
        this.loadData();
    },
};
</script>