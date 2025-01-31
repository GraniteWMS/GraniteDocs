`Granite Version 6~`
### Introduction 

Data Capture also known as Quick Capture allows you to setup custom WebDesktop dialogs
to streamline the capture of data. 
It will plug into the WebDesktop the same way Functions does, but unlike Functions that needs to run
backend scripts, data capture executes the API call for the WebDesktop screen you have open.

The reason to use data capture is to stream line data entry and to allow the user to capture specific sets of data 
effortless. 


---
### Limited support
Version 6 introduces the DataCapture feature with limited functionality. While this release may not meet all requirements, we believe it can effectively support certain use cases.
We have an extensive roadmap planned, which includes adding DataCapture to the ProcessApp in future updates.
We encourage you to familiarize yourself with its current capabilities and use it where applicable.

---
### Supported Modules

!!! note
	Document based Modules is split in "header" and "detail". You cannot capture a new header and details in one. 


| Module Name            | Web Desktop Screen              | API Operation                | Notes                          |
|------------------------|---------------------------------|------------------------------|-- |
| MASTERITEM             | Setup -> MasterItem             | /MasterItems (POST)          | |
| MASTERITEMALIAS        | Setup -> MasterItem             | /MasterItemAlias (POST)      | |
| LOCATION               | Setup -> Location               | /Locations (POST)            | |
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

The data capture fields for each module is the same parameters name of the Business API operation.
Please review the above table to get the Business API operation.

!!! note
	Any field that is required by the Business API need to be setup (exception Document_id)
    These fields can be invisible and a default can be used. 

!!! note
	When using LOCATION or MASTERITEM (Types, see below) the field will map to the ID field of the API operation.
    Therefor it's important to check the API documentation on what the field should be called. 
    Example: Item_id or MasterItem_id would typically be the name for your Master Item field.


### Data Capture Fields Types
The following types is available. 
In `V6` we have limited support for types, fields like Status, Types and Trading Partner not yet supported. 

- **MASTERITEM**: Master Item dropdown of code and description. *See notes below*
- **LOCATION**: Location dropdown of Barcode and Name.  *See notes below*
- **STRING**: A primitive string.
- **NUMBER**: A primitive number or int.
- **BOOLEAN**: A primitive boolean.

*Notes*:
Any API operation that requires a primary key (Item_id, Location_id) must be configured with the name as it is specified by the API.
However the Description of the field can be changed. Furthermore the user will not be asked to capture the ID, an autocomplete dropdown will be supplied 
as describe by the types **MASTERITEM**, **LOCATION**

---
### Example *Portland transfer*

This example is designed to ask the user to capture the Transfer number and then automatically default all other required fields associated with the client's needs for PORTLAND transfers.

The second part of the example simplifies the line capture process by only asking for Code and Quantity. This approach allows the user to quickly add the required lines while minimizing the risk of errors.

This example showcases the following:
- How to default fields
- How to hide fields
- How to set up Item_id to display an autocomplete box
- How to skip prompting for the Line Number

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
Notice: line number is set invisible and the default value is "NEW", this will generate the line number for the next sequence.
Notice: the Item field, the field name Item_id is required by the API but the display name is Item and the UI will ask for the item by code and description.

| DataCapture            | Name        | Description | Index | Required | Type       | Default Value | Visible |
|------------------------|-------------|-------------|-------|----------|------------|---------------|---------|
| PORTLAND_TRANSFER_LINE | *LineNumber*  | LineNumber  | 100     | True     | STRING     | **NEW**          | False    |
| PORTLAND_TRANSFER_LINE | **Item_id**     | Item        | 1     | True     | MASTERITEM | NULL          | True    |
| PORTLAND_TRANSFER_LINE | Qty         | Qty         | 2     | True     | NUMBER     | NULL          | True    |

Sample Code

