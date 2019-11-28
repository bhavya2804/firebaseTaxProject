import { Injectable } from '@angular/core';
import firebase from '@firebase/app';
import '@firebase/database';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class DataProviderService {

	constructor() {}

	getDealers() {
		let dealersData = [];
		let db = firebase.database().ref("dealers");
		db.on('child_added', function(snapshot) {
			dealersData.push(snapshot.key);
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

		//for purchase
		firebase.database().ref('purchase').once('value').then(function(snapshot) {
			snapshot.forEach(function(childsnapshot) {
				if (childsnapshot.val().percentage == 18) {
					let j = 1.18;
					let value = (childsnapshot.val().amount / j);
					let tax = (childsnapshot.val().amount - value) / 2;
					tax=Math.floor(tax);
					value=Math.floor(value);
					let gstIn = "0";
					let ref = firebase.database().ref('dealers/' + childsnapshot.val().company).once('value').then(function(snapshot) {
						gstIn = snapshot.val().gstNo;
						Purchase18object.push({
							'InvoiceDate': childsnapshot.val().date,
							'Name': childsnapshot.val().company,
							'GST/TIN': gstIn,
							'Invoice No': childsnapshot.val().invoiceNo,
							'Value': value,
							'percentage': childsnapshot.val().percentage,
							'State Tax': tax,
							'Central Tax': tax,
							'Amount': childsnapshot.val().amount
						});
					});
				}
				if (childsnapshot.val().percentage == 12) {
					let j = 1.12;
					let value = (childsnapshot.val().amount / j);
					let tax = (childsnapshot.val().amount - value) / 2;
					tax=Math.floor(tax);
					value=Math.floor(value);
					let gstIn = "0";
					let ref = firebase.database().ref('dealers/' + childsnapshot.val().company).once('value').then(function(snapshot) {
						gstIn = snapshot.val().gstNo;
						Purchase12object.push({
							'InvoiceDate': childsnapshot.val().date,
							'Name': childsnapshot.val().company,
							'GST/TIN': gstIn,
							'Invoice No': childsnapshot.val().invoiceNo,
							'Value': value,
							'percentage': childsnapshot.val().percentage,
							'State Tax': tax,
							'Central Tax': tax,
							'Amount': childsnapshot.val().amount
						});
					});
				}
			});
		});

		// sales gst 3%, 1%
		firebase.database().ref('sales').orderByChild("date").once('value').then(function(snapshot) {
				snapshot.forEach(function(childsnapshot) {
						if (childsnapshot.val().invoiceNo && childsnapshot.val().percentage == 12) {
							let j = 1.12;
							let value = (childsnapshot.val().amount / j);
							let tax = (childsnapshot.val().amount - value) / 2;
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
									'Invoice No': childsnapshot.val().invoiceNo,
									'Value': value,
									'percentage': childsnapshot.val().percentage,
									'State Tax': tax,
									'Central Tax': tax,
									'Amount': childsnapshot.val().amount
								});
								saleGst112object.push({
									'InvoiceDate': childsnapshot.val().date,
									'Name': childsnapshot.val().name,
									'GST/TIN': gstNo,
									'Phone Number': phoneNum,
									'Invoice No': childsnapshot.val().invoiceNo,
									'Value': value,
									'percentage': childsnapshot.val().percentage,
									'State Tax': tax,
									'Central Tax': tax,
									'Amount': childsnapshot.val().amount
								});
							});
						}
						if (childsnapshot.val().invoiceNo && childsnapshot.val().percentage == 18) {
							let j = 1.18;
							let value = (childsnapshot.val().amount / j);
							let tax = (childsnapshot.val().amount - value) / 2;
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
									'percentage': childsnapshot.val().percentage,
									'State Tax': tax,
									'Central Tax': tax,
									'Amount': childsnapshot.val().amount
								});
								saleGst118object.push({
									'InvoiceDate': childsnapshot.val().date,
									'Name': childsnapshot.val().name,
									'GST/TIN': gstNo,
									'Phone Number': phoneNum,
									'Invoice No': childsnapshot.val().invoiceNo,
									'Value': value,
									'percentage': childsnapshot.val().percentage,
									'State Tax': tax,
									'Central Tax': tax,
									'Amount': childsnapshot.val().amount
								});
							});
						}
						if (childsnapshot.val().salesAmt12 && childsnapshot.val().salesAmt12!= 0) {
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
							saleSum12+=childsnapshot.val().salesAmt12;
							object[6]=saleSum12;
						}
						if (childsnapshot.val().salesAmt18 && childsnapshot.val().salesAmt18!= 0) {
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
						 saleSum18+=childsnapshot.val().salesAmt18;
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
