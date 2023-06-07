<template>
  <ion-row class="set-row">
    <ion-col size="2">
      <div class="set-container">
        {{ idx }}
      </div>
    </ion-col>
    <ion-col offset="3">
      <ion-input class="input-number" type="number" placeholder="0" v-model="logWeight" required
        @ion-focus="updateRowVisibility(true)">
      </ion-input>
    </ion-col>
    <ion-col>
      <ion-input class="input-number" type="number" placeholder="0" v-model="logReps" required
        @ion-focus="updateRowVisibility(true)">
      </ion-input>
    </ion-col>
  </ion-row>
  <ion-row class="update-row" v-show="showUpdateRow">
    <ion-col>
      <ion-button size="small" color="success" @click="updateLog">Update</ion-button>
    </ion-col>
    <ion-col>
      <ion-button size="small" color="danger" @click="deleteLog">Delete</ion-button>
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import {
  IonRow,
  IonCol,
  IonInput,
  IonButton
} from '@ionic/vue';
import { ExerciseLog } from '@/model/exerciseLog';
import { Ref, ref } from 'vue';
import { repository } from '@/utils/db';

const props = defineProps<{
  log: ExerciseLog
  idx: number
}>();

const emit = defineEmits<{
  (e: 'logDeleted', data: ExerciseLog): void
}>()

const logWeight: Ref<number | undefined> = ref(props.log.weight);
const logReps: Ref<number | undefined> = ref(props.log.reps);
const showUpdateRow = ref(false);

const updateRowVisibility = (visible: boolean) => {
  showUpdateRow.value = visible;
}

const updateLog = () => {
  // update log
  props.log.weight = logWeight.value;
  props.log.reps = logReps.value;

  // first get from db cause we need rev to update
  repository.exerciseLogs.get(props.log.id)
    .then(function (res) {
      const newLog = ExerciseLog.from_obj(res.logs[0]);
      newLog.weight = logWeight.value;
      newLog.reps = logReps.value;
      repository.exerciseLogs.put(newLog)
        .then(() => {
          console.log("log updated");
        })
        .catch((err) => {
          throw err;
        });
    })
    .catch((err) => {
      console.error(err);
    });

  updateRowVisibility(false);
}

const deleteLog = () => {
  // first get from db cause we need rev to delete
  repository.exerciseLogs.get(props.log.id)
    .then(function (res) {
      repository.exerciseLogs.remove({id: res.logs[0].id, rev: res.logs[0].rev})
        .then((r) => {
          console.log(r);
          emit('logDeleted', props.log)
        })
        .catch((err) => {
          throw err;
        });
    })
    .catch((err) => {
      console.error(err);
    });

  updateRowVisibility(false);
}

</script>

<style scoped>
.set-row {
  font-size: 1.3em;
}

.set-container {
  height: 26px;
  font-weight: bold;
}

ion-col {
  display: flex;
  align-items: flex-end;
}

ion-col:first-child {
  padding-left: 0;
  align-content: end;
}

ion-col:last-child {
  padding-right: 0;
  /* justify-content: end; */
}

ion-input.input-number {
  max-width: 50px;
  min-height: 0;
}

.btn-confirm-set {
  width: 40px;
  height: 30px;
  font-size: 10px;
}

.update-row ion-button {
  width: 100%;
  font-size: 16px;
}
</style>