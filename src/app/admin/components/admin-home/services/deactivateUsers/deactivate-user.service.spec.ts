import { TestBed } from '@angular/core/testing';

import { DeactivateUserService } from './deactivate-user.service';

describe('DeactivateUserService', () => {
  let service: DeactivateUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeactivateUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
