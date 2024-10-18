# SDK Provider

The Sage Intacct SDK provider is responsible for mapping Granite Transactions to the relevant format for posting to Intacct. It makes use of the Intacct REST API.

## Settings

!!! note
    Transactions definitions are configured inside Sage Intacct.
    Go to Module (Inventory, Order Entry, Purchasing) -> Setup -> Transaction definitions

| Application              | Key                                  | Value                 | Description                                     |
|--------------------------|--------------------------------------|-----------------------|-------------------------------------------------|
| IntegrationSageIntacct    | SenderId                             |                       | Sage Intacct SenderId                           |
| IntegrationSageIntacct    | SenderPassword                       |                       | Sage Intacct SenderPassword                     |
| IntegrationSageIntacct    | CompanyId                            |                       | Sage Intacct CompanyId                          |
| IntegrationSageIntacct    | EntityId                             |                       | Sage Intacct EntityId                           |
| IntegrationSageIntacct    | UserId                               |                       | Sage Intacct UserId                             |
| IntegrationSageIntacct    | UserPassword                         |                       | Sage Intacct UserPassword                       |
| IntegrationSageIntacct    | TransactionDefinitionMove            | Warehouse Transfer    | Sage Intacct Transaction Definition Move        |
| IntegrationSageIntacct    | TransactionDefinitionScrap           | Inventory Scrap       | Sage Intacct Transaction Definition Scrap       |
| IntegrationSageIntacct    | TransactionDefinitionTakeOn          | Inventory Receipt     | Sage Intacct Transaction Definition TakeOn      |
| IntegrationSageIntacct    | TransactionDefinitionAdjustmentIncrease | Adjustment Increase  | Sage Intacct Transaction Definition Adjustment Increase |
| IntegrationSageIntacct    | TransactionDefinitionAdjustmentDecrease | Adjustment Decrease  | Sage Intacct Transaction Definition Adjustment Decrease |
| IntegrationSageIntacct    | TransactionDefinitionPick            | Sales Invoice-Inventory | Sage Intacct Transaction Definition Pick       |
| IntegrationSageIntacct    | TransactionDefinitionPickOrigin      | Sales Order-Inventory | Sage Intacct Transaction Definition PickOrigin  |
| IntegrationSageIntacct    | TransactionDefinitionReceive         | Purchase Invoice-Inventory | Sage Intacct Transaction Definition Receive  |
| IntegrationSageIntacct    | TransactionDefinitionReceiveOrigin   | PO Receiver-Inventory | Sage Intacct Transaction Definition ReceiveOrigin |


## Integration Methods

### TAKEON

| **Granite Field**                    | **Intacct**                     | **Required** | **Behavior**                                                                                                   |
|--------------------------------------|----------------------------------------|--------------|----------------------------------------------------------------------------------------------------------------|
| **TransactionDefinitionTakeOn**      | `TransactionDefinition`                | Yes          | TransactionDefinitionTakeOn **setting**. Default: Inventory Receipt |
| **ReferenceNumber**                  | `ReferenceNumber`                      | Yes          | This is set to "Granite" in this example. Used as a unique reference for the transaction.                      |
| **TransactionDate**                  | `TransactionDate`                      | Yes          | Automatically set to `DateTime.Now`, representing the date the transaction is created.                         |
| **EntityId**                         | `LocationId`                           | Yes          | `EntityId` **setting**.                       |
| **ToLocation**                       | `WarehouseId`                          | Yes          | The destination warehouse or location for the inventory, mapped from the transaction data (`transaction.ToLocation`). |
| **Code**                             | `ItemId`                               | Yes          | The identifier for the item being transacted, mapped from the transaction code (`transaction.Code`).                  |
| **ActionQty**                        | `Quantity`                             | Yes          | The quantity of the item being transacted, mapped from the transaction data (`transaction.ActionQty`).                |
| **UOM**                              | `Unit`                                 | Yes          | The unit of measure for the item (e.g., boxes, kg), mapped from the transaction data (`transaction.UOM`).             |
