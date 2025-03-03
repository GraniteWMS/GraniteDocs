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
</div>



## How it works
The downwards integration, as with the upwards, is done though the CIN7 API. 

To be able to connect to the API you will need to create an API key in CIN7. To do so go to Integration>CoreAPI>AddNew as you can see in the image below. 

![API Key](./cin7-img/create-api-key.png)

Once created, it will generate an Account ID and a Key (as below). These need to be added to system settings in Granite into api-auth-accountid and api-auth-applicationkey respectively. These system settings will be generated when the scheduler is run for the first time. Once you have added these you will need to restart the scheduler.

![API Key](./cin7-img/api-key.png)


### SystemSetting

- `BaseUrl` - CIN7 API base URL. This is set by default to https://inventory.dearsystems.com/ExternalApi/v2/
- `api-auth-accountid` - CIN7 API Account ID.
- `api-auth-applicationkey` - CIN7 API Application Key (encrypted).

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
</div>



### Master data jobs
MasterItems and TradingPartners have their own Jobs. These Jobs fetch all StockItems, Vendors, and Customers from  CIN7 and compares them to the MasterItems and TradingPartners in Granite. Any inserts / updates are done as required. 

The document jobs also sync changes to the MasterItems that are on the document. This means that on sites that do not make many changes to their MasterItems it is better to limit running this job to once a day or even less frequently. 

Document Jobs do not automatically sync trading partners as they are not required to create to the document in Granite and as such are only synced when the TradingPartner Job runs. 

**MasterItem Mapping:**

| CIN7 Property       | Granite Property    |
|--------------------|--------------------|
| SKU               | Code, FormattedCode |
| ShortDescription  | Description        |
| Category         | Category          |
| Length           | Length            |
| Width            | Width             |
| Height           | Height            |
| Weight           | UnitWeight        |
| UOM              | UOM               |
| ID               | ERPIdentification |
| Status (Active)  | isActive          |