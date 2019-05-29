(function(){
	//右键菜单
	var menu = {"selection":1,"image":2,"link":3,"page":4};
	
	menu.getData=function(unionMenus, context, menuItemId){  //通过menuItemId查找数据
		for(var i=0;i<unionMenus.length;i++){
			if("coolhii_"+context+"_"+unionMenus[i].identification == menuItemId){
				return unionMenus[i];
			}
		}
		return new Array();
	}
	
	var isCreateMenuComplete = true;
	menu.create=function(){  //生成菜单
		isCreateMenuComplete = false;
		chrome.contextMenus.removeAll(function() {
			var parentId = chrome.contextMenus.create({
				title: "酷嗨- 浏览器助手",
		        contexts: ["selection","image","link","page"],
			});
			//直接使用当前全局window中的数据
			//读取本地数据为异步操作，会出现时序错误
			menu.createMenuItem(window.selections, ["selection"], parentId, clickItem);
			menu.createMenuItem(window.images, ["image"], parentId, clickItem);
			menu.createMenuItem(window.links, ["link"], parentId, clickItem);
			menu.createMenuItem(window.pages, ["page"], parentId, clickItem);
			isCreateMenuComplete = true;
			//直接使用当前全局window中的数据
	   });
	};
	menu.createMenuItem=function(menus, context, parentId, clickItem){  //生成具体菜单
		if(!parentId || !context[0]){
			return false;
		}
		for(var i=0; i<menus.length; i++){
			if(!!menus[i].name && !!menus[i].identification){
				chrome.contextMenus.create({
					title: menus[i].name,
			        contexts: context,
			        id: "coolhii_"+context[0]+"_"+menus[i].identification,
			        parentId:parentId,
			        onclick: function(data,item){
			        	data.addedCoolHiiContext = context[0]; 
			        	clickItem(data,item);
			        }
				})
			}
		}
	};

	
	function clipboard(text){
		var textarea = document.getElementById("tmp-clipboard"); 
		textarea.value = text;
		textarea.select();
		document.execCommand("copy",false,null);
	}
	
	//点击菜单操作
	function clickItem(data,item){
		var context = data.addedCoolHiiContext;
		
		//统一查询
		var unionMenus = window.pages.concat(window.links);
		unionMenus = unionMenus.concat(window.selections);
		unionMenus = unionMenus.concat(window.images);
		var itemData = menu.getData(unionMenus, context, data.menuItemId);
		//统一查询
		
		var url = itemData.url;
		var identification = itemData.identification;
		
		if(identification.indexOf("selection-") != -1){
			var selectionText = data.selectionText;
			url = url.replace(/{%word%}/g, encodeURIComponent(selectionText));
			if(identification == "selection-wordTranslationYoudao"){
				clipboard(selectionText);
			}
			createTabs(url, 0);
		}else if(identification.indexOf("image-") != -1){
			var srcUrl = data.srcUrl;
			var linkUrl =  data.linkUrl;
			switch(identification){
				case "image-identifyImagesGoogle":
					url = url.replace(/{%url%}/g, encodeURIComponent(srcUrl));
					createTabs(url, 0);
					break;
				case "image-identifyImagesBaidu":
					clipboard(srcUrl);
					createTabs(url, 0);
					break;
				case "image-IdentifyImagesQrcode":
					
					break;
				case "image-pickupImageUrl":
					alert(srcUrl);
					break;
				case "image-newWindowsOpenUrl":
					createTabs(srcUrl, 0);
					break;
			}
		}else if(identification.indexOf("link-") != -1){
			var linkUrl =  data.linkUrl;
			switch(identification){
				case "link-linkCreateQrcode":
					url = url.replace(/{%word%}/g, encodeURIComponent(linkUrl));
					createTabs(url,0);
					break;
				case "link-pickupUrl":
					alert(linkUrl);
					break;
			}
		}else if(identification.indexOf("page-") != -1){
			var pageUrl =  data.pageUrl;
			url = url.replace(/{%word%}/g, encodeURIComponent(pageUrl));
			createTabs(url,0);
		}
	}
	
	//轮询监听右键变化
	setInterval(function(){
		if(isCreateMenuComplete){
			menu.create();
		}
	},200);
	
	//isNewWindow = 0:新窗口
	//isNewWindow > 0:当前窗口
	function createTabs(url,isNewWindow){
		if(!!url){
			chrome.tabs.create({url: url});
		}
	}
	
})();