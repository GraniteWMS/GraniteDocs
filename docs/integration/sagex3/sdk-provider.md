# SDK Provider

The Sage X3 SDK provider is responsible for mapping Granite transactions to the relevant format for posting to Sage X3. It makes use of the Sage X3 Web Service to communicate with the Sage X3 system through XML-based operations.

The Web Service connection utilizes the CAdxWebServiceXmlCCService with basic authentication support. The provider implements a custom authentication class `CAdxWebServiceXmlCCServiceBasicAuth` that extends the base web service to handle HTTP Basic Authentication with proper domain, username, and password credentials.

## Setup

1. Ensure that the Sage X3 Web Service is properly configured and accessible from the Integration Service server.

2. **Copy** everything in the `Providers\SageX3` folder into the Integration Service folder (root folder).

3. Ensure that the `SDKProvider.config` copied correctly

```xml
<unity xmlns="http://schemas.microsoft.com/practices/2010/unity">
	<assembly name="Granite.Integration.SageX3" />
	<namespace name="Granite.Integration.SageX3" />
	<containers>
		<container name="Provider">
			<register type="Granite.Integration.Contract.IProvider, Granite.Integration.Contract"
						mapTo="Granite.Integration.SageX3.Provider, Granite.Integration.SageX3">
			</register>
		</container>
	</containers>
</unity>
```

4. Configure your connection string and endpoint in the `Granite.Integration.Web.exe.config` file

5. Ensure that the Sage X3 system is configured to allow web service access and that the specified user has appropriate permissions.

## Settings

!!! note
    To pick up any changes to the SystemSettings table, the IntegrationService will need to be restarted.

The settings for Sage X3 are configured in the SystemSettings table. The IntegrationService will pick up the settings using the Application name specified in its `.config` file:
If the setting is missing from the config file or left empty, the IntegrationService will default to using `SageX3` as the SystemSettingsApplicationName.
You can browse to the IntegrationService's `/config` page to have the IntegrationService create the default settings in the SystemSettings table for you.

### Config File Settings

```xml
    <add key="SystemSettingsApplicationName" value="SageX3" />
    <add key="EndPoint" value="http://:40091/" />
```

#### SystemSettingsApplicationName
The Application name of the entries in the SystemSettings table that you want to use for this integration service.
This setting allows you to have multiple integration services running with different settings.

| Application | Key        | Value | Description                                                    |
|-------------|------------|-------|----------------------------------------------------------------|
| SageX3      | BaseUrl    |       | Sage X3 Web Service URL endpoint                             |
| SageX3      | X3Username |       | Sage X3 username for web service authentication              |
| SageX3      | X3Password |       | Sage X3 password for web service authentication (encrypted)   |
| SageX3      | PoolAlias  |       | Sage X3 pool alias for connection context                    |

#### BaseUrl
The complete URL to the Sage X3 Web Service endpoint. This should include the protocol (http/https) and the full path to the web service.

#### X3Username
The username that will be used to authenticate against the Sage X3 Web Service. This user must have appropriate permissions in Sage X3.

#### X3Password
The password for the Sage X3 user. This setting is encrypted in the SystemSettings table for security.

#### PoolAlias
The Sage X3 pool alias that defines the connection context and database instance to use.

## Web Service Operations

The Sage X3 SDK provider supports the following core web service operations:

### Connection Testing
- **Method**: `Connect()`
- **Purpose**: Tests connectivity to the Sage X3 Web Service
- **Operation**: Executes a query against the "ZGPOH" object to verify connection
- **Returns**: Boolean success status and connection message

### Data Operations

#### Read Operation
- **Method**: `Read(string x3ObjectName, CAdxParamKeyValue cAdxParamKeyValue)`
- **Purpose**: Reads data from Sage X3 objects
- **Parameters**:
  - `x3ObjectName`: The name of the X3 object to read from
  - `cAdxParamKeyValue`: Key-value parameters for the read operation
- **Returns**: `CAdxResultXml` containing the result data

#### Save Operation
- **Method**: `Save(string x3ObjectName, string xmlObject)`
- **Purpose**: Saves data to Sage X3 objects
- **Parameters**:
  - `x3ObjectName`: The name of the X3 object to save to
  - `xmlObject`: XML representation of the object data
