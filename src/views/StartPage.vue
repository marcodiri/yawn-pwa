<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ sliderDate }}</ion-title>
        <ion-progress-bar v-if="fetchingLogs" type="indeterminate"></ion-progress-bar>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <LogExerciseModal trigger="open-log-ex-modal" :date="datesArray[sliderActiveIdx]" :start-group-id="startGroupId"
        @log-added="updateSliderIdx" />
      <ion-fab id="open-log-ex-modal" class="btn-log-exercise">
        <ion-fab-button>
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <swiper :modules="modules" :keyboard="true" :initial-slide="daysRange" :speed="150" @slide-change="updateSliderIdx">
        <swiper-slide v-for="date in datesArray">
          <header>
            <h1>Summary</h1>
          </header>
          <ion-card class="card-summary">
            <ion-card-content>
              <span class="no-logs">No logs yet</span>
            </ion-card-content>
          </ion-card>
          <header>
            <h1>Exercises</h1>
          </header>
          <LogsDayList v-if="exLogs?.has(date.toISOString().split('T')[0])"
            :ex-logs="ref(exLogs.get(date.toISOString().split('T')[0])!)" />
        </swiper-slide>
      </swiper>
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
  IonMenuButton,
  IonicSlides,
  IonLabel,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonCard,
  IonCardContent,
  IonProgressBar,
} from '@ionic/vue';
import { add, addCircleOutline } from 'ionicons/icons';
import { Ref, computed, inject, provide, ref, toRaw, watch } from 'vue';

import 'swiper/css';
import 'swiper/css/keyboard';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Swiper as SwiperType, Keyboard } from 'swiper';

import LogExerciseModal from '@/components/LogExerciseModal.vue'
import LogsDayList from '@/components/LogsDayList.vue';
import { repository } from '@/utils/db';
import { ExerciseLog } from '@/model/exerciseLog';

const pageTitle = inject('pageTitle');

const modules = [Keyboard, IonicSlides];

const datesArray: Array<Date> = [];
const currentDate = new Date();
const daysRange = 10;

for (let i = 0; i < daysRange * 2 + 1; i++) {
  datesArray[i] = new Date();
  datesArray[i].setDate(currentDate.getDate() + i - daysRange);
}

const sliderActiveIdx = ref(daysRange);
const startGroupId = ref(0);
function incrementGroupId() {
  startGroupId.value++;
}
provide('groupId', { startGroupId, incrementGroupId });
const exLogs: Ref<Map<string, ExerciseLog[]> | undefined> = ref();
provide('exLogs', exLogs);
const fetchingLogs = ref(false);
const updateSliderIdx = (swiper?: SwiperType) => {
  if (swiper) {
    sliderActiveIdx.value = swiper.activeIndex;
  }
  const sliderDate = datesArray[sliderActiveIdx.value];
  const sliderDateString = sliderDate.toISOString().split("T")[0];
  fetchingLogs.value = true;
  repository.exerciseLogs.getDaysRange(sliderDate)
    .then(data => {
      exLogs.value = (data as Ref<Map<string, ExerciseLog[]>>).value;
      console.log(exLogs.value);
      console.log(`hasday: ${exLogs.value.has(sliderDateString)}`);
      if (!exLogs.value.has(sliderDateString)) {
        startGroupId.value = 0;
      }
      else {
        const dayLogs = exLogs.value.get(sliderDateString)!;
        startGroupId.value = dayLogs[dayLogs.length - 1].groupId + 1;
      }
      console.log(`startGroupId: ${startGroupId.value}`);
    })
    .catch(err => {
      console.error(err);
    })
    .finally(() => {
      fetchingLogs.value = false;
    });
};

const sliderDate = computed(() => {
  const splits = datesArray[sliderActiveIdx.value].toDateString().split(" ");
  return splits[0] + ", " + splits[1] + " " + splits[2];
})

</script>

<style scoped>
header {
  margin: 20px 0 6px 0;
}

h1 {
  margin: 0;
  font-size: 1em;
}

.swiper {
  height: 100%;
}

.swiper-slide {
  padding-inline: 16px;
}

.no-logs {
  margin: 0;
  letter-spacing: 1px;
  line-height: 20px;
  font-size: 1.3em;
  font-weight: 700;
}

.btn-log-exercise {
  position: absolute;
  bottom: 16px;
  inset-inline-end: calc(16px + var(--ion-safe-area-right, 0px));
}

.card-summary {
  margin-top: 0;
  margin-inline: 0;
}
</style>