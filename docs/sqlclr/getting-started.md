
!!! note
	The previous scripts and dlls have been replaced with: SQLCLR_Install.sql
	When opening the SQLCLR_Install.sql it will ask if you want to normalise the endings; select NO.
	Be sure to replace [GraniteDatabase] with the database in which you wish to create the procedures. 

!!! note 
	If you are upgrading from an older version of CLR ensure that you change `Application` in `SystemSettings` table from `GraniteSQLCLR` to `SQLCLR`

## Install SQLCLR

As of Granite version 5, the default database create script will include the installation of SQLCLR procedures.

If you need to manually install SQLCLR version 5, you can find the install script here:


```
todo: final dropbox path.

```

!!! note
	The create script requires the SQL `sysadmin` role to execute successfully. If you do not have the necessary permissions, ask the client's IT to run the script.

<h3>SystemSettings table</h3>

Once the necessary assemblies and procedures have been created, you will need to ensure that your `SystemSettings` table includes the necessary entries:

| Application	| Key					| Value						| Description					| ValueDataType	| isEncrypted	| isActive	|
|---------------|-----------------------|---------------------------|-------------------------------|---------------|---------------|-----------|
| SQLCLR		| Webservice			| http://10.0.0.1:50002		| Granite Webservice Address	| string		| False			| True		|
| SQLCLR		| LabelPrintService		| http://10.0.0.1:50004		| Label Print Service Address	| string		| False			| True		|
| SQLCLR		| IntegrationService	| http://10.0.0.1:50003		| Integration Service Address	| string		| False			| True		|
| SQLCLR		| UtilityAPI    		| https://10.0.0.1:50001	| UtilityAPI Address	    | string		| False			| True		|

## Using the CLR Procedures

The suggested way to start working with your CLR procedures is to right click the procedure in SSMS and select `Script Stored Procedure as` -> `Execute To`

This will ensure that you have all of the necessary variables declared with correct datatypes, and that all parameters are specified for the EXECUTE statement

If you are not specifying a particular value, just set the variable to NULL. The variable must still be supplied as a parameter when executing the CLR procedure.

<h2>Using the CLR Functions</h2>

CLR Functions are used to assist with formatting parameters with a more complex structure - typically a json input.
Each function is related to a specific CLR procedure parameter. 

Doing it this way ensures that the complex parameter is properly formatted, without the need to manually manipulate json.
This is especially helpful on versions of SQL Server that don't support the newer json related functions.

The prefix indicates which of the CLR Procedures it is related to: 

- **"dbo.report_"** for Reporting Service procedures
- **"dbo.email_"** for Email Service procedures
- **"dbo.export"** for SQL Export Service procedures





