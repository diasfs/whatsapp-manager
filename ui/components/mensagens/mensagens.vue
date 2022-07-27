<template>
    <slot></slot>
    <div class="my-3 p-3 bg-body rounded shadow-sm">
        <div class="row">
            <div class="col-12 mb-3" v-if="selected.length > 0">
                <button
                    class="
                        btn btn-danger
                        d-flex
                        justify-center
                        align-items-center
                    "
                    v-if="excluindo"
                    disabled
                >
                    <svg-icon
                        type="mdi"
                        :path="icons.trash"
                        class="me-2"
                        size="1em"
                    ></svg-icon>
                    Excluindo...
                </button>
                <button
                    class="
                        btn btn-danger
                        d-flex
                        justify-center
                        align-items-center
                    "
                    v-else
                    @click.prevent.stop="excluir"
                >
                    <svg-icon
                        type="mdi"
                        :path="icons.trash"
                        class="me-2"
                        size="1em"
                    ></svg-icon>
                    Excluir
                </button>
            </div>
        </div>
        <div class="table-responsive">
            <table class="table table-borderless">
                <thead>
                    <tr>
                        <th width="50px">
                            <label style="font-size: 1rem">
                                <input
                                    type="checkbox"
                                    class="form-check-input mx-1"
                                    @click="selectAll"
                                />
                            </label>
                        </th>
                        <th>Nome</th>
                        <!--<th>Mensagem</th>-->
                        <th width="100px" class="text-center">Data</th>
                        <th width="130px"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="transmission in transmissions"
                        :key="transmission.id"
                    >
                        <td>
                            <input
                                type="checkbox"
                                class="form-check-input mx-1"
                                :value="transmission.id"
                                :checked="selected.includes(transmission.id)"
                                v-model="selected"
                            />
                        </td>
                        <td
                            v-if="
                                transmission.nome != '' &&
                                transmission.nome != null
                            "
                        >
                            {{ transmission.nome }}
                        </td>
                        <td v-else>Sem Nome</td>
                        <!--<td>mensagem</td>-->
                        <td class="text-center">
                            {{ dateFormat(transmission.createdAt) }}
                        </td>
                        <td class="text-end">
                            <div style="width: 130px">
                                <router-link
                                    :to="`/mensagens/${transmission.id}/escolher-lista`"
                                    class="text-secondary text-decoration-none"
                                    v-if="
                                        ['RASCUNHO'].includes(
                                            transmission.status
                                        )
                                    "
                                >
                                    <svg-icon
                                        type="mdi"
                                        :path="icons.pencil"
                                        size="1.25em"
                                    ></svg-icon>
                                    Retomar
                                </router-link>
                                <router-link
                                    :to="`/mensagens/${transmission.id}/status`"
                                    class="text-secondary text-decoration-none"
                                    v-if="
                                        ['INTERROMPIDA'].includes(
                                            transmission.status
                                        )
                                    "
                                >
                                    <svg-icon
                                        type="mdi"
                                        :path="icons.pencil"
                                        size="1.25em"
                                    ></svg-icon>
                                    Retomar
                                </router-link>
                                <router-link
                                    :to="`/mensagens/${transmission.id}/status`"
                                    class="text-secondary text-decoration-none"
                                    v-if="
                                        ['ENVIADA', 'ENVIANDO'].includes(
                                            transmission.status
                                        )
                                    "
                                >
                                    <svg-icon
                                        type="mdi"
                                        :path="icons.magnify"
                                        size="1.25em"
                                    ></svg-icon>
                                    Visualizar
                                </router-link>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiMagnify, mdiPencil, mdiTrashCan } from "@mdi/js";

import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import api from '@/lib/api';

export default {
    props: ["transmissions"],
    components: {
        SvgIcon,
    },
    data() {
        return {
            icons: {
                magnify: mdiMagnify,
                pencil: mdiPencil,
                trash: mdiTrashCan,
            },
            selected: [],
            excluindo: false,
        };
    },
    methods: {
        async excluir() {
            try {
                if (this.selected.length == 0) {
                    return;
                }
                let { isConfirmed } = await Swal.fire({
                    icon: "warning",
                    text: "Deseja remover as mensagens selecionadas?",
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Sim",
                    cancelButtonText: "Não",
                });
                if (!isConfirmed) {
                    return;
                }

                let ids = this.selected;
                this.excluindo = true;
                await api.delete('/transmission', {
                    data: {
                        ids
                    }
                });
                this.selected = []
            } catch (err) {
                console.error(err);
                let text = err.message || "Não foi possível excluir a mensagem"
                Swal.fire({
                    icon: "error",
                    title: "Oops",
                    text
                });
            }
            this.excluindo = false;
            this.$emit('deleted')
        },
        selectAll(evt) {
            if (evt.target.checked) {
                return (this.selected = this.transmissions.map(({ id }) => id));
            }
            this.selected = [];
        },
        dateFormat(date) {
            return new Intl.DateTimeFormat("pt-BR", {
                timeStyle: "short",
                dateStyle: "short",
            }).format(new Date(date));
        },
    },
};
</script>