# Omni

**`Take Note`** Requirements for Omni integration need to be assessed carefully before it is offered to any potential clients.
The Omni API is limited in the functionality that it offers, and it usually does not behave in the same way that the Omni Desktop application does.

## Setup

todo

## Settings

The settings for Omni are configured in the SystemSettings table. The IntegrationService will pick up the settings using the Application name specified in it's `.config` file:
```
<add key ="SystemSettingsApplicationName" value="IntegrationOmni"/>
```
If this setting is missing from the config file or left empty, the IntegrationService will default to using `IntegrationOmni` as the SystemSettingsApplicationName

You can browse the IntegrationService's `/config` page to have the IntegrationService create the default settings in the SystemSettings table for you.

The script to insert the default settings is also located in the GraniteDatabase release:
```
~\GraniteDatabase\Data\SystemSettings\SystemSettingsOmni.sql
```

**`Take Note`** To pick up any changes to the SystemSettings table, the IntegrationService will need to be restarted.

### Example SystemSettings in database

| Application       | Key                           | Value | Description                                                                                   | 
|-------------------|-------------------------------|-------|-----------------------------------------------------------------------------------------------|
| IntegrationOmni   | Host                          |       | Server name or IP of the server where the Omni API is hosted                                  |
| IntegrationOmni   | Port                          |       | Port number that the Omni API is running on                                                   |
| IntegrationOmni   | UserName                      |       | Omni user name that is used to transact via the API                                           |
| IntegrationOmni   | Password                      |       | Password for the Omni user                                                                    |
| IntegrationOmni   | CompanyName                   |       | Omni company name to post to                                                                  |
| IntegrationOmni   | AdjustmentAccount             |       | Account that adjustments will post to                                                         |
| IntegrationOmni   | ScrapAccount                  |       | Account that scrap transactions will post to                                                  |
| IntegrationOmni   | IntransitWarehouse            |       | The intransit warehouse that will be used                                                     |
| IntegrationOmni   | PostDynamicTransferReceipt    |       | true or false. Determines whether Omni transfer is auto posted for Granite DynamicTransfers   |

## Integration Methods

**`Take Note`** This is the complete list of supported integration methods at present. 
There is no support for manufacturing or receiving at this time.

todo

### ADJUSTMENT

### TRANSFER

### TRANSFERRECEIPT

### TRANSFERDYNAMIC

### SCRAP

### PICK


