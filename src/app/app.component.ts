import { Component } from '@angular/core';
import firebase from '@firebase/app';
import '@firebase/database';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'dadProject';

  constructor(){
    firebase.initializeApp(environment.firebasex);
  }
}
