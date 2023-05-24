import PouchDB from 'pouchdb'
import find from 'pouchdb-find';
import rel from 'relational-pouch';
import { ExerciseRepository } from '@/repository/exerciseRepository';
import { ExerciseLogRepository } from '@/repository/exerciseLogRepository';

PouchDB
  .plugin(find)
  .plugin(rel);
const yawtDB = new PouchDB('yawt-db') as PouchDB.RelDatabase;
yawtDB.setSchema([
  {
    singular: 'exercise',
    plural: 'exercises',
    relations: {
      logs: { hasMany: 'log' }
    }
  },
  {
    singular: 'log',
    plural: 'logs',
    relations: {
      exercise: { belongsTo: 'exercise' }
    }
  },
]);

export namespace repository {
  export const exercises= new ExerciseRepository(yawtDB);
  export const exerciseLogs = new ExerciseLogRepository(yawtDB);
}