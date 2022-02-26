<template>
    <slot></slot>
</template>
<style lang="less">
html,
body {
    height: 100%;
}

body[data-page=register],
body[data-page=login],
body[data-page=forgoten] {
    display: flex;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #f5f5f5;
    #app {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;

        .btn-primary {
            color: white;
        }

        .form-signin {
            width: 100%;
            max-width: 330px;
            padding: 15px;
            margin: auto;
            
            .checkbox {
                font-weight: 400;
            }

            .form-floating:focus-within {
                z-index: 2;
            }
        }

    }
}

body[data-page=login] {
    .form-signin {
        input[type="email"] {
            margin-bottom: -1px;
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
        }
    
        input[type="password"] {
            margin-bottom: 10px;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }

    }
}

body[data-page=forgoten] {
    .form-signin {
        input[type="email"] {                        
            margin-bottom: 10px;
        }
    }
}

body[data-page=register] {
    .form-signin {
        input[type="text"] {
            margin-bottom: -1px;
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
        }

        input[type="email"] {
            margin-bottom: -1px;
            border-radius: 0;
        }

        input[type="password"] {
            margin-bottom: 10px;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }
    }
}
</style>