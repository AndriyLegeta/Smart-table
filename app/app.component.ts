import {Component, OnInit} from '@angular/core';
import {Response} from './models/Response';
import {UserService} from './services/user.service';
import {User} from './models/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private userService: UserService
  ) {
  }

  isLogged: boolean;
  isRegistered: boolean;
  newUser: User;
  userData: {};
  correctPassword: boolean;
  emailAlreadyExist: boolean;

  ngOnInit() {
    this.isLogged = !!localStorage.getItem('token');
    this.correctPassword = true;
    this.emailAlreadyExist = false;
    this.isRegistered = false;
  }

  sendLoginUserData(name, password) {
    this.userData = {
      name,
      password
    };

    this.userService.loginUser(this.userData)
      .subscribe((response: Response) => {
        if (!response.success && response.message === 'Received password is incorrect') {
          this.correctPassword = false;
        }
        else if (response.success) {
          localStorage.setItem('token', response.message);

          this.userService.getUser()
            .subscribe((res: Response) => {
              if (res.success) {
                this.userService.currentUserInfo.next(res.message);
                this.isLogged = true;
              }
            });
        }
      });
  }

  sendNewUserData(name, email, password) {
    this.newUser = {
      name,
      email,
      password
    };
    this.userService.registerUser(this.newUser)
      .subscribe((response: Response) => {
        if (!response.success && response.message === 'User is already registered') {
          this.emailAlreadyExist = true;
        } else if (response.success) {
          this.isRegistered = true;
        }
      });
  }

  sighOut(): void {
    localStorage.removeItem('token');
    this.userService.currentUserInfo.next({});
    this.isLogged = false;
  }

}
