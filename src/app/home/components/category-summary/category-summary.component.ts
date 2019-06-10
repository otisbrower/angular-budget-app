import {AfterContentChecked, Component, ElementRef, OnInit} from '@angular/core';
import {FirebaseService} from '../../../services/firebase.service';
import {Chart, ChartOptions} from 'chart.js';
import { Label} from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels'

@Component({
  selector: 'app-category-summary',
  templateUrl: './category-summary.component.html',
  styleUrls: ['./category-summary.component.css']
})
export class CategorySummaryComponent implements OnInit, AfterContentChecked {

  budgetCategories: object;
  currentMonthTransactions: Array<object>;
  selectedCategory;
  excludeList=['Transfer', 'Debt Payments'];
  pieChartLabels: Label[] = [];
  pieChartData:number[] = [];
  pieChartType:string = 'pie';
  pieChartLegend= true;
  pieChartOptions:ChartOptions = {
    responsive: false,
    maintainAspectRatio: true,
    legend:{position:'bottom', fullWidth: true},
    };
  public pieChartColors = [
    {
      backgroundColor: ['red', 'blue', 'green', 'cyan', 'DarkSeaGreen', 'Indigo',
      'GreenYellow', 'MediumSlateBlue', 'PaleGreen', 'SaddleBrown', 'RosyBrown', 'SteelBlue'],
    },
  ];

  constructor(private firebaseService: FirebaseService,
              private elementRef: ElementRef) { }

  ngOnInit() {
    this.firebaseService.currentMonthTransactions().subscribe(resp =>{
      this.currentMonthTransactions = resp;
      console.log(this.currentMonthTransactions);
    });
    this.testChart('Clothing');
  }

  ngAfterContentChecked(){
    this.budgetCategories = this.firebaseService.getBudgetCategoryTypes();
  }

  testChart(event) {
    if(this.currentMonthTransactions) {
      let tempData = this.currentMonthTransactions.filter(function (item) {
        return item['mainCategory'] === event;
      });


      let subCats = {};
      for (let item in this.budgetCategories[event]) {
        subCats[this.budgetCategories[event][item]] = 0;
      }

      for (let item in tempData) {
        subCats[tempData[item]['subCategory']] = tempData[item]['transactionAmount'] + subCats[tempData[item]['subCategory']];
      }
      this.pieChartLabels = [];
      this.pieChartData = [];
      for(let cat in subCats){
        this.pieChartLabels.push(cat);
        this.pieChartData.push(subCats[cat]);
      }
    }
  }


}
