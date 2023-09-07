import { TestBed } from '@angular/core/testing';

import { SpecificationValueService } from './specification-value.service';

describe('CarSpecificationServiceSpecificationValueService', () => {
  let service: SpecificationValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecificationValueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
