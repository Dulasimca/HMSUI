import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import * as Chart from 'chart.js';
import * as ChartDataLabels from 'chartjs-plugin-datalabels';
import { RestAPIService } from '../services/restAPI.service';
import { PathConstants } from '../helper/PathConstants';
import { LocationStrategy } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { AnonymousSubject } from 'rxjs/internal/Subject';

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
  userInfo: any;
  allBugsCount: any = 0;
  myBugsCount: any = 0;
  headOfficeBugsCount: any = 0;
  regionBugsCount: any = 0;
  districtBugsCount: any = 0;
  shopBugsCount: any = 0;

  constructor(private locationStrategy: LocationStrategy, private restApi: RestAPIService,
    private authService: AuthService) { }

  ngOnInit() {
    this.preventBackButton();
    this.onLoadChart();
    this.userInfo = this.authService.getLoggedUser();
    this.onLoadGridValues();
  }

  onLoadGridValues() {
    this.restApi.getByParameters(PathConstants.DashboardTicketCount, { 'userId': this.userInfo.Id }).subscribe(data => {
      if (data.length !== 0 && data !== undefined && data !== null) {
        data.forEach((d, index) => {
          d.forEach(i => {
            if (index === 0) {
              this.allBugsCount = i.total_bugs;
            } else if (index === 1) {
              this.myBugsCount = i.user_bugs;
            } else {
              if (i.product_id === 2) {
                this.headOfficeBugsCount = i.product_bugs;
              } else if (i.product_id === 3) {
                this.regionBugsCount = i.product_bugs;
              } else if (i.product_id === 4) {
                this.districtBugsCount = i.product_bugs;
              } else if (i.product_id === 5) {
                this.shopBugsCount = i.product_bugs;
              }
            }
          })
          // this.allBugsCount = (data[0].total_bugs !== undefined && data[0].total_bugs !== null) ? data[0].total_bugs : 0;
          // this.myBugsCount = (data[1].user_bugs !== undefined && data[1].user_bugs !== null) ? data[1].user_bugs : 0;
          // if (data[2] !== undefined && data[2] !== null) {
          //   if (data[2].length !== 0) {
          //     data[2].forEach(i => {
          //       if (i.product_id === 2) {
          //         this.headOfficeBugsCount = i.product_bugs;
          //       } else if (i.product_id === 3) {
          //         this.regionBugsCount = i.product_bugs;
          //       } else if (i.product_id === 4) {
          //         this.districtBugsCount = i.product_bugs;
          //       } else if (i.product_id === 5) {
          //         this.shopBugsCount = i.product_bugs;
          //       }
          //     })
          //   }
          // }
          // }
        })
      }
    });

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
