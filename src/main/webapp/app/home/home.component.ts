import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager, JhiParseLinks } from 'ng-jhipster';

import { LoginModalService } from 'app/core/login/login-modal.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { IChatRoomAllowedUser } from 'app/shared/model/chat-room-allowed-user.model';
import { IChatNotification } from 'app/shared/model/chat-notification.model';
import { IChatRoom } from 'app/shared/model/chat-room.model';
import { ChatNotificationService } from 'app/entities/chat-notification/chat-notification.service';
import { IChatUser } from 'app/shared/model/chat-user.model';
import { IChatMessage } from 'app/shared/model/chat-message.model';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatRoomService } from 'app/entities/chat-room/chat-room.service';
import { ChatMessageService } from 'app/entities/chat-message/chat-message.service';
import { ChatUserService } from 'app/entities/chat-user/chat-user.service';
import { ChatRoomAllowedUserService } from 'app/entities/chat-room-allowed-user/chat-room-allowed-user.service';
import { ChatService } from 'app/shared/chat/chat.service';
import * as moment from 'moment';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account;
  authSubscription: Subscription;
  modalRef: NgbModalRef;

  messages: Array<Object> = [];
  message = '';

  chatMessage: IChatMessage;
  chatMessages: IChatMessage[];
  chatUser: IChatUser;
  chatUsers: IChatUser[];
  chatRooms: IChatRoom[];
  chatRoom: IChatRoom;
  chatRoomAllowedUsers: IChatRoomAllowedUser[];
  notifyChatRoomAllowedUsers: IChatRoomAllowedUser[];
  chatNotifications: IChatNotification[];
  chatNotification: IChatNotification;

  currentAccount: any;
  error: any;
  success: any;
  eventSubscriber: Subscription;
  routeData: any;
  links: any;
  totalItems: any;
  itemsPerPage: any;
  page: any;
  predicate: any;
  previousPage: any;
  reverse: any;

  currentChatRoomId: number;

  arrayAux = [];
  arrayIds = [];

  constructor(
    private accountService: AccountService,
    private loginModalService: LoginModalService,
    private eventManager: JhiEventManager,
    private chatService: ChatService,
    protected chatRoomService: ChatRoomService,
    protected chatMessageService: ChatMessageService,
    protected chatUserService: ChatUserService,
    protected chatRoomAllowedUserService: ChatRoomAllowedUserService,
    protected chatNotificationService: ChatNotificationService,
    protected parseLinks: JhiParseLinks,
    protected jhiAlertService: JhiAlertService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router
  ) {}

  ngOnInit() {
    this.accountService.identity().subscribe((account: Account) => {
      this.account = account;
    });
    this.registerAuthenticationSuccess();
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }

  login() {
    this.modalRef = this.loginModalService.open();
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.eventManager.destroy(this.authSubscription);
    }
  }

  myChatRooms() {
    const query = {};
    if (this.currentAccount.id != null) {
      query['chatUserId.equals'] = this.chatUser.id;
      query['queryParams'] = 1;
    }
    this.chatRoomService.query(query).subscribe(
      //          (res: HttpResponse<IChatRoom[]>) => this.paginateChatRooms(res.body, res.headers),
      (res: HttpResponse<IChatRoom[]>) => {
        this.chatRooms = res.body;
        //                console.log('CONSOLOG: M:myChatRooms & O: query : ', query);
        //                console.log('CONSOLOG: M:myChatRooms & O: this.chatRooms : ', this.chatRooms);
        const query2 = {};
        query2['chatUserId.equals'] = this.chatUser.id;
        query2['bannedUser.equals'] = 'false';
        query2['queryParams'] = 2;
        this.chatRoomAllowedUserService.query(query2).subscribe(
          (res2: HttpResponse<IChatRoomAllowedUser[]>) => {
            //                          console.log('CONSOLOG: M:myChatRooms & O: query2 : ', query2);
            this.chatRoomAllowedUsers = res2.body;
            //                          console.log('CONSOLOG: M:myChatRooms & O: chatRoomAllowedUsers : ', this.chatRoomAllowedUsers);
            if (this.chatRoomAllowedUsers != null) {
              const arrayChatRoomAllowedUsers = [];
              this.chatRoomAllowedUsers.forEach(chatRoomAllowedUser => {
                //                                  console.log('CONSOLOG: M:myChatRooms & O: arrayChatRoomAllowedUsers : ', arrayChatRoomAllowedUsers);
                arrayChatRoomAllowedUsers.push(chatRoomAllowedUser.chatRoomId);
              });
              const query3 = {};
              query3['id.in'] = arrayChatRoomAllowedUsers;
              this.chatRoomService.query(query3).subscribe(
                (res3: HttpResponse<IChatRoom[]>) => {
                  //                                          console.log('CONSOLOG: M:myChatRoomsEND & O: query3 : ', query3);
                  //                                          console.log('CONSOLOG: M:myChatRoomsEND & O: CR+res3.body : ', res3.body);
                  this.chatRooms = this.filterArray(this.chatRooms.concat(res3.body));
                  //                                          console.log('CONSOLOG: M:myChatRoomsEND & O: this.chatRooms : ', this.chatRooms);
                },
                (res3: HttpErrorResponse) => this.onError(res3.message)
              );
            }
            //                          console.log('CONSOLOG: M:myChatRoomsPOST & O: this.chatRooms : ', this.chatRooms);
          },
          (res2: HttpErrorResponse) => this.onError(res2.message)
        );
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  private filterArray(chatRooms) {
    this.arrayAux = [];
    this.arrayIds = [];
    chatRooms.map(x => {
      if (this.arrayIds.length >= 1 && this.arrayIds.includes(x.id) === false) {
        this.arrayAux.push(x);
        this.arrayIds.push(x.id);
        //        console.log('CONSOLOG: M:filterArray & O: this.arrayAux.push(x) : ', this.arrayAux);
        //        console.log('CONSOLOG: M:filterArray & O: this.arrayIds : ', this.arrayIds);
      } else if (this.arrayIds.length === 0) {
        this.arrayAux.push(x);
        this.arrayIds.push(x.id);
        //        console.log('CONSOLOG: M:filterArray & O: else this.arrayAux.push(x) : ', this.arrayAux);
        //        console.log('CONSOLOG: M:filterArray & O: else this.arrayIds : ', this.arrayIds);
      }
    });
    //    console.log('CONSOLOG: M:filterInterests & O: this.follows : ', this.arrayIds, this.arrayAux);
    return this.arrayAux;
  }

  registerAuthenticationSuccess() {
    this.eventManager.subscribe('authenticationSuccess', message => {
      this.accountService.identity().subscribe(account => {
        this.currentAccount = account;
        this.chatService.disconnect();
        this.chatService.connect();
      });
    });
  }

  registerLogoutSuccess() {
    this.eventManager.subscribe('logoutSuccess', message => {
      this.chatService.disconnect();
      this.chatService.connect();
    });
  }

  sendMessage(message) {
    if (message.length === 0) {
      return;
    }
    this.chatMessage = new Object();
    this.chatMessage.chatUserId = this.currentAccount.id;
    this.chatMessage.chatRoomId = this.currentChatRoomId;
    this.chatMessage.message = message;
    //      console.log('CONSOLOG: M:sendMessage & O: this.chatMessage: ', this.chatMessage);
    this.chatService.sendMessage(this.chatMessage);
    this.message = '';
    this.notifyCRAUs();
  }

  notifyCRAUs() {
    //    console.log('CONSOLOG: M:fetchChatRoom & O: chatRoomId : ', chatRoomId);
    const query = {};
    query['chatRoomId.equals'] = this.chatMessage.chatRoomId;
    query['chatUserId.equals'] = this.chatMessage.chatUserId;
    query['message.equals'] = this.chatMessage.message;
    query['queryParams'] = 3;
    //    console.log('CONSOLOG: M:notifyCRAUs & O: query : ', query);
    this.chatMessageService.query(query).subscribe(
      (res: HttpResponse<IChatMessage[]>) => {
        this.chatMessage = res.body[0];
        //        console.log('CONSOLOG: M:fetchChatRoom & O: this.chatMessage : ', this.chatMessage);
        const query2 = {};
        query2['chatRoomId.equals'] = this.chatMessage.chatRoomId;
        query2['queryParams'] = 1;
        //        console.log('CONSOLOG: M:notifyCRAUs & O: query2 : ', query2);
        this.chatRoomAllowedUserService.query(query2).subscribe(
          (res2: HttpResponse<IChatRoomAllowedUser[]>) => {
            this.notifyChatRoomAllowedUsers = res2.body;
            //            console.log('CONSOLOG: M:notifyCRAUs & O: notifyChatRoomAllowedUsers : ', this.notifyChatRoomAllowedUsers);
            if (this.notifyChatRoomAllowedUsers != null) {
              const arrayChatRoomAllowedUsers = [];
              this.notifyChatRoomAllowedUsers.forEach(chatRoomAllowedUser => {
                this.chatNotification = new Object();
                if (this.chatUser.id !== chatRoomAllowedUser.chatUserId) {
                  //                    console.log('CONSOLOG: M:notifyCRAUs & O: IF this.chatUser.id : ', this.chatUser.id, 'chatRoomAllowedUser.chatUserId: ', chatRoomAllowedUser.chatUserId);
                  this.chatNotification.chatUserId = chatRoomAllowedUser.chatUserId;
                  this.chatNotification.chatMessageId = this.chatMessage.id;
                  this.chatNotification.chatRoomId = this.chatMessage.chatRoomId;
                  this.chatNotification.creationDate = moment(this.chatMessage.messageSentAt);
                  //                    console.log('CONSOLOG: M:notifyCRAUs & O: this.chatNotification : ', this.chatNotification);
                  this.subscribeToSaveResponse(this.chatNotificationService.create(this.chatNotification));
                }
              });
              const query3 = {};
              query3['id.equals'] = this.chatMessage.chatRoomId;
              this.chatRoomService.query(query3).subscribe(
                (res3: HttpResponse<IChatRoom[]>) => {
                  this.chatRoom = res3.body[0];
                  if (this.chatUser.id !== this.chatRoom.chatUserId) {
                    //                      console.log('CONSOLOG: M:notifyCRAUs & O: IF this.chatRoom.chatUserId : ', this.chatRoom.chatUserId);
                    this.chatNotification.chatUserId = this.chatRoom.chatUserId;
                    this.chatNotification.chatMessageId = this.chatMessage.id;
                    this.chatNotification.chatRoomId = this.chatMessage.chatRoomId;
                    this.chatNotification.creationDate = moment(this.chatMessage.messageSentAt);
                    //                      console.log('CONSOLOG: M:notifyCRAUs & O: this.chatNotification : ', this.chatNotification);
                    this.subscribeToSaveResponse(this.chatNotificationService.create(this.chatNotification));
                  }
                },
                (res3: HttpErrorResponse) => this.onError(res3.message)
              );
            }
          },
          (res2: HttpErrorResponse) => this.onError(res2.message)
        );
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  loadAll() {}

  fetchChatRoom(chatRoomId) {
    //    console.log('CONSOLOG: M:fetchChatRoom & O: chatRoomId : ', chatRoomId);
    this.currentChatRoomId = chatRoomId;
    if (chatRoomId !== undefined) {
      const query = {};
      query['chatRoomId.equals'] = this.currentChatRoomId;
      query['queryParams'] = 1;
      //      console.log('CONSOLOG: M:fetchChatRoom & O: query : ', query);
      this.chatMessageService.query(query).subscribe(
        (res: HttpResponse<IChatMessage[]>) => {
          this.messages = res.body;
          //          console.log('CONSOLOG: M:fetchChatRoom & O: this.messages : ', this.messages);
          const query2 = {};
          query2['chatRoomId.equals'] = this.currentChatRoomId;
          query2['chatUserId.equals'] = this.chatUser.id;
          query2['queryParams'] = 2;
          //          console.log('CONSOLOG: M:fetchChatRoom & O: query2 : ', query2);
          this.chatNotificationService.query(query2).subscribe(
            (res2: HttpResponse<IChatNotification[]>) => {
              this.chatNotifications = res2.body;
              //              console.log('CONSOLOG: M:fetchChatRoom & O: this.chatNotifications : ', this.chatNotifications);
              if (this.chatNotifications) {
                this.chatNotifications.forEach(chatNotification => {
                  //                    console.log('CONSOLOG: M:fetchChatRoom & O: chatNotification : ', chatNotification);
                  this.subscribeToSaveResponse(this.chatNotificationService.delete(chatNotification.id));
                });
              }
            },
            (res2: HttpErrorResponse) => this.onError(res2.message)
          );
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
  }

  registerChangeInChatRooms() {
    this.eventSubscriber = this.eventManager.subscribe('chatRoomListModification', response => this.loadAll());
  }

  sort() {
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateChatRooms(data: IChatRoom[], headers: HttpHeaders) {
    this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    this.chatRooms = data;
    //    console.log('CONSOLOG: M:paginateChatRooms & O: this.chatRooms : ', this.chatRooms);
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChatNotification>>) {
    result.subscribe((res: HttpResponse<IChatNotification>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    //    this.isSaving = false;
    //    this.previousState();
  }

  protected onSaveError() {
    //    this.isSaving = false;
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
