const Feed = require('./feed.js');

module.exports = class DashboardFeed extends Feed{
  generatePath(options){
    return `${this.Room.path}/${this.Room.id}/feed/${options.lastIndex?options.lastIndex:0}/${this.options.sort?this.options.sort:'date'}${options.lastId?'?lastId='+options.lastId:''}`;
  }

  async parseFeed(html){
    let items = [];
    do{try{
      var match = html.match(/<article.*?>(.|[\n\r])*?<\/article>/);
      let room = new this.Room_(match[0].match(/<a href="\/room\/([0-9]+)">.*?<\/a>/)[1], this.Room.CommsyClient);
      let item = new this.Item(room);
      await item.setup(match[0]);
      items.push(item);
      html = html.replace(/<article.*?>(.|[\n\r])*?<\/article>/, '');
    }catch(e){}}while(match);
    return items;
  }
}
