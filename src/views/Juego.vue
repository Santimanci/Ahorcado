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
      <!-- Header del juego -->
      <div class="game-header">
        <div class="header-left">
          <q-btn 
            to="/nivel"
            flat 
            round 
            icon="arrow_back" 
            class="btn-back"
            title="Volver a niveles"
          />
          <div class="game-info">
            <h1 class="game-title">Ahorcado</h1>
            <div class="game-subtitle">
              <span class="category-badge" :style="{ background: categoria.color }">
                {{ categoria.nombre }}
              </span>
              <span class="level-badge" :class="nivel.clase">
                {{ nivel.nombre }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="header-right">
          <div class="stats">
            <div class="stat-item">
              <q-icon name="refresh" size="20px" />
              <span class="stat-value">{{ intentosRestantes }}/{{ nivel.intentos }}</span>
              <span class="stat-label">Intentos</span>
            </div>
            <div class="stat-item">
              <q-icon name="help" size="20px" />
              <span class="stat-value">{{ pistasRestantes }}</span>
              <span class="stat-label">Pistas</span>
            </div>
            <div class="stat-item">
              <q-icon name="score" size="20px" />
              <span class="stat-value">{{ puntuacion }}</span>
              <span class="stat-label">Puntos</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Área de juego -->
      <div class="game-area">
        <!-- Ahorcado visual -->
        <div class="hangman-container">
          <div class="hangman-figure">
            <!-- Base -->
            <div class="hangman-base"></div>
            <!-- Poste -->
            <div class="hangman-pole"></div>
            <!-- Cabeza -->
            <div class="hangman-head" v-if="errores >= 1"></div>
            <!-- Cuerpo -->
            <div class="hangman-body" v-if="errores >= 2"></div>
            <!-- Brazo izquierdo -->
            <div class="hangman-arm hangman-arm-left" v-if="errores >= 3"></div>
            <!-- Brazo derecho -->
            <div class="hangman-arm hangman-arm-right" v-if="errores >= 4"></div>
            <!-- Pierna izquierda -->
            <div class="hangman-leg hangman-leg-left" v-if="errores >= 5"></div>
            <!-- Pierna derecha -->
            <div class="hangman-leg hangman-leg-right" v-if="errores >= 6"></div>
            <!-- Cara (opcional para más errores) -->
            <div class="hangman-face" v-if="errores >= 7">
              <div class="eye eye-left"></div>
              <div class="eye eye-right"></div>
              <div class="mouth"></div>
            </div>
          </div>
          
          <div class="hangman-status">
            <div class="status-message" :class="statusClass">
              {{ statusMessage }}
            </div>
          </div>
        </div>

        <!-- Palabra a adivinar -->
        <div class="word-container">
          <div class="word-display">
            <span 
              v-for="(letter, index) in palabraArray" 
              :key="index"
              class="letter-space"
            >
              <span v-if="letrasAdivinadas.includes(letter.toLowerCase())" class="letter">
                {{ letter }}
              </span>
              <span v-else class="blank"></span>
            </span>
          </div>
          <div class="word-info">
            <span class="length">Longitud: {{ palabra.length }} letras</span>
            <q-btn 
              v-if="pistasRestantes > 0"
              flat 
              color="primary" 
              icon="lightbulb"
              @click="usarPista"
              :disable="juegoTerminado"
              class="btn-pista"
            >
              Usar pista ({{ pistasRestantes }})
            </q-btn>
          </div>
        </div>

        <!-- Teclado -->
        <div class="keyboard-container">
          <div class="keyboard-row" v-for="(row, rowIndex) in teclado" :key="rowIndex">
            <q-btn
              v-for="letra in row"
              :key="letra"
              class="keyboard-key"
              :class="{
                'correct': letrasAdivinadas.includes(letra),
                'incorrect': letrasIncorrectas.includes(letra),
                'disabled': juegoTerminado
              }"
              :disable="letrasAdivinadas.includes(letra) || letrasIncorrectas.includes(letra) || juegoTerminado"
              @click="probarLetra(letra)"
            >
              {{ letra }}
            </q-btn>
          </div>
        </div>

        <!-- Pista activa -->
        <div v-if="pistaActiva" class="hint-active">
          <q-icon name="lightbulb" size="24px" class="q-mr-sm" />
          <span>{{ pistaActiva }}</span>
        </div>

        <!-- Botones de control -->
        <div class="controls">
          <q-btn 
            color="primary" 
            icon="replay" 
            @click="reiniciarJuego"
            class="btn-control"
          >
            Reiniciar
          </q-btn>
          <q-btn 
            color="secondary" 
            icon="home" 
            to="/nivel"
            class="btn-control"
          >
            Cambiar nivel
          </q-btn>
        </div>
      </div>
    </div>

    <!-- Diálogo de resultado -->
    <q-dialog v-model="mostrarResultado" persistent>
      <q-card class="result-card">
        <q-card-section class="result-header" :class="resultado.ganado ? 'win' : 'lose'">
          <q-icon :name="resultado.ganado ? 'celebration' : 'mood_bad'" size="60px" />
          <h2 class="result-title">{{ resultado.ganado ? '¡Felicidades!' : '¡Oh no!' }}</h2>
        </q-card-section>

        <q-card-section class="result-body">
          <p class="result-message">{{ resultado.mensaje }}</p>
          
          <div class="result-stats">
            <div class="result-stat">
              <q-icon name="text_fields" />
              <span>Palabra: <strong>{{ palabra }}</strong></span>
            </div>
            <div class="result-stat">
              <q-icon name="refresh" />
              <span>Intentos usados: <strong>{{ nivel.intentos - intentosRestantes }}</strong></span>
            </div>
            <div class="result-stat">
              <q-icon name="score" />
              <span>Puntos ganados: <strong>{{ resultado.puntos }}</strong></span>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="result-actions">
          <q-btn flat label="Jugar otra vez" color="primary" @click="jugarOtraVez" />
          <q-btn flat label="Volver a niveles" color="secondary" to="/nivel" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

