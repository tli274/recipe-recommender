import { TestBed } from '@angular/core/testing';

import { PantryApiService } from './pantry-api.service';

describe('FoodGroupTabsService', () => {
  let service: PantryApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PantryApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
