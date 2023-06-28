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
      <ExerciseFilter :ex-list="exList" @filter="updateExerciseList" />
      <ion-list>
        <ion-item v-for="[_key, ex], idx in results" class="list-item" lines="full">
          <ion-label>{{ ex.name }}</ion-label>
          <ion-buttons slot="end">
            <ion-button class="btn-add-to-log" aria-label="add-exercise-to-log" @click="createLog(idx, ex)">
              <ion-icon v-if="!insertingLogInDB[idx]" slot="icon-only" :icon="logIcon[idx]" aria-hidden="true"
                :class="{ 'text-success': logAdded[idx] }"></ion-icon>
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
import { addCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { Ref, inject, ref, watchEffect } from 'vue';

import { attachHistoryListener, dismissModal } from '@/composables/modalBackButton';
import { repository } from '@/utils/db';
import { Exercise } from '@/model/exercise';
import { ExerciseLog } from '@/model/exerciseLog';
import ExerciseFilter from './ExerciseFilter.vue';

const props = defineProps<{
  trigger: string
  date: Date
  presentingElement?: HTMLElement
}>()
const emit = defineEmits<{
  (e: 'logAdded'): void
}>()

const exList: Ref<Map<string, Exercise> | undefined> = inject('exercisesList')!;
const results = ref(exList.value);
watchEffect(() => {
  results.value = exList.value
})
const { startGroupId, incrementGroupId } = inject('groupId') as any;

const insertingLogInDB: Ref<Array<boolean>> = ref([]);
const logAdded: Ref<Array<boolean>> = ref([]);
const logIcon: Ref<Array<string>> = ref([]);
watchEffect(() => {
  insertingLogInDB.value = new Array(exList.value?.size).fill(false);
  logAdded.value = new Array(exList.value?.size).fill(false);
  logIcon.value = new Array(exList.value?.size).fill(addCircleOutline);
});

function updateExerciseList(filteredExercises: Map<string, Exercise>) {
  results.value = filteredExercises;
}

const createLog = (idx: number, exercise: Exercise) => {
  insertingLogInDB.value[idx] = true;
  const log = new ExerciseLog(
    exercise.id,
    startGroupId.value,
    props.date
  );
  repository.exerciseLogs.put(log)
    .then(() => {
      incrementGroupId();
      logIcon.value[idx] = checkmarkCircleOutline;
      logAdded.value[idx] = true;
      setTimeout(() => {
        logAdded.value[idx] = false;
        logIcon.value[idx] = addCircleOutline;
      }, 800);
      emit('logAdded');
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

.text-success {
  color: green;
}
</style>