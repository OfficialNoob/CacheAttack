const fs = require('fs');
const fetch = require('node-fetch');

const cid_regex = /<link rel="canonical" href="https:\/\/www\.youtube\.com\/channel\/([a-z0-9-_]*)">/i;
const thumbnail_regex = /<link rel="image_src" href="(https:\/\/yt3\.ggpht\.com\/a\/[a-z0-9-_]*)[a-z0-9-_=]*">/i;

getChannels();

async function getChannels() {
  let r = await fetch("https://cors.usercontent.ndev.tk/channels");
  let channels = await r.json();
  var output = [];
  channels.forEach(async (channel, index) => {
    try {
    let r = await fetch("https://www.youtube.com/"+encodeURI(channel));
    if(r.status !== 200) return
    let result = await r.text();
    if(result.length === 0) return
    let cid = result.match(cid_regex)[1];
    let thumbnail = result.match(thumbnail_regex)[1];
    if(cid === undefined || thumbnail === undefined) return
    let url = thumbnail.concat("=s88-c-k-c0xffffffff-no-rj-mo");
    output.push([channelData.authorId, url]);
    } catch {}
    if(index === channels.length - 1) {
       fs.writeFileSync('channels', output);
    }
  });
}
