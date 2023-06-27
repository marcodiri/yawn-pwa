import { Exercise } from '@/model/exercise';

export default [
  // Abs
  new Exercise(
    "Crunch",
    Exercise.RecordType.Reps,
    Exercise.Equipment.Bodyweight,
    Exercise.MuscleGroup.Abs,
    []
  ),
  new Exercise(
    "Crunch (Machine)",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Machine,
    Exercise.MuscleGroup.Abs,
    []
  ),
  new Exercise(
    "Hanging Knee Raises",
    Exercise.RecordType.Reps,
    Exercise.Equipment.Bodyweight,
    Exercise.MuscleGroup.Abs,
    []
  ),
  new Exercise(
    "Hanging Leg Raises",
    Exercise.RecordType.Reps,
    Exercise.Equipment.Bodyweight,
    Exercise.MuscleGroup.Abs,
    []
  ),

  //Back
  new Exercise(
    "Barbell Row",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Barbell,
    Exercise.MuscleGroup.Back,
    [
      Exercise.MuscleGroup.Biceps,
    ]
  ),
  new Exercise(
    "Chin Up",
    Exercise.RecordType.WaR,
    Exercise.Equipment.WeightPlate,
    Exercise.MuscleGroup.Back,
    [
      Exercise.MuscleGroup.Biceps,
    ]
  ),
  new Exercise(
    "Dumbbell Row",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Dumbbell,
    Exercise.MuscleGroup.Back,
    [
      Exercise.MuscleGroup.Biceps,
    ]
  ),
  new Exercise(
    "Lat Pulldown",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Cable,
    Exercise.MuscleGroup.Back,
    [
      Exercise.MuscleGroup.Biceps,
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

  // Biceps
  new Exercise(
    "Barbell Curl",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Barbell,
    Exercise.MuscleGroup.Biceps,
    []
  ),
  new Exercise(
    "Cable Curl",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Cable,
    Exercise.MuscleGroup.Biceps,
    []
  ),
  new Exercise(
    "Dumbbell Curl",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Dumbbell,
    Exercise.MuscleGroup.Biceps,
    []
  ),
  new Exercise(
    "EZ-Bar Curl",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Barbell,
    Exercise.MuscleGroup.Biceps,
    []
  ),
  
  // Chest
  new Exercise(
    "Cable Crossover",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Cable,
    Exercise.MuscleGroup.Chest,
    [
      Exercise.MuscleGroup.Shoulders
    ]
  ),
  new Exercise(
    "Flat Barbell Bench Press",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Barbell,
    Exercise.MuscleGroup.Chest,
    [
      Exercise.MuscleGroup.Triceps,
      Exercise.MuscleGroup.Shoulders
    ]
  ),
  new Exercise(
    "Flat Dumbbell Bench Press",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Dumbbell,
    Exercise.MuscleGroup.Chest,
    [
      Exercise.MuscleGroup.Triceps,
      Exercise.MuscleGroup.Shoulders
    ]
  ),
  new Exercise(
    "Flat Dumbbell Fly",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Dumbbell,
    Exercise.MuscleGroup.Chest,
    [
      Exercise.MuscleGroup.Shoulders
    ]
  ),
  new Exercise(
    "Incline Barbell Bench Press",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Barbell,
    Exercise.MuscleGroup.Chest,
    [
      Exercise.MuscleGroup.Triceps,
      Exercise.MuscleGroup.Shoulders
    ]
  ),
  new Exercise(
    "Incline Dumbbell Bench Press",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Dumbbell,
    Exercise.MuscleGroup.Chest,
    [
      Exercise.MuscleGroup.Triceps,
      Exercise.MuscleGroup.Shoulders
    ]
  ),
  new Exercise(
    "Machine Fly",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Machine,
    Exercise.MuscleGroup.Chest,
    [
      Exercise.MuscleGroup.Shoulders
    ]
  ),

  // Legs
  new Exercise(
    "Barbell Squat",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Barbell,
    Exercise.MuscleGroup.Legs,
    []
  ),
  new Exercise(
    "Calf Raise",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Machine,
    Exercise.MuscleGroup.Legs,
    []
  ),
  new Exercise(
    "Deadlift",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Barbell,
    Exercise.MuscleGroup.Legs,
    [
      Exercise.MuscleGroup.Back,
    ]
  ),
  new Exercise(
    "Leg Extension",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Machine,
    Exercise.MuscleGroup.Legs,
    []
  ),
  new Exercise(
    "Leg Press",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Machine,
    Exercise.MuscleGroup.Legs,
    []
  ),
  new Exercise(
    "Lying Leg Curl",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Machine,
    Exercise.MuscleGroup.Legs,
    []
  ),
  new Exercise(
    "Romanian Deadlift",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Barbell,
    Exercise.MuscleGroup.Legs,
    []
  ),
  new Exercise(
    "Sumo Deadlift",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Barbell,
    Exercise.MuscleGroup.Legs,
    []
  ),
  
  // Shoulders
  new Exercise(
    "Front Raise",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Dumbbell,
    Exercise.MuscleGroup.Shoulders,
    []
  ),
  new Exercise(
    "Lateral Raise",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Dumbbell,
    Exercise.MuscleGroup.Shoulders,
    []
  ),
  new Exercise(
    "Military Press",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Barbell,
    Exercise.MuscleGroup.Shoulders,
    []
  ),
  new Exercise(
    "Seated Dumbbell Press",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Dumbbell,
    Exercise.MuscleGroup.Shoulders,
    []
  ),
  
  // Triceps
  new Exercise(
    "Cable Triceps Kickback",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Cable,
    Exercise.MuscleGroup.Triceps,
    []
  ),
  new Exercise(
    "Close Grip Barbell Bench Press",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Barbell,
    Exercise.MuscleGroup.Triceps,
    []
  ),
  new Exercise(
    "Dip",
    Exercise.RecordType.WaR,
    Exercise.Equipment.WeightPlate,
    Exercise.MuscleGroup.Triceps,
    [
      Exercise.MuscleGroup.Chest,
      Exercise.MuscleGroup.Shoulders,
    ]
  ),
  new Exercise(
    "Lying Triceps Extension",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Barbell,
    Exercise.MuscleGroup.Triceps,
    []
  ),
  new Exercise(
    "Triceps Rope Pushdown",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Cable,
    Exercise.MuscleGroup.Triceps,
    []
  ),
  new Exercise(
    "Triceps Pushdown",
    Exercise.RecordType.WaR,
    Exercise.Equipment.Cable,
    Exercise.MuscleGroup.Triceps,
    []
  ),
];