<template>
    <form @submit.prevent.stop="signIn" class="form-signin">
        <img class="mb-4" src="../../assets/img/logo-green.svg" alt width="155" height="57" />

        <div class="form-floating">
            <input type="email" class="form-control" v-model="email" placeholder="name@example.com" />
            <label>E-mail</label>
        </div>
        <div class="form-floating">
            <input v-model="password" type="password" class="form-control" placeholder="Senha" />
            <label>Senha</label>
        </div>

        <button v-if="!entrando" class="w-100 btn btn-lg btn-primary" type="submit">Entrar</button>
        <button v-else class="w-100 btn btn-lg btn-primary" disabled>Entrando...</button>

        <p class="d-flex justify-content-between my-4">
            <small>
                <router-link to="/register">Não possuo cadastro</router-link>
            </small>
            <small>
                <router-link to="/forgoten">Esqueci minha senha</router-link>
            </small>
        </p>
    </form>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import SessionStorage from '../../lib/session-storage'

import 'sweetalert2/src/sweetalert2.scss'

export default {
    data() {
        return {
            email: '',
            password: '',
            entrando: false
        }
    },
    methods: {
        async signIn() {
            try {
                this.entrando = true;
                let { data : { access_token } } = await axios.post('/api/user/sign-in', {
                    email: this.email,
                    password: this.password
                });

                SessionStorage.setItem('access_token', access_token);

                this.$router.replace('/');
            } catch (err) {
                let text = err.message;
                if (err.response && err.response.data) {
                    text = err.response.data.error;
                }
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text
                })
            }
            this.entrando = false;
        }
    }
}
</script>