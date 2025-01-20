import { Injectable } from '@angular/core';
import { FriendResponse } from '../../Models/friend-response';
import { PendingResponse } from '../../Models/pending-response';
import { BehaviorSubject, Observable } from 'rxjs';
import { UsersApiService } from './users-api.service';
import { FriendSearchResponseDto } from '../../DTO/ResponseDto/friend-search-reponse-dto';
import { AuthenticationService } from '../Authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class FriendshipManagementService {

  private MyFollowers: FriendResponse[] = [];
  private MyFollowersBs: BehaviorSubject<FriendResponse[]> = new BehaviorSubject<FriendResponse[]>([]);
  public MyFollowersObs: Observable<FriendResponse[]> = this.MyFollowersBs.asObservable();
  private AccountsIFollow: FriendResponse[] = [];
  private AccountsIFollowBs: BehaviorSubject<FriendResponse[]> = new BehaviorSubject<FriendResponse[]>([]);
  public AccountsIFollowObs: Observable<FriendResponse[]> = this.AccountsIFollowBs.asObservable();
  private PendingRequests: PendingResponse[] = [];
  private PendingRequestsBs: BehaviorSubject<PendingResponse[]> = new BehaviorSubject<PendingResponse[]>([]);
  public PendingRequestsObs: Observable<PendingResponse[]> = this.PendingRequestsBs.asObservable();

  constructor(private userApiService: UsersApiService, private authService: AuthenticationService) { }

  // Initialize my relationships
  InitializeAllRelationships(){
    this.InitializeAccountsIFollow();
    this.InitializeMyFollowers();
    this.InitializePendingRequests();
  }

  InitializeMyFollowers(){
    this.userApiService.GetFollowers().subscribe({
      next: (response) => {
        this.MyFollowers = response;
        this.MyFollowersBs.next(this.MyFollowers);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  InitializeAccountsIFollow(){
    this.userApiService.GetFollowedAccounts().subscribe({
      next: (response) => {
        this.AccountsIFollow = response;
        this.AccountsIFollowBs.next(this.AccountsIFollow);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  InitializePendingRequests(){
    this.userApiService.GetPendingRequest().subscribe({
      next: (response) => {
        this.PendingRequests = response;
        this.PendingRequestsBs.next(this.PendingRequests);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  // Add Request
  FollowUser(friendship: FriendSearchResponseDto){
    this.userApiService.FollowNewUser(friendship.userid).subscribe({
      next: (ispending) => {
        let currentUser = this.authService.getUserId();
        if (ispending) {
          let pendingResponse: PendingResponse;
          if (currentUser) {
            pendingResponse = {
              userid: currentUser,
              friendid: friendship.userid,
              requestdate: new Date,
              username: friendship.username,
              isfollower: false
            }
          }
          this.PendingRequests.push()
        } else {
          if (currentUser) {
            let accepted: FriendResponse = {
              userid: currentUser,
              friendid: friendship.userid,
              friendshipdate: new Date,
              username: friendship.username
            }
          }
        }
      },
      error: (err) => {

      }
    })
  }
}
