<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>{{ exercise.name }}</ion-title>
        <ion-progress-bar v-if="fetchingLogs" type="indeterminate"></ion-progress-bar>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-segment class="top-segment" :value="pages[sliderActiveIdx]" @ion-change="segmentChange">
        <ion-segment-button v-for="page in pages" :value="page">
          <ion-label>{{ page }}</ion-label>
        </ion-segment-button>
      </ion-segment>
      <swiper class="swiper-exercise-info" :modules="modules" :keyboard="true" :initial-slide="sliderActiveIdx"
        :speed="150" @slide-change="slideChanged">
        <swiper-slide>
          <ion-card>
            <ion-card-header>
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
        </swiper-slide>
        <swiper-slide>
          <ion-card v-for="[date, logs] in logsPerDate">
            <ion-card-header>
              <ion-card-subtitle>
                {{ (new Date(date)).toUTCString().split(' ').slice(0, 4).join(' ') }}
              </ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
              <ion-grid>
                <ion-row v-for="log in logs">
                  <ion-col>
                  </ion-col>
                  <ion-col>
                    {{ log.weight || '0.0' }} kgs
                  </ion-col>
                  <ion-col>
                    {{ log.reps || 0 }} reps
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-card-content>
          </ion-card>
        </swiper-slide>
        <swiper-slide>
          test2
        </swiper-slide>
      </swiper>
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
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonicSlides,
  IonProgressBar,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/vue';
import { Ref, inject, ref } from 'vue';
import { useRoute } from 'vue-router';

import 'swiper/css';
import 'swiper/css/keyboard';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Swiper as SwiperType, Keyboard } from 'swiper';

import { repository } from '@/utils/db';
import { ExerciseLog } from '@/model/exerciseLog';

const modules = [Keyboard, IonicSlides];

const exList: Ref<Map<string, Exercise> | undefined> = inject('exercisesList')!;

const route = useRoute();
const exercise = exList.value!.get(route.params.id as string)!;

const pages = ['Info', 'History', 'Graph'];
const sliderActiveIdx = ref(0);
const fetchingLogs = ref(false);
const logsPerDate: Ref<Map<string, ExerciseLog[]> | undefined> = ref();
const slideChanged = (swiper?: SwiperType) => {
  if (swiper) {
    sliderActiveIdx.value = swiper.activeIndex;
  }
  if (pages[sliderActiveIdx.value] === 'History') {
    logsPerDate.value = new Map();
    fetchingLogs.value = true;
    repository.exerciseLogs.getByExerciseId(exercise.id)
      .then((logs) => {
        for (const log of (logs as ExerciseLog[])) {
          const date = log.date.split('T')[0];
          if (!logsPerDate.value!.has(date)) {
            logsPerDate.value!.set(date, [])
          }
          logsPerDate.value!.get(date)!.push(log);
        }

        console.log(logsPerDate.value);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        fetchingLogs.value = false;
      });
  }
}
const segmentChange = (e: any) => {
  const swiper = (document.querySelector('.swiper-exercise-info') as any).swiper;
  swiper.slideTo(pages.indexOf(e.detail.value));
}

</script>

<style scoped>
.top-segment {
  position: fixed;
  z-index: 9;
}

.swiper {
  height: 100%;
  padding-top: 32px;
}

.swiper-slide {
  overflow-y: auto;
}
</style>