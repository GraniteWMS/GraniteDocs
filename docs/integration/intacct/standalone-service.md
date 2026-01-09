# Standalone Integration Service

The Sage Intacct Standalone Integration Service is a modern ASP.NET Core 8 web service that handles upward integration from Granite to Sage Intacct. It replaces the older SDK Provider plugin and Windows Integration Service, providing a more reliable, scalable, and maintainable integration solution.

!!! note
    This service only handles **upward integration** (posting transactions from Granite to Intacct). The [integration jobs](integration-jobs.md) are still used for **downward integration** (syncing documents and master data from Intacct into Granite).

## Architecture Overview

The standalone service is built on:

- **ASP.NET Core 8** - Modern cross-platform web framework
- **ServiceStack** - REST API framework for handling integration requests
- **WorkflowCore** - Workflow engine for orchestrating multi-step integration processes
- **SQL Server** - Database for workflow persistence and Granite data access
- **Sage Intacct .NET SDK** - Official SDK for communicating with the Sage Intacct XML API

### Key Components

- **Integration Service** - Main REST API endpoint that receives integration requests from Granite
- **Workflow Engine** - WorkflowCore manages the lifecycle of each integration transaction
- **Repository Layer** - Data access for Granite transactions, settings, and logs
- **Sage Intacct Client** - Handles communication with the Sage Intacct XML API using the official .NET SDK
- **Configuration Service** - `/config` endpoint for validation and troubleshooting

## Setup

### Prerequisites

Before installing the service, ensure the following are in place:

1. **IIS** - Installed and configured with ASP.NET Core 8 Hosting Bundle
    - See [IIS Getting Started Guide](../../iis/getting-started.md) for installation instructions
2. **Granite Database** - Service uses the existing Granite database
    - Workflow tables are created automatically on first run
3. **Sage Intacct Credentials** :
    - SenderId 
    - SenderPassword
    - CompanyId
    - EntityId 
    - UserId
    - UserPassword

    The UserId that you use must be a Web Services user with the appropriate permissions.

### Installation

1. **Configure Connection String**

    Edit `appsettings.json` in the published folder to point to your Granite database:
    ```json
    {
      "ConnectionStrings": {
        "CONNECTION": "Server=YOUR_SERVER;Database=YOUR_GRANITE_DB;User ID=Granite;Password=YOUR_PASSWORD;TrustServerCertificate=true;"
      }
    }
    ```

