import { Exercise } from '@/model/exercise';
import { Ref, ref } from 'vue';

export class ExerciseRepository {
  private db: PouchDB.RelDatabase;
  private data?: Ref<Map<string, Exercise>>;

  constructor(db: PouchDB.RelDatabase) {
    this.db = db;
  }

  putList(exercises: Exercise[]) {
    return new Promise(async (resolve, reject) => {
      for (const ex of exercises) {
        await this.db.rel.save('exercise', ex).catch((err) => {
          reject(err);
        });
      }
      resolve(null);
    });
  }

  put(exercise: Exercise) {
    return this.db.rel.save('exercise', exercise);
  }

  getAll() {
    if (this.data) {
      return Promise.resolve(this.data);
    }

    return new Promise((resolve, reject) => {
      this.db.rel.find('exercise')
        .then((result) => {
          this.data = ref(new Map<string, Exercise>());
          result.exercises.forEach((row: any) => {
            const ex = Exercise.from_obj(row!);
            this.data!.value.set(ex.id, ex);
          });
          resolve(this.data);

          this.db
            .changes({ live: true, since: 'now', include_docs: true })
            .on('change', (change) => {
              if (change.id.startsWith('exercise')) {
                this.handleChange(change);
              }
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  handleChange(change: PouchDB.Core.ChangesResponseChange<{}>) {
    let changedKey: string | null = null;

    this.data!.value.forEach((val, key) => {
      if (val.id === change.id) {
        changedKey = key;
      }
    });

    //A document was deleted
    if (change.deleted) {
      this.data!.value.delete(changedKey!);
    } else {
      //A document was updated
      if (changedKey) {
        this.data!.value.set(changedKey!, Exercise.from_obj((change.doc! as any).data));
      }
      //A document was added
      else {
        const ex = Exercise.from_obj((change.doc! as any).data);
        this.data!.value.set(ex.id, ex);
      }
    }
  }
}
