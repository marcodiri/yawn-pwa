<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>{{ exercise.name }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-segment :value="pages[sliderActiveIdx]" @ion-change="segmentChange">
        <ion-segment-button v-for="page in pages" :value="page">
          <ion-label>{{ page }}</ion-label>
        </ion-segment-button>
      </ion-segment>
      <swiper :modules="modules" :keyboard="true" :initial-slide="sliderActiveIdx" :speed="150"
        @slide-change="slideChanged">
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
          test1
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
  IonicSlides
} from '@ionic/vue';
import { Ref, inject, ref } from 'vue';
import { useRoute } from 'vue-router';

import 'swiper/css';
import 'swiper/css/keyboard';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Swiper as SwiperType, Keyboard } from 'swiper';

const modules = [Keyboard, IonicSlides];

const exList: Ref<Map<string, Exercise> | undefined> = inject('exercisesList')!;

const route = useRoute();
const exercise = exList.value!.get(route.params.id as string)!;

const pages = ['Info', 'History', 'Graph'];
const sliderActiveIdx = ref(0);
const slideChanged = (swiper?: SwiperType) => {
  if (swiper) {
    sliderActiveIdx.value = swiper.activeIndex;
  }
}

const segmentChange = (e: any) => {
  console.log(e.detail.value);

  const swiper = (document.querySelector('.swiper') as any).swiper;
  swiper.slideTo(pages.indexOf(e.detail.value));
}

</script>

<style scoped>
.swiper {
  height: 100%;
}

.swiper-slide {
  overflow-y: auto;
}
</style>