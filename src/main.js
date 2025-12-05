import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './routes/route.js'

// Importa Quasar y sus plugins
import { Quasar, Notify } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

// Opcional: importa el idioma español
import quasarLang from 'quasar/lang/es'

const app = createApp(App)

// Configura Quasar con los plugins necesarios
app.use(Quasar, {
  plugins: {
    Notify // ¡IMPORTANTE! Esto habilita $q.notify
  },
  lang: quasarLang, // Opcional: idioma español
  config: {
    notify: { /* opciones globales para notify */ }
  }
})

app.use(router)
app.mount('#app') 