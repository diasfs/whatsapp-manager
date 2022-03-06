import { createRouter, createWebHashHistory } from 'vue-router';
import routes from 'voie-pages';
import SessionStorage from './lib/session-storage';

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach(async (to, from) => {
    const access_token = SessionStorage.getItem('access_token');
    if (!access_token && !['login', 'forgoten', 'register'].includes(to.name)) {        
        return {
            name: 'login'
        }
    } else if (access_token && ['login', 'forgoten', 'register'].includes(to.name)) {
        return {
            name: 'crm'
        }
    }
    document.body.setAttribute('data-page', to.name);
});

export default router;