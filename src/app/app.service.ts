import { Injectable } from '@angular/core';
import { SavedGames } from './app.interface';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor() { }

  getSavedGames(): SavedGames[] {
    return [{
      'game': 'Skyrim',
      'playthrough': 'PS3 - 1',
      'dateStarted': new Date()
    }, {
      'game': 'Skyrim',
      'playthrough': 'PS4 - 1',
      'dateStarted': new Date()
    }, {
      'game': 'Final Fantasy X',
      'playthrough': 'PS3 - Expert Sphere grid',
      'dateStarted': new Date()
    }, {
      'game': 'Final Fantasy X',
      'playthrough': 'PS2 - Full Sphere grid',
      'dateStarted': new Date()
    }]
  }

  
  getGames(): string[] {
    return [
      'Skyrim',
      'Final Fantasy X',
      'Final Fantasy X-2',
    ]
  }
}
