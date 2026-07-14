const DB_NAME = "district-db";
const STORE_NAME = "pending-movies";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveMovieOffline(movie: any, adminId: number | string) {
  const db = await openDB();

  const tx = db.transaction(STORE_NAME, "readwrite");

  tx.objectStore(STORE_NAME).add({
    movie,
    adminId,
  });

  return tx.commit;
}

export const getPendingMovies =async ()=> {
  const db = await openDB();

  return new Promise<any[]>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");

    const request = tx.objectStore(STORE_NAME).getAll();

    request.onsuccess = () => resolve(request.result);

    request.onerror = () => reject(request.error);
  });
}



export const deletePendingMovie= async(id: number)=> {
  const db = await openDB();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");

    tx.objectStore(STORE_NAME).delete(id);

    tx.oncomplete = () => resolve();

    tx.onerror = () => reject(tx.error);
  });
}

