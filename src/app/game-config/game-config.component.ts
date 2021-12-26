import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-config',
  templateUrl: './game-config.component.html',
  styleUrls: ['./game-config.component.scss']
})
export class GameConfigComponent implements OnInit, OnDestroy {

  jsonForm = new FormGroup({
    category: new FormControl(''),
    description: new FormControl(''),
    fields: new FormGroup({}),
    items: new FormControl()
  });

  fields: { [key: string]: string } = {};
  value: { [key: string]: any } = {};
  fieldLabel = 'Obtained';
  fieldType = 'checkbox';

  output: { [key: string]: any } = {};
  outputString = '';

  private _jsonForm$: Subscription | undefined;

  constructor() { }

  ngOnInit(): void {
    this._jsonForm$ = this.jsonForm.valueChanges.subscribe((val) => {
      this.output['category'] = val['category'];
      this.output['description'] = val['description'];
      this.output['progress'] = 0;
      this.output['fields'] = this.fields;
      this.output['items'] = val['items'].split('\n').map((item: string) => {
        return {
          name: item.trim(),
          description: '',
          value: this.value
        }
      });
      this.outputString = JSON.stringify(this.output);
    });
  }

  ngOnDestroy(): void {
    if (this._jsonForm$ !== undefined) { this._jsonForm$.unsubscribe(); }
  }

  addLabel(): void {
    this.fields[this.fieldLabel] = this.fieldType;
    this.value[this.fieldLabel] = false;
  }

  resetLabel(): void {
    this.fields = {};
    this.value = {};
  }

}
