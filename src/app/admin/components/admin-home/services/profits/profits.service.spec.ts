import { TestBed } from '@angular/core/testing';

import { ProfitsService } from './profits.service';

describe('ProfitsService', () => {
  let service: ProfitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
