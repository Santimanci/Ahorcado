<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const ranking = ref([])

onMounted(() => {
  const data = JSON.parse(localStorage.getItem('rankingAhorcado') || '[]')
  ranking.value = data
})

// ✅ Decoramos con posición
const rankingConPosicion = computed(() => {
  return ranking.value.map((jugador, index) => ({
    ...jugador,
    posicion: index + 1,

    // ✅ Fuerza el nombre aunque venga con otra clave
    nombre:
      jugador.nombre ||
      jugador.usuario ||
      jugador.player ||
      jugador.name ||
      'Sin nombre'
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
      <h2>🏆 Ranking Global</h2>
    </div>

    <!-- CARD PRINCIPAL -->
    <q-card class="ranking-card q-pa-lg">

      <q-table
        :rows="rankingConPosicion"
        row-key="nombre"
        flat
        bordered
        :columns="[
          { name: 'posicion', label: '#', field: 'posicion', align: 'center' },
          { name: 'nombre', label: 'Jugador', field: 'nombre', align: 'left' },
          { name: 'puntos', label: 'Puntos', field: 'puntos', align: 'center' },
          { name: 'tiempoTotal', label: 'Tiempo (s)', field: 'tiempoTotal', align: 'center' },
          { name: 'partidas', label: 'Partidas', field: 'partidas', align: 'center' }
        ]"
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
              {{ props.row.posicion }}
            </q-badge>
          </q-td>
        </template>

        <!-- ✅ RESALTAR TOP 1 -->
        <template v-slot:body="props">
          <q-tr
            :props="props"
            :class="{
              'gold': props.row.posicion === 1,
              'silver': props.row.posicion === 2,
              'bronze': props.row.posicion === 3
            }"
          >
            <q-td key="posicion">{{ props.row.posicion }}</q-td>
            <q-td key="nombre">{{ props.row.nombre }}</q-td>
            <q-td key="puntos">{{ props.row.puntos }}</q-td>
            <q-td key="tiempoTotal">{{ props.row.tiempoTotal }}</q-td>
            <q-td key="partidas">{{ props.row.partidas }}</q-td>
          </q-tr>
        </template>

      </q-table>

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
  background: linear-gradient(90deg, #fff3b0, #ffd700);
  font-weight: bold;
}

.silver {
  background: linear-gradient(90deg, #e0e0e0, #c0c0c0);
  font-weight: bold;
}

.bronze {
  background: linear-gradient(90deg, #f4c28b, #cd7f32);
  font-weight: bold;
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
</style>