// Datos del juego
const categoria = ref({})
const nivel = ref({})
const palabra = ref('')
const palabraArray = computed(() => palabra.value.split(''))
const letrasAdivinadas = ref([])
const letrasIncorrectas = ref([])
const errores = computed(() => letrasIncorrectas.value.length)
const intentosRestantes = computed(() => nivel.value.intentos - errores.value)
const pistasRestantes = ref(0)
const pistaActiva = ref('')
const puntuacion = ref(0)
const juegoTerminado = ref(false)
const mostrarResultado = ref(false)

// Resultado del juego
const resultado = ref({
  ganado: false,
  mensaje: '',
  puntos: 0
})

// Teclado
const teclado = [
  ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  ['H', 'I', 'J', 'K', 'L', 'M', 'N'],
  ['Ñ', 'O', 'P', 'Q', 'R', 'S', 'T'],
  ['U', 'V', 'W', 'X', 'Y', 'Z']
]

// Palabras por categoría y dificultad
const palabrasDB = {
  Frutas: {
    facil: ['MANZANA', 'PERA', 'UVA', 'KIWI', 'CIRUELA', 'DURAZNO'],
    medio: ['SANDIA', 'MELOCOTON', 'FRAMBUESA', 'GUAYABA', 'MANDARINA', 'GRANADA'],
    dificil: ['MARACUYA', 'PITAYA', 'RAMBUTAN', 'CARAMBOLA', 'LITCHI', 'GUANABANA']
  },
  Animales: {
    facil: ['PERRO', 'GATO', 'OSO', 'VACA', 'LOBO', 'RATA'],
    medio: ['ELEFANTE', 'JIRAFA', 'CANGURO', 'DELFIN', 'TIGRE', 'CEBRA'],
    dificil: ['ORNITORRINCO', 'ARMADILLO', 'HIPOPOTAMO', 'CHIMPANCE', 'MURCIELAGO', 'CAMELLO']
  },
  Países: {
    facil: ['PERU', 'CHILE', 'CHINA', 'ITALIA', 'EGIPTO', 'BRASIL'],
    medio: ['ARGENTINA', 'COLOMBIA', 'AUSTRALIA', 'JAPON', 'ALEMANIA', 'CANADA'],
    dificil: ['INDONESIA', 'KAZAJISTAN', 'MADAGASCAR', 'VENEZUELA', 'SUIZA', 'POLONIA']
  }
}

