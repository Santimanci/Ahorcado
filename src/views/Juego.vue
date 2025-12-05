<template>
  <q-page class="flex flex-center column q-pa-md main-container">
    <!-- Fondo animado -->
    <div class="background-animation">
      <div class="bubble bubble-1"></div>
      <div class="bubble bubble-2"></div>
      <div class="bubble bubble-3"></div>
      <div class="bubble bubble-4"></div>
    </div>

    <!-- Contenido principal -->
    <div class="content-wrapper">
      <!-- Header compacto -->
      <div class="game-header-compact">
        <div class="header-top">
          <q-btn 
            to="/nivel"
            flat 
            round 
            icon="arrow_back" 
            class="btn-back"
            size="sm"
            title="Volver a niveles"
          />
          <div class="header-titles">
            <h1 class="game-title-compact">Ahorcado</h1>
            <div class="game-subtitle-compact">
              <span class="category-badge-compact" :style="{ background: categoria.color }">
                {{ categoria.nombre }}
              </span>
              <span class="level-badge-compact" :class="nivel.clase">
                {{ nivel.nombre }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="header-stats">
          <div class="stat-item-compact">
            <q-icon name="refresh" size="16px" />
            <span class="stat-value-compact">{{ intentosRestantes }}/{{ nivel.intentos }}</span>
            <span class="stat-label-compact">Intentos</span>
          </div>
          <div class="stat-item-compact">
            <q-icon name="help" size="16px" />
            <span class="stat-value-compact">{{ pistasRestantes }}</span>
            <span class="stat-label-compact">Pistas</span>
          </div>
          <div class="stat-item-compact">
            <q-icon name="score" size="16px" />
            <span class="stat-value-compact">{{ puntuacion }}</span>
            <span class="stat-label-compact">Puntos</span>
          </div>
        </div>
      </div>

      <!-- Área de juego compacta -->
      <div class="game-area-compact">
        <!-- Sección superior: Ahorcado y palabra -->
        <div class="top-section">
          <!-- Ahorcado visual compacto -->
          <div class="hangman-container-compact">
            <div class="hangman-figure-compact">
              <!-- Base -->
              <div class="hangman-base-compact"></div>
              <!-- Poste -->
              <div class="hangman-pole-compact"></div>
              <!-- Soporte superior -->
              <div class="hangman-top-compact" v-if="errores >= 1"></div>
              <!-- Cuerda -->
              <div class="hangman-rope-compact" v-if="errores >= 1"></div>
              <!-- Cabeza -->
              <div class="hangman-head-compact" v-if="errores >= 2"></div>
              <!-- Cuerpo -->
              <div class="hangman-body-compact" v-if="errores >= 3"></div>
              <!-- Brazo izquierdo -->
              <div class="hangman-arm-compact hangman-arm-left-compact" v-if="errores >= 4"></div>
              <!-- Brazo derecho -->
              <div class="hangman-arm-compact hangman-arm-right-compact" v-if="errores >= 5"></div>
              <!-- Pierna izquierda -->
              <div class="hangman-leg-compact hangman-leg-left-compact" v-if="errores >= 6"></div>
              <!-- Pierna derecha -->
              <div class="hangman-leg-compact hangman-leg-right-compact" v-if="errores >= 7"></div>
            </div>
            
            <div class="hangman-status-compact">
              <div class="status-message-compact" :class="statusClass">
                {{ statusMessage }}
              </div>
              <div class="error-count-compact" v-if="errores > 0">
                Errores: {{ errores }}
              </div>
            </div>
          </div>

          <!-- Palabra a adivinar compacta -->
          <div class="word-container-compact">
            <div class="word-display-compact">
              <span 
                v-for="(letter, index) in palabraArray" 
                :key="index"
                class="letter-space-compact"
              >
                <span v-if="letraAdivinada(letter)" class="letter-compact">
                  {{ letter }}
                </span>
                <span v-else class="blank-compact"></span>
              </span>
            </div>
            <div class="word-info-compact">
              <span class="length-compact">{{ palabra.length }} letras</span>
              <div class="hint-controls-compact">
                <q-btn 
                  v-if="pistasRestantes > 0"
                  flat 
                  color="primary" 
                  icon="lightbulb"
                  @click="usarPistaDescriptiva"
                  :disable="juegoTerminado"
                  class="btn-pista-compact"
                  size="sm"
                  dense
                >
                  Pista ({{ pistasRestantes }})
                </q-btn>
              </div>
            </div>
          </div>
        </div>

        <!-- Pistas descriptivas -->
        <div v-if="pistaDescriptivaActiva" class="hint-descriptive-compact">
          <q-icon name="info" size="18px" class="q-mr-xs" />
          <div class="hint-content-compact">
            <strong>Pista:</strong> {{ pistaDescriptivaActiva }}
          </div>
        </div>

        <!-- Teclado compacto - SIMPLIFICADO -->
        <div class="keyboard-container-compact">
          <div class="keyboard-row-compact" v-for="(row, rowIndex) in tecladoFilas" :key="rowIndex">
            <q-btn
              v-for="letra in row"
              :key="letra"
              class="keyboard-key-compact"
              :class="{
                'correct': letraAdivinada(letra),
                'incorrect': letrasIncorrectas.includes(letra),
                'disabled': juegoTerminado
              }"
              :disable="letraAdivinada(letra) || letrasIncorrectas.includes(letra) || juegoTerminado"
              @click="probarLetra(letra)"
              size="sm"
              dense
            >
              {{ letra }}
            </q-btn>
          </div>
        </div>

        <!-- Letras incorrectas compactas -->
        <div class="incorrect-letters-compact" v-if="letrasIncorrectas.length > 0">
          <q-icon name="close" size="14px" class="q-mr-xs" />
          <span>Incorrectas: </span>
          <span class="incorrect-letter-compact" v-for="letra in letrasIncorrectas" :key="letra">
            {{ letra }}
          </span>
        </div>

        <!-- Botones de control compactos -->
        <div class="controls-compact">
          <q-btn 
            color="primary" 
            icon="replay" 
            @click="reiniciarJuego"
            class="btn-control-compact"
            size="sm"
            dense
          >
            Reiniciar
          </q-btn>
          <q-btn 
            color="secondary" 
            icon="home" 
            to="/nivel"
            class="btn-control-compact"
            size="sm"
            dense
          >
            Niveles
          </q-btn>
        </div>
      </div>
    </div>

    <!-- Diálogo de resultado compacto -->
    <q-dialog v-model="mostrarResultado" persistent>
      <q-card class="result-card-compact">
        <q-card-section class="result-header-compact" :class="resultado.ganado ? 'win' : 'lose'">
          <q-icon :name="resultado.ganado ? 'celebration' : 'mood_bad'" size="40px" />
          <h2 class="result-title-compact">{{ resultado.ganado ? '¡Ganaste!' : '¡Perdiste!' }}</h2>
        </q-card-section>

        <q-card-section class="result-body-compact">
          <div class="result-word-compact">
            <q-icon name="text_fields" size="18px" />
            <span><strong>{{ palabra }}</strong></span>
          </div>
          
          <div class="result-stats-compact">
            <div class="result-stat-compact">
              <q-icon name="category" size="14px" />
              <span>{{ categoria.nombre }}</span>
            </div>
            <div class="result-stat-compact">
              <q-icon name="school" size="14px" />
              <span>{{ nivel.nombre }}</span>
            </div>
            <div class="result-stat-compact">
              <q-icon name="refresh" size="14px" />
              <span>{{ errores }} errores</span>
            </div>
            <div class="result-stat-compact highlight">
              <q-icon name="score" size="14px" />
              <span>{{ resultado.puntos }} pts</span>
            </div>
          </div>
          
          <div class="result-message-compact">
            <p>{{ resultado.mensaje }}</p>
          </div>
        </q-card-section>

        <q-card-actions align="center" class="result-actions-compact">
          <q-btn label="Jugar otra vez" color="primary" @click="jugarOtraVez" size="sm" dense />
          <q-btn label="Volver" color="secondary" to="/nivel" size="sm" dense />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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
