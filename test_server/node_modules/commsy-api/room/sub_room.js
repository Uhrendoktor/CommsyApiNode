const Room = require('./room.js');
module.exports = class SubRoom extends Room{
  constructor(id, subpath, CommsyClient){
    super(id, CommsyClient);
    this.SubRooms = undefined;
    this.subpath = subpath;
    this.SubroomFeed = this.CommsyClient.require('./feed/subroom_feed.js');
  }

  async setup(html){
    html = html?html:(await this.CommsyClient.request({path:this.path+'/'+this.id+'/'+this.subpath}).data);
    this.searchToken = html.match(/<input.*?name="search\[_token\]".*?value="(.*?)"/)[1];
    this._feed = new this.SubroomFeed(this, {});
  }
}
