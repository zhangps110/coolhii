(function (){
	
	//*********************设置信息 - 全局****
	window.serverUrl = "http://127.0.0.1:8080/coolhii/";
	//*********************设置信息 - 全局****
	
	//插件相关操作
	chrome.runtime.onInstalled.addListener(function (details) {
		if (details && details.reason && details.reason == 'install'){
			createTab();
			//安装完成，安装数+1
		};
	});
	
	chrome.browserAction.onClicked.addListener(function (tab) {
		createTab();
	});

	//4个快捷键操作
	chrome.storage.sync.get(["shortcutWebsite"], function(result) {
		var shortcutWebsite = window.shortcutWebsite;
		if(result.shortcutWebsite){
			shortcutWebsite = result.shortcutWebsite;
			window.shortcutWebsite = shortcutWebsite;
		}else{
			chrome.storage.sync.set({"shortcutWebsite": shortcutWebsite}, function() {});
		}
		if(shortcutWebsite.length==3){
			chrome.commands.onCommand.addListener(function(command) {
			  	switch(command){
			  		case "quick-open-navigation":
			  			createTab();
			  			break;
			  		case "quick-open-website-up":
			  			if(!!shortcutWebsite[0]){
			  				chrome.tabs.create({url: shortcutWebsite[0]});
			  			}
			  			break;
			  		case "quick-open-website-down":
			  			if(!!shortcutWebsite[1]){
			  				chrome.tabs.create({url: shortcutWebsite[1]});
			  			}
			  			break;
			  		case "quick-open-website-right":
			  			if(!!shortcutWebsite[2]){
			  				chrome.tabs.create({url: shortcutWebsite[2]});
			  			}
			  			break;
			  	}
			});
		}
	});
	
	function createTab(){
		chrome.tabs.create({url: "navigation.html"});
	}
	
	//快捷键关闭网页
	chrome.webRequest.onBeforeRequest.addListener(
	  function(details) {
	      chrome.tabs.query({ active: true }, function(tabs) {
	           chrome.tabs.remove(tabs[0].id);
	      });
	  },
	  {urls:["*://mock_didi_project_xs.com/*"]},
	  ['blocking']
	);
	
	//检查是否有删除的选项
	window.checkServerHaveChosenMenu=function(){
		$.ajax({
			"url":serverUrl + "menu/item",
			"type":"POST",
			"dataType":"json",
			"async":true,
			success:function(data){
				if(!!data){
					var selections = data.selections;
					var links = data.links;
					var images = data.images;
					var pages = data.pages;
					var allMenus = new Array();
					for(var i=0;i<selections.length; i++){
						var items = selections[i].items;
						for(var j=0; j<items.length; j++){
							allMenus.push(items[j]);
						}
					}
					for(var i=0;i<links.length; i++){
						var items = links[i].items;
						for(var j=0; j<items.length; j++){
							allMenus.push(items[j]);
						}
					}
					for(var i=0;i<images.length; i++){
						var items = images[i].items;
						for(var j=0; j<items.length; j++){
							allMenus.push(items[j]);
						}
					}
					for(var i=0;i<pages.length; i++){
						var items = pages[i].items;
						for(var j=0; j<items.length; j++){
							allMenus.push(items[j]);
						}
					}
										
					//检查selection
					var winSelections = window.selections;
					var isFind = false;
					for(var i=0;i<winSelections.length;i ++){
						isFind = false;
						for(var j=0; j< allMenus.length; j++){
							if(winSelections[i].identification == allMenus[j].identification){
								isFind = true;
								break;
							}
						}
						if(!isFind){
							console.log("winSelections............")
							winSelections.splice(i, 1);
						}
					}
					chrome.storage.sync.set({"selections": winSelections}, function() {
						window.selections = winSelections;
					});
					
					//检查link
					var winLinks = window.links;
					var isFind = false;
					for(var i=0;i<winLinks.length;i ++){
						isFind = false;
						for(var j=0; j< allMenus.length; j++){
							if(winLinks[i].identification == allMenus[j].identification){
								isFind = true;
								break;
							}
						}
						if(!isFind){
							console.log("winLinks............")
							winLinks.splice(i, 1);
						}
					}
					chrome.storage.sync.set({"links": winLinks}, function() {
						window.links = winLinks;
					});
					
					//检查image
					var winImages = window.images;
					var isFind = false;
					for(var i=0;i<winImages.length;i ++){
						isFind = false;
						for(var j=0; j< allMenus.length; j++){
							if(winImages[i].identification == allMenus[j].identification){
								isFind = true;
								break;
							}
						}
						if(!isFind){
							console.log("winImages............")
							winImages.splice(i, 1);
						}
					}
					chrome.storage.sync.set({"images": winImages}, function() {
						window.images = winImages;
					});
					
					//检查page
					var winPages = window.pages;
					var isFind = false;
					for(var i=0;i<winPages.length;i ++){
						isFind = false;
						for(var j=0; j< allMenus.length; j++){
							if(winPages[i].identification == allMenus[j].identification){
								isFind = true;
								break;
							}
						}
						if(!isFind){
							console.log("winPages............")
							winPages.splice(i, 1);
						}
					}
					chrome.storage.sync.set({"pages": winPages}, function() {
						window.pages = winPages;
					});
				}
			},
			error:function(e){},
			complete:function(){
				console.log("check--server--menu--complete!")
			}
		});
	}
	
	//全部初始化完成后，在执行检查
	var checkServerHaveInterval=setInterval(function(){
		if(window.isInitComplete>=4){
			window.checkServerHaveChosenMenu();
			clearInterval(checkServerHaveInterval);
		}
	},100);
})();