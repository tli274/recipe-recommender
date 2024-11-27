import { TestBed } from '@angular/core/testing';

import { ShoppingPantryService } from './shopping-pantry.service';

describe('ShoppingpantryService', () => {
  let service: ShoppingPantryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShoppingPantryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
