import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { FriendSearchResponseDto } from '../../DTO/ResponseDto/friend-search-reponse-dto';
import { UsersApiService } from '../../Service/User/users-api.service';
import { debounceTime, find, Subject } from 'rxjs';

@Component({
  selector: 'app-add-friend-dialog',
  standalone: true,
  imports: [    
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDialogModule, 
    MatInputModule, MatDialogTitle, 
    MatIconModule,
    MatDialogContent,
    ReactiveFormsModule,
    RouterModule],
  templateUrl: './add-friend-dialog.component.html',
  styleUrl: './add-friend-dialog.component.scss'
})
export class AddFriendDialogComponent {
  userList: FriendSearchResponseDto[] = []; 
  searchTerm: string = '';
  private searchSubject = new Subject<string>();
  private debounce: any;
  isTyping: boolean = false;

  // temperary cache
  searchTermCache: Map<string, FriendSearchResponseDto[]> = new Map<string, FriendSearchResponseDto[]>();

  constructor(private userApiService: UsersApiService){

  }

  ngOnInit(){
    
  }

  ngOnDestroy(){
    this.searchSubject.complete();
  }

  onSearch(searchTerm: string){
    this.searchSubject.next(searchTerm)
  }

  performSearch(searchTerm: string) {
    console.log(searchTerm)
  }

  // Wait for users to stop typing, then make api call 
  debounceKeyStrokes(){
    // Debounce key strokes 
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      if (this.searchTerm == '') {
        // reset autocomplete list
        this.userList = [];
        return;
      }
      // Check cache if search was already done
      else if (this.searchTermCache.has(this.searchTerm)) {
        this.userList = this.searchTermCache.get(this.searchTerm)!; // if condition would assert that there will always be a key value pair
      } else {
        this.searchForUsers();
      }
    }, 500)
  }

  searchForUsers(){
    this.userApiService.FindUsersLike(this.searchTerm).subscribe({
      next: (list) => {
        this.userList = list;
        this.searchTermCache.set(this.searchTerm, list)
        console.log(list)
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  FollowUser(){
    console.log(this.userList)
    var user = this.userList.find(users => users.username == this.searchTerm);
    if (!user) {
      // Set error message
      return;
    }
    this.userApiService.FollowNewUser(user.userid).subscribe({
      next: () => {
        console.log("Success")
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  test(){
    console.log(this.searchTerm)
    console.log(this.userList)
  }
}
