# Business API
The Business API is an upgraded replacement for the Webservice. It is the back end that powers all of the business operations & transactions that can be performed in Granite.

## Setup

### Prerequisites
- [ASP.NET Core 8 Hosting Bundle](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- [IIS](../iis/getting-started.md)

### Configure

1. Configure the connection string to the GraniteDatabase in the `appsettings.json` file

    ```json
        "ConnectionStrings": {
            "CONNECTION": "Data Source=.\\SQL2022;Initial Catalog=GraniteDatabase;User ID=Granite;Password=******;Persist Security Info=True;TrustServerCertificate=True;Pooling=true;Min Pool Size=5;Max Pool Size=25;"
        }
    ```

## Getting started

The Business API is fully documented in Swagger and ServiceStack's Metadata. You can find these at the following addresses:

- https://[Your_Address]:[Port_Number]/metadata
- https://[Your_Address]:[Port_Number]/swagger-ui/

Most of the operations require you to first authenticate. To authenticate for testing, you can either use the `/auth` operation to validate using your Granite user credentials, or you can use your Api Key via Swagger's built in Authorize functionality.

### Credentials
To use credentials to authenticate, browse to `/swagger-ui/#!/auth/Authenticate_Post` and enter your UserName and Password. Click `Try it out!` to send the request.

On a successful authentication you will receive a 200 OK response.

### Api Key
To use your api key to authenticate, browse to the swagger ui, and click the Authorize button on the top right. In the value field, type the word 'Bearer' followed by a space and then your api key and then click Authorize. 

Example:

```
Bearer wM3laTJT99rOnnjjYejl6nZ-vvn6hCMNJGpwvMrksxp5eBnwCpEKchO9Q_NyLBun
```

You will then need to make a request that requires authentication to ensure that your api key was entered correctly. If it is not working you will receive a 401 response with a body like this:

```json
{
  "ResponseStatus": {
    "ErrorCode": "UnauthorizedAccessException",
    "Message": "User must be authenticated before performing ValidateLocation."
  }
}
```