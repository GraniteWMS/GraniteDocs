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

### ADJUSTMENT

| **Granite Field**                    | **Intacct**                     | **Required** | **Behavior**                                                                                                   |
|--------------------------------------|---------------------------------|--------------|----------------------------------------------------------------------------------------------------------------|
| **TransactionDefinitionAdjustment** | `TransactionDefinition`         | Yes          | Determines whether the transaction is an increase or decrease based on `FromQty` and `ToQty`. Defaults to `Adjustment Increase` or `Adjustment Decrease`. |
| **ReferenceNumber**                  | `ReferenceNumber`               | Yes          | This is set to "Granite" in this example. Used as a unique reference for the transaction.                      |
| **TransactionDate**                  | `TransactionDate`               | Yes          | Automatically set to `DateTime.Now`, representing the date the transaction is created.                         |
| **EntityId**                         | `LocationId`                    | Yes          | `EntityId` **setting**.                       |
| **FromLocation**                     | `WarehouseId`                   | Yes          | The source warehouse or location for the adjustment, mapped from the transaction data (`transaction.FromLocation`). |
| **Code**                             | `ItemId`                        | Yes          | The identifier for the item being adjusted, mapped from the transaction code (`transaction.Code`).              |
| **ActionQty**                        | `Quantity`                      | Yes          | The quantity of the item being adjusted, mapped from the transaction data (`transaction.ActionQty`).           |
| **UOM**                              | `Unit`                          | Yes          | The unit of measure for the item (e.g., boxes, kg), mapped from the transaction data (`transaction.UOM`).      |

### MOVE

| **Granite Field**                    | **Intacct**                     | **Required** | **Behavior**                                                                                                   |
|--------------------------------------|---------------------------------|--------------|----------------------------------------------------------------------------------------------------------------|
| **TransactionDefinitionMove**        | `TransactionDefinition`         | Yes          | Defines the move transaction type. Defaults to the `Move` transaction definition.                              |
| **ReferenceNumber**                  | `ReferenceNumber`               | Yes          | This is set to "Granite" in this example. Used as a unique reference for the transaction.                      |
| **EntityId**                         | `LocationId`                    | Yes          | `EntityId` **setting**.                       |
| **ToLocation**                       | `WarehouseId`                   | Yes          | The destination warehouse or location for the inventory move, mapped from `transaction.ToLocation`.            |
| **Code**                             | `ItemId`                        | Yes          | The identifier for the item being moved, mapped from `transaction.Code`.                                       |
| **ActionQty**                        | `Quantity`                      | Yes          | The quantity of the item being moved, mapped from `transaction.ActionQty`.                                    |
| **UOM**                              | `Unit`                          | Yes          | The unit of measure for the item (e.g., boxes, kg), mapped from `transaction.UOM`.                            |

### RECLASSIFY

| **Granite Field**                    | **Intacct**                             | **Required** | **Behavior**                                                                                  |
|--------------------------------------|-----------------------------------------|--------------|----------------------------------------------------------------------------------------------|
| **TransactionDefinitionAdjustmentDecrease** | `TransactionDefinition`         | Yes          | Defines the transaction type for decreasing inventory.                                        |
| **TransactionDefinitionAdjustmentIncrease** | `TransactionDefinition`         | Yes          | Defines the transaction type for increasing inventory.                                        |
| **ReferenceNumber**                  | `ReferenceNumber`                       | Yes          | This is set to "Granite" in this example. Used as a unique reference for the transaction.    |
| **TransactionDate**                  | `TransactionDate`                       | Yes          | Automatically set to `DateTime.Now`, representing the date the transaction is created.       |
| **FromLocation**                      | `WarehouseId`                           | Yes          | The warehouse/location where the inventory is being decreased, mapped from `transaction.FromLocation`. |
| **FromCode**                          | `ItemId`                                | Yes          | The item identifier for the inventory being decreased, mapped from `transaction.FromCode`.   |
| **ActionQty**                         | `Quantity`                              | Yes          | The quantity being moved, mapped from `transaction.ActionQty`.                               |
| **UOM**                               | `Unit`                                  | Yes          | The unit of measure for the item (e.g., boxes, kg), mapped from `transaction.UOM`.          |
| **ToCode**                            | `ItemId` (Increase Transaction)         | Yes          | The item identifier for the inventory being increased, mapped from `transaction.ToCode`.     |

### SCRAP

| **Granite Field**                    | **Intacct**                             | **Required** | **Behavior**                                                                                  |
|--------------------------------------|-----------------------------------------|--------------|----------------------------------------------------------------------------------------------|
| **TransactionDefinitionScrap**       | `TransactionDefinition`                 | Yes          | Defines the transaction type for scrapping inventory.                                        |
| **ReferenceNumber**                  | `ReferenceNumber`                       | Yes          | This is set to "Granite" in this example. Used as a unique reference for the transaction.    |
| **TransactionDate**                  | `TransactionDate`                       | Yes          | Automatically set to `DateTime.Now`, representing the date the transaction is created.       |
| **FromLocation**                     | `WarehouseId`                           | Yes          | The warehouse or location where the inventory is being scrapped, mapped from `transaction.FromLocation`. |
| **Code**                             | `ItemId`                                | Yes          | The identifier for the item being scrapped, mapped from `transaction.Code`.                  |
| **ActionQty**                        | `Quantity`                              | Yes          | The quantity of the item being scrapped, mapped from `transaction.ActionQty`.                |
| **UOM**                              | `Unit`                                  | Yes          | The unit of measure for the item (e.g., boxes, kg), mapped from `transaction.UOM`.           |

