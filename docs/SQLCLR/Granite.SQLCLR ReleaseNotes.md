# Release Notes

## Granite.SQLCLR (TBA) 4.5.0.3
##### New
- UtilityAPI
	- Report Print
	- Report Export
	- SQL Table Export
	- Template Email
	- Simple Email
##### Changes
- Update error handling to show more detailed messages when SystemSettings is incorrect

## Granite.SQLCLR (15 August 2023) 4.5.0.2
##### New
- Webservice
	- Packing
	- Reclassify
##### Changes
- Previous scripts and dlls have been replace with SQLCLR_Install.sql
- Script can now be run from any server that has the SSMS connected to the required SQL server instance.

## Granite.SQLCLR (27 June 2023) 4.5.0.1

##### Changes
- Endpoints are now always fetched from the SystemSettings table. No need to run create scripts after making changes
- Integration
    - Fix bug preventing transactions from being posted using ID.

## Granite.SQLCLR (01 June 2023) 4.5.0.0

##### New
- Webservice
	- Picking
	- Receiving
- Integration
    - Post to specified URL

##### Changes
- Takeon
    - Fix bug where @assignTrackingEntityBarcode only works for new TrackingEntities
- Split Types into separate files
- Create scripts added as .sql files and removed from manual
