import { TestBed } from '@angular/core/testing';

import { AddPriceService } from './add-price.service';

describe('AddPriceService', () => {
  let service: AddPriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddPriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
