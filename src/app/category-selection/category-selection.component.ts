import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { GameData, SavedGames } from '../app.interface';
import { AppService } from '../app.service';

@Component({
  selector: 'app-category-selection',
  templateUrl: './category-selection.component.html',
  styleUrls: ['./category-selection.component.scss']
})
export class CategorySelectionComponent implements OnInit {
  savedGame!: SavedGames;
  details: GameData[] = [];
  category = '';
  categoryIndex: number = 0;
  key = 0;

  constructor(
    private appService: AppService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getSavedGamesData()
  }

  async getSavedGamesData() {
    const playthrough = this.route.snapshot.queryParams as SavedGames;
    const savedGame = await this.appService.getSavedGameData(playthrough);
    this.savedGame = savedGame.value;
    this.key = savedGame.key
    const details = localStorage.getItem(this.key.toString());
    this.details = details !== null ? JSON.parse(details) : await firstValueFrom(this.appService.getGameDetails(this.savedGame.game));
    this.calculateProgress();
    // this.details[0].items = this.details[0].items.map((item: any) => Object.assign(item, { "value": { "obtained": false } }))
    // console.log(savedGame)
    // console.log(this.details)
  }

  calculateProgress(): void {
    for (const detail of this.details) {
      detail.progress = 0;
      let totalProgress = 0;
      let totalLength = 0;
      for (const field of Object.keys(detail.fields)) {
        switch (detail.fields[field]) {
          case 'checkbox': {
            const fields = detail.items.filter((item) => item.value[field] !== undefined)
            // detail.progress = fields.reduce((previous, current) => current.value[field.name] ? previous + 1 : previous, 0) / (fields.length * length);
            totalProgress += fields.reduce((previous, current) => current.value[field] ? previous + 1 : previous, 0);
            totalLength += fields.length;
            break;
          }
          default: {
            break;
          }
        }
      }
      detail.progress = totalLength === 0 ? 0 : totalProgress / totalLength;
    }
    localStorage.setItem(this.key.toString(), JSON.stringify(this.details))
  }

  changeCategory(category: string): void {
    this.calculateProgress();
    this.category = '';
    if (category === '') {
      return;
    }
    this.categoryIndex = this.details.findIndex((item) => item.category === category);
    this.category = category;
  }

}
