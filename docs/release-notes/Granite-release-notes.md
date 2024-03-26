# January 2024 Product Update : 4.5.3.0 
- `Database change required`
- `Release was done on 16 Jan for ProcessApp and Webdesktop / Repo Api on 23 Jan`

## Database (24 Jan 2024)
- `new` Table OptionalFieldValues_Location

## Webdesktop (23 Jan 2024)

- `fix` delete stock take session when no record selected 
  - https://stackoverflowteams.com/c/granitewms/questions/348

- `new` grid menu options to clear selection and filters
  - https://granitewms.canny.io/request/p/webdesktop-grid-menu-option-clear

- `new` add optional field support for Locations
  - https://granitewms.canny.io/request/p/optional-fields-location

## Repo API (23 Jan 2024)

- fix error when importing documents
  - https://granitewms.canny.io/bugs/p/webdesktop-document-import

## ProcessApp (16 Jan 2024)

- `fix` Layout issues on various screens 
  - https://granitewms.canny.io/bugs/p/processapp-receiving-screen-issue
  - https://granitewms.canny.io/bugs/p/processapp-layout-issues-picking
  - https://granitewms.canny.io/bugs/p/stocktake-scanner-detail-values-not-adjacent-to-description

# September 2023 Product Update : 4.5.2.0 

## WebDesktop

- `fix` Document Detail stock on hand lookup did not return
  - https://granitewms.canny.io/bugs/p/stock-on-hand-button-on-document-screens

- `new` Add support for user sites in Datagrid (enquiry). Filter grid data based on user that is currently logged in.
- `new` CSS Datagrid styling. Add CSS style classes to use with datagrid. fontGreen , fontBlue , fontRed , backgroundRed ,backgroundBlue ,backgroundGreen 
  - https://granitewms.canny.io/request/p/webdesktop-datagrid-styling
- `fix` Document grids with status CANCELLED not apply correct CSS style
  - https://granitewms.canny.io/bugs/p/webdesktop-document-grids-status-not-showing-correctly
- `fix` Saving customize application grids used incorrect GroupName for the grid. 
- `fix` Saving customize application grids caused the GridName to duplicate the prefix word Custom.

## ProcessApp

- `fix` Confirmation and error sound not playing
- `fix` Documents with larger text fields render incorrectly. 
  - https://granitewms.canny.io/bugs/p/processapp-document-display-issue

## LabelPrintService
- `new` Add validation of printer name
  
# August 2023 Product Update : 4.5.1.0 

## WebDesktop / Repository API

- `fix` Print label not working with illegal characters in MasterItem Code
- `fix` Functions scripts returning *null* in Valid (field) threw error.
- `fix` Functions for document screen fixed. Selected records not being passed on to function.
- `fix` Grid definition for application grids, show the name and audit information correctly.
- `fix` Data Import: various issues causing the import to not import or show records in grid.
- `fix` TrackingEntity Import: Remove override of Barcode. Expiry and manufacture date column rename.
- `fix` Pickslip grid not showing data.
- `fix` Application grids update isCustomGrid value for grid entry   
- `new` Datagrid StockAvailable (include new SQL view)


## ProcessApp

- `fix` New Pallet ignore casing of word *New*
- `fix` Add web template support for Posting processes.
- `fix` Expand / Collapse of trackingentity information on Pallet did not work.
- `fix` When trying to open Transfer Post page was not found.
- `new` Prefix all web template errors to clarify origin of error.
- `change` Default config for logging `nlog.log` set to Info and included archive setting on size limit.

## Database

### Database Views

- `fix` API_QueryDocumentProgress
- `fix` API_QueryTransactionsPickReversal (exclude pack transactions)
- `new` DataGrid_StockAvailable

### Database Data

-  `fix` Table Datagrid: OrderDocumentProgress, ReceivingDocumentProgress, TransferDocumentProgress, WorkOrderDocumentProgress
-  `fix` Table Datagrid: entry **ImportTrackingEntity**. Fix layout. Also see Tracking Entity Import on Webdesktop fix.
-  `fix` Table Datagrid: entry Document / PickslipDocument. Fix layout. 
-  `new` Table Datagrid: Grid for DataGrid_StockAvailable.
-  `new` Table Snippets: various snippets added to showcase standard Granite 

### Accpac Database

-  `fix` MasterItemAlias_View add union on join
-  `change` IntegrationProcessTransfer, IntegrationProcessSalesOrder, IntegrationProcessTransfer. Use ExpectedDate instead of ActionDate

## Scheduler 

- `change` Remove execution timeout for SQL jobs

### Accpac Injected jobs

- `fix` Scheduler gets stuck when document line's MasterItem_ERPIdentification does not appear in Integration_Accpac_MasterItem view

### Evo Injected jobs

- `fix` not validating changes before updating document lines

## ZPL LabelPrinting

- `change` Variables in ZPL label templates now need to be prefixed with `@`

### Accpac 

- `new` Support for Accpac 2023 version 7.0