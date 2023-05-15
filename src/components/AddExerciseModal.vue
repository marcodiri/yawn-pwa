<template>
  <ion-modal ref="modal" :trigger="trigger" :presenting-element="presentingElement" :canDismiss="canDismiss"
    @willDismiss="onWillDismiss">
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
        <ion-label position="stacked">
          Exercise name *
          <span v-if="exNameError" class="error"> ({{ exNameError }})</span>
        </ion-label>
        <ion-input type="text" name="exName" v-model="exName"></ion-input>
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
  actionSheetController,
} from '@ionic/vue';
import { ref, watch, watchEffect } from 'vue';

defineProps<{
  trigger: string
  presentingElement?: HTMLElement
}>()
const emit = defineEmits<{
  (e: 'confirm', data: Exercise): void
}>()

const modal = ref(null);
const exName = ref("");
const exNameError = ref();

function isRequired(value: string) {
  if (value && value.trim()) {
    return;
  }
  return "this field is required"
}

function validateFields() {
  exNameError.value = isRequired(exName.value);
  if (exNameError.value) return false;

  return true;
}

let modalIntent: string = 'cancel';
function cancel() {
  const intent = 'cancel';
  modalIntent = intent;
  (modal.value!['$el'] as typeof IonModal).dismiss(null, intent);
}
function confirm() {
  const intent = 'confirm';
  modalIntent = intent;
  if (!validateFields()) return;
  (modal.value!['$el'] as typeof IonModal).dismiss(exName.value, intent);
}
async function canDismiss() {
  if (modalIntent === 'confirm') return true;
  const actionSheet = await actionSheetController.create({
    header: 'Cancel exercise creation?',
    buttons: [
      {
        text: 'Yes',
        role: 'destructive',
      },
      {
        text: 'No',
        role: 'cancel',
      },
    ],
  });
  actionSheet.present();
  const { role } = await actionSheet.onWillDismiss();
  return role === 'destructive';
}
function onWillDismiss(ev: CustomEvent) {
  if (ev.detail.role === 'confirm') {
    console.log(ev.detail);
    emit('confirm', exName.value);
  }
  // TODO: reset form v-model bindings values to default
  exName.value = "";
  exNameError.value = undefined;
}
</script>

<style scoped>
span.error {
  color: var(--ion-color-warning, #ffc409);
}
</style>