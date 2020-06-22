import { Component, OnInit } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireList } from 'angularfire2/database';
import { environment } from '../../environments/environment';
import firebase from '@firebase/app';
import { FormsModule } from '@angular/forms';
import { DataProviderService } from '../data-provider.service';

@Component({
  selector: 'app-fill-details',
  templateUrl: './fill-details.component.html',
  styleUrls: ['./fill-details.component.css'],
  providers: [DataProviderService]
})

export class FillDetailsComponent implements OnInit {

  dealers=[];
  customers=[];
  purchaseNewInt={
    "company":"",
    "gstNo":""
  };
  purchaseNew={
    "company":"",
    "gstNo":""
  };

  purchaseInt={
    "company":"",
    "date":"",
    "amount12":"",
    "amount18":"",
    "invoiceNo":""
  };
  purchase={
    "company":"",
    "date":"",
    "amount12":"",
    "amount18":"",
    "invoiceNo":""
  };

  salesGstNew={
    "customer":"",
    "gst_no":"",
    "phone_no":""
  };

  showAddDealerDiv:string;
  showAddCustomersDiv:string;
  selectType:string;
  salesDate:string;
  salesAmt12:string;
  salesAmt18:string;
  salesGstCustomer:string;
  salesGstInvoiceno:string;
  salesGstDate:string;
  salesGstAmt12:string;
  salesGstAmt18:string;
  tableData: any = [];
  headers: any = [];


  constructor(dataProviderService: DataProviderService)
  {
    this.dealers= dataProviderService.getDealers();
    this.customers= dataProviderService.getCustomers();
    this.tableData = dataProviderService.getExcelObject();
    console.log(this.tableData);
  }

  ngOnInit()
  {
    this.showAddDealerDiv="false";
    this.showAddCustomersDiv="false";
  }

  saveDealersCustomersDetails(text:string):void{
    if(text=='Dealers'){
      firebase.database().ref("dealers/"+this.purchaseNew.company).set({
        gstNo:this.purchaseNew.gstNo
      },function(error) {
        if (error) {
          alert("Data could not be Inserted." + error);
        } else {
          alert("Data Inserted successfully.");
        }
      });
      this.showAddDealerDiv="false";
      this.purchaseNew=JSON.parse(JSON.stringify(this.purchaseNewInt));
    }
    else{
      firebase.database().ref("customers/"+this.salesGstNew.customer).set({
        gstNo:this.salesGstNew.gst_no,
        phoneNo:this.salesGstNew.phone_no
      },function(error) {
        if (error) {
          alert("Data could not be Inserted." + error);
        } else {
          alert("Data Inserted successfully.");
        }
      });
      this.showAddCustomersDiv="false";
      this.salesGstNew.customer="";
      this.salesGstNew.gst_no="";
      this.salesGstNew.phone_no="";
    }
  }

  saveDetails(text:string):void{
    if(text=='Purchase'){
      firebase.database().ref("purchase/"+this.purchase.invoiceNo+'-'+this.purchase.date).set({
          company:this.purchase.company,
          date:this.purchase.date,
          amount12:eval(this.purchase.amount12),
          amount18:eval(this.purchase.amount18),
          invoiceNo:this.purchase.invoiceNo,
          completed: 0,
          create_time:new Date().toLocaleString()
  			},function(error) {
          if (error) {
            alert("Data could not be Inserted." + error);
          } else {
            alert("Data Inserted successfully.");
          }
        });
      // this.selectType="done";
      this.purchase=JSON.parse(JSON.stringify(this.purchaseInt));
    }
    else if(text=='Sales'){
      firebase.database().ref("sales/"+this.salesDate).set({
          date:this.salesDate,
          salesAmt12:eval(this.salesAmt12)>0?eval(this.salesAmt12):0,
          salesAmt18:eval(this.salesAmt18)>0?eval(this.salesAmt18):0,
          completed: 0,
          create_time:new Date().toLocaleString()
  			},function(error) {
          if (error) {
            alert("Data could not be Inserted." + error);
          } else {
            alert("Data Inserted successfully.");
          }
        });
      // this.selectType="done";
      this.salesDate="";
      this.salesAmt12="";
      this.salesAmt18="";
    }
    else{
      firebase.database().ref("sales/"+this.salesGstInvoiceno+'-'+this.salesGstDate).set({
          name:this.salesGstCustomer,
          invoiceNo:this.salesGstInvoiceno,
          date:this.salesGstDate,
          amount12:eval(this.salesGstAmt12)>0?eval(this.salesGstAmt12):0,
          amount18:eval(this.salesGstAmt18)>0?eval(this.salesGstAmt18):0,
          completed: 0,
          create_time:new Date().toLocaleString()
  			},function(error) {
          if (error) {
            alert("Data could not be Inserted." + error);
          } else {
            alert("Data Inserted successfully.");
          }
        });
      // this.selectType="done";
      this.salesGstCustomer="";
      this.salesGstInvoiceno="";
      this.salesGstDate="";
      this.salesGstAmt12="";
      this.salesGstAmt18="";
    }
  }


}