``` sql
INSERT INTO [dbo].[DataCapture] ([Name], [Description], [Module], [UserGroup]) 
VALUES ('PORTLAND_TRANSFER', 'Portland Transfer Request', 'TRANSFERDOCUMENT', 15);

INSERT INTO [dbo].[DataCapture] ([Name], [Description], [Module], [UserGroup]) 
VALUES ('PORTLAND_TRANSFER_LINE', 'Portland Transfer Line', 'TRANSFERDOCUMENTDETAIL', 15);

INSERT INTO [dbo].[DataCaptureFields] ([DataCapture], [Name], [Description], [Index], [Required], [Type], [DefaultValue], [Visible], [AuditUser], [AuditDate], [Version]) 
VALUES ('PORTLAND_TRANSFER', 'Site', 'Site', 90, 1, 'STRING', 'PORTLAND_TRANSFER', 0, NULL, NULL, NULL);

INSERT INTO [dbo].[DataCaptureFields] ([DataCapture], [Name], [Description], [Index], [Required], [Type], [DefaultValue], [Visible], [AuditUser], [AuditDate], [Version]) 
VALUES ('PORTLAND_TRANSFER', 'ERPLocation', 'ERPLocation', 91, 1, 'STRING', '2', 0, NULL, NULL, NULL);

INSERT INTO [dbo].[DataCaptureFields] ([DataCapture], [Name], [Description], [Index], [Required], [Type], [DefaultValue], [Visible], [AuditUser], [AuditDate], [Version]) 
VALUES ('PORTLAND_TRANSFER', 'Number', 'Number', 0, 1, 'STRING', '', 1, NULL, NULL, NULL);

INSERT INTO [dbo].[DataCaptureFields] ([DataCapture], [Name], [Description], [Index], [Required], [Type], [DefaultValue], [Visible], [AuditUser], [AuditDate], [Version]) 
VALUES ('PORTLAND_TRANSFER', 'Type', 'Type', 92, 1, 'STRING', 'TRANSFER', 0, NULL, NULL, NULL);

INSERT INTO [dbo].[DataCaptureFields] ([DataCapture], [Name], [Description], [Index], [Required], [Type], [DefaultValue], [Visible], [AuditUser], [AuditDate], [Version]) 
VALUES ('PORTLAND_TRANSFER', 'Status', 'Status', 93, 1, 'STRING', 'ENTERED', 0, NULL, NULL, NULL);

INSERT INTO [dbo].[DataCaptureFields] ([DataCapture], [Name], [Description], [Index], [Required], [Type], [DefaultValue], [Visible], [AuditUser], [AuditDate], [Version]) 
VALUES ('PORTLAND_TRANSFER', 'isActive', 'isActive', 94, 1, 'BOOLEAN', '1', 0, NULL, NULL, NULL);

INSERT INTO [dbo].[DataCaptureFields] ([DataCapture], [Name], [Description], [Index], [Required], [Type], [DefaultValue], [Visible], [AuditUser], [AuditDate], [Version]) 
VALUES ('PORTLAND_TRANSFER_LINE', 'Item_id', 'Item', 0, 1, 'MASTERITEM', NULL, 1, NULL, NULL, NULL);

INSERT INTO [dbo].[DataCaptureFields] ([DataCapture], [Name], [Description], [Index], [Required], [Type], [DefaultValue], [Visible], [AuditUser], [AuditDate], [Version]) 
VALUES ('PORTLAND_TRANSFER_LINE', 'Qty', 'Qty', 1, 1, 'NUMBER', NULL, 1, NULL, NULL, NULL);

INSERT INTO [dbo].[DataCaptureFields] ([DataCapture], [Name], [Description], [Index], [Required], [Type], [DefaultValue], [Visible], [AuditUser], [AuditDate], [Version]) 
VALUES ('PORTLAND_TRANSFER_LINE', 'LineNumber', 'LineNumber', 100, 1, 'STRING', 'NEW', 0, NULL, NULL, NULL);

```