import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'underscore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private http: HttpClient , private modalService: NgbModal){
  }

  title = 'Internsip  TEST';
  searched = "";
  users : any = [];
  friends : any = [];
  friendsOffriends : any = [];
  suggestedFriends : any = [];
  private baseUrl : string ='/SocialNetworkInternship/assets/data.json';


  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.http.get(this.baseUrl).subscribe(data => {
      this.users = data ; 
    });
  }

  openFriends(content , idUser) {
    this.searched = "Friends";
    this.getFriends(idUser);
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {
    });
  }


  getFriends(idUser) {
    this.friends = [];
    var user = this.users.filter(obj  => obj.id == idUser);
    user[0].friends.forEach(element => {
      this.friends.push(this.users.filter(obj  => obj.id == element)[0]);
    });
  }

  openFriendsOfFriends(content , idUser) {
    this.searched = "Friends of Friends";
    this.getFriendsOfFriends(idUser);
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {
    });
  }

  getFriendsOfFriends(idUser) {
    this.friendsOffriends = [];
    this.getFriends(idUser);
    this.friends.forEach(element => {
      element.friends.forEach(el => {
        var fof = this.users.filter(obj  => obj.id == el)[0];
        if(!this.IsUserExit(this.friends,fof) && !this.IsUserExit(this.friendsOffriends,fof) && fof.id != idUser ) {
            this.friendsOffriends.push(fof);
          }
      });
    });
    this.friends = [];
    this.friends = this.friendsOffriends;
  }

  IsUserExit(list,user) : boolean {
    let exist = false ;
    list.forEach(e => {
        if(e.id === user.id) {
          exist =  true ;
      } else {
      }
    });
    return exist;
  }

  openSuggestedFriends(content , idUser) {
    this.searched = "Suggested Friends";
    this.getSuggestedFriends(idUser);
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {
    });
  }

  getSuggestedFriends(idUser) {
    this.suggestedFriends = [] ;
    this.getFriends(idUser);
    var user = this.users.filter(obj  => obj.id == idUser);
    if(user[0].friends.length >= 2 ) {
      this.users.forEach(el => {
        if(_.intersection(user[0].friends, el.friends ).length >= 2 && el.id != idUser && !this.IsUserExit(this.friends,el)) {
          this.suggestedFriends.push(el);
        }
      });
    } else {
      alert("You should at least have 2 friends");
    }
    this.friends = [];
    this.friends = this.suggestedFriends;
  }



}
