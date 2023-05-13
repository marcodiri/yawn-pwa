import { Exercise } from '@/model/exercise';

export class ExerciseRepository {
  private db: PouchDB.Database;
  private rawData?: Object[];
  private data?: Exercise[];

  constructor(db: PouchDB.Database) {
    this.db = db;
  }
  
  putExercises(exercises: Exercise[]) {
    return this.db.bulkDocs(exercises);
  }

  put(exercise: Exercise) {
    return this.db.put(exercise);
  }
  
  getRawData() {
    return this.rawData;
  }

  getExercises() {
    if (this.data) {
      return Promise.resolve(this.data);
    }

    return new Promise((resolve, reject) => {
      this.db
        .allDocs({
          include_docs: true,
        })
        .then((result) => {
          this.rawData = [];
          this.data = [];
          result.rows.forEach((row) => {
            this.rawData!.push(row.doc!);
            this.data!.push(Exercise.from_obj(row.doc!));
          });

          resolve(this.data);

          this.db
            .changes({ live: true, since: 'now', include_docs: true })
            .on('change', (change) => {
              this.handleChange(change);
            }).on('complete', function(info) {
              // changes() was canceled
              console.log(info);
            }).on('error', function (err) {
              console.log(err);
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

    this.data!.forEach((doc, index) => {
      if (doc._id === change.id) {
        changedDoc = doc;
        changedIndex = index;
      }
    });

    //A document was deleted
    if (change.deleted) {
      this.rawData!.splice(changedIndex!, 1);
      this.data!.splice(changedIndex!, 1);
    } else {
      //A document was updated
      if (changedDoc) {
        this.rawData![changedIndex!] = change.doc!;
        this.data![changedIndex!] = Exercise.from_obj(change.doc!);
      }
      //A document was added
      else {
        this.rawData!.push(change.doc!);
        this.data!.push(Exercise.from_obj(change.doc!));
      }
    }
  }
}
