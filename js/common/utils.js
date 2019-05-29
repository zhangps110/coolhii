//时间格式化：如：2018112116
function formatDate(time){
    var date = new Date(time);
    var year = date.getFullYear(),
        month = date.getMonth()+1,//月份是从0开始的
        day = date.getDate(),
        hour = date.getHours(),
        min = date.getMinutes(),
        sec = date.getSeconds();
    var newTime = year +""
    	+ (month < 10? '0' + month : month) +""
    	+ (day < 10? '0' + day : day)+""
    	+ (hour < 10? '0' + hour :hour)+""
    	+ (min < 10? '0' + min : min)+"";
    return newTime;         
}

//睡眠延时函数：单位ms
function sleep(numberMillis) { 
	var now = new Date(); 
	var exitTime = now.getTime() + numberMillis; 
	while (true) { 
		now = new Date(); 
		if (now.getTime() > exitTime) {
			return; 
		}
	} 
}

//产生范围随机值
function createRandom(low, high){
	return Math.floor(Math.random()*(high-low)+low);
}

key('⌘+x, ctrl+x', function(event, handler){
	chrome.tabs.query({ active: true }, function(tabs) {
       chrome.tabs.remove(tabs[0].id);
  	});
});