const pistasUsadas = ref(0)
const pistaDescriptivaActiva = ref('')
const pistaGratisUsada = ref(false)
const puntuacion = ref(0)
const juegoTerminado = ref(false)
const mostrarResultado = ref(false)

// Resultado del juego
const resultado = ref({
  ganado: false,
  mensaje: '',
  puntos: 0
})

// Teclado fijo con todas las letras básicas
const tecladoFilas = [
  ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  ['H', 'I', 'J', 'K', 'L', 'M', 'N'],
  ['Ñ', 'O', 'P', 'Q', 'R', 'S', 'T'],
  ['U', 'V', 'W', 'X', 'Y', 'Z']
]

// Función SIMPLIFICADA para verificar si una letra está adivinada
const letraAdivinada = (letra) => {
  return letrasAdivinadas.value.some(l => l === letra);
}

// Base de datos de palabras SIN TILDES y en MAYÚSCULAS básicas
const palabrasDB = {
  Frutas: {
    facil: [
      { palabra: 'MANZANA', pista: 'Fruta roja o verde muy común' },
      { palabra: 'PERA', pista: 'Fruta dulce con forma de campana' },
      { palabra: 'UVA', pista: 'Pequeña fruta que crece en racimos' },
      { palabra: 'KIWI', pista: 'Fruta peluda por fuera y verde por dentro' },
      { palabra: 'CIRUELA', pista: 'Fruta de hueso pequeño y dulce' },
      { palabra: 'MELON', pista: 'Fruta grande y redonda muy refrescante' },
      { palabra: 'SANDIA', pista: 'Fruta grande con cascara verde y pulpa roja' }
    ],
    medio: [
      { palabra: 'DURAZNO', pista: 'Fruta aterciopelada de color naranja' },
      { palabra: 'FRAMBUESA', pista: 'Pequeña fruta roja y acida' },
      { palabra: 'MANDARINA', pista: 'Citrico facil de pelar y dulce' },
      { palabra: 'GRANADA', pista: 'Fruta con muchas semillas rojas jugosas' },
      { palabra: 'PAPAYA', pista: 'Fruta tropical con pulpa naranja' },
      { palabra: 'MARACUYA', pista: 'Fruta tropical acida de la pasion' },
      { palabra: 'GUAYABA', pista: 'Fruta tropical con aroma fuerte' }
    ],
    dificil: [
      { palabra: 'CARAMBOLA', pista: 'Fruta con forma de estrella al cortarla' },
      { palabra: 'PITAYA', pista: 'Fruta exotica de cactus o fruta del dragon' },
      { palabra: 'RAMBUTAN', pista: 'Fruta tropical peluda por fuera' },
      { palabra: 'GUANABANA', pista: 'Fruta tropical grande con espinas suaves' },
      { palabra: 'LITCHI', pista: 'Fruta pequeña con cascara roja rugosa' },
      { palabra: 'MAMEY', pista: 'Fruta tropical con pulpa naranja' },
      { palabra: 'TAMARINDO', pista: 'Fruta tropical con vaina marron' }
    ]
  },
  
  Animales: {
    facil: [
      { palabra: 'PERRO', pista: 'Mejor amigo del hombre' },
      { palabra: 'GATO', pista: 'Animal domestico que maulla' },
      { palabra: 'OSO', pista: 'Gran mamifero que hiberna' },
      { palabra: 'VACA', pista: 'Animal de granja que da leche' },
      { palabra: 'LOBO', pista: 'Depredador que vive en manadas' },
      { palabra: 'RATA', pista: 'Roedor de cola larga' },
      { palabra: 'PEZ', pista: 'Animal acuatico con aletas' }
    ],
    medio: [
      { palabra: 'ELEFANTE', pista: 'Animal terrestre mas grande con trompa' },
      { palabra: 'JIRAFA', pista: 'Animal mas alto del mundo' },
      { palabra: 'CANGURO', pista: 'Animal marsupial que salta' },
      { palabra: 'DELFIN', pista: 'Mamifero marino muy inteligente' },
      { palabra: 'CEBRA', pista: 'Animal africano con rayas' },
      { palabra: 'LEOPARDO', pista: 'Gran felino con pelaje manchado' },
      { palabra: 'HIPOPOTAMO', pista: 'Gran mamifero semiacuatico' }
    ],
    dificil: [
      { palabra: 'ORNITORRINCO', pista: 'Mamifero australiano que pone huevos' },
      { palabra: 'ARMADILLO', pista: 'Mamifero con armadura osea' },
      { palabra: 'CHIMPANCE', pista: 'Primate muy inteligente' },
      { palabra: 'MURCIELAGO', pista: 'Unico mamifero que vuela' },
      { palabra: 'PANGOLIN', pista: 'Mamifero cubierto de escamas' },
      { palabra: 'NARVAL', pista: 'Ballena artica con colmillo largo' },
      { palabra: 'OKAPI', pista: 'Animal africano pariente de la jirafa' }
    ]
  },
  
  Países: {
    facil: [
      { palabra: 'PERU', pista: 'Pais sudamericano con Machu Picchu' },
      { palabra: 'CHILE', pista: 'Pais largo con desierto de Atacama' },
      { palabra: 'CHINA', pista: 'Pais mas poblado del mundo' },
      { palabra: 'ITALIA', pista: 'Pais con forma de bota' },
      { palabra: 'BRASIL', pista: 'Pais mas grande de Sudamerica' },
      { palabra: 'FRANCIA', pista: 'Pais europeo con Torre Eiffel' },
      { palabra: 'EGIPTO', pista: 'Pais africano con piramides' }
    ],
    medio: [
      { palabra: 'ARGENTINA', pista: 'Pais famoso por el tango y el asado' },
      { palabra: 'COLOMBIA', pista: 'Pais conocido por el cafe y esmeraldas' },
      { palabra: 'AUSTRALIA', pista: 'Pais continente con canguros' },
      { palabra: 'JAPON', pista: 'Pais insular del Sol Naciente' },
      { palabra: 'ALEMANIA', pista: 'Pais europeo famoso por cerveza' },
      { palabra: 'CANADA', pista: 'Segundo pais mas grande del mundo' },
      { palabra: 'MEXICO', pista: 'Pais norteamericano con tacos' }
    ],
    dificil: [
      { palabra: 'INDONESIA', pista: 'Archipielago con mas de 17000 islas' },
      { palabra: 'KAZAJISTAN', pista: 'Pais mas grande sin salida al mar' },
      { palabra: 'MADAGASCAR', pista: 'Gran isla con lemures unicos' },
      { palabra: 'VENEZUELA', pista: 'Pais con cataratas mas altas del mundo' },
      { palabra: 'SUIZA', pista: 'Pais europeo neutral famoso' },
      { palabra: 'ETIOPIA', pista: 'Pais africano cuna del cafe' },
      { palabra: 'NEPAL', pista: 'Pais asiatico con Monte Everest' }
    ]
  },
  
  Deportes: {
    facil: [
      { palabra: 'FUTBOL', pista: 'Deporte con pelota y porterias' },
      { palabra: 'TENIS', pista: 'Deporte con raquetas y red' },
      { palabra: 'NATACION', pista: 'Deporte en el agua' },
      { palabra: 'BASQUET', pista: 'Deporte con canasta y pelota naranja' },
      { palabra: 'BOXEO', pista: 'Deporte de combate con guantes' }
    ],
    medio: [
      { palabra: 'VOLEIBOL', pista: 'Deporte con red y pelota' },
      { palabra: 'ATLETISMO', pista: 'Deporte con carreras y saltos' },
      { palabra: 'CICLISMO', pista: 'Deporte con bicicletas' },
      { palabra: 'ESGRIMA', pista: 'Deporte con espadas' },
      { palabra: 'JUDO', pista: 'Arte marcial japones' }
    ],
    dificil: [
      { palabra: 'PENTATLON', pista: 'Cinco disciplinas deportivas' },
      { palabra: 'BADMINTON', pista: 'Deporte con volante o pluma' },
      { palabra: 'ESPELEISMO', pista: 'Exploracion de cuevas' },
      { palabra: 'ORIENTACION', pista: 'Deporte con mapa y brujula' },
      { palabra: 'TAEKWONDO', pista: 'Arte marcial coreano' }
    ]
  }
}

