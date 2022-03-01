<template>
    <div class="text-muted py-3 border-bottom">
        <div class="d-flex mb-2">
            <img
                :src="connection.Contact.profilePictureUrl"
                width="48"
                height="48"
                class="me-3 rounded-circle"
                v-if="
                    connection.Contact && connection.Contact.profilePictureUrl
                "
            />
            <p class="pb-3 mb-0 small lh-sm">
                <strong class="d-block text-gray-dark">{{
                    connection.pushname
                }}</strong>
                <svg-icon
                    type="mdi"
                    :path="icons.whatsapp"
                    size="1.25em"
                ></svg-icon>
                {{ phoneNumber }}
            </p>
        </div>
        <div class="d-flex justify-content-md-start justify-content-center">
            <button disabled @click="reconectar" v-if="connection.state == 'DISCONNECTED'" class="btn bg-warning text-white btn-sm mx-1">
                <svg-icon
                    type="mdi"
                    :path="icons.connection"
                    size="1.25em"
                ></svg-icon>
                Não Conectado
            </button>

            <button
                @click="importar"
                class="btn bg-primary text-white btn-sm mx-1"
                v-if="connection.state=='CONNECTED' && !connection.importing"
            >
                <svg-icon
                    type="mdi"
                    :path="icons.import"
                    size="1.25em"
                ></svg-icon>
                Importar
            </button>
            <button
                disabled
                class="btn bg-primary text-white btn-sm mx-1"
                v-if="connection.importing"
            >
                <svg-icon
                    type="mdi"
                    :path="icons.import"
                    size="1.25em"
                ></svg-icon>
                Importando...
            </button>
        </div>
    </div>
</template>
<script>
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiConnection, mdiWhatsapp, mdiDatabaseImportOutline } from "@mdi/js";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import api from '../../../lib/api';



export default {
    props: ["connection"],
    components: {
        SvgIcon,
    },
    data() {
        return {
            icons: {
                connection: mdiConnection,
                import: mdiDatabaseImportOutline,
                whatsapp: mdiWhatsapp,
            },
        };
    },
    computed: {
        phoneNumber() {
            return this.connection.wid.user.replace(
                /(\d{2})(\d{2})(\d{4,5})(\d{4})/,
                "$1 ($2) $3-$4"
            );
        },
    },
    methods: {
       async importar() {
           try {
               let contacts = await api.post(`/whatsapp/conexao/${this.connection.id}/importar-contatos`);
               console.log(contacts);
           } catch (err) {
               console.log(err);
           }
       }
    },
};
</script>

