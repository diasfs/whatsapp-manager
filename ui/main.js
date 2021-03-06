import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import store from './store';

import 'bootstrap';
import './assets/scss/main.scss'
import './assets/scss/style.less'

const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app')

