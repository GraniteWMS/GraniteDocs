# Business API
The Business API is the back end that powers all of the business operations & data persistence in Granite WMS. It is responsible for the transactions performed via the Process App, as well as maintenance of master data and documents performed via the Web Desktop.

In addition to serving our applications, third parties can utilize this API to retrieve data for **integration** purposes.

## Setup

### Prerequisites
- [ASP.NET Core 8 Hosting Bundle](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- [IIS](../iis/getting-started.md)    

### Configure

Configure the below in the `appsettings.json` file

1. Connection string

    ```json
        "ConnectionStrings": {
            "CONNECTION": "Data Source=.\\SQL2022;Initial Catalog=GraniteDatabase;User ID=Granite;Password=******;Persist Security Info=True;TrustServerCertificate=True;"
        }
    ```

2. AllowedOrigins

    The 'allowed origins' is a list of addresses for applications requiring access to the API. 
    This may also include third parties utilizing the API. 
    By default, the only address that requires configuration is the Granite **WebDesktop** address.

    Example single address
    ```json
      "AllowedOrigins": [ "https://192.168.1.10:8081" ]
    ```
    Example multiple
    ```json
      "AllowedOrigins": [ "https://192.168.1.10:8081", "https://192.168.1.20:3009" ],
    ```

3. DateTimeFormat

    This setting sets the datetime format returned by the Business API.

    !!! note
        This needs to be the same as in the WebDesktop `appsettings.json`

        The WebDesktop requires the format to be capitalized `DD/MM/YYYY`, while the Business API requires the format as follows `dd'/'MM'/'yyyy`

        This difference is due to the difference in the technology used on the frontend and backend

    ```json
    "DateTimeFormat": "MM'/'dd'/'yyyy",
    ```

4. UseSameSiteCookies

    Same Site Cookies are a good default to use in your Apps which restricts cookies from being sent cross-site in order to prevent against cross-site request forgery (CSRF) attacks.
    Cookies are typically sent to third parties in cross origin requests. This can be abused to do CSRF attacks.

    Default set to true. (value type Boolean)
    ```json
      "UseSameSiteCookies": true,
    ```
    Disable if 3rd parties need access to the API. 
    ```json
      "UseSameSiteCookies": false,
    ```

5. Auth

    These settings control how long a login stays valid.

    ```json
      "Auth": {
        "SessionExpiryMinutes": 30,
        "JwtExpiryMinutes": 480
      }
    ```

    - `SessionExpiryMinutes` - how many idle minutes before a login session expires. Defaults to 30.
    - `JwtExpiryMinutes` - how many minutes the token that is issued at login stays valid. Defaults to 480 (8 hours).

    See [Session Timeout Configuration](../process-app/session-timeout.md) for how these work together with the ProcessApp's settings.

### Add to IIS

Add the Business API to IIS with an `https` binding and a certificate. See [Adding a site to IIS](../iis/getting-started.md#adding-a-site-to-iis).

!!! note
    The Business API must run as `https`. The login token that the ProcessApp, Integration Service and Label Print service depend on is only issued over https.

    Every application that calls the Business API must use the `https://` address - the ProcessApp, WebDesktop, SQLCLR (`Business_API_Endpoint` in `SystemSettings`) and integrations.

## Getting started

The Business API is fully documented in Swagger and ServiceStack's Metadata. You can find these at the following addresses:

- https://[Your_Address]:[Port_Number]/metadata
- https://[Your_Address]:[Port_Number]/swagger-ui/

Most of the operations require you to first authenticate. To authenticate for testing, you can either use the `/auth` operation to validate using your Granite user credentials, or you can use your API Key.

### Credentials
To use credentials to authenticate, browse to `/swagger-ui/#!/auth/Authenticate_Post` and enter your UserName and Password. Click `Try it out!` to send the request.

On a successful authentication you will receive a 200 OK response. The response contains the details of the user, as well as a token (`BearerToken`) that identifies the user to the other Granite services.
The token is also returned as a cookie, so a client that keeps cookies does not need to do anything further.

!!! note
    The token is only issued over `https`. Logging in using an `http` address will not work.

### API Key
To use your api key to authenticate, send it in the `X-Api-Key` header of each request. See [API Keys](../security/api-keys.md) for more detail.

Example:

```http
GET https://{server-address}:{port}/Locations?Barcode=DIS HTTP/1.1
Accept: application/json
X-Api-Key: wM3laTJT99rOnnjjYejl6nZ-vvn6hCMNJGpwvMrksxp5eBnwCpEKchO9Q_NyLBun
```

!!! warning "Changed in version 7"
    The API key is no longer accepted as an `Authorization: Bearer` token.

If your api key is not working you will receive a 401 response with a body like this:

```json
{
  "ResponseStatus": {
    "ErrorCode": "UnauthorizedAccessException",
    "Message": "User must be authenticated before performing ValidateLocation."
  }
}
```