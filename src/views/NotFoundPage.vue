<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container">
        <p class="code">404</p>
        <h1 class="title">PAGE NOT FOUND</h1>
        <ion-button class="btn-home" @click="$router.replace('/start')">Back to Home</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonPage,
  IonButton} from '@ionic/vue';
</script>
  
<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

p.code {
  margin: 0;
  line-height: 64px;
  font-size: 64px;
  font-weight: 600;
}

h1.title {
  margin: 0;
  padding-top: 12px;
  letter-spacing: 2px;
  line-height: 20px;
  font-size: 20px;
  font-weight: 700;
}

.btn-home {
  margin-top: 32px;
}
</style>