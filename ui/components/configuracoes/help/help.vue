<template>
    <div class="text-muted py-1 border-bottom">
        <div class="d-flex justify-content-between align-items-center">
            <p class="py-3 mb-0 small lh-sm">
                <strong class="d-block text-gray-dark">{{ help.name }}</strong>
                <small>{{ help.slug }}</small>
            </p>
            <div class="d-flex justify-content-md-start justify-content-center">
                <button
                    class="btn bg-secondary text-white btn-sm mx-1"
                    @click="editar"
                >
                    <!--
                                <svg-icon
                                    type="mdi"
                                    :path="icons.trash"
                                    size="1.25em"
                                ></svg-icon>-->
                    Editar
                </button>
                <button
                    class="btn bg-danger text-white btn-sm mx-1"
                    @click="excluir"
                >
                    <!--
                                <svg-icon
                                    type="mdi"
                                    :path="icons.trash"
                                    size="1.25em"
                                ></svg-icon>-->
                    Excluir
                </button>
            </div>
        </div>
    </div>
</template>
<script>
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

export default {
    props: ["help"],
    methods: {
        async excluir() {
            try {
                let { isConfirmed } = await Swal.fire({
                    icon: "warning",
                    text: "Excluir o registro?",
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Sim",
                    cancelButtonText: "Não"
                });
                if (!isConfirmed) {
                    return;
                }
                await this.$store.dispatch('help/remove', { id: this.help.id });
                this.$emit("updated");
            } catch (err) {
                let text = err.message || "Não foi possível excluir o registro";
                if (
                    err.response &&
                    err.response.data &&
                    err.response.data.error
                ) {
                    text = err.response.data.error;
                }
                Swal.fire("Oops", text, "error");
            }
        },
        async editar() {
           this.$router.push(`/configuracoes/help/${this.help.id}`);
        },
    },
};
</script>