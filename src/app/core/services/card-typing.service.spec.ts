import { TestBed } from '@angular/core/testing';

import { CardTypingService } from './card-typing.service';

describe('CardTypingService', () => {
  let service: CardTypingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardTypingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
