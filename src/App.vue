<template>
  <ion-app>
    <ion-split-pane content-id="main-content" disabled>
      <ion-menu content-id="main-content" type="overlay">
        <ion-content>
          <ion-list>
            <ion-list-header lines="full" class="menu-title">
              YAWT
              <span class="menu-subtitle">Yet Another Workout Tracker</span>
            </ion-list-header>
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
  newspaperOutline,
  barbell
} from 'ionicons/icons';
import { useRoute } from 'vue-router';

const appPages: Map<string, { [key: string]: string }> = new Map([
  ['/start', {
    title: "Workout Logs",
    iosIcon: newspaperOutline,
    mdIcon: newspaperOutline,
  }],
  ['/exercises', {
    title: "Exercises",
    iosIcon: barbell,
    mdIcon: barbell,
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
ion-menu ion-item {
  cursor: pointer;
}

ion-menu ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

.menu-title {
  padding-bottom: 6px;
  font-size: 28px;
}

.menu-subtitle {
  padding-bottom: 4px;
  padding-left: 4px;
  font-size: 10px;
  font-weight: normal;
}
</style>