import { createApp } from 'vue';
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

import PouchDB from 'pouchdb'
import { ExerciseRepository } from './repository/exerciseRepository';
import defaultExercises from '@/utils/initExercises';

const app = createApp(App)
  .use(IonicVue)
  .use(router);

const exercisesDB = new PouchDB('exercises');
const exerciseRepo = new ExerciseRepository(exercisesDB);
exerciseRepo.putList(defaultExercises).catch((err) => {
  console.error(err.message);
});
app.provide('repoExercises', exerciseRepo);

router.isReady().then(() => {
  app.mount('#app');
});