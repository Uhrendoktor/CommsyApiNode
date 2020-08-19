const https = require('./request');
const Room = require('./room/room.js');

class CommsyClient{
  constructor(SID, PHPSID, UID){
    this.root_url = 'unterricht.sh.schulcommsy.de';
    this.SID = SID;
    this.PHPSID = PHPSID;
    this.UID = UID;
    if(this.authenticated = SID&&PHPSID&&UID) this.setupRooms();
  }

  async login(username, password){
    if(this.authenticated){ return };
    let r0 = await this.request({ path: '/' });
    this.SID = https.parseURI(r0.options.headers.Cookie, '; ').SID;
    let r1 = r0.data.match(/\<form.*?action=["'](.*?)["'] name=["']login["']\>((.|[\r\n])*?)\<\/form\>/);
    let r2 = ((html)=>{
      let parsedObject = {};
      do{try{
        var match = html.match(/\<input.*?name=["'](.*?)["'].*?value=["'](.*?)["'].*?\>/);
        parsedObject[match[1]] = match[2];
        html = html.replace(match[0], '');
      }catch(e){}}while(match);
      return parsedObject;
    })(r1[2]);
    let post_data = https.parseToURI({
      security_token: (this.security_token = r2.security_token),
      auth_source: (this.auth_source = r2.auth_source),
      user_id: username,
      password: password,
      option: r2.option
    });
    console.log(post_data);
    let r3 = await this.request({
      method: 'POST',
      path: '/'+(()=>{ while(r1[1].match('amp;')){ r1[1] = r1[1].replace('amp;', ''); } return r1[1]; })(),
      data: post_data,
    });
    if(/<title>.*?(Error|error).*?<\/title>/.test(r3.data)) throw "Commsy Error: SchulCommsy is currently unavailable (Status: "+r3.response.statusCode+")";
    let cookie = https.parseURI(r3.options.headers.Cookie, '; ');
    this.SID = cookie.SID;
    this.PHPSID = cookie.PHPSESSID;
    this.UID = r3.options.path.match(/\/([0-9]*?)$/)[1];
    this.authenticated = true;
    await this.setupRooms();
    this.rooms.dashboard.setup(r3.data);
  }

  async setupRooms(dashboardHtml){
    console.log('setting up new Rooms');
    console.log(this);
    if(!this.authenticated) return;
    this.rooms = {
      dashboard: new Room.DashboardRoom(this)
    }
  }

  async request(options){
    return await https.request({
      method: options.method?options.method:'GET',
      host: options.host?options.host:this.root_url,
      path: options.path,
      headers: (()=>{
        let headers = {
          'User-Agent': 'Mozilla/5.0',
          'Cookie': options.cookie?options.cookie:https.parseToURI({SID:this.SID,PHPSESSID:this.PHPSID}, '; ')
        };
        if(options.data){
          headers['Content-Type'] = 'application/x-www-form-urlencoded';
          headers['Content-Length']= options.data.length;
        }
        return headers;
      })()
    }, options.data);
  }

  require(path){
    return require(path);
  }
}

module.exports = {
  CommsyClient : CommsyClient
}
