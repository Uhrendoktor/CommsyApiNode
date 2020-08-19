const Room = require('./room.js');
module.exports = class DashboardRoom extends Room{
  constructor(CommsyClient){
    super(CommsyClient.UID, CommsyClient);
    this.path = '/dashboard';
    this.DashboardFeed = this.CommsyClient.require('./feed/dashboard_feed.js');
  }

  async setup(html){
    html = html?html:(await this.CommsyClient.request({path:this.path+'/'+this.id}).data);
    this.searchToken = html.match(/<input.*?name="search\[_token\]".*?value="(.*?)"/)[1];
    this._feed = new this.DashboardFeed(this, {});
  }
}
