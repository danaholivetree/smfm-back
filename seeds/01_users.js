
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, name: 'Danah Olivetree', fb_id: '123312398474406', is_seller: true},
        {id: 2, name: 'Mike Clark', fb_id: '119401915527512', is_seller:true},
        {id: 3, name: 'Alison Kreitzberg', fb_id: '100760897392249', is_seller:true},
        {id: 4, name: 'Nick Jaina', fb_id: '121707668629367', is_seller:true},
        {id: 5, name: 'Wanda Pelgrina Caldas', fb_id: '128705387933873', is_seller:true},
        {id: 6, name: 'Leslie Orihel', fb_id: '137383483732601', is_seller:true},
        {id: 7, name: 'Desi Garcia', fb_id: '132843947518695', is_seller:true},
        {id: 8, name: 'Erin Lee Sule', fb_id: '129301244539011', is_seller:true},
        {id: 9, name: 'Andrea DesLauriers', fb_id: '100023661623414', is_seller:true},
        {id: 10, name: 'Jess Webb', fb_id: '116575952475777', is_seller:true}
      ]).then(() => {
               return knex.raw("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));")
                 })
         });
     };
