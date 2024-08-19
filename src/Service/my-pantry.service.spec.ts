import { TestBed } from '@angular/core/testing';

import { MyPantryService } from './my-pantry.service';

describe('MyPantryService', () => {
  let service: MyPantryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyPantryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
