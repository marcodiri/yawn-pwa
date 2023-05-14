<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Exercises</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ExerciseList :ex-list="data" />
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
  IonMenuButton
} from '@ionic/vue';
import { Ref, inject, ref } from 'vue';

import { Exercise } from '@/model/exercise';
import { ExerciseRepository } from '@/repository/exerciseRepository';
import ExerciseList from '@/components/ExerciseList.vue';

const repoEx: ExerciseRepository = inject('repoExercises')!;

const data = ref();

repoEx.getExercises().then(res => {
  data.value = res;
  console.log(res);
}).catch(err => {
  console.log(err);
})

</script>
