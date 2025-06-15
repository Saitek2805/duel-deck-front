import { TestBed } from '@angular/core/testing';

import { DeckCommentService } from './deck-comment.service';

describe('DeckCommentService', () => {
  let service: DeckCommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeckCommentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
