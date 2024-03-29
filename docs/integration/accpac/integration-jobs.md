# Integration Jobs

Integration jobs are a special type of [Scheduler](../../scheduler/manual.md) job called [injected jobs](../../scheduler/manual.md#injected-jobs-integration-jobs). 
See below for information for specifics on how document and master data jobs work

## Supported document types
<div class="grid cards" markdown>

 -   ORDER 

	---

	Accpac type: Sales Order

- 	RECEIVING

	---
	
	Accpac type: Purchase Order

- 	INTRANSIT 

	---

	Accpac type: Transit Transfer

-   RECEIPT

    ---

    Accpac type: Transit Receipt

-   TRANSFER

    ---

    Accpac type: Transfer

-   WORKORDER

    ---

    Accpac type: Assemblies

</div>

## How it works

### Document jobs
Triggers on the ERP document tables insert a record into the Granite IntegrationDocumentQueue table whenever a change is applied to a document. 

GraniteScheduler runs injected jobs that monitor the IntegrationDocumentQueue table for records that need to be processed.

When a record with Status 'ENTERED' is found, the job uses views on the Granite database to fetch the 
information related to that document from the ERP database and apply the changes to the Granite document. 

All valid changes to data in the Granite tables are logged to the Audit table, showing the previous value and the new value.

If a change is made in the ERP system that would put Granite into an invalid state, no changes are applied. Instead, the ERPSyncFailed field is set to true and the ERPSyncFailedReason field shows the reason for the failure. The IntegrationLog table will contain futher details on the failure if applicable.

### Master data jobs
MasterItems and TradingPartners have their own jobs. These jobs compare the results of their respective views to the data in the Granite tables and insert new records / update records as needed.

The document jobs themselves also sync changes to the TradingPartners & MasterItems that are on the document. This means that on sites that do not process a lot of changes to master data you can limit the MasterItem/TradingPartner jobs to running once a day or even less frequently. The only thing they are really still needed for is setting isActive to false when something is deactivated in the ERP system.

## Install

!!! note 
    If you are upgrading from the old StoredProcedure/Trigger integration, ensure that ERPIdentification (Document, DocumentDetail, MasterItem, TradingPartner) column is populated with correct values before attempting to start the new jobs

### Set up database triggers & views

Run the create scripts for the views and triggers that you will need for the version of ERP & document types that the site uses.

All document types also require the Integration_ERP_MasterItem view.

### Add the Injected job files to GraniteScheduler
To add the injected job files to the GraniteScheduler, simply copy the dlls and xml files into the root folder of GraniteScheduler. 

Example:

![Injectedjobfiles](accpac-img\injectedjobfiles.png)

## Configure
### Schedule configuration
See the GraniteScheduler manual for how to configure scheduled jobs - ERP document integration jobs are of type INJECTED

### Email on Error

!!! note 
    Emailing functionality is now handled by the [Utility API](../../utility-api/index.md), set up has changed from previous versions.

Ensure that you have configured the UtilityApi for the Accpac injected jobs in the `SystemSettings` table:

| Application | Key | Value |
|---|---|---|
|Granite.Integration.Accpac.Job | UtilityApi | https://localhost:5001/ |

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

## What's different about Accpac jobs

### Inserting lines between existing lines in Accpac
If enough lines are added in between existing lines on an Accpac document, existing line numbers can change. This will break the document in Granite as we lose the reference to the specific line in Accpac. 
Luckily, this can be easily avoided by ensuring that the Accpac user modifying documents is trained to only ever add new lines at the bottom.

## Things to look out for

### Importance of ERPIdentification
The injected jobs use the ERPIdentification column on the Document, DocumentDetail and MasterItem tables to look for matching records in the corresponding view. It is very important that you ensure that these values are populated for all records in Granite if you are upgrading from the old Document stored procedures.

### Validation
Each job type has it's own validation criteria that must be passed before the job will execute. You can check the validity of injected jobs on the GraniteScheduler /config page. 

Here is an example of some failed validation:

![Injectedjobsvalidation](accpac-img\injectedjobsvalidation.png)

