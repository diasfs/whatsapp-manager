<template>
    <div class="text-muted py-3 border-bottom">
        <div class="d-flex mb-2">
            <img
                :src="Connection.Contact.profilePictureUrl"
                width="48"
                height="48"
                class="me-3 rounded-circle"
                v-if="
                    Connection.Contact && Connection.Contact.profilePictureUrl
                "
            />
            <p class="pb-3 mb-0 small lh-sm">
                <strong class="d-block text-gray-dark">{{
                    Connection.pushname
                }}</strong>
                <svg-icon
                    type="mdi"
                    :path="icons.whatsapp"
                    size="1.25em"
                ></svg-icon>
                {{ Connection.Contact.number }}
            </p>
        </div>
        <div class="d-flex justify-content-md-start justify-content-center">
            <button
                disabled
                @click="reconectar"
                v-if="Connection.state == 'DISCONNECTED'"
                class="btn bg-warning text-white btn-sm mx-1"
            >
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
                v-if="Connection.state == 'CONNECTED' && !Connection.importing"
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
                v-if="Connection.importing"
            >
                <svg-icon
                    type="mdi"
                    :path="icons.import"
                    size="1.25em"
                ></svg-icon>
                Importando ({{ Connection.import_percentual }}%)
            </button>
        </div>
    </div>
</template>
<script>
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiConnection, mdiWhatsapp, mdiDatabaseImportOutline } from "@mdi/js";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import api from "../../../lib/api";

export default {
    props: ["connection"],
    components: {
        SvgIcon,
    },
    data() {
        return {
            Connection: this.connection,
            icons: {
                connection: mdiConnection,
                import: mdiDatabaseImportOutline,
                whatsapp: mdiWhatsapp,
            },
        };
    },
    computed: {
        phoneNumber() {
            return this.Connection.wid.user.replace(
                /(\d{2})(\d{2})(\d{4,5})(\d{4})/,
                "$1 ($2) $3-$4"
            );
        },
    },
    mounted() {
        this.reloadTimer = setTimeout(() => {
            this.reloadConnection();
        }, 2000);
    },
    umounted() {
        if (this.reloadTimer) {
            clearTimeout(this.reloadTimer);
        }
    },
    methods: {
        async importar() {
            try {                
                this.Connection.importing = true;
                await api.post(
                    `/whatsapp/conexao/${this.Connection.id}/importar-contatos`
                );
                Swal.fire({
                    title: "Importado!",
                    icon: "success",
                    text: "Os contatos do seu WhatsApp foram importados.",
                });
            } catch (err) {
                console.log(err);
            }
        },
        async reloadConnection() {
            try {
                
                let { data: connection } = await api.get(
                    `/whatsapp/conexao/${this.connection.id}`
                );
                this.Connection = connection;
                this.reloadTimer = setTimeout(() => {
                    this.reloadConnection();
                }, 5000);
            } catch (err) {
                console.log(err);
            }
        },
        watch: {
            connection: {
                immediate: true,
                handler(newValue) {
                    this.Connection = newValue;
                },
                deep: true,
            },
        }
    },
};
</script>

