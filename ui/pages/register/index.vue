<template>
    <form @submit.prevent.stop="signUp" class="form-signin">
        <img class="mb-4" src="../../assets/img/logo-green.svg" alt width="155" height="57" />

        <div class="form-floating">
            <input type="text" class="form-control" v-model="name" required placeholder="João da Silva" />
            <label>Nome</label>
        </div>
        <div class="form-floating">
            <input type="email" class="form-control" v-model="email" required placeholder="name@example.com" />
            <label>E-mail</label>
        </div>
        <div class="form-floating">
            <input type="password" class="form-control" v-model="password" required placeholder="Senha" />
            <label>Senha</label>
        </div>

        <button class="w-100 btn btn-lg btn-primary" v-if="!cadastrando" type="submit">Cadastrar-se</button>
        <button class="w-100 btn btn-lg btn-primary" v-else disabled>Cadastrando...</button>

        <p class="d-flex justify-content-between my-4">
            <small>
                <router-link to="/login">Já possuo cadastro</router-link>
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
import 'sweetalert2/src/sweetalert2.scss'

export default {
    data() {
        return {
            name: '',
            email: '',
            password: '',
            cadastrando: false
        }
    },
    methods: {
        async signUp() {
            try {
                this.cadastrando = true;
                let { data } = await axios.post('/api/user/sign-up', {
                    name: this.name,
                    email: this.email,
                    password: this.password
                });
                Swal.fire({
                    icon: 'success',
                    title: "Sucesso",
                    text: "Cadastro realizado com sucesso!"
                })
                this.$router.replace('/login');
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
            this.cadastrando = false;
        }
    }
}
</script>