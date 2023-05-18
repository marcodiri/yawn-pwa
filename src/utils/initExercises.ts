import { Exercise } from '@/model/exercise';

export default [
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
  new Exercise(
    "Pull Up",
    Exercise.RecordType.WaR,
    Exercise.Equipment.WeightPlate,
    Exercise.MuscleGroup.Back,
    [
      Exercise.MuscleGroup.Biceps,
    ]
  ),
];