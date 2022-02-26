<template>
    <main class="form-signin">
        <img class="mb-4" src="../../assets/img/logo-green.svg" alt="" width="155" height="57">
        
        
        <div class="form-floating">
            <input
                type="email"
                class="form-control"
                placeholder="name@example.com"
            />
            <label>E-mail</label>
        </div>

        <button class="w-100 btn btn-lg btn-primary" type="submit">Cadastrar-se</button>
        
        <p class="d-flex justify-content-between my-4">            
            <small>
                <router-link to="/login">Já possuo cadastro</router-link>
            </small>
            <small>
                <router-link to="/forgoten">Esqueci minha senha</router-link>
            </small>
        </p>
    </main>
</template>