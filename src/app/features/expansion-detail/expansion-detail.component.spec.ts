import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpansionDetailComponent } from './expansion-detail.component';

describe('ExpansionDetailComponent', () => {
  let component: ExpansionDetailComponent;
  let fixture: ComponentFixture<ExpansionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpansionDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpansionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
