import { TestBed } from '@angular/core/testing';

import { AddCarService } from './add-car.service';

describe('AddCarService', () => {
  let service: AddCarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddCarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
