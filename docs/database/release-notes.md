## Unreleased (5.0.0)
---
### GraniteDatabase

#### Changed Views
##### API_QueryDocuments
```sql
ALTER VIEW [dbo].[API_QueryDocuments]
AS
SELECT        TOP 100 PERCENT dbo.[Document].ID, dbo.[Document].Number, dbo.[Document].TradingPartnerCode, dbo.[Document].TradingPartnerDescription, dbo.[Document].CreateDate, dbo.[Document].Priority, 
                         dbo.[Document].ERPLocation, dbo.[Document].Site, dbo.Document.ExpectedDate, dbo.Document.RouteName, dbo.Document.StopName, dbo.[Document].Status, dbo.[Document].AuditDate, dbo.[Document].AuditUser, dbo.[Document].Type, dbo.[Document].Description, (STUFF
                             ((SELECT        CAST(', ' + IntegrationReference AS VARCHAR(MAX))
                                 FROM            [Transaction]
                                 WHERE        (Document_id = [Document].ID)
                                 GROUP BY [Transaction].IntegrationReference FOR XML PATH('')), 1, 2, '')) AS IntegrationReference
FROM            dbo.[Document]
WHERE  ([Status] <> 'COMPLETE' OR AuditDate > getdate() - 30)
ORDER BY dbo.[Document].ID DESC

GO
```
##### Integration_Transactions 
```sql
ALTER VIEW [dbo].[Integration_Transactions]
AS
SELECT * FROM 
(SELECT DISTINCT 
                         dbo.[Transaction].ID, dbo.[Transaction].Date, dbo.Users.Name AS [User], dbo.[Transaction].IntegrationStatus, dbo.[Transaction].IntegrationReady, dbo.MasterItem.Code, ISNULL(dbo.[Transaction].UOM, dbo.MasterItem.UOM) 
                         AS UOM, dbo.[Transaction].UOMConversion, dbo.[Transaction].FromQty, dbo.[Transaction].ToQty, dbo.[Transaction].ActionQty, dbo.Location.ERPLocation AS FromLocationERPLocation, 
                         Location_1.ERPLocation AS ToLocationERPLocation, dbo.[Document].Number AS [Document], dbo.DocumentDetail.LineNumber, MasterItem_1.Code AS FromCode, MasterItem_2.Code AS ToCode, dbo.TrackingEntity.Batch, 
                         dbo.[Transaction].Comment, dbo.[Transaction].Type, dbo.[Transaction].Process, dbo.TrackingEntity.SerialNumber, dbo.[Document].Type AS DocumentType, dbo.[Transaction].IntegrationReference, 
                         dbo.[Document].Description AS DocumentDescription, dbo.TrackingEntity.ExpiryDate, [log].Message, dbo.DocumentDetail.Cancelled AS DocumentLineCancelled, Location_1.Site AS ToSite, dbo.Location.Site AS FromSite, 
                         Process.Name,
						 CASE 
						 WHEN dbo.[Transaction].Process ='PICKING' AND dbo.Process.IntegrationIsActive = 0  THEN 
						    (SELECT IntegrationIsActive FROM dbo.Process WHERE [Name] = 'PICKINGPOST')
						 WHEN dbo.[Transaction].Process ='RECEIVING' AND dbo.Process.IntegrationIsActive = 0  THEN 
						    (SELECT IntegrationIsActive FROM dbo.Process WHERE [Name] = 'RECEIVINGPOST')
						 ELSE dbo.Process.IntegrationIsActive END
						 as IntegrationIsActive, 

						 dbo.[Document].TradingPartnerCode AS DocumentTradingPartnerCode, dbo.[Transaction].DocumentReference AS TransactionDocumentReference, dbo.[Transaction].ReversalTransaction_id
FROM            dbo.[Transaction] INNER JOIN
                         dbo.TrackingEntity ON dbo.[Transaction].TrackingEntity_id = dbo.TrackingEntity.ID INNER JOIN
                         dbo.MasterItem ON dbo.TrackingEntity.MasterItem_id = dbo.MasterItem.ID INNER JOIN
                         dbo.Users ON dbo.[Transaction].User_id = dbo.Users.ID LEFT OUTER JOIN
                         dbo.Process ON dbo.[Transaction].Process = dbo.Process.Name LEFT OUTER JOIN
                         dbo.Location AS Location_1 ON dbo.[Transaction].ToLocation_id = Location_1.ID LEFT OUTER JOIN
                         dbo.Location ON dbo.[Transaction].FromLocation_id = dbo.Location.ID LEFT OUTER JOIN
                         dbo.[Document] ON dbo.[Transaction].Document_id = dbo.[Document].ID LEFT OUTER JOIN
                         dbo.MasterItem AS MasterItem_1 ON dbo.[Transaction].FromMasterItem_id = MasterItem_1.ID LEFT OUTER JOIN
                         dbo.MasterItem AS MasterItem_2 ON dbo.[Transaction].ToMasterItem_id = MasterItem_2.ID LEFT OUTER JOIN
                         dbo.DocumentDetail ON dbo.[Transaction].DocumentLine_id = dbo.DocumentDetail.ID OUTER APPLY
						 (
							 SELECT TOP(1) [Message]
							 FROM dbo.IntegrationLog
							 WHERE GraniteTransaction_id = [Transaction].ID
							 ORDER BY [Date] DESC
						 ) [log]
WHERE       dbo.[Transaction].Type NOT IN ('SPLIT','QCHOLD', 'QCRELEASE', 'STOCKTAKE', 'STOCKTAKEHOLD', 'STOCKTAKERELEASE')  AND 
            IntegrationStatus = 0 AND ISNULL(ReversalTransaction_id, 0) = 0
) AS table_1
WHERE table_1.IntegrationIsActive = 1
```
##### API_QueryTransactionsReceiveReversal
```sql
ALTER VIEW [dbo].[API_QueryTransactionsReceiveReversal]
	AS
SELECT dbo.[Transaction].ID, dbo.TrackingEntity.Barcode, dbo.MasterItem.Code, dbo.MasterItem.Description, dbo.[Transaction].Date, dbo.TrackingEntity.Batch, dbo.TrackingEntity.SerialNumber, dbo.TrackingEntity.ExpiryDate, dbo.[Transaction].FromQty, dbo.[Transaction].ToQty, dbo.[Transaction].ActionQty, dbo.Users.Name AS [User], dbo.[Transaction].DocumentReference, dbo.[Document].Number AS [Document], dbo.[Transaction].IntegrationStatus, 
         dbo.CarryingEntity.Barcode AS Pallet, dbo.[Transaction].Comment, L1.Name AS FromLocation, L2.Name AS ToLocation, L3.Site, dbo.[Transaction].Type, dbo.[Transaction].IntegrationReference, dbo.[Transaction].ReversalTransaction_id, dbo.[Document].TradingPartnerCode, dbo.[Document].TradingPartnerDescription, dbo.[Document].Status, dbo.DocumentDetail.LineNumber
FROM  dbo.[Transaction] INNER JOIN
         dbo.DocumentDetail ON dbo.[Transaction].DocumentLine_id = dbo.DocumentDetail.ID INNER JOIN
         dbo.[Document] ON dbo.[Document].ID = dbo.[Transaction].Document_id LEFT OUTER JOIN
         dbo.CarryingEntity ON dbo.[Transaction].ContainableEntity_id = dbo.CarryingEntity.ID LEFT OUTER JOIN
         dbo.Location AS L1 ON dbo.[Transaction].FromLocation_id = L1.ID LEFT OUTER JOIN
         dbo.Location AS L2 ON dbo.[Transaction].ToLocation_id = L2.ID INNER JOIN
         dbo.Users ON dbo.[Transaction].[User_id] = dbo.Users.ID INNER JOIN
         dbo.TrackingEntity ON [Transaction].TrackingEntity_id = TrackingEntity.ID INNER JOIN
         dbo.Location AS L3 ON dbo.TrackingEntity.Location_id = L3.ID INNER JOIN
         dbo.MasterItem ON dbo.TrackingEntity.MasterItem_id = dbo.MasterItem.ID CROSS APPLY
         (
             SELECT TOP 1 ID
             FROM [Transaction] 
             WHERE TrackingEntity_id = TrackingEntity.ID
             ORDER BY [Date] DESC
         ) lastTransaction
WHERE (dbo.[Transaction].Type = 'RECEIVE') AND ISNULL(dbo.[Transaction].ReversalTransaction_id, 0) = 0 AND ISNULL(dbo.[Transaction].IntegrationStatus, 0) = 0 AND lastTransaction.ID = [Transaction].ID
GO
```

##### DataGrid_StockAvailable
```sql
CREATE VIEW [dbo].[DataGrid_StockAvailable]
AS
SELECT DISTINCT MasterItem.ID AS MasterItemId, 
       Code AS MasterItemCode, 
	   Description AS MasterItemDescription,
	   MasterItem.Type,
	   MasterItem.Category,
	   UOM, 
	   CASE WHEN (SUM(Qty) OVER(PARTITION BY MasterItem.ID) - ISNULL(SalesOrderQty, 0.000) + ISNULL(PurchaseOrderQty, 0.000)) > 0
			THEN 'InStock'
			WHEN (SUM(Qty) OVER(PARTITION BY MasterItem.ID) - ISNULL(SalesOrderQty, 0.000) + ISNULL(PurchaseOrderQty, 0.000)) <= 0
			THEN 'NoStock'
			ELSE 'NoStock'
			END AS Status
	   ,
	   ISNULL(SUM(Qty) OVER(PARTITION BY MasterItem.ID), 0.0000) AS QtyInWarehouse, 
	   ISNULL(SalesOrderQty, 0.000) AS QtyOnSalesOrders,
	   ISNULL(PurchaseOrderQty, 0.000) AS QtyOnPurchaceOrders,
	   ISNULL((SUM(Qty) OVER(PARTITION BY MasterItem.ID) - ISNULL(SalesOrderQty, 0.000)), 0.0000) AS QtyAfterSales,
	   ISNULL((SUM(Qty) OVER(PARTITION BY MasterItem.ID) + ISNULL(PurchaseOrderQty, 0.000)), 0.0000) AS QtyAfterPurchaces,
	   ISNULL((SUM(Qty) OVER(PARTITION BY MasterItem.ID) - ISNULL(SalesOrderQty, 0.000) + ISNULL(PurchaseOrderQty, 0.000)), 0.0000) AS TotalQtyAvailable
FROM MasterItem LEFT JOIN 
	 TrackingEntity ON MasterItem.ID = TrackingEntity.MasterItem_id OUTER APPLY
	 (SELECT (SUM(Qty) - SUM(ActionQty)) AS SalesOrderQty
	  FROM DocumentDetail LEFT JOIN 
	       Document ON DocumentDetail.Document_id = Document.ID
	  WHERE Completed <> 1 AND
		    Cancelled <> 1 AND
			Document.Status in ('ENTERED', 'RELEASED') AND 
			DocumentDetail.Item_id = MasterItem.ID AND 
		    Document.Type = 'ORDER'
	  GROUP BY Item_id) AS SalesOrders
	  OUTER APPLY
	 (SELECT (SUM(Qty) - SUM(ActionQty)) AS PurchaseOrderQty
	  FROM DocumentDetail LEFT JOIN 
	       Document ON DocumentDetail.Document_id = Document.ID
	  WHERE Completed <> 1 AND
		    Cancelled <> 1 AND
			Document.Status in ('ENTERED', 'RELEASED') AND 
			DocumentDetail.Item_id = MasterItem.ID AND 
		    Document.Type = 'RECEIVING'
	  GROUP BY Item_id) AS PurchaseOrders
WHERE MasterItem.isActive = 1 
GO
```

#### New tables

##### Migration

```sql
CREATE TABLE [dbo].[Migration](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](8000) NULL,
	[Description] [varchar](8000) NULL,
	[CreatedDate] [datetime] NOT NULL,
	[CompletedDate] [datetime] NULL,
	[ConnectionString] [varchar](8000) NULL,
	[NamedConnection] [varchar](8000) NULL,
	[Log] [varchar](max) NULL,
	[ErrorCode] [varchar](8000) NULL,
	[ErrorMessage] [varchar](8000) NULL,
	[ErrorStackTrace] [varchar](max) NULL,
	[Meta] [varchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
```

##### OptionalFieldValues_Location
```sql
CREATE TABLE [dbo].[OptionalFieldValues_Location](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[Value] [nvarchar](255) NULL,
	[OptionalField_id] [bigint] NULL,
	[BelongsTo_id] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[OptionalFieldValues_Location]  WITH CHECK ADD  CONSTRAINT [FK1C630FA95BD9E8FA] FOREIGN KEY([OptionalField_id])
REFERENCES [dbo].[OptionalFields] ([ID])
GO

ALTER TABLE [dbo].[OptionalFieldValues_Location] CHECK CONSTRAINT [FK1C630FA95BD9E8FA]
GO

ALTER TABLE [dbo].[OptionalFieldValues_Location]  WITH CHECK ADD  CONSTRAINT [FK1C630FA96509605E] FOREIGN KEY([BelongsTo_id])
REFERENCES [dbo].[Location] ([ID])
GO

ALTER TABLE [dbo].[OptionalFieldValues_Location] CHECK CONSTRAINT [FK1C630FA96509605E]
GO
```

##### OptionalFieldValues_Document
```sql
CREATE TABLE [dbo].[OptionalFieldValues_Document](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[Value] [nvarchar](255) NULL,
	[OptionalField_id] [bigint] NULL,
	[BelongsTo_id] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[OptionalFieldValues_Document]  WITH CHECK ADD  CONSTRAINT [FK1C630FA95BD9E1FA] FOREIGN KEY([OptionalField_id])
REFERENCES [dbo].[OptionalFields] ([ID])
GO

ALTER TABLE [dbo].[OptionalFieldValues_Document] CHECK CONSTRAINT [FK1C630FA95BD9E1FA]
GO

ALTER TABLE [dbo].[OptionalFieldValues_Document]  WITH CHECK ADD  CONSTRAINT [FK1C630FA96509601E] FOREIGN KEY([BelongsTo_id])
REFERENCES [dbo].[Document] ([ID])
GO

ALTER TABLE [dbo].[OptionalFieldValues_Document] CHECK CONSTRAINT [FK1C630FA96509601E]
GO
```

##### OptionalFieldValues_DocumentDetail
```sql
CREATE TABLE [dbo].[OptionalFieldValues_DocumentDetail](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[Value] [nvarchar](255) NULL,
	[OptionalField_id] [bigint] NULL,
	[BelongsTo_id] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[OptionalFieldValues_DocumentDetail]  WITH CHECK ADD  CONSTRAINT [FK1C630FA95BD9E1FB] FOREIGN KEY([OptionalField_id])
REFERENCES [dbo].[OptionalFields] ([ID])
GO

ALTER TABLE [dbo].[OptionalFieldValues_DocumentDetail] CHECK CONSTRAINT [FK1C630FA95BD9E1FB]
GO

ALTER TABLE [dbo].[OptionalFieldValues_DocumentDetail]  WITH CHECK ADD  CONSTRAINT [FK1C630FA96509601A] FOREIGN KEY([BelongsTo_id])
REFERENCES [dbo].[DocumentDetail] ([ID])
GO

ALTER TABLE [dbo].[OptionalFieldValues_DocumentDetail] CHECK CONSTRAINT [FK1C630FA96509601A]
GO
```


##### SystemTransientData
```sql
CREATE TABLE [dbo].[SystemTransientData]
(
	[ID] INT NOT NULL PRIMARY KEY, 
    [Group] VARCHAR(50) NULL, 
    [Key] VARCHAR(100) NULL, 
    [Description] VARCHAR(MAX) NULL, 
    [Value] VARCHAR(MAX) NULL, 
    [Value_id] BIGINT NULL, 
    [User] VARCHAR(50) NULL, 
    [Process] VARCHAR(50) NULL, 
    [ProcessStep] VARCHAR(50) NULL, 
    [DataExpiry] DATETIME NULL
)
```

##### Email
```sql
CREATE TABLE [dbo].[Email](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[Subject] [varchar](150) NOT NULL,
	[Body] [varchar](max) NOT NULL,
	[ToEmailAddresses] [varchar](max) NULL,
	[CcEmailAddresses] [varchar](max) NULL,
	[BccEmailAddresses] [varchar](max) NULL,
	[TemplateName] [varchar](50) NULL,
	[TemplateParameters] [varchar](max) NULL,
	[AttachmentPaths] [varchar](max) NULL,
	[ReportAttachments] [varchar](max) NULL,
	[ExcelAttachments] [varchar](max) NULL,
	[FileAttachments] [varchar](max) NULL,
	[CreateDate] [datetime] NULL,
	[RequestDate] [datetime] NULL,
	[RequestApplication] [varchar](50) NULL,
	[SendDate] [datetime] NULL,
	[NumberOfRetries] [int] NULL,
	[Status] [varchar](50) NOT NULL,	
 CONSTRAINT [PK_Emails] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
```

##### EmailLog
```sql
CREATE TABLE [dbo].[EmailLog](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[Email_id] [bigint] NOT NULL FOREIGN KEY REFERENCES Email(ID),
	[Date] [datetime] NOT NULL,
	[Message] [varchar](max) NOT NULL,	
 CONSTRAINT [PK_EmailLog] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
```

