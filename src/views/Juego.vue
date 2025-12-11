<template>
  <q-page class="flex flex-center bg-grey-1">
    <div class="game-container">
      <!-- Header mejorado -->
      <div class="game-header q-pa-md">
        <div class="row items-center justify-between">
          <div class="row items-center">
            <q-btn 
               to ="/nivel"ñ
              icon="arrow_back" 
              flat 
              round 
              dense 
              class="q-mr-sm"
              @click="confirmarSalida"
            />
            <div class="column">
              <div class="text-h6 text-weight-bold text-primary">Ahorcado</div>
              <div class="row items-center q-mt-xs">
                <q-badge 
                  :color="nivel.color" 
                  class="q-px-sm"
                  :label="nivel.nombre"
                />
                <q-chip 
                  size="sm"
                  class="q-ml-sm bg-blue-1"
                  icon="abc"
                  :label="`${palabra.length} letras`"
                />
              </div>
            </div>
          </div>
          
          <div class="stats">
            <q-chip size="sm" class="stat-chip">
              <q-icon name="timer" size="xs" />
              <span class="q-ml-xs">{{ tiempoFormateado }}</span>
            </q-chip>
            <q-chip 
              size="sm" 
              class="stat-chip"
              :color="vidasColor"
              text-color="white"
            >
              <q-icon name="favorite" size="xs" />
              <span class="q-ml-xs">{{ intentosMaximos - errores }}</span>
            </q-chip>
          </div>
        </div>
        
        <!-- Barra de progreso y pista -->
        <div class="q-mt-md">
          <div class="row items-center justify-between q-mb-xs">
            <span class="text-caption text-grey">Progreso</span>
            <span class="text-caption text-weight-bold">{{ porcentajeAdivinado }}%</span>
          </div>
          <q-linear-progress
            :value="porcentajeAdivinado / 100"
            :color="colorProgreso"
            size="8px"
            class="q-mb-sm"
          />
          
          <div class="pista-card">
            <div class="row items-center">
              <q-icon name="lightbulb" size="sm" color="amber-7" class="q-mr-sm" />
              <div class="column">
                <div class="text-caption text-grey">Pista</div>
                <div class="text-body2">
                  <template v-if="pistaVisible">
                    {{ pistaActual }}
                  </template>
                  <template v-else>
                    <span class="text-grey-6">
                      {{ pistaDisponible ? 'Haz clic para ver la pista' : 'Pista ya usada' }}
                    </span>
                  </template>
                </div>
              </div>
            </div>
            <q-btn 
              :icon="pistaVisible ? 'visibility' : 'visibility_off'" 
              flat 
              round 
              dense 
              :color="pistaDisponible ? 'amber' : 'grey'"
              :disable="!pistaDisponible || juegoTerminado"
              @click="mostrarPista"
            >
              <q-tooltip>{{ pistaDisponible ? 'Ver pista' : 'Pista usada' }}</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>

      <!-- Contenido principal en grid -->
      <div class="game-content">
        <!-- Muñeco del ahorcado mejorado -->
        <div class="hangman-section">
          <div class="hangman-container">
            <div class="hangman-frame">
              <!-- Estructura del patíbulo -->
              <div class="gallows">
                <div class="base" :class="{ 'built': errores >= 1 }"></div>
                <div class="vertical" :class="{ 'built': errores >= 2 }"></div>
                <div class="horizontal" :class="{ 'built': errores >= 3 }"></div>
                <div class="support" :class="{ 'built': errores >= 4 }"></div>
                <div class="rope" :class="{ 'built': errores >= 5 }"></div>
              </div>
              
              <!-- Personaje con animaciones -->
              <div class="character">
                <!-- Cabeza con expresiones -->
                <div v-if="errores >= 6" class="head" :class="{ 'shake': errores >= 9 }">
                  <div class="face" :class="expresionActual">
                    <div class="eyes">
                      <div class="eye left"></div>
                      <div class="eye right"></div>
                    </div>
                    <div class="mouth"></div>
                  </div>
                </div>
                
                <!-- Cuerpo y extremidades -->
                <div v-if="errores >= 7" class="body"></div>
                <div v-if="errores >= 8" class="arm left"></div>
                <div v-if="errores >= 9" class="arm right"></div>
                <div v-if="errores >= 10" class="leg left"></div>
                <div v-if="errores >= 11" class="leg right"></div>
                
                <!-- Efecto de victoria -->
                <div v-if="resultado.ganado" class="victory">
                  <q-icon name="celebration" size="xl" color="yellow" />
                </div>
              </div>
            </div>
            
            <!-- Contador de errores visual -->
            <div class="errors-display q-mt-lg">
              <div class="text-center q-mb-xs">
                <span class="text-caption text-grey">Errores</span>
              </div>
              <div class="errors-dots">
                <q-icon
                  v-for="i in intentosMaximos"
                  :key="i"
                  :name="i <= errores ? 'radio_button_unchecked' : 'radio_button_checked'"
                  size="sm"
                  :color="i <= errores ? 'negative' : 'positive'"
                  class="q-mx-xs"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Palabra y teclado -->
        <div class="game-section">
          <!-- Palabra a adivinar con animación -->
          <div class="word-display q-pa-lg">
            <div class="word-container">
              <div 
                v-for="(letter, i) in palabra" 
                :key="i" 
                class="letter-container"
                @click="animarLetra(i)"
              >
                <div 
                  class="letter-box"
                  :class="{ 'revealed': letrasAdivinadas.includes(letter.toUpperCase()) }"
                >
                  <transition name="flip">
                    <div 
                      v-if="letrasAdivinadas.includes(letter.toUpperCase())" 
                      class="letter"
                      :style="{ animationDelay: `${i * 100}ms` }"
                    >
                      {{ letter.toUpperCase() }}
                    </div>
                  </transition>
                </div>
                <div class="letter-underline"></div>
                <div class="letter-index">{{ i + 1 }}</div>
              </div>
            </div>
          </div>

          <!-- Teclado mejorado -->
          <div class="keyboard-section">
            <div class="keyboard-container q-pa-md">
              <div 
                v-for="(row, idx) in keyboardRows" 
                :key="idx" 
                class="keyboard-row"
              >
                <q-btn
                  v-for="key in row"
                  :key="key"
                  :label="key"
                  unelevated
                  class="key-btn"
                  :class="{
                    'correct': letrasAdivinadas.includes(key),
                    'incorrect': letrasIncorrectas.includes(key),
                    'disabled': letraUsada(key) || juegoTerminado
                  }"
                  @click="probarLetra(key)"
                >
                  <q-tooltip v-if="letraUsada(key)">
                    {{ letrasAdivinadas.includes(key) ? 'Correcta' : 'Incorrecta' }}
                  </q-tooltip>
                </q-btn>
              </div>
              
              <!-- Teclas especiales - SOLO REINICIAR -->
              <div class="special-keys q-mt-sm">
                <q-btn
                  icon="replay"
                  label="Reiniciar"
                  color="primary"
                  dense
                  @click="reiniciarJuego"
                  class="q-mr-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Letras incorrectas con animación -->
      <div v-if="letrasIncorrectas.length" class="incorrect-letters">
        <div class="text-center q-pa-sm">
          <q-chip color="red-1" text-color="negative" class="q-px-md">
            <q-icon name="close" size="sm" />
            <span class="q-ml-sm">Letras incorrectas:</span>
            <span class="q-ml-sm text-weight-bold">{{ letrasIncorrectas.join(', ') }}</span>
          </q-chip>
        </div>
      </div>

      <!-- Modal de resultado mejorado -->
      <q-dialog v-model="showResult" persistent>
        <q-card class="result-card">
          <q-card-section 
            class="result-header"
            :class="resultado.ganado ? 'victory-bg' : 'defeat-bg'"
          >
            <div class="text-center">
              <q-icon
                :name="resultado.ganado ? 'emoji_events' : 'sentiment_very_dissatisfied'"
                size="xl"
                color="white"
              />
              <div class="text-h5 text-white q-mt-md">
                {{ resultado.ganado ? '¡Victoria!' : '¡Inténtalo de nuevo!' }}
              </div>
            </div>
          </q-card-section>
          
          <q-card-section class="q-pt-lg">
            <div class="text-center q-mb-lg">
              <div class="text-h4 text-weight-bold q-mb-xs">{{ palabra }}</div>
              <div class="text-caption text-grey">{{ pistaActual }}</div>
            </div>
            
            <!-- Estadísticas -->
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-label">Tiempo</div>
                <div class="stat-value">{{ tiempoFormateado }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Errores</div>
                <div class="stat-value">{{ errores }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Pista usada</div>
                <div class="stat-value">{{ !pistaDisponible ? 'Sí' : 'No' }}</div>
              </div>
              <div class="stat-item highlight">
                <div class="stat-label">Puntos</div>
                <div class="stat-value text-weight-bold">{{ resultado.puntos }}</div>
              </div>
              <q-btn
  v-if="showResult"
  label="🏆 Ver Ranking"
  color="primary"
  class="q-mt-md full-width"
  icon="leaderboard"
  @click="irARanking"
/>

            </div>
            
            <!-- Botones de acción -->
            <div class="row q-gutter-sm q-mt-xl">
              <q-btn
                color="primary"
                label="Jugar otra vez"
                icon="replay"
                @click="reiniciarJuego"
                v-close-popup
                class="col"
              />
              <q-btn
                color="grey"
                label="Cambiar nivel"
                icon="swap_vert"
                @click="cambiarNivel"
                outline
                class="col"
              />
              <q-btn
                color="positive"
                label="Compartir"
                icon="share"
                @click="compartirResultado"
                v-if="resultado.ganado"
                class="col"
              />
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

  

const router = useRouter()
const $q = useQuasar()

const irARanking = () => {
  router.push('/ranking')
}


// ========================
// ✅ NIVEL SELECCIONADO
// ========================
const nivel = ref(JSON.parse(localStorage.getItem('nivelSeleccionado')) || { 
  nombre: 'Facil', 
  color: 'green',
  intentos: 11 
})

const intentosMaximos = 11
const palabra = ref('')
const pistaActual = ref('')
const pistaVisible = ref(false)
const pistaDisponible = ref(true)
const categoriaActual = ref('')
const letrasAdivinadas = ref([])
const letrasIncorrectas = ref([])
const juegoTerminado = ref(false)
const showResult = ref(false)
const tiempoTranscurrido = ref(0)

// ========================
// ✅ TECLADO
// ========================
const keyboardRows = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L','Ñ'],
  ['Z','X','C','V','B','N','M']
]

// ========================
// ✅ BASE DE DATOS POR NIVEL Y CATEGORÍA
// ========================
const palabrasDB = {
  facil: [
    // ✅ FRUTAS (7)
    { palabra: 'MANZANA', pista: 'Es roja o verde', categoria: 'Frutas' },
    { palabra: 'PERA', pista: 'Es verde', categoria: 'Frutas' },
    { palabra: 'UVA', pista: 'Es pequeña', categoria: 'Frutas' },
    { palabra: 'KIWI', pista: 'Es café por fuera', categoria: 'Frutas' },
    { palabra: 'MANGO', pista: 'Es tropical', categoria: 'Frutas' },
    { palabra: 'PIÑA', pista: 'Tiene corona', categoria: 'Frutas' },
    { palabra: 'MELON', pista: 'Es grande y dulce', categoria: 'Frutas' },

    // ✅ ANIMALES (7)
    { palabra: 'PERRO', pista: 'Mejor amigo del hombre', categoria: 'Animales' },
    { palabra: 'GATO', pista: 'Caza ratones', categoria: 'Animales' },
    { palabra: 'VACA', pista: 'Da leche', categoria: 'Animales' },
    { palabra: 'LEON', pista: 'Rey de la selva', categoria: 'Animales' },
    { palabra: 'OSO', pista: 'Animal grande', categoria: 'Animales' },
    { palabra: 'LOBO', pista: 'Aúlla en la noche', categoria: 'Animales' },
    { palabra: 'RANA', pista: 'Salta y nada', categoria: 'Animales' },

    // ✅ PAÍSES (7)
    { palabra: 'PERU', pista: 'País de Machu Picchu', categoria: 'Países' },
    { palabra: 'CHILE', pista: 'País largo', categoria: 'Países' },
    { palabra: 'BRASIL', pista: 'País del carnaval', categoria: 'Países' },
    { palabra: 'MEXICO', pista: 'País del mariachi', categoria: 'Países' },
    { palabra: 'CHINA', pista: 'País más poblado', categoria: 'Países' },
    { palabra: 'INDIA', pista: 'País muy poblado', categoria: 'Países' },
    { palabra: 'JAPON', pista: 'País del anime', categoria: 'Países' },

    // ✅ DEPORTES (7)
    { palabra: 'FUTBOL', pista: 'Se juega con los pies', categoria: 'Deportes' },
    { palabra: 'TENIS', pista: 'Se juega con raqueta', categoria: 'Deportes' },
    { palabra: 'BOXEO', pista: 'Sport de golpes', categoria: 'Deportes' },
    { palabra: 'NATACION', pista: 'Se practica en el agua', categoria: 'Deportes' },
    { palabra: 'CICLISMO', pista: 'Se usa bicicleta', categoria: 'Deportes' },
    { palabra: 'VOLEIBOL', pista: 'Se juega con red', categoria: 'Deportes' },
    { palabra: 'ATLETISMO', pista: 'Carreras y saltos', categoria: 'Deportes' },

    // ✅ PELÍCULAS (7)
    { palabra: 'AVATAR', pista: 'Personas azules', categoria: 'Películas' },
    { palabra: 'TITANIC', pista: 'Barco famoso', categoria: 'Películas' },
    { palabra: 'ROCKY', pista: 'Película de boxeo', categoria: 'Películas' },
    { palabra: 'COCO', pista: 'Película del Día de Muertos', categoria: 'Películas' },
    { palabra: 'SHREK', pista: 'Un ogro verde', categoria: 'Películas' },
    { palabra: 'JAWS', pista: 'Tiburón gigante', categoria: 'Películas' },
    { palabra: 'UP', pista: 'Casa con globos', categoria: 'Películas' },

    // ✅ CIENCIA (7)
    { palabra: 'ATOMO', pista: 'Parte de la materia', categoria: 'Ciencia' },
    { palabra: 'CELULA', pista: 'Unidad de la vida', categoria: 'Ciencia' },
    { palabra: 'ENERGIA', pista: 'Capacidad de trabajo', categoria: 'Ciencia' },
    { palabra: 'GRAVEDAD', pista: 'Fuerza de atracción', categoria: 'Ciencia' },
    { palabra: 'PLANETA', pista: 'Gira alrededor del sol', categoria: 'Ciencia' },
    { palabra: 'OXIGENO', pista: 'Gas para respirar', categoria: 'Ciencia' },
    { palabra: 'SOL', pista: 'Estrella del sistema', categoria: 'Ciencia' }
  ],

  medio: [
    // ✅ FRUTAS (7)
    { palabra: 'FRAMBUESA', pista: 'Fruta pequeña roja', categoria: 'Frutas' },
    { palabra: 'GUAYABA', pista: 'Fruta tropical', categoria: 'Frutas' },
    { palabra: 'CEREZA', pista: 'Es pequeña y roja', categoria: 'Frutas' },
    { palabra: 'PAPAYA', pista: 'Fruta anaranjada', categoria: 'Frutas' },
    { palabra: 'MANDARINA', pista: 'Fruta cítrica', categoria: 'Frutas' },
    { palabra: 'GRANADA', pista: 'Tiene muchas semillas', categoria: 'Frutas' },
    { palabra: 'MARACUYA', pista: 'Fruta ácida', categoria: 'Frutas' },

    // ✅ ANIMALES (7)
    { palabra: 'ELEFANTE', pista: 'Tiene trompa', categoria: 'Animales' },
    { palabra: 'JIRAFA', pista: 'Cuello largo', categoria: 'Animales' },
    { palabra: 'COCODRILO', pista: 'Reptil grande', categoria: 'Animales' },
    { palabra: 'PANTERA', pista: 'Felino negro', categoria: 'Animales' },
    { palabra: 'DELFIN', pista: 'Nada en el mar', categoria: 'Animales' },
    { palabra: 'ARDILLA', pista: 'Guarda nueces', categoria: 'Animales' },
    { palabra: 'PINGUINO', pista: 'Vive en el frío', categoria: 'Animales' },

    // ✅ PAÍSES (7)
    { palabra: 'COLOMBIA', pista: 'País del café', categoria: 'Países' },
    { palabra: 'ARGENTINA', pista: 'País del tango', categoria: 'Países' },
    { palabra: 'ALEMANIA', pista: 'País europeo', categoria: 'Países' },
    { palabra: 'FRANCIA', pista: 'País de la torre', categoria: 'Países' },
    { palabra: 'ITALIA', pista: 'País de la pizza', categoria: 'Países' },
    { palabra: 'CANADA', pista: 'País del norte', categoria: 'Países' },
    { palabra: 'ESPAÑA', pista: 'País europeo', categoria: 'Países' },

    // ✅ DEPORTES (7)
    { palabra: 'BALONCESTO', pista: 'Deporte con canasta', categoria: 'Deportes' },
    { palabra: 'ESGRIMA', pista: 'Espadas', categoria: 'Deportes' },
    { palabra: 'SURF', pista: 'Olas', categoria: 'Deportes' },
    { palabra: 'KARATE', pista: 'Arte marcial', categoria: 'Deportes' },
    { palabra: 'RUGBY', pista: 'Parecido al fútbol', categoria: 'Deportes' },
    { palabra: 'CROSSFIT', pista: 'Entrenamiento intenso', categoria: 'Deportes' },
    { palabra: 'BOWLING', pista: 'Derribar pinos', categoria: 'Deportes' },

    // ✅ PELÍCULAS (7)
    { palabra: 'GLADIADOR', pista: 'Película de romanos', categoria: 'Películas' },
    { palabra: 'INCEPTION', pista: 'Sueños dentro de sueños', categoria: 'Películas' },
    { palabra: 'MATRIX', pista: 'Realidad falsa', categoria: 'Películas' },
    { palabra: 'INTERESTELAR', pista: 'Viaje espacial', categoria: 'Películas' },
    { palabra: 'TOYSTORY', pista: 'Juguetes vivos', categoria: 'Películas' },
    { palabra: 'JOKER', pista: 'Villano famoso', categoria: 'Películas' },
    { palabra: 'FROZEN', pista: 'Reina de hielo', categoria: 'Películas' },

    // ✅ CIENCIA (7)
    { palabra: 'NEUTRON', pista: 'Partícula sin carga', categoria: 'Ciencia' },
    { palabra: 'PROTON', pista: 'Carga positiva', categoria: 'Ciencia' },
    { palabra: 'ELECTRON', pista: 'Carga negativa', categoria: 'Ciencia' },
    { palabra: 'TEORIA', pista: 'Explicación científica', categoria: 'Ciencia' },
    { palabra: 'MOLECULA', pista: 'Unión de átomos', categoria: 'Ciencia' },
    { palabra: 'ECOSISTEMA', pista: 'Sistema natural', categoria: 'Ciencia' },
    { palabra: 'METODO', pista: 'Proceso científico', categoria: 'Ciencia' }
  ],

  dificil: [
    // ✅ FRUTAS (7)
    { palabra: 'CARAMBOLA', pista: 'Fruta en forma de estrella', categoria: 'Frutas' },
    { palabra: 'GUANABANA', pista: 'Fruta grande tropical', categoria: 'Frutas' },
    { palabra: 'TAMARINDO', pista: 'Fruta ácida', categoria: 'Frutas' },
    { palabra: 'ARANDANO', pista: 'Fruta pequeña azul', categoria: 'Frutas' },
    { palabra: 'CHIRIMOYA', pista: 'Fruta exótica', categoria: 'Frutas' },
    { palabra: 'NISPERO', pista: 'Fruta naranja', categoria: 'Frutas' },
    { palabra: 'ZARZAMORA', pista: 'Fruta morada', categoria: 'Frutas' },

    // ✅ ANIMALES (7)
    { palabra: 'ORNITORRINCO', pista: 'Animal muy extraño', categoria: 'Animales' },
    { palabra: 'MURCIELAGO', pista: 'Vuela de noche', categoria: 'Animales' },
    { palabra: 'HIPOPOTAMO', pista: 'Animal gigante', categoria: 'Animales' },
    { palabra: 'RINOCERONTE', pista: 'Tiene cuerno', categoria: 'Animales' },
    { palabra: 'MEDUSA', pista: 'Animal marino', categoria: 'Animales' },
    { palabra: 'CAMARON', pista: 'Animal pequeño', categoria: 'Animales' },
    { palabra: 'TARANTULA', pista: 'Araña grande', categoria: 'Animales' },

    // ✅ PAÍSES (7)
    { palabra: 'KAZAJISTAN', pista: 'País de Asia', categoria: 'Países' },
    { palabra: 'UZBEKISTAN', pista: 'País asiático', categoria: 'Países' },
    { palabra: 'AZERBAIYAN', pista: 'País del Cáucaso', categoria: 'Países' },
    { palabra: 'LUXEMBURGO', pista: 'País pequeño', categoria: 'Países' },
    { palabra: 'MONTENEGRO', pista: 'País de Europa', categoria: 'Países' },
    { palabra: 'MADAGASCAR', pista: 'Isla africana', categoria: 'Países' },
    { palabra: 'ESLOVENIA', pista: 'País europeo', categoria: 'Países' },

    // ✅ DEPORTES (7)
    { palabra: 'PARACAIDISMO', pista: 'Deporte extremo', categoria: 'Deportes' },
    { palabra: 'ALPINISMO', pista: 'Escalar montañas', categoria: 'Deportes' },
    { palabra: 'HEPTATLON', pista: 'Deporte múltiple', categoria: 'Deportes' },
    { palabra: 'TRIATLON', pista: 'Tres disciplinas', categoria: 'Deportes' },
    { palabra: 'ESPELEOLOGIA', pista: 'Explorar cuevas', categoria: 'Deportes' },
    { palabra: 'WINDSURF', pista: 'Tabla con vela', categoria: 'Deportes' },
    { palabra: 'SNOWBOARD', pista: 'Tabla en nieve', categoria: 'Deportes' },

    // ✅ PELÍCULAS (7)
    { palabra: 'INCEPTION', pista: 'Sueños', categoria: 'Películas' },
    { palabra: 'INTERESTELAR', pista: 'Espacio', categoria: 'Películas' },
    { palabra: 'OPPENHEIMER', pista: 'Bomba atómica', categoria: 'Películas' },
    { palabra: 'AVENGERS', pista: 'Superhéroes', categoria: 'Películas' },
    { palabra: 'PARASITE', pista: 'Película coreana', categoria: 'Películas' },
    { palabra: 'WHIPLASH', pista: 'Baterista', categoria: 'Películas' },
    { palabra: 'DUNKERQUE', pista: 'Guerra', categoria: 'Películas' },

    // ✅ CIENCIA (7)
    { palabra: 'ELECTROMAGNETISMO', pista: 'Campo eléctrico y magnético', categoria: 'Ciencia' },
    { palabra: 'RELATIVIDAD', pista: 'Teoría de Einstein', categoria: 'Ciencia' },
    { palabra: 'FOTOSINTESIS', pista: 'Proceso de las plantas', categoria: 'Ciencia' },
    { palabra: 'BIOLUMINISCENCIA', pista: 'Luz natural', categoria: 'Ciencia' },
    { palabra: 'NANOTECNOLOGIA', pista: 'Tecnología pequeña', categoria: 'Ciencia' },
    { palabra: 'ASTROFISICA', pista: 'Física del espacio', categoria: 'Ciencia' },
    { palabra: 'GENETICA', pista: 'Herencia', categoria: 'Ciencia' }
  ]
}

// ========================
// ✅ COMPUTED
// ========================
const errores = computed(() => letrasIncorrectas.value.length)

const tiempoFormateado = computed(() => {
  const mins = Math.floor(tiempoTranscurrido.value / 60)
  const secs = tiempoTranscurrido.value % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
})

const resultado = computed(() => {
  const ganado = palabra.value.split('').every(l => 
    letrasAdivinadas.value.includes(l.toUpperCase())
  )
  return { ganado, puntos: ganado ? 100 : 0 }
})

const porcentajeAdivinado = computed(() => {
  const letrasUnicas = [...new Set(palabra.value.toUpperCase())]
  const adivinadas = letrasUnicas.filter(l => letrasAdivinadas.value.includes(l)).length
  return Math.round((adivinadas / letrasUnicas.length) * 100)
})

const colorProgreso = computed(() => {
  const pct = porcentajeAdivinado.value
  if (pct >= 75) return 'positive'
  if (pct >= 50) return 'warning'
  if (pct >= 25) return 'orange'
  return 'negative'
})

const vidasColor = computed(() => {
  const vidasRestantes = intentosMaximos - errores.value
  if (vidasRestantes >= 8) return 'positive'
  if (vidasRestantes >= 5) return 'warning'
  if (vidasRestantes >= 3) return 'orange'
  return 'negative'
})

const expresionActual = computed(() => {
  const vidas = intentosMaximos - errores.value
  if (vidas >= 8) return 'neutral'
  if (vidas >= 5) return 'worried'
  return 'scared'
})

// ========================
// ✅ SELECCIONAR PALABRA CORRECTA
// ========================
const seleccionarPalabra = () => {
  const dificultad = nivel.value.nombre.toLowerCase()
  const palabras = palabrasDB[dificultad] || palabrasDB.facil

  // Leer raw y determinar el nombre
  const raw = localStorage.getItem('categoriaSeleccionada')
  let categoriaElegida = null

  if (!raw) {
    categoriaElegida = null
  } else {
    try {
      const parsed = JSON.parse(raw)
      // si guardaron un objeto, usar su nombre; si no, usar raw
      categoriaElegida = (parsed && parsed.nombre) ? parsed.nombre : String(raw)
    } catch (err) {
      // raw no era JSON, usar valor tal cual
      categoriaElegida = String(raw)
    }
  }

  // Normalizar a minúsculas para comparar sin problemas de mayúsculas
  const catNormalized = categoriaElegida ? categoriaElegida.trim().toLowerCase() : null

  // Filtrar sólo palabras que pertenezcan a esa categoría (si existe)
  const palabrasFiltradas = catNormalized
    ? palabras.filter(p => String(p.categoria).trim().toLowerCase() === catNormalized )
    : []

  const listaFinal = palabrasFiltradas.length > 0 ? palabrasFiltradas : palabras

  const seleccion = listaFinal[Math.floor(Math.random() * listaFinal.length)]

  palabra.value = seleccion.palabra
  pistaActual.value = seleccion.pista
  categoriaActual.value = seleccion.categoria
  
  // Resetear el estado de la pista
  pistaVisible.value = false
  pistaDisponible.value = true
}

// ========================
// ✅ MOSTRAR PISTA
// ========================
const mostrarPista = () => {
  if (!pistaDisponible.value || juegoTerminado.value) return
  
  pistaVisible.value = true
  pistaDisponible.value = false
  
  // La pista se oculta automáticamente después de 5 segundos
  setTimeout(() => {
    if (!juegoTerminado.value && pistaVisible.value) {
      pistaVisible.value = false
    }
  }, 5000)
}

// ========================
// ✅ JUEGO
// ========================
let intervalo = null

const iniciarCronometro = () => {
  intervalo = setInterval(() => tiempoTranscurrido.value++, 1000)
}

const detenerCronometro = () => clearInterval(intervalo)

const letraUsada = (letra) =>
  letrasAdivinadas.value.includes(letra) ||
  letrasIncorrectas.value.includes(letra)

const probarLetra = (letra) => {
  if (letraUsada(letra) || juegoTerminado.value) return

  if (palabra.value.includes(letra)) {
    letrasAdivinadas.value.push(letra)

    if (palabra.value.split('').every(l => letrasAdivinadas.value.includes(l))) {
      terminarJuego(true)
    }
  } else {
    letrasIncorrectas.value.push(letra)

    if (letrasIncorrectas.value.length >= intentosMaximos) {
      terminarJuego(false)
    }
  }
}

const guardarEnRanking = (puntos, tiempoTotal) => {
  const nombre = localStorage.getItem('nombreUsuario')

  if (!nombre) {
    console.error('❌ No hay nombre en sesión')
    return
  }

  let ranking = JSON.parse(localStorage.getItem('rankingAhorcado')) || []

  const jugadorExistente = ranking.find(j => j.nombre === nombre)

  if (jugadorExistente) {
    jugadorExistente.puntos += puntos
    jugadorExistente.tiempoTotal += tiempoTotal
    jugadorExistente.partidas += 1
  } else {
    ranking.push({
      nombre,
      puntos: puntos,
      tiempoTotal: tiempoTotal,
      partidas: 1
    })
  }

  // ✅ ORDENAMOS
  ranking.sort((a, b) => b.puntos - a.puntos)

  localStorage.setItem('rankingAhorcado', JSON.stringify(ranking))
}

// ========================
// ✅ TERMINAR JUEGO + HISTORIAL
// ========================
const terminarJuego = (ganado) => {
  juegoTerminado.value = true
  detenerCronometro()

  // ✅ CALCULAR PUNTOS REALES
  const puntos = ganado ? 100 : 0
  const tiempo = tiempoTranscurrido.value

  // ✅ GUARDAR EN RANKING (ESTO ERA LO QUE FALTABA)
  guardarEnRanking(puntos, tiempo)

  // ✅ HISTORIAL
  const historial = JSON.parse(localStorage.getItem('historialAhorcado') || '[]')

  historial.unshift({
    palabra: palabra.value,
    categoria: categoriaActual.value,
    nivel: nivel.value.nombre,
    tiempo: tiempo,
    errores: errores.value,
    pistaUsada: !pistaDisponible.value,
    ganado
  })

  localStorage.setItem('historialAhorcado', JSON.stringify(historial.slice(0, 10)))

  showResult.value = true
}

// ========================
// ✅ REINICIAR
// ========================
const reiniciarJuego = () => {
  letrasAdivinadas.value = []
  letrasIncorrectas.value = []
  pistaVisible.value = false
  pistaDisponible.value = true
  juegoTerminado.value = false
  tiempoTranscurrido.value = 0
  showResult.value = false

  seleccionarPalabra()
  iniciarCronometro()
}

// ========================
// ✅ SALIR
// ========================
const confirmarSalida = () => {
  router.push('/nivel')
}

const cambiarNivel = () => {
  router.push('/nivel')
}

const animarLetra = (index) => {
  // Animación opcional al hacer clic en una letra
  console.log('Letra clickeada:', index)
}

const compartirResultado = () => {
  if (navigator.share) {
    navigator.share({
      title: 'Resultado del Ahorcado',
      text: `¡Adiviné la palabra "${palabra.value}" en ${tiempoFormateado.value}!`,
      url: window.location.href
    })
  } else {
    $q.notify({
      message: '¡Resultado copiado al portapapeles!',
      color: 'positive'
    })
  }
}

// ========================
// ✅ INICIO
// ========================
onMounted(() => {
  seleccionarPalabra()
  iniciarCronometro()
})

onUnmounted(() => detenerCronometro())
</script>


<style scoped lang="scss">
.game-container {
  max-width: 1000px;
  width: 100%;
  padding: 20px;
}

.game-header {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  margin-bottom: 24px;
}

.stats {
  display: flex;
  gap: 12px;
}

.stat-chip {
  border-radius: 12px;
  padding: 6px 12px;
}

.pista-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
  padding: 12px 16px;
  border-radius: 12px;
  border-left: 4px solid #ffb300;
}

