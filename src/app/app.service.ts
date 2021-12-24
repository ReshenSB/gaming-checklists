import { Injectable } from '@angular/core';
import { SavedGames } from './app.interface';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor() {
    if (!window.indexedDB) {
      console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
    } else {
      console.log("IndexedDB is supported");
    }
    const request = indexedDB.open('game_data', 1);
    request.onupgradeneeded = (ev: any) => {
      console.log('making a new object store');
      const db: IDBDatabase = ev.target.result;
      if (!db.objectStoreNames.contains('playthroughs')) {
        db.createObjectStore('playthroughs', { autoIncrement: true })
          .createIndex('playthroughIndex', ['game', 'name'], { unique: true });
      }
    }
  }

  async getSavedGames(): Promise<SavedGames[]> {
    return await new Promise((resolve, reject) => {
      const request = indexedDB.open('game_data', 1);
      request.onsuccess = (ev: any) => {
        const db: IDBDatabase = ev.target.result;
        const txn = db.transaction('playthroughs', 'readonly');
        const store = txn.objectStore('playthroughs');

        let query = store.getAll();

        // handle success case
        query.onsuccess = (event: any) => resolve(event.target.result);

        // handle the error case
        query.onerror = (event: any) => reject(event.target.error);

        // Close the database once the transaction completes
        txn.oncomplete = () => db.close();
      }
    });
  }

  getGames(): string[] {
    return [
      'Skyrim',
      'Final Fantasy X',
      'Final Fantasy X-2',
    ]
  }

  addPlaythrough(playthrough: SavedGames): void {
    const request = indexedDB.open('game_data', 1);
    request.onsuccess = (ev: any) => {
      const db = ev.target.result;
      const txn = db.transaction('playthroughs', 'readwrite');
      const store = txn.objectStore('playthroughs');
      let query = store.put(playthrough);

      // handle success case
      query.onsuccess = (event: any) => console.log(event);

      // handle the error case
      query.onerror = (event: { target: IDBRequest; }) => {
        if (event.target.error?.name === "ConstraintError") {
          console.log('Playthrough already exists');
          return;
        }
        console.log(event.target.error)
      }

      // Close the database once the transaction completes
      txn.oncomplete = () => db.close();
    }
  };

  deletePlaythrough(playthrough: SavedGames): void {
    const request = indexedDB.open('game_data', 1);
    request.onsuccess = (ev: any) => {
      const db: IDBDatabase = ev.target.result;
      const txn = db.transaction('playthroughs', 'readwrite');
      const store = txn.objectStore('playthroughs');
      let query = store.index('playthroughIndex').getKey([playthrough.game, playthrough.name]);

      // handle success case
      query.onsuccess = (event: any) => store.delete(event.target.result);

      // handle the error case
      query.onerror = (event: any) => console.log(event.target.error);

      // Close the database once the transaction completes
      txn.oncomplete = () => db.close();
    }
  };

}
