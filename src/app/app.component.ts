import { Component, OnInit } from '@angular/core';
declare var require: any;
import * as XLSX from 'xlsx';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Food } from './models/food';
import { CommonModule } from '@angular/common';
import { FoodItemComponent } from './components/food-item/food-item.component';
import { FormsModule } from '@angular/forms';

type AOA = any[][];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [HttpClientModule, CommonModule, FoodItemComponent, FormsModule],
})
export class AppComponent implements OnInit {
  foods: any[] = [];
  foodsDisplayed: any[] = [];
  toggledFoods: any[] = [];
  relativeToggle: boolean = false;

  async ngOnInit() {
    this.http.get<Food[]>('./assets/foods.json').subscribe({
      next: (data: any) => {
        this.foods = data.Foods;
      },
    });

    let toggleditemsstring = localStorage.getItem('selected-list');
    /*let relativeToggle = localStorage.getItem('relative');

    if (relativeToggle === 'true') {
      this.relativeToggle = true;
    }
    if (relativeToggle === 'false') {
      this.relativeToggle = false;
    }*/

    if (toggleditemsstring != null) {
      this.toggledFoods = JSON.parse(toggleditemsstring);
      this.sortToggled();
    }
  }

  sortToggled() {
    this.toggledFoods.sort((a, b) => {
      return b['PPARIndex'] - a['PPARIndex'];
    });
  }

  toggleRelative(event: any) {
    localStorage.setItem('relative', this.relativeToggle.toString());
  }

  search(event: any) {
    if (!event.target.value) {
      this.foodsDisplayed = this.foods;
      return;
    }

    if (event.target.value.length > 2) {
      this.foodsDisplayed = this.foods.filter((food) => {
        let foodName: string = food['Food Item'];
        if (!foodName) return false;
        return foodName.toLowerCase().includes(event.target.value);
      });
    }
  }

  constructor(private http: HttpClient) {}
}
