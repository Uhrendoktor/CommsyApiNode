const Feed = require('./feed.js');

module.exports = class DashboardFeed extends Feed{
  generatePath(options){
    return `${this.Room.path}/${this.Room.id}/${this.Room.subpath}/feed/${options.lastIndex?options.lastIndex:0}/${this.options.sort?this.options.sort:'date'}${options.lastId?'?lastId='+options.lastId:''}`;
  }
}
