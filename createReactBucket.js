// Import the necessary modules for creating an S3 bucket
const { Construct } = require('constructs');
const { Bucket } = require('@aws-cdk/aws-s3');

// Create a new Construct class for the S3 bucket
class VerboseS3BucketStack extends Construct {
  constructor(scope, id, props) {
    // Call the parent constructor
    super(scope, id, props);

    // Create a new S3 bucket
    const verboseBucket = new Bucket(this, 'VerboseBucket', {
      // Set the bucket name
      bucketName: 'your-verbose-bucket-name',

      // Make the bucket publicly accessible
      publicReadAccess: true,

      // Block public access to objects in the bucket
      blockPublicAccess: BucketPublicAccessBlock.BLOCK_ALL
    });

    // Log a message to the console indicating that the bucket has been created
    console.log('S3 bucket created successfully!');
  }
}

// Export the Construct class for use in other parts of the application
module.exports = { VerboseS3BucketStack };