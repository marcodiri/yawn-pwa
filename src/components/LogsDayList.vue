<template>
  <ion-card v-for="[_group, logs] in exGroups" class="card-logs">
    <ion-card-header>
      <ion-card-subtitle>
        {{ exList.get(logs[0].exercise)!.name }}
      </ion-card-subtitle>
      <!-- <ion-icon :icon="ellipsisVertical"></ion-icon> -->

      <ion-button class="btn-log-menu" fill="clear" size="small" color="medium">
        <ion-icon slot="icon-only" :icon="ellipsisVertical"></ion-icon>
      </ion-button>
    </ion-card-header>
    <ion-card-content>
      <ion-grid>
        <ion-row class="ion-text-uppercase">
          <ion-col size="2">Set</ion-col>
          <ion-col offset="2">Kg</ion-col>
          <ion-col>Reps</ion-col>
          <ion-col size="1"></ion-col>
        </ion-row>
        <LogEntry v-for="log, idx in logs" :log="ref(log)" :idx="idx + 1" />
      </ion-grid>
      <span>
        <ion-icon :icon="add"></ion-icon>
        ADD SET
      </span>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import {
  IonList,
  IonItem,
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
import { add, ellipsisVertical } from 'ionicons/icons';
import { ExerciseLog } from '@/model/exerciseLog';
import LogEntry from './LogEntry.vue';
import { Ref, inject, ref, watchEffect } from 'vue';
import { Exercise } from '@/model/exercise';

const props = defineProps<{
  exLogs: Ref<ExerciseLog[]>
}>();

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
</script>

<style scoped>
.card-logs {
  margin-top: 0;
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