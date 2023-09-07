import { TestBed } from '@angular/core/testing';

import { DeleteRentingService } from './delete-renting.service';

describe('DeleteRentingService', () => {
  let service: DeleteRentingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteRentingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
