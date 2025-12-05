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
        
        <!-- ✅ FORM CORREGIDO -->
        <q-form @submit.prevent="iniciarSesion" class="q-gutter-y-md">
          <q-input
            v-model="nombreUsuario"
            label="Tu nombre"
            outlined
            bg-color="white"
            color="primary"
            :rules="[val => !!val || 'Por favor ingresa tu nombre']"
            class="input-nombre"
            autofocus
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <!-- ✅ BOTÓN CORREGIDO -->
          <q-btn
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

          <!-- ✅ BOTÓN VOLVER -->
          <q-btn
            to="/"
            flat
            label="Volver"
            class="q-mt-sm"
          />
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
  if (loading.value) return

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
      timeout: 1500
    })

    // ✅ NAVEGACIÓN CORRECTA
    setTimeout(() => {
      router.push('/categoria')
    }, 400)

  } catch (error) {
    console.error(error)
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
  inset: 0;
  z-index: 0;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 15s infinite ease-in-out;
}

.bubble-1 { width: 80px; height: 80px; top: 10%; left: 10%; }
.bubble-2 { width: 120px; height: 120px; top: 60%; left: 80%; animation-delay: -5s; }
.bubble-3 { width: 60px; height: 60px; top: 80%; left: 20%; animation-delay: -10s; }
.bubble-4 { width: 100px; height: 100px; top: 30%; left: 70%; animation-delay: -7s; }

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
}

.login-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.login-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 30px;
}

.btn-login {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  width: 100%;
  margin-top: 10px;
}
</style>
