import { TestBed } from '@angular/core/testing';

import { AlertControllerService } from './alert-controller.service';

describe('AlertControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlertControllerService = TestBed.get(AlertControllerService);
    expect(service).toBeTruthy();
  });
});
