# Integration Jobs

Integration jobs are a special type of [Scheduler](../../scheduler/manual.md) job called [injected jobs](../../scheduler/manual.md#injected-jobs-integration-jobs). 

## Supported document types
<div class="grid cards" markdown>

 -   ORDER 

	---

	Sage Intacct type: Sales Order

- 	RECEIVING

	---
	
	Sage Intacct type: Purchase Order

-   INTRANSIT

    ---

    Sage Intacct type: Inventory Transfer Out

-   RECEIPT

    ---

    Sage Intacct type: Inventory Transfer In

-   TRANSFER

    ---
    
    Sage Intacct type: Warehouse Transfer

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
INSERT INTO SystemSettings (Application, Key, Value, Description, isActive, isEncrypted, AuditDate, AuditUser, Version)
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