// Variable para almacenar la pista descriptiva
const pistaDescriptiva = ref('')
const palabraSeleccionada = ref(null)

// Mensajes de estado
const statusMessage = computed(() => {
  if (juegoTerminado.value) {
    return resultado.value.ganado ? '¡Victoria!' : '¡Perdiste!'
  }
  if (errores.value === 0) return '¡Comienza!'
  if (errores.value === 1) return '1 error'
  if (errores.value === 2) return '2 errores'
  if (errores.value === 3) return '3 errores'
  if (errores.value === 4) return '4 errores'
  if (errores.value === 5) return '5 errores'
  if (errores.value >= 6) return '¡Última!'
  return 'Juego terminado'
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
  console.log('Juego montado')
  inicializarJuego()
})

const inicializarJuego = () => {
  console.log('Inicializando juego...')
  
  // Obtener datos de localStorage
  const categoriaGuardada = localStorage.getItem('categoriaSeleccionada')
  const nivelGuardado = localStorage.getItem('nivelSeleccionado')
  
  console.log('Datos de localStorage:', { categoriaGuardada, nivelGuardado })
  
  // Verificar que existan los datos
  if (!categoriaGuardada || !nivelGuardado) {
    $q.notify({
      type: 'negative',
      message: 'Error: No se encontraron datos del juego',
      position: 'top',
      timeout: 2000
    })
    
    setTimeout(() => {
      router.push('/nivel')
    }, 2000)
    return
  }
  
  try {
    // Parsear los datos
    categoria.value = JSON.parse(categoriaGuardada)
    nivel.value = JSON.parse(nivelGuardado)
    
    console.log('Categoría cargada:', categoria.value)
    console.log('Nivel cargado:', nivel.value)
    
  } catch (error) {
    console.error('Error al parsear JSON:', error)
    $q.notify({
      type: 'negative',
      message: 'Error en los datos del juego',
      position: 'top'
    })
    
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
    default:
      pistasRestantes.value = 2
  }
  
  // Resetear variables
  pistasUsadas.value = 0
  pistaGratisUsada.value = false
  pistaDescriptivaActiva.value = ''
  letrasAdivinadas.value = []
  letrasIncorrectas.value = []
  puntuacion.value = 0
  juegoTerminado.value = false
  mostrarResultado.value = false
  
  // Seleccionar palabra aleatoria
  seleccionarPalabraConPista()
  
  console.log('Juego inicializado correctamente')
}

