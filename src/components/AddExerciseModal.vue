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
        <ion-input ref="exNameInputRef" type="text" name="exName" v-model="exName" label="Exercise Name *"
          label-placement="floating" error-text="This field is required" class="ion-touched no-bottom-line"
          @ion-input="removeInvalid"></ion-input>
      </ion-item>
      <ion-item>
        <ion-select aria-label="record-type" label="Type *" interface="action-sheet" label-placement="floating"
          v-model="exRcrd">
          <ion-select-option v-for="rcrd in Exercise.RecordType" :value="rcrd">{{ rcrd }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item>
        <ion-select aria-label="equipment" label="Equipment *" interface="action-sheet" label-placement="floating"
          v-model="exEqpm">
          <ion-select-option v-for="eqpm in Exercise.Equipment" :value="eqpm">{{ eqpm }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item>
        <ion-select aria-label="muscle-target" label="Target Muscle *" interface="action-sheet" label-placement="floating"
          v-model="exMsclP">
          <ion-select-option v-for="mscl in Exercise.MuscleGroup" :value="mscl">{{ mscl }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item>
        <ion-select aria-label="muscle-synergists" label="Synergists Muscles (optional)" interface="alert"
          label-placement="floating" :multiple="true" v-model="exMsclS">
          <ion-select-option v-for="mscl in Exercise.MuscleGroup" :value="mscl">{{ mscl }}</ion-select-option>
        </ion-select>
      </ion-item>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
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
import { Ref, ref } from 'vue';
import { Exercise } from '@/model/exercise';

defineProps<{
  trigger: string
  presentingElement?: HTMLElement
}>()
const emit = defineEmits<{
  (e: 'confirm', data: Exercise): void
}>()

const modal = ref(null);
const exNameInputRef = ref(null);
const exName = ref("");
const exRcrd = ref(Exercise.RecordType.WaR);
const exEqpm = ref(Exercise.Equipment.Barbell);
const exMsclP = ref(Exercise.MuscleGroup.Chest);
const exMsclS: Ref<Exercise.MuscleGroup[]> = ref([]);

function removeInvalid(ev: any) {
  ev.target.classList.remove('ion-invalid');
}

function isRequired(value: string) {
  if (value && value.trim()) {
    return true;
  }
  return false;
}

function validateFields() {
  let formValid = true;
  const exNameInputEl = (exNameInputRef.value!['$el'] as typeof IonInput);
  const exNameValid = isRequired(exName.value);
  if (exNameValid) {
    exNameInputEl.classList.add('ion-valid')
  } else {
    exNameInputEl.classList.add('ion-invalid');
    formValid = false;
  }

  const exRcrdValid = isRequired(exRcrd.value);
  if (!exRcrdValid) {
    formValid = false;
  }

  const exEqpmValid = isRequired(exEqpm.value);
  if (!exEqpmValid) {
    formValid = false;
  }

  const exMsclPValid = isRequired(exMsclP.value);
  if (!exMsclPValid) {
    formValid = false;
  }

  return formValid;
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
  const exMsclSArray: Exercise.MuscleGroup[] = [];
  // for some reason passing exMsclS.value directly returns a Proxy instead of an array
  for (let e of exMsclS.value)
    exMsclSArray.push(e);
  const newExercise = new Exercise(
    exName.value,
    exRcrd.value,
    exEqpm.value,
    exMsclP.value,
    exMsclSArray.length ? exMsclSArray : undefined);
  (modal.value!['$el'] as typeof IonModal).dismiss(newExercise, intent);
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
    emit('confirm', ev.detail.data);
  }
  // reset form v-model bindings values to default
  exName.value = "";
  exEqpm.value = Exercise.Equipment.Barbell;
  exMsclP.value = Exercise.MuscleGroup.Chest;
  exMsclS.value = [];
}
</script>

<style scoped>
ion-item {
  --inner-border-width: 0;
  --border-radius: 10px;
}

ion-item:not(:first-of-type) {
  margin-top: var(--padding-start);
}

ion-select {
  border-bottom: 1px solid var(--ion-color-light-shade);
}
</style>