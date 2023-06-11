<template>
  <ion-card v-for="[group, logs] in exGroups" class="card-logs">
    <ion-card-header>
      <ion-card-subtitle>
        {{ exList?.get(logs[0].exercise)!.name }}
      </ion-card-subtitle>

      <ion-button class="btn-log-menu" fill="clear" size="small" color="medium"
        @click="$router.push({ name: 'ExerciseInfo', params: { id: exList.get(logs[0].exercise)!.id } })">
        <ion-icon slot="icon-only" :icon="newspaperOutline"></ion-icon>
      </ion-button>
    </ion-card-header>
    <ion-card-content>
      <ion-grid>
        <ion-row class="ion-text-uppercase">
          <ion-col size="2">Set</ion-col>
          <ion-col offset="3">Kg</ion-col>
          <ion-col>Reps</ion-col>
        </ion-row>
        <LogEntry v-for="log, idx in logs" :log="log" :idx="idx + 1"
          @log-deleted="(retLog) => $emit('logDeleted', retLog)" />
      </ion-grid>
      <ion-button class="btn-add-set ion-text-uppercase" expand="block" size="small" color="light"
        @click="addSet(group, logs)">
        <ion-icon slot="start" :icon="add"></ion-icon>
        Add set
      </ion-button>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon
} from '@ionic/vue';
import { add, newspaperOutline } from 'ionicons/icons';
import { ExerciseLog } from '@/model/exerciseLog';
import LogEntry from './LogEntry.vue';
import { Ref, inject, ref, watchEffect } from 'vue';
import { Exercise } from '@/model/exercise';
import { repository } from '@/utils/db';

const props = defineProps<{
  date: Date
  exLogs: Ref<ExerciseLog[]>
}>();

const emit = defineEmits<{
  (e: 'logDeleted', data: ExerciseLog): void
}>()

const exList: Ref<Map<string, Exercise>> = inject('exercisesList')!;

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

const addSet = (group: number, groupLogs: ExerciseLog[]) => {
  const newLog = new ExerciseLog(
    groupLogs[0].exercise,
    group,
    props.date
  );
  repository.exerciseLogs.put(newLog)
    .then(() => {
      exGroups.value!.get(group)!.push(newLog);
    })
    .catch((err) => {
      console.error(err);
    });
};
</script>

<style scoped>
.card-logs {
  margin-top: 6px;
  margin-inline: 0;
}

ion-card-subtitle {
  font-size: 14px;
}

.btn-log-menu {
  position: absolute;
  right: 16px;
  top: 16px;
  width: 16px;
  height: 16px;
  margin: 0;
}

.btn-log-menu::part(native) {
  --padding-start: 0;
  --padding-end: 0;
}

.btn-add-set {
  margin: 0;
  margin-top: 12px;
}

ion-grid {
  --ion-grid-padding: 0;
}

ion-col:first-child {
  padding-left: 0;
}

ion-col:last-child {
  padding-right: 0;
}
</style>