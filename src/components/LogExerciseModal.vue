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
    <ion-content class="ion-padding">
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
  IonInput,
  actionSheetController,
  IonSelect,
  IonSelectOption,
} from '@ionic/vue';
import { Ref, inject, ref, toRaw } from 'vue';

import {attachHistoryListener, dismissModal} from '@/composables/modalBackButton';

defineProps<{
  trigger: string
  presentingElement?: HTMLElement
}>()

const exList: Ref<Map<string, Exercise> | undefined> = inject('exercisesList')!;

</script>