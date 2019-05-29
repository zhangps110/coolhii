window.selections = [
	{"identification":"selection-panXiaokesosoSearch","name":"小可搜搜", "url":"https://www.xiaokesoso.com/s/search?q={%word%}&currentPage=1"},
	{"identification":"selection-baiduSearch","name":"百度搜索", "url":"https://www.baidu.com/s?wd={%word%}&ie=utf-8"},
	{"identification":"selection-wordTranslationBaidu","name":"百度划词翻译", "url":"https://fanyi.baidu.com/?#en/zh/{%word%}"}
];

window.images = [
	{"identification":"image-pickupImageUrl","name":"提取图片地址", "url":""},
	{"identification":"image-newWindowsOpenUrl","name":"图片新窗口打开", "url":""},
	{"identification":"image-identifyImagesBaidu","name":"百度识图(链接已复制)", "url":"http://image.baidu.com/?fr=shitu"}
];

window.links = [
	{"identification":"link-pickupUrl","name":"提取链接地址", "url":""},
	{"identification":"link-linkCreateQrcode","name":"当前链接生成二维码", "url":"http://qr.topscan.com/api.php?w=250&text={%word%}"}
];

window.pages = [
	{"identification":"page-openPluginSetting","name":"插件设置", "url":"setting.html"},
	{"identification":"page-chromeOpenExtensions","name":"浏览器扩展", "url":"chrome://extensions/"},
	{"identification":"page-chromeOpenSetting","name":"浏览器设置", "url":"chrome://settings/"}
];

window.shortcutWebsite=[
	"https://www.baidu.com/", "https://www.zhihu.com/", "https://www.quzhuanpan.com/"
]


//初始化数据--------------------------------------------------
var isInitComplete = 0;
window.isInitComplete = 0;
chrome.storage.sync.get(["selections"], function(result) {
	if(!result.selections){
		chrome.storage.sync.set({"selections": selections}, function() {});
	}else{
		window.selections = result.selections;
	}
	isInitComplete = isInitComplete + 1;
	window.isInitComplete = isInitComplete;
});

chrome.storage.sync.get(["images"], function(result) {
	if(!result.images){
		chrome.storage.sync.set({"images": images}, function() {});
	}else{
		window.images = result.images;
	}
	isInitComplete = isInitComplete + 1;
	window.isInitComplete = isInitComplete;
});
chrome.storage.sync.get(["links"], function(result) {
	if(!result.links){
		chrome.storage.sync.set({"links": links}, function() {});
	}else{
		window.links = result.links;
	}
	isInitComplete = isInitComplete + 1;
	window.isInitComplete = isInitComplete;
});
chrome.storage.sync.get(["pages"], function(result) {
	if(!result.pages){
		chrome.storage.sync.set({"pages": pages}, function() {});
	}else{
		window.pages = result.pages;
	}
	isInitComplete = isInitComplete + 1;
	window.isInitComplete = isInitComplete;
});
//初始化数据--------------------------------------------------