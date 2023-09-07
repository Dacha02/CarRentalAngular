import { TestBed } from '@angular/core/testing';

import { UserRentingsService } from './user-rentings.service';

describe('UserRentingsService', () => {
  let service: UserRentingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserRentingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
