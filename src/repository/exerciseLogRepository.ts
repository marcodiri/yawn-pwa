import { ExerciseLog } from '@/model/exerciseLog';
import { Ref, ref } from 'vue';

export class ExerciseLogRepository {
  private db: PouchDB.RelDatabase;
  private data?: Ref<Map<string, ExerciseLog[]>>;

  constructor(db: PouchDB.RelDatabase) {
    this.db = db;
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

  getDaysRange(currentDate: Date) {
    // fetch logs from 7 days before current to 7 days after
    const daysRange = 7;
    const dateBottom = new Date();
    dateBottom.setDate(currentDate.getDate() - daysRange);
    const dateTop = new Date();
    dateTop.setDate(currentDate.getDate() + daysRange);

    // if (this.data) {
    //   return Promise.resolve(this.data);
    // }

    const dateString1 = dateBottom.toISOString().split("T")[0];
    const dateString2 = dateTop.toISOString().split("T")[0];
    return new Promise((resolve, reject) => {
      this.db.rel.find('log', {
        startkey: dateString1,
        endkey: `${dateString2}\ufff0`
      })
        .then((result) => {
          this.data = ref(new Map<string, ExerciseLog[]>());

          result.logs.forEach((row: any) => {
            const dayOfLog = row.id.split("_")[0];
            if (!this.data!.value.has(dayOfLog)) {
              this.data!.value.set(dayOfLog, []);
            }
            const ex = ExerciseLog.from_obj(row!);
            this.data!.value.get(dayOfLog)!.push(ex);
          });

          this.sortDataByGroupId();

          resolve(this.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private sortDataByGroupId() {
    this.data!.value.forEach((val, _key) => {
      val.sort((a, b) => a.groupId - b.groupId);
    });
  }
}
