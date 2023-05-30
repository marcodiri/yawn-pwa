<template>
    <ion-row>
      <ion-col size="2">{{ idx }}</ion-col>
      <ion-col offset="2">{{ log.value.weight || 0 }}</ion-col>
      <ion-col>{{ log.value.reps || 0 }}</ion-col>
      <ion-col size="1">X</ion-col>
    </ion-row>
</template>

<script setup lang="ts">
import {
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/vue';
import { ExerciseLog } from '@/model/exerciseLog';
import { Ref } from 'vue';

const props = defineProps<{
  log: Ref<ExerciseLog>
  idx: number
}>();
</script>

<style scoped>
ion-col:first-child {
  padding-left: 0;
}

ion-col:last-child {
  padding-right: 0;
}
</style>