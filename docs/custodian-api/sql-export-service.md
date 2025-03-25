# SqlExport Service
## Configuration

The only setup required is to configure the connection string to the Granite database in the `appsettings.json` file.

## Table Export

This process saves data from either a table or a view to the specified file path. The file path has to be on the server where the UtilityAPI is running. To get the file from the server, the easiest option is to send it as an email attachment.

Supported file types are EXCEL (.xlsx) AND CSV (.csv).

Table Export supports filters (Equal, GreaterThan, ect..), order by, offset, and limit.

- **Filters** require the column name, the filter type, and filter value. (For a full list of supported filter types, see the API documentation)
- **OrderBy** requires a column name and an order by type (ASC or DESC). The order in which the order bys are submitted determines the order in which they are applied. 
- **Offset** determines how many rows from the start of the data are skipped. If not set it will default to 0.
- **Limit** determines the number of rows returned from the data. If not set it will default to 10000. 

See the API documentation for more details on how to export a table or view using the API. See the SQLCLR documentation for how to export a table or view using SQLCLR.

## CLR Procedures 

### dbo.clr_TableExport

Use this procedure to export data from a SQL Table or View to either a CSV or Excel file. 

| Parameter Name		| Required	| Description																			|
|-----------------------|-----------|---------------------------------------------------------------------------------------|
| tableName | Yes | The name of the sql table or view to export data from |
| filters | No | The list of filters to be applied to the dataset (see below for details)|
| offset | No | Number of lines to skip from the dataset |
| limit | No | Limit the number of rows exported (if left blank it will default to 10000) | 
| orderByList | No | The list of order by criteria to sort the dataset (see below for details) |
| fileDestinationPath | Yes | Where the report will be save to including the file name.
| filetype | Yes | File type that you want to save as (CSV (.csv),  EXCEL (.xlsx)) |


### dbo.export_AddFilter

This function allows you to build the filters parameter string.

| Parameter Name		| Required	| Description																			|
|-----------------------|-----------|---------------------------------------------------------------------------------------|
| filters | Yes | The string containing the list of filters |
| column | Yes | The name of the column that is being filtered |
| filterType | Yes | The type of filter being applied (Equal, NotEqual, Like, NotLike, StartsWith, EndsWith, Between, GreaterThan, GreaterThanOrEqual, LessThan, LessThanOrEqual) |
| value | Yes | The value applied to the filter |



### dbo.export_AddOrderBy

This function allows you to build the OrderBy parameter string.

| Parameter Name		| Required	| Description																			|
|-----------------------|-----------|---------------------------------------------------------------------------------------|
| orderByList | Yes | The string containing the list of orderby parameters |
| column | Yes | The name of the column that is being order by |
| orderByType | Yes | The type of filter being applied (ASC or DESC) |

- Example usage
```sql
DECLARE @tableName varchar(50) 
DECLARE @offset int
DECLARE @limit int
DECLARE @fileDestinationPath varchar(100)
DECLARE @filetype varchar(20)
DECLARE @orderByList varchar(200)
DECLARE @filters varchar(200)
DECLARE @success bit
DECLARE @message varchar(max)

SELECT @tableName = 'API_QueryStockTotals'
SELECT @fileDestinationPath = 'D:\\Granite WMS\\V5 Demo\\StockInFreezer.csv'
SELECT @filetype = 'CSV'

BEGIN TRY
	SET @orderByList = dbo.export_AddOrderBy(@OrderByList, 'Type', 'DESC')
	SET @orderByList = dbo.export_AddOrderBy(@OrderByList, 'Code', 'ASC')
	SET @filters = dbo.export_AddFilter(@Filters, 'Category', 'Equal', 'Freezer')
	SET @filters = dbo.export_AddFilter(@Filters, 'Qty', 'GreaterThan', '0')

	SET @offset = 0
	SET @limit = 500

	EXEC clr_TableExport 
		@tableName
		,@filters
		,@offset
		,@limit
		,@orderByList
		,@fileDestinationPath 
		,@fileType
		,@success OUTPUT
		,@message OUTPUT
END TRY
BEGIN CATCH
	SELECT @message = ERROR_MESSAGE()
	SELECT @success = 0
END CATCH

SELECT @success, @message

```