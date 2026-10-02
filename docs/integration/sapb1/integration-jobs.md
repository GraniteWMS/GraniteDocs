# Integration Jobs

!!! note
    The SAP B1 integration jobs only work with version 6 of the scheduler onwards.

Integration jobs are a special type of [Scheduler](../../scheduler/manual.md) job called [injected jobs](../../scheduler/manual.md#injected-jobs-integration-jobs). 
See below for information for specifics on how document and master data jobs work

## Supported document types

| SAP B1 document | SAP B1 table | Queue DocumentType | Granite Type | Injected job | Queue stored procedure |
|---|---|---|---|---|---|
| Sales Order | ORDR | ORDER | ORDER | `Granite.Integration.SAPB1.Job.SalesOrder` | `Integration_Queue_SalesOrder` |
| Goods Issue | OIGE | ISSUE | ORDER | `Granite.Integration.SAPB1.Job.GoodsIssue` | `Integration_Queue_GoodsIssue` |
| Goods Return | ORPD | GOODSRETURN | ORDER | `Granite.Integration.SAPB1.Job.GoodsReturn` | `Integration_Queue_GoodsReturn` |
| Purchase Order | OPOR | RECEIVING | RECEIVING | `Granite.Integration.SAPB1.Job.PurchaseOrder` | `Integration_Queue_PurchaseOrder` |
| Goods Receipt PO | OPDN | GOODSRECEIPT | RECEIVING | `Granite.Integration.SAPB1.Job.GoodsReceipt` | `Integration_Queue_GoodsReceipt` |
| Return | ORRR | RETURN | RECEIVING | `Granite.Integration.SAPB1.Job.Return` | `Integration_Queue_Return` |
| Inventory Transfer Request | OWTQ | TRANSFER | TRANSFER | `Granite.Integration.SAPB1.Job.Transfer` | `Integration_Queue_Transfer` |

Master data is synced by the `Granite.Integration.SAPB1.Job.MasterItem` (OITM) and `Granite.Integration.SAPB1.Job.TradingPartner` (OCRD) jobs.

## How it works

### Document jobs
Each document job starts every run by executing its queue stored procedure (see the table above). The stored procedure finds recently updated documents in the SAP B1 database and inserts a record into the Granite IntegrationDocumentQueue table for each document that has changed.

!!! important
    The queue stored procedures are executed by the injected jobs themselves. Do **not** add them to the `ScheduledJobs` table as separate `STOREDPROCEDURE` jobs.

    The job validation on the GraniteScheduler /config page will fail if a job's queue stored procedure does not exist in the Granite database.

The job then processes the records in the IntegrationDocumentQueue table with Status 'ENTERED' for its document type. For each record, the job uses views on the Granite database to fetch the information related to that document from the ERP database and apply the changes to the Granite document. Successfully processed records are set to 'POSTED', failed records are set to 'FAILED'.

All valid changes to data in the Granite tables are logged to the Audit table, showing the previous value and the new value.

If a change is made in the ERP system that would put Granite into an invalid state, no changes are applied. Instead, the ERPSyncFailed field is set to true and the ERPSyncFailedReason field shows the reason for the failure. The IntegrationLog table will contain further details on the failure if applicable.

!!! warning
    Most of the queue stored procedures only look for documents updated in SAP B1 within the last 15 minutes. Keep the interval on the document jobs well below 15 minutes (the default is 5 minutes), otherwise changes to documents may be missed.

### Master data jobs
MasterItems and TradingPartners have their own jobs. These jobs compare the results of their respective views to the data in the Granite tables and insert new records / update records as needed.

The document jobs themselves also sync changes to the MasterItems that are on the document. This means that on sites that do not process a lot of changes to master data you can limit the MasterItem/TradingPartner jobs to running once a day or even less frequently. The only thing they are really still needed for is setting isActive to false when something is deactivated in the ERP system.

## Install

### Set up views and data

Run the `SAPB1IntegrationJobs_Create.sql` script to create all the views, queue stored procedures and ScheduledJob table entries needed. All of the jobs are created inactive.

The script must be run in SQLCMD mode (in SSMS: Query > SQLCMD Mode). Before running it, set the variables at the top of the script to match your environment:

```sql
:setvar GraniteDatabase "GraniteDatabase"
:setvar SAPB1Database "SAPB1Database"
```

!!! note
    Be sure to confirm with the SAP consultants which company database you are accessing.

### Add the Injected job files to GraniteScheduler
To add the injected job files to the GraniteScheduler, copy everything from the `GraniteScheduler/InjectedJobs/SAPB1` folder into the root folder of GraniteScheduler. 

## Configure

### Schedule configuration
See the GraniteScheduler manual for the details on how to [configure injected jobs](../../scheduler/manual.md#injected-jobs-integration-jobs). Most of the work will have already been done for you by the `SAPB1IntegrationJobs_Create.sql` script, you can simply activate the jobs you want to run. 

### Job inputs
The document jobs support the following inputs, configured in the `ScheduledJobInput` table:

| Name | Value | Description |
|---|---|---|
| LastUpdateTimeOffset | Minutes, e.g. `5` | The job will only pick up records that have been in the IntegrationDocumentQueue for longer than this number of minutes. Defaults to `0`. |
| MailOnError | `true` | When a document fails to sync, a once-off `EMAIL` scheduled job is created using the `Email_IntegrationError` stored procedure, containing the failure reasons for the document. |

For example:

| JobName | Name | Value |
|---|---|---|
| SAPB1 Sales Order Job | LastUpdateTimeOffset | 5 |
| SAPB1 Sales Order Job | MailOnError | true |

### Queue customisation
The queue stored procedures decide which SAP B1 documents are added to the IntegrationDocumentQueue. They can be modified to change the queueing behaviour for a site.

### View customisation
Each view can be customised to include custom logic or map extra fields to fields on the corresponding Granite table. 

All of the standard fields on Granite tables are supported, simply add the required field to your view with an alias matching the Granite field name on the table the view maps to.

Non standard fields are also supported, but for these to work your column name on the destination table must start with 'Custom'. On the view, simply alias the name of the field to match the name of the field on the destination Granite table, including the 'Custom' prefix.

For fields like Document.Status where you may have custom rules / statuses, use a CASE statement in your view definition so that the view returns the Status that you want to set on the Granite Document table.

It is highly advised that you check the validity of your job on the GraniteScheduler /config page after making a change to your view! Especially after changing filter criteria/joins, your view may be returning duplicate rows - the job validation will bring this to your attention.
