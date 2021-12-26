import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategorySelectionComponent } from './category-selection/category-selection.component';
import { GameConfigComponent } from './game-config/game-config.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent 
  },
  { 
    path: 'overview', 
    component: CategorySelectionComponent 
  },
  { 
    path: 'config', 
    component: GameConfigComponent 
  },
  { 
    path: '*', 
    component: HomeComponent 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
