import { Ref, createApp, ref } from 'vue';
import App from './App.vue';
import router from './router';

import { IonicVue } from '@ionic/vue';

import '@ionic/vue/css/core.css';

import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/display.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';

import './theme/variables.css';

import { Exercise } from './model/exercise';
import { repository } from './utils/db'
import defaultExercises from '@/utils/initExercises';

const app = createApp(App)
  .use(IonicVue, {
    mode: 'ios',
  })
  .use(router);

const exList: Ref<Map<string, Exercise> | undefined> = ref();

repository.exercises.putList(defaultExercises)
  .catch((err) => {
    console.error(err.message);
  })
  .finally(() => {
    repository.exercises.getAll().then(data => {
      exList.value = (data as Ref<Map<string, Exercise>>).value;
    }).catch(err => {
      console.error(err);
    });
  });

app.provide('exercisesList', exList);

router.isReady().then(() => {
  app.mount('#app');
});