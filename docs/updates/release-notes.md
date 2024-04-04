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

- `fix` view Integration_Accpac_AutoSimplyMODetail 
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

## January 2024 Product Update : 4.5.3.0 

!!! note
    - Database change required
    - Release was done on 16 Jan for ProcessApp and Webdesktop / Repo Api on 23 Jan

### Database (24 Jan 2024)
- `new` Table OptionalFieldValues_Location

### Webdesktop (23 Jan 2024)

- `fix` delete stock take session when no record selected
    - [https://stackoverflowteams.com/c/granitewms/questions/348](https://stackoverflowteams.com/c/granitewms/questions/348)

- `new` grid menu options to clear selection and filters
    - [https://granitewms.canny.io/request/p/webdesktop-grid-menu-option-clear](https://granitewms.canny.io/request/p/webdesktop-grid-menu-option-clear)

- `new` add optional field support for Locations
    - [https://granitewms.canny.io/request/p/optional-fields-location](https://granitewms.canny.io/request/p/optional-fields-location)
    - [https://granitewms.canny.io/request/p/additional-fields-for-locations](https://granitewms.canny.io/request/p/additional-fields-for-locations)

### Repo API (23 Jan 2024)

- fix error when importing documents
    - [https://granitewms.canny.io/bugs/p/webdesktop-document-import](https://granitewms.canny.io/bugs/p/webdesktop-document-import)

### ProcessApp (16 Jan 2024)

- `fix` Layout issues on various screens 
    - [https://granitewms.canny.io/bugs/p/processapp-receiving-screen-issue](https://granitewms.canny.io/bugs/p/processapp-receiving-screen-issue)
    - [https://granitewms.canny.io/bugs/p/processapp-layout-issues-picking](https://granitewms.canny.io/bugs/p/processapp-layout-issues-picking)
    - [https://granitewms.canny.io/bugs/p/stocktake-scanner-detail-values-not-adjacent-to-description](https://granitewms.canny.io/bugs/p/stocktake-scanner-detail-values-not-adjacent-to-description)

## September 2023 Product Update : 4.5.2.0 

### WebDesktop

- `fix` Document Detail stock on hand lookup did not return
    - [https://granitewms.canny.io/bugs/p/stock-on-hand-button-on-document-screens](https://granitewms.canny.io/bugs/p/stock-on-hand-button-on-document-screens)
- `new` Add support for user sites in Datagrid (enquiry). Filter grid data based on user that is currently logged in.
- `new` CSS Datagrid styling. Add CSS style classes to use with datagrid. fontGreen , fontBlue , fontRed , backgroundRed ,backgroundBlue ,backgroundGreen 
    - [https://granitewms.canny.io/request/p/webdesktop-datagrid-styling](https://granitewms.canny.io/request/p/webdesktop-datagrid-styling)
- `fix` Document grids with status CANCELLED not apply correct CSS style
    - [https://granitewms.canny.io/bugs/p/webdesktop-document-grids-status-not-showing-correctly](https://granitewms.canny.io/bugs/p/webdesktop-document-grids-status-not-showing-correctly)
- `fix` Saving customize application grids used incorrect GroupName for the grid. 
- `fix` Saving customize application grids caused the GridName to duplicate the prefix word Custom.

### ProcessApp

- `fix` Confirmation and error sound not playing
- `fix` Documents with larger text fields render incorrectly. 
    - [https://granitewms.canny.io/bugs/p/processapp-document-display-issue](https://granitewms.canny.io/bugs/p/processapp-document-display-issue)

### LabelPrintService
- `new` Add validation of printer name
  
## August 2023 Product Update : 4.5.1.0 

### WebDesktop / Repository API

- `fix` Print label not working with illegal characters in MasterItem Code
- `fix` Functions scripts returning *null* in Valid (field) threw error.
- `fix` Functions for document screen fixed. Selected records not being passed on to function.
- `fix` Grid definition for application grids, show the name and audit information correctly.
- `fix` Data Import: various issues causing the import to not import or show records in grid.
- `fix` TrackingEntity Import: Remove override of Barcode. Expiry and manufacture date column rename.
- `fix` Pickslip grid not showing data.
- `fix` Application grids update isCustomGrid value for grid entry   
- `new` Datagrid StockAvailable (include new SQL view)


### ProcessApp

- `fix` New Pallet ignore casing of word *New*
- `fix` Add web template support for Posting processes.
- `fix` Expand / Collapse of trackingentity information on Pallet did not work.
- `fix` When trying to open Transfer Post page was not found.
- `new` Prefix all web template errors to clarify origin of error.
- `change` Default config for logging `nlog.log` set to Info and included archive setting on size limit.

### Database

#### Database Views

- `fix` API_QueryDocumentProgress
- `fix` API_QueryTransactionsPickReversal (exclude pack transactions)
- `new` DataGrid_StockAvailable

#### Database Data

-  `fix` Table Datagrid: OrderDocumentProgress, ReceivingDocumentProgress, TransferDocumentProgress, WorkOrderDocumentProgress
-  `fix` Table Datagrid: entry **ImportTrackingEntity**. Fix layout. Also see Tracking Entity Import on Webdesktop fix.
-  `fix` Table Datagrid: entry Document / PickslipDocument. Fix layout. 
-  `new` Table Datagrid: Grid for DataGrid_StockAvailable.
-  `new` Table Snippets: various snippets added to showcase standard Granite 

#### Accpac Database

-  `fix` MasterItemAlias_View add union on join
-  `change` IntegrationProcessTransfer, IntegrationProcessSalesOrder, IntegrationProcessTransfer. Use ExpectedDate instead of ActionDate

### Scheduler 

- `change` Remove execution timeout for SQL jobs

#### Accpac Injected jobs

- `fix` Scheduler gets stuck when document line's MasterItem_ERPIdentification does not appear in Integration_Accpac_MasterItem view

#### Evo Injected jobs

- `fix` not validating changes before updating document lines

### ZPL LabelPrinting

- `change` Variables in ZPL label templates now need to be prefixed with `@`

### Accpac 

- `new` Support for Accpac 2023 version 7.0