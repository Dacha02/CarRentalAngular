import { TestBed } from '@angular/core/testing';

import { DeactivateCarService } from './deactivate-car.service';

describe('DeactivateCarService', () => {
  let service: DeactivateCarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeactivateCarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
