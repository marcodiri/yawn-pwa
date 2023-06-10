<template>
  <Line :data="data" :options="options" />
</template>

<script setup lang="ts">
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

const data: any = ref({
  labels: [],
  datasets: [
    {
      label: 'Data One',
      backgroundColor: '#f87979',
      data: []
    }
  ]
})

const options = {
  responsive: true,
  maintainAspectRatio: true
}

type chartData = {
  dates: string[],
  values: number[]
};

watchEffect(() => {
  const orms: chartData = {
    dates: [],
    values: []
  };
  const volume: chartData = {
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

  const dataOrm = {
    labels: orms.dates,
    datasets: [
      {
        label: '1RM KGS',
        backgroundColor: '#3dc2ff',
        data: orms.values
      }
    ]
  }

  const dataVolume = {
    labels: volume.dates,
    datasets: [
      {
        label: 'Volume',
        backgroundColor: '#3dc2ff',
        data: volume.values
      }
    ]
  }

  data.value = dataVolume;
})
</script>