# Integration Jobs

Integration jobs are a special type of [Scheduler](../../scheduler/manual.md) job called [injected jobs](../../scheduler/manual.md#injected-jobs-integration-jobs). 
See below for information for specifics on how document and master data jobs work

## Supported document types
<div class="grid cards" markdown>

 -   ORDER 

	---

	Evolution type: Sales Order

- 	RECEIVING

	---
	
	Evolution type: Purchase Order

- 	INTRANSIT 

	---

	Evolution type: Inter Branch Transfer OR Inter Branch Requisition

-   RECEIPT

    ---

    Evolution type: Inter Branch Receipt

-   TRANSFER

    ---

    Evolution type: Warehouse Transfer

-   WORKORDER

    ---

    Evolution type: Manufacture Process

</div>


## How it works

### Document Jobs
Triggers on the ERP document tables insert a record into the Granite IntegrationDocumentQueue table whenever a change is applied to a document. 

Scheduler runs injected jobs that monitor the IntegrationDocumentQueue table for records that need to be processed.

When a record with Status 'ENTERED' is found, the job uses views on the Granite database to fetch the 
information related to that document from the ERP database and apply the changes to the Granite document. 

All valid changes to data in the Granite tables are logged to the Audit table, showing the previous value and the new value.

If a change is made in the ERP system that would put Granite into an invalid state, no changes are applied. Instead, the ERPSyncFailed field is set to true and the ERPSyncFailedReason field shows the reason for the failure. The IntegrationLog table will contain futher details on the failure if applicable.

### Master data jobs
MasterItems and TradingPartners have their own jobs. These jobs compare the results of their respective views to the data in the Granite tables and insert new records / update records as needed.

The document jobs themselves also sync changes to the TradingPartners & MasterItems that are on the document. This means that on sites that do not process a lot of changes to master data you can limit the MasterItem/TradingPartner jobs to running once a day or even less frequently. 
The only thing they are really still needed for is setting isActive to false when something is deactivated in the ERP system.

## Install

!!! note 
    If you are upgrading from the old StoredProcedure/Trigger integration, ensure that ERPIdentification (Document, DocumentDetail, MasterItem, TradingPartner) column is populated with correct values before attempting to start the new jobs

### Set up database triggers, views, and data

!!! warning
    The all in one script is planned for release with V6. Until then use the existing individual scripts at `Dropbox\Granite Releases\Granite V5.0\GraniteDatabase\Evo\Scheduled Jobs`

Run the `PastelEVOIntegrationJobs_Create.sql` or `PastelEVOIntegrationJobs_Create_Evo7.sql` script to create all the views, triggers and ScheduledJob table entries needed. 

Use the Evo7 script only for version 7.x sites, for version 9 and up use the standard one.

### Add the Injected job files to GraniteScheduler
To add the injected job files to the GraniteScheduler, simply copy the dlls and xml files into the root folder of GraniteScheduler. 

Example:

![Injectedjobfiles](evo-img\injectedjobfiles.png)

## Configure
### Initial Import

!!! warning
    This is V6 functionality - not yet available.

When you first set up a new site, there will be documents that are partially processed already in Evolution. The following document types now support setting an initial ActionQty:

- PurchaseOrder
- SalesOrder

When ActionQty is a column returned by these types' Detail view, the ActionQty will be set to the same in Granite when the lines are inserted. This ensures that users cannot action more than the actual outstanding qty on the document.

!!! note
    ActionQty will ONLY be used on insert of document lines, never on update as this would cause problems once the document is actioned in Granite.

    The ActionQty column should be removed from the detail views after the initial import has completed syncing documents.

You can use the `InitialImport.sql` script to enter all of the Evolution documents not in a COMPLETE/CANCELLED statue into the IntegrationDocumentQueue table. The job will then pick these up and insert them once it is enabled.

!!! note
    Reminder, ActionQty column should be removed from the detail views after the initial import is finished running.


### Schedule configuration
See the GraniteScheduler manual for the basics on how to [configure injected jobs](../../scheduler/manual.md#injected-jobs-integration-jobs). Most of the work will have already been done for you by the `PastelEVOIntegrationJobs_Create.sql` script, you can simply activate the jobs you want to run. 

Sometimes when the documents in Evo are very large, the lines will not be finished inserting before we start fetching the records to create in Granite.
To circumvent this issue, we have a setting that allows you to configure an offset for the `LastUpdateDateTime` field in the `IntegrationDocumentQueue` table.

To configure this you simply add an entry into the `ScheduledJobInputs` table with the Name `LastUpdateTimeOffset` and the Value in minutes that you want to offset by

| JobName       | Name                  | Value |
|---------------|-----------------------|-------|
| SalesOrderJob | LastUpdateTimeOffset  | 5     |

Using this example, the SalesOrderJob will only pick up documents that have been sitting in the IntegrationDocumentQueue for longer than 5 minutes at the time the job runs.
This should give Evo the time it needs to insert all of the lines on a very large document. 

### Email on Error

!!! note
    Emailing functionality is now handled by the [Utility API](../../utility-api/index.md), set up has changed from previous versions.

Ensure that you have configured the UtilityApi for the Evo injected jobs in the `SystemSettings` table:

| Application | Key | Value |
|---|---|---|
|Granite.Integration.Evo.Job | UtilityApi | https://localhost:5001/ |

Ensure you have the `IntegrationError` email template in your database. This is the email template that is used for all error notifications in these injected jobs. 

Then for each job that needs to send failure notifications, add a job input for `MailOnError` and `MailOnErrorToAddresses`:

| JobName | Name | Value |
| --- | --- | --- |
| < JobName goes here > | MailOnError | true |
| < JobName goes here > | MailOnErrorToAddresses | name@client.co.za;name2@client.co.za |


### View customisation
Each view can be customised to include custom logic or map extra fields to fields on the corresponding Granite table. 

All of the standard fields on Granite tables are supported, simply add the required field to your view with an alias matching the Granite field name on the table the view maps to.

Non standard fields are also supported, but for these to work your column name on the destination table must start with 'Custom'. On the view, simply alias the name of the field to match the name of the field on the destination Granite table, including the 'Custom' prefix.

For fields like Document.Status where you may have custom rules / statuses, use a CASE statement in your view definition so that the view returns the Status that you want to set on the Granite Document table.

It is highly advised that you check the validity of yor job on the GraniteScheduler /config page after making a change to your view! Especially after changing filter criteria/joins, your view may be returning duplicate rows - the job validation will bring this to your attention.

## What's different about Evolution jobs

### Single line per MasterItem for INTRANSIT, RECEIPT, and TRANSFER
Because of the way that these documents are stored and managed on the Evolution database, we can only handle a single line per MasterItem on transfer documents. If a document of one of these types contains multiple lines for a MasterItem, the document insert/update will fail setting the ERPSyncFailedReason accordingly. 

### SalesOrders and PurchaseOrders line mapping
Because Evolution stores multiple copies of SalesOrders and PurchaseOrders when changes are made or the document changes status, there is special logic implemented to find the correct versions of lines on the Evolution database.
It is calculated using the idInvoiceLines (DocumentDetail ERPIdentification) and the iOrigLineID field. For that reason, the SalesOrderDetail and PurchaseOrderDetail views MUST include all rows from the _btblInvoiceLines table for any given document.
These views must not modify the values in ERPIdentification or iOrigLineID for any reason.

### Changing MasterItem codes
If Rename Item Code is used in Evolution to change an Item Code, we will update the MasterItem in Granite to match, thereby updating all of the TrackingEntities and Transactions to the new Code as well. 

We will not update the MasterItem in Granite if a new Item Code is created in Evolution and Global Item Change is used to change Evolution stock over to the new Item Code. In this case the new Item Code will be added to Granite, but all TrackingEntities will need to be reclassified to the new MasterItem.

## Things to look out for

### Importance of ERPIdentification
The injected jobs use the ERPIdentification column on the Document, DocumentDetail and MasterItem tables to look for matching records in the corresponding view. It is very important that you ensure that these values are populated for all records in Granite if you are upgrading from the old Document stored procedures.

### Validation
Each job type has it's own validation criteria that must be passed before the job will execute. You can check the validity of injected jobs on the GraniteScheduler /config page. 

Here is an example of some failed validation:

![Injectedjobsvalidation](evo-img\injectedjobsvalidation.png)

