import type {
  Checkpoint,
  CheckpointDriver,
  CheckpointMeta,
} from "../../modules/persistence/types.ts";
import { openCheckpointDatabase, requestResult } from "./database.ts";
export class IndexedCheckpointDriver implements CheckpointDriver {
  async write(record: Checkpoint): Promise<boolean> {
    const db = await openCheckpointDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(["records", "index", "meta"], "readwrite"),
        records = tx.objectStore("records"),
        index = tx.objectStore("index"),
        meta = tx.objectStore("meta");
      let accepted = false;
      const current = meta.get("current");
      current.onsuccess = () => {
        const previous = current.result as
          { createdAt: number; sequence: number } | undefined;
        const newer =
          !previous ||
          record.createdAt > previous.createdAt ||
          (record.createdAt === previous.createdAt &&
            record.sequence > previous.sequence);
        if (!newer && record.kind === "auto") return;
        records.put(record);
        index.put({
          id: record.id,
          createdAt: record.createdAt,
          sequence: record.sequence,
          kind: record.kind,
          label: record.label,
          seed: record.payload.world.seed,
          tick: record.payload.world.tick,
        } satisfies CheckpointMeta);
        accepted = true;
        if (newer)
          meta.put({
            id: "current",
            recordId: record.id,
            createdAt: record.createdAt,
            sequence: record.sequence,
          });
        // Rotate only automatic entries created by this feature. Named checkpoints are retained.
        let autos = 0;
        const cursor = index.index("createdAt").openCursor(null, "prev");
        cursor.onsuccess = () => {
          const item = cursor.result;
          if (!item) return;
          const value = item.value as CheckpointMeta;
          if (value.kind === "auto" && ++autos > 8) {
            records.delete(value.id);
            item.delete();
          }
          item.continue();
        };
      };
      tx.oncomplete = () => resolve(accepted);
      tx.onabort = () =>
        reject(tx.error ?? new Error("Gravação de checkpoint interrompida."));
      tx.onerror = () => {};
    });
  }
  async read(id: string): Promise<Checkpoint | null> {
    const db = await openCheckpointDatabase();
    return (
      (await requestResult(
        db.transaction("records").objectStore("records").get(id),
      )) ?? null
    );
  }
  async list(): Promise<CheckpointMeta[]> {
    const db = await openCheckpointDatabase();
    const rows = (await requestResult(
      db.transaction("index").objectStore("index").getAll(),
    )) as CheckpointMeta[];
    return rows.sort(
      (a, b) => b.createdAt - a.createdAt || b.sequence - a.sequence,
    );
  }
  async current(): Promise<Checkpoint | null> {
    const db = await openCheckpointDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(["meta", "records"]),
        request = tx.objectStore("meta").get("current");
      let result: Checkpoint | null = null;
      request.onsuccess = () => {
        const id = request.result?.recordId;
        if (!id) return;
        const record = tx.objectStore("records").get(id);
        record.onsuccess = () => {
          result = record.result ?? null;
        };
      };
      tx.oncomplete = () => resolve(result);
      tx.onabort = () =>
        reject(tx.error ?? new Error("Leitura de checkpoint interrompida."));
    });
  }
}
