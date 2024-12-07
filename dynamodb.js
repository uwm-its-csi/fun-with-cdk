const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB();

const params = {
  TableName: 'PharmacyOrderTable',
  AttributeDefinitions: [
    { AttributeName: 'orderId', AttributeType: 'S' },
    { AttributeName: 'pharmacyOrderNum', AttributeType: 'S' }
  ],
  KeySchema: [
    { AttributeName: 'orderId', KeyType: 'HASH' },
    { AttributeName: 'pharmacyOrderNum', KeyType: 'RANGE' }
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'PharmacyOrderNumIndex',
      KeySchema: [
        { AttributeName: 'pharmacyOrderNum', KeyType: 'HASH' },
        { AttributeName: 'orderId', KeyType: 'RANGE' }
      ],
      Projection: {
        ProjectionType: 'ALL'
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
};

dynamoDb.createTable(params, (err, data) => {
  if (err) {
    console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
  } else {
    console.log("Table created successfully.", data);
  }
});