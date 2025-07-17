# Integration Jobs

!!! note
    The Sage X3 integration jobs only work with version 6 of the scheduler onwards.

Integration jobs are a special type of [Scheduler](../../scheduler/manual.md) job called [injected jobs](../../scheduler/manual.md#injected-jobs-integration-jobs). 
See below for information for specifics on how document and master data jobs work

## Supported document types
<div class="grid cards" markdown>

 -   ORDER 

	---

	Sage X3 type: Sales Order

- 	RECEIVING

	---
	
	Sage X3 type: Purchase Order


</div>

## How it works

### Document jobs
Stored procedures run to find recently updated documents in the Sage X3 database and insert a record into the Granite IntegrationDocumentQueue table whenever a change is applied to a document. 

GraniteScheduler runs injected jobs that monitor the IntegrationDocumentQueue table for records that need to be processed.

When a record with Status 'ENTERED' is found, the job uses views on the Granite database to fetch the 
information related to that document from the ERP database and apply the changes to the Granite document. 

All valid changes to data in the Granite tables are logged to the Audit table, showing the previous value and the new value.

If a change is made in the ERP system that would put Granite into an invalid state, no changes are applied. Instead, the ERPSyncFailed field is set to true and the ERPSyncFailedReason field shows the reason for the failure. The IntegrationLog table will contain further details on the failure if applicable.

### Master data jobs
MasterItems and TradingPartners have their own jobs. These jobs compare the results of their respective views to the data in the Granite tables and insert new records / update records as needed.

The document jobs themselves also sync changes to the TradingPartners & MasterItems that are on the document. This means that on sites that do not process a lot of changes to master data you can limit the MasterItem/TradingPartner jobs to running once a day or even less frequently. The only thing they are really still needed for is setting isActive to false when something is deactivated in the ERP system.

## Install

### Set up views and data

Run the `SageX3Integration_Create.sql` script to create all the views and ScheduledJob table entries needed. 

!!!note
    You may have to update the .dbo. on the references to Sage X3 tables as this will change depending on the data you are accessing. It could be SageDatabase.TEST.TableName for example. Be sure to confirm with the Sage consultants which data set you are accessing. 

### Add the Injected job files to GraniteScheduler
To add the injected job files to the GraniteScheduler, simply copy the dlls and xml files into the root folder of GraniteScheduler. 

## Configure

### Schedule configuration
See the GraniteScheduler manual for the details on how to [configure injected jobs](../../scheduler/manual.md#injected-jobs-integration-jobs). Most of the work will have already been done for you by the `SageX3Integration_Create.sql` script, you can simply activate the jobs you want to run. 

### View customisation
Each view can be customised to include custom logic or map extra fields to fields on the corresponding Granite table. 

All of the standard fields on Granite tables are supported, simply add the required field to your view with an alias matching the Granite field name on the table the view maps to.

Non standard fields are also supported, but for these to work your column name on the destination table must start with 'Custom'. On the view, simply alias the name of the field to match the name of the field on the destination Granite table, including the 'Custom' prefix.

For fields like Document.Status where you may have custom rules / statuses, use a CASE statement in your view definition so that the view returns the Status that you want to set on the Granite Document table.

It is highly advised that you check the validity of yor job on the GraniteScheduler /config page after making a change to your view! Especially after changing filter criteria/joins, your view may be returning duplicate rows - the job validation will bring this to your attention.
