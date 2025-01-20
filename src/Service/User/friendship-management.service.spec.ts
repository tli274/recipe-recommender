import { TestBed } from '@angular/core/testing';

import { FriendshipManagementService } from './friendship-management.service';

describe('FriendshipManagementService', () => {
  let service: FriendshipManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FriendshipManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
