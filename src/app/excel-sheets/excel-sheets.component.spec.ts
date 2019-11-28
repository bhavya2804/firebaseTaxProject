import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelSheetsComponent } from './excel-sheets.component';

describe('ExcelSheetsComponent', () => {
  let component: ExcelSheetsComponent;
  let fixture: ComponentFixture<ExcelSheetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcelSheetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelSheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
