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
- `new` support for Option Field Entry (Location, Document, DocumentDetail, MasterItem)
- `new` support for Copy Document
- `new` support for TrackingEntityOptionalField
- `new` support for create carrying entity
- `new` support for Transfer process
    - [https://granitewms.canny.io/request/p/clr-for-transfers](https://granitewms.canny.io/request/p/clr-for-transfers)
- `change` new certificate that won't expire
- `change` added copies parameter to ReportPrint

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
- `change` upgrade to .NET 8
- `fix` object reference error on Manufacture process looping back to before Document step
    - [https://granitewms.canny.io/bugs/p/manufacture-process-showing-object-reference-error](https://granitewms.canny.io/bugs/p/manufacture-process-showing-object-reference-error)
- `fix` mashing next button in process results in multiple requests
    - [https://granitewms.canny.io/bugs/p/process-app-next-btn-bug](https://granitewms.canny.io/bugs/p/process-app-next-btn-bug)
- `fix` adjustment with integration success message not showing correctly
    - [https://granitewms.canny.io/bugs/p/accpac-adjustment-the-success-message-displayed-incorrectly](https://granitewms.canny.io/bugs/p/accpac-adjustment-the-success-message-displayed-incorrectly)
- `new` show printer required message when user has not entered a printer name
    - [https://granitewms.canny.io/request/p/printer-required-message-for-a-process-on-processapp](https://granitewms.canny.io/request/p/printer-required-message-for-a-process-on-processapp)
- `change` process dividers more clearly separate menu items 
- `change` can set Replenish Step 100 ToTrackingEntity from prescript
    - [https://granitewms.canny.io/request/p/replenish-totrackingbarcode-as-silent-step](https://granitewms.canny.io/request/p/replenish-totrackingbarcode-as-silent-step)

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
- `change` upgrade to .NET 8
- `fix` datagrids fail to load
    - [https://granitewms.canny.io/bugs/p/webdesktop-enquiry-datagrids-fails-to-load](https://granitewms.canny.io/bugs/p/webdesktop-enquiry-datagrids-fails-to-load)
- `fix` added validation of foreign keys on MasterItemAlias import
    - [https://granitewms.canny.io/request/p/masteritemalias-data-import-error-change](https://granitewms.canny.io/request/p/masteritemalias-data-import-error-change)
- `fix` Invalid Username and Password on the Webdeskop using valid credentials
    - [https://granitewms.canny.io/bugs/p/webdesktop-login-expired-invalid-user-name-password](https://granitewms.canny.io/bugs/p/webdesktop-login-expired-invalid-user-name-password)
- `fix` StockTakeRelease not creating transactions
    - [https://granitewms.canny.io/bugs/p/webdesktop-stocktakerelease-sometimes-not-creating-transactions](https://granitewms.canny.io/bugs/p/webdesktop-stocktakerelease-sometimes-not-creating-transactions`)
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

### Utility API 
- `change` added copies parameter to ReportPrint call to enable printing multiple copies
- `change` changed report print to add the print to a queue to make the call faster

### Accpac Integration
#### SDK Provder
- `fix` clearer message when encrypted SystemSettings fail to decrypt
    - [https://granitewms.canny.io/bugs/p/integration-provider-error-invalid-length-for-a-base-64-char-array-or-string](https://granitewms.canny.io/bugs/p/integration-provider-error-invalid-length-for-a-base-64-char-array-or-string)
- `fix` reclassify failing to create second line in adjustment
    - [https://granitewms.canny.io/bugs/p/integration-method-reclassify-split-is-not-implemented-even-though-config-shows](https://granitewms.canny.io/bugs/p/integration-method-reclassify-split-is-not-implemented-even-though-config-shows)
- `fix` unable to post transfer receipt with serial numbers
    - [https://granitewms.canny.io/bugs/p/accpac-integration-post-transfer-receipt-with-serial-number](https://granitewms.canny.io/bugs/p/accpac-integration-post-transfer-receipt-with-serial-number)

#### Injected jobs
- `change` upgrade to .NET 8
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
- `change` upgrade to .NET 8
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
- `change` upgrade to .NET 8
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

- `change` upgrade to .NET 8
- `change` upgrade Coravel dependency
- `change` IInjectableJob interface
