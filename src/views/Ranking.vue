<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const ranking = ref([])
const filtroNivel = ref('todos') // Filtro por nivel

onMounted(() => {
  cargarRanking()
})

const cargarRanking = () => {
  // Cargar todos los datos del ranking
  const data = JSON.parse(localStorage.getItem('rankingAhorcado') || '[]')
  
  // Aplanar la estructura para tener cada partida individual
  const partidasIndividuales = []
  
  data.forEach(jugador => {
    // Si el jugador tiene un array de partidas, expandirlo
    if (Array.isArray(jugador.partidas)) {
      jugador.partidas.forEach(partida => {
        partidasIndividuales.push({
          nombre: jugador.nombre || jugador.usuario || jugador.player || jugador.name || 'Sin nombre',
          puntos: partida.puntos || jugador.puntos || 0,
          tiempoTotal: partida.tiempoTotal || jugador.tiempoTotal || 0,
          nivel: partida.nivel || jugador.nivel || 'medio', // Asumir 'medio' si no hay nivel
          fecha: partida.fecha || jugador.fecha || new Date().toLocaleDateString()
        })
      })
    } else {
      // Si es una partida individual, añadirla tal cual
      partidasIndividuales.push({
        nombre: jugador.nombre || jugador.usuario || jugador.player || jugador.name || 'Sin nombre',
        puntos: jugador.puntos || 0,
        tiempoTotal: jugador.tiempoTotal || 0,
        nivel: jugador.nivel || 'medio', // Asumir 'medio' si no hay nivel
        fecha: jugador.fecha || new Date().toLocaleDateString()
      })
    }
  })
  
  // Ordenar por puntos (descendente) y luego por tiempo (ascendente)
  ranking.value = partidasIndividuales.sort((a, b) => {
    if (b.puntos !== a.puntos) {
      return b.puntos - a.puntos
    }
    return a.tiempoTotal - b.tiempoTotal
  })
}

// Filtrar ranking según el nivel seleccionado
const rankingFiltrado = computed(() => {
  if (filtroNivel.value === 'todos') {
    return ranking.value
  }
  
  return ranking.value.filter(partida => 
    partida.nivel.toLowerCase() === filtroNivel.value.toLowerCase()
  )
})

// Añadir posición a cada partida individual (calculada después del filtro)
const rankingConPosicion = computed(() => {
  return rankingFiltrado.value.map((partida, index) => ({
    ...partida,
    posicion: index + 1
  }))
})

// Opciones de filtro por nivel
const opcionesNivel = [
  { label: 'Todos los niveles', value: 'todos' },
  { label: 'Fácil', value: 'facil' },
  { label: 'Medio', value: 'medio' },
  { label: 'Difícil', value: 'dificil' }
]

// Contador de partidas por nivel
const estadisticasNiveles = computed(() => {
  const stats = {
    todos: ranking.value.length,
    facil: 0,
    medio: 0,
    dificil: 0
  }
  
  ranking.value.forEach(partida => {
    const nivel = partida.nivel?.toLowerCase() || 'medio'
    if (stats.hasOwnProperty(nivel)) {
      stats[nivel]++
    } else {
      stats.medio++ // Si es un nivel desconocido, lo contamos como medio
    }
  })
  
  return stats
})

// Función para limpiar filtro
const limpiarFiltro = () => {
  filtroNivel.value = 'todos'
}

// Función para recargar datos
const recargarRanking = () => {
  cargarRanking()
}

// Función para exportar ranking (opcional)
const exportarRanking = () => {
  const datosExportar = rankingConPosicion.value.map(p => ({
    Posición: p.posicion,
    Jugador: p.nombre,
    Puntos: p.puntos,
    Tiempo: `${p.tiempoTotal}s`,
    Nivel: p.nivel.toUpperCase(),
    Fecha: p.fecha
  }))
  
  let csv = 'Posición,Jugador,Puntos,Tiempo,Nivel,Fecha\n'
  datosExportar.forEach(p => {
    csv += `${p.Posición},${p.Jugador},${p.Puntos},${p.Tiempo},${p.Nivel},${p.Fecha}\n`
  })
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ranking_ahorcado_${filtroNivel.value}_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}
</script>

