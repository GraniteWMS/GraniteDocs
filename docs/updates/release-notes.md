# Hotfixes

# 2025-02-18 - 2025-02-24

- Granite.Process.App
    - Date 2025-02-20
    - Version 6.0.0.2
    - Fix bug DestinationLocation step not being skipped for INTRANSIT transfers.
  
# 2025-02-11 - 2025-02-17

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

## 14/01/2025 - 20/01/2025
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
  
## 06/01/2025 - 13/01/2025
- **GraniteScheduler.**ServiceInterface.dll
    - Released 06/01/2025
    - Version 5.0.0.1
    - Fix bug causing error `The SSL connection could not be established` when trying to connect to Utility API to send email.
- Process App
    - Released 13/01/2025
    - Version 5.0.0.5
    - Properly disable the UI after the user has submitted an input. This prevents prescripts from running multiple times accidentally


---