##### EmailTemplate
```sql
CREATE TABLE [dbo].[EmailTemplate](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](50) NOT NULL,
	[Description] [varchar](150) NULL,
	[Definition] [varchar](max) NOT NULL,
	[Format] [varchar](50) NOT NULL,
	[AuditDate] [datetime] NULL,
	[AuditUser] [varchar](50) NULL,
	[Version] [int] NOT NULL,
 CONSTRAINT [PK_EmailTemplate] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [IX_EmailTemplate] UNIQUE NONCLUSTERED 
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
```

#### Changed tables

##### Users
Add column AllowProcessCatalog
```sql
[AllowProcessCatalog] BIT NOT NULL,
```

##### SystemSettings
Add column EncryptionKey
```sql
[EncryptionKey] VARCHAR(64) NULL,

```

##### Process
Increase size of Process Name and Description, add Template_version and Template_id
```sql
[Name] [varchar](50) NOT NULL,
[Description] [varchar](50) NOT NULL,
[Template_version] INT NULL, 
[Template_id] VARCHAR(50) NULL, 
```

##### ProcessMembers
Increase size of Process column
```sql
[Process] VARCHAR(50) NOT NULL,
```

##### ProcessStep
Increase size of Process column
```sql
[Process] VARCHAR(50) NOT NULL,
```

##### Transaction
Increase size of Process column
```sql
[Process] VARCHAR(50) NULL,
```

##### ProcessStepLookup
Increase size of Process column
```sql
[Process] VARCHAR(50) NULL,
```
##### ProcessStepLookupDynamic
Increase size of Process column
```sql
[Process] VARCHAR(50) NULL,
```

#### Removed Stored Procedures

##### EmailTemplate
Removed as Scheduler no longer sends emails using stored procedures

#### New Data

##### Migration Data
```sql
INSERT INTO Migration ([Name], [Description], [Log], [CreatedDate], [CompletedDate])
VALUES	('SCHEMA_500', 'Schema Version 5.0.0', 'Initialised by database create script', GETDATE(), GETDATE()),
		('DATA_500', 'Data Version 5.0.0', 'Initialised by database create script', GETDATE(), GETDATE()),
		('CLR_500', 'CLR Version 5.0.0', 'Initialised by database create script', GETDATE(), GETDATE())
```

##### EmailTemplate Data

```sql
INSERT [dbo].[EmailTemplate] ( [Name], [Description], [Definition], [Format], [AuditDate], [AuditUser], [Version]) 
VALUES ( N'IntegrationError', N'This template is used by Scheduler injected jobs to notify of a failed document sync', N'{{
  headerImage({
    imageUrl:''https://www.granitewms.com/wp-content/uploads/2020/07/GraniteWMS-1.png'',
    backgroundColor:''#182026''
  })
}}

# Document {{documentNumber}} failed to sync

{{#if documentLogs}}
### Document header failed to sync:
{{documentLogs}}
{{/if}}

{{#if documentDetailLogs}}
### Document details failed to sync:
{{documentDetailLogs}}
{{/if}}', N'markdown', GETDATE(), N'AUTOMATION', 1)
```

##### SystemSettings

- Add SQLCLR UtilityApi setting

```sql
INSERT [dbo].[SystemSettings] ([Application], [Key], [Value], [Description], [ValueDataType], [isEncrypted], [isActive], [AuditDate], [AuditUser])
('SQLCLR', 'UtilityApi', '' , 'Utility API Address', 'string', 0, 1, GETDATE(), 'AUTOMATION')
```

- Add Custodian SystemSettings:
```sql
INSERT INTO SystemSettings ([Application], [Key], [Value], [Description], [isEncrypted], [isActive], AuditDate, AuditUser, EncryptionKey)
VALUES 
('GRANITECUSTODIAN', 'Repo_id', 'gVYmRwrftflB7Ffr3FCq2cv2555odnaHqww9lmtAv+w=', '', 1, 1, GETDATE(), 'AUTOMATION', '3SsPIaHkYgQdiMhgeRsMpA=='),
('GRANITECUSTODIAN', 'Token', 'qlL0OC2DjetOxQWFfaVHomADvFcjHqJsmRwCDly5SjArj7JRpAV5r3mAwPSBbn21ZpOtvv75Ht388lYtkTQJe3AYb6XrSPU7w26SB+TU9230WeCGpBouYdMSiZbva3v7E3DU4TVpFDn5o8vxKtDLh8NLnyfNS4X0aY9hGWBoR0Wqsn1xuAm7bWQwtzT74sl1XVM69BQYYyglDLD10sZykvCC9aJOdkMUGWKNVY+7Ra1YznwLJskxqU4WR6dxo2y6', '', 1, 1, GETDATE(), 'AUTOMATION', '3SsPIaHkYgQdiMhgeRsMpA=='),
('GRANITECUSTODIAN', 'Stores', 'Approved,Draft', '', 0, 1, GETDATE(), 'AUTOMATION', null)
```

- Add GraniteScheduler UtilityApiUrl setting:
```sql
INSERT [dbo].[SystemSettings] ([Application], [Key], [Value], [Description], [ValueDataType], [isEncrypted], [isActive], [AuditDate], [AuditUser])
VALUES  ('GraniteScheduler', 'UtilityApiUrl', '', 'The UtilityAPI URL', 'string', 0, 1, GETDATE(), 'AUTOMATION')
```
- Add Utility API System Settings:
```sql
INSERT [dbo].[SystemSettings] ([Application], [Key], [Value], [Description], [ValueDataType], [isEncrypted], [isActive], [AuditDate], [AuditUser]) 
VALUES	('Granite.Utility', 'UserName', '', 'Username for the SMTP server', 'string', 0, 1, GETDATE(), 'AUTOMATION'),
		('Granite.Utility', 'Password', '', 'Password for the SMTP server', 'string', 1, 1, GETDATE(), 'AUTOMATION'),
		('Granite.Utility', 'Host', '', 'The address of the SMTP server', 'string', 0, 1, GETDATE(), 'AUTOMATION'),
		('Granite.Utility', 'Port', '', 'Port number to be used when accessing the SMTP server', 'string', 0, 1, GETDATE(), 'AUTOMATION'),
		('Granite.Utility', 'EnableSsl', 'true', 'Use SSL when accessing the SMTP server. True or False', 'bool', 0, 1, GETDATE(), 'AUTOMATION'),
		('Granite.Utility', 'From', '', 'Email address that will be used to send mail', 'string', 0, 1, GETDATE(), 'AUTOMATION'),
		('Granite.Utility', 'FromName', '', 'The sender name that will display to users who receive emails', 'string', 0, 1, GETDATE(), 'AUTOMATION'),
		('Granite.Utility', 'RetryInterval', '15', 'Number of seconds to wait before retrying processing an email', 'int', 0, 1, GETDATE(), 'AUTOMATION'),
		('Granite.Utility', 'MaxNumberOfRetries', '3', 'Maximum number of times to retry processing an email', 'int', 0, 1, GETDATE(), 'AUTOMATION'),
		('Granite.Utility', 'EmailAttachmentFolder', '', 'Full filepath to folder to export email attachments to. Leave empty to use the Utility API install folder', 'string', 0, 1, GETDATE(), 'AUTOMATION'),
		('Granite.Utility', 'SSRSWebServiceUrl', '', 'URL for SSRS Report Server', 'string', 0, 1, GETDATE(), 'AUTOMATION')
```

- QuickBooks Integration
```sql
INSERT INTO SystemSettings ([Application], [Key], [Value], [Description], [ValueDataType], [isEncrypted], [isActive], [AuditDate], [AuditUser]) 
VALUES	
(N'IntegrationQuickBooks', N'QuickBooksCompanyFile', N'', N'File path to the QuickBooks company file', N'string', 0, 1, GETDATE(), N'AUTOMATION'),
(N'IntegrationQuickBooks', N'MasterItemSyncEnable', N'false', N'Enables syncing MasterItems from QuickBooks to Granite', N'bool', 0, 1, GETDATE(), N'AUTOMATION'),
(N'IntegrationQuickBooks', N'MasterItemSyncInterval', N'300', N'Interval to sync MasterItems at. Measured in seconds', N'int', 0, 1, GETDATE(), N'AUTOMATION'),
(N'IntegrationQuickBooks', N'MasterItemSyncInventoryItems', N'true', N'Enable or disable syncing Inventory Items', N'bool', 0, 1, GETDATE(), N'AUTOMATION'),
(N'IntegrationQuickBooks', N'MasterItemSyncAssemblyItems', N'true', N'Enable or disable syncing Assembly Items', N'bool', 0, 1, GETDATE(), N'AUTOMATION'),
(N'IntegrationQuickBooks', N'MasterItemSyncServiceItems', N'true', N'Enable or disable syncing Service Items', N'bool', 0, 1, GETDATE(), N'AUTOMATION'),
(N'IntegrationQuickBooks', N'SalesOrderSyncEnable', N'false', N'Enables syncing Sales Orders from QuickBooks to Granite', N'bool', 0, 1, GETDATE(), N'AUTOMATION'),
(N'IntegrationQuickBooks', N'SalesOrderSyncInterval', N'300', N'Interval to sync Sales Orders at. Measured in seconds', N'int', 0, 1, GETDATE(), N'AUTOMATION'),
(N'IntegrationQuickBooks', N'SalesOrderPrefix', N'', N'Prefix that will be applied to Sales Order numbers when they are synced to Granite.', N'string', 0, 1, GETDATE(), N'AUTOMATION'),
(N'IntegrationQuickBooks', N'SalesOrderAfterHeaderSyncProcedure', N'', N'Name of stored procedure that will run after each SalesOrder header is synced to Granite', N'string', 0, 1, GETDATE(), N'AUTOMATION'),
(N'IntegrationQuickBooks', N'InvoiceSyncEnable', N'false', N'Enables syncing Invoices from QuickBooks to Granite', N'bool', 0, 1, GETDATE(), N'AUTOMATION'),
(N'IntegrationQuickBooks', N'InvoiceSyncInterval', N'300', N'Interval to sync Invoices at. Measured in seconds', N'int', 0, 1, GETDATE(), N'AUTOMATION'),
(N'IntegrationQuickBooks', N'InvoicePrefix', N'', N'Prefix that will be applied to Invoice numbers when they are synced to Granite.', N'string', 0, 1, GETDATE(), N'AUTOMATION'),
(N'IntegrationQuickBooks', N'InvoiceAfterHeaderSyncProcedure', N'', N'Name of stored procedure that will run after each Invoice header is synced to Granite', N'string', 0, 1, GETDATE(), N'AUTOMATION'),
(N'IntegrationQuickBooks', N'PurchaseOrderSyncEnable', N'false', N'Enables syncing Purchase Orders from QuickBooks to Granite', N'bool', 0, 1, GETDATE(), N'AUTOMATION'),
(N'IntegrationQuickBooks', N'PurchaseOrderSyncInterval', N'300', N'Interval to sync Purchase Orders at. Measured in seconds', N'int', 0, 1, GETDATE(), N'AUTOMATION'),
(N'IntegrationQuickBooks', N'PurchaseOrderPrefix', N'', N'Prefix that will be applied to Purchase Order numbers when they are synced to Granite.', N'string', 0, 1, GETDATE(), N'AUTOMATION'),
(N'IntegrationQuickBooks', N'PurchaseOrderAfterHeaderSyncProcedure', N'', N'Name of stored procedure that will run after each PurchaseOrder header is synced to Granite', N'string', 0, 1, GETDATE(), N'AUTOMATION'),
(N'IntegrationQuickBooks', N'TradingPartnerSyncEnable', N'false', N'Enables syncing TradingPartners from QuickBooks to Granite', N'bool', 0, 1, GETDATE(), N'AUTOMATION'),
(N'IntegrationQuickBooks', N'TradingPartnerSyncInterval', N'300', N'Interval to sync TradingPartners at. Measured in seconds', N'int', 0, 1, GETDATE(), N'AUTOMATION')

```


#### Changed Data

##### Users
- Add AllowProcessCatalog permission

##### DefaultReplenishProcess

- Add NoEntities step

##### SystemSettings
- Removed GraniteScheduler settings:
    - Host
    - Port
    - EnableSsl
    - EmailAddress
    - Username
    - Password
    - DisplayName
    - TimeZone
- All password settings isEncrypted = true

##### ApplicationGrids
- Added missing document fields to grids
- Remove SystemSettings grid

### AccpacIntegration

#### Changed Views

##### Integration_Accpac_AutoSimplyMODetail
```sql
CREATE VIEW [dbo].[Integration_Accpac_AutoSimplyMODetail] AS
SELECT	MOUNIQ Document_ERPIdentification,
		[ITEMNO] MasterItem_ERPIdentification, 
		0 ERPIdentification,
		0 LineNumber, 
		[ORDQTYUM] UOMQty, 
		[ORDQTY] Qty, 
		[STKUOM] UOM, 
		1 UOMConversion,
		RTRIM(LTRIM(AREACD)) ToLocation,
		'' FromLocation,
		0 Completed,
		'OUTPUT' [Type],
		[COMMENTS] as Instruction,
		[ITEMDESC] as Comment
FROM [$(AccpacDatabase)].dbo.[MFORDH] WITH (NOLOCK)
UNION ALL
SELECT  MOUNIQ Document_ERPIdentification,
		[COMPID] MasterItem_ERPIdentification, 
		LINENUM ERPIdentification,
		LINENUM LineNumber, 
		[REQQTY] UOMQty, 
		[REQQTY] Qty, 
		[COMPUOM] UOM, 
		1 UOMConversion,
		'' ToLocation,
		RTRIM(LTRIM([LOCATION])) FromLocation, 		
		0 Completed,
		'INPUT' as [Type],
		'' as Instruction,
		[COMPDESC] as Comment
FROM [$(AccpacDatabase)].dbo.[MFORDD] WITH (NOLOCK)
```

##### Integration_Accpac_InternalUsageDetail
```sql
CREATE VIEW [dbo].[Integration_Accpac_InternalUsageDetail] AS
SELECT	[SEQUENCENO] Document_ERPIdentification,
		[LINENO] ERPIdentification, 
		[LINENO] LineNumber,
		[LOCATION] FromLocation, 
		QUANTITY Qty, 
		ITEMNO MasterItem_ERPIdentification,
		SUBSTRING(COMMENTS, 1, 50) Comment
FROM [$(AccpacDatabase)].dbo.[ICICED] 
```

##### Integration_Accpac_IntransitDetail
```sql
CREATE VIEW [dbo].[Integration_Accpac_IntransitDetail] as
SELECT	[LINENO] LineNumber,
		[LINENO] ERPIdentification, 
		RTRIM(FROMLOC) FromLocation, 
		RTRIM(TOLOC) ToLocation, 
		RTRIM(GITLOC) IntransitLocation, 
		QTYREQ Qty, 
		RTRIM(ITEMNO) MasterItem_ERPIdentification, 
		RTRIM(COMMENTS) Comment,
		[ICTREH].[TRANFENSEQ] Document_ERPIdentification
FROM [$(AccpacDatabase)].dbo.[ICTRED] with (nolock) INNER JOIN 
[$(AccpacDatabase)].dbo.[ICTREH] with (NOLOCK) ON [ICTRED].[TRANFENSEQ] = [ICTREH].[TRANFENSEQ]
WHERE [ICTREH].DOCTYPE = 2
```

##### Integration_Accpac_PurchaseOrderDetail
```sql
CREATE VIEW [dbo].[Integration_Accpac_PurchaseOrderDetail] as
SELECT  PORLREV LineNumber, 
		[SQORDERED] Qty, 
		RTRIM([ORDERUNIT]) UOM, 
		[ORDERCONV] UOMConversion,
		[OQORDERED] UOMQty, 
		RTRIM([LOCATION]) ToLocation,
		CASE WHEN [COMPLETION] < 2 THEN 0 ELSE 1 END Completed, 
		RTRIM([ITEMNO]) MasterItem_ERPIdentification, 
		ROUND(UNITCOST,2) UnitValue,
		PORHSEQ Document_ERPIdentification,
		PORLREV ERPIdentification
FROM [$(AccpacDatabase)].dbo.[POPORL] WITH (NOLOCK)
WHERE STOCKITEM = 1
```

##### Integration_Accpac_ReceiptDetail
```sql
CREATE VIEW [dbo].[Integration_Accpac_ReceiptDetail] as
SELECT	[LINENO] LineNumber,
		[LINENO] ERPIdentification, 
		RTRIM(FROMLOC) FromLocation, 
		RTRIM(TOLOC) ToLocation, 
		RTRIM(GITLOC) IntransitLocation, 
		QTYTRA Qty, 
		RTRIM(ITEMNO) MasterItem_ERPIdentification, 
		RTRIM(COMMENTS) Comment,
		[ICTREH].[TRANFENSEQ] Document_ERPIdentification
FROM [$(AccpacDatabase)].dbo.[ICTRED] with (nolock) INNER JOIN 
[$(AccpacDatabase)].dbo.[ICTREH] with (NOLOCK) ON [ICTRED].[TRANFENSEQ] = [ICTREH].[TRANFENSEQ] LEFT JOIN
[$(AccpacDatabase)].dbo.[ICTRID] with (nolock) ON [ICTRED].DETAILNUM = [ICTRID].DETAILNUM AND [ICTREH].FROMNUM = [ICTRID].DOCNUM
WHERE [ICTREH].DOCTYPE = 3
```

