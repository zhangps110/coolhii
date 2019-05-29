$(".jump-setting-page").on("click",function(){
	chrome.tabs.create({url: "setting.html"});
});