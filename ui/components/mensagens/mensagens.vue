<template>
    <slot></slot>
    <div class="my-3 p-3 bg-body rounded shadow-sm">
        <table class="table table-borderless">
            <thead>
                <tr>
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
                    <td
                        v-if="
                            transmission.nome != '' && transmission.nome != null
                        "
                    >
                        {{ transmission.nome }}
                    </td>
                    <td v-else>Sem Nome</td>
                    <!--<td>mensagem</td>-->
                    <td class="text-center">{{ dateFormat(transmission.createdAt) }}</td>
                    <td class="text-end">
                        <router-link
                            :to="`/mensagens/${transmission.id}/escolher-lista`"
                            class="text-secondary text-decoration-none"
                            v-if="['RASCUNHO'].includes(transmission.status)"
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
                            v-if="['INTERROMPIDA'].includes(transmission.status)"
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
                            v-if="['ENVIADA', 'ENVIANDO'].includes(transmission.status)"
                        >
                            <svg-icon
                                type="mdi"
                                :path="icons.magnify"
                                size="1.25em"
                            ></svg-icon>
                            Visualizar
                        </router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiMagnify, mdiPencil } from "@mdi/js";
export default {
    props: ["transmissions"],
    components: {
        SvgIcon,
    },
    data() {
        return {
            icons: {
                magnify: mdiMagnify,
                pencil: mdiPencil
            },
        };
    },
    methods: {
        dateFormat(date) {
            return (new Intl.DateTimeFormat('pt-BR', {
                timeStyle: 'short',
                dateStyle: 'short'
            })).format(new Date(date))
        }
    },
};
</script>