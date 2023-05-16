<template>
  <ion-page ref="page">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Exercises</ion-title>
        <ion-buttons slot="end">
          <ion-button id="open-modal">
            <ion-icon aria-hidden="true" :ios="addOutline" :md="addSharp"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-progress-bar v-if="!exList" type="indeterminate"></ion-progress-bar>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ExerciseList v-if="exList" :ex-list="exList" />
      <AddExerciseModal trigger="open-modal" :presenting-element="presentingElement" @confirm="listener" />
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
  IonIcon
} from '@ionic/vue';
import {
  addSharp,
  addOutline
} from 'ionicons/icons';
import { Ref, inject, onMounted, ref } from 'vue';

import { Exercise } from '@/model/exercise';
import { ExerciseRepository } from '@/repository/exerciseRepository';
import ExerciseList from '@/components/ExerciseList.vue';
import AddExerciseModal from '@/components/AddExerciseModal.vue';

const repoEx: ExerciseRepository = inject('repoExercises')!;
const exList: Ref<Exercise[] | undefined> = ref();

repoEx.getAll().then(data => {
  exList.value = (data as Ref<Exercise[]>).value;
}).catch(err => {
  console.error(err);
});

const page = ref(null);
let presentingElement: HTMLElement;
onMounted(() => { presentingElement = page.value!["$el"] });

function listener(newExercise: Exercise) {
  repoEx.put(newExercise);
}
</script>

<style scoped>
ion-toolbar>ion-buttons ion-button {
  font-size: 1.3em;
}
</style>