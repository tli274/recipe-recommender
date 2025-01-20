import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { LoginDto } from '../../DTO/login-dto';
import { BehaviorSubject, map, Observable, timer } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { tokenDto } from '../../DTO/token-dto';
import { RegisterUserDto } from '../../DTO/register-user-dto';
import { refreshTokenDto } from '../../DTO/refresh-token-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient

  ) { 
    this.loggedInStatus.next(this.isLoggedIn());
  }

  public loggedInStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
  private authToken = 'authToken'
  private refreshToken = 'refresh'
  private apiUrl = `${environment.apiBaseUrl}/users-api/Users`;
  private refreshTokenInterval: any;


  // API call to login user
  LoginUser(loginData: LoginDto): Observable<tokenDto> {
    const url = `${this.apiUrl}/Login`;
    const response = this.http.post<tokenDto>(url, loginData, {
      headers: new HttpHeaders({"Content-Type": "application/json"}),
      responseType: 'json'
    })
    return response;
  }

  RegisterNewUser(newUserData: RegisterUserDto): Observable<any> {
    const url = `${this.apiUrl}/RegisterNewUser`;
    const response = this.http.post<any>(url, newUserData, {
      headers: new HttpHeaders({"Content-Type": "application/json"}),
      responseType: 'json'
    })
    return response; 
  }

  RequestNewAccessToken(): Observable<tokenDto> {
    const refreshToken = this.getRefreshToken();
    const url = `${this.apiUrl}/RefreshToken`;
    const refreshTokenDto: refreshTokenDto = {
      refreshToken: refreshToken
    }
    const response = this.http.post<tokenDto>(url, refreshTokenDto, {
      headers: new HttpHeaders({"Content-Type": "application/json"}),
      responseType: 'json'
    })
    return response;
  }

  // Function to request a new access token
  StartTokenRefreshTimer() {
    this.refreshTokenInterval = setInterval(() => {
      this.RequestNewAccessToken().subscribe({
        next: (response) => {
          this.storeToken(response.accessToken, response.refreshToken)
        },
        error: (err) => {
          console.log(err)
        }
      });
    }, 14*60*1000)
  }

  StopTokenRefreshTimer() {
    if (this.refreshTokenInterval) {
      clearInterval(this.refreshTokenInterval)
    }
  }

  // Handle token in local storage
  // Temp: local storage isnt really safe
  storeToken(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.authToken, accessToken);
    localStorage.setItem(this.refreshToken, refreshToken)
    this.loggedInStatus.next(true);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.authToken);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshToken)
  }

  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }

  getUserId(): string | null {
    let accessToken = this.getAccessToken();
    if (accessToken) {
      let decodedToken = this.decodeToken(accessToken)
      if (decodedToken) {
        return decodedToken.jti
      } else {
        return null;
      }
    }
    return null;
  }

  logOut(): void {
    localStorage.removeItem(this.authToken);
    localStorage.removeItem(this.refreshToken)
    this.loggedInStatus.next(false);
  }

  isLoggedIn(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    const decodedToken: any = this.decodeToken(token);
    if (!decodedToken) return false;
    const currentTime = Math.floor(Date.now()/1000);
    return decodedToken.exp > currentTime;
  }

  getLoggedInStatus() {
    return this.loggedInStatus.asObservable();
  }

}
