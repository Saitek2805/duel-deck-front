import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpansionCreateComponent } from './expansion-create.component';

describe('ExpansionCreateComponent', () => {
  let component: ExpansionCreateComponent;
  let fixture: ComponentFixture<ExpansionCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpansionCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpansionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
