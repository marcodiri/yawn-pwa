<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Exercises</ion-title>
        <ion-progress-bar v-if="!exList" type="indeterminate"></ion-progress-bar>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ExerciseList v-if="exList" :ex-list="exList" />
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
  IonProgressBar
} from '@ionic/vue';
import { inject, ref } from 'vue';

import { Exercise } from '@/model/exercise';
import { ExerciseRepository } from '@/repository/exerciseRepository';
import ExerciseList from '@/components/ExerciseList.vue';

const repoEx: ExerciseRepository = inject('repoExercises')!;

const exList = ref();

repoEx.getAll().then(res => {
  exList.value = res;
  console.log(res);
}).catch(err => {
  console.error(err);
})

</script>
