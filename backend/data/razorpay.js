
db.createCollection( 'razorpay', {validator: {$jsonSchema: {bsonType: 'object',title:'razorpay',properties: {paymentStaus: {bsonType: 'object'}}         }      }});  