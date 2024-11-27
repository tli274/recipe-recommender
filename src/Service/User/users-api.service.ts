import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { LoginDto } from '../../DTO/login-dto';
import { jwtDecode } from 'jwt-decode';
import { MyUserInfo } from '../../Models/my-user-info';
import { PublicUserInfo } from '../../Models/public-user-info';
import { FriendResponse } from '../../Models/friend-response';
import { PendingResponse } from '../../Models/pending-response';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  private apiUrl = `${environment.apiBaseUrl}/users-api/Users`;

  GetUserInfo(userId: string): Observable<MyUserInfo | PublicUserInfo>{
    const url = `${this.apiUrl}/GetuserInfo/${userId}`;
    const response = this.http.get<MyUserInfo|PublicUserInfo>(url, {
      headers: new HttpHeaders({"Content-Type": "application/json"}),
      responseType: 'json'
    })
    return response;
  }
  
  GetFollowers(): Observable<FriendResponse> {
    const url = `${this.apiUrl}/GetFollowers`;
    const response = this.http.get<FriendResponse>(url, {
      headers: new HttpHeaders({"Content-Type": "application/json"}),
      responseType: 'json'
    })
    return response;
  }

  GetFollowedAccounts(): Observable<FriendResponse> {
    const url = `${this.apiUrl}/GetFollowedAccounts`;
    const response = this.http.get<FriendResponse>(url, {
      headers: new HttpHeaders({"Content-Type": "application/json"}),
      responseType: 'json'
    })
    return response;
  }

  GetPendingRequest(): Observable<PendingResponse> {
    const url = `${this.apiUrl}/GetPendingRequest`;
    const response = this.http.get<PendingResponse>(url, {
      headers: new HttpHeaders({"Content-Type": "application/json"}),
      responseType: 'json'
    })
    return response;
  }
}
