$(function(){
	$(".open-plugin-setting").on("click",function(){
		chrome.tabs.create({url: "setting.html"});
	});
	
	var backWindow = chrome.extension.getBackgroundPage();
	var serverUrl = backWindow.serverUrl;
	$("#iframe-navigation").attr("src", serverUrl);
	$(".open-plugin").on("click", function(){
		chrome.tabs.create({url: serverUrl});
	});
	
	$("#logo-link").attr("href", serverUrl);
});
