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
	menu.create=function(){  //生成菜单
		var isImageCreate = false;
		chrome.contextMenus.removeAll(function() {
			var parentId = chrome.contextMenus.create({
				title: "酷嗨- 浏览器助手",
		        contexts: ["selection","image","link","page"],
			});
			//直接读取存储种的数据--------
			chrome.storage.sync.get(["selections"], function(result) {
				var obj = result.selections;
				if(obj && obj.length>0){
					menu.createMenuItem(obj, ["selection"], parentId, clickItem);
				}
			});
			chrome.storage.sync.get(["images"], function(result) {
				var obj = result.images;
				if(obj && obj.length>0){
					menu.createMenuItem(obj, ["image"], parentId, clickItem);
				}
			});
			chrome.storage.sync.get(["links"], function(result) {
				var obj = result.links;
				if(obj && obj.length>0){
					menu.createMenuItem(obj, ["link"], parentId, clickItem);
				}
			});
			chrome.storage.sync.get(["pages"], function(result) {
				var obj = result.pages;
				if(obj && obj.length>0){
					menu.createMenuItem(obj, ["page"], parentId, clickItem);
				}
			});
			//直接读取存储种的数据--------
	   });
	};
	menu.createMenuItem=function(menus, context, parentId, clickItem){  //生成具体菜单
		for(var i=0; i<menus.length; i++){
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
		menu.create();
	},200);
	
	//isNewWindow = 0:新窗口
	//isNewWindow > 0:当前窗口
	function createTabs(url,isNewWindow){
		if(!!url){
			chrome.tabs.create({url: url});
		}
	}
	
})();