const seleccionarPalabraConPista = () => {
  const categoriaNombre = categoria.value.nombre
  const nivelNombre = nivel.value.nombre.toLowerCase()
  
  console.log('Buscando palabras para:', { categoriaNombre, nivelNombre })
  
  if (palabrasDB[categoriaNombre] && palabrasDB[categoriaNombre][nivelNombre]) {
    const palabras = palabrasDB[categoriaNombre][nivelNombre]
    console.log('Palabras encontradas:', palabras)
    
    palabraSeleccionada.value = palabras[Math.floor(Math.random() * palabras.length)]
    palabra.value = palabraSeleccionada.value.palabra
    pistaDescriptiva.value = palabraSeleccionada.value.pista
    
    console.log('Palabra seleccionada:', palabra.value)
    console.log('Pista:', pistaDescriptiva.value)
    
    // DEBUG: Mostrar todas las letras de la palabra
    console.log('Letras de la palabra:', palabra.value.split(''))
  } else {
    console.error('No hay palabras para:', { categoriaNombre, nivelNombre })
    
    // Usar palabra por defecto para debug
    palabra.value = 'EJEMPLO'
    pistaDescriptiva.value = 'Esta es una palabra de ejemplo'
    
    $q.notify({
      type: 'warning',
      message: 'Usando palabra de ejemplo',
      position: 'top',
      timeout: 2000
    })
  }
}

