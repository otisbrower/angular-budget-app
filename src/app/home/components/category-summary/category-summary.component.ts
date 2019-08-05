import {AfterContentChecked, Component, ElementRef, OnInit} from '@angular/core';
import {FirebaseService} from '../../../services/firebase.service';
// import * as canvasjs from '../../../../../node_modules/canvasjs/src/charts'
import * as canvasjs from '../../../../../node_modules/canvasjs/canvasjs.min'

@Component({
  selector: 'app-category-summary',
  templateUrl: './category-summary.component.html',
  styleUrls: ['./category-summary.component.css']
})
export class CategorySummaryComponent implements OnInit, AfterContentChecked {

  budgetCategories: object;
  budgetPlan: object;
  currentMonthTransactions: Array<object>;
  selectedCategory : any;
  excludeList=['Transfer'];
  pieChartData:number[] = [];
  pieChartType:string = 'pie';
  pieChartLegend= true;

  chartData: object = {};
  retrievedTypes: boolean = false;
  

  constructor(private firebaseService: FirebaseService,
              private elementRef: ElementRef) { }

  ngOnInit() {
    this.firebaseService.currentMonthTransactions().subscribe(resp =>{
      this.currentMonthTransactions = resp as Array<object>;
      console.log(this.currentMonthTransactions);
      
    });
    this.firebaseService.retrieveBudgetPlan().subscribe(resp => {
      this.budgetPlan = resp as object;
      console.log(this.budgetPlan);
    });
    // this.budgetCategories = this.firebaseService.getBudgetCategoryTypes();
    // this.testChart('Clothing');    
  }

  ngAfterContentChecked(){
    if(this.firebaseService.getBudgetCategoryTypes() && !this.retrievedTypes){
      this.retrievedTypes = true;
      this.budgetCategories = this.firebaseService.getBudgetCategoryTypes();
      console.log(this.budgetCategories);
      this.createChartData();
    }
  }

  createChartData(){
    let subCats = {}
    for(let cat in this.budgetCategories){
      this.chartData[cat] = {};
      this.chartData[cat]['Available Budget'] = 0;
      for(let subCat of this.budgetCategories[cat]){
        this.chartData[cat][subCat] = 0;
      }
    }

    for(let planMainCat in this.budgetPlan){
      console.log(planMainCat);
      for(let planSubCat in this.budgetPlan[planMainCat]){
        this.chartData[planMainCat]['Available Budget'] += parseFloat(this.budgetPlan[planMainCat][planSubCat]);
      }
    }

    console.log(this.chartData);
    for(let trans of this.currentMonthTransactions){
      this.chartData[trans['mainCategory']][trans['subCategory']] += parseFloat(trans['transactionAmount']);      
    }
    console.log(this.chartData);
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
      this.pieChartData = [];
      for(let cat in subCats){
        this.pieChartData.push(subCats[cat]);
      }
    }

    let chart = new canvasjs.Chart("chartContainer", {
      theme: "light2",
      animationEnabled: true,
      exportEnabled: true,
      title:{
        text: "Monthly Expense"
      },
      data: [{
        type: "pie",
        innerRadius: 60,
        // showInLegend: true,
        toolTipContent: "<b>{label}</b>: ${y} (#percent%)",
        indexLabel: "{label}: {y}",
        dataPoints: [
          { y: 450, label: "Food" },
          { y: 120, label: "Insurance" },
          { y: 300, label: "Traveling" },
          { y: 800, label: "Housing" },
          { y: 150, label: "Education" },
          { y: 150, label: "Shopping"},
          { y: 250, label: "Others" }
        ]
      }]
    });
      
    chart.render();
  }


}