##### Integration_Accpac_SalesOrderDetail
```sql
CREATE VIEW [dbo].[Integration_Accpac_SalesOrderDetail] as
SELECT  ORDUNIQ Document_ERPIdentification,
		LINENUM [LineNumber], 
		LINENUM ERPIdentification, 
		([UNITCONV] * ([QTYORDERED]+[QTYSHPTODT])) UOMQty, 
		[QTYORDERED]+[QTYSHPTODT] Qty, 
		RTRIM([ORDUNIT]) UOM, 
		[UNITCONV] UOMConversion,
		RTRIM([LOCATION]) FromLocation, 
		RTRIM([ITEM]) MasterItem_ERPIdentification, 
		CASE WHEN [COMPLETE] < 2 THEN 0 ELSE 1 END  Completed
FROM [$(AccpacDatabase)].dbo.[OEORDD] WITH (NOLOCK)
WHERE STOCKITEM = 1
```

##### Integration_Accpac_TransferDetail
```sql
CREATE VIEW [dbo].[Integration_Accpac_TransferDetail] as
SELECT	[LINENO] LineNumber, 
		RTRIM(FROMLOC) FromLocation, 
		RTRIM(TOLOC) ToLocation, 
		RTRIM(GITLOC) IntransitLocation, 
		QTYREQ Qty, 
		RTRIM(ITEMNO) MasterItem_ERPIdentification, 
		RTRIM(COMMENTS) Comment,
		[ICTREH].[TRANFENSEQ] Document_ERPIdentification,
		[LINENO] ERPIdentification
FROM [$(AccpacDatabase)].dbo.[ICTRED] with (nolock) INNER JOIN 
[$(AccpacDatabase)].dbo.[ICTREH] with (NOLOCK) ON [ICTRED].[TRANFENSEQ] = [ICTREH].[TRANFENSEQ]
WHERE [ICTREH].DOCTYPE = 1
```

##### MasterItemAlias_View

```sql
ALTER VIEW [dbo].[MasterItemAlias_View]

	AS 
SELECT ROW_NUMBER() OVER (ORDER BY [$(GraniteDatabase)].dbo.MasterItem.ID) AS ID, 
CAST([$(AccpacDatabase)].dbo.ICIOTH.MANITEMNO as varchar(16)) COLLATE SQL_Latin1_General_CP1_CI_AS AS Code, 
CAST([$(AccpacDatabase)].dbo.ICUNIT.UNIT as varchar(16)) COLLATE SQL_Latin1_General_CP1_CI_AS AS UOM, 
[$(AccpacDatabase)].dbo.ICUNIT.CONVERSION AS Conversion, CAST(1 as bit)as IsActive, 
GETDATE() as AuditDate, '' as AuditUser, 
[$(GraniteDatabase)].dbo.MasterItem.ID AS MasterItem_id,NULL as ERPIdentification,0 as Version
FROM         [$(AccpacDatabase)].dbo.ICIOTH RIGHT OUTER JOIN
                      [$(AccpacDatabase)].dbo.ICUNIT ON [$(AccpacDatabase)].dbo.ICIOTH.UNIT COLLATE SQL_Latin1_General_CP1_CI_AS = [$(AccpacDatabase)].dbo.ICUNIT.UNIT AND 
                      [$(AccpacDatabase)].dbo.ICIOTH.ITEMNO COLLATE SQL_Latin1_General_CP1_CI_AS = [$(AccpacDatabase)].dbo.ICUNIT.ITEMNO RIGHT OUTER JOIN
                      [$(GraniteDatabase)].dbo.MasterItem RIGHT OUTER JOIN
                      [$(AccpacDatabase)].dbo.ICITEM ON [$(GraniteDatabase)].dbo.MasterItem.Code COLLATE SQL_Latin1_General_CP1_CI_AS = [$(AccpacDatabase)].dbo.ICITEM.ITEMNO ON 
                      [$(AccpacDatabase)].dbo.ICUNIT.ITEMNO COLLATE SQL_Latin1_General_CP1_CI_AS = [$(AccpacDatabase)].dbo.ICITEM.ITEMNO
WHERE     ([$(GraniteDatabase)].dbo.MasterItem.ID IS NOT NULL) AND ([$(AccpacDatabase)].dbo.ICIOTH.MANITEMNO IS NOT NULL)
UNION
SELECT  * FROM [$(GraniteDatabase)].dbo.MasterItemAlias
GO
```

#### Changed Stored Procedures
##### IntegrationProcessTransfer
```sql
ALTER PROCEDURE [dbo].[IntegrationProcessTransfer]
	-- Add the parameters for the stored procedure here

AS
BEGIN
    SET NOCOUNT ON;
	DECLARE @Debug Bit = 0
	DECLARE @DocumentNumber varchar(30)
	DECLARE @Document_id bigint
	DECLARE @TradingPartner_id bigint
	DECLARE @TradingPartnerCode varchar(20)
	DECLARE @TradingPartnerDescription varchar(60)
	DECLARE @AccpacReference varchar(60) = ''
	DECLARE @TradingPartnerReferenceNumber varchar(30) = ''
	DECLARE @ToLocation varchar(50) = ''
	DECLARE @Description varchar(60)
	DECLARE @Priority int
	DECLARE @ERPLocation varchar(15)
	DECLARE @Site varchar(30) = ''  --Code required to determine the SITE
	DECLARE @User varchar(20) = 'INTEGRATION'
	DECLARE @Date datetime = GETDATE()
	DECLARE @DocumentType varchar(30) = 'TRANSFER'
	DECLARE @AccpacType int
	DECLARE @Status varchar(30)
	DECLARE @ErrorMessage NVARCHAR(4000) = NULL
	DECLARE @ErrorSeverity INT
	DECLARE @ErrorState INT
	DECLARE @ExpectedShipDate DateTime
	DECLARE @ORDUNIQ DECIMAL(19,0)
	DECLARE @GraniteOrderStatus varchar(20)
	DECLARE @GraniteDocumentType varchar(20)
	DECLARE @ACCPAC_FROMNUM VARCHAR(250)
	DECLARE @COMMENTS VARCHAR(250)
	DECLARE @LINE VARCHAR(250)
	DECLARE @DETAILNUM VARCHAR(250)
	DECLARE @FROMLOC VARCHAR(250)
	DECLARE @TOLOC VARCHAR(250)
	DECLARE @GITLOC VARCHAR(250)
	DECLARE @ACCPAC_QTYREC DECIMAL(9,4)
	DECLARE @ACCPAC_QUANTITY DECIMAL (9,4)
	DECLARE @ACCPAC_QTYTRA DECIMAL (9,4)
	DECLARE @ITEMNO VARCHAR(250)
	DECLARE @ITEMID bigint
	DECLARE @GRANITELINEID bigint

	--Declare cursor for all Documents to be integrated.

	DECLARE IntegrationQueueCursor CURSOR FOR
	SELECT   ERP_id , [DocumentType] FROM [$(GraniteDatabase)].dbo.IntegrationDocumentQueue 
	WHERE [Status] = 'ENTERED' AND [DocumentType] IN ('TRANSFER','INTRANSIT','RECEIPT')

	OPEN IntegrationQueueCursor
	FETCH NEXT FROM IntegrationQueueCursor
	INTO @ORDUNIQ, @DocumentType

	WHILE @@FETCH_STATUS = 0
	BEGIN
		
		UPDATE [$(GraniteDatabase)].dbo.IntegrationDocumentQueue 
		SET [Status] = 'POSTING', IntegrationDateTime = getdate()
		WHERE [Status] = 'ENTERED' AND [DocumentType] IN ('TRANSFER','INTRANSIT','RECEIPT') and ERP_id = @ORDUNIQ


		SELECT @DocumentNumber = RTRIM(LTRIM([DOCNUM])) collate Latin1_General_CI_AS, 
        @Description = HDRDESC collate Latin1_General_CI_AS, 
		@AccpacReference = REFERENCE  collate Latin1_General_CI_AS,
		@ACCPAC_FROMNUM = FROMNUM collate Latin1_General_CI_AS,
		@ExpectedShipDate = CASE WHEN EXPARDATE = 0 THEN '' ELSE CONVERT(DateTime,CONVERT(varchar(10),EXPARDATE)) END,
        @Status = 'ENTERED'
		FROM [$(AccpacDatabase)].dbo.[ICTREH] with (NOLOCK)
		WHERE TRANFENSEQ = @ORDUNIQ

		IF @Debug = 1
			PRINT 'IN Cursor -Record found:' + @DocumentNumber

				BEGIN TRY
					BEGIN TRANSACTION
					IF @Debug = 1
						PRINT 'In Try and Transaction block'

					SELECT TOP 1  @ERPLocation = [FROMLOC], @ToLocation = [TOLOC] 
					FROM [$(AccpacDatabase)].dbo.[ICTRED] with (Nolock) 
					WHERE [TRANFENSEQ] = @ORDUNIQ
					
					IF @DocumentType = 'RECEIPT'		--If the Document is a Receipt then set the ERPLocation to the TOLocation
						SELECT @ERPLocation = @ToLocation
	
					
					SELECT @TradingPartnerCode = @ERPLocation
					SELECT @TradingPartnerDescription = 'TRANSFER TO WHSE:' + isnull(@TradingPartnerCode,'') + ' TO WHSE:' + isnull(@ToLocation,'')

					-- Insert TradingPartner
					SELECT @TradingPartner_id = ID FROM [$(GraniteDatabase)].dbo.TradingPartner WHERE Code = @TradingPartnerCode AND DocumentType = @DocumentType
					IF ISNULL(@TradingPartner_id,'') = ''
					BEGIN
						INSERT INTO [$(GraniteDatabase)].dbo.TradingPartner
						(Code, Description, DocumentType, isActive, AuditDate, AuditUser)
						VALUES
						(@TradingPartnerCode, @TradingPartnerDescription, @GraniteDocumentType, 1, GETDATE(), @User)
					END

					--======Update the Document Header table or insert the Document Header accordingly
					IF EXISTS(SELECT ID FROM [$(GraniteDatabase)].dbo.Document WHERE Number = @DocumentNumber)
					BEGIN
				
						UPDATE [$(GraniteDatabase)].dbo.Document SET ERPLocation = @ERPLocation, [Site] = @Site, 
						TradingPartnerCode = @TradingPartnerCode, TradingPartnerDescription = @TradingPartnerDescription,
						AuditDate = @Date, AuditUser = @User ,[Description] =  @ACCPAC_FROMNUM + '--'+ @Description
						WHERE Number = @DocumentNumber
				
						SELECT @Document_id = ID , @GraniteOrderStatus = [Status] FROM [$(GraniteDatabase)].dbo.Document 
						WHERE Number = @DocumentNumber

						IF @Status IN ('ONHOLD','COMPLETE','CANCELLED')
							UPDATE [$(GraniteDatabase)].dbo.Document SET [Status] = @Status,ExpectedDate = @ExpectedShipDate
							WHERE ID = @Document_id
						IF @Status = 'ENTERED' and @GraniteOrderStatus NOT IN ('RELEASED','COMPLETE')
							UPDATE [$(GraniteDatabase)].dbo.Document SET [Status] = @Status, ExpectedDate = @ExpectedShipDate
							WHERE ID = @Document_id

					END
					ELSE
					BEGIN
						INSERT INTO [$(GraniteDatabase)].dbo.Document (Number,[Description],CreateDate,TradingPartnerCode, TradingPartnerDescription, ERPLocation,[Site],
						AuditDate,AuditUser,[Type],[Status],ExpectedDate,isActive)
						SELECT @DocumentNumber,  @ACCPAC_FROMNUM + '--'+ @Description, @Date, @TradingPartnerCode, @TradingPartnerDescription, @ERPLocation, @Site, 
						@Date, @User, @DocumentType, @Status ,@ExpectedShipDate,1

						SELECT  @Document_id = (SELECT ID FROM [$(GraniteDatabase)].dbo.Document WHERE Number = @DocumentNumber)
						IF @Debug = 1
							PRINT @Document_id

					END
					--=======End DOcument Header Section===============================================	

					--=====Start Inserting or Updaing the items depending on whether they exists or not

					IF ISNULL(@Document_id,'') <> ''
					BEGIN
						--Update Existing Granite Lines
						--We know these Lines Exist Because of the Inner Join
                        DECLARE detail CURSOR FOR
                        SELECT [LINENO], DETAILNUM, FROMLOC, TOLOC, GITLOC, QTYREQ, QUANTITY, ITEMNO,COMMENTS  
						FROM [$(AccpacDatabase)].dbo.[ICTRED] with (nolock) 
						WHERE  [TRANFENSEQ] = @ORDUNIQ
                        OPEN detail;

                        FETCH NEXT FROM detail 
                        INTO @LINE, @DETAILNUM, @FROMLOC, @TOLOC, @GITLOC, @ACCPAC_QTYREC, @ACCPAC_QUANTITY, @ITEMNO, @COMMENTS;
                        WHILE @@FETCH_STATUS = 0
                        BEGIN

                        /*GET GRANITE ITEM ID*/
                        SELECT @ITEMID = ID FROM [$(GraniteDatabase)].dbo.MasterItem WHERE FORMATTEDCODE = @ITEMNO
                    
                        SELECT @GRANITELINEID = ID FROM [$(GraniteDatabase)].dbo.[DocumentDetail] 
						WHERE DOCUMENT_ID = @Document_id AND ITEM_ID = @ITEMID AND LineNumber = @LINE
                    
                        IF ISNULL(@GRANITELINEID, 0) = 0
                        BEGIN
                            IF @DocumentType = 'RECEIPT'
                            BEGIN
								-- Fetch qty from Table ICTRID, based on TRANSFER (FROMNUM = @ACCPAC_FROMNUM)
								-- QTYTRA = Quantity Transfer to Date
							
								SELECT @ACCPAC_QTYTRA = QTYTRA
								FROM  [$(AccpacDatabase)].dbo.ICTRID with (nolock)
								WHERE (DOCNUM = @ACCPAC_FROMNUM) AND (DETAILNUM = @DETAILNUM)

                                --RECEIPT use QUANTITY this is the transfer qty instead of the requested original qty, can only receipt what was actual transfer
                                --The from location becomes the transit location, I leave the transit no need in granite
                                --@ACCPAC_QUANTITY
                                INSERT INTO [$(GraniteDatabase)].dbo.[DocumentDetail] 
                                    (ITEM_ID, [COMMENT], LINENUMBER, FROMLOCATION, TOLOCATION, IntransitLocation, QTY, 
                                    DOCUMENT_ID, ActionQty, Completed, AuditDate, AuditUser)
                                        values (@ITEMID, SUBSTRING(@COMMENTS,1,50), @LINE, @FROMLOC, @TOLOC, @GITLOC, 
										@ACCPAC_QTYTRA, @Document_id, 0, 0,  GETDATE(),@User)
                            END
                            ELSE
                            BEGIN
                                --@ACCPAC_QTYREC
                                INSERT INTO [$(GraniteDatabase)].dbo.[DocumentDetail] 
                                (ITEM_ID, [COMMENT], LINENUMBER, FROMLOCATION, TOLOCATION, IntransitLocation, QTY, 
                                DOCUMENT_ID, ActionQty, Completed, AuditDate, AuditUser)
                                    values (@ITEMID, SUBSTRING(@COMMENTS,1,50), @LINE, RTRIM(@FROMLOC), RTRIM(@TOLOC), RTRIM(@GITLOC), 
									@ACCPAC_QTYREC, @Document_id, 0, 0,  GETDATE(), @User)
                            END
                        END
                        ELSE
                        BEGIN
                            UPDATE [$(GraniteDatabase)].dbo.[DocumentDetail] SET
                            [Qty] = @ACCPAC_QTYREC, Completed = 0, ToLocation = RTRIM(@TOLOC), IntransitLocation = RTRIM(@GITLOC),
                            [FromLocation] = RTRIM(@FROMLOC), AuditDate = GETDATE(), AuditUser = @User
                            WHERE [$(GraniteDatabase)].dbo.[DocumentDetail].[ID] = @GRANITELINEID
                        END
                        FETCH NEXT FROM detail 
                        INTO @LINE, @DETAILNUM, @FROMLOC, @TOLOC, @GITLOC, @ACCPAC_QTYREC, @ACCPAC_QUANTITY, @ITEMNO,@COMMENTS;
                        END
                        CLOSE detail;
                        DEALLOCATE detail;
						
                        UPDATE [$(GraniteDatabase)].dbo.DocumentDetail SET MultipleEntries = 1 
                        WHERE Document_id = @Document_id AND Item_id IN (SELECT DISTINCT Item_id FROM [$(GraniteDatabase)].dbo.DocumentDetail GROUP BY Document_id, Item_id HAVING Document_id = @Document_id AND COUNT(ID) > 1)

					END
					UPDATE [$(GraniteDatabase)].dbo.IntegrationDocumentQueue 
					SET [Status] = 'POSTED', IntegrationDateTime = getdate()
					WHERE [Status] = 'POSTING' and ERP_id = @ORDUNIQ

			END TRY

			BEGIN CATCH
				SELECT @ErrorMessage = ERROR_MESSAGE(), @ErrorSeverity = ERROR_SEVERITY(), @ErrorState = ERROR_STATE();
				RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
				IF @Debug = 1
					PRINT @ErrorMessage

				IF @@TRANCOUNT > 0
					ROLLBACK TRANSACTION;

			END CATCH

			IF @@TRANCOUNT > 0
				COMMIT TRANSACTION;

		FETCH NEXT FROM IntegrationQueueCursor
		INTO @ORDUNIQ, @DocumentType
	END
	CLOSE IntegrationQueueCursor
	DEALLOCATE IntegrationQueueCursor
	
END  --Stored Procedure

GO
```


