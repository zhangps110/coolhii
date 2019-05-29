$(function(){
	
	//数据全部保存在background的window对象种
	var backWindow = chrome.extension.getBackgroundPage();
	var serverUrl = backWindow.serverUrl;
	
	var $pageHaveChosen = $("#page-have-chosen");
	var $imageHaveChosen = $("#image-have-chosen");
	var $linkHaveChosen = $("#link-have-chosen");
	var $selectionHaveChosen = $("#selection-have-chosen");
	
	/************************************************************
	 *  更新数据必须同步保存到chrome.storage 和 background的window中
	 * （右键菜单数据使用chrome.storage中的数据）
	 *************************************************************/
	
	/*菜单切换*****************************************************/
	$("html").css({
		"overflow-x":"hidden",
		"overflow-y":"hidden"
	});
	$("#plugin-home-iframe").attr("src", serverUrl+"plugin");
	$("#header-ul li").on("click", function(){
		$(this).parents("ul").find("li").removeClass("active");
		$(".show-box").hide();
		var id=$(this).attr("id").split("-")[1];
		if(id=="home"){
			$("html").css({
				"overflow-x":"hidden",
				"overflow-y":"hidden"
			});
		}else{
			$(this).addClass("active");
			$("html").css({
				"overflow-x":"hidden",
				"overflow-y":"auto"
			});
		}
		$("#"+id).show();
	});
	
	//设置的数据全部来自于服务器
	$.ajax({
		"url":serverUrl + "menu/item",
		"type":"POST",
		"dataType":"json",
		"async":true,
		success:function(data){
			createMenus(data);
		},
		error:function(e){
			alert("服务器出现错误！");
		},
		complete:function(){
			
		}
	});

	//生成菜单
	function createMenus(data){
		if(!!data){
			createHtml(data.images, backWindow.images, $("#image-waiting-chosen"));
			createHtml(data.links, backWindow.links,$("#link-waiting-chosen"));
			createHtml(data.pages, backWindow.pages, $("#page-waiting-chosen"));
			createHtml(data.selections, backWindow.selections, $("#selection-waiting-chosen"));
		}else{
			alert("服务器出现错误！");
		}
	}
	
	//初始化带选择项（已经选择的，分类生成）
	function createHtml(obj, haveChosenMenus, $appendObj){
		var html = '';
		var checked = "";
		for(var i=0;i<obj.length; i++){
			var classify = obj[i].classify;
			var items = obj[i].items;
			html += '<div class="waiting-chosen-item">';
			html += '<div class="classify"><b>'+classify.classifyName+'</b></div>';
			html += '<div class="list">';
			for(var j=0;j<items.length;j++){
				checked="";
				for(var k=0;k<haveChosenMenus.length;k++){
					if(haveChosenMenus[k].identification == items[j].identification){
						checked="checked";
						break;
					}
				}
				html += '<span class="item">'
							+'<input type="checkbox" name="menu-item" '+checked+'>'+items[j].name
							+'<p style="display:none;" data-identification="'+items[j].identification+'" data-name="'+items[j].name+'">'+items[j].url+'</p>'+
						'</span>';
			}
			html += '</div>';
			html += '</div>'
		}
		$appendObj.empty();
		$appendObj.append(html);
	}
	
	//监听带选择菜单input checkbox
	$("body").on("change","input[name='menu-item']",function(){
		var $showBox = $(this).parents(".show-box");
		var id = $showBox.attr("id");
		
		var $p = $(this).parents(".item").find("p");
		var identification = $p.attr("data-identification");
		var name = $p.attr("data-name");
		var url = $p.text();
		var dataObj={"identification":identification, "name":name, "url":url};
		
		dynamicUpdate(id, $(this).is(':checked'), dataObj);
	});
	
	//op=false:删除，op=true：添加
	//配置右键菜单
	function dynamicUpdate(id, op, dataObj){
		if(id=="image"){
			update("images", $imageHaveChosen, backWindow.images, op, dataObj);
		}
		else if(id=="page"){
			update("pages", $pageHaveChosen, backWindow.pages, op, dataObj);
		}
		else if(id=="selection"){
			update("selections", $selectionHaveChosen, backWindow.selections, op, dataObj);
		}
		else if(id=="link"){
			update("links", $linkHaveChosen, backWindow.links, op, dataObj);
		}
	}
	
	//更新数据：全局变量 和 存储变量 【保存在background的window对象中】
	//更新GUI
	function update(key, $appendObj, obj, op, dataObj){
		if(!op){
			for(var i=0;i<obj.length;i++){
				if(obj[i].identification == dataObj.identification){
					obj.splice(i, 1);
					break;
				}
			}
		}else{
			obj.push(dataObj);
		}		
		if("images" == key){
			chrome.storage.sync.set({"images": obj}, function() {
				backWindow.images = obj;
			});
		}
		else if("pages" == key){
			chrome.storage.sync.set({"pages": obj}, function() {
				backWindow.pages = obj;
			});
		}
		else if("selections" == key){
			chrome.storage.sync.set({"selections": obj}, function() {
				backWindow.selections = obj;
			});
		}
		else if("links" == key){
			chrome.storage.sync.set({"links": obj}, function() {
				backWindow.links = obj;
			});
		}
		updateOrCreateHaveChosenHtml(obj, $appendObj);
	}
	
	//更新已经选择项目
	function updateOrCreateHaveChosenHtml(obj, $appendObj){
		var html = "";
		for(var i=0; i<obj.length; i++){
			html += '<div class="have-chosen-item">'+
						'<span class="item-title" data-identification="'+obj[i].identification+'">'+obj[i].name+'</span>'+
						'<div class="pull-right">'+
							'<span class="item-btn operation-move move-up" data-identification="'+obj[i].identification+'"><span class="glyphicon glyphicon-arrow-up"></span></span>'+
							'<span class="item-btn operation-move move-down" data-identification="'+obj[i].identification+'"><span class="glyphicon glyphicon-arrow-down"></span></span>'+
							'<span class="item-btn operation-delete" data-identification="'+obj[i].identification+'"><span class="glyphicon glyphicon-trash"></span></span>'+
						'</div>'+
					'</div>';
		}
		$appendObj.empty();
		$appendObj.append(html);
	}
	
	//等待初始化完成
	var initInterval = setInterval(function(){
		if(backWindow.isInitComplete >= 4){
			updateOrCreateHaveChosenHtml(backWindow.pages, $pageHaveChosen);
			updateOrCreateHaveChosenHtml(backWindow.images, $imageHaveChosen);
			updateOrCreateHaveChosenHtml(backWindow.selections, $selectionHaveChosen);
			updateOrCreateHaveChosenHtml(backWindow.links, $linkHaveChosen);
			clearInterval(initInterval);
		}
	},200);
	
	
	/********************** 左边已经选中的操作 ************************/
	//左边菜单移动
	$("body").on("click", ".operation-move", function(){
		var identification = $(this).attr("data-identification");
		var type = -1;
		if($(this).hasClass("move-up")){
			type = 1;
		}
		if(identification.indexOf("selection-") != -1){
			var obj = backWindow.selections;
			obj = updateLeftHaveChosenOrder(obj, identification, type);
			chrome.storage.sync.set({"selections": obj}, function() {
				backWindow.selections = obj;
				updateOrCreateHaveChosenHtml(obj, $selectionHaveChosen);
			});
		}
		
		else if(identification.indexOf("image-") != -1){
			var obj = backWindow.images;
			obj = updateLeftHaveChosenOrder(obj, identification, type);
			chrome.storage.sync.set({"images": obj}, function() {
				backWindow.images = obj;
				updateOrCreateHaveChosenHtml(obj, $imageHaveChosen);
			});
		}
		
		else if(identification.indexOf("link-") != -1){
			var obj = backWindow.links;
			obj = updateLeftHaveChosenOrder(obj, identification, type);
			chrome.storage.sync.set({"links": obj}, function() {
				backWindow.links = obj;
				updateOrCreateHaveChosenHtml(obj, $linkHaveChosen);
			});
		}
		
		else if(identification.indexOf("page-") != -1){
			var obj = backWindow.pages;
			obj = updateLeftHaveChosenOrder(obj, identification, type);
			chrome.storage.sync.set({"pages": obj}, function() {
				backWindow.pages = obj;
				updateOrCreateHaveChosenHtml(obj, $pageHaveChosen);
			});
		}
	});
	
	//左边菜单删除
	$("body").on("click", ".operation-delete", function(){
		var identification = $(this).attr("data-identification");
		
		if(identification.indexOf("selection-") != -1){
			var obj = backWindow.selections;
			obj = removeLeftHaveChosen(obj, identification, $(this));
			chrome.storage.sync.set({"selections": obj}, function() {
				backWindow.selections = obj;
			});
		}
		
		else if(identification.indexOf("image-") != -1){
			var obj = backWindow.images;
			obj = removeLeftHaveChosen(obj, identification, $(this));
			chrome.storage.sync.set({"images": obj}, function() {
				backWindow.images = obj;
			});
		}
		
		else if(identification.indexOf("link-") != -1){
			var obj = backWindow.links;
			obj = removeLeftHaveChosen(obj, identification, $(this));
			chrome.storage.sync.set({"links": obj}, function() {
				backWindow.links = obj;
			});
		}
		
		else if(identification.indexOf("page-") != -1){
			var obj = backWindow.pages;
			obj = removeLeftHaveChosen(obj, identification, $(this));
			chrome.storage.sync.set({"pages": obj}, function() {
				backWindow.pages = obj;
			});
		}
	});
	
	//数据移动具体操作 type>0:上 ； type<0:下
	function updateLeftHaveChosenOrder(obj, identification, type){
		var len = obj.length;
		var item, index=0;
		
		if(obj.length == 1){
			return obj;
		}
		if(type > 0){
			index = 0; 
		}else{
			index = len-1;
		}
		for(var i=0; i<len; i++){
			if(obj[i].identification == identification && i != index){
				if(type > 0){  //上
					item = obj[i-1];
					obj[i-1] = obj[i];
					obj[i] = item;
				}else{  //下
					item = obj[i];
					obj[i] = obj[i+1];
					obj[i+1] = item;
				}
				break;
			}
		}
		return obj;
	}
	
	//左边已选择：删除操作
	function removeLeftHaveChosen(obj, identification, $op){
		for(var i=0; i<obj.length; i++){
			if(obj[i].identification == identification){
				obj.splice(i,1);
				$op.parents(".have-chosen-item").remove();
				updateCheckBoxStatus(identification);
				break;
			}
		}
		return obj;
	}
	
	//简单起见，我做全局匹配
	function updateCheckBoxStatus(identification){
		$("input[name='menu-item']").each(function(){
			var $p = $(this).parents(".item").find("p");
			var checkBoxIdentification = $p.attr("data-identification");
			console.log(checkBoxIdentification)
			if(checkBoxIdentification == identification){
				$(this).removeAttr("checked");
			}
		});
	}
	
	
	/******************************** 快捷键操作部分 **************************************/
	var shortcutWebsite = backWindow.shortcutWebsite;
	for(var i=0; i<shortcutWebsite.length; i++){
		$("#shortcut-website-"+(i+1)).val(shortcutWebsite[i]);
	}
	
	$("#update-shortcut-website").on("click",function(){
		var array = new Array();
		for(var i=1; i<4;i++){
			array.push($("#shortcut-website-"+(i)).val())
		}
		chrome.storage.sync.set({"shortcutWebsite": array}, function() {
			backWindow.shortcutWebsite = array;
			alert("设置完成，重启浏览器后生效！");
		});
	});
});
