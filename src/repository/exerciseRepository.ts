import { Exercise } from '@/model/exercise';
import { Ref, ref } from 'vue';

export class ExerciseRepository {
  private db: PouchDB.Database;
  private data?: Ref<Exercise[]>;

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
          this.data = ref([]);
          result.rows.forEach((row) => {
            this.data!.value.push(Exercise.from_obj(row.doc!));
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
    let changedDoc = null;
    let changedIndex: number | null = null;

    this.data!.value.forEach((doc, index) => {
      if (doc._id === change.id) {
        changedDoc = doc;
        changedIndex = index;
      }
    });

    //A document was deleted
    if (change.deleted) {
      this.data!.value.splice(changedIndex!, 1);
    } else {
      //A document was updated
      if (changedDoc) {
        this.data!.value[changedIndex!] = Exercise.from_obj(change.doc!);
      }
      //A document was added
      else {
        this.data!.value.push(Exercise.from_obj(change.doc!));
      }
    }
  }
}
