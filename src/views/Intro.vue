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
      <!-- Logo/Título animado -->
      <div class="title-container">
        <h1 class="titulo animated-title">AHORCADO</h1>
        <div class="hangman-icon">
          <div class="rope"></div>
          <div class="head"></div>
          <div class="body"></div>
          <div class="left-arm"></div>
          <div class="right-arm"></div>
        </div>
      </div>

      <p class="subtitulo animated-subtitle">¡Adivina la palabra antes de que sea tarde!</p>

      <!-- Botón de jugar mejorado -->
      <q-btn 
        to="/login"
        label="¡JUGAR AHORA!"
        class="btn-jugar q-mt-xl animated-button"
      >
        <template v-slot:loading>
          <q-spinner-hourglass class="on-left" />
          Cargando...
        </template>
      </q-btn>

      <!-- Efectos de partículas al hacer hover -->
      <div class="particles"></div>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()

// Animación de entrada
onMounted(() => {
  console.log('Componente montado - Ahorcado')
})
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

/* Fondo animado */
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

/* Contenedor de contenido */
.content-wrapper {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 600px;
  width: 100%;
  padding: 8 px;
}

/* Título principal */
.title-container {
  position: relative;
  margin-bottom: 2rem;
}

.titulo {
  font-size: 5rem;
  font-weight: 800;
  color: #fff;
  text-shadow: 
    0 0 10px rgba(104, 70, 241, 0.8),
    0 0 20px rgba(104, 70, 241, 0.6),
    0 0 30px rgba(104, 70, 241, 0.4);
  margin-bottom: 1rem;
  letter-spacing: 3px;
  background: linear-gradient(45deg, #fff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.animated-title {
  animation: titleGlow 3s ease-in-out infinite alternate;
}

@keyframes titleGlow {
  from {
    text-shadow: 
      0 0 10px rgba(104, 70, 241, 0.8),
      0 0 20px rgba(104, 70, 241, 0.6);
  }
  to {
    text-shadow: 
      0 0 15px rgba(104, 70, 241, 1),
      0 0 25px rgba(104, 70, 241, 0.8),
      0 0 35px rgba(104, 70, 241, 0.6);
  }
}

/* Icono del ahorcado */
.hangman-icon {
  position: relative;
  width: 100px;
  height: 150px;
  margin: 0 auto;
}

.rope {
  position: absolute;
  top: 0;
  left: 50%;
  width: 4px;
  height: 20px;
  background: #8B4513;
  transform: translateX(-50%);
}

.head {
  position: absolute;
  top: 20px;
  left: 50%;
  width: 40px;
  height: 40px;
  border: 4px solid #fff;
  border-radius: 50%;
  transform: translateX(-50%);
}

.body {
  position: absolute;
  top: 60px;
  left: 50%;
  width: 4px;
  height: 40px;
  background: #fff;
  transform: translateX(-50%);
}

.left-arm, .right-arm {
  position: absolute;
  top: 70px;
  width: 30px;
  height: 4px;
  background: #fff;
}

.left-arm {
  left: calc(50% - 30px);
  transform: rotate(-45deg);
}

.right-arm {
  left: calc(50% + 2px);
  transform: rotate(45deg);
}

/* Subtítulo */
.subtitulo {
  font-size: 1.5rem;
  color: #e0e7ff;
  margin-bottom: 2rem;
  font-weight: 400;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.animated-subtitle {
  animation: fadeInUp 1s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Botón de jugar */
.btn-jugar {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  padding: 18px 40px;
  border-radius: 50px;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 
    0 10px 20px rgba(37, 117, 252, 0.3),
    0 6px 6px rgba(37, 117, 252, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border: none;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.btn-jugar:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 15px 25px rgba(37, 117, 252, 0.4),
    0 10px 10px rgba(37, 117, 252, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  background: linear-gradient(135deg, #7a1bdb 0%, #3585ff 100%);
}

.btn-jugar:active {
  transform: translateY(-1px);
  box-shadow: 
    0 5px 15px rgba(37, 117, 252, 0.4),
    0 3px 3px rgba(37, 117, 252, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.animated-button {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 
      0 10px 20px rgba(37, 117, 252, 0.3),
      0 6px 6px rgba(37, 117, 252, 0.2);
  }
  50% {
    box-shadow: 
      0 10px 25px rgba(37, 117, 252, 0.5),
      0 8px 10px rgba(37, 117, 252, 0.3);
  }
  100% {
    box-shadow: 
      0 10px 20px rgba(37, 117, 252, 0.3),
      0 6px 6px rgba(37, 117, 252, 0.2);
  }
}

/* Partículas */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

/* Responsive */
@media (max-width: 768px) {
  .titulo {
    font-size: 3.5rem;
  }
  
  .subtitulo {
    font-size: 1.2rem;
  }
  
  .content-wrapper {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .titulo {
    font-size: 2.8rem;
  }
  
  .btn-jugar {
    padding: 15px 30px;
    font-size: 1.1rem;
  }
}

/* Asegurar que ocupe toda la pantalla en todos los navegadores */
html, body, #q-app {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>