- **Returns**: `CAdxResultXml` containing the save result

#### Run Operation
- **Method**: `Run(string x3SubProgram, string inputXml)`
- **Purpose**: Executes Sage X3 sub-programs
- **Parameters**:
  - `x3SubProgram`: The name of the X3 sub-program to execute
  - `inputXml`: XML input parameters for the sub-program
- **Returns**: `CAdxResultXml` containing the execution result

## Authentication

The provider implements HTTP Basic Authentication through a custom web service class that:

1. Extends the base `CAdxWebServiceXmlCCService` class
2. Overrides the `GetWebRequest` method to add authentication headers
3. Supports both domain\username and username-only authentication formats
4. Encodes credentials using Base64 encoding
5. Sets the `PreAuthenticate` property to true for improved performance

## Call Context Configuration

Each web service call uses a standardized call context with:
- **Language Code**: "ENG" (English)
- **Pool Alias**: Retrieved from configuration
- **Request Config**: "adxwss.optreturn=JSON" for JSON response format

## Integration Methods

By default, if the method name below is the same as a Granite Transaction type, it will autowire the integration.
If you require a different integration action, you can specify the name below in the Process IntegrationMethod property.

### PICK
- Granite Transaction: **PICK**
- Sage X3: **Sales Order Delivery** (ZGSDHI subprogram)
- Supports:
    - Line Numbers
    - Site/Location mapping
- IntegrationPost:
    - False - Creates sales order delivery
    - True - Creates sales order delivery
- Returns:
    - SDHNUM (Sales Delivery Number)

| Granite                      | Sage X3 Field | Required | Sage X3 Object | Behaviour |
|------------------------------|---------------|----------|----------------|-----------|
| Document                     | SOHNUM        | Y        | SDH0_1         | Sales Order Number |
| DocumentTradingPartnerCode   | BPCORD        | Y        | SDH0_1         | Business Partner Order |
| FromLocation                 | STOFCY        | Y        | SDH0_1         | Site/Facility |
| LineNumber                   | SOPLIN        | Y        | SDH1_4         | Sales Order Line Number |
| Code                         | ITMREF        | Y        | SDH1_4         | Item Reference |
| ActionQty                    | QTY           | Y        | SDH1_4         | Quantity |
| -                            | CCE1          | N        | SDH1_4         | Cost Center 1 (defaults to "WHG") |
| -                            | CCE2          | N        | SDH1_4         | Cost Center 2 (defaults to "STS7") |
| -                            | CCE3          | N        | SDH1_4         | Cost Center 3 (defaults to "HO") |

### RECEIVE
- Granite Transaction: **RECEIVE**
- Sage X3: **Purchase Order Receipt** (ZGPTH2 object)
- Supports:
    - UOM (Unit of Measure)
    - Site/Location mapping
- IntegrationPost:
    - False - Saves purchase order receipt
    - True - Saves purchase order receipt
- Returns:
    - PTHNUM (Purchase Receipt Number)

| Granite                      | Sage X3 Field | Required | Sage X3 Object | Behaviour |
|------------------------------|---------------|----------|----------------|-----------|
| Document                     | POHNUM        | Y        | PTH1_2         | Purchase Order Number |
| DocumentTradingPartnerCode   | BPSNUM        | Y        | PTH0_1         | Business Partner Supplier |
| ToLocation                   | PRHFCY        | Y        | PTH0_1         | Receipt Facility |
| Code                         | ITMREF        | Y        | PTH1_2         | Item Reference |
| ActionQty                    | QTYUOM        | Y        | PTH1_2         | Quantity in UOM |
| UOM                          | UOM           | Y        | PTH1_2         | Unit of Measure |
| -                            | STA           | N        | PTH1_2         | Status (defaults to "A" - Active) |

## Transaction Grouping

Both PICK and RECEIVE transactions implement intelligent grouping logic:

### PICK Grouping
Transactions are grouped by:
- Document
- LineNumber
- Code (Item)
- FromLocation
- FromSite

ActionQty values are summed for grouped transactions.

### RECEIVE Grouping
Transactions are grouped by:
- Document
- LineNumber
- Code (Item)
- ToLocation
- ToSite
- UOM

ActionQty values are summed for grouped transactions.


