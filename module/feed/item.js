module.exports = class Item{
  constructor(Room, id){
    this.Room = Room;
    this.path = '/material';
    this.id = id;
  }

//TODO check for date!! bzw. types in general
  async setup(html){
    if(html){
      this.id = html.match(/<article.*?data-item-id="(.*?)">/)[1];
      this._title = html.match(/<h4 class="uk-comment-title">[^`]*?>[^`]*?([^ \n\r][^`]*?)[ \n\r]+<[^`]*?<\/h4>/)[1];
      this._date = html.match(/<span.*?class="uk-text-nowrap">\s+([^`]*?)\s+<\/span>/)[1];
      this._type = html.match(/<i.*?class=".*?uk-icon-([a-zA-Z]+)[^`]*?uk-icon-small">/)[1];
      if(this._type!='calendar'){
        let meta = html.match(/<div class="uk-comment-meta">[^`]?Von: (<a.*?>|) *?([a-z,A-Z]+) ([a-z,A-Z]+)[^`]*?(\(.*?\)|)[^`]*?<\/div>/);
        this._author = meta[2]+' '+meta[3];
      }else{
        let meta = html.match(/<div class="uk-comment-meta">.*?([0-9]*?\.[0-9]*?\.[0-9]+)[^`]*?([0-9]*?\:[0-9]+)[^`]*?([0-9]*?\:[0-9]+)[^`]*?<\/div>/);
        this._time = {
          date: meta[1],
          from: meta[2],
          to: meta[3]
        }
      }
    }else{
      setup(await this.Room.CommsyClient.request({path:`${this.Room.path}/${this.Room.id}/${this.path}/${this.id}`}));
    }
  }

  get title(){
    return new Promise(async (resolve, reject)=>{
      if(!this._title) await this.setup();
      resolve(this._title);
    });
  }

  get author(){
    return new Promise(async (resolve, reject)=>{
      if(!this._author) await this.setup();
      resolve(this._author);
    });
  }

  get date(){
    return new Promise(async (resolve, reject)=>{
      if(!this._date) await this.setup();
      resolve(this._date);
    });
  }

  get type(){
    return new Promise(async (resolve, reject)=>{
      if(!this._type) await this.setup();
      resolve(this._type);
    });
  }

  get time(){
    return new Promise(async (resolve, reject)=>{
      if(this.type != 'calendar') resolve();
      if(!this._time) await this.setup();
      resolve(this._time);
    });
  }
}
