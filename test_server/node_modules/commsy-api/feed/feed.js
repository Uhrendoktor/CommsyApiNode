module.exports = class Feed{
  constructor(Room, options){
    this.Room = Room;
    this.options = options;

    this.Item = this.Room.CommsyClient.require('./feed/item.js');
    this.Room_ = this.Room.CommsyClient.require('./room/room.js');
  }

  async getItems(lastId, lastIndex){
    let path = this.generatePath({lastIndex:lastIndex, lastId:lastId});
    let items;
    if(this.options.search){
      items = await this.parseFeed((await this.Room.CommsyClient.request({
        method:'POST',
        path:path,
        data: {
          'search[phrase]': this.options.search,
          'search[_token]': this.Room.searchToken
        },
      })).data);
    }else{ items = await this.parseFeed((await this.Room.CommsyClient.request({path:path})).data); }
    this.lastId = items[items.length-1].id;
    return items;
  }

  async nextItems(){
    return await this.getItems(this.lastId);
  }

  generatePath(options){
    if(!this.options.search) return `${this.Room.path}/${this.Room.id}/feed/${options.lastIndex?options.lastIndex:0}/${this.options.sort?this.options.sort:'date'}${options.lastId?'?lastId='+options.lastId:''}`;
    return `${this.Room.path}/${this.Room.id}/search/results`;
  }

  async parseFeed(html){
    let items = [];
    do{try{
      var match = html.match(/<article.*?>(.|[\n\r])*?<\/article>/);
      html = html.replace(/<article.*?>(.|[\n\r])*?<\/article>/, '');
      //latest change this -> this.Room
      let item = new this.Item(this.Room);
      await item.setup(match[0]);
      items.push(item);
    }catch(e){}}while(match);
    return items;
  }
}
