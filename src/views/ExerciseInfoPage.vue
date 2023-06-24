<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>{{ exercise.name }}</ion-title>
        <ion-progress-bar
          v-if="fetchingLogs && ['History', 'Graph'].includes(pages[sliderActiveIdx]) && logsPerDate?.size != 0"
          type="indeterminate"></ion-progress-bar>
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
            <ion-card-content>
              <ion-grid>
                <ion-row>
                  <ion-col class="muscle-images">
                    <span :class="'muscle-image-' + exercise.muscle_primary.toLowerCase()"></span>
                    <span v-for="muscle in exercise.muscle_secondary"
                      :class="'muscle-image-' + muscle.toLowerCase()"></span>
                  </ion-col>
                </ion-row>
                <ion-row class="ion-align-items-start ion-justify-content-between">
                  <ion-col size="auto">
                    <ion-label>
                      Target Muscle: {{ exercise.muscle_primary }}
                    </ion-label>
                    <ion-label v-if="exercise.muscle_secondary.length">
                      <br />
                      Synergists Muscles: {{ exercise.muscle_secondary.join(", ") }}
                    </ion-label>
                    <ion-label>
                      <br />
                      <br />
                      Equipment: {{ exercise.equipment }}
                    </ion-label>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-card-content>
          </ion-card>
        </swiper-slide>
        <swiper-slide>
          <ion-card v-if="!logsPerDate.size">
            <ion-card-content>
              <span class="no-logs">This exercise has no logs</span>
            </ion-card-content>
          </ion-card>
          <ion-card v-for="[date, logs] in [...logsPerDate.entries()].reverse()">
            <ion-card-header>
              <ion-card-subtitle>
                {{ (new Date(date)).toUTCString().split(' ').slice(0, 4).join(' ') }}
              </ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
              <ion-grid class="grid-history">
                <ion-row>
                  <ion-col>KGS</ion-col>
                  <ion-col>REPS</ion-col>
                  <ion-col>1RM KGS</ion-col>
                </ion-row>
                <ion-row v-for="log in logs">
                  <ion-col class="col-number">
                    {{ log.weight }}
                  </ion-col>
                  <ion-col class="col-number">
                    {{ log.reps }}
                  </ion-col>
                  <ion-col>
                    {{ log.orm }}
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-card-content>
          </ion-card>
        </swiper-slide>
        <swiper-slide>
          <ExerciseChart :logs-per-date="ref(logsPerDate)" />
        </swiper-slide>
      </swiper>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { Exercise } from '@/model/exercise';
import ExerciseChart from '@/components/ExerciseChart.vue';
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
import { Ref, inject, provide, ref } from 'vue';
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
const logsPerDate: Ref<Map<string, ExerciseLog[]>> = ref(new Map());

const slideChanged = (swiper?: SwiperType) => {
  if (swiper) {
    sliderActiveIdx.value = swiper.activeIndex;
  }
  const newLogsPerDate = new Map();
  fetchingLogs.value = true;
  repository.exerciseLogs.getByExerciseId(exercise.id)
    .then((logs) => {
      for (const log of (logs as ExerciseLog[])) {
        const date = log.date.split('T')[0];
        if (!newLogsPerDate.has(date)) {
          newLogsPerDate.set(date, [])
        }
        newLogsPerDate.get(date)!.push(log);
      }
      logsPerDate.value = newLogsPerDate;
      console.log(logsPerDate.value);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      fetchingLogs.value = false;
    });
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

ion-grid.grid-history {
  text-align: right;
}

ion-col.muscle-images {
  display: flex;
  flex-flow: row wrap;
}

span[class^='muscle-image-'] {
  display: block;
  width: 40px;
  height: 40px;
  margin-right: 6px;
  border: 1px solid #404040;
  border-radius: 8px;
  background-repeat: no-repeat;
}

.muscle-image-chest {
  background-image: url("/muscle_chart/mask/chest.png"), url("/muscle_chart/chart.png");
  background-position: -28px -23px;
  background-size: 200px;
}

.muscle-image-back {
  background-image: url("/muscle_chart/mask/back.png"), url("/muscle_chart/chart.png");
  background-position: -96px -18px;
  background-size: 150px;
}

.muscle-image-biceps {
  background-image: url("/muscle_chart/mask/biceps.png"), url("/muscle_chart/chart.png");
  background-position: -21px -53px;
  background-size: 280px;
}

.muscle-image-shoulders {
  background-image: url("/muscle_chart/mask/shoulders.png"), url("/muscle_chart/chart.png");
  background-position: -24px -34px;
  background-size: 280px;
}

.muscle-image-abs {
  background-image: url("/muscle_chart/mask/abs.png"), url("/muscle_chart/chart.png");
  background-position: -26px -39px;
  background-size: 190px;
}

.muscle-image-triceps {
  background-image: url("/muscle_chart/mask/triceps.png"), url("/muscle_chart/chart.png");
  background-position: -118px -32px;
  background-size: 200px;
}

.muscle-image-legs {
  background-image: url("/muscle_chart/mask/legs.png"), url("/muscle_chart/chart.png");
  background-position: -22px -89px;
  background-size: 200px;
}

.muscle-image-cardio {
  background-image: url("/muscle_chart/cardio.png");
  background-position: -13px 5px;
  background-size: 50px;
}
</style>