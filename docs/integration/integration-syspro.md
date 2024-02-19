# Syspro

## Settings

The settings for Syspro are configured in the SystemSettings table. The IntegrationService will pick up the settings using the Application name specified in it's `.config` file:
```
<add key ="SystemSettingsApplicationName" value="IntegrationSyspro"/>
```
If this setting is missing from the config file or left empty, the IntegrationService will default to using `IntegrationSyspro` as the SystemSettingsApplicationName

You can browse the IntegrationService's `/config` page to have the IntegrationService create the default settings in the SystemSettings table for you.

The script to insert the default settings is also located in the GraniteDatabase release:
```
~\GraniteDatabase\Data\SystemSettings\SystemSettingSyspro.sql
```

**`Take Note`** To pick up any changes to the SystemSettings table, the IntegrationService will need to be restarted.

### Example SystemSettings in database

| Application       | Key                                       | Value | Description                                                                       | 
|-------------------|-------------------------------------------|-------|-----------------------------------------------------------------------------------|
| IntegrationSyspro | SysproWriteXML                            |       | If true, logs XML that would be posted to C drive instead of posting to Syspro    |
| IntegrationSyspro | Operator                                  |       | Syspro Operator name                                                              |
| IntegrationSyspro | OperatorPassword                          |       | Syspro Operator password                                                          |
| IntegrationSyspro | CompanyId                                 |       | Syspro CompanyID                                                                  |
| IntegrationSyspro | CompanyPassword                           |       | Syspro Company password                                                           |
| IntegrationSyspro | SalesOrderPosting                         |       | Syspro business object to use for SalesOrder posting (SORTBO or SORTOS or ALL)    |
| IntegrationSyspro | TransferPosting                           |       | Syspro integration method for Transfers (GIT or INVT)                             |
| IntegrationSyspro | Instance                                  |       | Syspro Instance to use (empty for default)                                        |
| IntegrationSyspro | MultipleBins                              |       | true or false. Set to true when Syspro has multiple bins enabled                  |
| IntegrationSyspro | SerialNumbers                             |       | true or false. Set to true when Syspro has SerialNumbers enabled                  |


### SysproWriteXML
- Instead of posting the transaction write to xml. Output will be in root C:

### Operator
- Syspro operator name

### OperatorPassword
- Syspro operator password

### CompanyId
- Syspro company name

### CompanyPassword
- Syspro company password

### SalesOrderPosting
- Options: SORTBO / SORTOS / ALL
- Used By: PICKING
- SORTBO: post to business object SORTBO
- SORTOS: post to business object SORTOS
- ALL: Clear SORTBO, post SORTBO, post SORTOS

### TransferPosting
- Options: INVT / GIT
- Used By: TRANSFER (TRANSFER / INTRANSIT / RECEIPT)

### Instance
- The instance to use when connecting to Syspro
- Leave empty for default

### MultipleBins
- Not fully implemented
- Set to true when Syspro has multiple bins enabled

### SerialNumbers
- Not fully implemented
- Set to true when Syspro has SerialNumbers enabled

## Integration Methods

### TAKEON
- INVTMR. Inventory Receipts

### ADJUSTMENT
- INVTMA. Inventory Adjustments

### RECLASSIFY
- Not implemented/supported

### REPLENISH
- INVTMO. Inventory Warehouse Transfer

### TRANSFER
Based on setting TransferPosting (INVT or GIT)

- INVT
    - TRANSFER/INTRANSIT: INVTMO
    - RECEIPT: INVTMI
- GIT 
    - TRANSFER/INTRANSIT: SORTBO
    - RECEIPT: INVTMN

### MOVE
- INVTMO. Inventory Warehouse Transfer

### SCRAP
- INVTMA. Inventory Adjustments

### PICK
Based on setting SalesOrderPosting (SORTBO/SORTOS/ALL)

- SORTBO
    - SORTBO PostSorBackOrderRelease
- SORTOS
    - SORTOS PostSorOrderStatus
- ALL
    - SORTBO PostSorBackOrderRelease Clear (Set qty 0)
    - SORTBO PostSorBackOrderRelease set qty from Granite
    - SORTOS PostSorOrderStatus
    - SORTIC PostSalesOrderInvoice

### RECEIVE
- PORTOR. Purchase Order Receipts

### DYNAMICPICK
- Not Implemented/supported