const probarLetra = (letra) => {
  if (juegoTerminado.value) return
  
  console.log('Probando letra:', letra)
  console.log('Palabra actual:', palabra.value)
  console.log('Letras adivinadas:', letrasAdivinadas.value)
  console.log('Letras incorrectas:', letrasIncorrectas.value)
  
  // Si la letra ya fue probada, ignorar
  if (letrasAdivinadas.value.includes(letra) || letrasIncorrectas.value.includes(letra)) {
    console.log('Letra ya probada:', letra)
    return
  }
  
  // Verificar si la letra está en la palabra (comparación directa)
  if (palabra.value.includes(letra)) {
    console.log('¡Letra correcta!', letra)
    letrasAdivinadas.value.push(letra)
    
    // Calcular puntos
    const cantidad = (palabra.value.match(new RegExp(letra, 'g')) || []).length
    puntuacion.value += cantidad * 15
    
    // Verificar si ganó
    verificarVictoria()
  } else {
    console.log('Letra incorrecta:', letra)
    letrasIncorrectas.value.push(letra)
    
    // Verificar si perdió
    if (errores.value >= nivel.value.intentos) {
      console.log('¡Perdió! Errores:', errores.value)
      terminarJuego(false)
    }
  }
}

const usarPistaDescriptiva = () => {
  if (pistasRestantes.value <= 0 || juegoTerminado.value) return
  
  pistasRestantes.value--
  pistasUsadas.value++
  
  // Mostrar la pista descriptiva completa
  pistaDescriptivaActiva.value = pistaDescriptiva.value
  
  // La pista da un pequeño bonus de puntos
  puntuacion.value += 5
  
  // Limpiar pista después de 8 segundos
  setTimeout(() => {
    if (pistaDescriptivaActiva.value === pistaDescriptiva.value) {
      pistaDescriptivaActiva.value = ''
    }
  }, 8000)
}

