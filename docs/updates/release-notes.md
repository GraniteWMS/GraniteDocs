## Unreleased : 6.0.0.0

!!! note    
    - Database changes required

### Database
#### Database Tables
- `new` table UsersPermissions
- `new` table SystemPermissions
- `new` table IntegrationSettings
- `new` table DataCapture
- `new` table DataCaptureFields
- `new` table DataCaptureFieldsLookup
- `change` table Users
- `change` table UsersCredentials
- `change` table ScheduledJobs
- `change` table ScheduledJobsHistory
- `change` table ProcessStep
- `change` table StockTakeLines
- `change` table AuditStockTakeLines
- `change` table Document
    - [https://granitewms.canny.io/bugs/p/injected-job-failing-to-sync-document-with-message-string-or-binary-data-will-be](https://granitewms.canny.io/bugs/p/injected-job-failing-to-sync-document-with-message-string-or-binary-data-will-be)
- `change` table DocumentDetail
    - [https://granitewms.canny.io/bugs/p/injected-job-failing-to-sync-document-with-message-string-or-binary-data-will-be](https://granitewms.canny.io/bugs/p/injected-job-failing-to-sync-document-with-message-string-or-binary-data-will-be)
- `change` table TradingPartner
    - [https://granitewms.canny.io/bugs/p/accpac-integration-job-tradingpartners-truncated-data](https://granitewms.canny.io/bugs/p/accpac-integration-job-tradingpartners-truncated-data)
- `change` table DataGrid
- `change` table StockTakeSession

#### Database Views
- `new` DataCaptureFieldsLookup_View
- `fix` API_QueryStockReorder
    - [https://granitewms.canny.io/bugs/p/view-api-querystockreorder-does-not-exclude-nonstock-locations](https://granitewms.canny.io/bugs/p/view-api-querystockreorder-does-not-exclude-nonstock-locations)

#### Stored Procedures
- `new` stored procedure CreateExtendedPropertyDescription

#### Database Data
- `new` Table SystemSettings: Default security settings
- `new` Table Migration: Default V6 migration data
- `new` Table SystemPermissions: Default permissions data
- `new` Table DataGrid: AuditStockTakeSession grid
- `change` Table SystemSnippets: Updated snippets to include pagination for document lines
- `change` Table SystemSettings: Latest Custodian Api token
- `change` Table DataGrid: Add carrying entity barcode to AuditStockTakeLines grid
- `change` Table DataGrid: Add LastExecutionDate to ScheduledJobs grid


#### SQLCLR
- `new` support for Business Api operations
- `new` support for Repo Api operations
- `new` support for Data Capture
- `new` support for create carrying entity
- `change` new certificate that won't expire

#### Accpac Integration Jobs
- `new` Integration_Accpac_AutoSimplyMOHeader
- `new` Integration_Accpac_AutoSimplyMODetail
- `new` TriggerGraniteAutoSimplyMO
- `fix` Integration_Accpac_IntransitHeader
    - [https://granitewms.canny.io/bugs/p/accpac-transfer-view-issues](https://granitewms.canny.io/bugs/p/accpac-transfer-view-issues)
    - [https://granitewms.canny.io/bugs/p/the-view-integration-accpac-intransitheader-fails-on-a-conversion-of-expecteddat](https://granitewms.canny.io/bugs/p/the-view-integration-accpac-intransitheader-fails-on-a-conversion-of-expecteddat)
    - [https://granitewms.canny.io/bugs/p/accpac-sales-order-document-header-view-expdate-and-isactive](https://granitewms.canny.io/bugs/p/accpac-sales-order-document-header-view-expdate-and-isactive)

- `fix` Integration_Accpac_PurchaseOrderHeader
    - [https://granitewms.canny.io/bugs/p/the-view-integration-accpac-intransitheader-fails-on-a-conversion-of-expecteddat](https://granitewms.canny.io/bugs/p/the-view-integration-accpac-intransitheader-fails-on-a-conversion-of-expecteddat)
    - [https://granitewms.canny.io/bugs/p/accpac-sales-order-document-header-view-expdate-and-isactive](https://granitewms.canny.io/bugs/p/accpac-sales-order-document-header-view-expdate-and-isactive)

- `fix` Integration_Accpac_ReceiptHeader
    - [https://granitewms.canny.io/bugs/p/accpac-transfer-view-issues](https://granitewms.canny.io/bugs/p/accpac-transfer-view-issues)
    - [https://granitewms.canny.io/bugs/p/accpac-sales-order-document-header-view-expdate-and-isactive](https://granitewms.canny.io/bugs/p/accpac-sales-order-document-header-view-expdate-and-isactive)

- `fix` Integration_Accpac_SalesOrderHeader
    - [https://granitewms.canny.io/bugs/p/the-view-integration-accpac-intransitheader-fails-on-a-conversion-of-expecteddat](https://granitewms.canny.io/bugs/p/the-view-integration-accpac-intransitheader-fails-on-a-conversion-of-expecteddat)
    - [https://granitewms.canny.io/bugs/p/accpac-sales-order-document-header-view-expdate-and-isactive](https://granitewms.canny.io/bugs/p/accpac-sales-order-document-header-view-expdate-and-isactive)

- `fix` Integration_Accpac_TransferHeader
    - [https://granitewms.canny.io/bugs/p/accpac-transfer-view-issues](https://granitewms.canny.io/bugs/p/accpac-transfer-view-issues)
    - [https://granitewms.canny.io/bugs/p/the-view-integration-accpac-intransitheader-fails-on-a-conversion-of-expecteddat](https://granitewms.canny.io/bugs/p/the-view-integration-accpac-intransitheader-fails-on-a-conversion-of-expecteddat)
    - [https://granitewms.canny.io/bugs/p/accpac-sales-order-document-header-view-expdate-and-isactive](https://granitewms.canny.io/bugs/p/accpac-sales-order-document-header-view-expdate-and-isactive)

- `fix` Integration_Accpac_WorkOrderHeader
    - [https://granitewms.canny.io/bugs/p/the-view-integration-accpac-intransitheader-fails-on-a-conversion-of-expecteddat](https://granitewms.canny.io/bugs/p/the-view-integration-accpac-intransitheader-fails-on-a-conversion-of-expecteddat)
    - [https://granitewms.canny.io/bugs/p/accpac-sales-order-document-header-view-expdate-and-isactive](https://granitewms.canny.io/bugs/p/accpac-sales-order-document-header-view-expdate-and-isactive)

- `fix` Integration_Accpac_TradingPartner
    - [https://granitewms.canny.io/bugs/p/sql-view-integration-accpac-tradingpartner-definition-is-incorrect](https://granitewms.canny.io/bugs/p/sql-view-integration-accpac-tradingpartner-definition-is-incorrect)

- `change` Integration_Accpac_IntransitDetail
- `change` Integration_Accpac_PurchaseOrderDetail
- `change` Integration_Accpac_ReceiptDetail
- `change` Integration_Accpac_SalesOrderDetail
- `change` Integration_Accpac_TransferDetail
- `change` Integration_Accpac_WorkOrderDetail
- `fix` TriggerGranitePurchaseOrders
    - [https://granitewms.canny.io/bugs/p/accpac-integration-view-timing-and-status-changes](https://granitewms.canny.io/bugs/p/accpac-integration-view-timing-and-status-changes)
- `fix` TriggerGraniteSalesOrders
    - [https://granitewms.canny.io/bugs/p/accpac-integration-view-timing-and-status-changes](https://granitewms.canny.io/bugs/p/accpac-integration-view-timing-and-status-changes)
- `fix` TriggerGraniteWorkOrders
- `fix` TriggerGraniteTransfers

#### Evo Integration Jobs
- `fix` ERP_StockOnHand
    - [https://granitewms.canny.io/bugs/p/evolution-erp-stockonhand-view-join-excluding-items](https://granitewms.canny.io/bugs/p/evolution-erp-stockonhand-view-join-excluding-items)
- `change` TriggerGraniteWorkOrders
- `change` TriggerGraniteWarehouseTransfer
- `change` TriggerGraniteSalesOrders
- `change` TriggerGranitePurchaseOrders
- `change` TriggerGraniteIntransit
- `change` TriggerGraniteInterBranchRequisition
- `change` TriggerGraniteReceipt
- `change` Integration_Evolution_ReceiptHeader
- `change` Integration_Evolution_InterBranchRequisitionHeader
- `change` Integration_Evolution_IntransitHeader
- `change` Integration_Evolution_PurchaseOrderDetail
- `change` Integration_Evolution_PurchaseOrderDetail_V7
- `change` Integration_Evolution_PurchaseOrderHeader
- `change` Integration_Evolution_SalesOrderDetail
- `change` Integration_Evolution_SalesOrderDetail_V7
- `change` Integration_Evolution_SalesOrderHeader

#### Sage 100 Integration Jobs
- `new` trigger TriggerGranitePurchaseOrders
- `new` trigger TriggerGraniteSalesOrders
- `new` view Integration_Sage100_TradingPartner
- `new` view Integration_Sage100_SalesOrderHeader
- `new` view Integration_Sage100_SalesOrderDetail
- `new` view Integration_Sage100_PurchaseOrderHeader
- `new` view Integration_Sage100_PurchaseOrderDetail
- `new` view Integration_Sage100_MasterItem
- `new` view MasterItemAlias_View
- `new` view ERP_StockOnHand


### Process App
- `fix` object reference error on Manufacture process looping back to before Document step
    - [https://granitewms.canny.io/bugs/p/manufacture-process-showing-object-reference-error](https://granitewms.canny.io/bugs/p/manufacture-process-showing-object-reference-error)
- `fix` mashing next button in process results in multiple requests
    - [https://granitewms.canny.io/bugs/p/process-app-next-btn-bug](https://granitewms.canny.io/bugs/p/process-app-next-btn-bug)
- `new` show printer required message when user has not entered a printer name
    - [https://granitewms.canny.io/request/p/printer-required-message-for-a-process-on-processapp](https://granitewms.canny.io/request/p/printer-required-message-for-a-process-on-processapp)
- `change` process dividers more clearly separate menu items 

### Business API (Webservice replacement)
- `fix` clearer message when lines are complete / cancelled
    - [https://granitewms.canny.io/bugs/p/process-app-error-message-line-item](https://granitewms.canny.io/bugs/p/process-app-error-message-line-item)
- `fix` quality control permission not required for direct on hold take on / receive
    - [https://granitewms.canny.io/bugs/p/direct-onhold-quality-control](https://granitewms.canny.io/bugs/p/direct-onhold-quality-control)
- `fix` transfer location not validating consistently 
    - [https://granitewms.canny.io/bugs/p/transfer-destination-location](https://granitewms.canny.io/bugs/p/transfer-destination-location)
- `fix` packing process not allocating transactions to correct lines
    - [https://granitewms.canny.io/bugs/p/packing-process-incorrect-line-batch](https://granitewms.canny.io/bugs/p/packing-process-incorrect-line-batch)
- `new` record pallet on stocktakecount transactions 
    - [https://granitewms.canny.io/bugs/p/pallet-number-stock-take-transactions](https://granitewms.canny.io/bugs/p/pallet-number-stock-take-transactions)
- `fix` StockTakeCount Pallet audit bug
    - [https://granitewms.canny.io/bugs/p/pallet-stocktakecount-audit-bug](https://granitewms.canny.io/bugs/p/pallet-stocktakecount-audit-bug)
- `new` support for api key authentication 
- `new` support for security settings

### Repo API
- `fix` datagrids fail to load
    - [https://granitewms.canny.io/bugs/p/webdesktop-enquiry-datagrids-fails-to-load](https://granitewms.canny.io/bugs/p/webdesktop-enquiry-datagrids-fails-to-load)
- `fix` added validation of foreign keys on MasterItemAlias import
    - [https://granitewms.canny.io/request/p/masteritemalias-data-import-error-change](https://granitewms.canny.io/request/p/masteritemalias-data-import-error-change)
- `new` record pallet on stocktakecount transactions 
    - [https://granitewms.canny.io/bugs/p/pallet-number-stock-take-transactions](https://granitewms.canny.io/bugs/p/pallet-number-stock-take-transactions)
- `new` support for api key authentication 
- `new` support for security settings

### Webdesktop
- `new` support configurable page size for data grids
    - [https://granitewms.canny.io/request/p/webdesktop-datagrid-page-size-configuraion](https://granitewms.canny.io/request/p/webdesktop-datagrid-page-size-configuraion)
- `new` support renaming processes
    - [https://granitewms.canny.io/request/p/webdesktop-processes-rename-functionality](https://granitewms.canny.io/request/p/webdesktop-processes-rename-functionality)
- `new` support deleting processes
    - [https://granitewms.canny.io/request/p/webdesktop-processes-delete-functionality](https://granitewms.canny.io/request/p/webdesktop-processes-delete-functionality)
- `new` refresh button for stock take session
    - [https://granitewms.canny.io/bugs/p/webdesktop-stocktake-session-missing-refresh](https://granitewms.canny.io/bugs/p/webdesktop-stocktake-session-missing-refresh)
- `new` support for stock take session audit
    - [https://granitewms.canny.io/request/p/stocktake-create-audit-selection-criteria](https://granitewms.canny.io/request/p/stocktake-create-audit-selection-criteria)
- `new` support for copying users
    - [https://granitewms.canny.io/request/p/copy-user-functionality](https://granitewms.canny.io/request/p/copy-user-functionality)
- `new` support for formatting data grids
    - [https://granitewms.canny.io/request/p/datagrid-row-formatting](https://granitewms.canny.io/request/p/datagrid-row-formatting)
- `new` data capture feature

### Accpac Integration
#### SDK Provder
- `fix` clearer message when encrypted SystemSettings fail to decrypt
    - [https://granitewms.canny.io/bugs/p/integration-provider-error-invalid-length-for-a-base-64-char-array-or-string](https://granitewms.canny.io/bugs/p/integration-provider-error-invalid-length-for-a-base-64-char-array-or-string)

#### Injected jobs
- `new` 'all in one' deploy script
- `new` support setting initial action qty on document import
    - [https://granitewms.canny.io/request/p/initial-downwards-integration-for-new-sites](https://granitewms.canny.io/request/p/initial-downwards-integration-for-new-sites)
- `fix` completed lines are not 'uncompleted' when the qty is increased in the ERP
    - [https://granitewms.canny.io/bugs/p/injected-job-complete-flag-on-document-detail-line-not-updating](https://granitewms.canny.io/bugs/p/injected-job-complete-flag-on-document-detail-line-not-updating)
- `fix` documents deleted in the ERP are marked as cancelled in Granite
    - [https://granitewms.canny.io/request/p/change-document-status-in-granite-when-document-is-deleted-from-erp](https://granitewms.canny.io/request/p/change-document-status-in-granite-when-document-is-deleted-from-erp)

### Evolution Integration
#### SDK Provder
- `fix` clearer message when encrypted SystemSettings fail to decrypt
    - [https://granitewms.canny.io/bugs/p/integration-provider-error-invalid-length-for-a-base-64-char-array-or-string](https://granitewms.canny.io/bugs/p/integration-provider-error-invalid-length-for-a-base-64-char-array-or-string)
- `new` map adjustment's DocumentReference to Evo adjustment description
    - [https://granitewms.canny.io/request/p/evo-posting-of-adjustments-field-changes](https://granitewms.canny.io/request/p/evo-posting-of-adjustments-field-changes)

#### Injected jobs
- `new` 'all in one' deploy script
- `new` support setting initial action qty on document import
    - [https://granitewms.canny.io/request/p/initial-downwards-integration-for-new-sites](https://granitewms.canny.io/request/p/initial-downwards-integration-for-new-sites)
- `fix` completed lines are not 'uncompleted' when the qty is increased in the ERP
    - [https://granitewms.canny.io/bugs/p/injected-job-complete-flag-on-document-detail-line-not-updating](https://granitewms.canny.io/bugs/p/injected-job-complete-flag-on-document-detail-line-not-updating)
- `fix` documents deleted in the ERP are marked as cancelled in Granite
    - [https://granitewms.canny.io/request/p/change-document-status-in-granite-when-document-is-deleted-from-erp](https://granitewms.canny.io/request/p/change-document-status-in-granite-when-document-is-deleted-from-erp)

### Syspro Integration
#### SDK Provder
- `fix` clearer message when encrypted SystemSettings fail to decrypt
    - [https://granitewms.canny.io/bugs/p/integration-provider-error-invalid-length-for-a-base-64-char-array-or-string](https://granitewms.canny.io/bugs/p/integration-provider-error-invalid-length-for-a-base-64-char-array-or-string)

### SAPB1 Integration
#### SDK Provder
- `fix` clearer message when encrypted SystemSettings fail to decrypt
    - [https://granitewms.canny.io/bugs/p/integration-provider-error-invalid-length-for-a-base-64-char-array-or-string](https://granitewms.canny.io/bugs/p/integration-provider-error-invalid-length-for-a-base-64-char-array-or-string)

### Omni Integration
#### SDK Provder
- `fix` clearer message when encrypted SystemSettings fail to decrypt
    - [https://granitewms.canny.io/bugs/p/integration-provider-error-invalid-length-for-a-base-64-char-array-or-string](https://granitewms.canny.io/bugs/p/integration-provider-error-invalid-length-for-a-base-64-char-array-or-string)

### QuickBooks Integration
#### Downwards jobs
- `change` document headers without any valid lines are not synced to Granite
    - [https://granitewms.canny.io/request/p/quickbooks-interface-ignore-nonstock-items-flag](https://granitewms.canny.io/request/p/quickbooks-interface-ignore-nonstock-items-flag)

### Label Printing ZPL
- `fix` printer name case sensitive
    - [https://granitewms.canny.io/bugs/p/printername-on-processapp-login-seems-to-be-case-sensitive-previously-this-didnt](https://granitewms.canny.io/bugs/p/printername-on-processapp-login-seems-to-be-case-sensitive-previously-this-didnt)

### Label Printing Bartender
- `fix` printer name case sensitive
    - [https://granitewms.canny.io/bugs/p/printername-on-processapp-login-seems-to-be-case-sensitive-previously-this-didnt](https://granitewms.canny.io/bugs/p/printername-on-processapp-login-seems-to-be-case-sensitive-previously-this-didnt)
- `new` support for Bartender 2022 R8

### Scheduler
!!! warning
    There are breaking changes to injected jobs from older versions in version 6. 
    Only version 6 specific injected jobs will work with Scheduler version 6.

- `change` upgrade Coravel dependency
- `change` IInjectableJob interface

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