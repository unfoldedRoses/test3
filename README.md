# test3
lambda functions invoking using rds mysq aws.



Creating an RDS Instance:
With the Lambda function securely deployed, the sorcerer can now conjure an RDS instance to serve as the realm for storing the enchanted records. The sorcerer can navigate to the AWS Management Console and follow these steps to create an RDS instance:

    Open the Amazon RDS service.
    Click "Create database" to initiate the instance creation process.
    Select the desired database engine, such as MySQL, to power the RDS instance.
    Specify the instance specifications, including instance type, storage, and allocated resources, based on the requirements of the record-keeping system.
    Configure the database settings, such as naming the database and providing master credentials for secure access.
    
To deploy a .zip file containing the index.js file to the AWS Lambda Function AWS console , follow these steps:

    Sign in to the AWS Management Console and open the AWS Lambda service.
    Click on "Create function" to start the function creation process.
    Choose an authoring option, such as "Author from scratch" or "Use a blueprint," based on your requirements.
    Provide a name for the Lambda function and select the desired runtime environment, such as Node.js.
    Under "Code entry type," select "Upload a .zip file" to upload your deployment package.
    Click on the "Upload" button and browse to locate and select the .zip file containing the index.js file on your local machine.
    Once the file is uploaded, AWS Lambda will automatically extract the contents of the .zip file and identify the entry point based on the configured runtime.
    In the "Handler" field, specify the filename (index.js) without the extension, followed by the name of the exported handler function. For example, if your exported function is named handler, the entry in the "Handler" field would be index.handler.
    Configure the desired runtime settings for your Lambda function, such as memory allocation and timeout values, in the "Basic settings" section.
    Define the necessary triggers for your Lambda function in the "Add triggers" section. Triggers can include API Gateway, CloudWatch Events, or other AWS services that can invoke your function.    

NOTE:: AS PER TASK WE ARE JUST DEMONSTRATING STEPS TO CREATE LAMDA FUNCTIONS AND INVOKING IN AWS CONSOLE ITSELF .  FOR FURTHER API ACCESS WE NEED TO CREATE API GATEWAY SERVICE FROM AWS TO EXPOSE ENDPOINTS WHICH IS NOT WRITTEN IN TASK MAIL SO I DID WHAT ONLY WAS REQUIRED!