const verificarVictoria = () => {
  console.log('Verificando victoria...')
  console.log('Palabra:', palabra.value)
  console.log('Letras adivinadas:', letrasAdivinadas.value)
  
  // Verificar si todas las letras de la palabra han sido adivinadas
  const todasLetrasAdivinadas = palabra.value.split('').every(letra => {
    const estaAdivinada = letrasAdivinadas.value.includes(letra)
    console.log(`Letra ${letra} adivinada: ${estaAdivinada}`)
    return estaAdivinada
  })
  
  console.log('Todas las letras adivinadas?', todasLetrasAdivinadas)
  
  if (todasLetrasAdivinadas) {
    console.log('¡Victoria!')
    // Bonus por pistas no usadas
    puntuacion.value += pistasRestantes.value * 50
    // Bonus por intentos restantes
    puntuacion.value += intentosRestantes.value * 20
    
    terminarJuego(true)
  }
}

const terminarJuego = (ganado) => {
  console.log('Terminando juego. Ganado?', ganado)
  juegoTerminado.value = true
  
  resultado.value = {
    ganado,
    mensaje: ganado 
      ? `¡Adivinaste la palabra "${palabra.value}" con ${errores.value} errores!` 
      : `La palabra era "${palabra.value}". ¡Sigue practicando!`,
    puntos: puntuacion.value
  }
  
  setTimeout(() => {
    mostrarResultado.value = true
  }, 800)
}

const reiniciarJuego = () => {
  $q.notify({
    type: 'info',
    message: 'Reiniciando juego...',
    position: 'top',
    timeout: 800
  })
  
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
  // Permitir letras básicas A-Z y Ñ
  if (/^[A-ZÑ]$/.test(key)) {
    probarLetra(key)
  }
})
</script>

<style scoped>
/* (Los estilos se mantienen igual que en la versión anterior) */
.main-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px !important;
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
  width: 60px;
  height: 60px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.bubble-2 {
  width: 80px;
  height: 80px;
  top: 60%;
  left: 80%;
  animation-delay: -5s;
}

.bubble-3 {
  width: 40px;
  height: 40px;
  top: 80%;
  left: 20%;
  animation-delay: -10s;
}

.bubble-4 {
  width: 70px;
  height: 70px;
  top: 30%;
  left: 70%;
  animation-delay: -7s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(120deg); }
  66% { transform: translateY(10px) rotate(240deg); }
}

.content-wrapper {
  position: relative;
  z-index: 1;
  max-width: 900px;
  width: 100%;
  padding: 10px;
}

