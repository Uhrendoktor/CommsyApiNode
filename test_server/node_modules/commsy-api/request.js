module.exports = {
  parseURI: parseURI,
  parseToURI: parseToURI,
  splitUrl: splitUrl,
  addCookie: addCookie,
  request: request
}

const https = require('https');

function parseToURI(object, symbol){
  let s = '';
  if(!object) return s;
  symbol = symbol?symbol:'&';
  for(let key in object){
    if(object[key]||object[key]===0) s+=`${key}=${object[key]}${symbol}`;//s+=`${key}&`;
  }
  return s.substring(0, s.length-symbol.length);
}

function parseURI(url, symbol){
  let parsedObject = {};
  if(!url) return parsedObject;
  url.split(symbol?symbol:'&').forEach((item, i) => {
    let split = item.split('=');
    parsedObject[split[0]] = split[1];
  });
  return parsedObject;
}

function splitUrl(url){
  let v = url.replace(/http.*?:\/\//,'');
  v = v.match(/(.*?\..*?)([\/|\?].*?)$/);
  if(!v) return {
    host:undefined,
    path: url[0]=='/'?url:'/'+url
  };
  console.log(v[1],v[2])
  return{
    host: v[1][0]=='/'?v[1]:'/'+v[1],
    path: v[2]
  }
}

function addCookie(header, cookie){
  if(!cookie) return header;
  cookie = cookie.toString().match(/(.*?);.*?path/)[1];
  if(!header) return {Cookie:cookie}
  if(!header.Cookie){
    header.Cookie = cookie;
    return header;
  }
  let parsedHeaderCookie = parseURI(header.Cookie, '; ');
  let parsedCookie = parseURI(cookie);
  for(let key in parsedCookie){
    parsedHeaderCookie[key] = parsedCookie[key];
  }
  header.Cookie = parseToURI(parsedHeaderCookie, '; ');
  return header;
}

async function request(options, post_data){
  let result = await new Promise((resolve, reject)=>{
    let req = https.request(options, async (response)=>{
      let headers = JSON.parse(JSON.stringify(response.headers));
      options.headers = addCookie(options.headers, headers["set-cookie"]);
      if(response.statusCode == 301 || response.statusCode == 302){
        console.log('redirecting: '+options.host+options.path);
        let url = splitUrl(response.headers.location);
        if(url.path.match(/http/))return;
        resolve(await request(options = {
          host: url.host?url.host:options.host,
          path: url.path,
          headers: {
            'User-Agent': options.headers['User-Agent'],
            Cookie: options.headers.Cookie?options.headers.Cookie:''
          }
        }, post_data));
        req.end();
        return;
      }
      let data = '';
      response.on('data', (d)=>{ data+=d.toString(); });
      response.on('end', ()=>{ resolve({
        response: response,
        data: data,
      });});
    });
    req.on('error', (error)=>{ reject(error); });
    if(post_data) req.write(post_data);
    req.end();
  });
  let match = result.data.match(/<meta http-equiv=["']refresh["'](.|[\r\n])*?document.location.href.*?["'](.*?)["']/);
  if(match){
    options.path = '/'+match[2]+"1";
    //console.log('\nredirecting (commsy)', options, post_data);
    return request(options, post_data);
  }
  result.options = options;
  return result;
}
