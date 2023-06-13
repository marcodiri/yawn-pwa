<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>
          <ion-button id="open-date-picker">
            {{ currentDate.toUTCString().split(" ").slice(0, 3).join(" ") }}
          </ion-button>
          <!-- <ion-datetime-button datetime="datetime"></ion-datetime-button> -->
        </ion-title>
        <!-- <ion-buttons slot="end">
          <ion-button id="open-date-picker">
            <ion-icon slot="icon-only" :icon="calendarOutline"></ion-icon>
          </ion-button>
        </ion-buttons> -->
        <ion-modal id="modal-datepicker" class="ion-datetime-button-overlay" :keep-contents-mounted="true"
          trigger="open-date-picker" @willPresent="updateDatepickerValue">
          <ion-datetime ref="datepicker" id="datetime" presentation="date" :first-day-of-week="1"
            :highlighted-dates="highlightedDates" :key="ionDatetimeKey"
            @ion-change="(e) => { datePickerChange(new Date(e.detail.value as string), e) }"></ion-datetime>
        </ion-modal>
        <ion-progress-bar v-if="fetchingLogs && !exLogs?.has(currentDate?.toISOString().split('T')[0])"
          type="indeterminate"></ion-progress-bar>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <LogExerciseModal trigger="open-log-ex-modal" :date="currentDate" :start-group-id="startGroupId"
        @log-added="loadDayLogs(currentDate)" />
      <ion-fab id="open-log-ex-modal" class="btn-log-exercise">
        <ion-fab-button>
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <swiper :modules="modules" :keyboard="true" :initial-slide="daysRange" :speed="150"
        @init="(sw) => { swiperRef = sw }" @slide-change="swiperChange">
        <swiper-slide v-for="date in datesArray">
          <!-- <header>
            <h1>Summary</h1>
          </header> -->
          <header>
            <h1>Exercises</h1>
          </header>
          <ion-card v-if="!exLogs?.has(date.toISOString().split('T')[0])" class="card-summary">
            <ion-card-content>
              <span class="no-logs">No logs yet</span>
            </ion-card-content>
          </ion-card>
          <LogsDayList v-if="exLogs?.has(date.toISOString().split('T')[0])" :date="date"
            :ex-logs="ref(exLogs.get(date.toISOString().split('T')[0])!)" @log-deleted="loadDayLogs(currentDate)" />
          <span class="bottom-filler"></span>
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
  IonButton,
  IonMenuButton,
  IonicSlides,
  IonIcon,
  IonFab,
  IonFabButton,
  IonCard,
  IonCardContent,
  IonProgressBar,
  IonDatetimeButton,
  IonModal,
  IonDatetime
} from '@ionic/vue';
import { ModalCustomEvent, DatetimeCustomEvent } from '@ionic/core';
import {
  add,
  calendarOutline
} from 'ionicons/icons';
import { Ref, computed, inject, provide, ref } from 'vue';

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

const ionDatetimeKey = ref(0); // vue will refresh the component when changed

const datesArray: Ref<Array<Date>> = ref([]);
let currentDate = ref(new Date());
const daysRange = 7;

const startGroupId = ref(0);
function incrementGroupId() {
  startGroupId.value++;
}
provide('groupId', { startGroupId, incrementGroupId });

const exLogs: Ref<Map<string, ExerciseLog[]> | undefined> = ref();
provide('exLogs', exLogs);

let logIds: Set<string> = new Set();
const fetchingLogs = ref(false);
const loadDayLogs = (day: Date) => {
  const sliderDateString = day.toISOString().split("T")[0];
  fetchingLogs.value = true;
  repository.exerciseLogs.getDaysRange(day)
    .then(data => {
      exLogs.value = (data as Ref<Map<string, ExerciseLog[]>>).value;
      console.log(exLogs.value);
      // console.log(`hasday: ${exLogs.value.has(sliderDateString)}`);
      if (!exLogs.value.has(sliderDateString)) {
        startGroupId.value = 0;
      }
      else {
        const dayLogs = exLogs.value.get(sliderDateString)!;
        startGroupId.value = dayLogs[dayLogs.length - 1].groupId + 1;
      }
      // console.log(`startGroupId: ${startGroupId.value}`);
    })
    .catch(err => {
      console.error(err);
    })
    .finally(() => {
      fetchingLogs.value = false;
    });

  repository.exerciseLogs.getAllIds()
    .then(res => {
      logIds.clear();
      for (const log of res.rows) {
        logIds.add(log.id.split("_")[2]);
      }
      // ionDatetimeKey.value += 1;
    })
    .catch(err => {
      console.error(err);
    })
};

const swiperRef: Ref<SwiperType | undefined> = ref();

function datePickerChange(selectedDate: Date, e?: DatetimeCustomEvent) {
  swiperRef.value?.setProgress(0.5); // reset swiper to middle slide

  currentDate.value = selectedDate;

  for (let i = 0; i < daysRange * 2 + 1; i++) {
    datesArray.value[i] = new Date(selectedDate.toISOString());
    datesArray.value[i].setDate(selectedDate.getDate() + i - daysRange);
  }

  loadDayLogs(selectedDate);

  const popoverOrModal = e?.target.closest('ion-modal, ion-popover') as
    | HTMLIonModalElement
    | HTMLIonPopoverElement
    | null;
  if (popoverOrModal) {
    popoverOrModal.dismiss();
  }
}
datePickerChange(currentDate.value);


function updateDatepickerValue(e: ModalCustomEvent) {
  e.target.querySelector('ion-datetime')!.value = currentDate.value?.toISOString();
}

function swiperChange(swiper: SwiperType) {
  if (datesArray.value.length) {
    currentDate.value = datesArray.value[swiper.activeIndex];
  }
}

function highlightedDates(isoString: string) {
  if (logIds.has(isoString)) {
    return {
      textColor: '#09721b',
      backgroundColor: '#c8e5d0'
    };
  }

  return undefined;
}
</script>

<style scoped>
header {
  margin-top: 20px;
}

h1 {
  margin: 0;
  font-size: 1em;
}

#open-date-picker::part(native) {
  background-color: #d9d9d9;
  height: 80%;
  border-radius: 8px;
  color: black;
  margin-top: 5px;
  font-weight: bold;
}

.swiper {
  height: 100%;
}

.swiper-slide {
  padding-inline: 16px;
  overflow-y: auto;
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
  margin-top: 6px;
  margin-inline: 0;
}

.bottom-filler {
  display: block;
  width: 100%;
  height: 64px;
}
</style>