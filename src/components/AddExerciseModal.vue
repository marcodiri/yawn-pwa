<template>
  <ion-modal ref="modal" :trigger="trigger" :presenting-element="presentingElement" @willDismiss="onWillDismiss">
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
      <ion-item>
        <ion-label position="stacked">Enter your name</ion-label>
        <ion-input type="text" placeholder="Your name" v-model="name"></ion-input>
      </ion-item>
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
  IonLabel,
  IonInput,
} from '@ionic/vue';
import { ref } from 'vue';

defineProps<{
  trigger: string
  presentingElement?: HTMLElement
}>()
const emit = defineEmits<{
  (e: 'confirm', data: string): void
}>()

const modal = ref(null);
const name = ref("");

function cancel() {
  (modal.value!['$el'] as typeof IonModal).dismiss(null, 'cancel');
}
function confirm() {
  (modal.value!['$el'] as typeof IonModal).dismiss(name.value, 'confirm');
}
function onWillDismiss(ev: CustomEvent) {
  if (ev.detail.role === 'confirm') {
    emit('confirm', name.value);
  }
  // TODO: reset form v-model bindings values to default
}
</script>