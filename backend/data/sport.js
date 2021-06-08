
db.createCollection( 'sport', {validator: {$jsonSchema: {bsonType: 'object',title:'sport',properties: {name: {bsonType: 'string'}}         }      }});  