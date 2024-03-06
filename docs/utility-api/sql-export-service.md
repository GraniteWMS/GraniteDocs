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