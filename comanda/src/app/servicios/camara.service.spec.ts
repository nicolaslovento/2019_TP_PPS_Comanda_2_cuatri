import { TestBed } from '@angular/core/testing';

import { CamaraService } from './camara.service';

describe('CamaraService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CamaraService = TestBed.get(CamaraService);
    expect(service).toBeTruthy();
  });
});
