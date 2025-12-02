# Integration Jobs

!!! note
    This documentation is a work in progress and is intended to show the development progress of the integration with CIN7. As such, it may be subject to change as progress is made. 

Integration jobs are a special type of [Scheduler](../../scheduler/manual.md) job called [injected jobs](../../scheduler/manual.md#injected-jobs-integration-jobs). 
See below for information for specifics on how document and master data jobs work.

## Supported document types 
<div class="grid cards" markdown>

 -   ORDER

    ---

    CIN7 type: Sale

 -   RECEIVING

    ---

    CIN7 type: Purchase
 
 -  TRANSFER

    ---

    CIN7 type: Stock Transfer

</div>



## How it works
The downwards integration, as with the upwards, is done though the CIN7 API. 

To be able to connect to the API you will need to create an API key in CIN7. To do so go to Integration>CoreAPI>AddNew as you can see in the image below. 

![API Key](./cin7-img/create-api-key.png)

Once created, it will generate an Account ID and a Key (as below). These need to be added to system settings in Granite into api-auth-accountid and api-auth-applicationkey respectively. These system settings will be generated when the scheduler is run for the first time. Once you have added these you will need to restart the scheduler.

![API Key](./cin7-img/api-key.png)

### Configure Scheduled Jobs

To create Scheduled Jobs run the following script:

```sql
INSERT INTO [GraniteDatabase].dbo.ScheduledJobs (isActive, JobName, JobDescription, [Type], InjectJob, Interval, IntervalFormat, AuditDate, AuditUser)
SELECT 0, 'CIN7 MasterItem Job', 'Syncs MasterItems from CIN7', 'INJECTED', 'Granite.Integration.CIN7.Job.MasterItem', '24', 'HOURS', GETDATE(), 'AUTOMATION'
WHERE NOT EXISTS (SELECT 1 FROM [GraniteDatabase].dbo.ScheduledJobs WHERE JobName = 'CIN7 MasterItem Job');

INSERT INTO [GraniteDatabase].dbo.ScheduledJobs (isActive, JobName, JobDescription, [Type], InjectJob, Interval, IntervalFormat, AuditDate, AuditUser)
SELECT 0, 'CIN7 Purchase Order ', 'Syncs PurchaseOrders from CIN7', 'INJECTED', 'Granite.Integration.CIN7.Job.PurchaseOrder', '5', 'MINUTES', GETDATE(), 'AUTOMATION'
WHERE NOT EXISTS (SELECT 1 FROM [GraniteDatabase].dbo.ScheduledJobs WHERE JobName = 'CIN7 Purchase Order ');

INSERT INTO [GraniteDatabase].dbo.ScheduledJobs (isActive, JobName, JobDescription, [Type], InjectJob, Interval, IntervalFormat, AuditDate, AuditUser)
SELECT 0, 'CIN7 Sales Order', 'Syncs SalesOrders from CIN7', 'INJECTED', 'Granite.Integration.CIN7.Job.SalesOrder', '5', 'MINUTES', GETDATE(), 'AUTOMATION'
WHERE NOT EXISTS (SELECT 1 FROM [GraniteDatabase].dbo.ScheduledJobs WHERE JobName = 'CIN7 Sales Order');

INSERT INTO [GraniteDatabase].dbo.ScheduledJobs (isActive, JobName, JobDescription, [Type], InjectJob, Interval, IntervalFormat, AuditDate, AuditUser)
SELECT 0, 'CIN7 Transfer Job', 'Syncs Transfers from CIN7', 'INJECTED', 'Granite.Integration.CIN7.Job.Transfer', '5', 'MINUTES', GETDATE(), 'AUTOMATION'
WHERE NOT EXISTS (SELECT 1 FROM [GraniteDatabase].dbo.ScheduledJobs WHERE JobName = 'CIN7 Transfer Job');

INSERT INTO [GraniteDatabase].dbo.ScheduledJobs (isActive, JobName, JobDescription, [Type], InjectJob, Interval, IntervalFormat, AuditDate, AuditUser)
SELECT 0, 'CIN7 Trading Partner Job', 'Syncs TradingPartners from CIN7', 'INJECTED', 'Granite.Integration.CIN7.Job.TradingPartner', '4', 'HOURS', GETDATE(), 'AUTOMATION'
WHERE NOT EXISTS (SELECT 1 FROM [GraniteDatabase].dbo.ScheduledJobs WHERE JobName = 'CIN7 Trading Partner Job');

INSERT INTO [GraniteDatabase].dbo.ScheduledJobs (isActive, JobName, JobDescription, [Type], InjectJob, Interval, IntervalFormat, AuditDate, AuditUser)
SELECT 0, 'CIN7 Product Availability Job', 'Syncs Product Availability from CIN7', 'INJECTED', 'Granite.Integration.CIN7.Job.ProductAvailability', '12', 'HOURS', GETDATE(), 'AUTOMATION'
WHERE NOT EXISTS (SELECT 1 FROM [GraniteDatabase].dbo.ScheduledJobs WHERE JobName = 'CIN7 Product Availability Job');

```

For the Product Availability Job you need this table.

```sql
CREATE TABLE [dbo].[Integration_ProductAvailability](
	[ProductAvailabilityID] [bigint] IDENTITY(1,1) NOT NULL,
	[ID] [uniqueidentifier] NOT NULL,
	[SKU] [nvarchar](100) NOT NULL,
	[Name] [nvarchar](500) NOT NULL,
	[Barcode] [nvarchar](50) NULL,
	[Location] [nvarchar](100) NOT NULL,
	[Bin] [nvarchar](50) NULL,
	[Batch] [nvarchar](50) NULL,
	[ExpiryDate] [datetime2](7) NULL,
	[OnHand] [decimal](18, 4) NOT NULL,
	[Allocated] [decimal](18, 4) NOT NULL,
	[Available] [decimal](18, 4) NOT NULL,
	[OnOrder] [decimal](18, 4) NOT NULL,
	[StockOnHand] [decimal](18, 4) NOT NULL,
	[InTransit] [decimal](18, 4) NOT NULL,
	[NextDeliveryDate] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[ProductAvailabilityID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
```

This view will populate the StockVariance screen using the ProductAvailability data.

```sql
CREATE VIEW [dbo].[ERP_StockOnHand]
AS
SELECT     Location AS LOCATION, Name AS ITEMNO, OnHand AS QTYONHAND, OnOrder AS QTYONORDER, 0 AS QTYSALORDR, 0 AS AVRCOST
FROM Integration_ProductAvailability
GO
```


### SystemSetting

- `BaseUrl` - CIN7 API base URL. This is set by default to https://inventory.dearsystems.com/ExternalApi/v2/
- `api-auth-accountid` - CIN7 API Account ID.
- `api-auth-applicationkey` - CIN7 API Application Key (encrypted).
- `Locations` - CIN7 Locations to sync (comma delimited list).
- `SyncSuppliers` - Enable/disable syncing suppliers from CIN7 (default: true).
- `SyncCustomers` - Enable/disable syncing customers from CIN7 (default: true).
- `SalesRepresentatives` - CIN7 Sales Representatives to filter sales by (comma delimited list).

![SystemSettings](./cin7-img/system-settings.png)

### Document Jobs

GraniteScheduler runs injected jobs that check the IntegrationDocumentQueue for the lastUpdated time for the relevant document type(if no lastUpdated time is found it will use current time - 24hours). With this last updated time, it will then do a API request for all relevant documents that have a last updated time greater than the lastUpdated time from the IntegrationDocumentQueue. If there are any documents that fit those criteria they are inserted into the IntegrationDocumentQueue. The job then runs this queue.

When a record with Status 'ENTERED' is found, the job uses a OData request to fetch the information related to that document from the CIN7 and apply the changes to the Granite document.

All valid changes to data in the Granite tables are logged to the Audit table, showing the previous value and the new value.

If a change is made in the ERP system that would put Granite into an invalid state, no changes are applied. Instead, the ERPSyncFailed field is set to true and the ERPSyncFailedReason field shows the reason for the failure. The IntegrationLog table will contain further details on the failure if applicable.


#### Document Status

<div class="grid cards" markdown>

 -   <h3>Sale</h3> 

    | CIN7 Status        | Granite Status |
    |--------------------|---------------|
    | Draft, Ordering   | ONHOLD        |
    | Voided            | CANCELLED     |
    | Completed        | COMPLETE      |
    | Others           | ENTERED       |

 -  <h3>Purchase</h3> 

    | CIN7 Status     | Granite Status |
    |---------------|---------------|
    | Draft, Ordering | ONHOLD        |
    | Voided          | CANCELLED     |
    | Completed       | COMPLETE      |
    | Others         | ENTERED       |

 -  <h3>Stock Transfer</h3> 

    | CIN7 Status     | Granite Status |
    |---------------|---------------|
    | Completed       | COMPLETE      |
    | Voided          | CANCELLED     |
    | Others         | ENTERED       |
</div>



### Master data jobs
MasterItems and TradingPartners have their own Jobs. These Jobs fetch all StockItems, Vendors, and Customers from  CIN7 and compares them to the MasterItems and TradingPartners in Granite. Any inserts / updates are done as required. 

The document jobs also sync changes to the MasterItems that are on the document. This means that on sites that do not make many changes to their MasterItems it is better to limit running this job to once a day or even less frequently. 

Document Jobs do not automatically sync trading partners as they are not required to create to the document in Granite and as such are only synced when the TradingPartner Job runs. 

The mapping below is an example of the standard that is in place. It is configurable through the F# mapping scripts as with the documents.

**MasterItem Mapping:**

|| CIN7 Property       | Granite Property    |
||--------------------|--------------------|
|| SKU               | Code, FormattedCode |
|| Name              | Description        |
|| Category         | Category          |
|| Status           | isActive          |
|| UOM              | UOM               |
|| ID               | ERPIdentification |
|| Length           | Length            |
|| Width            | Width             |
|| Height           | Height            |
|| Weight           | UnitWeight        |
|| Barcode         | MasterItemAlias   |

**Trading Partner Mapping:**

|| CIN7 (Customer) Property     | Granite Property     |
||-----------------------------|---------------------|
|| Name                        | Code, Description    |
|| Status                      | isActive             |
|| ID                          | ERPIdentification     |
|| Contact.Name                | ContactPerson        |
|| Contact.Phone               | Tel                  |
|| Contact.Fax                 | Fax                  |
|| Contact.MobilePhone         | Mobile               |
|| Contact.Email               | Email                |
|| Address.Line1               | Address1             |
|| Address.Line2               | Address2             |
|| Address.City                | Address3             |
|| Address.State               | Address4             |
|| Address.Postcode           | Address5             |

*(Note: Suppliers are mapped similarly but with DocumentType set to "RECEIVING" instead of "ORDER")*
