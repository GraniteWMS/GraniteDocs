![](api-key.png)

#

!!! warning
    This is V6 functionality, not yet released

## What are API Keys

API Keys are an authentication mechanism used to identify and authorize users or applications accessing an API, without using a user name and password. 
The key itself is simply a long string of characters and each one is unique to each Granite user. 
Here is an example of what a Granite API Key can look like: `TsIPsMSGzqYDjwTc-bd2CtrGU7FHwydPeuZ7ruA1DpPnzr7R3Swk8o_Nlkwd5Bty`

## Why do we need API Keys in Granite V6
Mainly, its because of the stricter security requirements on our new APIs.  
API Keys allow V6 SQLCLR procedures to connect securely to our APIs without needing the user's password.
API keys also provider a better experience for third parties using our APIs by providing a straightforward way to authenticate and authorize their requests.


## Which APIs support API keys

At the moment it is just the Business API that supports API keys. 

## How do I get an API key

API keys are automatically generated for Granite users whenever their password is saved. 
There is no way currently to view these API keys from the front end - you will need to fetch the API key out of the `UsersCredential` table in the Granite database.

!!! note 
    If you change your Granite user password, your API key will also change. 
    This is useful if an API key leaks and you need to invalidate the old one and regenerate a new one.

## How do I use an API key

You can use your API key to access the Granite APIs by passing it in a [HTTP Authorization Bearer token](https://datatracker.ietf.org/doc/html/rfc6750#section-2.1) like this:

```http
GET /resource HTTP/1.1
Host: server.example.com
Authorization: Bearer TsIPsMSGzqYDjwTc-bd2CtrGU7FHwydPeuZ7ruA1DpPnzr7R3Swk8o_Nlkwd5Bty
```