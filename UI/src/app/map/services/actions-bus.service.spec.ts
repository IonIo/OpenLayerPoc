import { TestBed, inject } from '@angular/core/testing';

import { ActionsBusService } from './actions-bus.service';

describe('ActionsBusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActionsBusService]
    });
  });

  it('should be created', inject([ActionsBusService], (service: ActionsBusService) => {
    expect(service).toBeTruthy();
  }));
});