### PastelEvoIntegration

#### New Views
##### Integration_Evolution_InterBranchRequisitionHeader
```sql
CREATE VIEW [Integration_Evolution_InterBranchRequisitionHeader] AS
SELECT	CAST(IDWhseIBT as varchar) ERPIdentification, 
		[cIBTNumber] Number, 
		[cIBTDescription] [Description], 
		CASE iIBTStatus 
			WHEN 3 THEN 'ENTERED' 
			WHEN 4 THEN 'RELEASED'
			ELSE 'COMPLETE' 
		END [Status], 
		WhseMst.Code ERPLocation,
		'INTRANSIT' [Type], 
		'' as [Site], 
		GETDATE() as CreateDate
FROM [$(PastelEvoDatabase)].dbo._etblWhseIBT INNER JOIN
[$(PastelEvoDatabase)].dbo.WhseMst ON _etblWhseIBT.iWhseIDFrom = WhseMst.WhseLink
WHERE iIBTStatus IN (3, 4, 5)
```

##### Integration_Evolution_InterBranchRequisitionDetail
```sql
CREATE VIEW [Integration_Evolution_InterBranchRequisitionDetail] as
SELECT	CAST(IDWhseIBTLines as varchar) ERPIdentification, 
		CAST(ROW_NUMBER() OVER (PARTITION BY iWhseIBTID ORDER BY IDWhseIBTLines ASC) as varchar) LineNumber,  
		CAST(iWhseIBTID as varchar) Document_ERPIdentification, 
		fQtyRequired Qty, 
		WhseMst.Code FromLocation, 
		WhseMst_2.Code IntransitLocation, 
		WhseMst_3.Code ToLocation, 
		cLotNumber Batch, 
		CAST(iStockID as varchar) MasterItem_ERPIdentification
FROM [$(PastelEvoDatabase)].dbo.[_etblWhseIBTLines] WITH (NOLOCK) INNER JOIN
[$(PastelEvoDatabase)].dbo.StkItem ON iStockID = StkItem.StockLink INNER JOIN
[$(PastelEvoDatabase)].dbo.[_etblWhseIBT] ON iWhseIBTID = _etblWhseIBT.IDWhseIBT LEFT JOIN 
[$(PastelEvoDatabase)].dbo.WhseMst ON _etblWhseIBT.iWhseIDFrom = WhseMst.WhseLink LEFT JOIN
[$(PastelEvoDatabase)].dbo.WhseMst WhseMst_2 ON _etblWhseIBT.iWhseIDIntransit = WhseMst_2.WhseLink LEFT JOIN
[$(PastelEvoDatabase)].dbo.WhseMst WhseMst_3 ON _etblWhseIBT.iWhseIDTo = WhseMst_3.WhseLink	
WHERE iIBTStatus IN (3, 4, 5)
```

#### New trigger
##### TriggerGraniteInterBranchRequisition
```sql
GO
USE [$(PastelEVODatabase)]
GO

CREATE TRIGGER [dbo].[TriggerGraniteInterBranchRequisition]
   ON  [$(PastelEVODatabase)].[dbo].[_etblWhseIBT]
   AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

	DECLARE @Site varchar(30) = ''  
	DECLARE @ErrorMessage NVARCHAR(4000) = NULL
	DECLARE @ErrorSeverity INT
	DECLARE @ErrorState INT


	BEGIN TRY
	BEGIN TRANSACTION	
		INSERT INTO [$(GraniteDatabase)].dbo.IntegrationDocumentQueue (ERP_id,DocumentNumber,DocumentType,[Status],LastUpdateDateTime)
		SELECT IDWhseIBT, RTRIM(LTRIM([cIBTNumber])) collate Latin1_General_CI_AS, 'REQUISITION','ENTERED',getdate()
		FROM Inserted
		WHERE iIBTStatus IN (3,4,5)
		AND NOT EXISTS(SELECT ID FROM [$(GraniteDatabase)].dbo.IntegrationDocumentQueue 
		WHERE DocumentNumber = RTRIM(LTRIM([cIBTNumber])) collate Latin1_General_CI_AS 
		AND IntegrationDocumentQueue.[Status] = 'ENTERED' AND ERP_id = IDWhseIBT)
	END TRY

	BEGIN CATCH
		SELECT @ErrorMessage = ERROR_MESSAGE(), @ErrorSeverity = ERROR_SEVERITY(), @ErrorState = ERROR_STATE();
		RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);

		IF @@TRANCOUNT > 0
		BEGIN 
			ROLLBACK TRANSACTION;
		END
	END CATCH
	
	IF @@TRANCOUNT > 0
	BEGIN 
		COMMIT TRANSACTION;
	END


END 
```

## August (4.5.1.0)
### GraniteDatabase
---
#### New Views
##### Datagrid_StockAvailable
```sql 
CREATE VIEW [dbo].[DataGrid_StockAvailable]
AS
SELECT DISTINCT MasterItem.ID AS MasterItemId, 
       Code AS MasterItemCode, 
	   Description AS MasterItemDescription,
	   MasterItem.Type,
	   MasterItem.Category,
	   UOM, 
	   CASE WHEN (SUM(Qty) OVER(PARTITION BY MasterItem.ID) - ISNULL(SalesOrderQty, 0.000) + ISNULL(PurchaseOrderQty, 0.000)) > 0
			THEN 'InStock'
			WHEN (SUM(Qty) OVER(PARTITION BY MasterItem.ID) - ISNULL(SalesOrderQty, 0.000) + ISNULL(PurchaseOrderQty, 0.000)) <= 0
			THEN 'NoStock'
			END AS Status
	   ,
	   SUM(Qty) OVER(PARTITION BY MasterItem.ID) AS QtyInWarehouse, 
	   ISNULL(SalesOrderQty, 0.000) AS QtyOnSalesOrders,
	   ISNULL(PurchaseOrderQty, 0.000) AS QtyOnPurchaceOrders,
	   (SUM(Qty) OVER(PARTITION BY MasterItem.ID) - ISNULL(SalesOrderQty, 0.000)) AS QtyAfterSales,
	   (SUM(Qty) OVER(PARTITION BY MasterItem.ID) + ISNULL(PurchaseOrderQty, 0.000)) AS QtyAfterPurchaces,
	   (SUM(Qty) OVER(PARTITION BY MasterItem.ID) - ISNULL(SalesOrderQty, 0.000) + ISNULL(PurchaseOrderQty, 0.000)) AS TotalQtyAvailable
FROM MasterItem LEFT JOIN 
	 TrackingEntity ON MasterItem.ID = TrackingEntity.MasterItem_id OUTER APPLY
	 (SELECT (SUM(Qty) - SUM(ActionQty)) AS SalesOrderQty
	  FROM DocumentDetail LEFT JOIN 
	       Document ON DocumentDetail.Document_id = Document.ID
	  WHERE Completed <> 1 AND
		    Cancelled <> 1 AND
			Document.Status in ('ENTERED', 'RELEASED') AND 
			DocumentDetail.Item_id = MasterItem.ID AND 
		    Document.Type = 'ORDER'
	  GROUP BY Item_id) AS SalesOrders
	  OUTER APPLY
	 (SELECT (SUM(Qty) - SUM(ActionQty)) AS PurchaseOrderQty
	  FROM DocumentDetail LEFT JOIN 
	       Document ON DocumentDetail.Document_id = Document.ID
	  WHERE Completed <> 1 AND
		    Cancelled <> 1 AND
			Document.Status in ('ENTERED', 'RELEASED') AND 
			DocumentDetail.Item_id = MasterItem.ID AND 
		    Document.Type = 'RECEIVING'
	  GROUP BY Item_id) AS PurchaseOrders
WHERE MasterItem.isActive = 1 AND
	  Qty <> 0 AND 
	  TrackingEntity.InStock = 1
```
#### Changed Views

##### API_QueryTransactionsPickReversal
- Exclude packed items
```sql
ALTER VIEW [dbo].[API_QueryTransactionsPickReversal]
AS
SELECT dbo.[Transaction].ID, dbo.TrackingEntity.Barcode, dbo.MasterItem.Code, dbo.MasterItem.Description, CAST(dbo.[Transaction].Date AS Date) as Date, CAST(dbo.[Transaction].Date AS Time(0)) as Time, dbo.TrackingEntity.Batch, dbo.TrackingEntity.SerialNumber, dbo.TrackingEntity.ExpiryDate, dbo.[Transaction].FromQty, dbo.[Transaction].ToQty, dbo.[Transaction].ActionQty, dbo.Users.Name AS [User], dbo.[Transaction].DocumentReference, dbo.[Document].Number AS [Document], dbo.[Transaction].IntegrationStatus, 
         dbo.CarryingEntity.Barcode AS Pallet, dbo.[Transaction].Comment, L1.Name AS FromLocation, L2.Name AS ToLocation, L3.Site, dbo.[Transaction].Type, dbo.[Transaction].IntegrationReference, dbo.[Transaction].ReversalTransaction_id, dbo.[Document].TradingPartnerCode, dbo.[Document].TradingPartnerDescription, dbo.[Document].Status, dbo.DocumentDetail.LineNumber
FROM  dbo.[Transaction] INNER JOIN
         dbo.DocumentDetail ON dbo.[Transaction].DocumentLine_id = dbo.DocumentDetail.ID LEFT OUTER JOIN
         dbo.[Document] ON dbo.[Document].ID = dbo.[Transaction].Document_id LEFT OUTER JOIN
         dbo.CarryingEntity ON dbo.[Transaction].ContainableEntity_id = dbo.CarryingEntity.ID LEFT OUTER JOIN
         dbo.Location AS L1 ON dbo.[Transaction].FromLocation_id = L1.ID LEFT OUTER JOIN
         dbo.Location AS L2 ON dbo.[Transaction].ToLocation_id = L2.ID LEFT OUTER JOIN
         dbo.Users ON dbo.[Transaction].User_id = dbo.Users.ID FULL OUTER JOIN
         dbo.TrackingEntity LEFT OUTER JOIN
         dbo.Location AS L3 ON dbo.TrackingEntity.Location_id = L3.ID ON dbo.TrackingEntity.ID = dbo.[Transaction].TrackingEntity_id FULL OUTER JOIN
         dbo.MasterItem ON dbo.TrackingEntity.MasterItem_id = dbo.MasterItem.ID LEFT JOIN
		 dbo.[Transaction] T2 ON DocumentDetail.ID = T2.DocumentLine_id AND T2.[Type] = 'PACK'
WHERE (dbo.[Transaction].Type = 'PICK') AND ISNULL(dbo.[Transaction].ReversalTransaction_id, 0) = 0 AND ISNULL(dbo.[Transaction].IntegrationStatus, 0) = 0 AND T2.ID IS NULL
GO
```
##### API_QueryDocumentProgress
- Added Document.ID column
```sql
ALTER VIEW [dbo].[API_QueryDocumentProgress]
	AS 
SELECT DISTINCT  
         dbo.[Document].ID, dbo.[Document].Priority, dbo.[Document].ExpectedDate, dbo.[Document].Number, dbo.[Document].TradingPartnerCode AS TradingPartnerCode,dbo.[Document].TradingPartnerDescription AS TradingPartnerDescription, dbo.[Document].Description,dbo.[Document].ActionDate AS ActionDate, 
		 TSQL.DateStart AS Started, TSQL.DateStop AS Stopped, DATEDIFF(MI, TSQL.DateStart, TSQL.DateStop) AS Duration, 
		 TSQL3.Qty AS DocumentQty, 
		 TSQL3.ActionQty AS ActionQty, ISNULL(TSQL3.ActionQty / CAST(CASE WHEN TSQL3.Qty = 0 THEN 1 ELSE TSQL3.Qty END AS DECIMAL(38, 3)) * 100, 0.1) AS Progress, 
		 TSQL.[User] AS [User], 
		 dbo.[Document].ERPLocation AS Location, dbo.[Document].Site, dbo.[Document].Status, dbo.[Document].Type
FROM  dbo.[Document]  OUTER APPLY
             (SELECT MIN(dbo.[Transaction].Date) AS DateStart, MAX(dbo.[Transaction].Date) AS DateStop, MAX(dbo.Users.Name) [USER]
			   FROM   dbo.[Transaction]  INNER JOIN
			   Users ON [Transaction].User_id = Users.ID
			   WHERE Document_id = dbo.[Document].ID) AS TSQL CROSS APPLY
			 (SELECT ISNULL(SUM(DocumentDetail.Qty), 0) as Qty, ISNULL(SUM(DocumentDetail.ActionQty), 0) as ActionQty
				FROM DocumentDetail
				WHERE Document_id = Document.ID) TSQL3
WHERE (dbo.[Document].Status <> 'COMPLETE' OR AuditDate > getdate() - 14)
```


#### Changed Data

##### ApplicationGrids
- Add ID column to all Document Progress grids
- Fix Document / PickslipDocument grid
- Fix ImportTrackingEntity

##### Enquiry Grids
- Add StockAvailable grid

##### SystemSnippets
- Added snippets for all default Process templates

### AccpaccIntegration
---

#### Changed Views
##### MasterItemAlias_View
- Add columns
    - AuditDate
    - AuditUser
    - Version
    - ERPIdentification
- Add UNION to return results from MasterItemAlias table

```sql
ALTER VIEW [dbo].[MasterItemAlias_View]

	AS 
SELECT ROW_NUMBER() OVER (ORDER BY [$(GraniteDatabase)].dbo.MasterItem.ID) AS ID, 
CAST([$(AccpacDatabase)].dbo.ICIOTH.MANITEMNO as varchar(16)) COLLATE SQL_Latin1_General_CP1_CI_AS AS Code, 
CAST([$(AccpacDatabase)].dbo.ICUNIT.UNIT as varchar(16)) COLLATE SQL_Latin1_General_CP1_CI_AS AS UOM, 
[$(AccpacDatabase)].dbo.ICUNIT.CONVERSION AS Conversion, CAST(1 as bit)as IsActive, 
GETDATE() as AuditDate, '' as AuditUser, 
[$(GraniteDatabase)].dbo.MasterItem.ID AS MasterItem_id,NULL as ERPIdentification,0 as Version
FROM         [$(AccpacDatabase)].dbo.ICIOTH RIGHT OUTER JOIN
                      [$(AccpacDatabase)].dbo.ICUNIT ON [$(AccpacDatabase)].dbo.ICIOTH.UNIT COLLATE SQL_Latin1_General_CP1_CI_AS = [$(AccpacDatabase)].dbo.ICUNIT.UNIT AND 
                      [$(AccpacDatabase)].dbo.ICIOTH.ITEMNO COLLATE SQL_Latin1_General_CP1_CI_AS = [$(AccpacDatabase)].dbo.ICUNIT.ITEMNO RIGHT OUTER JOIN
                      [$(GraniteDatabase)].dbo.MasterItem RIGHT OUTER JOIN
                      [$(AccpacDatabase)].dbo.ICITEM ON [$(GraniteDatabase)].dbo.MasterItem.Code COLLATE SQL_Latin1_General_CP1_CI_AS = [$(AccpacDatabase)].dbo.ICITEM.ITEMNO ON 
                      [$(AccpacDatabase)].dbo.ICUNIT.ITEMNO COLLATE SQL_Latin1_General_CP1_CI_AS = [$(AccpacDatabase)].dbo.ICITEM.ITEMNO
WHERE     ([$(GraniteDatabase)].dbo.MasterItem.ID IS NOT NULL) AND ([$(AccpacDatabase)].dbo.ICIOTH.MANITEMNO IS NOT NULL)
UNION
SELECT  * FROM ([$(GraniteDatabase)].dbo.MasterItemAlias
```

#### Changed Stored Procedures

##### IntegrationProcessPurchaseOrder
- Map ExpectedArrivalDate to ExpectedDate instead of ActionDate

##### IntegrationProcessSalesOrder
- Map ExpectedShipDate to ExpectedDate instead of ActionDate

##### IntegrationProcessTransfer
- Map ExpectedShipDate to ExpectedDate instead of ActionDate

### EvolutionIntegration
---
#### Changed Views
##### MasterItemAlias_View
- Add columns
    - AuditDate
    - AuditUser
    - Version
    - ERPIdentification
- Add UNION to return results from MasterItemAlias table

```sql
ALTER VIEW [dbo].[MasterItemAlias_View]
	AS 
SELECT  ROW_NUMBER() OVER (ORDER BY [$(GraniteDatabase)].dbo.MasterItem.ID) AS ID,
        [$(PastelEVODatabase)].dbo.StkItem.Code + [$(PastelEVODatabase)].dbo._etblUnits.cUnitCode AS Code, 
        [$(PastelEVODatabase)].dbo._etblUnits.cUnitCode AS UOM, 
        [$(PastelEVODatabase)].dbo._etblUnitConversion.fUnitBQty AS Conversion, 1 AS IsActive, 
        [$(GraniteDatabase)].dbo.MasterItem.ID as MasterItem_id,
        GETDATE() as AuditDate, '' as AuditUser, 0 as Version, 
        NULL as ERPIdentification
FROM         [$(PastelEVODatabase)].dbo._etblUnits INNER JOIN
                      [$(PastelEVODatabase)].dbo._etblUnitConversion ON [$(PastelEVODatabase)].dbo._etblUnits.idUnits = [$(PastelEVODatabase)].dbo._etblUnitConversion.idUnitConversion INNER JOIN
                      [$(PastelEVODatabase)].dbo.StkItem ON [$(PastelEVODatabase)].dbo._etblUnitConversion.idUnitConversion = [$(PastelEVODatabase)].dbo.StkItem.iUOMDefPurchaseUnitID INNER JOIN
                      [$(GraniteDatabase)].dbo.MasterItem ON [$(PastelEVODatabase)].dbo.StkItem.Code = [$(GraniteDatabase)].dbo.MasterItem.Code COLLATE SQL_Latin1_General_CP1_CI_AS
UNION
SELECT  * FROM [$(GraniteDatabase)].dbo.MasterItemAlias
```

