# Hotfixes

## 2025-08-12 - 2025-08-18

Process App

- Date 2025-08-15
- Version 7.0.0.2
- Support optional fields on transaction submit
- Fix MasterItem “Not Found” when it contains a special char

Granite.Business.API.ServiceInterface.dll

- Date 2025-08-15
- Version 7.0.0.2
- Add Transfer Business rule AlwaysSplitTrackingEntity
- Add optional fields to transaction submit
- Fix allow receive to location with erp location on line with empty ToLocation
- Fix takeon not capturing manufacture date

Granite.Business.API.ServiceModel.dll

- Date 2025-08-15
- Version 7.0.0.1
- Fix MasterItem “Not Found” when it contains a special char
- Add optional fields to transaction submit

Granite.Business.API.ServiceInterface.dll

- Date 2025-08-15
- Version 6.0.0.14
- Add Transfer Business rule AlwaysSplitTrackingEntity

Granite.Repository.ServiceInterface.dll

- Date 2025-08-15
- Version 6.0.0.5 & 7.0.0.1
- Support updating pickslip lines
- Prevent saving process divider with same name
- Fix error fetching document line locations

Granite.Repository.ServiceModel.dll

- Date 2025-08-15
- Version 6.0.0.1 & 7.0.0.1
- Support updating pickslip lines
- Fix deleting process step lookups with special chars
- Fix error fetching document line locations

WebDesktop

- Date 2025-08-15
- 6.1.5, 7.0.4
- Fix: Pickslip lines edit, allowing edit of qty, comment and instruction
- Fix deleting process step lookups with special chars
- Fix: Menu Divider,  prevent duplicate Names, update/maintain color field
- Fix: Move, Adjustment Integration - try to integrate even when URL not specified
- Fix: Reversal error (invalid URL)

Process App

- Date 2025-08-13
- 7.0.0.1
- Fix bug in process function mapping on subsequent iterations of a process

Granite.Business.API.ServiceModel.dll

- Date 2025-08-12
- 6.0.0.6
- Fix MasterItem “Not Found” when it contains a special char

## 2025-08-05 - 2025-08-11

Granite.Business.API.ServiceInterface.dll

- Date 2025-08-07
- 6.0.0.13
- Fix allow receive to location with erp location on line with empty ToLocation

Database SQLCLR

- Date 2025-08-08
- Version 6.0.0.1
- Remove Pack size parameter from the CLR Takeon procedure

## 2025-07-29 - 2025-08-04

Process App 

- Date 2025-08-04
- Version 6.0.0.17
- Support optional fields with transaction submit

Business Api

- Date 2025-08-04
- Granite.Business.API.ServiceInterface.dll 6.0.0.12
- Granite.Business.API.ServiceModel.dll 6.0.0.5
- Capture optional fields with transactions

Granite.Integration.Evo.Job.dll

- Date 2025-07-29
- Version 6.0.0.1
- Fix error handling, continue processing documents when one document fails

## 2025-07-22 - 2025-07-28

Process App

- Date 2025-07-23
- Version 6.0.0.16
- Fix takeon printing labels before optional fields finish capturing

## 2025-07-15 - 2025-07-21

Granite.Business.API.ServiceInterface.dll

- Date 2025-07-18
- Version 6.0.0.10 & 7.0.0.1
- Fix document lines not sorted by line priority

## 2025-07-08 - 2025-07-14

Granite Process App 

- Date 2025-07-14
- Version 6.0.0.15
- Fix error on optional field capture aborts capturing the rest of the fields.

Granite Process App

- Date 2025-07-11
- Version 5.0.0.6
- Fix takeon optional fields not capturing

Granite Process App

- Date 2025-07-10
- Version 6.0.0.14
- Fix “Not Found” error on picking when MasterItem has a trailing space

Granite.Business.API.ServiceInterface.dll

- Date 2025-07-10
- Version 6.0.0.9
- Fix URL encoding issue on master item validation

Granite.Custodian.ServiceInterface.dll

- Date 2025-07-10
- Version 6.0.0.2
- Fix background retries failing with object reference error.

Granite.Email.ServiceInterface.dll

- Date 2025-07-10
- Version 5.0.1.3
- Fix background retries failing with object reference error.

## 2025-07-01 - 2025-07-07

Granite.Business.API.ServiceModel.dll 

