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
      <!-- Header con información -->
      <div class="level-header">
        <div class="header-info">
          <q-btn 
            to="/categoria"
            flat 
            round 
            icon="arrow_back" 
            class="btn-back"
            title="Volver a categorías"
          />
          <div class="header-text">
            <h1 class="title">Selecciona el Nivel</h1>
            <div class="category-info">
              <div 
                class="category-badge" 
                :style="{ background: categoriaActual.color || '#667eea' }"
              >
                {{ categoriaActual.nombre }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Niveles de dificultad -->
      <div class="levels-container">
        <div 
  v-for="nivel in niveles" 
  :key="nivel.id"
  class="level-card"
  @click="seleccionarNivel(nivel)"
>
          <div class="level-header-card">
            <h3 class="level-name">{{ nivel.nombre }}</h3>
            <div class="level-badge" :class="nivel.clase">
              {{ nivel.badge }}
            </div>
          </div>
          <div class="level-details">
            <p class="level-description">{{ nivel.descripcion }}</p>
            <div class="level-info">
              <div class="info-item">
                <q-icon name="text_fields" size="16px" class="q-mr-xs" />
                <span>{{ nivel.palabras }}</span>
              </div>
              <div class="info-item">
                <q-icon name="refresh" size="16px" class="q-mr-xs" />
                <span>{{ nivel.intentos }} intentos</span>
              </div>
              <div class="info-item">
                <q-icon name="lightbulb" size="16px" class="q-mr-xs" />
                <span>{{ nivel.pistas }} pistas</span>
              </div>
            </div>
          </div>
          <div class="level-hover"></div>
        </div>
      </div>

      <!-- Instrucciones -->
      <div class="instructions">
        <q-icon name="info" size="20px" class="q-mr-sm" />
        <span>Selecciona un nivel de dificultad para comenzar a jugar</span>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar' // ¡IMPORTANTE!

const router = useRouter()
const route = useRoute()
const $q = useQuasar() // ¡IMPORTANTE!

const categoriaActual = computed(() => {
  if (route.query.nombre) {
    return {
      id: route.query.categoriaId,
      nombre: route.query.nombre,
      descripcion: route.query.descripcion,
      icono: route.query.icono || 'help',
      color: route.query.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  }
  
  const categoriaGuardada = localStorage.getItem('categoriaSeleccionada')
  if (categoriaGuardada) {
    try {
      return JSON.parse(categoriaGuardada)
    } catch (e) {
      console.error('Error al parsear categoría:', e)
    }
  }
  
  return {
    id: null,
    nombre: 'Categoría no especificada',
    descripcion: 'Selecciona una categoría primero',
    icono: 'warning',
    color: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)'
  }
})  

const niveles = ref([
  {
    id: 1,
    nombre: 'Fácil',
    badge: '🌟️',
    clase: 'facil',
    descripcion: 'Palabras de 4-6 letras',
    palabras: '4-6 letras',
    intentos: 8,
    pistas: 3
  },
  {
    id: 2,
    nombre: 'Medio',
    badge: '🔥',
    clase: 'medio',
    descripcion: 'Palabras de 7-9 letras',
    palabras: '7-9 letras',
    intentos: 6,
    pistas: 2
  },
  {
    id: 3,
    nombre: 'Difícil',
    badge: '💀',
    clase: 'dificil',
    descripcion: 'Palabras de 10+ letras',
    palabras: '10+ letras',
    intentos: 5,
    pistas: 1
  }
])

onMounted(() => {
  const usuario = localStorage.getItem('nombreUsuario')
  
  if (!usuario) {
    // Si $q aún no está disponible, usa console.log
    console.warn('Por favor inicia sesión primero')
    router.push('/login')
    return
  }
  
  if (!route.query.nombre && !localStorage.getItem('categoriaSeleccionada')) {
    console.info('No hay categoría seleccionada. Redirigiendo...')
    
    setTimeout(() => {
      router.push('/categoria')
    }, 2000)
  }
})

const seleccionarNivel = (nivelSeleccionado) => {
  console.log('🚀 Nivel seleccionado:', nivelSeleccionado)
  console.log('🎯 Categoría actual:', categoriaActual.value)
  
  // Verificar si $q está disponible antes de usarlo
  if (window.$q || $q) {
    const quasar = window.$q || $q
    quasar.notify({
      type: 'positive',
      message: `¡Nivel ${nivelSeleccionado.nombre} seleccionado!`,
      position: 'top',
      timeout: 800
    })
  } else {
    console.log(`¡Nivel ${nivelSeleccionado.nombre} seleccionado!`)
  }
  
  // Guardar nivel seleccionado en localStorage
  localStorage.setItem('nivelSeleccionado', JSON.stringify(nivelSeleccionado))
  
  console.log('💾 localStorage actualizado')
  console.log('- Nivel:', localStorage.getItem('nivelSeleccionado'))
  console.log('- Categoría:', localStorage.getItem('categoriaSeleccionada'))
  
  // Navegar directamente SIN timeout
  console.log('🔗 Navegando a /juego...')
  router.push('/juego')
}

const volverACategorias = () => {
  router.push('/categoria')
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
  max-width: 900px;
  width: 100%;
  padding: 20px;
}

/* Header del nivel */
.level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px 30px;
  margin-bottom: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.header-info {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.btn-back {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.btn-back:hover {
  background: rgba(102, 126, 234, 0.2);
}

.header-text {
  flex: 1;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 10px 0;
  text-align: center;
}

.category-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1rem;
}

.category-badge {
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-weight: 600;
  font-size: 0.9rem;
}

.category-name {
  font-weight: 600;
  color: #333;
}

/* Contenedor de niveles */
.levels-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.level-card {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.level-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.level-card:hover .level-hover {
  opacity: 1;
}

.level-header-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.level-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.level-badge {
  font-size: 1.5rem;
  padding: 8px 15px;
  border-radius: 15px;
  font-weight: 600;
}

.level-badge.facil {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.level-badge.medio {
  background: rgba(255, 152, 0, 0.1);
  color: #FF9800;
}

.level-badge.dificil {
  background: rgba(244, 67, 54, 0.1);
  color: #F44336;
}

.level-details {
  padding: 25px 30px;
}

.level-description {
  font-size: 1.1rem;
  color: #666;
  margin: 0 0 15px 0;
  font-weight: 500;
}

.level-info {
  display: flex;
  gap: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  color: #888;
  font-size: 0.9rem;
}

.level-hover {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 20px;
}

/* Instrucciones */
.instructions {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 15px 25px;
  color: #666;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 15px;
  }
  
  .level-header {
    padding: 20px;
    flex-direction: column;
    gap: 15px;
  }
  
  .header-info {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .title {
    font-size: 1.7rem;
  }
  
  .level-header-card {
    padding: 20px;
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
  
  .level-details {
    padding: 20px;
  }
  
  .level-info {
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .level-header {
    padding: 15px;
  }
  
  .title {
    font-size: 1.5rem;
  }
  
  .level-name {
    font-size: 1.3rem;
  }
  
  .level-description {
    font-size: 1rem;
  }
}
</style>