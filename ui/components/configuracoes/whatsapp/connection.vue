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
                {{ connection.Contact?connection.Contact.number:'' }}
            </p>
        </div>
        <div class="d-flex justify-content-md-start justify-content-center">
            <button @click="reconectar" v-if="connection.state == 'DISCONNECTED'" class="btn bg-success text-white btn-sm mx-1">
                <svg-icon
                    type="mdi"
                    :path="icons.connection"
                    size="1.25em"
                ></svg-icon>
                Reconectar
            </button>

            <button
                @click="desconectar"
                class="btn bg-info text-white btn-sm mx-1"
                v-if="connection.state=='CONNECTED'"
            >
                <svg-icon
                    type="mdi"
                    :path="icons.connection"
                    size="1.25em"
                ></svg-icon>
                Desconectar
            </button>
            <button
                @click="excluir"
                class="btn bg-danger text-white btn-sm mx-1"
            >
                <svg-icon
                    type="mdi"
                    :path="icons.trash"
                    size="1.25em"
                ></svg-icon>
                Excluir
            </button>
        </div>
    </div>
</template>
<script>
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiConnection, mdiTrashCanOutline, mdiWhatsapp } from "@mdi/js";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import QRCode from 'qrcode';
import SessionStorage from '../../../lib/session-storage';
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
                trash: mdiTrashCanOutline,
                whatsapp: mdiWhatsapp,
            },
        };
    },
    computed: {
        help() {
            console.log(this.$store.getters['help/slugs'])
            return this.$store.getters['help/slugs']['whatsapp-aparelhos-conectados-qr-code'].text||'';
        },
        phoneNumber() {
            return this.connection.wid.user.replace(
                /(\d{2})(\d{2})(\d{4,5})(\d{4})/,
                "$1 ($2) $3-$4"
            );
        },
    },
    methods: {
        async reconectar() {
            let swal = Swal.fire({                
                text: "Carregando..."
            });
            let access_token = SessionStorage.getItem('access_token');
            let events;
            if (import.meta.env.DEV) {
                events = new EventSource(`${import.meta.env.VITE_API_ENDPOINT}/whatsapp/conexao/${this.connection.id}/reconectar?access_token=${access_token}`)
            } else {
                events = new EventSource(`${location.origin}/api/whatsapp/conexao/${this.connection.id}/reconectar?access_token=${access_token}`)
            }

            events.addEventListener('message', async event => {
                const data = JSON.parse(event.data);
                let { qr } = data;
                let url = await QRCode.toDataURL(qr);
                
                swal.update({
                    imageUrl: url,
                    html: this.help
                });
            });
            events.addEventListener('authenticated', async event => {
                const data = JSON.parse(event.data);                
                swal.close();                
                this.$emit('authenticated');
            });

            await swal;
            events.close();
        },
        async excluir() {
            let { isConfirmed } = await Swal.fire({
                icon: "warning",
                title: "Excluir Conexão?",
                showCancelButton: true,
                confirmButtonText: "Sim",
                cancelButtonText: "Não",
            });
            if (!isConfirmed) {
                return;
            }
            try {
                await api.delete(`/whatsapp/conexao/${this.connection.id}`);
                this.$emit('disconnected');
            } catch (err) {
                let text = 'Não foi possível excluir o número, por favor, tente novamente mais tarde.';
                if (err.response && err.response.data) {
                    text = err.response.data.error;
                }
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text
                });
            }
        },
        async desconectar() {
            let { isConfirmed } = await Swal.fire({
                icon: "warning",
                title: "Desconectar?",
                showCancelButton: true,
                confirmButtonText: "Sim",
                cancelButtonText: "Não",
            });
            if ( !isConfirmed) {
                return;
            }

            try {
                await api.post(`/whatsapp/conexao/${this.connection.id}/desconectar`)
                this.$emit('disconnected');
            } catch (err) {
                let text = 'Não foi possível deconectar o número, por favor, tente novamente mais tarde.';
                if (err.response && err.response.data) {
                    text = err.response.data.error;
                }
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text
                });
            }
        },
    },
};
</script>

