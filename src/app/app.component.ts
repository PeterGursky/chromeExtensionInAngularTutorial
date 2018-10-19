import { Component, OnInit, NgZone } from '@angular/core';
import { ContentScriptService } from './content-script.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private currentUrl:string;
  private title = 'angularChromeTutorial';
  private invisibleXPaths = new Array<string>();
  private xPaths = new Map<string, boolean>();
  private urlToMap = new Map<string, Map<string, boolean>>();
  constructor(private contentScriptService: ContentScriptService, private zone:NgZone) {}

  ngOnInit() {
    let thisObj = this;
    this.contentScriptService.urlObservable().subscribe(
        url => { 
          console.log("komponent: doslo url: " + url );
          this.zone.run(() => { 
            this.currentUrl = url;   //NgZone sluzi na reload stranky ked sa zmeni hodnota vlastnosti
            this.applyVisibilityOnNewTab(url);
           });
        });  
  }

  hideElement() {
    this.contentScriptService.hideElementAndReturnXPath().subscribe(xPath => {
      this.zone.run(() => { 
        this.invisibleXPaths.push(xPath);
        this.xPaths.set(xPath, true);   
      });  
    });
  }

  setVisibility(event, xPath) {
    console.log("menim visibiliy pre " + xPath + " na " + !event.target.checked);
    this.contentScriptService.setVisibility(xPath, !event.target.checked);
  }

  applyVisibilityOnNewTab(url:string) {
    if (!this.urlToMap.has(url)) {
      this.urlToMap.set(url, new Map<string, boolean>());
    }
    this.xPaths = this.urlToMap.get(url);
    this.xPaths.forEach((value: boolean, xPath: string) => {
      this.contentScriptService.setVisibility(xPath, !value);
    });
  }
}
