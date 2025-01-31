# Hotfixes

## 06/01/2025 - 13/01/2025
- **GraniteScheduler.**ServiceInterface.dll
    - Released 06/01/2025
    - Version 5.0.0.1
    - Fix bug causing error `The SSL connection could not be established` when trying to connect to Utility API to send email.
- Process App
    - Released 13/01/2025
    - Version 5.0.0.5
    - Properly disable the UI after the user has submitted an input. This prevents prescripts from running multiple times accidentally

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

---
