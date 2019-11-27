import { TestBed } from '@angular/core/testing';

import { CloudFirestoreService } from './cloud-firestore.service';

describe('CloudFirestoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CloudFirestoreService = TestBed.get(CloudFirestoreService);
    expect(service).toBeTruthy();
  });
});
