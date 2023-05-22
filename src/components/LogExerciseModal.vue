<template>
  <ion-modal ref="modal" :trigger="trigger" :presenting-element="presentingElement"
    @willPresent="attachHistoryListener($el, $router)" @willDismiss="">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="" @click="dismissModal($router)"></ion-back-button>
        </ion-buttons>
        <ion-title>Add exercise</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item v-for="[key, ex] in exList" class="list-item" lines="full">
          <ion-label>{{ ex.name }}</ion-label>
          <ion-buttons slot="end">
            <ion-button class="btn-add-to-log" aria-label="add-exercise-to-log" @click="">
              <ion-icon slot="icon-only" :icon="addCircleOutline" aria-hidden="true"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { Exercise } from '@/model/exercise';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonBackButton,
  IonModal,
  IonItem,
  IonList,
  IonLabel,
  IonIcon
} from '@ionic/vue';
import { addCircleOutline } from 'ionicons/icons';
import { Ref, inject, ref, toRaw } from 'vue';

import { attachHistoryListener, dismissModal } from '@/composables/modalBackButton';

defineProps<{
  trigger: string
  presentingElement?: HTMLElement
}>()

const exList: Ref<Map<string, Exercise> | undefined> = inject('exercisesList')!;

</script>

<style scoped>
.btn-add-to-log {
  width: 100% !important;
  height: 100% !important;
  color: var(--ion-text-color);
}

.btn-add-to-log::part(native) {
  padding: 0;
}

.btn-add-to-log ion-icon {
  font-size: 28px;
}
</style>