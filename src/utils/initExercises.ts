import { Exercise } from '@/model/exercise';

export default [
  new Exercise(
    "Bench Press (Barbell)",
    Exercise.Equipment.Barbell,
    Exercise.MuscleGroup.Chest,
    [
      Exercise.MuscleGroup.Triceps,
      Exercise.MuscleGroup.Shoulders
    ]
  ),
  new Exercise(
    "Bench Press (Dumbbell)",
    Exercise.Equipment.Dumbbell,
    Exercise.MuscleGroup.Chest,
    [
      Exercise.MuscleGroup.Triceps,
      Exercise.MuscleGroup.Shoulders
    ]
  )
];