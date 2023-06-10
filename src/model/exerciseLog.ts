/**
 * Represents a log for single set of an exercise,
 * grouped with other sets for the the same session by `group`.
 */
export class ExerciseLog {
  public id: string;
  public date: string;
  private __orm?: number;

  constructor(
    public exercise: string,
    public groupId: number,
    date: Date,
    public weight: number = 0,
    public reps: number = 0,
    public rpe?: number,
    id?: string,
    public rev?: string,
  ) {
    this.date = date.toISOString();
    if (id) this.id = id;
    else {
      this.id = ExerciseLog.build_id(
        date,
        this.exercise
      );
    }
  }

  get orm() {
    if (this.weight && (this.reps || 0) < 15) {
      return ExerciseLog.brzycki1RM(this.weight!, this.reps!)
    }
    return 0;
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
        new Date((obj as any).date),
        (obj as any).weight,
        (obj as any).reps,
        (obj as any).rpe,
        (obj as any).id,
        (obj as any).rev,
      );
    } else {
      throw new TypeError("obj should have the same properties as ExerciseLog");
    }
  }

  static build_id(
    date: Date,
    exercise: string
  ) {
    // date needs to be like 20230502 to be sortable
    const dateString = date.toISOString().split("T")[0];
    return (dateString + "_" +
      exercise + "_" +
      (new Date()).getTime().toString()).replaceAll(" ", "");
  }

  static brzycki1RM(weight: number, reps: number) {
    const orm = weight * (36 / (37 - reps));
    return Math.round((orm + Number.EPSILON) * 100) / 100
  }
};