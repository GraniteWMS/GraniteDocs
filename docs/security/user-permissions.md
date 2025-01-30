# Permissions

Permissions in our software system are organized into categories for easier maintenance and clarity. These categories are purely for organizational purposes and do not influence functionality within the system.

Permissions (from version 6 onwards) are assigned to the to user groups rather than to individual users. These permissions are managed on the permission tab on the user group screen in the WebDesktop.

They live in the following sql tables: 

- `SystemPermissions` - this is where permissions are defined. For a group to have a permission, the permission must exist in this table.
- `UsersPermissions` - This is where permissions are assigned to UserGroups. An entry linking a user group to a system permission grants the group that permission.

Below, you'll find a list of permissions, organized by their respective categories.


### Admin
Admin Permissions grant administrators the ability to maintain the application's settings and configurations

| Category | Name                 | Description                                                                |
|----------|----------------------|----------------------------------------------------------------------------|
| Admin    | SystemSettingsSetup   | Allow access to application system settings (see SecuritySettings, ApplicationSettings settings) |
| Admin    | SecuritySettings      | Allow access to security system settings                                  |
| Admin    | ApplicationSettings   | Allow access to application system settings (all Granite* settings)         |
| Admin    | PasswordReset         | Permission to set and reset passwords of users                            |
| Admin    | ScheduledJobSetup     | Allow user to create and edit scheduled jobs                               |
| Admin    | MetaDataSetup         | Allow user to create and edit metadata                                     |
| Admin    | StaticDataSetup       | Allow user to create and edit static data                                  |
| Admin    | ProcessCatalog        | Allow user to access ProcessCatalog screen                                 |
| Admin    | Integration           | Allow user to access Integration screen                                    |
| Admin    | TrackingEntityImport  | Allow user to import TrackingEntity                                        |
| Admin    | DataImport            | Allow user to import master data                                           |


### Setup 
Permissions to Setup and Maintain Company Data includes the ability to manage and configure essential master data, such as locations, master items, and other key data setups

| Category | Name                 | Description                                         |
|----------|----------------------|-----------------------------------------------------|
| Setup    | CategorySetup         | Allow user to create and edit categories             |
| Setup    | TypeSetup             | Allow user to create and edit types                  |
| Setup    | LocationSetup         | Allow user to create and edit locations              |
| Setup    | MasterItemSetup       | Allow user to create and edit master items           |
| Setup    | ProcessSetup          | Allow user to create and edit processes              |
| Setup    | UserGroupSetup        | Allow user to create and edit user groups            |
| Setup    | TradingPartnerSetup   | Allow user to create and edit trading partners       |
| Setup    | UserSetup             | Allow user to create and edit users                  |


### Process Permission
Process permissions to allow access to certain processes 

| Category | Name                          | Description                                     |
|----------|-------------------------------|-------------------------------------------------|
| Process  | TakeOnProcess                  | Allow user to perform TakeOn transactions        |
| Process  | ReceiveProcess                 | Allow user to perform Receive transactions       |
| Process  | ReceiveReversalProcess         | Allow user to perform ReceiveReversal transactions |
| Process  | BulkScrapProcess               | Allow user to perform BulkScrap transactions     |
| Process  | BulkMoveProcess                | Allow user to perform BulkMove transactions      |
| Process  | ReturnProcess                  | Allow user to perform Return transactions        |
| Process  | PickDynamicProcess             | Allow user to perform PickDynamic transactions   |
| Process  | PickProcess                    | Allow user to perform Pick transactions          |
| Process  | PickReversalProcess            | Allow user to perform PickReversal transactions  |
| Process  | StockTakeProcess               | Allow user to perform StockTake transactions     |
| Process  | StockTakeStatusControlProcess  | Allow user to perform StockTakeStatusControl transactions |
| Process  | TransferProcess                | Allow user to perform Transfer transactions      |
| Process  | TransferDynamicProcess         | Allow user to perform TransferDynamic transactions |
| Process  | TransferReversalProcess        | Allow user to perform TransferReversal transactions |
| Process  | AdjustProcess                  | Allow user to perform Adjust transactions        |
| Process  | ScrapProcess                   | Allow user to perform Scrap transactions         |
| Process  | MoveProcess                    | Allow user to perform Move transactions          |
| Process  | ReplenishProcess               | Allow user to perform Replenish transactions     |
| Process  | DataCaptureProcess             | Allow user to perform DataCapture transactions   |
| Process  | QualityControlProcess          | Allow user to perform QualityControl transactions |
| Process  | PackProcess                    | Allow user to perform Pack transactions          |
| Process  | PalletizeProcess               | Allow user to perform Palletize transactions     |
| Process  | ReclassifyProcess              | Allow user to perform Reclassify transactions    |
| Process  | ManufactureProcess             | Allow user to perform Manufacture transactions   |
| Process  | ConsumeProcess                 | Allow user to perform Consume transactions       |


