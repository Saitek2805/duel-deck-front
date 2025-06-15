import { TestBed } from '@angular/core/testing';

import { CardRarityService } from './card-rarity.service';

describe('CardRarityService', () => {
  let service: CardRarityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardRarityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
