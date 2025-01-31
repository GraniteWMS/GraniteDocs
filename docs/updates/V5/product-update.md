
## April 2024 New Release : 5.0.0.0

!!! note    
    - Database changes required

### Database
#### Database Tables
- `new` table Migration
- `new` table OptionalFieldValues_Document
- `new` table OptionalFieldValues_DocumentDetail
- `new` table SystemTransientData
- `new` table Email
- `new` table EmailLog
- `new` table EmailTemplate
- `fix` table OptionalFieldValues_Location
- `change` table Users
- `change` table SystemSettings
- `change` table Process
- `change` table ProcessMembers
- `change` table ProcessStep
- `change` table Transaction
- `change` table ProcessStepLookup
- `change` table ProcessStepLookupDynamic

#### Stored Procedures
- `remove` stored procedure EmailTemplate

#### Database Data
- `new` Table Migration: Default migration data
- `new` Table EmailTemplate: IntegrationError template
- `new` Table SystemSettings: UtilityApi and Custodian settings
- `fix` Table Users: User 0 has all permissions
- `fix` Table DataGrid: Add missing fields to Document grids
- `change` Table SystemSettings: All password settings are encrypted by default
- `remove` Table SystemSettings: Email related settings removed
- `remove` Table DataGrid: SystemSettings grid

#### SQLCLR
- `new` support for UtilityAPI operations
	- Report Print
	- Report Export
	- SQL Table Export
	- Template Email
	- Simple Email
- `change` CLR procedures are now deployed with database create, no need to install separately
- `change` improved error handling to show more detailed messages when SystemSettings is incorrect
- `change` add manufactureDate to TakeOn procedure
- `change` add NoEntities to clr_Replenish


#### Accpac Integration

- `fix` view Integration_Accpac_InternalUsageDetail 
- `fix` view Integration_Accpac_IntransitDetail 
- `fix` view Integration_Accpac_PurchaseOrderDetail 
- `fix` view Integration_Accpac_ReceiptDetail 
- `fix` view Integration_Accpac_SalesOrderDetail 
- `fix` view Integration_Accpac_TransferDetail 
- `fix` view MasterItemAlias_View

#### Evo Integration

- `new` view Integration_Evolution_InterBranchRequisitionHeader
- `new` view Integration_Evolution_InterBranchRequisitionDetail
- `new` trigger TriggerGraniteInterBranchRequisition

### Webdesktop
- `fix` wrong document displaying when selected from grid
    - [https://granitewms.canny.io/bugs/p/webdesktop-document-selection](https://granitewms.canny.io/bugs/p/webdesktop-document-selection)
- `fix` prevent action qty being overridden when editing document line
    - [https://granitewms.canny.io/bugs/p/document-line-edit-overiding-action-qty](https://granitewms.canny.io/bugs/p/document-line-edit-overiding-action-qty)
- `fix` stocktake recommendations when counts have been reset
    - [https://granitewms.canny.io/bugs/p/stock-take-count-reset-and-recommendations](https://granitewms.canny.io/bugs/p/stock-take-count-reset-and-recommendations)
- `change` additional fields for pickslip documents
    - [https://granitewms.canny.io/bugs/p/pickslip-document-fields](https://granitewms.canny.io/bugs/p/pickslip-document-fields)
- `change` only show active master items in document edit
    - [https://granitewms.canny.io/request/p/show-only-active-masteritems-in-dropdown](https://granitewms.canny.io/request/p/show-only-active-masteritems-in-dropdown)
- `change` improve error message when executing function without selected record
    - [https://granitewms.canny.io/bugs/p/webdesktop-functions-no-record-select-error](https://granitewms.canny.io/bugs/p/webdesktop-functions-no-record-select-error)
- `change` improve document management user experience
- `new` optional fields support for Document
- `new` optional fields support for DocumentDetail
- `new` prescript preview functionality
- `new` SystemSettings encryption functionality
- `new` database migration support

### ProcessApp & Webservice

- `fix` Document display issue
    - [https://granitewms.canny.io/bugs/p/process-app-documentprogress-display-issue](https://granitewms.canny.io/bugs/p/process-app-documentprogress-display-issue)
- `fix` Error creating new pallet when label print service is not configured
    - [https://granitewms.canny.io/bugs/p/pallet-label-print-error-with-no-print-service](https://granitewms.canny.io/bugs/p/pallet-label-print-error-with-no-print-service)
- `new` Number of Entities functionality for replenish
    - [https://granitewms.canny.io/request/p/replenish-to-multiple-tes](https://granitewms.canny.io/request/p/replenish-to-multiple-tes)
- `new` Unlimited step 200s
- `new` Debug mode


### Evo integration

#### SDK Provider

- `new` Map DocumentReference to Message1 on Evo SalesOrder post
    - [https://granitewms.canny.io/request/p/evo-integration-sales-order-post-update-message-lines-on-sales-order](https://granitewms.canny.io/request/p/evo-integration-sales-order-post-update-message-lines-on-sales-order)
- `new` Support for encrypted SystemSettings

#### Injected jobs

- `new` Support for Inter Branch Requisition
    - [https://granitewms.canny.io/request/p/evo-inter-branch-requisition-document-sync-job](https://granitewms.canny.io/request/p/evo-inter-branch-requisition-document-sync-job)
- `fix` Performance issue causing sql timeout on document jobs
- `change` Use UtilityAPI for email notifications


### Accpac Integration
#### SDK Provider
- `new` Support for encrypted SystemSettings

#### Injected jobs
- `change` Use UtilityAPI for email notifications

### Omni Integration
#### SDK Provider
- `new` Support for encrypted SystemSettings

### SAPB1 Integration
#### SDK Provider
- `new` Support for encrypted SystemSettings

### Syspro Integration
#### SDK Provider
- `new` Support for encrypted SystemSettings


### Label Printing Bartender
- `change` Logging provider to Nlog

### Scheduler
- `change` email jobs now use Utility API - support for old implementation removed