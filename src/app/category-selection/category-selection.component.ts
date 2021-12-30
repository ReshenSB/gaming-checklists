import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('FileUpload')
  fileUpload!: ElementRef<HTMLInputElement>;

  savedGame!: SavedGames;
  details: GameData[] = [];
  category = '';
  categoryIndex: number = 0;
  key = 0;
  showHidden = false;

  cardHeight!: number;
  formCardHeight!: number;

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
    // this.details[0].items = this.details[0].items.map((item: any) => Object.assign(item, { 'value': { 'obtained': false } }))
    // console.log(savedGame)
    // console.log(this.details)
  }

  private calculateProgress(): void {
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
    this.save();
  }

  public changeCategory(category: string): void {
    this.calculateProgress();
    if (category === '') {
      this.formCardHeight = window.scrollY;
      this.category = '';
      this.cdr.detectChanges();
      window.scrollTo(0, this.cardHeight || 0);
      return;
    }
    this.cardHeight = window.scrollY;
    this.categoryIndex = this.details.findIndex((item) => item.category === category);
    this.category = category;
    this.cdr.detectChanges();
    window.scrollTo(0, this.formCardHeight || 0);
  }

  public save(customValue?: string): void {
    if (customValue !== undefined) {
      localStorage.setItem(this.key.toString(), customValue);
      this.details = JSON.parse(customValue);
      return;
    }
    localStorage.setItem(this.key.toString(), JSON.stringify(this.details));
  }

  public download(): void {
    this.save();
    var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.details));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', this.savedGame.name + '.json');
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  public upload(): void {
    this.fileUpload.nativeElement.oninput = (ev: Event) => {
      if (this.fileUpload.nativeElement.files?.length === 1) {
        this.fileUpload.nativeElement.files[0].text().then((val) => this.save(val));
      }
    }
    this.fileUpload.nativeElement.click();
  }

}
