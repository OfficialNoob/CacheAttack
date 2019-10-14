const BlockCache = true;
Websites = new Map();
Websites.set('https://www.microsoft.com/favicon.ico?v2', "Microsoft")
.set("https://github.githubassets.com/favicon.ico", "Github")
.set("https://discordapp.com/assets/07dca80a102d4149e9736d4b162cff6f.ico", "Discord")
.set("https://www.yahoo.com/favicon.ico", "Yahoo")
.set("https://outlook.live.com/owa/favicon.ico", "Outlook")
.set("https://combo.staticflickr.com/pw/favicon.ico", "Flicker")
.set("https://static.xx.fbcdn.net/rsrc.php/yo/r/iRmz9lCMBD2.ico", "Facebook")
.set("https://abs.twimg.com/favicons/twitter.ico", "Twitter")
.set("https://ndev.tk/favicon.ico", "NVDev")
.set("https://www.bing.com/sa/simg/bing_p_rr_teal_min.ico", "Bing")
.set("https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png", "Reddit")
.set("https://s.ytimg.com/yts/img/favicon-vfl8qSV2F.ico", "Youtube")
.set("https://store.steampowered.com/favicon.ico", "Steam")
.set("https://ssl.gstatic.com/ui/v1/icons/mail/images/favicon5.ico", "Google mail")

function is304(res) { // Requires CORS
  if (res.encodedBodySize > 0 &&
      res.transferSize > 0 &&
      res.transferSize < res.encodedBodySize) {
    return true;
  }
  return null;
}

setTimeout(START, 50);
async function START() { 
  isCached = await isPageCached();
  if(isCached && BlockCache) {
    dataTable.hidden = true;
    removeCache.hidden = false;
    return
  }
  dataTable.hidden = false;
  Websites.forEach(Main);
  setTimeout(() => {
  performance.getEntriesByType("resource").forEach(res => {
    if(Websites.has(res.name)) Main(res, Websites.get(res.name));
  });
  }, 500);
}

async function addData(url) {
    let host = new URL(url).host;
    data.insertRow(0).insertCell(0).innerText = host;
}

async function Main(url, displayName) {
  let res = await Performance(url);
  let isCached = isCacheHit(res);
  if(isCached) addData(displayName);
}

async function Performance(url){
  var img = new Image(0,0);
  img.hidden = true;
  img.src = url;
  document.body.appendChild(img);
  let data = performance.getEntriesByName(url)[0];
  img.remove();
  return data;
}

function isCacheHit(res) {
if(is304(res)) return true;
if (res.transferSize > 0) return false;
if (res.decodedBodySize > 0) return true;
return res.duration < 40;
}

async function isPageCached() {
  if(is304(performance.getEntriesByType("navigation")[0])) return true;
  return (performance.getEntriesByType("navigation")[0].transferSize === 0);
}
