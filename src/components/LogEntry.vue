<template>
  <ion-row class="set-row">
    <ion-col size="2">
      <div class="set-container">
        {{ idx }}
      </div>
    </ion-col>
    <ion-col offset="2">
      <ion-input class="input-number" type="number" placeholder="0" v-model="logWeight" required>
      </ion-input>
    </ion-col>
    <ion-col>
      <ion-input class="input-number" type="number" placeholder="0" v-model="logReps" required>
      </ion-input>
    </ion-col>
    <ion-col size="2">
      <ion-button class="btn-confirm-set ion-no-margin" size="small" color="medium">
        <ion-icon slot="icon-only" :icon="checkmark"></ion-icon>
      </ion-button>
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import {
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonButton,
  IonIcon
} from '@ionic/vue';
import { checkmark } from 'ionicons/icons';
import { ExerciseLog } from '@/model/exerciseLog';
import { Ref, ref, watch } from 'vue';

const props = defineProps<{
  log: ExerciseLog
  idx: number
}>();

const logWeight: Ref<number | undefined> = ref(props.log.weight);
const logReps: Ref<number | undefined> = ref(props.log.reps);

</script>

<style scoped>
.set-row {
  font-size: 1.3em;
}

.set-container {
  padding-top: 4px;
  font-weight: bold;
}

ion-col {
  display: flex;
  align-items: flex-end;
}

ion-col:first-child {
  padding-left: 0;
}

ion-col:last-child {
  padding-right: 0;
  text-align: right;
}

ion-input.input-number {
  max-width: 50px;
  min-height: 0;
  /* height: 100%; */
}

.btn-confirm-set {
  width: 40px;
  height: 30px;
  font-size: 10px;
}
</style>