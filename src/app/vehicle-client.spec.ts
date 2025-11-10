import { TestBed } from '@angular/core/testing';

import { VehicleClient } from './vehicle-client';

describe('VehicleClient', () => {
  let service: VehicleClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