// Mensajes de estado
const statusMessage = computed(() => {
  if (juegoTerminado.value) {
    return resultado.value.ganado ? '¡Ganaste!' : '¡Perdiste!'
  }
  if (errores.value === 0) return '¡Comienza a jugar!'
  if (errores.value === 1) return 'Primer error...'
  if (errores.value === 2) return 'Segundo error...'
  if (errores.value === 3) return 'Tercer error, cuidado...'
  if (errores.value === 4) return 'Cuarto error...'
  if (errores.value === 5) return 'Última oportunidad...'
  return '¡Juego terminado!'
})

const statusClass = computed(() => {
  if (juegoTerminado.value) {
    return resultado.value.ganado ? 'win' : 'lose'
  }
  if (errores.value <= 2) return 'safe'
  if (errores.value <= 4) return 'warning'
  return 'danger'
})

onMounted(() => {
  inicializarJuego()
})

const inicializarJuego = () => {
  // Obtener datos de localStorage o ruta
  const categoriaGuardada = localStorage.getItem('categoriaSeleccionada')
  const nivelGuardado = localStorage.getItem('nivelSeleccionado')
  
  if (categoriaGuardada && nivelGuardado) {
    try {
      categoria.value = JSON.parse(categoriaGuardada)
      nivel.value = JSON.parse(nivelGuardado)
    } catch (e) {
      console.error('Error al cargar datos:', e)
      router.push('/nivel')
      return
    }
  } else {
    router.push('/nivel')
    return
  }
  
  // Configurar pistas según dificultad
  switch(nivel.value.nombre.toLowerCase()) {
    case 'fácil':
    case 'facil':
      pistasRestantes.value = 3
      break
    case 'medio':
      pistasRestantes.value = 2
      break
    case 'difícil':
    case 'dificil':
      pistasRestantes.value = 1
      break
  }
  
  // Seleccionar palabra aleatoria
  seleccionarPalabra()
  
  // Resetear juego
  letrasAdivinadas.value = []
  letrasIncorrectas.value = []
  pistaActiva.value = ''
  puntuacion.value = 0
  juegoTerminado.value = false
  mostrarResultado.value = false
  
  // Notificación inicial
  $q.notify({
    type: 'info',
    message: `¡Comienza el juego! Categoría: ${categoria.value.nombre}, Nivel: ${nivel.value.nombre}`,
    position: 'top',
    timeout: 2000
  })
}

const seleccionarPalabra = () => {
  const categoriaNombre = categoria.value.nombre
  const nivelNombre = nivel.value.nombre.toLowerCase()
  
  if (palabrasDB[categoriaNombre] && palabrasDB[categoriaNombre][nivelNombre]) {
    const palabras = palabrasDB[categoriaNombre][nivelNombre]
    palabra.value = palabras[Math.floor(Math.random() * palabras.length)]
  } else {
    // Fallback si no hay palabras para esa categoría/nivel
    palabra.value = 'EJEMPLO'
  }
}

