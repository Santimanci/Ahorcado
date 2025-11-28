import Categoria from '../views/Categoria.vue';
import Intro from '../views/Intro.vue';
import Juego from '../views/Juego.vue';
import Nivel from '../views/Nivel.vue';
import Puntaje from '../views/Puntaje.vue';
import Login from '../views/Login.vue'; 
import {createRouter, createWebHistory} from 'vue-router';

const routes = [
     
    {path:"/", component:Intro},
    {path:"/login", component:Login},
    {path:"/categoria", component:Categoria},
    {path:"/nivel", component:Nivel},
    {path:"/juego", component:Juego},
    {path:"/puntaje", component:Puntaje},
   
    

]

export const router = createRouter({
    history: createWebHistory(),
    routes,
});