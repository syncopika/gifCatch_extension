// content script for gifCatch
// lets user select an area to make the gif from 
// this simply gets the coordinates needed to know 
// which part of the screen to focus on 
// the info then gets sent as a message to background.js 

chrome.browserAction.onClicked.addListener(function(tab){

	chrome.tabs.executeScript(null, {
		file: "areaSelection.js"
	});
	
});