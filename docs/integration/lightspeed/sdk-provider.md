# SDK Provider

The LightSpeed SDK provider is responsible for mapping Granite Transactions to the relevant format for posting to LightSpeed. It makes use of the LightSpeed REST API with OAuth 2.0 authentication.

## How it connects
The provider connects to LightSpeed using OAuth 2.0 authentication flow. The connection requires:
- Client ID and Client Secret for API access
- Account ID to identify the specific LightSpeed account
- Access and refresh tokens for authentication (automatically managed)

## Setup

1. **Copy** everything in the `Providers\\LightSpeed` folder into Integration Service folder (root folder).

2. Ensure `SDKProvider.xml` setup or copied correctly
    ```xml
    <module name="Provider">
    <bind
        service="Granite.Integration.Contract.IProvider, Granite.Integration.Contract"
        to="Granite.Integration.LightSpeed.Provider, Granite.Integration.LightSpeed"/>
    </module>
    ```

3. Configure your connection string and endpoint in the `Granite.Integration.Web.exe.config` file

## Settings

!!! note
    To pick up any changes to the SystemSettings table, the IntegrationService will need to be restarted. 

The settings for LightSpeed are configured in the SystemSettings table. The IntegrationService will pick up the settings using the Application name specified in it's `.config` file:
If this setting is missing from the config file or left empty, the IntegrationService will default to using `LightSpeed` as the SystemSettingsApplicationName.
You can browse the IntegrationService's `/config` page to have the IntegrationService create the default settings in the SystemSettings table for you.

### Config File Settings

```xml
    <add key="SystemSettingsApplicationName" value="LightSpeed" />
    <add key="EndPoint" value="http://localhost:40091/" />
```
#### SystemSettingsApplicationName
The Application name of the entries in the SystemSettings table that you want to use for this integration service. If this setting is the same as Application name for the ScheduledJobs they can use the same SystemSettings.

This setting allows you to have multiple integration services running with different settings.

### SystemSettings

##### BaseUrl
The base URL for the LightSpeed REST API. Default value is `https://api.lightspeedapp.com/API/V3/Account/`

##### AuthUrl
The authentication URL for OAuth token requests. Default value is `https://cloud.lightspeedapp.com/auth/oauth/token`

##### client_id
The OAuth client ID provided by LightSpeed for API access.

##### client_secret
The OAuth client secret provided by LightSpeed for API access. This setting is encrypted for security.

##### AccountID
The LightSpeed Account ID that identifies your specific LightSpeed account.

##### access_token
The OAuth access token for API authentication. This is automatically managed by the integration.

##### refresh_token
The OAuth refresh token used to renew access tokens. This is automatically managed by the integration.

##### DryRun
Boolean setting to enable dry run mode for testing. When set to true, the integration will log actions without making actual API calls. Default value is `false`.


### LightSpeed Settings

The LightSpeed integration requires OAuth 2.0 credentials and configuration settings to be properly configured in the SystemSettings table before the integration can function.

## Integration Methods

By default if the method names below is the same as a Granite Transaction type, it will autowire the integration. 
If you require a different integration action you can specify the name below in the Process IntegrationMethod property.

### RECEIVE
- Granite Transaction: **RECEIVE**
- LightSpeed: **Order Line Update (numReceived)**
- Supports:
    - Multiple items per document
    - Partial receiving
    - Quantity validation
- Integration Post
    - False - Validates the transaction but does not update LightSpeed
    - True - Updates the numReceived field on the corresponding LightSpeed purchase order lines
- Returns:
    Order ID and timestamp of the successful posting

| Granite | LightSpeed Entity | Required | Behavior |
|---------|------------------|----------|----------|
| Document | Purchase Order ID | Y | Maps to the ERP ID of the purchase order |
| LineNumber | Order Line | Y | Maps to the specific line within the purchase order |
| ActionQty | numReceived | Y | Updates the quantity received on the order line |
| Code | Item | Y | Used for validation and item lookup |


### ADJUSTMENT
- Granite Transaction: **ADJUSTMENT**
- LightSpeed: **ItemShop Quantity Update**
- Supports:
    - Positive and negative adjustments
    - Single location per transaction batch
    - Quantity validation to prevent negative inventory
- Returns:
    ItemShop ID and timestamp of the successful posting

| Granite | LightSpeed Entity | Required | Behavior |
|---------|------------------|----------|----------|
| Code | Item ID | Y | Maps to LightSpeed Item via ERPIdentification |
| FromLocation | Shop ID | Y | Identifies the LightSpeed shop/location |
| ToQty - FromQty | qoh adjustment | Y | Net change applied to quantity on hand |

### SCRAP
- Granite Transaction: **SCRAP**
- LightSpeed: **ItemShop Quantity Update**
- Supports:
    - Negative quantity adjustments only
    - Single location per transaction batch
    - Quantity validation to prevent negative inventory
- Returns:
    ItemShop ID and timestamp of the successful posting

| Granite | LightSpeed Entity | Required | Behavior |
|---------|------------------|----------|----------|
| Code | Item ID | Y | Maps to LightSpeed Item via ERPIdentification |
| FromLocation | Shop ID | Y | Identifies the LightSpeed shop/location |
| ActionQty | qoh reduction | Y | Amount to subtract from quantity on hand (posted as negative) |

### DYNAMICTRANSFER
- Granite Transaction: **TRANSFER**
- LightSpeed: **Inventory Transfer Creation**
- Supports:
    - Multi-item transfers
    - Location-to-location transfers
    - Document reference tracking
- Returns:
    Inventory Transfer ID

| Granite | LightSpeed Entity | Required | Behavior |
|---------|------------------|----------|----------|
| Document | Transfer Note | Y | Creates reference note in transfer |
| DocumentDescription | Transfer Note | N | Appended to reference note |
| FromLocation | SendingShopID | Y | Source location for the transfer |
| ToLocation | ReceivingShopID | Y | Destination location for the transfer |
| Code | ItemID | Y | Items to be transferred |
| ActionQty | ToSend | Y | Quantity to transfer for each item |


## Error Handling

The provider includes comprehensive error handling:

- Connection validation before processing
- Single document/location validation for consistency
- Quantity validation to prevent invalid states
- Detailed error messages for troubleshooting
- Dry run mode for testing without affecting live data