## 09 June 2023 (4.5.0.0) 

### GraniteDatabase
---
#### New tables

##### DataGrid

```sql
CREATE TABLE [dbo].[DataGrid]
(
	[ID] BIGINT NOT NULL PRIMARY KEY IDENTITY, 
    [Group] VARCHAR(50) NOT NULL, 
    [Name] VARCHAR(50) NOT NULL UNIQUE, 
    [SQLView] VARCHAR(100) NULL, 
    [GridDefinition] NVARCHAR(MAX) NOT NULL, 
    [UserGroup_id] BIGINT NULL, 
    [User_id] BIGINT NULL,
    [AuditDate] DATETIME NULL, 
	[AuditUser] VARCHAR(20) NULL,
	[Version] SMALLINT NULL, 
    [isApplicationGrid] BIT NULL, 
    [isCustomGrid] BIT NULL,
)
```

##### SystemStaticData

```sql
CREATE TABLE [dbo].[SystemStaticData]
(
	[ID] BIGINT NOT NULL PRIMARY KEY IDENTITY, 
    [Group] VARCHAR(100) NULL,
    [Key] VARCHAR(100) NOT NULL UNIQUE, 
    [Value] VARCHAR(MAX) NOT NULL, 
    [Description] VARCHAR(MAX) NULL, 
    [isEncrypted] BIT NOT NULL DEFAULT 0, 
    [AuditDate] DATETIME NULL, 
    [AuditUser] NCHAR(10) NULL, 
    [Version] SMALLINT NULL
)

```

##### SystemSnippets

```sql
CREATE TABLE [SystemSnippets]
(
	[ID] INT NOT NULL PRIMARY KEY IDENTITY, 
    [Name] VARCHAR(50) NOT NULL,
	[Description] NVARCHAR(MAX) NOT NULL, 
    [Code] NVARCHAR(MAX) NOT NULL,
	[CodeComment] NVARCHAR(MAX) NULL,
	[Tags] VARCHAR(MAX) NULL,
	[ProcessType] VARCHAR(30) NULL,
)
```

##### AuditStockTakeLines


```sql
CREATE TABLE [dbo].[AuditStockTakeLines]
(
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
    [StockTakeSession_id] BIGINT NOT NULL, 
    [StockTakeLines_id] BIGINT NOT NULL, 
    [TrackingEntity_id] BIGINT NULL, 
    [MasterItem_id] BIGINT NULL, 
    [Barcode] VARCHAR(50) NULL, 
    [MasterItemCode] VARCHAR(40) NULL,
    [Action] VARCHAR(10) NOT NULL,
    [QtyColumn] VARCHAR(20) NULL, 
    [FromQty] decimal NULL, 
    [ToQty] decimal NULL,
    [FromStatus]  VARCHAR(20) NULL,
    [ToStatus]  VARCHAR(20) NULL,
    [FromLocation]  VARCHAR(50) NULL,
    [ToLocation]  VARCHAR(50) NULL,
    [User] VARCHAR(20) NOT NULL, 
    [AuditDate] DATE NOT NULL,
    [AuditTime] TIME NOT NULL, 
)
```

##### SystemHelp


```sql
CREATE TABLE [dbo].[SystemHelp]
(
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
    [Title] VARCHAR(255) NULL, 
    [Content] VARCHAR(MAX) NULL,
    [Component] VARCHAR(255) NULL
)
```

#### Table Changes

##### UsersCredential
Columns PasswordExpiration and FailedLoginAttempts added

```sql
    ALTER TABLE [UsersCredential]
    ADD [PasswordExpiration] DATETIME NULL, 
        [FailedLoginAttempts] BIT NULL
```

##### Document

Columns Route and Stop have been renamed to RouteName and StopName respectively

```sql
    ALTER TABLE Document
	ADD [RouteName] VARCHAR(50) NULL,
	    [StopName] VARCHAR(50) NULL
```

##### Process

```sql
    ALTER TABLE [Process]
    ADD [WebTemplate] VARCHAR(MAX) NULL
```

##### ProcessStep

```sql
    ALTER TABLE [ProcessStep]
    ADD [WebTemplate] VARCHAR(MAX) NULL
```

##### Users

Added new permissions

```sql
    ALTER TABLE [Users]
	ADD [AllowSystemStaticData] BIT NULL DEFAULT 0,
        [AllowManufactureDocument] BIT NOT NULL, 
        [AllowPickReversal] BIT NOT NULL, 
        [AllowReceiveReversal] BIT NOT NULL, 
        [AllowTransferReversal] BIT NOT NULL, 
        [AllowInventoryVariances] BIT NOT NULL,
        [AllowReceivingProgress] BIT NOT NULL,
        [AllowPickingProgress] BIT NOT NULL,
        [AllowPickSlip] BIT NOT NULL,
        [AllowTransferProgress] BIT NOT NULL,
        [AllowManufactureProgress] BIT NOT NULL
```

##### UserGroup
```sql
    ALTER TABLE [UserGroup]
    ALTER COLUMN [Name] NOT NULL UNIQUE
```

##### Audit

Column NewValue now allows nulls
```sql
    ALTER TABLE [Audit]
    ALTER COLUMN [NewValue] VARCHAR(MAX) NULL
```

##### SystemSettings
Add Version column

```sql
    ALTER TABLE
    ADD [Version] SMALLINT NULL
```

#### Deprecated Tables
- ApplicationLog
- Emails
- Reports
- StockTakeLine
- StockTakeScanned

#### New Views

##### API_QueryStockTakeProcessSummary

```sql
CREATE VIEW [dbo].[API_QueryStockTakeProcessSummary] as
SELECT dbo.StockTakeSession.[Name] AS [Session], dbo.MasterItem.Code,dbo. MasterItem.[Description], dbo.MasterItem.Category AS ItemCategory, dbo.MasterItem.[Type] AS ItemType, 
	SUM(OpeningQty) AS OpeningQty,
	COUNT(StockTakeLines.TrackingEntity_id) AS Total, 
	SUM(CASE WHEN [Status] = 'OUTSTANDING' AND ISNULL(Scrap, 0) = 0	THEN OpeningQty ELSE 0 END) OutstandingQty,
	SUM(CASE WHEN [Status] = 'COUNTED' AND ISNULL(dbo.StockTakeLines.Scrap, 0) = 0 THEN dbo.StockTakeLines.Count1Qty ELSE 0 END) AS Count1Qty,  
	SUM(CASE WHEN [Status] = 'COUNTED' AND ISNULL(dbo.StockTakeLines.Scrap, 0) = 0 THEN dbo.StockTakeLines.Count2Qty ELSE 0 END) AS Count2Qty, 
	SUM(CASE WHEN [Status] = 'COUNTED' AND ISNULL(dbo.StockTakeLines.Scrap, 0) = 0 THEN dbo.StockTakeLines.Count3Qty ELSE 0 END) AS Count3Qty, 
	SUM(CASE WHEN [Status] = 'APPROVED' AND ISNULL(dbo.StockTakeLines.Scrap, 0) = 0 THEN dbo.StockTakeLines.ApprovedQty ELSE 0 END) AS ApprovedQty,
	ISNULL(dbo.ERP_StockOnHand.QTYONHAND, 0) ERPQty
FROM dbo.StockTakeSession INNER JOIN
	dbo.StockTakeLines ON dbo.StockTakeSession.ID = dbo.StockTakeLines.StockTakeSession_id INNER JOIN
	dbo.MasterItem ON dbo.StockTakeLines.MasterItem_id = dbo.MasterItem.ID INNER JOIN
	dbo.TrackingEntity ON dbo.StockTakeLines.TrackingEntity_id = dbo.TrackingEntity.ID LEFT OUTER JOIN
	dbo.ERP_StockOnHand ON dbo.MasterItem.Code = dbo.ERP_StockOnHand.ITEMNO
GROUP BY dbo.StockTakeSession.[Name], dbo.MasterItem.Code, dbo.MasterItem.[Description], dbo.MasterItem.Category, dbo.MasterItem.[Type],  dbo.ERP_StockOnHand.QTYONHAND

```

#### Changed Views

##### API_QueryPickslipLines
Remove dependency on deprecated view Base_Inventory_Summary
```sql
ALTER VIEW [dbo].[API_QueryPickslipLines]
	AS 
SELECT	dbo.[Document].ID, dbo.DocumentDetail.ID AS DocumentDetailID, dbo.[Document].Number, Document_1.Number AS SalesOrder, 
		Document_1.TradingPartnerCode, Document_1.TradingPartnerDescription, dbo.MasterItem.Code, dbo.MasterItem.Description, 
		dbo.DocumentDetail.Qty AS PickSlipQty, DocumentDetail_1.Qty AS OrderQty, ISNULL(dbo.DocumentDetail.ActionQty, 0) AS PickedQty, 
		stock.QtyOnHand AS QtyOnHand, Document_1.ID AS SalesOrderID, dbo.MasterItem.ID AS MasterItemID, 
		dbo.DocumentDetail.LineNumber, DocumentDetail_1.LineNumber AS SalesOrderLine, dbo.DocumentDetail.Comment, dbo.DocumentDetail.Instruction, 
		dbo.DocumentDetail.Cancelled, dbo.DocumentDetail.Completed, dbo.DocumentDetail.UOM, dbo.DocumentDetail.Batch, dbo.DocumentDetail.ExpiryDate, 
		dbo.DocumentDetail.SerialNumber
FROM  dbo.[Document] INNER JOIN
         dbo.DocumentDetail ON dbo.[Document].ID = dbo.DocumentDetail.Document_id INNER JOIN
         dbo.Type ON dbo.[Document].Type = dbo.Type.Name INNER JOIN
         dbo.DocumentDetail AS DocumentDetail_1 ON dbo.DocumentDetail.LinkedDetail_id = DocumentDetail_1.ID INNER JOIN
         dbo.[Document] AS Document_1 ON DocumentDetail_1.Document_id = Document_1.ID INNER JOIN
         dbo.MasterItem ON dbo.DocumentDetail.Item_id = dbo.MasterItem.ID INNER JOIN
         dbo.Status ON dbo.[Document].Status = dbo.Status.Name OUTER APPLY
		 (
			SELECT ISNULL(SUM(Qty), 0) AS QtyOnHand
			FROM TrackingEntity INNER JOIN
			[Location] ON TrackingEntity.Location_id = [Location].ID
			WHERE TrackingEntity.MasterItem_id = DocumentDetail.Item_id AND TrackingEntity.InStock = 1 AND ISNULL([Location].NonStock, 0) = 0
		 ) stock
WHERE (dbo.Type.Name = 'PICKSLIP') AND (dbo.Status.Name <> 'COMPLETE')
GO
```

##### API_QueryStockReplenish
Remove dependency on deprecated view Base_Inventory_Summary
```sql
CREATE VIEW [dbo].API_QueryStockReplenish
AS
SELECT Code, [Description], [Location].[Name] AS PickFaceLocation, stock.LocationQty, MasterItem.MinimumPickfaceQuantity AS MininmumQty, 
MasterItem.OptimalPickfaceQuantity AS OptimalQty, OptimalPickfaceQuantity - LocationQty AS ReplenishQty
FROM dbo.MasterItem INNER JOIN
dbo.[Location] ON MasterItem.PickfaceLocation_id = [Location].ID OUTER APPLY
(
	SELECT ISNULL(SUM(Qty), 0) AS LocationQty
	FROM dbo.TrackingEntity 
	WHERE InStock = 1 AND TrackingEntity.Location_id = [Location].ID AND TrackingEntity.MasterItem_id = MasterItem.ID
) stock
WHERE OptimalPickfaceQuantity > 0
GO
```

##### API_QueryStockTakeLinesSummary
Added collation to join on ERP_StockOnHand view
```sql
ALTER VIEW [dbo].[API_QueryStockTakeLinesSummary]
AS
SELECT dbo.MasterItem.Code, dbo.MasterItem.Description, dbo.MasterItem.Category AS ItemCategory, dbo.MasterItem.Type AS ItemType, dbo.StockTakeLines.OpeningLocationERP,
SUM(dbo.StockTakeLines.OpeningQty) AS OpeningQty, dbo.StockTakeLines.Status, dbo.StockTakeSession.Name AS Session, 
COUNT(dbo.TrackingEntity.ID) AS Total, 
SUM(CASE WHEN ISNULL(dbo.StockTakeLines.Scrap, 0) = 0 THEN dbo.TrackingEntity.Qty ELSE 0 END) AS SessionQty, 
SUM(CASE WHEN ISNULL(dbo.StockTakeLines.Scrap, 0) = 0 THEN dbo.StockTakeLines.Count1Qty ELSE 0 END) AS Count1Qty,  
SUM(CASE WHEN ISNULL(dbo.StockTakeLines.Scrap, 0) = 0 THEN dbo.StockTakeLines.Count2Qty ELSE 0 END) AS Count2Qty, 
SUM(CASE WHEN ISNULL(dbo.StockTakeLines.Scrap, 0) = 0 THEN dbo.StockTakeLines.Count3Qty ELSE 0 END) AS Count3Qty, 
SUM(CASE WHEN ISNULL(dbo.StockTakeLines.Scrap, 0) = 0 THEN dbo.StockTakeLines.ApprovedQty ELSE 0 END) AS ApprovedQty,  
ERP_StockOnHand.QTYONHAND AS ERPQty
FROM  dbo.TrackingEntity INNER JOIN
         dbo.StockTakeLines ON dbo.TrackingEntity.ID = dbo.StockTakeLines.TrackingEntity_id INNER JOIN
         dbo.StockTakeSession ON dbo.StockTakeLines.StockTakeSession_id = dbo.StockTakeSession.ID INNER JOIN
         dbo.MasterItem ON dbo.TrackingEntity.MasterItem_id = dbo.MasterItem.ID LEFT OUTER JOIN
         ERP_StockOnHand ON MasterItem.FormattedCode = ERP_StockOnHand.ITEMNO COLLATE DATABASE_DEFAULT AND StockTakeLines.OpeningLocationERP = ERP_StockOnHand.[LOCATION] COLLATE DATABASE_DEFAULT
GROUP BY dbo.MasterItem.Code, dbo.MasterItem.Description, dbo.StockTakeLines.Status, dbo.StockTakeSession.Name, dbo.MasterItem.Category, dbo.MasterItem.Type, dbo.StockTakeLines.OpeningLocationERP, ERP_StockOnHand.QTYONHAND
GO
```

##### API_QueryStockDetail
Split CreateDate (datetime) to CreateDate (date) and Time (Time(0))

```sql
ALTER VIEW [dbo].[API_QueryStockDetail]
AS
SELECT dbo.TrackingEntity.Barcode, dbo.TrackingEntity.SerialNumber, dbo.TrackingEntity.Qty, dbo.MasterItem.ID AS MasterItem_id, dbo.MasterItem.Code AS Code, dbo.MasterItem.Description AS Description, dbo.Location.Name AS Location, dbo.Location.Site, dbo.TrackingEntity.Batch, dbo.TrackingEntity.ExpiryDate, NULL AS OnHoldDate, CAST(dbo.[TrackingEntity].CreatedDate AS Date) as CreatedDate, CAST(dbo.[TrackingEntity].CreatedDate AS Time(0)) as Time, dbo.CarryingEntity.Barcode AS Pallet, dbo.TrackingEntity.OnHold, dbo.TrackingEntity.StockTake,
dbo.MasterItem.Category as ItemCategory, dbo.MasterItem.[Type] as ItemType, dbo.Location.Category as LocationCategory, dbo.Location.[Type] as LocationType 
FROM  dbo.TrackingEntity INNER JOIN
         dbo.MasterItem ON dbo.TrackingEntity.MasterItem_id = dbo.MasterItem.ID INNER JOIN
         dbo.Location ON dbo.TrackingEntity.Location_id = dbo.Location.ID LEFT OUTER JOIN
         dbo.CarryingEntity ON dbo.TrackingEntity.BelongsToEntity_id = dbo.CarryingEntity.ID
WHERE (dbo.TrackingEntity.InStock = 1) AND (dbo.Location.NonStock = 0)
GO
```

##### API_QueryTransactions
Split column Date (datetime) into columns Date (date) and Time (Time(0))

