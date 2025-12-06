<template>
  <q-page class="main">

    <!-- Burbujas decorativas -->
    <div class="bubble b1"></div>
    <div class="bubble b2"></div>
    <div class="bubble b3"></div>

    <!-- Contenido principal -->
    <div class="container">
      
      <!-- Sección izquierda - Logo y Título -->
      <div class="left-section">
        <div class="logo-container">
          <h1 class="title">AHORCADO</h1>
          <div class="hangman-logo">
            <div class="rope"></div>
            <div class="head"></div>
            <div class="body"></div>
            <div class="arm left"></div>
            <div class="arm right"></div>
          </div>
        </div>
        
        <p class="tagline">
          El juego clásico de adivinar palabras.<br>
          ¡Demuestra tu vocabulario!
        </p>
      </div>

      <!-- Sección derecha - Acciones y Categorías -->
      <div class="right-section">
        
        <!-- Botón principal -->
        <div class="action-section">
          <q-btn
            to="/login"
            label="¡COMENZAR JUEGO!"
            class="play-btn"
            glossy
            icon-right="play_arrow"
            size="lg"
          />
          
          <p class="action-hint">
            Inicia sesión para guardar tu puntuación y competir
          </p>
        </div>

        <!-- Sección de categorías -->
        <div class="categories-section">
          <h3 class="section-title">Categorías Disponibles</h3>
          <p class="section-subtitle">
            Elige tu categoría favorita al iniciar el juego
          </p>
          
          <div class="categories-grid">
            <div class="category-card" v-for="category in categories" :key="category.id">
              <div class="category-icon">
                {{ category.icon }}
              </div>
              <h4 class="category-name">{{ category.name }}</h4>
              <p class="category-desc">{{ category.description }}</p>
            </div>
          </div>
        </div>

        <!-- Información del juego -->
        <div class="info-section">
          <div class="info-item">
          </div>
          <div class="info-item">
            <q-icon name="leaderboard" size="sm" />
            <span>Tabla de posiciones</span>
          </div>
          <div class="info-item">
            <q-icon name="timer" size="sm" />
            <span>Modo contrarreloj</span>
          </div>
        </div>

      </div>

    </div>

  </q-page>
</template>

<script setup>
import { ref } from 'vue'

// Categorías disponibles
const categories = ref([
  {
    id: 1,
    name: 'Animales',
    icon: '🐾',
    description: 'Fauna silvestre y doméstica'
  },
  {
    id: 2,
    name: 'Países',
    icon: '🌎',
    description: 'Naciones del mundo'
  },
  {
    id: 3,
    name: 'Tecnología',
    icon: '💻',
    description: 'Dispositivos y términos técnicos'
  },
  {
    id: 4,
    name: 'Ciencia',
    icon: '🔬',
    description: 'Términos científicos'
  },
  {
    id: 5,
    name: 'Deportes',
    icon: '⚽',
    description: 'Deportes y actividades'
  },
  {
    id: 6,
    name: 'Arte',
    icon: '🎨',
    description: 'Movimientos y técnicas artísticas'
  }
])
</script>

<style scoped>
/* Fondo principal */
.main {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: auto;
}

/* Contenedor principal con layout de dos columnas */
.container {
  display: flex;
  max-width: 1200px;
  width: 100%;
  gap: 40px;
  align-items: center;
  z-index: 10;
}

/* Sección izquierda */
.left-section {
  flex: 1;
  text-align: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-container {
  margin-bottom: 30px;
}

/* Título principal */
.title {
  font-size: 4.5rem;
  font-weight: 900;
  background: linear-gradient(45deg, #fff, #c7d2fe);
  color: transparent;
  margin-bottom: 20px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

/* Logo del ahorcado */
.hangman-logo {
  position: relative;
  width: 120px;
  height: 180px;
  margin: 0 auto;
}

.rope { 
  height: 25px; 
  width: 4px; 
  background: #8B4513; 
  margin: 0 auto;
  border-radius: 2px;
}

.head { 
  width: 50px; 
  height: 50px; 
  border: 4px solid white; 
  border-radius: 50%; 
  margin: 0 auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.body { 
  width: 4px; 
  height: 50px; 
  background: white; 
  margin: 0 auto;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.arm {
  width: 40px;
  height: 4px;
  background: white;
  position: absolute;
  top: 90px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.left { 
  left: 15px; 
  transform: rotate(-30deg); 
  transform-origin: right center;
}

.right { 
  right: 15px; 
  transform: rotate(30deg); 
  transform-origin: left center;
}

.tagline {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  line-height: 1.6;
  margin-top: 30px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Sección derecha */
.right-section {
  flex: 1.2;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* Botón principal de acción */
.action-section {
  text-align: center;
  padding: 30px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.play-btn {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
  border-radius: 50px;
  padding: 18px 50px;
  font-size: 1.3rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(106, 17, 203, 0.4);
}

.play-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(106, 17, 203, 0.6);
}

.action-hint {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-top: 15px;
  font-style: italic;
}

/* Sección de categorías */
.categories-section {
  padding: 30px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.section-title {
  color: white;
  font-size: 1.8rem;
  margin-bottom: 10px;
  font-weight: 600;
}

.section-subtitle {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 25px;
  font-size: 1rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.category-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.category-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.category-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.category-name {
  color: white;
  font-size: 1.1rem;
  margin-bottom: 5px;
  font-weight: 600;
}

.category-desc {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  line-height: 1.4;
}

/* Información del juego */
.info-section {
  display: flex;
  justify-content: space-around;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.info-item .q-icon {
  color: #c7d2fe;
}

/* Burbujas decorativas */
.bubble {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 15s infinite ease-in-out;
  pointer-events: none;
}

.b1 { 
  width: 100px; 
  height: 100px; 
  top: 10%; 
  left: 5%; 
  animation-delay: 0s;
}

.b2 { 
  width: 150px; 
  height: 150px; 
  bottom: 15%; 
  right: 8%; 
  animation-delay: 5s;
}

.b3 { 
  width: 80px; 
  height: 80px; 
  top: 60%; 
  left: 85%; 
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0) rotate(0deg); 
  }
  33% { 
    transform: translateY(-30px) rotate(120deg); 
  }
  66% { 
    transform: translateY(20px) rotate(240deg); 
  }
}

/* Responsive */
@media (max-width: 900px) {
  .container {
    flex-direction: column;
    gap: 30px;
  }
  
  .left-section,
  .right-section {
    width: 100%;
  }
  
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .title {
    font-size: 3.2rem;
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
  }
  
  .info-section {
    flex-direction: column;
    gap: 15px;
    align-items: center;
  }
  
  .play-btn {
    padding: 15px 30px;
    font-size: 1.1rem;
  }
} 
</style>