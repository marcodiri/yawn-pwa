/**
 * Represents a log for single set of an exercise,
 * grouped with other sets for the the same session by `group`.
 */
export class ExerciseLog {
  public id: string;
  public date: string;

  constructor(
    public exercise: string,
    public groupId: number,
    date: Date,
    public weight?: number,
    public reps?: number,
    public rpe?: number,
  ) {
    this.date = date.toString();
    this.id = ExerciseLog.build_id(
      this.date,
      this.exercise
    );
  }

  static from_obj(obj: Object) {
    if (
      obj.hasOwnProperty("exercise") &&
      obj.hasOwnProperty("groupId") &&
      obj.hasOwnProperty("date")
    ) {
      return new this(
        (obj as any).exercise,
        (obj as any).groupId,
        (obj as any).date,
        (obj as any).weight,
        (obj as any).reps,
        (obj as any).rpe,
      );
    } else {
      throw new TypeError("obj should have the same properties as ExerciseLog");
    }
  }

  static build_id(
    date: string,
    exercise: string
  ) {
    return (date + "_" +
      exercise + "_" +
      (new Date()).getTime().toString()).replaceAll(" ", "");
  }
};