- Date 2025-07-03
- Version 6.0.0.4
- Add support for Consume & Manufacture business rules

Granite.Business.API.ServiceInterface.dll

- Date 2025-07-03
- Version 6.0.0.8
- Add ActionQtyAllowance business rule to Consume & Manufacture

Process App

- Date 2025-07-03
- Version 6.0.0.13
- Add support for Consume & Manufacture business rules

## 2025-06-17 - 2025-06-23

Process App

- Date 2025-06-20
- Version 6.0.0.12
- Fix “method not implemented” error on Manufacture when there is a step 200

## 2025-06-10 - 2025-06-16

Database SQLCLR

- Date 2025-06-13
- Version 5
- Remove Response json truncation

Database SQLCLR

- Date 2025-06-10
- Version 6
- Added clr_Consume
- Added clr_Manufacture
- Fix clr_PrintLabel to work with https ZPL Label Print

## 2025-06-03 - 2025-06-09

ProcessApp

- Date 2025-06-09
- Version 6.0.0.11
- Fix optional field capture for TakeOn

Granite.Business.API.ServiceInterface.dll

- Date 2025-06-06
- Version 6.0.0.7
- Fix over transfer allowance for CarryingEntity and Partial TrackingEntity transfer

## 2025-05-27 - 2025-06-02

Process App

- Date 2025-06-02
- Version 6.0.0.10
- Add support for Transfer business rules

Granite.Business.API.ServiceInterface.dll, Granite.Business.API.ServiceModel.dll

- Date 2025-06-02
- Granite.Business.API.ServiceInterface.dll Version 6.0.0.6
- Granite.Business.API.ServiceModel.dll version 6.0.0.3
- Add ActionQtyAllowance business rule for transfers

Granite.Integration.Accpac.Job.dll

- Date 2025-05-29
- Version 5.0.0.1 & 6.0.0.1
- Set ERPSyncFailed = true when a line cannot be deleted in Granite because there are transactions against it

## 2025-05-20 - 2025-05-26

Granite.Repository.ServiceInterface.dll

- Date 2025-05-21
- Version 6.0.0.5
- Fix batch validation on receiving and manufacture use barcode

Granite.Repository.ServiceInterface.dll

- Date 2025-05-20
- Version 6.0.0.4
- Copy Document now zeros packed qty

Granite.DomainModel.dll

- Date 2025-05-20
- Version 5.0.1.2
- Transfer overwriting qty on UseBarcode tracking entity instead of adding to it

## 2025-05-13 - 2025-05-19

Web Desktop

- Date 2025-05-08
- Reversal error

## 2025-05-06 - 2025-05-12

Web Desktop

- Date 2025-05-08
- Move, Scrap, Adjustment integration

GraniteRepository.ServiceInterface.dll

- Date 2025-05-08
- Version **5.0.0.3, 6.0.0.2**
- Delete process does not delete all process steps.
- TRANSFER Progress **:** status update of INTRANSIT,RECEIPT document not working

Process App

- Date 2025-05-07
- Version 6.0.0.9
- Move transactions not being posted to integration service

## 2025-04-29 - 2025-05-05

Process App

- Date 2025-05-05
- Version 6.0.0.8
- Fix error on manufacture use barcode step

## 2025-04-22 - 2025-04-28

Process App

- Date: 2025-04-22
- Version 6.0.0.7
- Fix receiving empty use barcode step throwing error

## 2025-04-08 - 2025-04-14

GraniteRepository.ServiceInterface.dll

- Date 2025-04-09
- Version 4.5.3.2, 5.0.0.2, 6.0.0.1
- Fix grid load time when view has CTE / subquerys

## 2025-03-25 - 2025-03-31

Repo API

- Date 2025-03-28
- Version 4.5.3.1
- Fix CredentialsAuthProviderSync Error: Timeout expired, all pooled connections were in use.

Process App

- Date: 2025-03-26

- Version 6.0.0.6
- Fixed receiving business rules not actually passed to business api.

Granite.Integration.PastelEvo.dll

- Date: 2025-03-26
- Version 6.0.0.3
- New integration method **RECEIVE_WITHOUT_SERIALS**. Same as standard but does not post serial numbers for serialized items.

## 2025-03-18 - 2025-03-24

Granite.Business.API.ServiceInterface.dll

- Date: 2025-03-24
- Version 6.0.0.4
- Serial number validation override business rule on receiving

