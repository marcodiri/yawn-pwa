<template>
  <ion-list>
    <ion-item v-for="[_group, logs] in exGroups">
          <p v-for="log in logs">{{ log.exercise }}</p>
    </ion-item>
  </ion-list>
</template>

<script setup lang="ts">
import {
  IonList,
  IonItem
} from '@ionic/vue';

import { ExerciseLog } from '@/model/exerciseLog';
import { Ref } from 'vue';

const props = defineProps<{
  exLogs: Ref<ExerciseLog[]>
}>();

const exGroups = new Map<number, ExerciseLog[]>();
for (const log of props.exLogs.value) {
  if (!(log.groupId in exGroups.keys())) {
    exGroups.set(log.groupId, [])
  }
  exGroups.get(log.groupId)!.push(log);
}
console.log(exGroups);


</script>