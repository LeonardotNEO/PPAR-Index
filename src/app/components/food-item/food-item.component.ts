import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Food } from 'src/app/models/food';

@Component({
  selector: 'app-food-item',
  templateUrl: './food-item.component.html',
  styleUrls: ['./food-item.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class FoodItemComponent implements OnInit, OnChanges {
  @Input() toggledFoods: any[] = [];
  @Input() food: any;
  @Input() sortFunction: any;
  @Input() setValues: boolean = true;
  @Input() fatRelativeToggle: boolean = true;

  ngOnInit(): void {
    this.calculatePPAR();

    if (((this.food['SatFa'] / this.food['Fat']) * 100).toFixed(1) != 'NaN') {
      this.food['SatFaPer'] = (
        (this.food['SatFa'] / this.food['Fat']) *
        100
      ).toFixed(1);
    }
    if (((this.food['MuFa'] / this.food['Fat']) * 100).toFixed(1) != 'NaN') {
      this.food['MuFaPer'] = (
        (this.food['MuFa'] / this.food['Fat']) *
        100
      ).toFixed(1);
    }
    if (((this.food['PuFa'] / this.food['Fat']) * 100).toFixed(1) != 'NaN') {
      this.food['PuFaPer'] = (
        (this.food['PuFa'] / this.food['Fat']) *
        100
      ).toFixed(1);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.calculatePPAR();
  }

  calculatePPAR() {
    if (!this.setValues) return;

    this.food['PPARIndex'] = 0;

    // pulls the PPAR up
    this.food['PPARIndex'] += this.food['C12:0'] / this.food['Fat'];
    this.food['PPARIndex'] += this.food['C16:1 sum'] / this.food['Fat'];
    this.food['PPARIndex'] += this.food['C18:1 sum'] / this.food['Fat'];
    this.food['PPARIndex'] += (this.food['C18:3n-3'] / this.food['Fat']) * 1.5;
    this.food['PPARIndex'] += (this.food['C18:2n-6'] / this.food['Fat']) * 0.25;

    // pulls the PPAR down
    this.food['PPARIndex'] -= (this.food['C14:0'] / this.food['Fat']) * 0.25;
    this.food['PPARIndex'] -= (this.food['C16:0'] / this.food['Fat']) * 0.5;
    this.food['PPARIndex'] -= (this.food['C18:0'] / this.food['Fat']) * 0.25;

    if (this.fatRelativeToggle) {
      this.food['PPARIndex'] =
        this.food['PPARIndex'] / (this.food['Fat'] / 100);
    }

    this.food['PPARIndex'] = (this.food['PPARIndex'] * 100).toFixed(1);

    console.log(this.toggledFoods);
  }

  toggleFood(food: Food) {
    if (this.toggledFoods.includes(food)) {
      this.toggledFoods.splice(this.toggledFoods.indexOf(food), 1);
    } else {
      this.toggledFoods.push(food);
    }

    localStorage.setItem('selected-list', JSON.stringify(this.toggledFoods));

    this.sortFunction();
  }

  isToggled(food: any) {
    return this.toggledFoods.includes(food);
  }
}
