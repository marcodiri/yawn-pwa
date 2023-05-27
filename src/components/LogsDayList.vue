<template>
  <ion-list>
    <ion-item v-for="[_group, logs] in exGroups">
      <ion-list>
        <ion-item v-for="log in logs">
          <p>{{ log.exercise }}</p>
        </ion-item>
      </ion-list>
    </ion-item>
  </ion-list>
</template>

<script setup lang="ts">
import {
  IonList,
  IonItem
} from '@ionic/vue';

import { ExerciseLog } from '@/model/exerciseLog';
import { Ref, ref, watchEffect } from 'vue';

const props = defineProps<{
  exLogs: Ref<ExerciseLog[]>
}>();

const exGroups: Ref<Map<number, ExerciseLog[]> | undefined> = ref();
watchEffect(() => {
  exGroups.value = new Map<number, ExerciseLog[]>();

  for (const log of props.exLogs.value) {
    if (!exGroups.value.has(log.groupId)) {
      exGroups.value.set(log.groupId, [])
    }
    exGroups.value.get(log.groupId)!.push(log);
  }
})
</script>