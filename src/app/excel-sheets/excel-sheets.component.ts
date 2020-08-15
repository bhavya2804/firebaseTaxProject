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
	customers=[];
	fromDate: Date;
	toDate: Date = new Date();
	QueryData: any;
	percent: any = '18';
	gridApi: any;
	gridColumnApi: any;
	filename: any;
	selectType: any;
	gstType: any;
	totalAmount = 0;

	col12 = [
			{headerName: 'Company/Customer', field: 'name', sortable: true, filter: true },
			{headerName: 'GST/TIN', field: 'gstNO', sortable: true, filter: true },
			{headerName: 'Invoice Date', field: 'date', sortable: true, filter: true },
			{headerName: 'Invoice No', field: 'invoiceNo', filter: true},
			{headerName: 'Value', field: 'value' },
			{headerName: 'State Tax', field: 'stateTax' },
			{headerName: 'Central Tax', field: 'centralTax'},
			{headerName: 'Amount 12%', field: 'amount12', sortable: true, filter: true}
	];

	col18 = [
			{headerName: 'Company/Customer', field: 'name', sortable: true, filter: true },
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
		this.customers= dataProviderService.getCustomers();
	}

	ngOnInit() {}

	findGSTNO(name:string){
		if(this.selectType == 'purchase'){
			for(let i=0;i<this.dealers.length;i++)
				if(this.dealers[i].company == name)
					return this.dealers[i].gstNo;
		}
		else{
			for(let i=0;i<this.customers.length;i++)
				if(this.customers[i].name == name)
					return this.customers[i].gstNo;
		}
	}

	applyDateFilter(x){
		if(!this.fromDate)
			return 1;
		let tempDate = new Date(Number(Date.parse(x.date)));
		if(tempDate.getTime() >= this.fromDate.getTime() && tempDate.getTime() <= this.toDate.getTime())
			return 1;
		return 0;
	}

	getObj(obj,out) {
		for (let prop in obj) {
				if (obj.hasOwnProperty(prop)) {
						if (typeof obj[prop] == "object"){
							 this.getObj(obj[prop],out);
						} else{
							if(this.applyDateFilter(obj))
							{
								if(obj.name){
										obj.gstNO = this.findGSTNO(obj.name);
								}
								if(this.selectType=='sales' && this.gstType == 1 && !obj.invoiceNo){
									if(this.percent == '18')
										this.totalAmount += obj.amount18;
									else
										this.totalAmount += obj.amount12;
								}
								else{
									if(this.percent == '18' && obj.amount18!=0){
										obj.value = Math.floor(obj.amount18 / 1.18);
										obj.stateTax = Math.floor((obj.amount18 - obj.value) / 2);
										obj.centralTax = obj.stateTax;
										out.push(obj);
									}
									else if(this.percent == '12' && obj.amount12!=0){
										obj.value = Math.floor(obj.amount12 / 1.12);
										obj.stateTax = Math.floor((obj.amount12 - obj.value) / 2);
										obj.centralTax = obj.stateTax;
										out.push(obj);
									}
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
		if(this.fromDate)this.fromDate = new Date(Number(Date.parse(this.fromDate)));
		if(this.toDate)this.toDate = new Date(Number(Date.parse(this.toDate)));
		let obj =[];
		this.getObj(data,obj);
		this.columnDefs = this.percent == '12' ? this.col12 : this.col18;
		if(this.selectType=='sales' && this.gstType == '1'){
			if(this.percent=='18')
				obj.push({name:'By Sale',amount18:this.totalAmount});
			else
				obj.push({name:'By Sale',amount12:this.totalAmount});
		}
    this.rowData = obj;
	}

	getData(){
		this.QueryData = [];
		this.dataProviderService.getQueryData(this.selectType).then(data => {
				this.getQueryData(data);
	  });
	}

	getParams() {
	  return {
	   	fileName:this.filename
	  };
	}

}
