import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUpdateDeleteComponent } from './view-update-delete.component';

describe('ViewUpdateDeleteComponent', () => {
  let component: ViewUpdateDeleteComponent;
  let fixture: ComponentFixture<ViewUpdateDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewUpdateDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUpdateDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
