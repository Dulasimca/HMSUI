import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import * as Chart from 'chart.js';
import * as ChartDataLabels from 'chartjs-plugin-datalabels';
import { RestAPIService } from '../services/restAPI.service';
import { PathConstants } from '../helper/PathConstants';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  chartJs = Chart;
  chartLabelPlugin = ChartDataLabels;
  blockScreen: boolean;
  pieOptions: any;
  chart: ChartModule;
  pieChartOptions: any;
  pieChartLabels: string[];
  pieChartColor: any;
  pieChartData: any[];
  plugin: any;
  pieData: any;
  pieLabels: string[];
  bug_count: any = [];

  constructor( private locationStrategy: LocationStrategy, private restApi: RestAPIService) { }

  ngOnInit() {
    this.preventBackButton();
    this.onLoadChart();
  }

  onLoadChart() {
    this.pieLabels = ['Assigned', 'Completed', 'In-Progress', 'Open'];
    this.restApi.getByParameters(PathConstants.HMSReportURL, { 'value': 1 }).subscribe(res => {
      for (let i = 0; i < this.pieLabels.length; i++) {
        res.forEach(c => {
          if (this.pieLabels[i].toLowerCase() === c.bug_status.toLowerCase()) {
            this.bug_count.push(c.bug_count);
          }
        })
      }
      this.pieData = {
        labels: this.pieLabels,
        datasets: [
          {
            label: "Percentage",
            data: this.bug_count,
            backgroundColor: [
              "#f5953b",
              "#4fc437",
              "#f7ee39",
              "#f73e3e",
            ],
            hoverBackgroundColor: [
              "#f2851f",
              "#3abf1f",
              "#fff305",
              "#ed2d2d",
            ]
          }]
      };
     })
    //Pie chart show data inside each slices
    this.chartJs.plugins.unregister(this.chartLabelPlugin);
    this.plugin = ChartDataLabels;
    this.pieOptions = {
      plugins: {
        datalabels: {
          /* show value in percents */
          formatter: (value, ctx) => {
            let sum = 0;
            const dataArr = ctx.chart.data.datasets[0].data;
            dataArr.map(data => {
              sum += data;
            });
            const percentage = (value * 100 / sum);
            const calculatedPercent = percentage !== 0 ? percentage.toFixed(2) + '%' : '';
            return calculatedPercent;
          },
          color: '#fff',
          fontSize: 18
        }
      },
      legend: {
        position: 'bottom'
      }
    }
  }

  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    })
  }
}