### PICK

| **Granite Field**                    | **Intacct**                             | **Required** | **Behavior**                                                                                              |
|--------------------------------------|-----------------------------------------|--------------|----------------------------------------------------------------------------------------------------------|
| **TransactionDefinitionPick**        | `TransactionDefinition`                 | Yes          | Defines the transaction type for order entry (in this case, "Pick").                                      |
| **CustomerId**                       | `CustomerId`                            | Yes          | The identifier of the customer (mapped from `transactions[0].DocumentTradingPartnerCode`).               |
| **TransactionDate**                  | `TransactionDate`                       | Yes          | Automatically set to `DateTime.Now`, representing the date the transaction is created.                   |
| **CreatedFrom**                      | `CreatedFrom`                           | Yes          | Constructed as `"AppConfig.TransactionDefinitionPickOrigin-{transactions[0].Document}"`.                 |
| **State**                            | `State`                                 | Yes          | The state of the transaction, either "Closed" or "Pending", based on the `post` flag.                    |
| **FromLocation**                     | `WarehouseId`                           | Yes          | The warehouse or location where the inventory is coming from, mapped from `transaction.FromLocation`.    |
| **Code**                             | `ItemId`                                | Yes          | The identifier for the item being processed, mapped from `transaction.Code`.                              |
| **ActionQty**                        | `Quantity`                              | Yes          | The quantity of the item being processed, mapped from `transaction.ActionQty`.                            |
| **UOM**                              | `Unit`                                  | Yes          | The unit of measure for the item (e.g., boxes, kg), mapped from `transaction.UOM`.                       |

### RECEIVE

| **Granite Field**                    | **Intacct**                             | **Required** | **Behavior**                                                                                              |
|--------------------------------------|-----------------------------------------|--------------|----------------------------------------------------------------------------------------------------------|
| **TransactionDefinitionReceive**     | `TransactionDefinition`                 | Yes          | Defines the transaction type for purchasing (in this case, "Receive").                                      |
| **VendorId**                         | `VendorId`                              | Yes          | The identifier for the vendor, mapped from `transactions[0].DocumentTradingPartnerCode`.                |
| **VendorDocNumber**                  | `VendorDocNumber`                       | Yes          | The vendor's document number, mapped from `transactions[0].Document`.                                      |
| **TransactionDate**                  | `TransactionDate`                       | Yes          | Automatically set to `DateTime.Now`, representing the date the transaction is created.                   |
| **DueDate**                          | `DueDate`                               | Yes          | Automatically set to `DateTime.Now`, representing the due date for the transaction.                       |
| **CreatedFrom**                      | `CreatedFrom`                           | Yes          | Constructed as `"AppConfig.TransactionDefinitionReceiveOrigin-{transactions[0].Document}"`.              |
| **State**                            | `State`                                 | Yes          | The state of the transaction, either "Closed" or "Pending", based on the `post` flag.                    |
| **FromLocation**                     | `WarehouseId`                           | Yes          | The warehouse or location where the inventory is coming from, mapped from `transaction.FromLocation`.    |
| **Code**                             | `ItemId`                                | Yes          | The identifier for the item being processed, mapped from `transaction.Code`.                              |
| **ActionQty**                        | `Quantity`                              | Yes          | The quantity of the item being processed, mapped from `transaction.ActionQty`.                            |
| **UOM**                              | `Unit`                                  | Yes          | The unit of measure for the item (e.g., boxes, kg), mapped from `transaction.UOM`.                       |

### TRANSFER

| **Granite Field**                    | **Intacct**                             | **Required** | **Behavior**                                                                                              |
|--------------------------------------|-----------------------------------------|--------------|----------------------------------------------------------------------------------------------------------|
| **Description**                      | `Description`                           | Yes          | A description for the warehouse transfer, hardcoded to `"Granite"`.                                        |
| **FromLocation**                     | `WarehouseId`                           | Yes          | The warehouse or location from which the inventory is being transferred, mapped from `transaction.FromLocation`. |
| **Code**                             | `ItemId`                                | Yes          | The identifier for the item being transferred, mapped from `transaction.Code`.                              |
| **ActionQty**                        | `Quantity`                              | Yes          | The quantity of the item being transferred, mapped from `transaction.ActionQty`.                            |
| **UOM**                              | `Unit`                                  | Yes          | The unit of measure for the item (e.g., boxes, kg), mapped from `transaction.UOM`.                       |
| **ToLocation**                       | `WarehouseId`                           | Yes          | The warehouse or location to which the inventory is being transferred, mapped from `transaction.ToLocation`. |
