<template>
  <q-page class="flex flex-center column q-pa-xl main-container">
    <!-- Fondo animado -->
    <div class="background-animation">
      <div class="bubble bubble-1"></div>
      <div class="bubble bubble-2"></div>
      <div class="bubble bubble-3"></div>
      <div class="bubble bubble-4"></div>
    </div>

    <!-- Contenido principal -->
    <div class="content-wrapper">
      <div class="login-card">
        <h2 class="login-title">Iniciar Sesión</h2>
        <p class="login-subtitle">Ingresa tu nombre para comenzar a jugar</p>
        
        <q-form @submit="iniciarSesion" class="q-gutter-y-md">
          <q-input
            v-model="nombreUsuario"
            label="Tu nombre"
            outlined
            bg-color="white"
            color="primary"
            :rules="[val => !!val || 'Por favor ingresa tu nombre']"
            class="input-nombre"
            @keyup.enter="iniciarSesion"
            autofocus
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-btn
          to ="/categoria"
            type="submit"
            label="Comenzar a Jugar"
            class="btn-login"
            :loading="loading"
            :disable="!nombreUsuario.trim()"
          >
    
            <template v-slot:loading>
              <q-spinner-hourglass class="on-left" />
              Iniciando...
            </template>
          </q-btn>
          <q-btn
          to ="/"
            type="submit"
            label="Volver"
            class="btn-login"
          ></q-btn>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()
const nombreUsuario = ref('')
const loading = ref(false)

const iniciarSesion = async () => {
  // Si ya está cargando, no hacer nada
  if (loading.value) return
  
  // Validar que el nombre no esté vacío
  if (!nombreUsuario.value.trim()) {
    $q.notify({
      type: 'warning',
      message: 'Por favor ingresa tu nombre',
      position: 'top'
    })
    return
  }

  loading.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const nombreLimpio = nombreUsuario.value.trim()
    localStorage.setItem('nombreUsuario', nombreLimpio)
    
    $q.notify({
      type: 'positive',
      message: `¡Bienvenido ${nombreLimpio}!`,
      position: 'top',
      timeout: 2000
    })
    
    setTimeout(() => {
      router.push('/categorias')
    }, 500)
    
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al iniciar sesión',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.main-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 15s infinite ease-in-out;
}

.bubble-1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.bubble-2 {
  width: 120px;
  height: 120px;
  top: 60%;
  left: 80%;
  animation-delay: -5s;
}

.bubble-3 {
  width: 60px;
  height: 60px;
  top: 80%;
  left: 20%;
  animation-delay: -10s;
}

.bubble-4 {
  width: 100px;
  height: 100px;
  top: 30%;
  left: 70%;
  animation-delay: -7s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  33% { transform: translateY(-30px) rotate(120deg); }
  66% { transform: translateY(20px) rotate(240deg); }
}

.content-wrapper {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 500px;
  width: 100%;
  padding: 20px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px 30px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.login-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 30px;
}

.input-nombre {
  margin-bottom: 20px;
}

.btn-login {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
  width: 100%;
  box-shadow: 0 10px 20px rgba(37, 117, 252, 0.3);
  transition: all 0.3s ease;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 15px 25px rgba(37, 117, 252, 0.4);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .login-card {
    padding: 30px 20px;
  }
  
  .login-title {
    font-size: 2rem;
  }
}
</style>