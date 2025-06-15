import { TestBed } from '@angular/core/testing';

import { CardAttributeService } from './card-attribute.service';

describe('CardAttributeService', () => {
  let service: CardAttributeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardAttributeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
