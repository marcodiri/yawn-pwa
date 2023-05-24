import { ExerciseLog } from '@/model/exerciseLog';
import { Ref, ref } from 'vue';

export class ExerciseLogRepository {
  private db: PouchDB.RelDatabase;
  private data?: Ref<Map<string, ExerciseLog>>;
  private dataDay?: string;

  constructor(db: PouchDB.RelDatabase) {
    this.db = db;

    this.db
      .changes({ live: true, since: 'now', include_docs: true })
      .on('change', (change) => {
        if (change.id.startsWith('log')) {
          this.handleChange(change);
        }
      });
  }

  putList(logs: ExerciseLog[]) {
    return new Promise(async (resolve, reject) => {
      for (const log of logs) {
        await this.db.rel.save('log', log).catch((err) => {
          reject(err);
        });
      }
      resolve(null);
    });
  }

  put(log: ExerciseLog) {
    return this.db.rel.save('log', log);
  }

  getAllDay(date: Date) {
    const dateString = date.toDateString().replaceAll(" ", "");

    if (this.data && this.dataDay === dateString) {
      return Promise.resolve(this.data);
    }

    return new Promise((resolve, reject) => {
      this.db.rel.find('log', {
        startkey: dateString,
        endkey: `${dateString}\ufff0`
      })
        .then((result) => {
          this.dataDay = dateString;
          this.data = ref(new Map<string, ExerciseLog>());
          result.logs.forEach((row: any) => {
            const ex = ExerciseLog.from_obj(row!);
            this.data!.value.set(ex.id, ex);
          });
          resolve(this.data);
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
        this.data!.value.set(changedKey!, ExerciseLog.from_obj((change.doc! as any).data));
      }
      //A document was added
      else {
        const ex = ExerciseLog.from_obj((change.doc! as any).data);
        this.data!.value.set(ex.id, ex);
      }
    }
  }
}