```sql
ALTER VIEW [dbo].[API_QueryTransactions]
AS
SELECT dbo.[Transaction].ID, dbo.TrackingEntity.Barcode, dbo.MasterItem.Code, dbo.MasterItem.Description, CAST(dbo.[Transaction].Date AS Date) as Date, CAST(dbo.[Transaction].Date AS Time(0)) as Time, dbo.TrackingEntity.Batch, dbo.TrackingEntity.SerialNumber, dbo.TrackingEntity.ExpiryDate, dbo.[Transaction].FromQty, dbo.[Transaction].ToQty, dbo.[Transaction].ActionQty, dbo.[Transaction].UOM, dbo.[Transaction].Comment, dbo.[Transaction].IntegrationDate, dbo.[Transaction].Process, dbo.Users.Name AS [User], 
         dbo.[Transaction].DocumentReference, dbo.[Document].Number AS Document, dbo.[Transaction].IntegrationStatus, dbo.CarryingEntity.Barcode AS Pallet, L1.Name AS FromLocation, L2.Name AS ToLocation, L3.Site, dbo.[Transaction].Type, dbo.[Transaction].IntegrationReference, dbo.DocumentDetail.LineNumber, TrackingEntity_1.Barcode AS FromBarcode,
         CONVERT(Date, dbo.[Transaction].Date, 101) AS TransactionDate, SUBSTRING(CONVERT(varchar(20), dbo.[Transaction].Date), 12, 10) AS TransactionTime
FROM  dbo.[Transaction] LEFT OUTER JOIN
         dbo.DocumentDetail ON dbo.[Transaction].DocumentLine_id = dbo.DocumentDetail.ID AND dbo.[Transaction].Document_id = dbo.DocumentDetail.Document_id LEFT OUTER JOIN
         dbo.[Document] ON dbo.[Document].ID = dbo.[Transaction].Document_id LEFT OUTER JOIN
         dbo.CarryingEntity ON dbo.[Transaction].ContainableEntity_id = dbo.CarryingEntity.ID LEFT OUTER JOIN
         dbo.Location AS L1 ON dbo.[Transaction].FromLocation_id = L1.ID LEFT OUTER JOIN
         dbo.Location AS L2 ON dbo.[Transaction].ToLocation_id = L2.ID LEFT OUTER JOIN
         dbo.Users ON dbo.[Transaction].User_id = dbo.Users.ID INNER JOIN
         dbo.TrackingEntity ON dbo.[Transaction].TrackingEntity_id = dbo.TrackingEntity.ID LEFT OUTER JOIN
         dbo.Location AS L3 ON dbo.TrackingEntity.Location_id = L3.ID INNER JOIN
         dbo.MasterItem ON dbo.TrackingEntity.MasterItem_id = dbo.MasterItem.ID LEFT OUTER JOIN
         dbo.TrackingEntity AS TrackingEntity_1 ON dbo.[Transaction].FromTrackingEntity_id = TrackingEntity_1.ID
GO
```

##### API_QueryTransactionsManufacture
Split column Date (datetime) into columns Date (date) and Time (Time(0))

```sql
ALTER VIEW [dbo].[API_QueryTransactionsManufacture]
AS
SELECT dbo.[Transaction].ID, dbo.TrackingEntity.Barcode, dbo.MasterItem.Code, dbo.MasterItem.Description, CAST(dbo.[Transaction].Date AS Date) as Date, CAST(dbo.[Transaction].Date AS Time(0)) as Time, dbo.TrackingEntity.Batch, dbo.TrackingEntity.SerialNumber, dbo.TrackingEntity.ExpiryDate, 
                  dbo.[Transaction].FromQty, dbo.[Transaction].ToQty, dbo.[Transaction].ActionQty, dbo.Users.Name AS [User], dbo.[Transaction].DocumentReference, dbo.[Document].Number AS Document, dbo.[Transaction].IntegrationStatus, 
                  dbo.CarryingEntity.Barcode AS Pallet, dbo.[Transaction].Comment, L1.Name AS FromLocation, L2.Name AS ToLocation, L3.Site, dbo.[Transaction].Type AS Type, dbo.[Transaction].IntegrationReference
FROM     dbo.[Transaction] LEFT OUTER JOIN
                  dbo.TrackingEntity ON dbo.TrackingEntity.ID = dbo.[Transaction].TrackingEntity_id LEFT OUTER JOIN
                  dbo.MasterItem ON dbo.MasterItem.ID = dbo.TrackingEntity.MasterItem_id LEFT OUTER JOIN
                  dbo.CarryingEntity ON dbo.[Transaction].ContainableEntity_id = dbo.CarryingEntity.ID LEFT OUTER JOIN
                  dbo.Location AS L1 ON dbo.[Transaction].FromLocation_id = L1.ID LEFT OUTER JOIN
                  dbo.Location AS L2 ON dbo.[Transaction].ToLocation_id = L2.ID LEFT OUTER JOIN
                  dbo.Location AS L3 ON dbo.TrackingEntity.Location_id = L3.ID LEFT OUTER JOIN
                  dbo.Users ON dbo.[Transaction].User_id = dbo.Users.ID LEFT OUTER JOIN
                  dbo.[Document] ON dbo.[Document].ID = dbo.[Transaction].Document_id
				  WHERE dbo.[Transaction].Type = 'CONSUME' OR dbo.[Transaction].Type = 'MANUFACTURE'
GO
```

##### API_QueryTransactionsPickReversal
Split column Date (datetime) into columns Date (date) and Time (Time(0))

```sql
ALTER VIEW [dbo].[API_QueryTransactionsPickReversal]
AS
SELECT dbo.[Transaction].ID, dbo.TrackingEntity.Barcode, dbo.MasterItem.Code, dbo.MasterItem.Description, CAST(dbo.[Transaction].Date AS Date) as Date, CAST(dbo.[Transaction].Date AS Time(0)) as Time, dbo.TrackingEntity.Batch, dbo.TrackingEntity.SerialNumber, dbo.TrackingEntity.ExpiryDate, dbo.[Transaction].FromQty, dbo.[Transaction].ToQty, dbo.[Transaction].ActionQty, dbo.Users.Name AS [User], dbo.[Transaction].DocumentReference, dbo.[Document].Number AS [Document], dbo.[Transaction].IntegrationStatus, 
         dbo.CarryingEntity.Barcode AS Pallet, dbo.[Transaction].Comment, L1.Name AS FromLocation, L2.Name AS ToLocation, L3.Site, dbo.[Transaction].Type, dbo.[Transaction].IntegrationReference, dbo.[Transaction].ReversalTransaction_id, dbo.[Document].TradingPartnerCode, dbo.[Document].TradingPartnerDescription, dbo.[Document].Status, dbo.DocumentDetail.LineNumber
FROM  dbo.[Transaction] INNER JOIN
         dbo.DocumentDetail ON dbo.[Transaction].DocumentLine_id = dbo.DocumentDetail.ID LEFT OUTER JOIN
         dbo.[Document] ON dbo.[Document].ID = dbo.[Transaction].Document_id LEFT OUTER JOIN
         dbo.CarryingEntity ON dbo.[Transaction].ContainableEntity_id = dbo.CarryingEntity.ID LEFT OUTER JOIN
         dbo.Location AS L1 ON dbo.[Transaction].FromLocation_id = L1.ID LEFT OUTER JOIN
         dbo.Location AS L2 ON dbo.[Transaction].ToLocation_id = L2.ID LEFT OUTER JOIN
         dbo.Users ON dbo.[Transaction].User_id = dbo.Users.ID FULL OUTER JOIN
         dbo.TrackingEntity LEFT OUTER JOIN
         dbo.Location AS L3 ON dbo.TrackingEntity.Location_id = L3.ID ON dbo.TrackingEntity.ID = dbo.[Transaction].TrackingEntity_id FULL OUTER JOIN
         dbo.MasterItem ON dbo.TrackingEntity.MasterItem_id = dbo.MasterItem.ID
WHERE (dbo.[Transaction].Type = 'PICK') AND ISNULL(dbo.[Transaction].ReversalTransaction_id, 0) = 0 AND ISNULL(dbo.[Transaction].IntegrationStatus, 0) = 0
GO
```

##### API_QueryTransactionsPicking
Split column Date (datetime) into columns Date (date) and Time (Time(0))

```sql
CREATE VIEW [dbo].[API_QueryTransactionsPicking]
AS
SELECT dbo.[Transaction].ID, dbo.[Transaction].ReversalTransaction_id, dbo.TrackingEntity.Barcode, dbo.MasterItem.Code, dbo.MasterItem.Description, CAST(dbo.[Transaction].Date AS Date) as Date, CAST(dbo.[Transaction].Date AS Time(0)) as Time, dbo.TrackingEntity.Batch, 
					dbo.TrackingEntity.SerialNumber, dbo.TrackingEntity.ExpiryDate, dbo.[Transaction].FromQty, dbo.[Transaction].ToQty, 
					dbo.[Transaction].ActionQty, dbo.[Transaction].UOM, dbo.[Transaction].Comment, dbo.[Transaction].IntegrationDate,
					dbo.[Transaction].Process, dbo.Users.Name AS [User], dbo.[Transaction].DocumentReference, dbo.[Document].Number AS Document, dbo.[Transaction].IntegrationStatus, 
					dbo.CarryingEntity.Barcode AS Pallet, L1.Name AS FromLocation, L2.Name AS ToLocation, L3.Site, 
					dbo.[Transaction].Type AS Type, dbo.[Transaction].IntegrationReference
FROM     dbo.[Transaction] LEFT OUTER JOIN
					dbo.TrackingEntity ON dbo.TrackingEntity.ID = dbo.[Transaction].TrackingEntity_id LEFT OUTER JOIN
					dbo.MasterItem ON dbo.MasterItem.ID = dbo.TrackingEntity.MasterItem_id LEFT OUTER JOIN
					dbo.CarryingEntity ON dbo.[Transaction].ContainableEntity_id = dbo.CarryingEntity.ID LEFT OUTER JOIN
					dbo.Location AS L1 ON dbo.[Transaction].FromLocation_id = L1.ID LEFT OUTER JOIN
					dbo.Location AS L2 ON dbo.[Transaction].ToLocation_id = L2.ID LEFT OUTER JOIN
					dbo.Location AS L3 ON dbo.TrackingEntity.Location_id = L3.ID LEFT OUTER JOIN
					dbo.Users ON dbo.[Transaction].User_id = dbo.Users.ID LEFT OUTER JOIN
					dbo.[Document] ON dbo.[Document].ID = dbo.[Transaction].Document_id
WHERE dbo.[Transaction].Type = 'PICK' OR dbo.[Transaction].Type = 'DYNAMICPICK'
GO
```

##### API_QueryTransactionsReceiving
Split column Date (datetime) into columns Date (date) and Time (Time(0))

```sql
CREATE VIEW [dbo].[API_QueryTransactionsReceiving]
AS
SELECT dbo.[Transaction].ID, dbo.[Transaction].ReversalTransaction_id, dbo.TrackingEntity.Barcode, dbo.MasterItem.Code, dbo.MasterItem.Description, CAST(dbo.[Transaction].Date AS Date) as Date, CAST(dbo.[Transaction].Date AS Time(0)) as Time, dbo.TrackingEntity.Batch, 
					dbo.TrackingEntity.SerialNumber, dbo.TrackingEntity.ExpiryDate, dbo.[Transaction].FromQty, dbo.[Transaction].ToQty, 
					dbo.[Transaction].ActionQty, dbo.[Transaction].UOM, dbo.[Transaction].Comment, dbo.[Transaction].IntegrationDate,
					dbo.[Transaction].Process, dbo.Users.Name AS [User], dbo.[Transaction].DocumentReference, dbo.[Document].Number AS Document, dbo.[Transaction].IntegrationStatus, 
					dbo.CarryingEntity.Barcode AS Pallet, L1.Name AS FromLocation, L2.Name AS ToLocation, L3.Site, 
					dbo.[Transaction].Type AS Type, dbo.[Transaction].IntegrationReference
FROM     dbo.[Transaction] LEFT OUTER JOIN
					dbo.TrackingEntity ON dbo.TrackingEntity.ID = dbo.[Transaction].TrackingEntity_id LEFT OUTER JOIN
					dbo.MasterItem ON dbo.MasterItem.ID = dbo.TrackingEntity.MasterItem_id LEFT OUTER JOIN
					dbo.CarryingEntity ON dbo.[Transaction].ContainableEntity_id = dbo.CarryingEntity.ID LEFT OUTER JOIN
					dbo.Location AS L1 ON dbo.[Transaction].FromLocation_id = L1.ID LEFT OUTER JOIN
					dbo.Location AS L2 ON dbo.[Transaction].ToLocation_id = L2.ID LEFT OUTER JOIN
					dbo.Location AS L3 ON dbo.TrackingEntity.Location_id = L3.ID LEFT OUTER JOIN
					dbo.Users ON dbo.[Transaction].User_id = dbo.Users.ID LEFT OUTER JOIN
					dbo.[Document] ON dbo.[Document].ID = dbo.[Transaction].Document_id
WHERE dbo.[Transaction].Type = 'RECEIVE'
GO
```

##### API_QueryTransactionsTransfer
Split column Date (datetime) into columns Date (date) and Time (Time(0))

```sql
CREATE VIEW [dbo].[API_QueryTransactionsTransfer]
AS
SELECT dbo.[Transaction].ID, dbo.[Transaction].ReversalTransaction_id, dbo.TrackingEntity.Barcode, dbo.MasterItem.Code, dbo.MasterItem.Description, CAST(dbo.[Transaction].Date AS Date) as Date, CAST(dbo.[Transaction].Date AS Time(0)) as Time, dbo.TrackingEntity.Batch, 
					dbo.TrackingEntity.SerialNumber, dbo.TrackingEntity.ExpiryDate, dbo.[Transaction].FromQty, dbo.[Transaction].ToQty, 
					dbo.[Transaction].ActionQty, dbo.[Transaction].UOM, dbo.[Transaction].Comment, dbo.[Transaction].IntegrationDate,
					dbo.[Transaction].Process, dbo.Users.Name AS [User], dbo.[Transaction].DocumentReference, dbo.[Document].Number AS Document, dbo.[Transaction].IntegrationStatus, 
					dbo.CarryingEntity.Barcode AS Pallet, L1.Name AS FromLocation, L2.Name AS ToLocation, L3.Site, 
					dbo.[Transaction].Type AS Type, dbo.[Transaction].IntegrationReference
FROM     dbo.[Transaction] LEFT OUTER JOIN
					dbo.TrackingEntity ON dbo.TrackingEntity.ID = dbo.[Transaction].TrackingEntity_id LEFT OUTER JOIN
					dbo.MasterItem ON dbo.MasterItem.ID = dbo.TrackingEntity.MasterItem_id LEFT OUTER JOIN
					dbo.CarryingEntity ON dbo.[Transaction].ContainableEntity_id = dbo.CarryingEntity.ID LEFT OUTER JOIN
					dbo.Location AS L1 ON dbo.[Transaction].FromLocation_id = L1.ID LEFT OUTER JOIN
					dbo.Location AS L2 ON dbo.[Transaction].ToLocation_id = L2.ID LEFT OUTER JOIN
					dbo.Location AS L3 ON dbo.TrackingEntity.Location_id = L3.ID LEFT OUTER JOIN
					dbo.Users ON dbo.[Transaction].User_id = dbo.Users.ID LEFT OUTER JOIN
					dbo.[Document] ON dbo.[Document].ID = dbo.[Transaction].Document_id
WHERE dbo.[Transaction].Type = 'TRANSFER' OR dbo.[Transaction].Type = 'DYNAMICTRANSFER'
GO
```

#### Deprecated Views
- App_DocumentDetail
- App_Documentdetail_Pickslips
- App_DocumentHeader
- App_Integration_Transactions
- App_Inventory_ByLocation
- App_Inventory_Instock
- App_Inventory_Pallets
- App_Inventory_QCHold
- App_Inventory_StockTake
- App_MasterFiles_Locations
- App_MasterFiles_MasterItems
- App_Outbound_Packing
- App_Outbound_PickSlips
- App_StockTake_Approved
- App_StockTake_PostingTotals
- App_StockTake_Processed
- App_StockTake_Scanned
- App_StockTake_ScannedSummary
- App_StockTake_Unscanned
- App_TrackingEntity
- App_Transactions_Location
- App_Warning_InventoryVariance
- App_Warning_Picking
- App_Warning_Receiving
- App_Warning_StockExpiry
- Base_App_Comparison
- Base_App_ExecutionProgress
- Base_App_TransactionPerUser
- Base_Inventory_Summary
- Base_Inventory_Summary_Location
- Base_Report_Inventory_Expiry
- Base_Stocktake
- Report_App_Transactions
- Report_App_Warning_StockReorder
- Report_App_Warning_StockToReplenish
- Report_Inbound_ReceivePerUser
- Report_Inbound_Receiving
- Report_Inventory_Adjustments
- Report_Inventory_Moves
- Report_Inventory_OnhandDetail
- Report_Inventory_OnhandSummary
- Report_Inventory_OnHandSummary_ForBufferStock
- Report_Inventory_OnholdDetail
- Report_Inventory_Reclassify
- Report_Inventory_ReplenishHistory
- Report_Inventory_Returns
- Report_Inventory_Scrapped
- Report_Inventory_Transfer
- Report_Outbound_Picking
- Report_Outbound_PicksPerUser
- Report_StockTake_Variance
- Report_Transactions_ActivityCost

#### Other

##### Misc folder renamed to Tooling

##### Moved views to new folders

- Views\Labels folder
    - Label_Box
    - Label_Location
    - Label_MasterItem
    - Label_Pallet
    - Label_TrackingEntity
    - Label_Users

- Views\Integration folder
    - Integration_Transactions
    - Integration_TransactionsComplete

