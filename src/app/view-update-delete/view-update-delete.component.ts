import { Component, OnInit } from '@angular/core';
import firebase from '@firebase/app';
import '@firebase/database';
import { environment } from '../../environments/environment';
import { DataProviderService } from '../data-provider.service';

@Component({
  selector: 'app-view-update-delete',
  templateUrl: './view-update-delete.component.html',
  styleUrls: ['./view-update-delete.component.css'],
  providers: [DataProviderService]
})
export class ViewUpdateDeleteComponent implements OnInit {
  viewFiled:string;
  searchDate:string;
  searchInvoiceNo:string;
  tableData:any;
  showTable:string;

  constructor(private data: DataProviderService)
  {
  }

  ngOnInit() {
  }

  getData(){
    let td=[];
    if(this.viewFiled=='purchase'){
      let ref  = firebase.database().ref(this.viewFiled+'/'+this.searchInvoiceNo+'-'+this.searchDate).once('value').then(function(snapshot) {
        snapshot.val()!=null?td.push(snapshot.val()):1;
      });
    }
    else if(this.viewFiled=='salesGst'){
      let ref  = firebase.database().ref('sales'+'/'+this.searchInvoiceNo+'-'+this.searchDate).once('value').then(function(snapshot) {
        snapshot.val()!=null?td.push(snapshot.val()):1;
      });
    }
    else{
      let ref  = firebase.database().ref('sales'+'/'+this.searchDate).once('value').then(function(snapshot) {
        snapshot.val()!=null?td.push(snapshot.val()):1;
      });
    }
    this.tableData=td;
    this.showTable="Yes";
    this.searchDate="";
    this.searchInvoiceNo="";
  }

  updateData(){
    let db = firebase.database().ref(this.viewFiled);
    for(var i=0;i<this.tableData.length;i++){
      let td=this.tableData[i];
      let ref  = firebase.database().ref().child(this.viewFiled);
      if(this.viewFiled=='purchase'){
        ref.child(td.invoiceNo+'-'+td.date).update({'company':td.company, 'percentage':td.percentage, 'amount':td.amount},function(error) {
          if (error) {
            alert("Data could not be Updated." + error);
          } else {
            alert("Data Updated successfully.");
          }
        });
      }
      else if(this.viewFiled=='salesGst'){
        ref.child(td.invoiceNo+'-'+td.date).update({'name':td.name, 'percentage':td.percentage, 'amount':td.amount},function(error) {
          if (error) {
            alert("Data could not be Updated." + error);
          } else {
            alert("Data Updated successfully.");
          }
        });
      }
      else{
          ref.child(td.date).update({'salesAmt12':td.salesAmt12, 'salesAmt18':td.salesAmt18},function(error) {
            if (error) {
              alert("Data could not be Updated." + error);
            } else {
              alert("Data Updated successfully.");
            }
          });
      }
    }
    delete this.tableData;
    this.showTable="No";
  }

  deleteData(index){
    let ref  = firebase.database().ref().child(this.viewFiled);
    if(this.viewFiled=='purchase'){
      ref.child(this.tableData[index].invoiceNo+'-'+this.tableData[index].date).remove(function(error) {
        if (error) {
          alert("Data could not be Deleted." + error);
        } else {
          alert("Data Deleted successfully.");
        }
      });
    }
    else if(this.viewFiled=='salesGst'){
      ref.child(this.tableData[index].invoiceNo+'-'+this.tableData[index].date).remove(function(error) {
        if (error) {
          alert("Data could not be Deleted." + error);
        } else {
          alert("Data Deleted successfully.");
        }
      });
    }
    else{
        ref.child(this.tableData[index].date).remove(function(error) {
          if (error) {
            alert("Data could not be Deleted." + error);
          } else {
            alert("Data Deleted successfully.");
          }
        });
    }
    delete this.tableData;
    this.showTable="No";
  }
}
