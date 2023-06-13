<template>
  <div style="display: flex; flex-flow: column; height: 100%;">
    <div style="padding-top: 4px;">
      <ion-item>
        <ion-select aria-label="graph data" interface="popover" justify="start" label="Data:" v-model="chartDataChoice">
          <ion-select-option v-for="v in ChartDataChoices" :value="v">
            {{ v }}
          </ion-select-option>
        </ion-select>
      </ion-item>
    </div>
    <div style="position: relative; flex-grow: 1;">
      <Line :data="chartDataMap.get(chartDataChoice)" :options="options" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IonItem,
  IonSelect,
  IonSelectOption
} from '@ionic/vue';
import { Ref, inject, reactive, ref, watch, watchEffect } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'vue-chartjs';
import { ExerciseLog } from '@/model/exerciseLog';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps<{
  logsPerDate: Ref<Map<string, ExerciseLog[]>>
}>();

enum ChartDataChoices {
  orm = "1RM KGS",
  volume = "Volume"
}

const chartDataChoice = ref(ChartDataChoices.orm);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 20,
    }
  },
  elements: {
    point: {
      radius: 4
    }
  },
  plugins: {
    legend: {
      display: false,
      onClick: () => { } // disable hide chart
    }
  }
}

const emptyData: any = {
  labels: [],
  datasets: [
    {
      label: 'Empty',
      backgroundColor: '#3dc2ff',
      data: []
    }
  ]
};

const chartDataMap = new Map([
  [ChartDataChoices.orm, emptyData],
  [ChartDataChoices.volume, emptyData]
]);

type dataStore = {
  dates: string[],
  values: number[]
};

watchEffect(() => {
  const orms: dataStore = {
    dates: [],
    values: []
  };
  const volume: dataStore = {
    dates: [],
    values: []
  };
  for (const [date, logs] of props.logsPerDate.value) {
    let maxOrm = 0;
    let dayVol = 0;
    for (const log of logs) {
      const orm = log.orm;
      if (orm > maxOrm) maxOrm = orm;
      dayVol += log.weight * log.reps;
    }
    if (maxOrm > 0) {
      orms.dates.push(date);
      orms.values.push(maxOrm);
    }
    maxOrm = 0;

    if (dayVol > 0) {
      volume.dates.push(date);
      volume.values.push(dayVol);
    }
    dayVol = 0;
  }

  chartDataMap.set(ChartDataChoices.orm, {
    labels: orms.dates,
    datasets: [
      {
        label: ChartDataChoices.orm,
        backgroundColor: '#3dc2ff',
        data: orms.values
      }
    ]
  });

  chartDataMap.set(ChartDataChoices.volume, {
    labels: volume.dates,
    datasets: [
      {
        label: ChartDataChoices.volume,
        backgroundColor: '#3dc2ff',
        data: volume.values
      }
    ]
  });
})
</script>