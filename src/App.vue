<template>
  <ion-app>
    <ion-split-pane content-id="main-content" disabled>
      <ion-menu content-id="main-content" type="overlay">
        <ion-content>
          <ion-list>
            <ion-list-header>Menu</ion-list-header>
            <ion-menu-toggle :auto-hide="false" v-for="[key, page] in appPages" :key="key">
              <ion-item router-direction="root" :router-link="key" lines="none" :detail="false" class="hydrated"
                :class="{ selected: selectedKey === key }">
                <ion-icon aria-hidden="true" slot="start" :ios="page.iosIcon" :md="page.mdIcon"></ion-icon>
                <ion-label>{{ page.title }}</ion-label>
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
import { ref, provide, watch, Ref } from 'vue';
import {
  mailOutline,
  mailSharp,
  paperPlaneOutline,
  paperPlaneSharp,
} from 'ionicons/icons';
import { useRoute } from 'vue-router';

const appPages: Map<string, { [key: string]: string }> = new Map([
  ['/start', {
    title: "Workout Logs",
    iosIcon: mailOutline,
    mdIcon: mailSharp,
  }],
  ['/exercises', {
    title: "Exercises",
    iosIcon: paperPlaneOutline,
    mdIcon: paperPlaneSharp,
  }],
]);

const selectedKey: Ref<string | undefined> = ref();
const currentPageTitle: Ref<string | undefined> = ref();
provide('pageTitle', currentPageTitle);

const route = useRoute();
watch(
  () => route.name,
  () => {
    selectedKey.value = route.path;
    const currentPage = appPages.get(route.path);
    if (currentPage) {
      currentPageTitle.value = currentPage!.title;
    }
  },
  { immediate: true }
)
</script>

<style>
/* Prevent Pull-to-Refresh on mobile */
html {
  overscroll-behavior-y: contain;
}
</style>

<style scoped>
ion-menu.md ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu.md ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}
</style>