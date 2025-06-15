import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpansionEditComponent } from './expansion-edit.component';

describe('ExpansionEditComponent', () => {
  let component: ExpansionEditComponent;
  let fixture: ComponentFixture<ExpansionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpansionEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpansionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
