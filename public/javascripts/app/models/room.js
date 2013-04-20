(function(){
    var Room = can.Model({
      findAll : 'GET /rooms',
      findOne : 'GET /rooms/{id}',
      create  : 'POST /rooms',
      update  : 'PUT /rooms/{id}',
      destroy : 'DELETE /rooms/{id}' 
    }, {});
    
    window.Application.Models.Room = Room;
 })();