/* Header compacto */
.game-header-compact {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 12px 15px;
  margin-bottom: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.header-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.btn-back {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  min-height: 32px;
  min-width: 32px;
}

.header-titles {
  flex: 1;
}

.game-title-compact {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.game-subtitle-compact {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 4px;
}

.category-badge-compact {
  color: white;
  padding: 3px 8px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.75rem;
}

.level-badge-compact {
  padding: 3px 8px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.75rem;
}

.level-badge-compact.facil {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.level-badge-compact.medio {
  background: rgba(255, 152, 0, 0.1);
  color: #FF9800;
}

.level-badge-compact.dificil {
  background: rgba(244, 67, 54, 0.1);
  color: #F44336;
}

.header-stats {
  display: flex;
  justify-content: space-around;
  gap: 15px;
}

.stat-item-compact {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  min-width: 60px;
}

.stat-item-compact .q-icon {
  color: #667eea;
  font-size: 16px;
}

.stat-value-compact {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
  line-height: 1;
}

.stat-label-compact {
  font-size: 0.7rem;
  color: #666;
  line-height: 1;
}

/* Área de juego compacta */
.game-area-compact {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Sección superior: Ahorcado y palabra */
.top-section {
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

/* Ahorcado compacto */
.hangman-container-compact {
  flex: 1;
  max-width: 180px;
}

.hangman-figure-compact {
  position: relative;
  width: 100%;
  height: 180px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 15px;
  border: 2px solid #8B4513;
}

.hangman-base-compact {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 8px;
  background: #8B4513;
  border-radius: 4px;
}

.hangman-pole-compact {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 120px;
  background: #8B4513;
  border-radius: 3px;
}

.hangman-top-compact {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 6px;
  background: #8B4513;
  border-radius: 3px;
}

.hangman-rope-compact {
  position: absolute;
  top: 21px;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  height: 25px;
  background: #654321;
  border-radius: 1.5px;
}

.hangman-head-compact {
  position: absolute;
  top: 46px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  background: #333;
  border-radius: 50%;
  border: 2px solid #222;
}

.hangman-body-compact {
  position: absolute;
  top: 76px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 50px;
  background: #333;
  border-radius: 3px;
}

.hangman-arm-compact {
  position: absolute;
  top: 85px;
  width: 30px;
  height: 6px;
  background: #333;
  border-radius: 3px;
}

.hangman-arm-left-compact {
  left: calc(50% - 15px);
  transform: rotate(-45deg);
}

.hangman-arm-right-compact {
  left: calc(50% - 15px);
  transform: rotate(45deg);
}

.hangman-leg-compact {
  position: absolute;
  top: 125px;
  width: 30px;
  height: 6px;
  background: #333;
  border-radius: 3px;
}

.hangman-leg-left-compact {
  left: calc(50% - 15px);
  transform: rotate(-30deg);
}

.hangman-leg-right-compact {
  left: calc(50% - 15px);
  transform: rotate(30deg);
}

.hangman-status-compact {
  text-align: center;
  margin-top: 8px;
}

.status-message-compact {
  font-size: 0.9rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 15px;
  display: inline-block;
}

.status-message-compact.safe {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.status-message-compact.warning {
  background: rgba(255, 152, 0, 0.2);
  color: #FF9800;
  border: 1px solid rgba(255, 152, 0, 0.3);
}

.status-message-compact.danger {
  background: rgba(244, 67, 54, 0.2);
  color: #F44336;
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.status-message-compact.win {
  background: rgba(76, 175, 80, 0.3);
  color: #4CAF50;
  border: 1px solid #4CAF50;
}

.status-message-compact.lose {
  background: rgba(244, 67, 54, 0.3);
  color: #F44336;
  border: 1px solid #F44336;
}

.error-count-compact {
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
  margin-top: 4px;
}

/* Palabra compacta */
.word-container-compact {
  flex: 2;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.word-display-compact {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.letter-space-compact {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  width: 35px;
}

.letter-compact {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  text-transform: uppercase;
}

.blank-compact {
  width: 35px;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
}

.word-info-compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.length-compact {
  color: #666;
  font-weight: 500;
  font-size: 0.9rem;
}

.hint-controls-compact {
  display: flex;
  gap: 8px;
}

.btn-pista-compact {
  background: rgba(33, 150, 243, 0.1);
  font-weight: 600;
  font-size: 0.8rem;
  padding: 4px 8px;
}

.btn-pista-compact:hover {
  background: rgba(33, 150, 243, 0.2);
}

/* Pistas descriptivas compactas */
.hint-descriptive-compact {
  display: flex;
  align-items: flex-start;
  padding: 10px 15px;
  border-radius: 10px;
  font-weight: 500;
  font-size: 0.85rem;
  line-height: 1.3;
  background: rgba(33, 150, 243, 0.1);
  color: #1976D2;
  border: 1px solid rgba(33, 150, 243, 0.3);
  max-height: 60px;
  overflow-y: auto;
}

.hint-content-compact {
  flex: 1;
}

/* Teclado compacto */
.keyboard-container-compact {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  padding: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.keyboard-row-compact {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-bottom: 5px;
}

.keyboard-key-compact {
  width: 35px;
  height: 35px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  text-transform: uppercase;
  min-width: auto;
  padding: 0;
}

.keyboard-key-compact.correct {
  background: linear-gradient(135deg, #4CAF50, #8BC34A) !important;
  color: white !important;
  transform: scale(0.95);
}

.keyboard-key-compact.incorrect {
  background: linear-gradient(135deg, #F44336, #EF5350) !important;
  color: white !important;
  transform: scale(0.95);
}

.keyboard-key-compact.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.keyboard-key-compact:hover:not(.disabled) {
  transform: translateY(-2px);
}

/* Letras incorrectas compactas */
.incorrect-letters-compact {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(244, 67, 54, 0.1);
  color: #F44336;
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: 500;
  font-size: 0.85rem;
  flex-wrap: wrap;
  gap: 4px;
}

.incorrect-letter-compact {
  font-weight: 700;
  font-size: 0.9rem;
}

/* Controles compactos */
.controls-compact {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 5px;
}

.btn-control-compact {
  min-width: 100px;
  font-weight: 600;
  font-size: 0.85rem;
}

/* Diálogo de resultado compacto */
.result-card-compact {
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  overflow: hidden;
}

.result-header-compact {
  text-align: center;
  padding: 20px 15px;
}

.result-header-compact.win {
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
  color: white;
}

.result-header-compact.lose {
  background: linear-gradient(135deg, #F44336 0%, #EF5350 100%);
  color: white;
}

.result-title-compact {
  font-size: 1.5rem;
  margin: 10px 0 0 0;
  font-weight: 700;
}

.result-body-compact {
  padding: 15px;
}

.result-word-compact {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 1rem;
}

.result-stats-compact {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}

.result-stat-compact {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 6px;
  color: #555;
  font-size: 0.85rem;
}

.result-stat-compact.highlight {
  grid-column: span 2;
  background: rgba(102, 126, 234, 0.1);
  font-weight: 600;
}

.result-message-compact {
  text-align: center;
  padding: 12px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  font-size: 0.9rem;
  line-height: 1.4;
}

.result-actions-compact {
  padding: 15px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  gap: 10px;
}

/* Responsive para pantallas muy pequeñas */
@media (max-width: 768px) {
  .top-section {
    flex-direction: column;
    align-items: center;
  }
  
  .hangman-container-compact {
    max-width: 160px;
  }
  
  .hangman-figure-compact {
    height: 160px;
    padding: 12px;
  }
  
  .word-display-compact {
    gap: 6px;
  }
  
  .letter-space-compact {
    width: 30px;
  }
  
  .letter-compact {
    font-size: 1.7rem;
    height: 35px;
  }
  
  .blank-compact {
    width: 30px;
  }
  
  .keyboard-key-compact {
    width: 30px;
    height: 30px;
    font-size: 0.9rem;
  }
  
  .controls-compact {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-control-compact {
    width: 100%;
    max-width: 200px;
  }
}

@media (max-width: 480px) {
  .game-title-compact {
    font-size: 1.3rem;
  }
  
  .stat-value-compact {
    font-size: 1rem;
  }
  
  .letter-compact {
    font-size: 1.5rem;
  }
  
  .keyboard-row-compact {
    gap: 4px;
  }
  
  .keyboard-key-compact {
    width: 28px;
    height: 28px;
    font-size: 0.85rem;
  }
  
  .hint-descriptive-compact {
    font-size: 0.8rem;
    padding: 8px 12px;
  }
}
</style>

<style>
/* Estilos globales para el diálogo */
.q-dialog__inner--minimized > div {
  max-width: 95vw;
}
</style>