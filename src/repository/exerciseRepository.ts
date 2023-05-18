import { Exercise } from '@/model/exercise';
import { Ref, ref } from 'vue';

export class ExerciseRepository {
  private db: PouchDB.Database;
  private data?: Ref<Map<string, Exercise>>;

  constructor(db: PouchDB.Database) {
    this.db = db;
  }

  putList(exercises: Exercise[]) {
    return this.db.bulkDocs(exercises);
  }

  put(exercise: Exercise) {
    return this.db.put(exercise);
  }

  getAll() {
    if (this.data) {
      return Promise.resolve(this.data);
    }

    return new Promise((resolve, reject) => {
      this.db
        .allDocs({
          include_docs: true,
        })
        .then((result) => {
          this.data = ref(new Map<string, Exercise>());
          result.rows.forEach((row) => {
            const ex = Exercise.from_obj(row.doc!);
            this.data!.value.set(ex._id, ex);
          });
          resolve(this.data);

          this.db
            .changes({ live: true, since: 'now', include_docs: true })
            .on('change', (change) => {
              this.handleChange(change);
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
      if (val._id === change.id) {
        changedKey = key;
      }
    });

    //A document was deleted
    if (change.deleted) {
      this.data!.value.delete(changedKey!);
    } else {
      //A document was updated
      if (changedKey) {
        this.data!.value.set(changedKey!, Exercise.from_obj(change.doc!));
      }
      //A document was added
      else {
        const ex = Exercise.from_obj(change.doc!);
        this.data!.value.set(ex._id, ex);
      }
    }
  }
}
