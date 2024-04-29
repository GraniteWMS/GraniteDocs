<img src="img/Granite_WMS_Primary logo1.png" alt= "" width="50%" height="50%">

# Getting Started
## Integration to Granite:

This document details the tools and information needed to integrate with Granite WMS.

**What will be covered:**

- Granite's APIs
- Detailing business objects
- Relationships between the business objects
- Instruction on authentication to make calls
- An example of a GET, POST, and  DELETE on one of the business objects. 

### Granite APIs: 
Granite operates using two APIs: 
- **Webservice API**: handles the business processes E.g picking or moving stock
- **Repository API** : handles the CRUD functionality of the business objects. 

For the purposes of integration with Granite, i.e maintaining documents , masteritems, locations, and trading partners,  the Repository API will cover 99% of use cases and, as such, shall be the only API detailed in this document. 

Detailing all of the Repository API calls will not be covered here as there is full Swagger documentation to reference for each call. To view the swagger documentation please go to 
localRepoAPIaddress/swagger-ui/  e.g. (https://granite.com:40196/swagger-ui/)

## Business objects:

Granite makes use of six core business objects. While there are other business objects used in Granite, these six represent the core functionality.

- **Locations**: are uniquely identified by a Barcode. Used to identify something as specific as a shelf or as general as an area in a warehouse. E.g Name: Cage A Shelf  3 Row 2 Barcode: A-3-2 or Name: Dispatch Code: DIS 

- **MasterItems**: are the identities of specific products and are uniquely identified using a Code. E.g. Code: ABCLZZ110 Product: KL371X ABRASIVE CLOTH 230 x 280mm

- **TradingPartners**: are any parties that will be listed on a document as either a customer or supplier. Trading partners are set up per Document type and are uniquely identified with a Code. E.g. Code: AVO15 Name: Avondale Confectionary 

- **Documents**: are the objects that represent sales orders, purchase orders, transfers, or manufacturing documents (documents are generic in Granite and represent any of the previously listed types). They can be considered the documents Header and are uniquely represented by a Number. E.g. A sales order for trading partner AVO15 Number: SO001263

- **DocumentDetails**: are the lines of the document and are uniquely assigned to a specific Document. E.g. There are multiple documentdetail entries that are assigned to SO001263 that detail the contents of the order. 

- **TrackingEntities**: represent the stock/physical goods in the system and are uniquely identified with a Barcode. A single tracking entity can represent only one masteritem. E.g. Barcode: T00000124 represents a quantity of 5 sheets of master item ABCLZZ110.

## Business object relationships 

<img src="img/Business object relationships.png" alt= "" width="50%" height="50%">

## Example calls: 
Following are a few examples of calls made to the repository API to provide some initial context.  
The calls for all the other objects are very similar so will not be detailed as their calls can be found in the swagger documention.  

### Authenticate:

The first call is /auth to authenticate for all following calls. The security uses cookies so if the same client is used this will only have to be called once per set of calls.
The format for the examples use json but xml, jsv, and csv are also supported 
If any other call is made without calling authorisation first it will return: 401 Unauthorized
```http
POST https://granite.com:40196/auth HTTP/1.1
Accept: application/json
Content-Type: application/json
Content-Length: length

{"UserName":"username","Password":"password"}
```
### Locations:

Following are examples of GET, POST, DELETE calls on the Location business object:
```http
GET https://granite.com:40196/Locations/{Barcode}?Barcode=DIS HTTP/1.1
Accept: application/json
```

```http
POST https://granite.com:40196/Locations HTTP/1.1
Accept: application/json
Content-Type: application/json
Content-Length: length

{"Body":{"Name":"ExampleLocation","Barcode":"EL123","Site":"","isActive":True,"NonStock":false,"ERPLocation":"ERP1","Category":"","Type":"","Status":"","Width":0,"Length":0,"Height":0,"MaximumWeight":0,"ERPIdentification":"ERPid123","AuditDate":"05/05/2023","AuditUser":"ErpSystem","Version":0}}
```
The same call can be used to modify the location by providing the granite id as part of the call:
```http
POST https://granite.com:40196/Locations HTTP/1.1
Accept: application/json
Content-Type: application/json
Content-Length: length

{"Body":{"ID":6064,"Name":"NewName","Barcode":"EL123","Site":"","isActive":True,"NonStock":false,"ERPLocation":"ERP1","Category":"","Type":"","Status":"","Width":0,"Length":0,"Height":0,"MaximumWeight":0,"ERPIdentification":"ERPid123","AuditDate":"05/05/2023","AuditUser":"ErpSystem","Version":0}}
```
```http
DELETE https://granite.com:40196/Locations/{Barcode}?Barcode=EL123 HTTP/1.1
Accept: application/json
```


