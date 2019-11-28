import { TestBed } from '@angular/core/testing';

import { ScannerDniService } from './scanner-dni.service';

describe('ScannerDniService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScannerDniService = TestBed.get(ScannerDniService);
    expect(service).toBeTruthy();
  });
});
