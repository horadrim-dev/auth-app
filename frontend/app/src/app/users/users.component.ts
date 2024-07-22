import { Component, OnInit } from '@angular/core';
import { User } from '../shared/models/user.model';
import { UserService } from '../shared/services/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [MessageService]
})
export class UsersComponent implements OnInit {

  users: User[] = [] ;
  loading: Boolean = true;

  constructor(
    private _userService: UserService, 
    private _messageService: MessageService,
  ){
  }

  ngOnInit() {

    // loading user list
    this._userService.getUsers()
      .subscribe({
        next: (data) => {
          this.users = data; 
          this.loading = false;
        },
        error: err => {
          this._messageService.add({
            severity: 'error', life: 10000, summary: "Сервер недоступен",
            detail: "Не удалось загрузить список пользователей."
          })
        }
      });
  }

  getUsers(){
    return this.users
  }

}
