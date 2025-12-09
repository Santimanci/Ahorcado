<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const ranking = ref([])

onMounted(() => {
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
          fecha: partida.fecha || new Date().toLocaleDateString()
        })
      })
    } else {
      // Si es una partida individual, añadirla tal cual
      partidasIndividuales.push({
        nombre: jugador.nombre || jugador.usuario || jugador.player || jugador.name || 'Sin nombre',
        puntos: jugador.puntos || 0,
        tiempoTotal: jugador.tiempoTotal || 0,
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
})

// Añadir posición a cada partida individual
const rankingConPosicion = computed(() => {
  return ranking.value.map((partida, index) => ({
    ...partida,
    posicion: index + 1
  }))
})

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
      <q-badge color="orange" class="q-ml-md"  />
    </div>

    <!-- CARD PRINCIPAL -->
    <q-card class="ranking-card q-pa-lg">

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

        <!-- ✅ RESALTAR TOP 3 -->
        <template v-slot:body="props">
          <q-tr
            :props="props"
            :class="{
              'gold': props.row.posicion === 1,
              'silver': props.row.posicion === 2,
              'bronze': props.row.posicion === 3
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
            <q-td key="fecha">{{ props.row.fecha }}</q-td>
          </q-tr>
        </template>

        <!-- Mensaje si no hay datos -->
        <template v-slot:no-data>
          <div class="full-width row flex-center q-py-xl">
            <q-icon name="info" size="2em" class="q-mr-sm" />
            <span>No hay partidas registradas todavía</span>
          </div>
        </template>

      </q-table>

      <!-- INFORMACIÓN -->
      <div class="q-mt-md text-caption text-grey-6">
        <q-icon name="info" size="xs" class="q-mr-xs" />
        Cada fila representa una partida individual. Mismo usuario puede aparecer múltiples veces.
      </div>

      <!-- BOTÓN VOLVER -->
      <q-btn
        label="⬅ Volver al Juego"
        color="primary"
        class="full-width q-mt-lg"
        @click="router.push('/categoria')"
      />

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
</style>