##### Moved scripts to new folders
- Data\ScheduledJobs folder
    - ScheduledJobs.sql
- Data\SystemSettings folder
    - SystemSettings.sql
    - SystemSettingsAccpac.sql
    - SystemSettingsEvolution.sql
    - SystemSettingsProcessApp.sql
    - SystemSettingsSAP.sql
    - SystemSettingsScheduler.sql
- Data\Users folder
    - UserGroups.sql
    - Users.sql

##### Default processes moved to subfolder
- Process\* moved to Process\Default

##### Removed unused scripts
- Customers\*
- DataDemo\*
- Reporting\*

##### PostDeployScript

- Add .\Data\UserCredentials.sql
- Granite user creation updated to check if user exists before creating

##### ScriptInputParameters
Value field changed to nvarchar(max)
```sql
CREATE TYPE dbo.ScriptInputParameters AS TABLE
(
   Name NVARCHAR(50) NOT NULL,
   Value  NVARCHAR(MAX)
)
```

##### Grids data
- Add ApplicationGrids.sql
- Add EnquiryGrids.sql

##### SystemSettings data

- Change DatabaseVersion
    ```sql
        INSERT INTO SystemSettings ([Application], [Key], [Value], [Description], [isEncrypted], [isActive], AuditDate, AuditUser)
        VALUES    ('Granite', 'DatabaseVersion', '4.5.0.0', 'Granite Database version', 0, 1, GETDATE(), 'AUTOMATION')
    ```
- Add GraniteScheduler TimeZone and EmailAddress settings
    ```sql
        INSERT [dbo].[SystemSettings] ([Application], [Key], [Value], [Description], [ValueDataType], [isEncrypted], [isActive], [AuditDate], [AuditUser])
        VALUES    ('GraniteScheduler', 'TimeZone', '', 'The time zone that will be used when scheduling CRON jobs', 'string', 0, 1, GETDATE(), 'AUTOMATION'),
                  ('GraniteScheduler', 'Username', '', 'The username that will be used to connect to the SMTP server (usually the same as the EmailAddress)', 'string', 0, 1, GETDATE(), 'AUTOMATION')
    ```
- Add settings to SystemSettingsAccpac.sql
    ```sql
        INSERT INTO SystemSettings ([Application], [Key], [Value], [Description], [isEncrypted], [isActive], AuditDate, AuditUser)
        VALUES ('IntegrationSage300', 'RoundSummarizedActionQty', 'true', 'Round summed ActionQty when posting transfers and moves', 0, 1, GETDATE(), 'AUTOMATION')

        INSERT INTO SystemSettings ([Application], [Key], [Value], [Description], [isEncrypted], [isActive], AuditDate, AuditUser)
        VALUES ('IntegrationSage300', 'RoundSummarizedActionQtyToDecimalPlaces', '2', 'Number of decimal places to round ActionQty to', 0, 1, GETDATE(), 'AUTOMATION')
    ```
- Add Syspro settings
    ```sql
        INSERT INTO SystemSettings ([Application], [Key], [Value], [Description], [isEncrypted], [isActive], AuditDate, AuditUser)
        VALUES 
        ('IntegrationSyspro', 'SysproWriteXML', 'false', 'If true, logs XML that would be posted to C drive instead of posting to Syspro', 0, 1, GETDATE(), 'AUTOMATION'),
        ('IntegrationSyspro', 'Operator', '', 'Syspro Operator name', 0, 1, GETDATE(), 'AUTOMATION'),
        ('IntegrationSyspro', 'OperatorPassword', '', 'Syspro Operator password', 0, 1, GETDATE(), 'AUTOMATION'),
        ('IntegrationSyspro', 'CompanyId', '', 'Syspro CompanyID', 0, 1, GETDATE(), 'AUTOMATION'),
        ('IntegrationSyspro', 'CompanyPassword', '', 'Syspro Company password', 0, 1, GETDATE(), 'AUTOMATION'),
        ('IntegrationSyspro', 'SalesOrderPosting', 'SORTBO', 'Syspro business object to use for SalesOrder posting (SORTBO or SORTOS or ALL)', 0, 1, GETDATE(), 'AUTOMATION'),
        ('IntegrationSyspro', 'TransferPosting', 'GIT', 'Syspro integration method for Transfers (GIT or INVT)', 0, 1, GETDATE(), 'AUTOMATION'),
        ('IntegrationSyspro', 'Instance', '', 'Syspro Instance to use (empty for default)', 0, 1, GETDATE(), 'AUTOMATION'),
        ('IntegrationSyspro', 'MultipleBins', 'false', 'true or false. Set to true when Syspro has multiple bins enabled', 0, 1, GETDATE(), 'AUTOMATION'),
        ('IntegrationSyspro', 'SerialNumbers', 'false', 'true or false. Set to true when Syspro has SerialNumbers enabled', 0, 1, GETDATE(), 'AUTOMATION')
    ```
- Add Omni settings
    ```sql
        INSERT INTO SystemSettings ([Application], [Key], [Value], [Description], [isEncrypted], [isActive], AuditDate, AuditUser)
        VALUES	
        ('IntegrationOmni', 'Host', '', 'Servername or IP of the server where the API is hosted', 0, 1, GETDATE(), 'AUTOMATION'),
        ('IntegrationOmni', 'Port', '', 'Port number that the Omni API is running on', 1, 1, GETDATE(), 'AUTOMATION'),
        ('IntegrationOmni', 'UserName', '', 'Omni user name that is used to transact via the API', 0, 1, GETDATE(), 'AUTOMATION'),
        ('IntegrationOmni', 'Password', '', 'Password for the Omni user', 0, 1, GETDATE(), 'AUTOMATION'),
        ('IntegrationOmni', 'CompanyName', '', 'Omni company name to post to', 0, 1, GETDATE(), 'AUTOMATION'),
        ('IntegrationOmni', 'AdjustmentAccount', '', 'Account that adjustments will post to', 0, 1, GETDATE(), 'AUTOMATION'),
        ('IntegrationOmni', 'ScrapAccount', '', 'Account that scrap transcations will post to', 0, 1, GETDATE(), 'AUTOMATION'),
        ('IntegrationOmni', 'IntransitWarehouse', '', 'The intransit warehouse that will be used', 0, 1, GETDATE(), 'AUTOMATION'),
        ('IntegrationOmni', 'PostDynamicTransferReceipt', 'false', 'true or false. Determines whether Omni transfer is auto posted for Granite DynamicTransfers', 0, 1, GETDATE(), 'AUTOMATION')
    ```
- Add SystemSettingsSQLCLR.sql
    ```sql
        INSERT [dbo].[SystemSettings] ([Application], [Key], [Value], [Description], [ValueDataType], [isEncrypted], [isActive], [AuditDate], [AuditUser])
        VALUES	('SQLCLR', 'Webservice', '', 'Granite Webservice Address', 'string', 0, 1, GETDATE(), 'AUTOMATION'),
		        ('SQLCLR', 'LabelPrintService', '', 'Label Print Service Address', 'string', 0, 1, GETDATE(), 'AUTOMATION'),
		        ('SQLCLR', 'IntegrationService', '', 'Integration Service Address', 'string', 0, 1, GETDATE(), 'AUTOMATION')
		
    ```
- Application value changed from INTEGRATIONSERVICE to provider specific names:
    - IntegrationSage300
    - IntegrationSage200
    - IntegrationSAPB1

- Changed casing on Application name for SystemSettingsScheduler.sql
    - GRANITESCHEDULER -> GraniteScheduler

- Changed casing on Application name for SystemSettingsProcessApp.sql
    - PROCESSAPP -> ProcessApp

##### SystemSnippets data
Add default snippets data to SystemSnippets table
```sql
INSERT INTO SystemSnippets ([Name], [Description], [Code], [Tag0])
VALUES 
('Basic Table','Basic html table.','{{ ''SELECT * FROM _replace_'' | dbSelect() | basicTable() }}', 'TABLE'),
('Basic Table / Search','Table with search textbox.','{{ ''SELECT * FROM _replace_'' | dbSelect({}) | basicTable({enableSearch:true}) }}', 'TABLE'),
('Basic Table / Search and Select','Table with search and select on column.','{{ ''SELECT * FROM _replace_'' | dbSelect({}) | basicTable({selectOnColumn:''_replace_'', enableSearch:true}) }}', 'TABLE'),
('Basic List','Basic List', '{{ ''SELECT * FROM _replace_'' | dbSelect() | basicList() }}', 'LIST'),
('Basic List / Search','List with search textbox', '{{ ''SELECT * FROM _replace_'' | dbSelect() | basicList({enableSearch:true}) }}', 'LIST'),
('Label with Value','Label with step value', '<div><small>_replace_</small><header class=''gn-float-right''>{{_replace_}}</header></div>', 'LABEL'),
('SQL select parameter','SQL select with parameter.', '{{ ''SELECT * FROM _replace_view_ WHERE _replace_col_ = @_replace_value_'' | dbSelect({_replace_step_}) |> to => rows }}', 'SQL'),
('SQL select single value','SQL select single value to variable', '{{ ''SELECT _replace_col_ FROM _replace_view_ WHERE _replace_col_ = @_replace_value_'' | dbScalar({_replace_step_}) |> to => _replace_variable_ }}', 'SQL'),
('SQL select single row','SQL select single row to variable', '{{ ''SELECT * FROM _replace_view_ WHERE _replace_col_ = @_replace_value_'' | dbSingle({_replace_step_}) |> to => row }}', 'SQL'),
('Hide New button','Hide New button on CarryingEntity step', '<style> #btnNew { display:none } </style>', 'HIDE')
```
##### UserCredentials data
Add default user to UsersCredential table
```sql
INSERT INTO UsersCredential (Users_id, Password, Salt, PasswordStrength, Version, AuditDate, AuditUser)
SELECT ID as User_id, 
'Pm7fzVwBm+rMN5+hTRDFQPicjE5JYU8TpZq7lQS8CYMCqsP0QefTlBk96q0EucwyXuLWwe25y+IuqPXe/NPUBg==', 
'bNbQLUjOj041iKexoJV9fCvSANYohJPchw6QOrBzzwGol6Xwydm44BsIABBMYlEA',
'VeryWeak',
1,
GETDATE(),
'AUTOMATION'
FROM Users WHERE Name = '0'
```

### Pastel EVO Integration
---
#### ScheduledJobs Views

Removed:
- Integration_Evolution_SalesOrderTradingPartner
- Integration_Evolution_PurchaseOrderTradingPartner
Added:
- Integration_Evolution_TradingPartner
Updated:
- Integration_Evolution_ReceiptDetail
- Integration_Evolution_ReceiptHeader
- Integration_Evolution_IntransitDetail
- Integration_Evolution_IntransitHeader
- Integration_Evolution_MasterItem
- Integration_Evolution_MasterItem_V7
- Integration_Evolution_PurchaseOrderDetail
- Integration_Evolution_PurchaseOrderDetail_V7
- Integration_Evolution_PurchaseOrderHeader
- Integration_Evolution_SalesOrderDetail
- Integration_Evolution_SalesOrderDetail_V7
- Integration_Evolution_SalesOrderHeader
- Integration_Evolution_TransferDetail
- Integration_Evolution_TransferHeader
- Integration_Evolution_WorkOrderDetail
- Integration_Evolution_WorkOrderHeader

#### ScheduledJobs Triggers
Updated:
- TriggerGranitePurchaseOrders
- TriggerGraniteSalesOrders
- TriggerGraniteWarehouseTransfer

### Accpac Integration
---

#### ScheduledJobs Views
Added:
- Integration_Accpac_IntransitDetail
- Integration_Accpac_IntransitHeader
- Integration_Accpac_MasterItem
- Integration_Accpac_PurchaseOrderDetail
- Integration_Accpac_PurchaseOrderHeader
- Integration_Accpac_ReceiptDetail
- Integration_Accpac_ReceiptHeader
- Integration_Accpac_SalesOrderDetail
- Integration_Accpac_SalesOrderHeader
- Integration_Accpac_TradingPartner
- Integration_Accpac_TransferDetail
- Integration_Accpac_TransferHeader
- Integration_Accpac_WorkOrderDetail
- Integration_Accpac_WorkOrderHeader


#### ScheduledJobs Triggers
- TriggerGranitePurchaseOrders
- TriggerGraniteSalesOrders
- TriggerGraniteTransfers
- TriggerGraniteWorkOrders


### Syspro Database
---
New project for Syspro integration

#### Tables
- InvMaster
- PorMasterDetail
- PorMasterHdr
- SorDetail
- SorMaster
- WipJobAllMat
- WipMaster

#### Triggers
- TriggerGraniteWorkOrders
- TriggerGraniteSalesOrders
- TriggerGranitePurchaseOrders

#### Procedures
- IntegrationMasterItems
- IntegrationProcessPurchaseOrder
- IntegrationProcessSalesOrder
- IntegrationProcessWorkOrders

### SAPB1 Database
---

#### New Tables
- ORDN

### SAPB1 Integration
---
#### Scheduled Job Views
- Integration_SAPB1_MasterItem
- Integration_SAPB1_PurchaseOrderDetail
- Integration_SAPB1_PurchaseOrderHeader
- Integration_SAPB1_SalesOrderDetail
- Integration_SAPB1_SalesOrderHeader
- Integration_SAPB1_TransferDetail
- Integration_SAPB1_TransferHeader

### Omni Integration
---

New project added to database solution

Tables:
- Omni_DebugJSON

Functions:
- FN_BasicAuthHeader

StoredProcedures: 
- HttpProcedures:
    - HTTP_GET_JSON
    - HTTP_POST
    - HTTP_POST_JSON
    - HTTP_PUT_JSON
- Omni_PurchaseOrderSync
- Omni_SalesOrderSync
- Omni_StockTakeSync
- Omni_WarehouseReqSync
- Omni_WarehouseTransferSync
- Omni_WorkOrderSync


## 24 Feb 2023 (4.2.2.0)

### GraniteDatabase
---
#### New tables
- UsersCredential
    ```SQL
    CREATE TABLE [dbo].[UsersCredential]
    (
        [ID] [bigint] IDENTITY(1,1) NOT NULL, 
        [Users_id] BIGINT NOT NULL unique,
        [Password] VARCHAR(MAX) NOT NULL, 
        [Salt] VARCHAR(64) NOT NULL, 
        [PasswordStrength] VARCHAR(20) NULL, 
        [AuditDate] DATETIME NULL,
        [AuditUser] VARCHAR(20) NULL, 
        [Version] SMALLINT NULL, 
        CONSTRAINT [PK_UsersCredential] PRIMARY KEY ([ID]),
    )
    ```
- ApplicationLog
    ```SQL
    CREATE TABLE [dbo].[ApplicationLog]
    (
        [Id] BIGINT NOT NULL PRIMARY KEY IDENTITY, 
        [Date] DATETIME NOT NULL, 
        [Application] VARCHAR(50) NULL,
        [LogOrigin] VARCHAR(50) NULL,
        [LogLevel] VARCHAR(20) NULL, 
        [Message] VARCHAR(MAX) NULL,
        [User] VARCHAR(20) NULL, 
        [GraniteTransaction_id] BIGINT NULL,
        [Document_id] BIGINT NULL, 
        [DocumentDetail_id] BIGINT NULL
    )
    ```
#### Table changes
- TradingPartner increase Email column size and add ERPIdentification
    ```sql
    ALTER TABLE TradingPartner
    ALTER COLUMN [Email] [varchar](500) NULL
    ```
    ```sql
    ALTER TABLE TradingPartner
    ADD [ERPIdentification] varchar(50) NULL
    ```
- ScheduledJobsHistory AuditDate not null
    ```sql
    ALTER TABLE ScheduledJobsHistory
    ALTER COLUMN [AuditDate] [datetime] NOT NULL
    ```
- ProcessStepLookup increase column lengths
    ```sql
    ALTER TABLE ProcessStepLookup
    ALTER COLUMN [Value] [varchar](100) NULL
    GO
    ALTER TABLE ProcessStepLookup
	ALTER COLUMN [Description] [varchar](100) NULL
    ```
- ProcessStepLookupDynamic increase column lengths
    ```sql
    ALTER TABLE ProcessStepLookupDynamic
    ALTER COLUMN [Value] [varchar](100) NULL
    GO
    ALTER TABLE ProcessStepLookupDynamic
	ALTER COLUMN [Description] [varchar](100) NULL
    ```
- IntegrationDocumentQueue change ERP_id datatype decimal(19,0) -> varchar(50)
    ```sql
    ALTER TABLE IntegrationDocumentQueue
    ALTER COLUMN [ERP_id] VARCHAR(50) NOT NULL
    ```
- Status add column Version
    ```sql
    ALTER TABLE [Status]
    ADD [Version] SMALLINT NULL
    ```

#### View changes
```
Various fixes. Update the following views to ensure compatibility
```

- API_QueryStockDetail (spelling fix, LocactionType -> LocationType)
- API_QueryStockTakeLines (add missing column, MasterItem.Description)
- API_QueryStockTakeLinesSummary (Change add columns Count1Qty, Count2Qty, Count3Qty)
- Integration_Transactions (fix only showing most recent IntegraitonLog entry for all failed transactions)

