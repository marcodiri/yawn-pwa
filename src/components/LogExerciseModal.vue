<template>
  <ion-modal ref="modal" :trigger="trigger" :presenting-element="presentingElement"
    @willPresent="attachHistoryListener($el, $router)" @willDismiss="">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="" @click="dismissModal($router)"></ion-back-button>
        </ion-buttons>
        <ion-title>Add exercise</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item v-for="[_key, ex], idx in exList" class="list-item" lines="full">
          <ion-label>{{ ex.name }}</ion-label>
          <ion-buttons slot="end">
            <ion-button class="btn-add-to-log" aria-label="add-exercise-to-log" @click="createLog(idx, ex)">
              <ion-icon v-if="!insertingLogInDB[idx]" slot="icon-only" :icon="addCircleOutline"
                aria-hidden="true"></ion-icon>
              <ion-spinner v-else></ion-spinner>
            </ion-button>
          </ion-buttons>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonBackButton,
  IonModal,
  IonItem,
  IonList,
  IonLabel,
  IonIcon,
  IonSpinner,
} from '@ionic/vue';
import { addCircleOutline } from 'ionicons/icons';
import { Ref, inject, ref, toRaw } from 'vue';

import { attachHistoryListener, dismissModal } from '@/composables/modalBackButton';
import { repository } from '@/utils/db';
import { Exercise } from '@/model/exercise';
import { ExerciseLog } from '@/model/exerciseLog';

const props = defineProps<{
  trigger: string
  date: Date
  presentingElement?: HTMLElement
}>()

const exList: Ref<Map<string, Exercise> | undefined> = inject('exercisesList')!;
const {startGroupId, incrementGroupId} = inject('groupId');

const insertingLogInDB = ref(new Array(exList.value?.size).fill(false));

const createLog = (idx: number, exercise: Exercise) => {
  insertingLogInDB.value[idx] = true;
  const log = new ExerciseLog(
    exercise.id,
    startGroupId.value,
    props.date
  );
  repository.exerciseLogs.put(log)
    .then(() => {
      console.log(log);
      incrementGroupId();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      insertingLogInDB.value[idx] = false;
    });
}
</script>

<style scoped>
.btn-add-to-log {
  width: 100% !important;
  height: 100% !important;
  color: var(--ion-text-color);
}

.btn-add-to-log::part(native) {
  padding: 0;
}

.btn-add-to-log ion-icon {
  font-size: 28px;
}
</style>