<template>
  <q-page class="ranking-page">

    <!-- HEADER -->
    <div class="ranking-header">
      <q-btn
        icon="arrow_back"
        round
        flat
        color="white"
        @click="router.push('/categoria')"
      />
      <h2>🏆 Ranking por Partida</h2>
      <q-badge color="orange" class="q-ml-md">
        {{ rankingConPosicion.length }} partidas
      </q-badge>
    </div>

    <!-- CARD PRINCIPAL -->
    <q-card class="ranking-card q-pa-lg">

      <!-- FILTROS Y ESTADÍSTICAS -->
      <div class="filtros-container q-mb-lg">
        <div class="row items-center justify-between q-mb-md">
          <div class="text-h6 text-weight-bold">Filtrar por nivel:</div>
          <div>
            <q-btn 
              icon="refresh" 
              round 
              flat 
              color="primary" 
              size="sm"
              @click="recargarRanking"
              title="Recargar ranking"
              class="q-mr-sm"
            />
            <q-btn 
              icon="file_download" 
              round 
              flat 
              color="green" 
              size="sm"
              @click="exportarRanking"
              title="Exportar a CSV"
            />
          </div>
        </div>
        
        <!-- Selector de nivel -->
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-6">
            <q-select
              v-model="filtroNivel"
              :options="opcionesNivel"
              label="Seleccionar nivel"
              filled
              dense
              emit-value
              map-options
              class="q-mb-sm"
            />
          </div>
          
          <!-- Estadísticas -->
          <div class="col-12 col-md-6">
            <div class="text-caption text-grey-7">
              <div v-if="filtroNivel !== 'todos'">
                <q-icon name="filter_alt" size="xs" class="q-mr-xs" />
                Filtrado: <strong>{{ opcionesNivel.find(o => o.value === filtroNivel)?.label }}</strong>
                ({{ rankingConPosicion.length }} de {{ ranking.length }} partidas)
              </div>
              <div v-else>
                <q-icon name="grid_view" size="xs" class="q-mr-xs" />
                Mostrando todas las partidas: <strong>{{ ranking.length }}</strong>
              </div>
            </div>
            
            <q-btn
              v-if="filtroNivel !== 'todos'"
              label="Limpiar filtro"
              flat
              dense
              color="grey"
              @click="limpiarFiltro"
              class="q-mt-xs"
              size="sm"
            />
          </div>
        </div>

        <!-- Chips de estadísticas por nivel -->
        <div class="row q-col-gutter-xs q-mt-sm">
          <div class="col-12">
            <div class="text-caption text-grey-7 q-mb-xs">Partidas por nivel:</div>
          </div>
          <q-chip
            v-for="nivel in ['facil', 'medio', 'dificil']"
            :key="nivel"
            :label="`${nivel.charAt(0).toUpperCase() + nivel.slice(1)}: ${estadisticasNiveles[nivel]}`"
            :color="filtroNivel === nivel ? 'amber' : 'grey-7'"
            text-color="white"
            clickable
            @click="filtroNivel = nivel"
            size="sm"
            class="q-mr-xs"
            :icon="filtroNivel === nivel ? 'check' : undefined"
          />
          <q-chip
            label="Todos"
            :color="filtroNivel === 'todos' ? 'primary' : 'grey-7'"
            text-color="white"
            clickable
            @click="filtroNivel = 'todos'"
            size="sm"
            :icon="filtroNivel === 'todos' ? 'check' : undefined"
          />
        </div>

        <!-- Barras de progreso por nivel -->
        <div v-if="ranking.length > 0" class="q-mt-md">
          <div class="text-caption text-grey-7 q-mb-xs">Distribución por nivel:</div>
          <div class="row q-col-gutter-xs">
            <div class="col-4" v-for="nivel in ['facil', 'medio', 'dificil']" :key="nivel">
              <div class="nivel-bar-container">
                <div class="text-center text-caption">
                  {{ nivel.toUpperCase() }}
                </div>
                <div class="nivel-bar-bg">
                  <div 
                    class="nivel-bar-fill"
                    :class="`nivel-${nivel}`"
                    :style="{ width: `${(estadisticasNiveles[nivel] / ranking.length) * 100}%` }"
                  ></div>
                </div>
                <div class="text-center text-caption text-weight-bold">
                  {{ estadisticasNiveles[nivel] }} ({{ Math.round((estadisticasNiveles[nivel] / ranking.length) * 100) }}%)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TABLA -->
      <q-table
        :rows="rankingConPosicion"
        row-key="posicion"
        flat
        bordered
        :columns="[
          { name: 'posicion', label: '#', field: 'posicion', align: 'center', sortable: true },
          { name: 'nombre', label: 'Jugador', field: 'nombre', align: 'left', sortable: true },
          { name: 'puntos', label: 'Puntos', field: 'puntos', align: 'center', sortable: true },
          { name: 'tiempoTotal', label: 'Tiempo (s)', field: 'tiempoTotal', align: 'center', sortable: true },
          { name: 'nivel', label: 'Nivel', field: 'nivel', align: 'center', sortable: true },
          { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'center', sortable: true }
        ]"
        :pagination="{ rowsPerPage: 10 }"
      >

        <!-- 🥇🥈🥉 MEDALLAS -->
        <template v-slot:body-cell-posicion="props">
          <q-td :props="props">
            <q-badge
              :color="
                props.row.posicion === 1 ? 'amber' :
                props.row.posicion === 2 ? 'grey-5' :
                props.row.posicion === 3 ? 'brown' : 'primary'
              "
              class="text-bold"
            >
              <template v-if="props.row.posicion === 1">🥇</template>
              <template v-else-if="props.row.posicion === 2">🥈</template>
              <template v-else-if="props.row.posicion === 3">🥉</template>
              <template v-else>{{ props.row.posicion }}</template>
            </q-badge>
          </q-td>
        </template>

        <!-- ✅ RESALTAR TOP 3 Y COLOR POR NIVEL -->
        <template v-slot:body="props">
          <q-tr
            :props="props"
            :class="{
              'gold': props.row.posicion === 1,
              'silver': props.row.posicion === 2,
              'bronze': props.row.posicion === 3,
              'fila-facil': props.row.nivel?.toLowerCase() === 'facil',
              'fila-medio': props.row.nivel?.toLowerCase() === 'medio',
              'fila-dificil': props.row.nivel?.toLowerCase() === 'dificil'
            }"
          >
            <q-td key="posicion">
              <q-badge
                :color="
                  props.row.posicion === 1 ? 'amber' :
                  props.row.posicion === 2 ? 'grey-5' :
                  props.row.posicion === 3 ? 'brown' : 'primary'
                "
                class="text-bold"
              >
                <template v-if="props.row.posicion === 1">🥇</template>
                <template v-else-if="props.row.posicion === 2">🥈</template>
                <template v-else-if="props.row.posicion === 3">🥉</template>
                <template v-else>{{ props.row.posicion }}</template>
              </q-badge>
            </q-td>
            <q-td key="nombre" class="text-bold">{{ props.row.nombre }}</q-td>
            <q-td key="puntos" class="text-bold">{{ props.row.puntos }}</q-td>
            <q-td key="tiempoTotal">{{ props.row.tiempoTotal }}s</q-td>
            <q-td key="nivel">
              <q-badge 
                :color="{
                  'facil': 'green',
                  'medio': 'blue',
                  'dificil': 'red'
                }[props.row.nivel?.toLowerCase()] || 'grey'"
                class="text-bold"
              >
                {{ props.row.nivel?.toUpperCase() || 'MEDIO' }}
              </q-badge>
            </q-td>
            <q-td key="fecha">{{ props.row.fecha }}</q-td>
          </q-tr>
        </template>

        <!-- Mensaje si no hay datos -->
        <template v-slot:no-data>
          <div class="full-width row flex-center q-py-xl">
            <q-icon name="info" size="2em" class="q-mr-sm" />
            <span v-if="filtroNivel === 'todos'">
              No hay partidas registradas todavía
            </span>
            <span v-else>
              No hay partidas registradas para el nivel "{{ filtroNivel }}"
            </span>
          </div>
        </template>

        <!-- Mensaje si no hay resultados con el filtro -->
        <template v-slot:bottom v-if="rankingConPosicion.length === 0 && ranking.length > 0">
          <div class="full-width row flex-center q-py-md text-orange">
            <q-icon name="warning" class="q-mr-sm" />
            No hay resultados para el filtro "{{ filtroNivel }}"
            <q-btn flat dense color="orange" @click="limpiarFiltro" class="q-ml-sm">
              Mostrar todos
            </q-btn>
          </div>
        </template>

      </q-table>

      <!-- RESUMEN -->
      <div class="row items-center justify-between q-mt-md">
        <div class="text-caption text-grey-6">
          <q-icon name="info" size="xs" class="q-mr-xs" />
          Cada fila es una partida individual. Ordenado por puntos (↑) y tiempo (↓).
        </div>
        <div class="text-caption text-grey-6">
          <q-icon name="filter_list" size="xs" class="q-mr-xs" />
          {{ rankingConPosicion.length }} partidas mostradas
          <span v-if="filtroNivel !== 'todos'"> (filtrado por {{ filtroNivel }})</span>
        </div>
      </div>

      <!-- BOTONES -->
      <div class="row q-col-gutter-md q-mt-lg">
        <div class="col-12 col-md-4">
          <q-btn
            label="⬅ Volver"
            color="primary"
            class="full-width"
            @click="router.push('/categoria')"
            icon="sports_esports"
          />
        </div>
        <div class="col-12 col-md-4">
          <q-btn
            label="🔄 Recargar"
            color="secondary"
            class="full-width"
            @click="recargarRanking"
            icon="refresh"
          />
        </div>
        <div class="col-12 col-md-4">
          <q-btn
            label="📥 Exportar"
            color="green"
            class="full-width"
            @click="exportarRanking"
            icon="file_download"
          />
        </div>
      </div>

    </q-card>

  </q-page>
