import { Component, OnInit, ViewChild } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MatAccordion } from '@angular/material/expansion';
import { AppService } from '../app.service';
import { SavedGames } from '../app.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  public savedGames: SavedGames[] = [];
  public savedGamesData: { [key: string]: any } = {};
  public gamesAvailable: string[] = [];

  previousGameSelection = '';

  public newGameForm: FormGroup = new FormGroup({
    game: new FormControl(null, [Validators.required]),
    name: new FormControl(null, [Validators.required]), // Validator to check if name taken
    dateStarted: new FormControl(null, [Validators.required]),
    dateUpdated: new FormControl(null),
  })

  constructor(
    private appService: AppService
  ) { }

  ngOnInit(): void {
    // Get data for expansion panel
    this.getSavedGamesData();
    // Get data game selcetion
    this.gamesAvailable = this.appService.getGames();
  }

  async getSavedGamesData() {
    this.savedGames = await this.appService.getSavedGames();
    console.log(this.savedGames)
    this.savedGamesData = {};
    for (const savedGame of this.savedGames) {
      if (this.savedGamesData[savedGame.game] === undefined) {
        this.savedGamesData[savedGame.game] = [];
      }
      this.savedGamesData[savedGame.game].push(savedGame)
    }
  }

  public formGameChange(): void {
    const game = this.newGameForm.value.game[0];
    const playthrough = this.newGameForm.value.name;

    if (!!playthrough && playthrough !== this.previousGameSelection) {
      this.previousGameSelection = game;
      return;
    }
    this.previousGameSelection = game;
    this.newGameForm.get('name')?.setValue(game);
  }

  public formSubmit(): void {
    if (this.newGameForm.invalid) { return; }
    this.newGameForm.get('dateUpdated')?.setValue(new Date());
    const newPlaythrough = this.newGameForm.value;
    newPlaythrough.game = newPlaythrough.game[0]
    this.appService.addPlaythrough(newPlaythrough);
    document.querySelector('form')?.reset();
    this.getSavedGamesData();
  }

  public deletePlaythrough(playthrough: SavedGames): void {
    console.log(playthrough)
    this.appService.deletePlaythrough(playthrough);
    this.getSavedGamesData();
  }

  public openPlaythrough(playthrough: SavedGames): void {
    
  }
}
