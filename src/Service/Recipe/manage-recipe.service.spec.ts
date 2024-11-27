import { TestBed } from '@angular/core/testing';

import { ManageRecipeService } from './manage-recipe.service';

describe('ManageRecipeService', () => {
  let service: ManageRecipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageRecipeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
