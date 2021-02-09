import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Change2FADialogComponent } from './change2-fadialog.component';

describe('Change2FADialogComponent', () => {
  let component: Change2FADialogComponent;
  let fixture: ComponentFixture<Change2FADialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Change2FADialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Change2FADialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
