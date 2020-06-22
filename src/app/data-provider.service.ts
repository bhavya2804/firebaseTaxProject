import { Injectable } from '@angular/core';
import firebase from '@firebase/app';
import '@firebase/database';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class DataProviderService {

	constructor() {
	}

	getDealers() {
		let dealersData = [];
		let db = firebase.database().ref("dealers");
		db.on('child_added', function(snapshot) {
			dealersData.push({company:snapshot.key,gstNo:snapshot.val().gstNo});
		});
		return dealersData;
	}

	getCustomers() {
		let customersData = [];
		let db = firebase.database().ref("customers");
		db.on('child_added', function(snapshot) {
			customersData.push(snapshot.key);
		});
		return customersData;
	}

	getQueryData(){
		var ref = firebase.database().ref("purchase");
	  return ref.once('value').then(function(snapshot) {
	    return snapshot.val();
	  });
	}

	getExcelObject() {
		let Purchase18object = [];
		let Purchase12object = [];
		let saleGst318object = [];
		let saleGst312object = [];
		let saleGst118object = [];
		let saleGst112object = [];
		let saleSum12=0,saleSum18=0;

		let object = [];
		object[7]=0;
		object[6]=0;

		function getObj(obj,out) {
			for (let prop in obj) {
	        if (obj.hasOwnProperty(prop)) {
	            if (typeof obj[prop] == "object"){
	               getObj(obj[prop],out);
	            } else {
	              out.push(obj);
	              return;
	            }
	        }
	    }
			return;
		}

		//for purchase
		firebase.database().ref('purchase').once('child_added').then(function(snapshot) {
			snapshot.forEach(function(childsnapshot) {
				let out= childsnapshot.val();
				let obj=[];
				getObj(out,obj);
				for(let i=0;i<obj.length;i++){
					if (obj[i].amount18 != 0 && obj[i].completed==0) {
						let j = 1.18;
						let value = (obj[i].amount18 / j);
						let tax = (obj[i].amount18 - value) / 2;
						tax=Math.floor(tax);
						value=Math.floor(value);
						let gstIn = "0";
						let ref = firebase.database().ref('dealers/' + obj[i].company).once('value').then(function(snapshot) {
							gstIn = snapshot.val().gstNo;
							Purchase18object.push({
								'InvoiceDate': obj[i].date,
								'Name': obj[i].company,
								'GST/TIN': gstIn,
								'InvoiceNo': obj[i].invoiceNo,
								'Value': value,
								'percentage': '18',
								'State Tax': tax,
								'Central Tax': tax,
								'Amount': obj[i].amount18
							});
						});
					}
					if (obj[i].amount12 != 0 && obj[i].completed==0) {
						let j = 1.12;
						let value = (obj[i].amount12 / j);
						let tax = (obj[i].amount12 - value) / 2;
						tax=Math.floor(tax);
						value=Math.floor(value);
						let gstIn = "0";
						let ref = firebase.database().ref('dealers/' + obj[i].company).once('value').then(function(snapshot) {
							gstIn = snapshot.val().gstNo;
							Purchase12object.push({
								'InvoiceDate': obj[i].date,
								'Name': obj[i].company,
								'GST/TIN': gstIn,
								'InvoiceNo':obj[i].invoiceNo,
								'Value': value,
								'percentage': '12',
								'State Tax': tax,
								'Central Tax': tax,
								'Amount': obj[i].amount12
							});
						});
					}
				}

			});
		});

		// sales gst 3%, 1%
		firebase.database().ref('sales').orderByChild("date").once('value').then(function(snapshot) {
				snapshot.forEach(function(childsnapshot) {
						if (childsnapshot.val().invoiceNo && childsnapshot.val().amount12 && childsnapshot.val().completed==0) {
							let j = 1.12;
							let value = (childsnapshot.val().amount12 / j);
							let tax = (childsnapshot.val().amount12 - value) / 2;
							tax=Math.floor(tax);
							value=Math.floor(value);
							let gstNo = "0";
							let phoneNum = "0";
							let ref = firebase.database().ref('customers/' + childsnapshot.val().name).once('value').then(function(snapshot) {
								gstNo = snapshot.val().gstNo;
								phoneNum = snapshot.val().phoneNo;
								saleGst312object.push({
									'InvoiceDate': childsnapshot.val().date,
									'Name': childsnapshot.val().name,
									'GST/TIN': gstNo,
									'Phone Number': phoneNum,
									'InvoiceNo': childsnapshot.val().invoiceNo,
									'Value': value,
									'percentage': "12",
									'State Tax': tax,
									'Central Tax': tax,
									'Amount': childsnapshot.val().amount12
								});
								saleGst112object.push({
									'InvoiceDate': childsnapshot.val().date,
									'Name': childsnapshot.val().name,
									'GST/TIN': gstNo,
									'Phone Number': phoneNum,
									'InvoiceNo': childsnapshot.val().invoiceNo,
									'Value': value,
									'percentage': "12",
									'State Tax': tax,
									'Central Tax': tax,
									'Amount': childsnapshot.val().amount12
								});
							});
						}
						if (childsnapshot.val().invoiceNo && childsnapshot.val().amount18 && childsnapshot.val().completed==0) {
							let j = 1.18;
							let value = (childsnapshot.val().amount18 / j);
							let tax = (childsnapshot.val().amount18 - value) / 2;
							tax=Math.floor(tax);
							value=Math.floor(value);
							let gstNo = "0";
							let phoneNum = "0";
							let ref = firebase.database().ref('customers/' + childsnapshot.val().name).once('value').then(function(snapshot) {
								gstNo = snapshot.val().gstNo;
								phoneNum = snapshot.val().phoneNo;
								saleGst318object.push({
									'InvoiceDate': childsnapshot.val().date,
									'Name': childsnapshot.val().name,
									'GST/TIN': gstNo,
									'Phone Number': phoneNum,
									'Invoice No': childsnapshot.val().invoiceNo,
									'Value': value,
									'percentage': "18",
									'State Tax': tax,
									'Central Tax': tax,
									'Amount': childsnapshot.val().amount18
								});
								saleGst118object.push({
									'InvoiceDate': childsnapshot.val().date,
									'Name': childsnapshot.val().name,
									'GST/TIN': gstNo,
									'Phone Number': phoneNum,
									'Invoice No': childsnapshot.val().invoiceNo,
									'Value': value,
									'percentage': "18",
									'State Tax': tax,
									'Central Tax': tax,
									'Amount': childsnapshot.val().amount18
								});
							});
						}
						if (childsnapshot.val().salesAmt12 && childsnapshot.val().salesAmt12!= 0 && childsnapshot.val().completed==0) {
							saleGst312object.push({
								'InvoiceDate': childsnapshot.val().date,
								'Name': "By Sale",
								'GST/TIN': " ",
								'Phone Number': " ",
								'Invoice No': " ",
								'Value': " ",
								'percentage': "12",
								'State Tax': " ",
								'Central Tax': " ",
								'Amount': childsnapshot.val().salesAmt12
							});
							saleSum12+=parseInt(childsnapshot.val().salesAmt12);
							object[6]=saleSum12;
						}
						if (childsnapshot.val().salesAmt18 && childsnapshot.val().salesAmt18!= 0 && childsnapshot.val().completed==0) {
						 saleGst318object.push({
							 'InvoiceDate': childsnapshot.val().date,
							 'Name': "By Sale",
							 'GST/TIN': " ",
							 'Phone Number': " ",
							 'Invoice No': " ",
							 'Value': " ",
							 'percentage': "18",
							 'State Tax': " ",
							 'Central Tax': " ",
							 'Amount': childsnapshot.val().salesAmt18
						 });
						 saleSum18+=parseInt(childsnapshot.val().salesAmt18);
						 object[7]=saleSum18;
					 }
				});
			});
			object[0]=Purchase12object;
			object[1]=Purchase18object;
			object[2]=saleGst312object;
			object[3]=saleGst318object;
			object[4]=saleGst112object;
			object[5]=saleGst118object;

			return object;
		}

	}
