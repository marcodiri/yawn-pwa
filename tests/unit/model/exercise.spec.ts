import { Exercise } from '@/model/exercise'
import { describe, expect, test } from 'vitest'

describe('Exercise', () => {
  test('build_id', () => {
    const res = Exercise.build_id(" T e   st", "Exa  mple  ", " Str ing ", "! ! ! ");
    expect(res).toBe("Test/Example/String/!!!");
  }),
  test('constructor generates id', () => {
    const Ex = Exercise;
    const ex = new Ex(
      "Bench Press (Barbell)",
      Ex.MuscleGroup.Chest,
      [
        Ex.MuscleGroup.Triceps,
        Ex.MuscleGroup.Shoulders
      ],
      Ex.Equipment.Barbell
    );
    expect(ex._id).toBe("exercise/Chest/Barbell/BenchPress(Barbell)");
  }),
  test('constructor from object', () => {
    const name = "test_name",
      muscle_primary = "test_muscle",
      muscle_secondary = ["test_muscle1", "test_muscle2"],
      equipment = "test_equipment";
    const ex = Exercise.from_obj({
      "name": name,
      "muscle_primary": muscle_primary,
      "muscle_secondary": muscle_secondary,
      "equipment": equipment
    });
    expect(ex._id).toBe("exercise/test_muscle/test_equipment/test_name");
    expect(ex.muscle_secondary).toBe(muscle_secondary);
  })
})
