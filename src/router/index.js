import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from '../views/Home.vue';
import DocumentPage from '../views/Document.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage,
    },
    {
        path: '/document/:id',
        name: 'Document',
        component: DocumentPage,
        props: true,
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