.game-content {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 24px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.hangman-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.hangman-container {
  position: relative;
  height: 320px;
}

.hangman-frame {
  position: relative;
  width: 100%;
  height: 240px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px dashed #e0e0e0;
  overflow: hidden;
}

.gallows {
  position: absolute;
  width: 100%;
  height: 100%;
  
  div {
    background: #795548;
    position: absolute;
    transition: all 0.3s ease;
    opacity: 0.3;
    
    &.built {
      opacity: 1;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
  }
  
  .base {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 8px;
    border-radius: 4px;
  }
  
  .vertical {
    bottom: 8px;
    left: 50%;
    width: 6px;
    height: 180px;
    margin-left: -60px;
  }
  
  .horizontal {
    top: 20px;
    left: 50%;
    width: 100px;
    height: 6px;
    margin-left: -60px;
  }
  
  .support {
    top: 26px;
    right: calc(50% - 60px);
    width: 4px;
    height: 20px;
  }
  
  .rope {
    top: 46px;
    right: calc(50% - 62px);
    width: 2px;
    height: 40px;
    background: #8d6e63;
  }
}

.character {
  position: absolute;
  top: 86px;
  right: calc(50% - 75px);
  
  div {
    position: absolute;
    transition: all 0.3s ease;
  }
  
  .head {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #ffcc80 0%, #ffb74d 100%);
    border-radius: 50%;
    border: 3px solid #5d4037;
    
    &.shake {
      animation: shake 0.5s ease infinite;
    }
  }
  
  .face {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 20px;
    height: 20px;
    
    &.neutral .mouth {
      width: 12px;
      height: 2px;
      background: #5d4037;
      top: 12px;
      left: 4px;
      border-radius: 1px;
    }
    
    &.worried .mouth {
      width: 12px;
      height: 6px;
      border: 2px solid #5d4037;
      border-top: none;
      border-radius: 0 0 10px 10px;
      top: 10px;
      left: 4px;
      background: none;
    }
    
    &.scared .mouth {
      width: 14px;
      height: 8px;
      border: 2px solid #5d4037;
      border-top: none;
      border-radius: 0 0 12px 12px;
      top: 9px;
      left: 3px;
      background: none;
    }
  }
  
  .eyes {
    position: absolute;
    width: 100%;
    
    .eye {
      width: 6px;
      height: 6px;
      background: #5d4037;
      border-radius: 50%;
      position: absolute;
      
      &.left { left: 2px; top: 4px; }
      &.right { right: 2px; top: 4px; }
    }
  }
  
  .body {
    top: 46px;
    left: 18px;
    width: 4px;
    height: 70px;
    background: linear-gradient(to bottom, #2196F3, #1976D2);
    border-radius: 2px;
  }
  
  .arm, .leg {
    width: 4px;
    height: 40px;
    background: linear-gradient(to bottom, #2196F3, #1976D2);
    border-radius: 2px;
  }
  
  .arm.left {
    top: 50px;
    left: 8px;
    transform: rotate(45deg);
  }
  
  .arm.right {
    top: 50px;
    left: 28px;
    transform: rotate(-45deg);
  }
  
  .leg.left {
    top: 110px;
    left: 8px;
    transform: rotate(45deg);
  }
  
  .leg.right {
    top: 110px;
    left: 28px;
    transform: rotate(-45deg);
  }
  
  .victory {
    position: absolute;
    top: -20px;
    left: -20px;
    animation: celebrate 2s ease infinite;
  }
}

.errors-display {
  .errors-dots {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
}

.game-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.word-display {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.word-container {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.letter-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
  }
}

.letter-box {
  width: 50px;
  height: 60px;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  border: 2px solid #90caf9;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &.revealed {
    background: linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%);
    border-color: #4caf50;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
  }
}

.letter {
  font-size: 32px;
  font-weight: 800;
  color: #1565c0;
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  @keyframes popIn {
    0% { transform: scale(0); }
    70% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
}

.letter-underline {
  width: 40px;
  height: 3px;
  background: linear-gradient(to right, #42a5f5, #1976d2);
  border-radius: 2px;
}

.letter-index {
  font-size: 11px;
  color: #757575;
  margin-top: 4px;
  font-weight: 500;
}

.keyboard-section {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.keyboard-container {
  .keyboard-row {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-bottom: 8px;
  }
  
  .key-btn {
    width: 44px;
    height: 48px;
    min-width: auto;
    font-weight: 700;
    font-size: 18px;
    border-radius: 8px;
    transition: all 0.2s;
    
    &.correct {
      background: linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%);
      color: #2e7d32;
      border: 2px solid #4caf50;
      transform: scale(0.95);
    }
    
    &.incorrect {
      background: linear-gradient(135deg, #ffcdd2 0%, #ef9a9a 100%);
      color: #c62828;
      border: 2px solid #f44336;
      opacity: 0.7;
      transform: scale(0.95);
    }
    
    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    &:not(.disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
  }
  
  .special-keys {
    display: flex;
    justify-content: center;
    gap: 12px;
  }
}

.incorrect-letters {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

// Modal de resultado
.result-card {
  width: 100%;
  max-width: 480px;
  border-radius: 20px;
}

.result-header {
  padding: 40px 20px;
  
  &.victory-bg {
    background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  }
  
  &.defeat-bg {
    background: linear-gradient(135deg, #f44336 0%, #c62828 100%);
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 24px;
  
  .stat-item {
    text-align: center;
    padding: 16px;
    background: #f5f5f5;
    border-radius: 12px;
    
    &.highlight {
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      border: 2px solid #2196f3;
    }
    
    .stat-label {
      font-size: 12px;
      color: #757575;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    
    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: #424242;
    }
  }
}

// Animaciones
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

@keyframes celebrate {
  0%, 100% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.2) rotate(15deg); }
  75% { transform: scale(1.2) rotate(-15deg); }
}

.flip-enter-active {
  animation: flipIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes flipIn {
  0% {
    transform: rotateX(90deg);
    opacity: 0;
  }
  100% {
    transform: rotateX(0deg);
    opacity: 1;
  }
}

// Responsive
@media (max-width: 768px) {
  .game-container {
    padding: 12px;
  }
  
  .letter-box {
    width: 40px;
    height: 50px;
  }
  
  .letter {
    font-size: 26px;
  }
  
  .key-btn {
    width: 36px;
    height: 40px;
    font-size: 16px;
  }
  
  .hangman-container {
    height: 280px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .key-btn {
    width: 32px;
    height: 36px;
    font-size: 14px;
  }
  
  .letter-box {
    width: 35px;
    height: 45px;
  }
  
  .letter {
    font-size: 22px;
  }
}
</style>