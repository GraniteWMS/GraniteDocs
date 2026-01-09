# Integration Jobs

Integration jobs are a special type of [Scheduler](../../scheduler/manual.md) job called [injected jobs](../../scheduler/manual.md#injected-jobs-integration-jobs). These jobs pull data from Sage Intacct into Granite, including master data (items and trading partners) and documents (orders, purchase orders, transfers).

## Architecture

The integration jobs use the **Sage Intacct .NET SDK** to communicate with the Intacct XML API, combined with a **configurable F# mapping system** that allows for easy customization without recompiling the entire application.

- **Sage Intacct .NET SDK**: Official SDK for communicating with the Sage Intacct XML API
- **F# Mapping Scripts**: Each job has a corresponding F# script file (`.fsx`) in the `Configuration\Scripts` folder that defines what fields to fetch from Intacct, and how the XML response data maps to Granite entities
- **Concurrent Request Protection**: The Granite Scheduler ensures jobs do not run concurrently, preventing duplicate or conflicting sync operations
- **Easy Customization**: To customize field mappings, status translations, or add new fields, simply edit the F# script and restart the scheduler

## Supported document types
<div class="grid cards" markdown>

 -   ORDER 

	---

	Sage Intacct type: SODOCUMENT

- 	RECEIVING

	---
	
	Sage Intacct type: PODOCUMENT

-   INTRANSIT

    ---

    Sage Intacct type: INVDOCUMENT

-   RECEIPT

    ---

    Sage Intacct type: INVDOCUMENT

-   TRANSFER

    ---
    
    Sage Intacct type: ICTRANSFER

</div>

## Setup

### Add the Sage Intacct providers to the Granite Scheduler

Copy the dlls and xml files from `GraniteScheduler\Providers\Intacct` into the root folder of GraniteScheduler. 

Example:

![Injectedjobfiles](intacct-img\injectedjobfiles.png)

### Configure Scheduled Jobs

To create Scheduled Jobs run the following script:

```sql
INSERT INTO ScheduledJobs (isActive, JobName, JobDescription, [Type], InjectJob, Interval, IntervalFormat, AuditDate, AuditUser)
VALUES	(0, 'MasterItemSync', 'Syncs MasterItems from Intacct', 'INJECTED', 'Granite.Integration.SageIntacct.Job.MasterItemJob', '4', 'HOURS', GETDATE(), 'AUTOMATION'),
		(0, 'PurchaseOrderSync', 'Syncs Purchase Orders from Intacct', 'INJECTED', 'Granite.Integration.SageIntacct.Job.PurchaseOrderJob', '5', 'MINUTES', GETDATE(), 'AUTOMATION'),
		(0, 'SalesOrderSync', 'Syncs Sales Orders from Intacct', 'INJECTED', 'Granite.Integration.SageIntacct.Job.SalesOrderJob', '5', 'MINUTES', GETDATE(), 'AUTOMATION'),
		(0, 'TradingPartnerSync', 'Syncs Trading Partners from Intacct', 'INJECTED', 'Granite.Integration.SageIntacct.Job.TradingPartnerJob', '4', 'HOURS', GETDATE(), 'AUTOMATION'),
		(0, 'IntransitTransferSync', 'Syncs Intransit Transfers from Intacct', 'INJECTED', 'Granite.Integration.SageIntacct.Job.IntransitTransferJob', '5', 'MINUTES', GETDATE(), 'AUTOMATION'),
		(0, 'ReceiptTransferSync', 'Syncs Receipt Transfers from Intacct', 'INJECTED', 'Granite.Integration.SageIntacct.Job.ReceiptTransferJob', '5', 'MINUTES', GETDATE(), 'AUTOMATION'),
		(0, 'WarehouseTransferSync', 'Syncs Warehouse Transfers from Intacct', 'INJECTED', 'Granite.Integration.SageIntacct.Job.WarehouseTransferJob', '4', 'HOURS', GETDATE(), 'AUTOMATION')
```

For all the details on configuring scheduled jobs, see the scheduler documentation on [configuring schedules](../../scheduler/manual.md#configuring-schedules).

After configuring the schedules, be sure to set `isActive` true for the jobs that you want to run.

### System Settings
The settings for Intacct Integration Jobs are all stored in the SystemSettings table. 
When jobs run, any missing settings will be inserted automatically.

To insert all of the settings upfront you can run this script:

```sql
INSERT INTO SystemSettings ([Application], [Key], [Value], [Description], isActive, isEncrypted, AuditDate, AuditUser, [Version])
VALUES  ('Integration.SageIntacct.Job', 'SenderId', '', 'Sage Intacct API Sender ID', 1, 0, GETDATE(), 'AUTOMATION', 0),
        ('Integration.SageIntacct.Job', 'SenderPassword', '', 'Sage Intacct API Sender Password', 1, 0, GETDATE(), 'AUTOMATION', 0),
        ('Integration.SageIntacct.Job', 'CompanyId', '', 'Sage Intacct API Company ID', 1, 0, GETDATE(), 'AUTOMATION', 0),
        ('Integration.SageIntacct.Job', 'EntityId', '', 'Sage Intacct API Entity ID', 1, 0, GETDATE(), 'AUTOMATION', 0),
        ('Integration.SageIntacct.Job', 'UserId', '', 'Sage Intacct API User ID', 1, 0, GETDATE(), 'AUTOMATION', 0),
        ('Integration.SageIntacct.Job', 'UserPassword', '', 'Sage Intacct API User Password', 1, 0, GETDATE(), 'AUTOMATION', 0),
        ('Integration.SageIntacct.Job', 'SageDateFormat', 'MM/dd/yyyy HH:mm:ss', 'Sage Intacct Date Format', 1, 0, GETDATE(), 'AUTOMATION', 0),
        ('Integration.SageIntacct.Job', 'ItemTypes', 'I,K,SK', 'Comma separated list of Item Types to sync from Intacct. Valid types are I, NI, NP, NS, K, SK', 1, 0, GETDATE(), 'AUTOMATION', 0),
        ('Integration.SageIntacct.Job', 'SalesOrderTypes', 'Sales Order,Sales Order-Inventory', 'Comma separated list of Sales Order Types to sync from Intacct.', 1, 0, GETDATE(), 'AUTOMATION', 0),
        ('Integration.SageIntacct.Job', 'PurchaseOrderTypes', 'Purchase Order,Purchase Order-Inventory', 'Comma separated list of Purchase Order Types to sync from Intacct.', 1, 0, GETDATE(), 'AUTOMATION', 0),
        ('Integration.SageIntacct.Job', 'IntransitTransferTypes', 'Inventory Transfer Out', 'Comma separated list of Intransit Transfer Types to sync from Intacct.', 1, 0, GETDATE(), 'AUTOMATION', 0),
        ('Integration.SageIntacct.Job', 'ReceiptTransferTypes', 'Inventory Transfer In', 'Comma separated list of Receipt Transfer Types to sync from Intacct.', 1, 0, GETDATE(), 'AUTOMATION', 0);
```

#### SenderId
Datatype: string
Intacct Web Services Sender ID

#### SenderPassword
Datatype: string
Intacct Web Services Password

#### CompanyId
Datatype: string
Intacct Company name

#### EntityId
Datatype: int
Intacct Entity ID

#### UserId
Datatype: string
Intacct user name

#### UserPassword
Datatype: string
Intacct user password

#### SageDateFormat
Datatype: string
Date format used by Intacct

#### ItemTypes
Datatype: comma separated list

This setting determines which types of Items in Intacct are valid MasterItems in Granite. 
Each type of Item that you want to have as MasterItems in Granite must be in this list.
Item types not specified here will not appear on documents fetched from Intacct.

Valid values:

- I - Inventory
- NI - Non-Inventory
- NP - Non-Inventory (Purchase only)
- NS - Non-Inventory (Sales only)
- K - Kit
- SK - Stockable Kit

To add multiple types, list them separated by commas e.g. `I,K,SK`

#### Sales Order Types
Datatype: comma separated list
This setting determines the types of SalesOrder documents that can be synced from Intacct.

To specify multiple types, list them separated by commas e.g. `Sales Order,Sales Order-Inventory`

#### Purchase Order Types
Datatype: comma separated list
This setting determines the types of PurchaseOrder documents that can be synced from Intacct.

To specify multiple types, list them separated by commas e.g. `Purchase Order,Purchase Order-Inventory`

#### Intransit Transfer Types
Datatype: comma separated list
This setting determines the types of Inventory Transfer documents that can be synced from Intacct.

To specify multiple types, list them separated by commas e.g. `Inventory Transfer Out,CPT Transfer Out`

#### Receipt Transfer Types
Datatype: comma separated list
This setting determines the types of Inventory Transfer documents that can be synced from Intacct.

To specify multiple types, list them separated by commas e.g. `Inventory Transfer In,CPT Transfer In`


## Customizing Mappings

The F# configuration scripts can be customized to adapt to client-specific requirements. After making changes, simply restart the Granite Scheduler to recompile the scripts.

**Example 1: Customizing Status Mapping**

In `SalesOrderJobConfiguration.fsx`, you can customize how Intacct states map to Granite statuses:

```fsharp
let status = 
    match intacctHeader.STATE with
    | "Submitted" -> "ENTERED"
    | "Approved" -> "RELEASED"
    | "Partially Approved" -> "ENTERED"
    | "Declined" -> "CANCELLED"
    | "Closed" -> "CANCELLED"
    | "Converted" -> "COMPLETE"
    // Add custom status here:
    | "Custom Status" -> "ONHOLD"
    | _ -> "ENTERED"
```

**Example 2: Adding New Fields**

To map additional Intacct fields to Granite:

1. Add the field to the XML type definition:
```fsharp
[<XmlRoot("SODOCUMENT")>]
type IntacctSalesOrderHeader() =
    // ... existing fields ...
    [<XmlElement("CUSTOMFIELD1")>]
    member val CUSTOMFIELD1 = "" with get, set
```

2. Add the field name to the query fields list:
```fsharp
member this.DocumentHeaderQueryFields =
    seq {
        "RECORDNO"
        "DOCNO"
        // ... existing fields ...
        "CUSTOMFIELD1"  // Add here
    }
```

3. Map the field in the toDocument function:
```fsharp
let document = Document(
    // ... existing mappings ...
    Comment = intacctHeader.CUSTOMFIELD1  // Map to appropriate Granite field
)
```

**Example 3: Conditional Logic**

Apply business rules during mapping:

```fsharp
let toDocument (intacctHeader: IntacctSalesOrderHeader) =
    // Set priority based on customer type
    let priority = 
        if intacctHeader.CUSTOMER_CUSTOMERID.StartsWith("VIP") then 1
        else 0
    
    let document = Document(
        // ... other fields ...
        Priority = priority
    )
    Ok document
```

!!! tip "Testing Your Changes"
    After modifying F# scripts:
    
    1. Delete `Configuration\Granite.Integration.SageIntacct.Job.DynamicConfiguration.dll` to force recompilation
    2. Restart the Granite Scheduler
    3. Check the scheduler `/config` page to ensure that there are no errors.
