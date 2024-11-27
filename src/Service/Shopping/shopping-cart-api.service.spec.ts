import { TestBed } from '@angular/core/testing';

import { ShoppingcartApiService } from './shopping-cart-api.service';

describe('ShoppingcartApiService', () => {
  let service: ShoppingcartApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShoppingcartApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
