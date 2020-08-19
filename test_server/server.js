const commsyApi = require('commsy-api');

(async()=>{
  var client = new commsyApi.CommsyClient();
  await client.login('JuliusWalczynski', 'Picasso20#14');
  let dashboard_feed = await client.rooms.dashboard.feed();
  let items = await dashboard_feed.getItems();
  console.log(items[0]);
  //console.log('----------');
  //console.log(await dashboard_feed.nextItems());
  //let room = items[0].Room;
  //let room_material_feed = await room.Subrooms.material.feed();
  //console.log('------');
  //console.log(await room_material_feed.getItems());
})()
