module.exports = class Room {
  static get DashboardRoom(){return require('./dashboard_room.js');}
  constructor(id, CommsyClient){
    this.id = id;
    this.path = '/room';
    this.CommsyClient = CommsyClient;

    this.Feed = this.CommsyClient.require('./feed/feed.js');
  }

  // SubRooms(){
  //   return {
  //     announcement : new this.SubRoom(this.id, 'announcement', this.CommsyClient),
  //     date: new this.SubRoom(this.id, 'date', this.CommsyClient),
  //     todo: new this.SubRoom(this.id, 'todo', this.CommsyClient),
  //     material: new this.SubRoom(this.id, 'material', this.CommsyClient),
  //     discussion: new this.SubRoom(this.id, 'discussion', this.CommsyClient),
  //     user: new this.SubRoom(this.id, 'user', this.CommsyClient),
  //     group: new this.SubRoom(this.id, 'group', this.CommsyClient),
  //     topic: new this.SubRoom(this.id, 'topic', this.CommsyClient)
  //   }
  // }

  async feed(){
    if(!this._feed) await this.setup();
    return this._feed;
  }

  async setup(html){
    html = html?html:((await this.CommsyClient.request({path:this.path+'/'+this.id})).data);
    this.searchToken = html.match(/<input.*?name="search\[_token\]".*?value="(.*?)"/)[1];
    this._feed = new this.Feed(this, {});
  }

  async search(options){
    if(!this.searchToken) await this.setup();
    return new this.Feed(this, options);
  }
}
