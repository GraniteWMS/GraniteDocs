# Version 6 Upgrade Guide
This document explains the process of upgrading SQLCLR from version 5 to version 6 (Business API version).
You will only need to do this if you upgrading an existing database to version 6. New version 6 installs come with SQLCLR.

## What has changed

### Outputs 
All outputs have be changed from responseCode and responseJson to success and message. 
While this requires some overhead to change initially it will greatly simplify using SQLCLR in future. 
Rather than building in handling into the prescript the valid and message can directly be set from the output.

### BusinessAPI
In version 6 the [BusinessAPI](../business-api/manual.md) has replaced the WebService. This has a few affects. The first is that the system setting needs to be changes to include the address of the BusinessAPI rather than the WebService.
The next is that many have different parameters. 

## Upgrade Steps:

1. [Install new SQLCLR](#install-new-sqlclr)
2. [Update System Settings](#update-system-settings)
3. [Identify all place it has been used](#identify-all-place-it-has-been-used)
4. [Apply changes for each procedure](#apply-changes-for-each-procedure)

### Install new SQLCLR

Either use Custodian migration to upgrade SQLCLR or run the version 6 SQLCLR_install.sql script from the deploy folder.

### Update System Settings

Add the new System Settings entry for BusinessAPI and remove Webservice entry.
You can use the below script.

```sql
INSERT INTO [dbo].[SystemSettings] ([Application], [Key], [Value], [Description], [ValueDataType], [isEncrypted], [isActive], [AuditDate], [AuditUser])
SELECT 'SQLCLR', 'Business_API_Endpoint', '', 'Business API Address', 'string', 0, 1, GETDATE(), 'AUTOMATION'
WHERE NOT EXISTS (
    SELECT 1
    FROM [dbo].[SystemSettings]
    WHERE [Application] = 'SQLCLR' AND [Key] = 'Business_API_Endpoint'
);
INSERT INTO [dbo].[SystemSettings] ([Application], [Key], [Value], [Description], [ValueDataType], [isEncrypted], [isActive], [AuditDate], [AuditUser])
SELECT 'SQLCLR', 'Custodian_API_Endpoint', '', 'Custodian API Address', 'string', 0, 1, GETDATE(), 'AUTOMATION'
WHERE NOT EXISTS (
    SELECT 1
    FROM [dbo].[SystemSettings]
    WHERE [Application] = 'SQLCLR' AND [Key] = 'Custodian_API_Endpoint'
);

IF EXISTS(SELECT * FROM SystemSettings WHERE [Application] = 'SQLCLR' AND [Key] = 'Webservice')
BEGIN
	DELETE FROM SystemSettings
	WHERE [Application] = 'SQLCLR' AND [Key] = 'Webservice'
END
```

### Identify all place it has been used

As a result of the changes listed in the [what has changed](#what-has-changed) section above you will need to alter the prescripts using any of the SQLCLR procedures.

To find all of these procedures you can use the following script:
```sql
SELECT	referencing_object_name = OBJECT_NAME(sd.referencing_id),
		referenced_object_name = COALESCE(OBJECT_NAME(sd.referenced_id), sd.referenced_entity_name)
FROM	sys.sql_expression_dependencies sd
		LEFT JOIN sys.objects so ON sd.referencing_id = so.object_id
		LEFT JOIN sys.objects so_referenced ON sd.referenced_id = so_referenced.object_id
WHERE sd.referenced_entity_name LIKE 'clr_%';
```

The first column is the prescript and the second is SQLCLR procedure executed in the script.

![Find prescripts](./img/find-prescripts.PNG)

### Apply changes for each procedure

To alter the existing procedure the simplest process will be to right click on the procedure and select execute.
Fill in test info to get the formatting of the execute. 

![Execute](./img/execute-procedure.PNG)

You can then replace the existing exec in prescript with the new one. Here you can see a before and after using clr_Adjustment. 

BEFORE:
```sql
EXECUTE [dbo].[clr_Adjustment] 
   @userID = @userID
  ,@inventoryIdentifier = @inventoryIdentifier
  ,@qty = @qty
  ,@comment = @comment
  ,@reference = @reference
  ,@adjustmentType = @adjustmentType
  ,@integrationReference = @integrationReference
  ,@processName = @processName
  ,@responseCode = @responseCode OUTPUT
  ,@responseJSON = @responseJSON OUTPUT

IF @responseCode = 200
BEGIN
	SELECT @valid = 1
	SELECT @message = CONCAT('Successfully adjusted ', @TrackingEntityBarcode, ' to ', @QtyToAdjustTo)  
END
ELSE
BEGIN
	SELECT @valid = 0
	SELECT @message = @responseJSON
END
```
AFTER:
```sql
EXEC	[dbo].[clr_Adjustment]
		@userName = @UserName,
		@trackingEntityIdentifier = @inventoryIdentifier,
		@adjustmentQty = @qty,
		@comment = @comment,
		@reference = @reference,
		@adjustmentType = @adjustmentType,
		@integrationReference = @integrationReference,
		@processName = @processName,
		@success = @valid OUTPUT,
		@message = @message OUTPUT
```
The main things to note are that you pass the UserName instead of the userID. This paired with being able to directly set the valid and message makes using the SQLCLR procedures far simpler. 

In this example the SQLCLR is the last action in the prescript so you can directly set the @valid and @message. If this is not the case, you can check if it succeeded like this:

```sql
EXEC	[dbo].[clr_Adjustment]
		@userName = @UserName,
		@trackingEntityIdentifier = @inventoryIdentifier,
		@adjustmentQty = @qty,
		@comment = @comment,
		@reference = @reference,
		@adjustmentType = @adjustmentType,
		@integrationReference = @integrationReference,
		@processName = @processName,
		@success = @success OUTPUT,
		@message = @message OUTPUT

IF(@success = 1) -- 1 indicates success
	BEGIN 
		-- Continue with logic here
	END

```

