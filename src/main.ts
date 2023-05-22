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

import PouchDB from 'pouchdb'
import find from 'pouchdb-find';
import rel from 'relational-pouch';
import { ExerciseRepository } from './repository/exerciseRepository';
import defaultExercises from '@/utils/initExercises';
import { Exercise } from './model/exercise';

const app = createApp(App)
  .use(IonicVue, {
    mode: 'ios',
  })
  .use(router);

PouchDB
  .plugin(find)
  .plugin(rel);
const yawtDB = new PouchDB('yawt-db') as PouchDB.RelDatabase;
yawtDB.setSchema([
  {
    singular: 'exercise',
    plural: 'exercises',
    relations: {
      logs: {hasMany: 'log'}
    }
  },
  {
    singular: 'log',
    plural: 'logs',
    relations: {
      exercise: {belongsTo: 'exercise'}
    }
  },
  {
    singular: 'workout',
    plural: 'workouts',
    relations: {
      log: {hasMany: 'log'}
    }
  }
]);
const exerciseRepo = new ExerciseRepository(yawtDB);
exerciseRepo.putList(defaultExercises).catch((err) => {
  console.error(err.message);
});
const exList: Ref<Map<string, Exercise> | undefined> = ref();

exerciseRepo.getAll().then(data => {
  exList.value = (data as Ref<Map<string, Exercise>>).value;
}).catch(err => {
  console.error(err);
});

app.provide('repoExercises', exerciseRepo);
app.provide('exercisesList', exList);

router.isReady().then(() => {
  app.mount('#app');
});