Granite.Business.API.ServiceModel.dll

- Date: 2025-03-24
- Version 6.0.0.2
- Add support for business rules to receiving

Process App

- Date: 2025-03-24
- Version 6.0.0.5
- Add support for business rules to receiving

Granite.Business.API.ServiceInterface.dll

- Date: 2025-03-18
- Version 6.0.0.3
- New business rule override serial number validation on picking

Granite.Integration.PastelEvo.dll

- Date: 2025-03-18
- Version 6.0.0.2
- New integration method PICK_WITHOUT_SERIALS. Same as standard but does not post serial numbers for serialized items.

## 2025-03-11 - 2025-03-17

dbo.**API_QueryDocumentProgress**

- Date: 2025-03-13
- Added columns
    - IntegrationReferences
    - UnpostedTransactionCount

**Process App**

- Date: 2025-03-13
- Version 6.0.0.4
- **Fixed serialization and deserialization of dates to match the business api, added DateTimeFormat to appsettings**

## 2025-03-04 - 2025-03-10

Evo Integration Provider

- Date: 2025-03-07
- Evo Provider versions 5.0.0.1 & 6.0.0.1
- Add system settings to allow specify rounding on action qty for posting back to Evo

## 2025-02-25 - 2025-03-03

ProcessApp & Business API

- Date: 2025-02-25
- ProcessApp version 6.0.0.3
- Granite.Business.API.ServiceInterface.dll version 6.0.0.2
- Granite.Business.API.ServiceModel.dll version 6.0.0.1
- Fix Packing to allow using TrackingEntity barcode in place of MasterItem code

## 2025-02-18 - 2025-02-24

- Granite.Process.App
    - Date 2025-02-20
    - Version 6.0.0.2
    - Fix bug DestinationLocation step not being skipped for INTRANSIT transfers.
  
## 2025-02-11 - 2025-02-17

- Granite.Business.API.ServiceInterface.dll
    - Date: 2025-02-12
    - Version: 6.0.0.1
    - Fix bug on Packing where EF tries to delete lines on document that do not match the master item being packed (cannot actually delete because lines are referenced by FK - but packing transaction fails)
- Granite.Scaffolding.exe
    - Date 2025-02-13
    - Version: 6.0.0.1
    - Fix bug unable to leave telemetry collector address empty
    - Fix bug fails to create firewall rule if integration service is not being installed.
- Granite.Process.App
    - Date 2025-02-13
    - Version: 6.0.0.1
    - Fix bug failing to start if telemetry collector endpoint not configured
- System Snippets Data
    - Date 2025-02-14
    - Fix Packing snippet - incorrectly named variable resulting in corrupted template. Database create script has been updated as well as …\GraniteDatabase\Data\SystemSnippets.sql - you can delete all from SystemSnippets and then run this script to ensure that you have the latest snippets.
- Granite.Custodian.ServiceInterface.dll
    - Date 2025-02-14
    - Same fix as above (Packing snippet) fixed in v6 migration
- Custodian GmailAuthenticator
    - Date 2025-02-14
    - Was missing from previous V6 Custodian release

## 2025-01-14 - 2025-01-20
- Granite.Webservice.dll (second fix below)
    - Released 15/01/2025
    - Version **5.0.0.1**
    - Fix bug when multiple people were scanning the same line on a document (or there is network latency), some transactions fail to update the document detail action qty.
- Granite.DomainModel.dll
    - Released 15/01/2025
    - Version 5.0.1.1
    - Fix bug replenish not printing new tracking entity labels
- Granite.Webservice.dll (related to 5.0.0.1)
    - Released 17/01/2025
    - Version **5.0.0.3**
    - Fix bug introduced by the fix in 5.0.0.1 - important update. Requests that need to wait to acquire a lock do not acquire a lock even once the document is available to process - this results in long running IIS requests that never terminate, and cause slow downs in IIS.
  
## 2025-01-06 - 2025-01-13
- **GraniteScheduler.**ServiceInterface.dll
    - Released 06/01/2025
    - Version 5.0.0.1
    - Fix bug causing error `The SSL connection could not be established` when trying to connect to Utility API to send email.
- Process App
    - Released 13/01/2025
    - Version 5.0.0.5
    - Properly disable the UI after the user has submitted an input. This prevents prescripts from running multiple times accidentally


---
