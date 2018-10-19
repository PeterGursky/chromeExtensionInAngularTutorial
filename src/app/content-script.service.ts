import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentScriptService {
  private selectedTabId = 0;
  private urlSubscriber:Subscriber<string>;
  private xPathSubscriber:Subscriber<string>;

  constructor() { 
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => this.messageRecieved(message, sender));
  }
  
  private messageRecieved(message, sender) {
    if (message.type === 'newTabContent') { // sprava z content scriptu
      console.log('zmena obsahu stránky');
      this.selectedTabId = sender.tab.id;
      if (this.urlSubscriber) {
        this.askUrl();
      }
    }
    if (message.type === 'activeTabChanged') { // sprava z background scriptu
      console.log('zmena aktívnej tabky');
      this.selectedTabId = message.tabId;
      this.urlSubscriber.next(message.url);
    }
    if (message.type === 'xPathOfClickedElement') { // sprava z content scriptu
      console.log('došiel xPath kliknutého elementu');
      if (this.xPathSubscriber) {
        this.xPathSubscriber.next(message.xPath);
        this.xPathSubscriber.complete();
      }
    }
  }

  public urlObservable(): Observable<string> {
    return new Observable<string>((observer) => {
      this.urlSubscriber = observer;

      chrome.runtime.sendMessage({type: 'getSelectedTabId'}, response => {
        this.selectedTabId = response.selectedTabId;
        this.askUrl();
      });
    });
  }

  private askUrl() {
    chrome.tabs.sendMessage(this.selectedTabId, {type: 'getCurrentUrl'}, url =>{
      console.log('prijate url: ' + url);
      this.urlSubscriber.next(url);
    });
  }

  public hideElementAndReturnXPath(): Observable<string> {
    return new Observable<string>((observer) => {
      this.xPathSubscriber = observer;

      chrome.tabs.sendMessage(this.selectedTabId, {type: 'hideAndSendXPath'});
    });
  }

  public setVisibility(xP: string, visibility: boolean) {
    chrome.tabs.sendMessage(this.selectedTabId, {type: 'setVisibility', xPath : xP, visibility: visibility});
  }
}
