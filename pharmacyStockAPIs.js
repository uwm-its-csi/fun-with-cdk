const { Construct } = require('constructs');
const { RestApi, LambdaIntegration } = require('@aws-cdk/aws-apigateway');
const { Function, Runtime, Code } = require('@aws-cdk/aws-lambda');
const { Table, AttributeType } = require('@aws-cdk/aws-dynamodb');

class PharmacyApiGateway extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Create a DynamoDB table for pharmacy orders
    const pharmacyOrderTable = new Table(this, 'PharmacyOrderTable', {
      partitionKey: { name: 'orderId', type: AttributeType.STRING },
      sortKey: { name: 'orderDate', type: AttributeType.STRING },
      billingMode: TableBillingMode.PAY_PER_REQUEST
    });

    // Create 10 Lambda functions, each with a different purpose related to pharmacy orders
    const lambdaFunctions = [
      {
        name: 'createOrder',
        handler: 'createOrder.handler',
        permissions: [pharmacyOrderTable.grantWriteData()]
      },
      {
        name: 'getOrderById',
        handler: 'getOrderById.handler',
        permissions: [pharmacyOrderTable.grantReadData()]
      },
      // ... other Lambda functions with different purposes
    ];

    // Create an API Gateway
    const api = new RestApi(this, 'PharmacyApi');

    // Create API resources and methods for each Lambda function
    lambdaFunctions.forEach(lambdaFunction => {
      const resource = api.root.resourceForPath(`/api/${lambdaFunction.name}`);
      const integration = new LambdaIntegration(new Function(this, lambdaFunction.name, {
        runtime: Runtime.NODEJS_18_X,
        code: Code.fromAsset(`lambda-functions/${lambdaFunction.handler}`),
        handler: lambdaFunction.handler,
        environment: {
          TABLE_NAME: pharmacyOrderTable.tableName
        },
        ...lambdaFunction.permissions
      }));
      resource.addMethod('POST', integration); // Adjust the HTTP method as needed
    });
  }
}

module.exports = { PharmacyApiGateway };