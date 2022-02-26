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
<style>
    html,
    body {
        height: 100%;
    }

    body {
        display: flex;
        align-items: center;
        padding-top: 40px;
        padding-bottom: 40px;
        background-color: #f5f5f5;
    }
    #app {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
</style>
<style scoped>

.btn-primary {
    color: white;
}



.form-signin {
    width: 100%;
    max-width: 330px;
    padding: 15px;
    margin: auto;
}

.form-signin .checkbox {
    font-weight: 400;
}

.form-signin .form-floating:focus-within {
    z-index: 2;
}

.form-signin input[type="email"] {
    
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    margin-bottom: 10px;
}

</style>