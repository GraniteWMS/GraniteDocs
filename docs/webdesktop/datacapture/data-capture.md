
### Introduction (Version 6.0 ~)
Data Capture also known as Quick Capture allows you to setup custom screens
to capture information. This could be done on any of the Modules listed below that represents 
a screen in the webdesktop.

The reason to use data capture is to stream line data entry and to allow the user to capture specific sets of data 
effortless.

Under the hood data capture maps the data capture fields directly to the Repository API. 
In order to understand what fields you can specify you can review the API operation that the module 
calls and look at the API parameters.

### Supported Modules (Web Desktop screens)

| Module Name            | Screen                          | API                          | Notes                          |
|------------------------|---------------------------------|------------------------------||
| MASTERITEM             | Setup -> MasterItem             | /MasterItems (POST)          ||
| MASTERITEMALIAS        | Setup -> MasterItem             | /MasterItemAlias (POST)      ||
| LOCATION               | Setup -> Location               | /Locations (POST)            ||
| USERS                  | Setup -> Users                  | /Users (POST)                ||
| TRADINGPARTNER         | Setup -> Trading Partner        | /TradingPartners (POST)      | |
| ORDERDOCUMENT          | Outbound -> Orders              | /Documents (POST)        | Field: Type = ORDER |
| ORDERDOCUMENTDETAIL    | Outbound -> Orders              | /DocumentDetails (POST)  | Field: Document_id not required to specify. |
| RECEIVINGDOCUMENT      | Inbound -> Document             | /Documents (POST)    |Field: Type = ORDER |
| RECEIVINGDOCUMENTDETAIL| Inbound -> Document             | /DocumentDetails (POST)|Field: Document_id not required to specify. |
| TRANSFERDOCUMENT       | Transfer -> Transfer  Document  | /Documents (POST)     |Field: Type = TRANSFER |
| TRANSFERDOCUMENTDETAIL | Transfer -> Transfer  Document  | /DocumentDetails (POST)|Field: Document_id not required to specify. |

!!! note
	Data capture Field **Type** for document modules must be set. 
	These can be invisible. 

!!! note
	For document detail capture the API requires the Document_id. This field do not require setup.


### Data Capture Fields Names

The data capture fields for each module is the same parameters name of the Repository API operation.
Please review the above table to get the Repository API operation.

!!! note
	Any field that is required by the Repository API need to be setup (exception Document_id)
    These fields can be invisible and a default can be used. 

!!! note
	When using LOCATION or MASTERITEM (Types, see below) the field will map to the ID field of the API operation.
    Therefor it's important to check the API documentation on what the field should be called. 
    Example: Item_id or MasterItem_id would typically be the name for your Master Item field.


### Data Capture Fields Types
The following types is available 

- **MASTERITEM**: Master Item dropdown of code and description. Take Note, the name of the field would typical be *_id.
- **LOCATION**: Location dropdown of Barcode and Name.  
- **STRING**: A primitive string.
- **NUMBER**: A primitive number or int.
- **BOOLEAN**: A primitive boolean.

### Example

This example allow you to capture a *Portland transfer*. Based on Transfer Document header,
the example ask the user the document number and proceed to capture all the other necessary fields in the *background*

**DataCapture Table entries**

| Name                    | Description               | Module                |
|-------------------------|---------------------------|------------------------|
| PORTLAND_TRANSFER        | Portland Transfer Request | TRANSFERDOCUMENT       |

**DataCaptureFields Table entries**

| DataCapture       | Name         | Description   | Index | Required | Type | Default Value   | Visible |
|-------------------|---------------|----------------|-------|---------|-----------|-----------------|----------|
| PORTLAND_TRANSFER | **Number**        | Number         | 0     | True    | STRING    |                 | True     | 
| PORTLAND_TRANSFER | *Site*          | Site           | 90    | True    | STRING    | PORTLAND | False    |
| PORTLAND_TRANSFER | *ERPLocation*   | ERPLocation    | 91    | True    | STRING    | 2               | False    | 
| PORTLAND_TRANSFER | *Type*          | Type           | 92    | True    | STRING    | TRANSFER        | False    | 
| PORTLAND_TRANSFER | *Status*        | Status         | 93    | True    | STRING    | ENTERED         | False    | 
| PORTLAND_TRANSFER | *isActive*      | isActive       | 94    | True    | BOOLEAN   | 1               | False    |


Continuing with *Portland transfer* this is the entry for capturing lines.


**DataCapture Table entries**

| Name                    | Description               | Module                |
|-------------------------|---------------------------|------------------------|
| PORTLAND_TRANSFER_LINE   | Portland Transfer Line    | TRANSFERDOCUMENTDETAIL |

**DataCaptureFields Table entries**
Notice the Item field, the name Item_id is required by the API.

| DataCapture            | Name        | Description | Index | Required | Type       | Default Value | Visible |
|------------------------|-------------|-------------|-------|----------|------------|---------------|---------|
| PORTLAND_TRANSFER_LINE | LineNumber  | LineNumber  | 0     | True     | STRING     | NULL          | True    |
| PORTLAND_TRANSFER_LINE | **Item_id**     | Item        | 1     | True     | MASTERITEM | NULL          | True    |
| PORTLAND_TRANSFER_LINE | Qty         | Qty         | 2     | True     | NUMBER     | NULL          | True    |