</template>

<style scoped>
.ranking-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e1e2f, #2b2b4f);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 15px;
}

.ranking-header {
  width: 100%;
  max-width: 900px;
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
  margin-bottom: 25px;
}

.ranking-header h2 {
  font-weight: 800;
  letter-spacing: 1px;
  margin: 0;
}

.ranking-card {
  width: 100%;
  max-width: 900px;
  border-radius: 22px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
  animation: aparecer 0.6s ease;
}

.filtros-container {
  background: rgba(0, 0, 0, 0.03);
  border-radius: 12px;
  padding: 15px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* 🥇🥈🥉 */
.gold {
  background: linear-gradient(90deg, #fff3b0, #ffd700) !important;
  font-weight: bold;
}

.gold td {
  border-color: #ffd700 !important;
}

.silver {
  background: linear-gradient(90deg, #e0e0e0, #c0c0c0) !important;
  font-weight: bold;
}

.silver td {
  border-color: #c0c0c0 !important;
}

.bronze {
  background: linear-gradient(90deg, #f4c28b, #cd7f32) !important;
  font-weight: bold;
}

.bronze td {
  border-color: #cd7f32 !important;
}

/* Colores por nivel en las filas */
.fila-facil td {
  background-color: rgba(76, 175, 80, 0.05) !important;
  border-left: 4px solid #4CAF50 !important;
}

.fila-medio td {
  background-color: rgba(33, 150, 243, 0.05) !important;
  border-left: 4px solid #2196F3 !important;
}

.fila-dificil td {
  background-color: rgba(244, 67, 54, 0.05) !important;
  border-left: 4px solid #F44336 !important;
}

/* Barras de nivel */
.nivel-bar-container {
  padding: 5px;
}

.nivel-bar-bg {
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin: 5px 0;
  overflow: hidden;
}

.nivel-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.nivel-facil {
  background: linear-gradient(90deg, #4CAF50, #81C784);
}

.nivel-medio {
  background: linear-gradient(90deg, #2196F3, #64B5F6);
}

.nivel-dificil {
  background: linear-gradient(90deg, #F44336, #E57373);
}

/* Animación */
@keyframes aparecer {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mejoras para la tabla */
:deep(.q-table__top) {
  border-radius: 12px 12px 0 0;
}

:deep(.q-table tbody tr:hover) {
  background-color: rgba(0, 150, 255, 0.1) !important;
}

/* Responsive */
@media (max-width: 600px) {
  .ranking-header {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
  
  .filtros-container .row {
    flex-direction: column;
  }
  
  .nivel-bar-container {
    margin-bottom: 10px;
  }
}
</style>