import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FillDetailsComponent } from './fill-details/fill-details.component';
import { ExcelSheetsComponent } from './excel-sheets/excel-sheets.component';

const routes: Routes = [
  { path: 'fill-details', component: FillDetailsComponent},
  { path: 'Excel', component: ExcelSheetsComponent}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
