<template>
  <ion-page ref="page">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ pageTitle }}</ion-title>
        <ion-buttons slot="end">
          <ion-button id="open-modal">
            <ion-icon aria-hidden="true" :ios="addOutline" :md="addSharp"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-progress-bar v-if="!exList" type="indeterminate"></ion-progress-bar>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <AddExerciseModal trigger="open-modal" :presenting-element="presentingElement" @confirm="addExerciseToDb" />
      <ExerciseFilter :ex-list="exList" @filter="updateExerciseList" />
      <ion-list>
        <ion-item button v-for="[key, ex] in results" class="list-item" lines="full"
          @click="$router.push({ name: 'ExerciseInfo', params: { id: ex.id } })">
          <ion-label>{{ ex.name }}</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonMenuButton,
  IonProgressBar,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/vue';
import {
  addSharp,
  addOutline
} from 'ionicons/icons';
import { Ref, inject, onMounted, ref, watchEffect } from 'vue';

import { Exercise } from '@/model/exercise';
import AddExerciseModal from '@/components/AddExerciseModal.vue';
import ExerciseFilter from '@/components/ExerciseFilter.vue';
import { repository } from '@/utils/db';

const pageTitle = inject('pageTitle');
const exList: Ref<Map<string, Exercise> | undefined> = inject('exercisesList')!;
const results = ref(exList.value);
watchEffect(() => {
  results.value = exList.value
})

const page = ref(null);
let presentingElement: HTMLElement;
onMounted(() => { presentingElement = page.value!["$el"] });

function addExerciseToDb(newExercise: Exercise) {
  repository.exercises.put(newExercise);
}

function updateExerciseList(filteredExercises: Map<string, Exercise>) {
  results.value = filteredExercises;
}
</script>

<style scoped>
ion-toolbar>ion-buttons ion-button {
  font-size: 1.3em;
}

ion-item.list-item:last-of-type {
  --border-width: 0;
}
</style>