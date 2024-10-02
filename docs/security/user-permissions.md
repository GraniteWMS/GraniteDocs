# Permissions

Permissions in our software system are organized into categories for easier maintenance and clarity. These categories are purely for organizational purposes and do not influence functionality within the system.
Below, you'll find a list of permissions, organized by their respective categories.


### Admin
Admin Permissions grant administrators the ability to maintain the application's settings and configurations.

| Category | Name                 | Description                                                                |
|----------|----------------------|----------------------------------------------------------------------------|
| Admin    | SystemSettingsSetup   | Allow access to application system settings (see SecuritySettings, ApplicationSettings settings) |
| Admin    | SecuritySettings      | Allow access to security system settings.                                  |
| Admin    | ApplicationSettings   | Allow access to application system settings (all Granite* settings)         |
| Admin    | PasswordReset         | Permission to set and reset passwords of users.                            |
| Admin    | ScheduledJobSetup     | Allow user to create and edit scheduled jobs                               |
| Admin    | MetaDataSetup         | Allow user to create and edit metadata                                     |
| Admin    | StaticDataSetup       | Allow user to create and edit static data                                  |
| Admin    | ProcessCatalog        | Allow user to access ProcessCatalog screen                                 |
| Admin    | Integration           | Allow user to access Integration screen                                    |
| Admin    | TrackingEntityImport  | Allow user to import TrackingEntity                                        |
| Admin    | DataImport            | Allow user to import master data                                           |


### Setup 
Permissions to Setup and Maintain Company Data includes the ability to manage and configure essential master data, such as locations, master items, and other key data setups.

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
Process permissions to allow access to certain processes. 

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
