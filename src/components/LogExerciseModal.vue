<template>
  <ion-modal ref="modal" :trigger="trigger" :presenting-element="presentingElement" @willDismiss="">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="cancel()">Cancel</ion-button>
        </ion-buttons>
        <ion-title>Add exercise</ion-title>
        <ion-buttons slot="end">
          <ion-button :strong="true" @click="confirm()">Confirm</ion-button>
        </ion-buttons>
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
  IonModal,
  IonItem,
  IonInput,
  actionSheetController,
  IonSelect,
  IonSelectOption
} from '@ionic/vue';
import { Ref, inject, ref, toRaw } from 'vue';

defineProps<{
  trigger: string
  presentingElement?: HTMLElement
}>()

const exList: Ref<Map<string, Exercise> | undefined> = inject('exercisesList')!;
</script>