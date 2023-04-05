import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHeading, faBold, faItalic, faQuoteRight, faLink, faListUl, faListOl, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import './index.css'


const app = createApp(App)
app.use(router).mount('#app')

library.add(faHeading, faBold, faItalic, faQuoteRight, faLink, faListUl, faListOl, faCheckSquare);

app.component('font-awesome-icon', FontAwesomeIcon);
