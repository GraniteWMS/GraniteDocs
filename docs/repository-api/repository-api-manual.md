# Repository API

The primary responsibility of the Granite Repository API is to execute all persistence operations for Granite. 
These operations primarily involve tasks without specific business logic. 
In addition to serving our applications, third parties can utilize this API to retrieve and persist data.

---
## Setup

##### Requirements

- .Net Core 6
- IIS 8 onwards
- Sufficient permissions for folder and file access and IIS application creation
  
##### IIS settings

**`Take note`**
WebDAVModule is a installed feature/module of IIS.
When WebDAVModule is installed and enable it can cause issues with PUT/DELETE operations.
The symptoms will be that you cannot delete or edit any data in the WebDesktop.

`The error you would receive is a 405 Method not allowed.`

Open the web.config file and change the following section.
```xml
<modules runAllManagedModulesForAllRequests="true">
    <remove name="WebDAVModule" />
</modules>
```
---

## Application Settings

##### ConnectionStrings [CONNECTION]

Granite database connection
``` json
 "ConnectionStrings": {
    "CONNECTION": "Data Source=.;Initial Catalog=Granite;Persist Security Info=True;User ID=Granite"
  },
```

##### AllowedOrigins

The 'allowed origins' is a list of addresses for applications requiring access to the API. 
This may also include third parties utilizing the API. 
By default, the only address that requires configuration is the Granite **WebDesktop** address.

Example of a single address
```json

"AllowedOrigins": [ "https://192.168.1.10:8081" ]
```
Example of multiple (client/site have two allowed origins, maybe 3dr party access)
```json

"AllowedOrigins": [ "https://192.168.1.10:8081", "https://192.168.1.20:3009" ],
```

##### DateTimeFormat

- DateTimeFormat: this needs to be the same as in the WebDesktop appsettings.json, 
- Take Note: the WebDesktop requires capital DD/MM/YYYY and the below format as follows dd'/'MM'/'yyyy
- This is due to the technology used on the frontend compared to backend

- The date / time format in all returning data.
- Date and Times is a combination of your SQL query value and the Web Desktop Grid layout. You need to setup in accordance.

```json
"DateTimeFormat": "MM'/'dd'/'yyyy",
```

##### UseSameSiteCookies

Default set to true. (not string but boolean)
```json
  "UseSameSiteCookies": true,
```
Set to false if third party outside from host server communicate to API.
```json
  "UseSameSiteCookies": false,
```

---

## Getting Started

- Swagger UI (https://Your_Address:port/**swagger-ui**/)

To communicate with the API you first need to 'sign in' authorize.

- Via the Swagger UI navigate to the POST auth operation.

```
auth => POST = auth/{provider} 
```

Enter the username and password in the **Body** and click [Try it out].

```json
{
  "UserName": "UserName",
  "Password": "Password",
}
```

If the Username and Password was valid you should receive a **200 OK** response.
Now you are able to use the API via the **Swagger-UI** interface.