window.selections = [
	{"identification":"selection-baiduSearch","name":"百度搜索", "url":"https://www.baidu.com/s?wd={%word%}&ie=utf-8"},
	{"identification":"selection-baiduBaike","name":"百度百科", "url":"https://baike.baidu.com/item/{%word%}"}
];

window.images = [
	{"identification":"image-identifyImagesGoogle","name":"google识图", "url":"http://www.google.com/searchbyimage?image_url={%url%}"},
	{"identification":"image-identifyImagesBaidu","name":"百度识图(链接已复制)", "url":"http://image.baidu.com/?fr=shitu"}
];

window.links = [
	{"identification":"link-pickupUrl","name":"提取链接地址", "url":""},
	{"identification":"link-linkCreateQrcode","name":"当前链接生成二维码", "url":"http://qr.topscan.com/api.php?w=250&text={%word%}"}
];

window.pages = [
	{"identification":"page-chromeOpenHistory","name":"打开历史记录", "url":"chrome://history/"},
	{"identification":"page-chromeOpenExtensions","name":"浏览器扩展", "url":"chrome://extensions/"}
];

window.shortcutWebsite=[
	"https://www.baidu.com/", "https://www.zhihu.com/", "https://www.quzhuanpan.com/"
]


//初始化数据------这里是一部操作，因此采用几步操作，以确保全部加载完成
var isInitComplete = 0;
window.isInitComplete = 0;
chrome.storage.sync.get(["selections"], function(result) {
	if(!result.selections){
		chrome.storage.sync.set({"selections": selections}, function() {});
	}else{
		window.selections = result.selections;
	}
	window.isInitComplete = isInitComplete+1;
});

chrome.storage.sync.get(["images"], function(result) {
	if(!result.images){
		chrome.storage.sync.set({"images": images}, function() {});
	}else{
		window.images = result.images;
	}
	window.isInitComplete = isInitComplete+1;
});
chrome.storage.sync.get(["links"], function(result) {
	if(!result.links){
		chrome.storage.sync.set({"links": links}, function() {});
	}else{
		window.links = result.links;
	}
	window.isInitComplete = isInitComplete+1;
});
chrome.storage.sync.get(["pages"], function(result) {
	if(!result.pages){
		chrome.storage.sync.set({"pages": pages}, function() {});
	}else{
		window.pages = result.pages;
	}
	window.isInitComplete = isInitComplete+1;
});
//初始化数据------这里是一部操作，因此采用几步操作，以确保全部加载完成