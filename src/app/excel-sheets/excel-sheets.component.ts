import { Component, OnInit } from '@angular/core';
import firebase from '@firebase/app';
import '@firebase/database';
import { environment } from '../../environments/environment';
import { DataProviderService } from '../data-provider.service';

@Component({
	selector: 'app-excel-sheets',
	templateUrl: './excel-sheets.component.html',
	styleUrls: ['./excel-sheets.component.css'],
	providers: [DataProviderService]
})
export class ExcelSheetsComponent implements OnInit {

	excelData: any = [];
	dealers=[];
	company:any = 'none';
	fromDate: Date;
	toDate: Date = new Date();
	QueryData: any;
	percent: any = '18';
	gridApi: any;
	gridColumnApi: any;

	col12 = [
			{headerName: 'Company', field: 'company', sortable: true, filter: true },
			{headerName: 'GST/TIN', field: 'gstNO', sortable: true, filter: true },
			{headerName: 'Invoice Date', field: 'date', sortable: true, filter: true },
			{headerName: 'Invoice No', field: 'invoiceNo', filter: true},
			{headerName: 'Value', field: 'value' },
			{headerName: 'State Tax', field: 'stateTax' },
			{headerName: 'Central Tax', field: 'centralTax'},
			{headerName: 'Amount 12%', field: 'amount12', sortable: true, filter: true}
	];

	col18 = [
			{headerName: 'Company', field: 'company', sortable: true, filter: true },
			{headerName: 'GST/TIN', field: 'gstNO', sortable: true, filter: true },
			{headerName: 'Invoice Date', field: 'date', sortable: true, filter: true },
			{headerName: 'Invoice No', field: 'invoiceNo', filter: true},
			{headerName: 'Value', field: 'value' },
			{headerName: 'State Tax', field: 'stateTax' },
			{headerName: 'Central Tax', field: 'centralTax'},
			{headerName: 'Amount 18%', field: 'amount18', sortable: true, filter: true}
	];

	rowData:any;
	columnDefs : any;

	constructor(private dataProviderService: DataProviderService) {
		this.dealers= dataProviderService.getDealers();
	}

	ngOnInit() {}

	findGSTNO(company:string){
		for(let i=0;i<this.dealers.length;i++)
			if(this.dealers[i].company == company)
				return this.dealers[i].gstNo;
	}

	checkDate(object){
		if(this.fromDate && this.toDate){
			let actualDate = new  Date (object.date);
			let fromdate = new Date(this.fromDate);
			let todate = new Date(this.toDate);
			if(fromdate.getTime() <= actualDate.getTime() && todate.getTime() >= actualDate.getTime())
				return 1;
			else
				return 0;
		}
		return 1;
	}

	getObj(obj,out) {
		for (let prop in obj) {
				if (obj.hasOwnProperty(prop)) {
						if (typeof obj[prop] == "object"){
							 this.getObj(obj[prop],out);
						} else{
							if(this.checkDate(obj) && (this.company=='none' ||this.company == obj.company)){
									obj.gstNO = this.findGSTNO(obj.company);
								if(this.percent == '18' && obj.amount18!=0 && obj.amount12==0){
									obj.value = Math.floor(obj.amount18 / 1.18);
									obj.stateTax = Math.floor((obj.amount18 - obj.value) / 2);
									obj.centralTax = obj.stateTax;
									out.push(obj);
								}
								else if(this.percent == '12' && obj.amount12!=0 && obj.amount18==0){
									obj.value = Math.floor(obj.amount12 / 1.12);
									obj.stateTax = Math.floor((obj.amount12 - obj.value) / 2);
									obj.centralTax = obj.stateTax;
									out.push(obj);
								}
							}
							return;
						}
				}
		}
		return;
	}

	onGridReady(params) {
	    this.gridApi = params.api;
	    this.gridColumnApi = params.columnApi;
	}

	onBtnExport() {
		let params = this.getParams();
    this.gridApi.exportDataAsCsv(params);
  }

	getQueryData(data: any){
		let obj =[];
		this.getObj(data,obj);
		console.log(obj);
		this.columnDefs = this.percent == '12' ? this.col12 : this.col18;
    this.rowData = obj;
	}

	getData(){
		this.QueryData = [];
		this.dataProviderService.getQueryData().then(data => {
				this.getQueryData(data);
	  });
	}

	getParams() {
	  return {
	   	fileName:document.querySelector('#filename').value
	  };
	}

}
