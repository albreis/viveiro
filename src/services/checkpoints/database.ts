let connection: Promise<IDBDatabase> | undefined;
export function openCheckpointDatabase(): Promise<IDBDatabase> {
  if (connection) return connection;
  connection = new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB indisponível."));
      return;
    }
    const request = indexedDB.open("viveiro-experiments", 1);
    let cancelled = false;
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("records"))
        db.createObjectStore("records", { keyPath: "id" });
      if (!db.objectStoreNames.contains("index")) {
        const store = db.createObjectStore("index", { keyPath: "id" });
        store.createIndex("createdAt", "createdAt");
      }
      if (!db.objectStoreNames.contains("meta"))
        db.createObjectStore("meta", { keyPath: "id" });
    };
    request.onerror = () => {
      connection = undefined;
      reject(
        request.error ?? new Error("Não foi possível abrir os checkpoints."),
      );
    };
    request.onblocked = () => {
      cancelled = true;
      connection = undefined;
      reject(new Error("Outra aba está usando uma versão anterior do banco."));
    };
    request.onsuccess = () => {
      const db = request.result;
      if (cancelled) {
        db.close();
        return;
      }
      db.onversionchange = () => {
        db.close();
        connection = undefined;
      };
      resolve(db);
    };
  });
  return connection;
}
export function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("Leitura de checkpoint indisponível."));
  });
}
