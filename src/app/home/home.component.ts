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
    playthrough: new FormControl(null, [Validators.required]), // Validator to check if name taken
    dateStarted: new FormControl(null, [Validators.required]),
    dateUpdated: new FormControl(null),
  })

  constructor(
    private appService: AppService
  ) { }

  ngOnInit(): void {
    // Get data for expansion panel
    this.savedGames = this.appService.getSavedGames();
    for (const savedGame of this.savedGames) {
      if (this.savedGamesData[savedGame.game] === undefined) {
        this.savedGamesData[savedGame.game] = [];
      }
      this.savedGamesData[savedGame.game].push({
        name: savedGame.playthrough,
        dateStarted: savedGame.dateStarted
      })
    }

    // Get data game selcetion
    this.gamesAvailable = this.appService.getGames();
  }

  log() {

  }

  public formGameChange(): void {
    const game = this.newGameForm.value.game[0];
    const playthrough = this.newGameForm.value.playthrough;
    console.log(!!playthrough, playthrough !== game);

    if (!!playthrough && playthrough !== this.previousGameSelection) {
      this.previousGameSelection = game;
      return;
    }
    this.previousGameSelection = game;
    this.newGameForm.get('playthrough')?.setValue(game);
  }

  public formSubmit(): void {
    if (this.newGameForm.invalid) {
      return;
    }
    this.newGameForm.get('dateUpdated')?.setValue(new Date());
    const newPlaythrough = this.newGameForm.value
    newPlaythrough.game = newPlaythrough.game[0]
    console.log(newPlaythrough)
    document.querySelector('form')?.reset()
  }
}
