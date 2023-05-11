<template>
  <ion-app>
    <ion-split-pane content-id="main-content" disabled>
      <ion-menu content-id="main-content" type="overlay">
        <ion-content>
          <ion-list id="inbox-list">
            <ion-list-header>Menu</ion-list-header>
            <ion-menu-toggle :auto-hide="false" v-for="(p, i) in appPages" :key="i">
              <ion-item @click="selectedIndex = i" router-direction="root" :router-link="p.url"
                lines="none" :detail="false" class="hydrated" :class="{ selected: selectedIndex === i }">
                <ion-icon aria-hidden="true" slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>
                <ion-label>{{ p.title }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main-content" />
    </ion-split-pane>
  </ion-app>
</template>

<script setup lang="ts">
import {
  IonApp,
  IonRouterOutlet,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonSplitPane
} from '@ionic/vue';
import { ref, provide, watchEffect } from 'vue';
import {
  mailOutline,
  mailSharp,
  paperPlaneOutline,
  paperPlaneSharp,
} from 'ionicons/icons';

const appPages = [
  {
    title: 'Current Plan',
    url: '/plan/current',
    iosIcon: mailOutline,
    mdIcon: mailSharp,
  },
  {
    title: 'My Plans',
    url: '/plan/myplans',
    iosIcon: paperPlaneOutline,
    mdIcon: paperPlaneSharp,
  },
];

const selectedIndex = ref(0);
const pageTitle = ref()
watchEffect(() => {
  pageTitle.value = appPages[selectedIndex.value].title
})
provide('pageTitle', pageTitle);

const path = window.location.pathname.split('plan/')[1];
if (path !== undefined) {
  selectedIndex.value = appPages.findIndex((page) =>
    page.url.split('plan/')[1] === path.toLowerCase()
  );
}

</script>

<style scoped>
ion-menu.md ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu.md ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}
</style>