2. **Create IIS Site**

    Add the service as a new site in IIS following the [Adding a site to IIS](../../iis/getting-started.md#adding-a-site-to-iis) guide.

3. **Verify Installation**

    Browse to the `/config` to verify the service is running.
    
    The config page shows:
    - **Connection String** - Censored connection string to Granite database
    - **Intacct Connection State** - Tests connection to Sage Intacct API
    - **System Settings** - Lists all configured settings (passwords hidden)

    If everything is configured correctly, you should see "Connected" for the Intacct Connection State.

4. **Update ProcessApp appsettings**

    Point the ProcessApp's IntegrationService setting to the endpoint that you have configured.


## Settings

Settings are stored in the Granite database `SystemSettings` table. The service will automatically create missing settings with default values on first access.

### Sage Intacct API Credentials

The service requires two sets of credentials to authenticate with Sage Intacct:

**Web Services Credentials**

| Key | Description | Required |
|-----|-------------|----------|
| SenderId | Sage Intacct Sender ID | Yes |
| SenderPassword | Sage Intacct Password | Yes |

**Company Credentials**

| Key | Description | Required |
|-----|-------------|----------|
| CompanyId | Sage Intacct Company ID | Yes |
| EntityId | Sage Intacct Entity ID | Yes |
| UserId | Sage Intacct User ID | Yes |
| UserPassword | Sage Intacct User Password | Yes |

### Transaction Definitions

!!! note
    Transaction definitions are configured inside Sage Intacct.
    They must be configured by the Intacct implementation partner before we can start posting transactions from Granite

| Key | Default Value | Description |
|-----|---------------|-------------|
| TransactionDefinitionMove | Warehouse Transfer | Transaction definition for MOVE operations |
| TransactionDefinitionScrap | Inventory Scrap | Transaction definition for SCRAP operations |
| TransactionDefinitionTakeOn | Inventory Receipt | Transaction definition for TAKEON operations |
| TransactionDefinitionAdjustmentIncrease | Adjustment Increase | Transaction definition for ADJUSTMENT increases |
| TransactionDefinitionAdjustmentDecrease | Adjustment Decrease | Transaction definition for ADJUSTMENT decreases |
| TransactionDefinitionPick | Sales Invoice-Inventory | Transaction definition for PICK operations |
| TransactionDefinitionPickOrigin | Sales Order-Inventory | Origin transaction definition for PICK operations |
| TransactionDefinitionReceive | Purchase Invoice-Inventory | Transaction definition for RECEIVE operations |
| TransactionDefinitionReceiveOrigin | PO Receiver-Inventory | Origin transaction definition for RECEIVE operations |

### Advanced Settings

#### WaitForIntacctSeconds

**Default**: `10`  
**Type**: Integer

Defines the maximum time (in seconds) that the integration service will wait for a workflow (i.e. an integration post) to complete before timing out. 
When a timeout occurs, the request continues in the background and the user is notified to check back later to see if the request completed successfully.

This setting is necessary because posting to the Intacct Api is slower than legacy on prem ERPs. 
Sometimes posting a large invoice can take upwards of 30s to complete, which would mean that the user cannot do anything else on the scanner until posting is finalized.

#### MapBatchToLineMemo

**Default**: `false`  
**Type**: Boolean

When enabled, this setting copies the batch/lot number from Granite's TrackingEntity to the line memo field on Sage Intacct sales order lines during PICK operations.

- `true` - Batch numbers are written to the invoice line memo
- `false` - Batch numbers are not written to the memo field

This is useful for customers who need batch/lot traceability visible in Intacct invoice line details but don't want to actually carry lot numbers in Intacct.

#### SalesOrderItemTypesThatCopyLines

**Default**: (empty)  
**Type**: Comma-separated string

Specifies which Sage Intacct item types should be automatically copied from the original sales order to the invoice during PICK operations. This is used for non-inventory items that need to carry over from the order to the invoice.

**Example**:
```
Service,Charge
```

**How it works**:

1. Service retrieves all lines from the original sales order in Intacct
2. For each line, checks if the item's type matches any in this setting
3. If matched, the entire line (quantity, price, description) is copied to the new invoice
4. This happens in addition to the inventory lines being picked from Granite

Leave empty if you only want inventory items from Granite to appear on invoices.

### SQL Setup Script

To insert all settings at once:

```sql
INSERT INTO [dbo].[SystemSettings] 
    ([Application], [Key], [Value], [Description], [ValueDataType], [isActive], [isEncrypted], [EncryptionKey], [AuditDate], [AuditUser], [Version]) 
VALUES  
    (N'IntegrationSageIntacct', N'SenderId', N'', N'Sage Intacct SenderId', N'string', 1, 0, NULL, GETDATE(), N'AUTOMATION', NULL),
    (N'IntegrationSageIntacct', N'SenderPassword', N'', N'Sage Intacct SenderPassword', N'string', 1, 0, NULL, GETDATE(), N'AUTOMATION', NULL),
    (N'IntegrationSageIntacct', N'CompanyId', N'', N'Sage Intacct CompanyId', N'string', 1, 0, NULL, GETDATE(), N'AUTOMATION', NULL),
    (N'IntegrationSageIntacct', N'EntityId', N'', N'Sage Intacct EntityId', N'string', 1, 0, NULL, GETDATE(), N'AUTOMATION', NULL),
    (N'IntegrationSageIntacct', N'UserId', N'', N'Sage Intacct UserId', N'string', 1, 0, NULL, GETDATE(), N'AUTOMATION', NULL),
    (N'IntegrationSageIntacct', N'UserPassword', N'', N'Sage Intacct UserPassword', N'string', 1, 0, NULL, GETDATE(), N'AUTOMATION', NULL),
    (N'IntegrationSageIntacct', N'TransactionDefinitionMove', N'Warehouse Transfer', N'Sage Intacct Transaction Definition Move', N'string', 1, 0, NULL, GETDATE(), N'AUTOMATION', NULL),
    (N'IntegrationSageIntacct', N'TransactionDefinitionScrap', N'Inventory Scrap', N'Sage Intacct Transaction Definition Scrap', N'string', 1, 0, NULL, GETDATE(), N'AUTOMATION', NULL),
    (N'IntegrationSageIntacct', N'TransactionDefinitionTakeOn', N'Inventory Receipt', N'Sage Intacct Transaction Definition TakeOn', N'string', 1, 0, NULL, GETDATE(), N'AUTOMATION', NULL),
    (N'IntegrationSageIntacct', N'TransactionDefinitionAdjustmentIncrease', N'Adjustment Increase', N'Sage Intacct Transaction Definition Adjustment Increase', N'string', 1, 0, NULL, GETDATE(), N'AUTOMATION', NULL),
    (N'IntegrationSageIntacct', N'TransactionDefinitionAdjustmentDecrease', N'Adjustment Decrease', N'Sage Intacct Transaction Definition Adjustment Decrease', N'string', 1, 0, NULL, GETDATE(), N'AUTOMATION', NULL),
    (N'IntegrationSageIntacct', N'TransactionDefinitionPick', N'Sales Invoice-Inventory', N'Sage Intacct Transaction Definition Pick', N'string', 1, 0, NULL, GETDATE(), N'AUTOMATION', NULL),
    (N'IntegrationSageIntacct', N'TransactionDefinitionPickOrigin', N'Sales Order-Inventory', N'Sage Intacct Transaction Definition PickOrigin', N'string', 1, 0, NULL, GETDATE(), N'AUTOMATION', NULL),
    (N'IntegrationSageIntacct', N'TransactionDefinitionReceive', N'Purchase Invoice-Inventory', N'Sage Intacct Transaction Definition Receive', N'string', 1, 0, NULL, GETDATE(), N'AUTOMATION', NULL),
    (N'IntegrationSageIntacct', N'TransactionDefinitionReceiveOrigin', N'PO Receiver-Inventory', N'Sage Intacct Transaction Definition ReceiveOrigin', N'string', 1, 0, NULL, GETDATE(), N'AUTOMATION', NULL),
    (N'IntegrationSageIntacct', N'WaitForIntacctSeconds', N'10', N'Number of seconds to wait for Intacct when processing an integration request', N'int', 1, 0, NULL, GETDATE(), N'AUTOMATION', NULL),
    (N'IntegrationSageIntacct', N'MapBatchToLineMemo', N'false', N'Update Sales Order line memo with the batch from the TrackingEntity', N'bool', 1, 0, NULL, GETDATE(), N'AUTOMATION', NULL),
    (N'IntegrationSageIntacct', N'SalesOrderItemTypesThatCopyLines', N'', N'Comma separated list of Item Types that should be copied from SalesOrders to Invoices', N'string', 1, 0, NULL, GETDATE(), N'AUTOMATION', NULL);
```

!!! note
    After updating settings in the SystemSettings table, you must restart the IIS site for changes to take effect.

## Integration Methods

The service supports the same integration methods as the old SDK Provider, with enhanced flexibility and extensibility.

### Understanding Integration Methods and Workflows

An **integration method** (e.g., TAKEON, PICK, RECEIVE) is essentially a **workflow** - a series of steps that execute in sequence to complete an integration operation. Each workflow is built using WorkflowCore and consists of one or more steps:

**Workflow Steps**

A typical integration workflow includes:

1. **API Call Step** - Communicates with Sage Intacct API to create or update transactions
2. **Update Transactions Step** - Marks Granite transactions as integrated and stores the Intacct reference
3. **Error Handling** - Captures and logs any failures for troubleshooting

For example, the PICK workflow:
- **CreateInvoiceStep** - Creates the sales invoice in Intacct
- **UpdateTransactionsStep** - Updates Granite transactions with the invoice number

The workflow-based architecture allows for **custom integration methods** to be added for specific client requirements:

- **New workflows** can be created by combining existing steps or writing new steps
- **Custom logic** can be added for specific scenarios without affecting standard methods
- **Process-specific methods** can be configured via the `IntegrationMethod` field in the Process settings

!!! example "Custom Method Example"
    If a client needs a special "TRANSFER" operation that performs additional validation or custom field mapping, a new workflow can be created (e.g., `CustomTransferWorkflow`) with the required steps. The Process in Granite is then linked to this new `CustomTransferWorkflow` workflow in place of the default TRANSFER integration method.

    This design provides both **standard methods** that work out of the box and the **flexibility** to adapt to unique business requirements.

### Standard Integration Methods

The following methods are available by default:

### TAKEON

Creates an Inventory Transaction for initial stock receipt.

- **Granite Transaction Type**: TAKEON
- **Intacct Transaction**: Inventory Transaction (configured via TransactionDefinitionTakeOn)
- **Supports**: Lot tracking, Serial numbers, Expiry dates

| Granite Field | Intacct Field | Required | Behavior |
|---------------|---------------|----------|----------|
| TransactionDefinitionTakeOn | TransactionDefinition | Yes | From system setting |
| ReferenceNumber | ReferenceNumber | Yes | Set to "Granite" |
| TransactionDate | TransactionDate | Yes | Current date/time |
| EntityId | LocationId | Yes | From system setting |
| ToLocation | WarehouseId | Yes | Destination warehouse |
| Code | ItemId | Yes | Item identifier |
| ActionQty | Quantity | Yes | Quantity to receive |
| UOM | Unit | Yes | Unit of measure |
| Batch | LotNumber | No | If ENABLE_LOT_CATEGORY enabled |
| ExpiryDate | ItemExpiration | No | If ENABLE_EXPIRATION enabled |
| SerialNumber | SerialNumber | No | If ENABLE_SERIALNO enabled |

### ADJUSTMENT

Adjusts inventory quantities up or down.

- **Granite Transaction Type**: ADJUSTMENT
- **Intacct Transaction**: Inventory Transaction (Increase or Decrease based on qty)
- **Supports**: Lot tracking, Serial numbers, Expiry dates

The service automatically determines whether to use TransactionDefinitionAdjustmentIncrease or TransactionDefinitionAdjustmentDecrease based on the FromQty and ToQty values.

| Granite Field | Intacct Field | Required | Behavior |
|---------------|---------------|----------|----------|
| TransactionDefinitionAdjustment | TransactionDefinition | Yes | Auto-selected (Increase/Decrease) |
| ReferenceNumber | ReferenceNumber | Yes | Set to "Granite" |
| TransactionDate | TransactionDate | Yes | Current date/time |
| EntityId | LocationId | Yes | From system setting |
| FromLocation | WarehouseId | Yes | Source warehouse |
| Code | ItemId | Yes | Item identifier |
| ActionQty | Quantity | Yes | Quantity to adjust |
| UOM | Unit | Yes | Unit of measure |
| Batch | LotNumber | No | If ENABLE_LOT_CATEGORY enabled |
| ExpiryDate | ItemExpiration | No | If ENABLE_EXPIRATION enabled |
| SerialNumber | SerialNumber | No | If ENABLE_SERIALNO enabled |

### MOVE

Moves inventory between warehouses within the same location.

- **Granite Transaction Type**: MOVE
- **Intacct Transaction**: Inventory Transaction (configured via TransactionDefinitionMove)
- **Supports**: Lot tracking, Serial numbers, Expiry dates

| Granite Field | Intacct Field | Required | Behavior |
|---------------|---------------|----------|----------|
| TransactionDefinitionMove | TransactionDefinition | Yes | From system setting |
| ReferenceNumber | ReferenceNumber | Yes | Set to "Granite" |
| EntityId | LocationId | Yes | From system setting |
| ToLocation | WarehouseId | Yes | Destination warehouse |
| Code | ItemId | Yes | Item identifier |
| ActionQty | Quantity | Yes | Quantity to move |
| UOM | Unit | Yes | Unit of measure |
| Batch | LotNumber | No | If ENABLE_LOT_CATEGORY enabled |
| ExpiryDate | ItemExpiration | No | If ENABLE_EXPIRATION enabled |
| SerialNumber | SerialNumber | No | If ENABLE_SERIALNO enabled |

### RECLASSIFY

Changes item code while adjusting inventory (decrease old code, increase new code).

- **Granite Transaction Type**: RECLASSIFY
- **Intacct Transaction**: Two Inventory Transactions (Decrease + Increase)
- **Supports**: Lot tracking, Serial numbers, Expiry dates

The service creates two transactions: one to decrease the FromCode item and one to increase the ToCode item.

| Granite Field | Intacct Field | Required | Behavior |
|---------------|---------------|----------|----------|
| TransactionDefinitionAdjustmentDecrease | TransactionDefinition | Yes | For decrease transaction |
| TransactionDefinitionAdjustmentIncrease | TransactionDefinition | Yes | For increase transaction |
| ReferenceNumber | ReferenceNumber | Yes | Set to "Granite" |
| TransactionDate | TransactionDate | Yes | Current date/time |
| FromLocation | WarehouseId | Yes | Warehouse location |
| FromCode | ItemId (Decrease) | Yes | Original item code |
| ToCode | ItemId (Increase) | Yes | New item code |
| ActionQty | Quantity | Yes | Quantity to reclassify |
| UOM | Unit | Yes | Unit of measure |
| Batch | LotNumber | No | If ENABLE_LOT_CATEGORY enabled |
| ExpiryDate | ItemExpiration | No | If ENABLE_EXPIRATION enabled |
| SerialNumber | SerialNumber | No | If ENABLE_SERIALNO enabled |

### SCRAP

Records scrapped/disposed inventory.

- **Granite Transaction Type**: SCRAP
- **Intacct Transaction**: Inventory Transaction (configured via TransactionDefinitionScrap)
- **Supports**: Lot tracking, Serial numbers, Expiry dates

| Granite Field | Intacct Field | Required | Behavior |
|---------------|---------------|----------|----------|
| TransactionDefinitionScrap | TransactionDefinition | Yes | From system setting |
| ReferenceNumber | ReferenceNumber | Yes | Set to "Granite" |
| TransactionDate | TransactionDate | Yes | Current date/time |
| FromLocation | WarehouseId | Yes | Source warehouse |
| Code | ItemId | Yes | Item identifier |
| ActionQty | Quantity | Yes | Quantity to scrap |
| UOM | Unit | Yes | Unit of measure |
| Batch | LotNumber | No | If ENABLE_LOT_CATEGORY enabled |
| ExpiryDate | ItemExpiration | No | If ENABLE_EXPIRATION enabled |
| SerialNumber | SerialNumber | No | If ENABLE_SERIALNO enabled |

### PICK

Creates or updates sales order invoices.

- **Granite Transaction Type**: PICK
- **Intacct Transaction**: Order Entry Transaction (Sales Invoice)
- **Supports**: Lot tracking, Serial numbers, Expiry dates

| Granite Field | Intacct Field | Required | Behavior |
|---------------|---------------|----------|----------|
| TransactionDefinitionPick | TransactionDefinition | Yes | From system setting |
| CustomerId | CustomerId | Yes | From DocumentTradingPartnerCode |
| TransactionDate | TransactionDate | Yes | Current date/time |
| CreatedFrom | CreatedFrom | Yes | "{PickOrigin}-{Document}" |
| State | State | Yes | "Closed" or "Pending" based on post flag |
| FromLocation | WarehouseId | Yes | Source warehouse |
| Code | ItemId | Yes | Item identifier |
| ActionQty | Quantity | Yes | Quantity to pick |
| UOM | Unit | Yes | Unit of measure |
| Batch | LotNumber | No | If ENABLE_LOT_CATEGORY enabled |
| ExpiryDate | ItemExpiration | No | If ENABLE_EXPIRATION enabled |
| SerialNumber | SerialNumber | No | If ENABLE_SERIALNO enabled |

### RECEIVE

Creates or updates purchase order receipts.

- **Granite Transaction Type**: RECEIVE
- **Intacct Transaction**: Purchasing Transaction (Purchase Invoice)
- **Supports**: Lot tracking, Serial numbers, Expiry dates

| Granite Field | Intacct Field | Required | Behavior |
|---------------|---------------|----------|----------|
| TransactionDefinitionReceive | TransactionDefinition | Yes | From system setting |
| VendorId | VendorId | Yes | From DocumentTradingPartnerCode |
| VendorDocNumber | VendorDocNumber | Yes | From Document |
| TransactionDate | TransactionDate | Yes | Current date/time |
| DueDate | DueDate | Yes | Current date/time |
| CreatedFrom | CreatedFrom | Yes | "{ReceiveOrigin}-{Document}" |
| State | State | Yes | "Closed" or "Pending" based on post flag |
| FromLocation | WarehouseId | Yes | Destination warehouse |
| Code | ItemId | Yes | Item identifier |
| ActionQty | Quantity | Yes | Quantity to receive |
| UOM | Unit | Yes | Unit of measure |
| Batch | LotNumber | No | If ENABLE_LOT_CATEGORY enabled |
| ExpiryDate | ItemExpiration | No | If ENABLE_EXPIRATION enabled |
| SerialNumber | SerialNumber | No | If ENABLE_SERIALNO enabled |

### TRANSFER

Creates or updates warehouse transfers between locations.

- **Granite Transaction Type**: TRANSFER
- **Intacct Transaction**: Warehouse Transfer
- **Supports**: Lot tracking, Serial numbers, Expiry dates

| Granite Field | Intacct Field | Required | Behavior |
|---------------|---------------|----------|----------|
| Description | Description | Yes | Set to "Granite" |
| FromLocation | WarehouseId | Yes | Source warehouse |
| ToLocation | WarehouseId | Yes | Destination warehouse |
| Code | ItemId | Yes | Item identifier |
| ActionQty | Quantity | Yes | Quantity to transfer |
| UOM | Unit | Yes | Unit of measure |
| Batch | LotNumber | No | If ENABLE_LOT_CATEGORY enabled |
| ExpiryDate | ItemExpiration | No | If ENABLE_EXPIRATION enabled |
| SerialNumber | SerialNumber | No | If ENABLE_SERIALNO enabled |


## Performance Considerations

### Request Deduplication and Concurrency Protection

The service implements robust protection against duplicate and concurrent requests to prevent double-posting to Intacct:

**Queue Key Generation**

Each integration request generates a unique queue key based on:
- Transaction IDs
- Document number
- Process name
- Transaction type

This key uniquely identifies the work being requested.

**Duplicate Request Handling**

When a request is received, the service checks for existing workflows with the same queue key:

- **New Request**: If no existing workflow is found, a new workflow is created and started
- **Duplicate Request (In Progress)**: If an active workflow exists for the same data, the service returns an error indicating a request is already in progress. This prevents concurrent processing of the same transactions
- **Suspended Workflow**: If a suspended workflow is found (e.g., after a timeout), the service automatically resumes it rather than creating a duplicate

**Benefits**

- **Prevents Double-Posting**: The same transaction cannot be posted to Intacct multiple times
- **Safe Retries**: If a request times out, retrying the same request will resume the original workflow
- **Concurrent Safety**: Multiple users or processes cannot accidentally post the same data simultaneously
- **Automatic Recovery**: Workflows that were interrupted can be resumed without manual intervention

### Database Connection Pooling

SQL Server connection pooling is enabled by default. The service efficiently reuses database connections across requests, reducing overhead and improving throughput.

## Resources

- **Developer Documentation**: [https://developer.intacct.com/](https://developer.intacct.com/)
- **Integration Jobs**: See [integration-jobs.md](integration-jobs.md) for downward sync
- **IIS Setup**: See [IIS Getting Started](../../iis/getting-started.md)