const probarLetra = (letra) => {
  if (juegoTerminado.value) return
  
  const letraLower = letra.toLowerCase()
  
  // Si la letra ya fue probada, ignorar
  if (letrasAdivinadas.value.includes(letraLower) || letrasIncorrectas.value.includes(letra)) {
    return
  }
  
  // Verificar si la letra está en la palabra
  if (palabra.value.toLowerCase().includes(letraLower)) {
    letrasAdivinadas.value.push(letraLower)
    
    // Calcular puntos
    const cantidad = (palabra.value.match(new RegExp(letraLower, 'gi')) || []).length
    puntuacion.value += cantidad * 10
    
    // Verificar si ganó
    verificarVictoria()
  } else {
    letrasIncorrectas.value.push(letra)
    
    // Verificar si perdió
    if (errores.value >= nivel.value.intentos) {
      terminarJuego(false)
    }
  }
}

const usarPista = () => {
  if (pistasRestantes.value <= 0 || juegoTerminado.value) return
  
  // Buscar una letra no adivinada
  const letrasNoAdivinadas = palabraArray.value
    .map(l => l.toLowerCase())
    .filter(l => !letrasAdivinadas.value.includes(l))
  
  if (letrasNoAdivinadas.length > 0) {
    const letraPista = letrasNoAdivinadas[0]
    pistaActiva.value = `Pista: La palabra contiene la letra "${letraPista.toUpperCase()}"`
    pistasRestantes.value--
    
    // La pista da la letra automáticamente
    probarLetra(letraPista.toUpperCase())
    
    // Limpiar pista después de 3 segundos
    setTimeout(() => {
      pistaActiva.value = ''
    }, 3000)
  }
}

const verificarVictoria = () => {
  const todasLetrasAdivinadas = palabraArray.value
    .every(letra => letrasAdivinadas.value.includes(letra.toLowerCase()))
  
  if (todasLetrasAdivinadas) {
    // Bonus por pistas no usadas
    puntuacion.value += pistasRestantes.value * 50
    // Bonus por intentos restantes
    puntuacion.value += intentosRestantes.value * 20
    terminarJuego(true)
  }
}

const terminarJuego = (ganado) => {
  juegoTerminado.value = true
  
  resultado.value = {
    ganado,
    mensaje: ganado 
      ? `¡Adivinaste la palabra "${palabra.value}"!` 
      : `La palabra era "${palabra.value}". ¡Mejor suerte la próxima!`,
    puntos: puntuacion.value
  }
  
  setTimeout(() => {
    mostrarResultado.value = true
  }, 1000)
}

const reiniciarJuego = () => {
  inicializarJuego()
}

const jugarOtraVez = () => {
  mostrarResultado.value = false
  reiniciarJuego()
}

