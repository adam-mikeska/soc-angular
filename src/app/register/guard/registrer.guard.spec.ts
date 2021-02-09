import { TestBed } from '@angular/core/testing';

import { RegistrerGuard } from './registrer.guard';

describe('RegistrerGuard', () => {
  let guard: RegistrerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RegistrerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
