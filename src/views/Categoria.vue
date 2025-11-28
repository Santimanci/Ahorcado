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
      <!-- Header con información del usuario -->
      <div class="user-header">
        <div class="user-info">
          <q-avatar size="60px" class="user-avatar">
            <q-icon name="person" size="30px" />
          </q-avatar>
          <div class="user-details">
            <h2 class="welcome-text">¡Hola, {{ nombreUsuario }}!</h2>
            <p class="subtitle">Selecciona una categoría para comenzar</p>
          </div>
        </div>
        <q-btn 
          flat 
          round   
          icon="logout" 
          class="btn-logout"
          @click="cerrarSesion"
          title="Cerrar sesión"
          to = "/login"
        />
      </div>

      <!-- Grid de categorías -->
      <div class="categories-grid">
        <div 
          v-for="categoria in categorias" 
          :key="categoria.id"
          class="category-card"
          @click="seleccionarCategoria(categoria)"
          :style="{ background: categoria.color }"
        >
          <div class="category-icon">
          
            <q-icon @click = ""  :name="categoria.icono" size="40px"  />
          </div>
          <q-btn  to="/nivel">
          <h3 class="category-name">{{ categoria.nombre }}</h3>
          <p class="category-desc">{{ categoria.descripcion }}</p>
          <div class="category-hover"></div>
       </q-btn> 
        
        </div> 
      </div>
      

      <!-- Instrucciones -->
      <div class="instructions">
        <q-icon name="info" size="20px" class="q-mr-sm" />
        <span>Haz clic en cualquier categoría para comenzar a jugar</span>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()
const nombreUsuario = ref('')

// Lista de categorías
const categorias = ref([
  {
    id: 1,
    nombre: 'Frutas',
    descripcion: 'Adivina nombres de frutas',
    icono: 'apple',
    color: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)'
  },
  {
    id: 2,
    nombre: 'Animales',
    descripcion: 'Descubre animales del mundo',
    icono: 'pets',
    color: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)'
  },
  {
    id: 3,
    nombre: 'Países',
    descripcion: 'Nombres de países del mundo',
    icono: 'public',
    color: 'linear-gradient(135deg, #45B7D1 0%, #96C93D 100%)'
  },
  {
    id: 4,
    nombre: 'Deportes',
    descripcion: 'Deportes y actividades',
    icono: 'sports_soccer',
    color: 'linear-gradient(135deg, #FAD961 0%, #F76B1C 100%)'
  },
  {
    id: 5,
    nombre: 'Películas',
    descripcion: 'Títulos de películas famosas',
    icono: 'movie',
    color: 'linear-gradient(135deg, #A8FF78 0%, #78FFD6 100%)'
  },
  {
    id: 6,
    nombre: 'Ciencia',
    descripcion: 'Términos científicos',
    icono: 'science',
    color: 'linear-gradient(135deg, #9D50BB 0%, #6E48AA 100%)'
  }
])

onMounted(() => {
  // Obtener el nombre del usuario desde localStorage
  const usuario = localStorage.getItem('nombreUsuario')
  
  if (!usuario) {
    // Si no hay usuario, redirigir al login
    $q.notify({
      type: 'warning',
      message: 'Por favor inicia sesión primero',
      position: 'top'
    })
    router.push('/login')
    return
  }
  
  nombreUsuario.value = usuario
})  

const seleccionarCategoria = (categoria) => {
  $q.notify({
    type: 'positive',
    message: `¡Categoría ${categoria.nombre} seleccionada!`,
    position: 'top',
    timeout: 1000
  })
  
  console.log('Categoría seleccionada:', categoria)
  
}

const cerrarSesion = () => {
  $q.dialog({
    title: 'Cerrar sesión',
    message: '¿Estás seguro de que quieres cerrar sesión?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    localStorage.removeItem('nombreUsuario')
    $q.notify({
      type: 'info',
      message: 'Sesión cerrada correctamente',
      position: 'top'
    })
    router.push('/login')
  })
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
  max-width: 1200px;
  width: 100%;
  padding: 20px;
}

/* Header del usuario */
.user-header {
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

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.welcome-text {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1rem;
  color: #666;
  margin: 5px 0 0 0;
}

.btn-logout {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
}

.btn-logout:hover {
  background: rgba(255, 107, 107, 0.2);
}

/* Grid de categorías */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.category-card {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 30px 25px;
  text-align: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.category-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.category-card:hover .category-hover {
  opacity: 1;
}

.category-icon {
  margin-bottom: 15px;
  opacity: 0.9;
}

.category-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.category-desc {
  font-size: 0.9rem;
  opacity: 0.9;
  margin: 0;
  line-height: 1.4;
}

.category-hover {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
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
  
  .user-header {
    padding: 20px;
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .user-info {
    flex-direction: column;
    gap: 15px;
  }
  
  .welcome-text {
    font-size: 1.5rem;
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .category-card {
    padding: 25px 20px;
  }
}

@media (max-width: 480px) {
  .user-header {
    padding: 15px;
  }
  
  .welcome-text {
    font-size: 1.3rem;
  }
  
  .category-name {
    font-size: 1.3rem;
  }
}
</style>