<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Exercises</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ exercise.name }}</ion-card-title>
          <ion-card-subtitle>{{ exercise.equipment }}</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <ion-label>
            Target Muscle: {{ exercise.muscle_primary }}
          </ion-label>
          <ion-label v-if="exercise.muscle_secondary.length">
            <br />
            Synergists Muscles: {{ exercise.muscle_secondary.join(", ") }}
          </ion-label>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { Exercise } from '@/model/exercise';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonLabel
} from '@ionic/vue';
import { Ref, inject } from 'vue';
import { useRoute } from 'vue-router';

const exList: Ref<Map<string, Exercise> | undefined> = inject('exercisesList')!;

const route = useRoute();
const exercise = exList.value!.get(route.params.id as string)!;
</script>