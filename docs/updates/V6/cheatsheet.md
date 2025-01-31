# Cheat Sheet


## Database

<div style="background-color:#ffffff">
```mermaid
%%{init: { 'logLevel': 'debug', 'theme': 'default' , 'themeVariables': {
              'cScale0': '#51AA6C', 'cScaleLabel0': '#ffffff',
              'cScale1': '#00A6CE',
              'cScale2': '#F24C0D', 'cScaleLabel2': '#ffffff'
       } } }%%
    timeline
        title Granite WMS Version 6 Database
       
        section Tables
          New Tables : AuditStockTakeSession : UsersPermissions : SystemPermissions : DataCapture : DataCaptureFields : DataCaptureFieldsLookup : IntegrationSettings

          New columns : ProcessStep <br> isBusinessRule :  StockTakeLines <br> CarryingEntityBarcode <br> CarryingEntity_id : AuditStockTakeLines <br> CarryingEntityBarcode <br> CarryingEntity_id : StockTakeSession <br> AuditDate <br> AuditUser <br> Version : DataGrid <br> RowStyleRules <br> PageSize : UsersCredential <br> LockoutEndTime <br> PasswordExpiration <br> IsAccountLocked <br> ApiKey <br> PasswordLastChanged : Users <br> FirstName <br> LastName : Transaction <br> FromContainableEntity_id <br> ToContainableEntity_id
        
         Column Changes : Audit <br> RecordVersion : Document <br> ERPSyncFailedReason : DocumentDetail <br> ERPSyncFailedReason : ScheduledJobs <br> InjectedJob : ScheduledJobsHistory <br> InjectedJob : UsersCredential <br> FailedLoginAttempts : TradingPartner <br> Address1 <br> Address2 <br> Address3 <br> Address4 <br> Address5 <br> ContactPerson

         Dropped columns : Transaction <br> ContainableEntity_id : Users <br> Allow* <br> drop old permissions

         section Data

          New Data : UsersPermissions  : SystemPermissions : SystemSettings
          Data Alterations :  SystemSettings : SystemSnippets : DataGrids
          
         section Views
          Alterations : API_QueryStockReorder : Label_Box : API_QueryTransactions : API_QueryTransactions<br>Manufacture : API_QueryTransactions<br>PickReversal : API_QueryTransactions<br>Picking : API_QueryTransactions<br>ReceiveReversal : API_QueryTransactions<br>Receiving : API_QueryTransactions<br>Transfer : API_QueryTransactions<br>TransferReversal

          New Views : DataCaptureFields<br>Lookup_View


```
</div>
## Features

<div style="background-color:#ffffff">
```mermaid
%%{init: { 'logLevel': 'debug', 'theme': 'default' , 'themeVariables': {
              'cScale0': '#51AA6C', 'cScaleLabel0': '#ffffff',
              'cScale1': '#00A6CE',
              'cScale2': '#F24C0D', 'cScaleLabel2': '#ffffff'
       } } }%%
    timeline
        title Granite WMS Version 6 Features

        section WebDesktop

          Process Catalog : Add SQL Objects to templates

          Process : Rename Function:  Delete Function:  UserGroups <br> Process Menu Dividers  : Enhanced Prescript Preview

          Datagrid : Datagrid PageSize : Datagrid RowStyle : Datagrid Styling Guidelines
          
          Document : Copy Function

          StockTake : Refresh Session : Session Audit : Better Carrying Entity Visibility

          Users: Copy function 

         section Security & Permissions
          Permissions : More Granular permissions : Permissions moved to User Groups
          Security Enhancements : Expiring Passwords : Lockout after failed logins : Password strength requirements 
```
</div>

## Technical

<div style="background-color:#ffffff">
```mermaid
%%{init: { 'logLevel': 'debug', 'theme': 'default' , 'themeVariables': {
              'cScale0': '#51AA6C', 'cScaleLabel0': '#ffffff',
              'cScale1': '#00A6CE',
              'cScale2': '#F24C0D', 'cScaleLabel2': '#ffffff'
       } } }%%
    timeline
        title Granite WMS Version 6 Technical

        section Installation
          Scaffold CLI : Install and Setup Granite with EASE!
          Integration Jobs : Accpac <br> all-in-one deploy script : Evo <br> all-in-one deploy script

        section Config
          AppSettings : Webdesktop <br> Change to Business API URL : ProcessApp <br> Change to Business API URL <br> Add telemetry settings : Integration service <br> Add telemetry settings : Custodian API <br> Add telemetry settings : Label Printing ZPL <br> Add telemetry settings : Scheduler <br> Add telemetry settings 
          
          Database Settings : Custodian API <br> Application name changed to Granite.Custodian <br> Add Email and Report settings : SQLCLR <br> Webservice changed to Business API <br> Utility API changed to Custodian : Scheduler <br> Utility API changed to Custodian 


        section Tooling
          Jaeger : New way to view logs and traces  

        section API
          Webservice : Replaced with Business API
          
          API Merge & Consolidation: Util move to Custodian API
          : Repo move to Business API

          Security : API Key <br> 3rd party authentication 
         section CLR
            New Procedures: Copy Document: Transfer: Create CarryingEntity: TrackingEntity Optional Field
        
        section Integration
          New Providers : Intacct : Sage 100 : Acumatica
          Support Initial ActionQty : Evo : Accpac

       
            
```
</div>