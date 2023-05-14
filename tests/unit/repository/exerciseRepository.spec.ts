/**
 * FIXME: multiple tests do not work: db gets destroyed at the end
 * of every test but inserting in the next test still conflicts.
 * FIXME: for some reason updating the db does not trigger the
 * change listener. It works fine in the browser.
 */

import PouchDB from 'pouchdb';
import { ExerciseRepository } from '@/repository/exerciseRepository'
import initExercises from '@/utils/initExercises';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

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
    const ret = await db.allDocs({include_docs: true});
    expect(ret.total_rows).toBeGreaterThan(0);
    ret.rows.forEach((row, idx) => {
      expect(row.id).toEqual(initExercises[idx]._id);
    });
  }),
  test('getAll gets initExercises from db', async (ctx) => {
    const db: PouchDB.Database = ctx["db"];
    await db.bulkDocs(initExercises);

    const repo = new ExerciseRepository(db);
    const data = await repo.getAll();
    const rawData = repo.getRawData();
    expect(data.length).toEqual(initExercises.length);
    expect(rawData.length).toEqual(initExercises.length);
    data.forEach((_ex, idx) => {
      expect(data[idx]._id).toEqual(initExercises[idx]._id);
      expect(rawData[idx]._id).toEqual(initExercises[idx]._id);
    });
  }),
  test('data is updated when db changes', async (ctx) => {
    const db: PouchDB.Database = ctx["db"];
    await db.bulkDocs(initExercises);

    const repo = new ExerciseRepository(db);
    const data = await repo.getAll();
    const rawData = repo.getRawData();
    expect(data.length).toEqual(initExercises.length);
    expect(rawData.length).toEqual(initExercises.length);

    const newEl = {_id: "test_id", test: "test"};
    await repo.put(newEl);
    await repo.getAll();
    const newRawData = repo.getRawData();
    expect(newRawData.length).toEqual(initExercises.length+1);
  })
})
