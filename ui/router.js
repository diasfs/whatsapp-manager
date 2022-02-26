import { createRouter, createWebHashHistory } from 'vue-router';
import routes from 'voie-pages';

const router = createRouter({
    history: createWebHashHistory(),
    routes
});


export default router;