### Inbound Permissions 
Inbound permission grant users access to the Inbound document modules in the WebDesktop

| Category | Name                          | Description                                     |
|----------|-------------------------------|-------------------------------------------------|
|Inbound|InboundReceivingProgress|Allows the user to view Receiving Progress in the WebDesktop Inbound module|
|Inbound|InboundReceivingDocument|Allows the user to view and manage Receiving Documents in the WebDesktop Inbound module|
|Inbound|InboundReceivingComplete|Allows the user to complete receiving documents in the WebDesktop Inbound module|
|Inbound|InboundReceivingRelease|Allows the user to release receiving documents in the WebDesktop Inbound module|
|Inbound|InboundReceiveReversal|Allows user to reverse receiving transactions in the WebDesktop Inbound module|

### Outbound Permissions
Outbound permission grant users access to the Outbound document modules in the WebDesktop

| Category | Name                          | Description                                     |
|----------|-------------------------------|-------------------------------------------------|
|Outbound|OutboundPickingProgress|Allows the user to view Picking Progress in the WebDesktop Outbound module|
|Outbound|OutboundPickingDocument|Allows the user to view and manage Picking Documents in the WebDesktop Outbound module|
|Outbound|OutboundPickSlipDocument|Allows the user to view and manage PickSlip Documents in the WebDesktop Outbound module|
|Outbound|OutboundPickingReversal|Allows user to reverse picking transactions in the WebDesktop Outbound module|
|Outbound|OutboundOrderComplete|Allows the user to complete picking documents in the WebDesktop Outbound module|
|Outbound|OutboundOrderRelease|Allows the user to release picking documents in the WebDesktop Outbound module|

### Integration Permissions 
Integration permission grant users permissions to post transactions for integration|

| Category | Name                          | Description                                     |
|----------|-------------------------------|-------------------------------------------------|
|Integration|ReceivePost|Allow user to post ReceivePost transactions|
|Integration|ReturnPost|Allow user to post ReturnPost transactions|
|Integration|PickPost|Allow user to post PickPost transactions|
|Integration|StockTakePost|Allow user to post StockTakePost transactions|
|Integration|TransferDynamicPost|Allow user to post TransferDynamicPost transactions|
|Integration|TransferPost|Allow user to post TransferPost transactions|
|Integration|ManufacturePost|Allow user to post ManufacturePost transactions|
|Integration|ConsumePost|Allow user to post ConsumePost transactions|


### Inventory Permissions
Inventory Permissions grant access to the inventory modules in the WebDesktop