#### Stored Procedure changes
- EmailTemplate (updated to maintain compatibility with GraniteScheduler)
    ```sql
    INSERT INTO @Output (Name, Value)
    VALUES	('RecipientList', @RecipientList),
            ('CC', @CC),
            ('BCC', @BCC),
            ('Subject', @Subject),
            ('Body', @Body),
            ('BodyIsHtml', CAST(ISNULL(@BodyIsHtml, 0) as varchar)),
            ('AttachmentPath', @AttachmentPath)

    SELECT * FROM @Output
    ```
    changes to
    ```sql
    SELECT	@RecipientList RecipientList, 
            @CC CC, 
            @BCC BCC, 
            @Subject [Subject], 
            @Body Body, 
            @BodyIsHtml BodyIsHtml, 
            @AttachmentPath AttachmentPath
    ```
#### Default Process scripts
- Fix DefaultAdjustmentProcess.sql incorrect process name for lookup values
- Fix DefaultQualityControlProcess.sql incorrect process name for lookup values

#### Miscellaneous
##### New
- Add older comparison scripts
    - CompareTables.sql
    - CompareTablesAndViews.sql 
- Add data compare scripts
    - RowCountCompare.sql
    - ViewCountCompare.sql
- Add  .sql
- Add DropUnusedIndex.sql
- Add UnusedIndexes.sql
- Add ShowDBLocks.sql
##### Changes
- ColumnCompare.sql (
    - Add where clause example to include/exclude views)
    - Add column isTable

### EvolutionDatabase
---
#### New
- Add Views and triggers for ScheduledJobs (still needs work)

## 07 Sep 2022 (4.2.1.0)

``` markdown
    Major release to support Audit and Versioning.
    Add version column to all tables with audit functionality. 
    Document and DocumentDetail add columns to be used by integration to flag sync failures.
    Several minor changes as listed below.
```
___
### Table Changes Add Version column

```sql
ALTER TABLE [Category] ADD [Version] SMALLINT NULL
```

```sql
ALTER TABLE [Type] ADD [Version] SMALLINT NULL
```

```sql
ALTER TABLE [TradingPartner] ADD [Version] SMALLINT NULL
```
Add AuditDate, AuditUser also
```sql
ALTER TABLE [ProcessMembers] 
ADD [Version] SMALLINT NULL,
	[AuditDate] DATETIME NULL, 
	[AuditUser] VARCHAR(20) NULL,
```
```sql
ALTER TABLE [UserGroup] 
ADD [Version] SMALLINT NULL,
	[AuditDate] DATETIME NULL, 
	[AuditUser] VARCHAR(20) NULL,
```

```sql
ALTER TABLE [Process] 
ADD [Version] SMALLINT NULL,
	[AuditDate] DATETIME NULL, 
	[AuditUser] VARCHAR(20) NULL,
```
```sql
ALTER TABLE [ProcessStep] 
ADD [Version] SMALLINT NULL,
[AuditDate] DATETIME NULL ,
[AuditUser] VARCHAR(20) NULL
```

### Table changes Add ERPSyncFailed, ERPSyncFailedReason

```sql
ALTER TABLE [Document]
ADD [ERPSyncFailed] BIT NOT NULL DEFAULT 0,
[ERPSyncFailedReason] VARCHAR(500) NULL,
[Version] SMALLINT NULL
```

```sql
ALTER TABLE [DocumentDetail] 
ADD [ERPSyncFailed] BIT NOT NULL DEFAULT 0,
[ERPSyncFailedReason] VARCHAR(500) NULL,
[Version] SMALLINT NULL
```

### View Changes
```
View changes below fixing various issues. Alteration on views required.
```

- Add column MasterItem_id to the following views
  - **API_QueryInventoryVariance**
  - **API_QueryInventoryVarianceDetail**
  - **API_QueryStockDetail**
  - **API_QueryStockTotals** 
  - **API_QueryStockTotalsDetail**

- Fix **Integration_Transactions** view
  - Add clause to exclude CONSUME and Process.IntegrationIsActive. Also Exclude reversed transactions.

- Fix reversal views, don't show already reversed transactions 
  - **API_QueryTransactionsTransferReversal**
  - **API_QueryTransactionsReceiveReversal**
  - **API_QueryTransactionsPickReversal**

## 15 Aug 2022 

### View changes

- Add masterItem ID to views. API_QueryStockTotalsDetail, API_QueryStockTotals, API_QueryStockDetail
- 
## 04 Aug 2022 (4.2.0.0)

Minor release for database changes in regards to future work.
Release also include changes related to Function Stored Procedures

### SystemSettings new data entry

Setting to hold database version in SystemSettings table.

```sql
INSERT INTO SystemSettings ([Application], [Key], [Value], [Description], [isEncrypted], [isActive], AuditDate, AuditUser)
VALUES ('GRANITE', 'DatabaseVersion', '4.2.0.0', 'Granite Database version', 0, 1, GETDATE(), 'AUTOMATION')
```
### New table type

 ScriptInputIdentities new type used by Function stored procedures
```sql
CREATE TYPE [dbo].[ScriptInputIdentities] AS TABLE(
	[ID] [bigint] NOT NULL
)
GO
```
### Function Template

- New example of Function stored procedure

### New Table 

- Audit Table (usage of table for future release)

___
## 27 July 2022

### Data changes

- Add new processes for "Menu" groupings
- Default data entry in SystemSettings for GRANITESCHEDULER (ScheduleService)
- Scheduled job entry for InventorySnapshot (ScheduleService)
- Example EmailTemplate procedure

### View changes

- API_QueryDocumentProgressDetail add UOM columns, add lineType for manufacturing
- SystemMetaData_View various improvements
 
### Table changes 

- Users add column AllowSystemSettings, AllowScheduledJobs, AllowSystemMetaData, AllowDataImport
- ScheduledJobs rename column JobParameter to StoredProcedure

### New Tables

- SystemSettings
- ScheduledJobsHistory
- ScheduledJobInput

### Stored Procs changes

- Job_Inventory_DailySnapShot remove dependency on Base view.

## 30 June

### Process and Steps default

- Default Process and Steps data/setup improvements.
  
### New Views
- API_QueryStockReorder
- API_QueryStockReplenish

### New function

- FN_GetOptionalField
___ 
## 07 June 

Documentation for Accpac, SAP, Evolution Tables. Path: *\Software Installs\Granite\Granite V3.4.4\GraniteDatabase*

### GraniteDatabase
---
#### Table changes

- Users, Name and Password not null
- Users, Name UNIQUE
- SystemMetaData, New column ProcessName

#### View changes

- API_QueryTransactionsPicking, add column ReversalTransaction_id
- API_QueryTransactionsReceiving, add column ReversalTransaction_id
- API_QueryTransactionsTransfer, add column ReversalTransaction_id
- API_QueryStockDetail, add columns MasterItem and Location Category and Type
- API_QueryStockTotals
- API_QueryDocumentProgressDetail
- API_QueryStockTakeLinesSummary

#### New function

- SSRS_ParameterSplit, function used by SSRS reports to split comma delimited string

### SAPB1
---
- IntegrationProcessSalesOrder - Added Unit of Measure, Comment to lines, Changed Status on the Temporary Table from bit to varchar.
- Created Queue stored proc for Transfer Requests
- Created Process stored proc for Transfer Requests
### ACCPAC 
---
#### Stored Proc Changes 
- IntegrationProcessTransfer, Tweaks to the TransferIntegration for Sage Accpac. Mainly to deal with Intransit Receipt Document
- IntegrationProcessPurchaseOrder. Update Granite document isActive
- IntegrationProcessSalesOrder. Update Granite document isActive
#### New Stored Proc 
Downwards integration for Supplier Returns
- New IntegrationProcessSupplierReturn, TriggerGraniteSupplierReturn
---
## 20 May 2022
### GraniteDatabase

#### View changes
- Integration_Transactions, exclude SPLIT transaction type, should not integrate. AND (dbo.[Transaction].Type != 'SPLIT')
- SystemMetaData_View, various fixes
- ProcessStepLookup_View, distinct UNION to exclude double entries

---
## 18 May 2022
### GraniteDatabase
---
#### New table
- ScheduledJobs
    ```sql
    [ID] BIGINT NOT NULL PRIMARY KEY IDENTITY,
	[isActive] [bit] NOT NULL,
	[JobName] [varchar](50) NOT NULL UNIQUE,
    [JobDescription] [varchar](100) NULL,
	[Type] [varchar](50) NULL,
	[JobParameter] [varchar](100) NULL,
	[Interval] [varchar](50) NULL,
	[IntervalFormat] [varchar](50) NULL,
	[Status] [varchar](50) NULL,
	[LastExecutionTime] [datetime] NULL,
	[LastExecutionResult] [varchar](50) NULL,
	AuditDate datetime NULL,
	AuditUser varchar(20) NULL
    ```
#### Table changes
- Users AllowBulkScrap & AllowBulkMove DEFAULT 0
- TradingPartner not null constraint on Code, Description, DocumentType
- TradingPartner Code increase to 50
- Table SystemSettings add column Application
    ```sql
    [Application] VARCHAR(50) NOT NULL
    ```
#### View changes
- API_QueryStockTakeLines add missing recommendation
- API_QueryPickslipLines added in Comment and Instruction and missing fields    
- API_QueryTransactions add FromBarcode

## 13 May 2022
### View Changes (alter views)
- API_QueryStockTakeLines: Add recommendation for Count1,2,3 match

## 05 May 2022
### View Changes (alter views)
Should be safe at this stage to re-create all API_* views for existing clients (upgrades)
- API_QueryDocumentProgress: Add column TradingPartnerCode, ExpectedDate. 
- API_QueryDocumentProgress, API_QueryDocument: Include completed documents with audit date in last 14 / 30 days
- API_QueryStockTakeLinesSummary. Change join from Barcode to ID on TrackingEntity Table
- API_QueryStockTakeLines. Change join from Barcode to ID on TrackingEntity Table
- API_QueryUserGroups, Add Users columns

### Table Document add columns 
```sql
Route varchar(30) 
Stop varchar(30) 
AssignedTo varchar(250)
```
### Table Document change column 
```sql
TradingPartnerDescription varchar(250)
```
### Table TradingPartner change column 
```sql
Description varchar(250)
```
### Table custom_DocumentTrackingLog change column 
```sql
Comment varchar(250)
```
### Table custom_DocumentTrackingLog add column 
```sql
Process varchar(50) 
AdditionalData varchar(250)
```
### Table StockTakeLines add columns 
```sql
OpeningLocationERP varchar(15)
MasterItemCode varchar(40)
```
## 31 Mar 2022
### Table StockTakeLines Add column 
```sql
TrackingEntity_id bigint
```
### Views New 
- SystemMetaData_View

## 25 Mar 2022
### Table MasterItemAlias 
- Change column Code type to VARCHAR(50)

## 23 Mar 2022
### Table FunctionParameter Add column 
```sql
isBool bit
```
## 08 Mar 2022

Table FunctionParameterLookup Add column 
```sql
isActive bit
```
### Table FunctionParameterLookup 
- Rename column Function to FunctionName
- Rename column Description to ParameterName
### New Views
- FunctionParameterLookup_View
### Changed Views
- API_QueryDocumentProgressDetail change lineNumber to bigint
- API_QueryTransactionsPickReversal
- API_QueryTransactionsReceiveReversal
- API_QueryTransactions

## 27 Feb 2022

### New Views
- API_QueryTransactionsTransferReversal
- API_QueryStockTakeCriteria
### Changed Views
- App_Outbound_Packing where clause for type incorrect.
- API_QueryStockDetail. Rename columns MasterItemCode and MasterItemDescription to Code and Description
- API_QueryTransactions. Add column LineNumber
- API_QueryPickslipLines. Add column SalesOrderLine 
- API_QueryStockTotalsDetail, API_QueryStockTotals. Exclude Non stock location
- API_QueryStockDetail. Rename columns MasterItemCode and MasterItemDescription to Code    and Description
- API_QueryDocumentProgress add column document description


### Table Transaction add column 
```sql
LinkedTransaction_id bigint NULL
```

### Table DocumentDetail Update columns
```sql
 LineNumber varchar(50)
 Comment varchar(250)
 ```

### Table StockTakeSession add column 
```sql
Site varchar(30) NULL
```

### Table ProcessStep data 
- Add step DocumentReference to all standard Document Post processes

### Accpac:  
---
#### Stored Procs New & Fixes
- Fix IntegrationProcessTransfer. Receipt qty fetch from ICTRID
- New Upwards integration scripts Accpac IC / Assemblies.
- IntegrationProcessTransfer add no lock
- IntegrationProcessSalesOrder add no lock
- IntegrationProcessPurchaseOrder add no lock
## 22 Nov 2021
### Table Users new columns
```sql
[AllowBulkScrap] bit NOT NULL
[AllowBulkMove] bit NOT NULL
```
## 10 Nov 2021
### EXECUTE Script to add previous Data for Documents:
```sql
INSERT INTO TradingPartner (Code,[Description],[Name], DocumentType, AuditDate, AuditUser)
SELECT DISTINCT TradingPartnerCode, TradingPartnerDescription, TradingPartnerCode, [Type], getdate(), 'INTEGRATION'
FROM Document WHERE TradingPartnerCode NOT IN (SELECT Code FROM TradingPartner)
```
### Accpac: 
---
#### Update Stored procs to insert trading partner: 
- IntegrationProcessPurchaseOrder 
- IntegrationProcessSalesOrder 
### Pastel Evo: 
---
#### Update Stored procs to insert trading partner: 
- IntegrationProcessPurchaseOrder 
- IntegrationProcessSalesOrder 
### SAP B1: 
---
#### Update Stored procs to insert trading partner: 
- GranitePurchaseOrder 
- GraniteSalesOrder 


## 3 November 2021
### Table TradingPartner new columns
```
DocumentType 
AuditDate 
AuditUser
```
### Table TradingPartner rename column Name to Description
### Table Users new column 
```
AllowTradingPartner 
```
Table Document new column 
```
ExpectedDate
```
### New View 
- API_QueryTradingPartners
### Update view API_QueryLocations remove 0 qty trackingentities
### Data Table Type 
- Rename document types to INTRANSIT and RECEIPT

## 06 Oct 2021 
### Table Transaction new columns
```sql
[ReversalTransaction_id] BIGINT NULL
```
### Table DocumentDetail new columns
```sql
[ReversalAuditUser] VARCHAR(20) NULL
[ReversalAuditDate] DATETIME NULL
```
### Data Table Status
- Rename status CANCELED to CANCELLED
### Data Table Type 
- Add transaction type TRANSACTIONREVERSAL
### New Views
- API_QueryTransactionsReceiveReversal
- API_QueryTransactionsPickReversal

## 07 Sep 2021
### New Sql Views
 - API_QueryTransactionsPicking
 - API_QueryTransactionsReceiving 
 - API_QueryTransactionsManufacture 
 - API_QueryTransactionsTransfer

## 06 Sep 2021
### Table Process change column IntegrationMethod - Varchar 20 to 50
```sql
[IntegrationMethod] VARCHAR(50) NULL
```

### Table StockTakeLines new columns
```sql
[MasterItem_id] BIGINT NULL
```
### PastelEVO Database 
---
#### Add scripts for Pastel Transfer
Note the previous and still supported “transfer” moved to IntransitTransfer.
#### Fix Stored Proc IntegrationProcessWorkOrder - collate issue
    ...\PastelEVOIntegration\WorkOrder\IntegrationProcessWorkOrder.sql

## 20 July 2021
- New user AUTOMATION and UserGroup SYSTEM. Use when you have external applications, scripts, excel etc performing data alterations.
- Change: API_QueryDocumentProgress increase decimal point on progress percentage.
- Change: Table IntegrationLog column LogOrigin from varchar 20 to 50
- New: Add table FunctionParamaterLookup.
- Change: Table InventoryDailyBalanace add columns ERPSTDCOST and ERPLASTCOST.
- Change: API_QueryDocumentProgressDetail add Instruction and Comment column.
- Change: API_QueryProcesses add Prescripts column.
- Change: API_QueryDocumentProgress add TradingPartnerCode and Description. 
- Change: API_QueryDocuments add InetgrationReference column. Add order by ID.
- Change/Alter: ProcessStepLookupDynamic table change identity seed to 100000.
- Change: Location table, Columns Name and Barcode length changed from 30 to 50.
- New: IntegrationMethodExample.sql – example stored procedure of how to implement custom integration stored proc.
- New Table ProcessStepLookupDynamic
- Change: ProcessStepLookup_View include data from ProcessStepLookupDynamic
- Add TRANSFERDYNAMICPOST process and process step.

## 31 March 2021
### New Process Data StockTakeCount 
    ...\Process\DefaultStockTakeCountProcess.sql
### New Process Data ReturnPost 
    ...\Process\DefaultDocumentPostProcesses.sql (RETURNPOST entry)

## 16 March 2021
### Table ProcessStepLookUp new columns
```sql
[UserName] VARCHAR(20) NULL
```
### View ProcessStepLookUp_View new columns
    [UserName]
## 1 March 2021
- Add API views (web desktop) to create script execution
- Update view API_QueryTrackingEntities, add calculated column for TrackingEntity status

## 10 Jan 2021
### Table Users new columns
```sql
[AllowProcess] BIT NULL DEFAULT 1
[AllowUserGroups] BIT NULL DEFAULT 1
```
### Table DocumentDetail new columns
```sql
[LinePriority] int NULL 
[Instruction] VARCHAR(250) NULL
```
### New Process Data Custom
    …\Process\DefaultCustomProcess.sql (example)



