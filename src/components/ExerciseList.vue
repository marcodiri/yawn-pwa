<template>
  <p v-for="ex in exList">{{ ex.name }}</p>
</template>

<script setup lang="ts">
import { Exercise } from '@/model/exercise';

defineProps<{
  exList: Exercise[]
}>()
</script>