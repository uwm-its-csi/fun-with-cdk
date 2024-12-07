const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB();
const lambda = new AWS.Lambda();

const tableName = 'PharmacyOrderTable';

const createTableParams = {
  TableName: tableName,
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

dynamoDb.createTable(createTableParams, (err, data) => {
  if (err) {
    console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
  } else {
    console.log("Table created successfully.", data);

    // Create Lambda functions
    const createLambdaFunction = (functionName, handlerFile, environment) => {
      const params = {
        FunctionName: functionName,
        Runtime: 'nodejs18.x',
        Role: 'your_lambda_execution_role_arn', // Replace with your Lambda execution role ARN
        Handler: handlerFile,
        Code: {
          ZipFile: Buffer.from(require('fs').readFileSync(handlerFile))
        },
        Environment: {
          Variables: {
            TABLE_NAME: tableName
          }
        }
      };

      lambda.createFunction(params, (err, data) => {
        if (err) {
          console.error(`Error creating ${functionName} Lambda function:`, err);
        } else {
          console.log(`${functionName} Lambda function created successfully.`);
        }
      });
    };

    createLambdaFunction('writeToPharmacyDb', 'write_to_pharmacy_db.zip', { TABLE_NAME: tableName });
    createLambdaFunction('readFromPharmacyDb', 'read_from_pharmacy_db.zip', { TABLE_NAME: tableName });
  }
});