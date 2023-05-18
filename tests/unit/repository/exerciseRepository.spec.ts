/**
 * FIXME: multiple tests do not work: db gets destroyed at the end
 * of every test but inserting in the next test still conflicts.
 * FIXME: for some reason updating the db does not trigger the
 * change listener. It works fine in the browser.
 */

import PouchDB from 'pouchdb';
import { Exercise } from '@/model/exercise'
import { ExerciseRepository } from '@/repository/exerciseRepository'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { Ref } from 'vue'

const initExercises = [
  new Exercise(
    "Bench Press (Barbell)",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Barbell,
    Exercise.MuscleGroup.Chest,
    [
      Exercise.MuscleGroup.Triceps,
      Exercise.MuscleGroup.Shoulders
    ]
  ),
  new Exercise(
    "Bench Press (Dumbbell)",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Dumbbell,
    Exercise.MuscleGroup.Chest,
    [
      Exercise.MuscleGroup.Triceps,
      Exercise.MuscleGroup.Shoulders
    ]
  ),
];

beforeEach((ctx) => {
  ctx["db"] = new PouchDB('testDB');
  console.log("testDB created");
});

afterEach(async (ctx) => {
  const res = await ctx["db"].destroy();
  if (res.ok)
    console.log("testDB destroyed");
  else
    console.error(res);
})

describe('ExerciseRepository', () => {
  test('putList puts initExercises in db', async (ctx) => {
    // const db: PouchDB.Database = ctx["db"];
    const db: PouchDB.Database = new PouchDB('testDB');
    const repo = new ExerciseRepository(db);
    await repo.putList(initExercises);
    const ret = await db.allDocs({ include_docs: true });
    expect(ret.total_rows).toBeGreaterThan(0);
    ret.rows.forEach((row, idx) => {
      expect(row.id).toEqual(initExercises[idx]._id);
    });
  }),
  test('getAll gets initExercises from db', async (ctx) => {
    const db: PouchDB.Database = ctx["db"];
    await db.bulkDocs(initExercises);

    const repo = new ExerciseRepository(db);
    const data: Ref<Map<string, Exercise>> = await repo.getAll();
    expect(data.value.size).toEqual(initExercises.length);
    data.value.forEach((_ex, key) => {
      const idx = [...data.value.keys()].indexOf(key);
      expect(data.value.get(key)._id).toEqual(initExercises[idx]._id);
    });
  })
})
