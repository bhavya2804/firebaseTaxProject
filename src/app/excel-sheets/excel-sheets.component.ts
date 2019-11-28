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

	constructor(dataProviderService: DataProviderService) {
		this.excelData = dataProviderService.getExcelObject();
	}

	ngOnInit() {}

	ConvertToCSV(objArray,sum) {
		let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
		let str = '';
		let row = "S.No,";
    let total=0;
		for (let index in objArray[0]) {
			row += index + ',';
		}
		row = row.slice(0, -1);
		str += row + '\r\n';
    let i=0;
    let line = '';
		for (i = 0; i < array.length; i++) {
      line+=(i+1);
			for (let index in array[i]) {
        if(index=='Amount')
          total+=array[i][index];
        array[i][index]='="'+array[i][index]+'"';
				if (line != '')
          line += ','
        line += array[i][index];
			}
      str += line + '\r\n';
      line='';
		}
    if(sum!= -1 && sum!=-2){
      total+=sum;
      str+=(i+1)+', ,BY SALE, , , , , , , ,'+sum;
      str +='\r\n';
    }
    if(sum==-1){
      str +='\r\n';
      str+=', , , , , , ,TOTAL, ,'+total;
      str +='\r\n';
    }
    else{
      str +='\r\n';
      str+=', , , , , , , ,TOTAL, ,'+total;
      str +='\r\n';
    }
		return str;
	}

	download(type,percent) {
    let csvData
    if(type=='PURCHASE' && percent=='12'){
      this.excelData[0].sort((a,b) => a.InvoiceDate.localeCompare(b.InvoiceDate));
      let csvData = this.ConvertToCSV(this.excelData[0],-1);
    }
    else if(type=='PURCHASE' && percent=='18'){
      this.excelData[1].sort((a,b) => a.InvoiceDate.localeCompare(b.InvoiceDate));
      let csvData = this.ConvertToCSV(this.excelData[1],-1);
    }
    else if(type=='SALE GST 3' && percent=='12'){
      this.excelData[2].sort((a,b) => a.InvoiceDate.localeCompare(b.InvoiceDate));
      let csvData = this.ConvertToCSV(this.excelData[2],-2);
    }
    else if(type=='SALE GST 3' && percent=='18'){
      this.excelData[3].sort((a,b) => a.InvoiceDate.localeCompare(b.InvoiceDate));
      let csvData = this.ConvertToCSV(this.excelData[3],-2);
    }
    else if(type=='SALE GST 1' && percent=='12'){
      this.excelData[4].sort((a,b) => a.InvoiceDate.localeCompare(b.InvoiceDate));
      let csvData = this.ConvertToCSV(this.excelData[4],this.excelData[6]);
    }
    else if(type=='SALE GST 1' && percent=='18'){
      this.excelData[5].sort((a,b) => a.InvoiceDate.localeCompare(b.InvoiceDate));
      let csvData = this.ConvertToCSV(this.excelData[5],this.excelData[7]);
    }

		let a = document.createElement("a");
		a.setAttribute('style', 'display:none;');
		document.body.appendChild(a);
		let blob = new Blob([csvData], {
			type: 'text/csv'
		});
		let url = window.URL.createObjectURL(blob);
		a.href = url;
		a.download = type+' '+percent+'%.csv';
		a.click();
	}

}