// Teclado físico
document.addEventListener('keydown', (event) => {
  if (juegoTerminado.value) return
  
  const key = event.key.toUpperCase()
  if (/^[A-ZÑ]$/.test(key)) {
    probarLetra(key)
  }
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

/* Header del juego */
.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px 30px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.btn-back {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.btn-back:hover {
  background: rgba(102, 126, 234, 0.2);
}

.game-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.game-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.game-subtitle {
  display: flex;
  gap: 10px;
  align-items: center;
}

.category-badge {
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-weight: 600;
  font-size: 0.9rem;
}

.level-badge {
  padding: 5px 12px;
  border-radius: 15px;
  font-weight: 600;
  font-size: 0.9rem;
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

.header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.stats {
  display: flex;
  gap: 25px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  min-width: 70px;
}

.stat-item .q-icon {
  color: #667eea;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
}

/* Área del ahorcado */
.hangman-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.hangman-figure {
  position: relative;
  width: 200px;
  height: 250px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 20px;
}

.hangman-base {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 10px;
  background: #8B4513;
  border-radius: 5px;
}

.hangman-pole {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 180px;
  background: #8B4513;
}

.hangman-head {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background: #333;
  border-radius: 50%;
}

.hangman-body {
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 70px;
  background: #333;
}

.hangman-arm {
  position: absolute;
  top: 90px;
  width: 40px;
  height: 8px;
  background: #333;
}

.hangman-arm-left {
  left: 50%;
  transform: translateX(-100%) rotate(-45deg);
}

.hangman-arm-right {
  left: 50%;
  transform: translateX(0) rotate(45deg);
}

.hangman-leg {
  position: absolute;
  top: 150px;
  width: 40px;
  height: 8px;
  background: #333;
}

.hangman-leg-left {
  left: 50%;
  transform: translateX(-100%) rotate(-30deg);
}

.hangman-leg-right {
  left: 50%;
  transform: translateX(0) rotate(30deg);
}

.hangman-face {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
}

.eye {
  position: absolute;
  top: 12px;
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
}

.eye-left {
  left: 10px;
}

.eye-right {
  right: 10px;
}

.mouth {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 5px;
  background: white;
  border-radius: 5px 5px 0 0;
}

.hangman-status {
  text-align: center;
}

.status-message {
  font-size: 1.2rem;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 25px;
  display: inline-block;
}

.status-message.safe {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.status-message.warning {
  background: rgba(255, 152, 0, 0.1);
  color: #FF9800;
}

.status-message.danger {
  background: rgba(244, 67, 54, 0.1);
  color: #F44336;
}

.status-message.win {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.status-message.lose {
  background: rgba(244, 67, 54, 0.2);
  color: #F44336;
}

/* Palabra a adivinar */
.word-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.word-display {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.letter-space {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  width: 40px;
}

.letter {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.blank {
  width: 40px;
  height: 5px;
  background: #667eea;
  border-radius: 3px;
}

.word-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.length {
  color: #666;
  font-weight: 500;
}

.btn-pista {
  background: rgba(255, 193, 7, 0.1);
}

.btn-pista:hover {
  background: rgba(255, 193, 7, 0.2);
}

/* Teclado */
.keyboard-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.keyboard-row {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
}

.keyboard-key {
  width: 50px;
  height: 50px;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.2s;
}

.keyboard-key.correct {
  background: #4CAF50 !important;
  color: white !important;
}

.keyboard-key.incorrect {
  background: #F44336 !important;
  color: white !important;
}

.keyboard-key.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.keyboard-key:hover:not(.disabled) {
  transform: translateY(-2px);
}

/* Pista activa */
.hint-active {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 193, 7, 0.1);
  color: #FF9800;
  padding: 15px 25px;
  border-radius: 15px;
  margin-bottom: 20px;
  font-weight: 500;
  border: 2px solid rgba(255, 193, 7, 0.3);
}

/* Controles */
.controls {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.btn-control {
  min-width: 150px;
}

/* Diálogo de resultado */
.result-card {
  width: 100%;
  max-width: 500px;
  border-radius: 20px;
  overflow: hidden;
}

.result-header {
  text-align: center;
  padding: 30px;
}

.result-header.win {
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
  color: white;
}

.result-header.lose {
  background: linear-gradient(135deg, #F44336 0%, #FF9800 100%);
  color: white;
}

.result-title {
  font-size: 2rem;
  margin: 15px 0 0 0;
}

.result-body {
  padding: 30px;
}

.result-message {
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 25px;
  color: #333;
}

.result-stats {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.result-stat {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 10px;
  color: #555;
}

.result-stat .q-icon {
  color: #667eea;
}

.result-actions {
  padding: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 15px;
  }
  
  .game-header {
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    text-align: center;
  }
  
  .header-left {
    flex-direction: column;
    gap: 15px;
  }
  
  .header-right {
    align-items: center;
  }
  
  .game-title {
    font-size: 1.8rem;
  }
  
  .stats {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .word-display {
    gap: 5px;
  }
  
  .letter {
    font-size: 2rem;
  }
  
  .letter-space {
    width: 30px;
  }
  
  .keyboard-key {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .controls {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-control {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .game-title {
    font-size: 1.5rem;
  }
  
  .stat-value {
    font-size: 1.2rem;
  }
  
  .letter {
    font-size: 1.5rem;
  }
  
  .keyboard-row {
    gap: 5px;
  }
  
  .keyboard-key {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  }
}
</style>