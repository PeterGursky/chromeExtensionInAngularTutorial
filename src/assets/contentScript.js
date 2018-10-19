console.log('content script sa spustil');
chrome.runtime.sendMessage({type : 'newTabContent'});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type == 'getCurrentUrl') {
      console.log('content script posiela url ' + window.location.href);
    	sendResponse(window.location.href);
    }
    if (message.type == 'hideAndSendXPath') {
        window.addEventListener("mousedown", hideAndReturnXPath, {capture : true, once: true});
        window.addEventListener("click", (e) => {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();        
        }, {capture : true, once: true});
    }
    if (message.type == 'setVisibility') {
        var el = document.evaluate(message.xPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (message.visibility) {
            el.style.visibility = "visible";
        } else {
            el.style.visibility = "hidden";    
        }
    }
});
var hideAndReturnXPath = function(event) {
    var el = event.srcElement;
    el.style.visibility = "hidden";
    var path= getPathTo(el);
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
    chrome.runtime.sendMessage({type : 'xPathOfClickedElement', xPath : path});
}
// upravený zdroj: https://stackoverflow.com/questions/2631820/how-do-i-ensure-saved-click-coordinates-can-be-reloaed-to-the-same-place-even-i/2631931#2631931
function getPathTo(element) {
// if (element.id!=='')
//     return '//*[@id="'+element.id+'"]';
   if (element===document.body)
       return '//' + element.tagName;
 
   var ix= 0;
   var siblings= element.parentNode.childNodes;
   for (var i= 0; i<siblings.length; i++) {
       var sibling= siblings[i];
       if (sibling===element)
           return getPathTo(element.parentNode)+'/'+element.tagName+'['+(ix+1)+']';
       if (sibling.nodeType===1 && sibling.tagName===element.tagName)
           ix++;
   }
}

document.addEventListener("DOMNodeInserted", function(e) {
    chrome.runtime.sendMessage({type : 'newTabContent'});
  }, false);
  