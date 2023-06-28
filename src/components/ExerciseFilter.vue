<template>
  <ion-searchbar :debounce="300" @ionInput="filterExercisesSearch($event)"></ion-searchbar>
  <div class="filter-muscle-group">
    <ion-checkbox v-for="(group, _str, idx) in Exercise.MuscleGroup" @ion-change="filterExercisesCheckbox($event)"
      :value="idx">
      <span class="filter-checkbox-label" :class="{ 'filter-checkbox-checked': filterMuscleGroup[idx] }">
        {{ group }}
      </span>
    </ion-checkbox>
  </div>
</template>

<script setup lang="ts">
import { Exercise } from '@/model/exercise';
import {
  IonCheckbox,
  IonSearchbar,
  SearchbarCustomEvent,
  CheckboxCustomEvent
} from '@ionic/vue';
import { ref } from 'vue';

const props = defineProps<{
  exList?: Map<string, Exercise>
}>();
const emit = defineEmits<{
  (e: 'filter', data: Map<string, Exercise>): void
}>()

let query = '';
function filterExercisesSearch(event?: SearchbarCustomEvent) {
  let filteredExercises = props.exList!;

  if (event) {
    query = event.target.value!.toLowerCase();
    filteredExercises = filterExercisesCheckbox();
  }

  filteredExercises = new Map(
    [...filteredExercises]
      .filter(([k, ex]) => ex.name.toLowerCase().indexOf(query) > -1)
  );

  if (event) {
    emit('filter', filteredExercises);
  }

  return filteredExercises;
}

const filterMuscleGroup = ref(new Array(Object.keys(Exercise.MuscleGroup).length).fill(false));
function filterExercisesCheckbox(event?: CheckboxCustomEvent) {
  const filteredExercisesSearch = filterExercisesSearch();
  let filteredExercises: Map<string, Exercise>;

  if (event)
    filterMuscleGroup.value[event.detail.value] = event.detail.checked;

  const groups = Object.keys(Exercise.MuscleGroup);
  const filteredGroups: string[] = [];
  for (let i = 0; i < filterMuscleGroup.value.length; i++) {
    if (filterMuscleGroup.value[i]) {
      filteredGroups.push(groups[i])
    }
  }
  if (filteredGroups.length > 0) {
    filteredExercises = new Map(
      [...filteredExercisesSearch]
        .filter(([k, ex]) => filteredGroups.includes(ex.muscle_primary))
    );
  }
  else {
    filteredExercises = filteredExercisesSearch;
  }

  if (event) {
    emit('filter', filteredExercises);
  }

  return filteredExercises;
}
</script>

<style scoped>
div[class^='filter-'] {
  display: flex;
  flex-wrap: wrap;
  margin-left: 12px;
}

div[class^='filter-'] ion-checkbox {
  --size: 0;
  margin-bottom: 8px;
}

div[class^='filter-'] ion-checkbox::part(container) {
  border: none;
}

div[class^='filter-'] ion-checkbox .filter-checkbox-label {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  color: var(--ion-color-medium, #92949c);
  background-color: var(--ion-color-light, #f4f5f8);
}

div[class^='filter-'] ion-checkbox .filter-checkbox-checked {
  color: var(--ion-color-primary-contrast, #fff);
  background-color: var(--ion-color-primary-tint, #3880ff);
}
</style>