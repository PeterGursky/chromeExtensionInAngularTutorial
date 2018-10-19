var selectedTabId; //tabka pri ktorej bolo extension otvorene
var selectedWindowId;

// caka na kliknutie aby otvorila nase Extension
chrome.browserAction.onClicked.addListener(function() {
	chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
		selectedTabId = arrayOfTabs[0].id; //nastavi sa premenna, ze z ktorej tabky bolo otvorene Extension
		selectedWindowId = arrayOfTabs[0].windowId;
	});
	chrome.windows.create({
		'url' : 'index.html',
		'type' : 'popup',
		'height' : 1000,
		'width' : 500,
		'left' : 1
	}, function(window) {
	});
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if ( message.type == 'getSelectedTabId' ){ // message from (newly opened) Extension page - sending id of last opened tab
		sendResponse({selectedTabId: selectedTabId });
	}
});


chrome.tabs.onActivated.addListener(function (activeInfo) { //Fired when an active tab is changed
	if (activeInfo.windowId === this.selectedWindowId) {
		chrome.tabs.get(activeInfo.tabId, tab => {
			chrome.runtime.sendMessage({type: 'activeTabChanged', tabId: activeInfo.tabId, url : tab.url});
		});
		}
});



