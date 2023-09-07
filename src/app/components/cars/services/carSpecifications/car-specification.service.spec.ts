import { TestBed } from '@angular/core/testing';

import { CarSpecificationService } from './car-specification.service';

describe('CarSpecificationService', () => {
  let service: CarSpecificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarSpecificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
