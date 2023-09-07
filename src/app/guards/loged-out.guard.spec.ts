import { TestBed } from '@angular/core/testing';

import { LogedOutGuard } from './loged-out.guard';

describe('LogedOutGuard', () => {
  let guard: LogedOutGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LogedOutGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