| Category | Name                          | Description                                     |
|----------|-------------------------------|-------------------------------------------------|
|Inventory|InventoryTrackingEntity|Allows the user to view and manage Tracking Entities in the WebDesktop Inventory module|
|Inventory|InventoryVariances|Allows the user to access and review inventory variances within the WebDesktop Inventory module|
|Inventory|InventoryVariancesAdjustment|Allows the user to make adjustments to inventory variances in the WebDesktop Inventory module|
|Inventory|InventoryQualityControl|Allows the user to access the Quality Control section within the WebDesktop Inventory module|
|Inventory|InventoryQualityControlScrap|Allows the user to mark inventory items as scrap within the WebDesktop Quality Control module|
|Inventory|InventoryQualityControlHold|Allows the user to place inventory items on hold within the WebDesktop Quality Control module|
|Inventory|InventoryQualityControlRelease|Allows the user to release inventory items from hold within the WebDesktop Quality Control module|
|Inventory|InventoryQualityControlMove|Allows the user to move inventory items within the WebDesktop Quality Control module|
|Inventory|InventoryTrackingEntityMove|Allows the user to move Tracking Entities within the WebDesktop Inventory module|
|Inventory|InventoryTrackingEntityScrap|Allows the user to mark Tracking Entities as scrap within the WebDesktop Inventory module|
|Inventory|InventoryTrackingEntityAdjustment|Allows the user to adjust Tracking Entities within the WebDesktop Inventory module|

### Manufacture Permissions
Manufacture Permissions give users access to the Manufacturing modules in the WebDesktop

| Category | Name                          | Description                                     |
|----------|-------------------------------|-------------------------------------------------|
|Manufacture|ManufactureProgress|Allow user to access ManufactureProgress screen in the WebDesktop Manufacture module|
|Manufacture|ManufactureDocument|Allow user to access ManufactureDocument screen in the WebDesktop Manufacture module|
|Manufacture|ManufactureDocumentComplete|Allows the user to complete receiving documents in the WebDesktop Manufacture module|
|Manufacture|ManufactureDocumentRelease|Allows the user to release receiving documents in the WebDesktop Manufacture module|

### StockTake Permissions
StockTake permissions give users access to StockTake modules in the WebDesktop

| Category | Name                          | Description                                     |
|----------|-------------------------------|-------------------------------------------------|
|StockTake|StockTakeSession|Allow user to access StockTake CreateSession screen|
|StockTake|StockTakeProcessing|Allow user to access StockTake Processing screen|
|StockTake|StockTakeProcessingCommands|Allows the user to Process| Approve| and Accept StockTake counts in the WebDesktop StockTake module|
|StockTake|StockTakeStatusControl|Allows the user to access StockTake StatusControl screen|
|StockTake|StockTakeQualityControlScrap|Allows the user to mark inventory items as scrap within the WebDesktop StockTake StatusControl module|
|StockTake|StockTakeQualityControlHold|Allows the user to place inventory items on hold within the WebDesktop StockTake StatusControl module|
|StockTake|StockTakeQualityControlRelease|Allows the user to release inventory items from hold within the WebDesktop StockTake StatusControl module|
|StockTake|StockTakeQualityControlMove|Allows the user to move inventory items within the WebDesktop StockTake StatusControl module|

### Transfer Permissions
Transfer Permissions give user access to Transfer modules in the WebDesktop

| Category | Name                          | Description                                     |
|----------|-------------------------------|-------------------------------------------------|
|Transfer|TransferProgress|Allow user to access TransferProgress screen|
|Transfer|TransferDocumentComplete|Allows the user to complete transfer documents in the WebDesktop Transfer module|
|Transfer|TransferDocumentRelease|Allows the user to release transfer documents in the WebDesktop Transfer module|
|Transfer|TransferDocument|Allow user to access TransferDocument screen|
|Transfer|InTransitDocument|Allow user to access In-transit Transfer Document screen|
|Transfer|ReceiptDocument|Allow user to access TransferDocument screen|
|Transfer|TransferReversal|Allow user to reverse Transfer transactions|

### Enquiry Permissions
Enquiry Permissions grant users access to enquires in the WebDesktop

| Category | Name                          | Description                                     |
|----------|-------------------------------|-------------------------------------------------|
|Enquiry|DataGrid|Allow user to view Enquiry/DataGrid|