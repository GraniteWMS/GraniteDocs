# Accpac

This document contains all of the information needed to set up and configure integration with Accpac.
There are two parts to the complete integration solution:

The [SDK Provider](#sdk-provider) is used by the Integration Service to map transactions performed in Granite to the relevant format for Accpac.

The [integration jobs](#integration-jobs) are used by the [Scheduler](../scheduler/manual.md) to pull Accpac's documents, item codes, and trading partners into Granite.

## SDK Provider

The Accpac SDK provider is responsible for mapping Granite transactions to the relevant format for posting to Accpac. It makes use of the Accpac Advantage SDK to post to Accpac.

### Setup
1. Check the version of the Accpac SDK that is currently installed on the server. The SDK is usually found at `C:\Program Files (x86)\Common Files\Sage\Sage 300 ERP`. Take note of the first two numbers of `Accpac.Advantage.dll` file version.

    **`Take Note`** If the SDK is not yet installed, please engage with the client's Accpac consultant - the SDK is required for Granite integration.

2. In the `Providers\Accpac` folder, find the `AccpacX.Y` folder matching the installed SDK version. `X.Y` must match the first two numbers of the installed SDK version.
For example, if the installed SDK version is 6.5.0.30, you will take the files from the Accpac6.5 folder

3. **Copy** the dll's from the `Providers\Accpac\AccpacX.Y` folder into Integration Service folder (root folder).
    - ACCPAC.Advantage.COMSVR.Interop.dll
    - ACCPAC.Advantage.dll
    - ACCPAC.Advantage.Server.dll
    - ACCPAC.Advantage.Types.dll
    
4. **Copy** the following from the `Providers\Accpac` folder into Integration Service folder (root folder)
    - docs folder
    - Granite.Integration.Accpac.dll
    - SDKProvider.xml

5. Ensure `SDKProvider.xml` setup or copied correctly

        <module name="Provider">
        <bind
            service="Granite.Integration.Contract.IProvider, Granite.Integration.Contract"
            to="Granite.Integration.Accpac.Provider, Granite.Integration.Accpac"/>
        </module>

6. Open the `DependentAssembly.xml` file in your `AccpacX.Y` folder and copy it's contents. Paste the contents into the `<assemblyBinding xmlns="urn:schemas-microsoft-com:asm.v1">` node near the bottom of the `Granite.Integration.Web.exe.config` file. It should look like this:

        <assemblyBinding xmlns="urn:schemas-microsoft-com:asm.v1">
        <dependentAssembly>
            <assemblyIdentity name="Iesi.Collections" publicKeyToken="aa95f207798dfdb4" culture="neutral" />
            <bindingRedirect oldVersion="0.0.0.0-4.0.0.0" newVersion="4.0.0.0" />
        </dependentAssembly>
        <dependentAssembly>
            <assemblyIdentity name="Ninject" publicKeyToken="c7192dc5380945e7" culture="neutral" />
            <bindingRedirect oldVersion="0.0.0.0-3.3.4.0" newVersion="3.3.4.0" />
        </dependentAssembly>
        <dependentAssembly>
            <assemblyIdentity name="System.Threading.Tasks.Extensions" publicKeyToken="cc7b13ffcd2ddd51" culture="neutral" />
            <bindingRedirect oldVersion="0.0.0.0-4.2.0.1" newVersion="4.2.0.1" />
        </dependentAssembly>
        <dependentAssembly>
            <assemblyIdentity name="ACCPAC.Advantage.COMSVR.Interop" publicKeyToken="4d7048ecf2312a7c" culture="neutral" />
            <bindingRedirect oldVersion="0.0.0.0-7.0.0.0" newVersion="6.6.0.0" />
        </dependentAssembly>
        <dependentAssembly>
            <assemblyIdentity name="ACCPAC.Advantage" publicKeyToken="4d7048ecf2312a7c" culture="neutral" />
            <bindingRedirect oldVersion="0.0.0.0-7.0.0.0" newVersion="6.6.0.0" />
        </dependentAssembly>
        <dependentAssembly>
            <assemblyIdentity name="ACCPAC.Advantage.Server" publicKeyToken="4d7048ecf2312a7c" culture="neutral" />
            <bindingRedirect oldVersion="0.0.0.0-7.0.0.0" newVersion="6.6.0.0" />
        </dependentAssembly>
        <dependentAssembly>
            <assemblyIdentity name="ACCPAC.Advantage.Types" publicKeyToken="4d7048ecf2312a7c" culture="neutral" />
            <bindingRedirect oldVersion="0.0.0.0-7.0.0.0" newVersion="6.6.0.0" />
        </dependentAssembly>
        </assemblyBinding>

7. Configure your connection string and endpoint in the `Granite.Integration.Web.exe.config` file

### Settings

**`Take Note`** To pick up any changes to the SystemSettings table, the IntegrationService will need to be restarted.

The settings for Sage 300 (Accpac) are configured in the SystemSettings table. The IntegrationService will pick up the settings using the Application name specified in it's `.config` file:
If this setting is missing from the config file or left empty, the IntegrationService will default to using `IntegrationSage300` as the SystemSettingsApplicationName
You can browse the IntegrationService's `/config` page to have the IntegrationService create the default settings in the SystemSettings table for you.

#### Config File Settings

```xml
    <add key="SystemSettingsApplicationName" value="IntegrationSage300" />
    <add key="EndPoint" value="http://:40091/" />
```
##### SystemSettingsApplicationName
The Application name of the entries in the SystemSettings table that you want to use for this integration service.
This setting allows you to have multiple integration services running with different settings.

#### Database SystemSettings
The script to insert the default settings is located in the GraniteDatabase release.
```
~\GraniteDatabase\Data\SystemSettings\SystemSettingsAccpac.sql
```


| Application        | Key                                     | Value | Description                                             | 
|--------------------|-----------------------------------------|-------|---------------------------------------------------------|
| IntegrationSage300 | UserID                                  |       | Sage300 user name                                       |
| IntegrationSage300 | Password                                |       | Sage300 user password                                   |
| IntegrationSage300 | CompanyID                               |       | Sage300 company ID                                      |
| IntegrationSage300 | POExchangeRate                          | false | Override exchange rate for PO and Multiple PO           |
| IntegrationSage300 | PurchaseOrderOverrideLocation           | false | Override line location for PO and Multiple PO           |
| IntegrationSage300 | RoundSummarizedActionQty                | true  | Round summed ActionQty when posting transfers and moves |
| IntegrationSage300 | RoundSummarizedActionQtyToDecimalPlaces | 2     | Number of decimal places to round ActionQty to          |

##### POExhangeRate
  - Options: true or false
  - Used by: RECEIVE and RECEIVINGPOSTMULTIPLE
  - Override the Receipt rate with the Purchase Order rate
  - PO rate source: SELECT RATE FROM POPORH1 WHERE PONUMBER = 'your_po_number'

##### PurchaseOrderOverrideLocation
  - Options: true or false
  - Used by: RECEIVE and RECEIVINGPOSTMULTIPLE
  - Override the Receipt location with Granite location

##### RoundSummarizedActionQty
  - Options: true or false
  - Used by:
    - Replenish
    - Move
    - Dynamic Transfer
  - Turns rounding for summed ActionQty on or off

##### RoundSummarizedActionQtyToDecimalPlaces
  - Options: integer value
  - Used by:
    - Replenish
    - Move
    - Dynamic Transfer
  - Only comes into effect if RoundSummarizedActionQty is true
  - Sets the number of decimal places that we round the summed ActionQty to

### Integration Methods

By default if the method name below is the same as a Granite Transaction type, it will autowire the integration.
If you require a different integration action you can specify the name below in the Process IntegrationMethod property.


#### TAKEON
- Granite Transaction: **TAKEON**
- Accpac: **I/C Receipts**
- Supports: 
    - Integration Reference
    - Lots
    - Serials
    - UOM
- IntegrationPost:
    - False - Saves receipt
    - True - Posts receipt
- Returns:
    - RECPNUMBER
  
| Granite                | Accpac SDK | Required | Accpac Table | Behaviour |
|------------------------|------------|----------|--------------|-----------|
| IntegrationReference   | RECPNUMBER | Y        | ICREEH       | Create or update if exists, if empty follows Accpac sequence |
| ID                     | REFERENCE  | Y        | ICREEH       ||
| MasterItemCode         | ITEMNO     | Y        | ICREED       ||
| ERPLocation            | LOCATION   | Y        | ICREED       ||
| Qty                    | RECPQTY    | Y        | ICREED       ||
| Lot                    | LOTNUMF    | N        | ICREEDL      ||
| Qty                    | QTY        | N        | ICREEDL      ||
| Serial                 | SERIALNUMF | N        | ICREEDS      ||

#### ADJUSTMENT 
- Granite Transaction: **ADJUSTMENT**
- Accpac: **I/C Adjustments**
    - Adjustment Type: **Decrease Quantity** OR **Increase Quantity**
- Supports:
    - Integration Reference
    - Lots 
    - Serials
    - WOFFACCT (GL Account), mapped to Granite Comment
- IntegrationPost:
    - False - Saves adjustment
    - True - Posts adjustment
- Returns:
    - DOCNUM

| Granite              | Accpac SDK | Required | Accpac Table | Behaviour |
|----------------------|------------|----------|--------------|-----------|
| IntegrationReference | DOCNUM     | N        | ICADEH       | Create or update if exists, if empty follows Accpac sequence |
| MasterItemCode       | ITEMNO     | Y        | ICADED       ||
| FromLocation         | LOCATION   | Y        | ICADED       ||
| ActionQty            | QUANTITY   | Y        | ICADED       ||
| Batch                | LOTNUMF    | N        | ICADEDL      ||
| ActionQty            | QTY        | N        | ICADEDL      ||
| SerialNumber         | SERIALNUMF | N        | ICADEDS      ||
| Comment              | WOFFACCT   | N        | ICADED       |if comment not empty, this is the GL account|

#### ADJUSTMENT_COST

Same as ADJUSTMENT but Adjustment Type set to **Cost**
- Adjustment Type: **Decrease Cost** OR **Increase Cost**

#### ADJUSTMENT_BOTH

Same as ADJUSTMENT but Adjustment Type set to **Both** (Cost & Qty)
- Adjustment Type: **Decrease Both** OR **Increase Both**

#### ADJUSTMENTSTATUS

**`Take Note`** Document field on Granite transaction that is posted must match the Adjustment Number in Accpac.

- Granite Transaction: **ADJUSTMENT**
- Accpac: **I/C Adjustments**
    - Updates the status of the adjustment to Posted
  
#### RECLASSIFY

- Granite Transaction: **RECLASSIFY**
- Accpac: **I/C Adjustments**
    - Adjustment Type: **Decrease Quantity** AND **Increase Quantity**
- Support 
    - Integration Reference (Accpac Adjustment number, create or update if exists) 
    - Lots 
    - Serials
- IntegrationPost:
    - False - Saves adjustment
    - True - Posts adjustment
- Returns:
    - DOCNUM

| Granite              | Accpac SDK | Required | Accpac Table | Behaviour |
|----------------------|------------|----------|--------------|-----------|
| IntegrationReference | DOCNUM     | N        | ICADEH       | Create or update if exists, if empty follows Accpac sequence |
| MasterItemCode       | ITEMNO     | Y        | ICADED       ||
| FromLocation         | LOCATION   | Y        | ICADED       ||
| ActionQty            | QUANTITY   | Y        | ICADED       ||
| Batch                | LOTNUMF    | N        | ICADEDL      ||
| ActionQty            | QTY        | N        | ICADEDL      ||
| SerialNumber         | SERIALNUMF | N        | ICADEDS      ||

  
#### RECLASSIFY_COST
Same as RECLASSIFY but Adjustment Type set to **COST**
- Adjustment Type: **Decrease Cost** AND **Increase Cost**

#### RECLASSIFY_BOTH

Same as RECLASSIFY but Adjustment Type set to **BOTH** (Cost & Qty)
- Adjustment Type: **Decrease Both** AND **Increase Both**

#### RECLASSIFY_SPLIT

Same as RECLASSIFY but **Decrease Quantity** and **Increase Quantity** post as two separate Adjustments in Accpac

#### SCRAP
- Granite Transaction: **SCRAP**
- Accpac: **I/C Adjustments**
    - Adjustment Type **Decrease Quantity**
- Supports: 
    - Integration Reference 
    - Lots
    - Serials
- IntegrationPost:
    - False - Saves adjustment
    - True - Posts adjustment
- Returns:
    - DOCNUM

| Granite              | Accpac SDK | Required | Accpac Table | Behaviour |
|----------------------|------------|----------|--------------|-----------|
| IntegrationReference | DOCNUM     | N        | ICADEH       | Create or update if exists, if empty follows Accpac sequence |
| MasterItemCode       | ITEMNO     | Y        | ICADED       ||
| FromLocation         | LOCATION   | Y        | ICADED       ||
| ActionQty            | QUANTITY   | Y        | ICADED       ||
| Batch                | LOTNUMF    | N        | ICADEDL      ||
| ActionQty            | QTY        | N        | ICADEDL      ||
| SerialNumber         | SERIALNUMF | N        | ICADEDS      ||


#### SCRAP_COST

Same as SCRAP but Adjustment Type set to **COST**
- Adjustment Type: **Decrease Cost**
 
#### SCRAP_BOTH

Same as SCRAP but Adjustment Type set to **BOTH**
- Adjustment Type: **Decrease Both**

#### MOVE
- Granite Transaction: **MOVE**
- Accpac: **I/C Transfers** Type Transfer 
- Supports: 
    - RoundSummarizedActionQty (See setting description)
    - RoundSummarizedActionQtyToDecimalPlaces (See setting description)
    - Integration Reference
    - Serial
    - Lot
    - Comment 
- IntegrationPost:
    - False - Saves transfer
    - True - Posts transfer
- Returns:
    - DOCNUM

| Granite              | Accpac SDK | Required | Accpac Table | Behaviour |
|----------------------|------------|----------|--------------|-----------|
| IntegrationReference | DOCNUM     | N        | ICTREH       | Create or update if exists, if empty follows Accpac sequence |
| Document             | REFERENCE  | N        | ICTREH       ||
| MasterItemCode       | ITEMNO     | Y        | ICTRED       ||
| FromLocation         | FROMLOC    | Y        | ICTRED       ||
| ToLocation           | TOLOC      | Y        | ICTRED       ||
| Comment              | COMMENTS   | N        | ICTRED       ||
| ActionQty            | QTYREQ     | Y        | ICTRED       ||
| Batch                | LOTNUMF    | N        | ICTREDL      ||
| ActionQty            | QTY        | N        | ICTREDL      ||
| SerialNumber         | SERIALNUMF | N        | ICTREDS      ||

#### REPLENISH
- Granite Transaction: **REPLENISH**
- Accpac: **I/C Transfers** Type Transfer 
- Supports: 
    - RoundSummarizedActionQty (See setting description)
    - RoundSummarizedActionQtyToDecimalPlaces (See setting description)
    - Integration Reference 
    - Serial
    - Lot
    - Comment 
- IntegrationPost:
    - False - Saves transfer
    - True - Posts transfer
- Returns:
    - DOCNUM

| Granite              | Accpac SDK | Required | Accpac Table | Behaviour |
|----------------------|------------|----------|--------------|-----------|
| IntegrationReference | DOCNUM     | N        | ICTREH       | Create or update if exists, if empty follows Accpac sequence |
| Document             | REFERENCE  | N        | ICTREH       ||
| MasterItemCode       | ITEMNO     | Y        | ICTRED       ||
| FromLocation         | FROMLOC    | Y        | ICTRED       ||
| ToLocation           | TOLOC      | Y        | ICTRED       ||
| Comment              | COMMENTS   | N        | ICTRED       ||
| ActionQty            | QTYREQ     | Y        | ICTRED       ||
| Batch                | LOTNUMF    | N        | ICTREDL      ||
| ActionQty            | QTY        | N        | ICTREDL      ||
| SerialNumber         | SERIALNUMF | N        | ICTREDS      ||

#### TRANSFER
- Granite Transaction: **TRANSFER**
- Accpac: **I/C Transfers **
    - Type: Transfer, Transit and Receipt, based on Granite document type.
- Supports:
    - Serial
    - LOT
- IntegrationPost:
    - False - Saves transfer
    - True - Posts transfer
- Returns:
    - DOCNUM

| Granite              | Accpac SDK | Required | Accpac Table |
|----------------------|------------|----------|--------------|
| Document             | REFERENCE  | N        | ICTREH       |
| MasterItemCode       | ITEMNO     | Y        | ICTRED       |
| FromLocation         | FROMLOC    | Y        | ICTRED       |
| ToLocation           | TOLOC      | Y        | ICTRED       |
| ActionQty            | QTYREQ     | Y        | ICTRED       |
| Batch                | LOTNUMF    | N        | ICTREDL      |
| ActionQty            | QTY        | N        | ICTREDL      |
| SerialNumber         | SERIALNUMF | N        | ICTREDS      |

#### TRANSFERRECEIPT
- Granite Transaction: **TRANSFER**
- Accpac: **I/C Transfers **
    - Type: Receipt
- Supports:
    - Serial
    - LOT
- Returns:
    - DOCNUM

| Granite              | Accpac SDK | Required | Accpac Table |
|----------------------|------------|----------|--------------|
| Document             | REFERENCE  | N        | ICTREH       |
| MasterItemCode       | ITEMNO     | Y        | ICTRED       |
| FromLocation         | FROMLOC    | Y        | ICTRED       |
| ToLocation           | TOLOC      | Y        | ICTRED       |
| ActionQty            | QTYREQ     | Y        | ICTRED       |
| Batch                | LOTNUMF    | N        | ICTREDL      |
| ActionQty            | QTYMOVED   | N        | ICTREDL      |
| SerialNumber         | SERIALNUMF | N        | ICTREDS      |

#### DYNAMICTRANSFER
- Granite Transaction: **DYNAMICTRANSFER**
- Accpac: **I/C Transfers** Type Transfer 
- Supports: 
    - RoundSummarizedActionQty (See setting description)
    - RoundSummarizedActionQtyToDecimalPlaces (See setting description)
    - Integration Reference (Accpac Transfer number, create or update if exists) 
    - Serial
    - Lot
    - Comment (Accpac Comments field)
- IntegrationPost:
    - False - Saves transfer
    - True - Posts transfer
- Returns:
    - DOCNUM

| Granite              | Accpac SDK | Required | Accpac Table | Behaviour |
|----------------------|------------|----------|--------------|-----------|
| IntegrationReference | DOCNUM     | N        | ICTREH       | Create or update if exists, if empty follows Accpac sequence |
| Document             | REFERENCE  | N        | ICTREH       ||
| MasterItemCode       | ITEMNO     | Y        | ICTRED       ||
| FromLocation         | FROMLOC    | Y        | ICTRED       ||
| ToLocation           | TOLOC      | Y        | ICTRED       ||
| Comment              | COMMENTS   | N        | ICTRED       ||
| ActionQty            | QTYREQ     | Y        | ICTRED       ||
| Batch                | LOTNUMF    | N        | ICTREDL      ||
| ActionQty            | QTY        | N        | ICTREDL      ||
| SerialNumber         | SERIALNUMF | N        | ICTREDS      ||

#### PICK

**`Take Note`** IntegrationPost setting does not affect saving/invoicing for SalesOrder. Default Create Invoice option must be switched on/off in Accpac.


- Granite Transaction: **PICK**
- Accpac: **O/E Transactions Order Entry**
- Supports:
    - Serial
    - Lot

- IntegrationPost:
    - Not supported, see NOTE above
- Returns:
    - LASTSHINUM if there is one, else LASTINVNUM

| Granite    | Accpac SDK | Required | Accpac Table | Behaviour |
|------------|------------|----------|--------------|-----------|
| Document   | ORDNUMBER  | Y        | OEORDH       ||
| LineNumber | LINENUM    | Y        | OEORDD       ||
| Qty        | QTYSHIPPED | Y        | OEORDD       ||
| Lot        | LOTNUMF    | N        | OEORDDL      ||
| Qty        | QTY        | N        | OEORDDL      ||
| Serial     | SERIALNUMF | N        | OEORDDS      ||

#### PICKWEIGHT

**`Take Note`** Weight of the item being picked in Granite must be in the Transaction Comment field. This will post to the EXTWEIGHT field in Accpac.


- Granite Transaction: **PICK**
- Accpac: **O/E Transactions Order Entry**
- Supports:
    - Comment (posts to Accpac EXTWEIGHT field)
- IntegrationPost:
    - True - CREATEINV will be set to true
    - False - CREATEINV will be set to false
- Returns:
    - SHINUMBER if there is one, else LASTINVNUM

| Granite    | Accpac SDK | Required | Accpac Table | Behaviour |
|------------|------------|----------|--------------|-----------|
| Document   | ORDNUMBER  | Y        | OESHIH       ||
| LineNumber | ORDLINENUM | Y        | OESHID       ||
| ActionQty  | QTYSHIPPED | Y        | OESHID       ||
| Comment    | EXTWEIGHT  | Y        | OESHID       ||

#### DYNAMICPICK
- Granite Transaction: **PICKINGDYNAMIC**
- Accpac: **O/E Transactions Order Entry**
    - Create and Post
- Supports:
    - UOM
- IntegrationPost:
    - Order will always be Processed regardless of setting
    - True - Check Customer Credit Limit
- Returns:
    - LASTSHINUM if there is one, else LASTINVNUM

| Granite      | Accpac SDK | Required | Accpac Table | Behaviour |
|--------------|------------|----------|--------------|-----------|
| Document     | ORDNUMBER  | Y        | OEORDH       ||
| FromLocation | LOCATION   | Y        | OEORDH       ||
| LineNumber   | LINENUM    | Y        | OEORDD       ||
| ActionQty    | QTYORDERED | Y        | OEORDD       ||
| ActionQty    | QTYSHIPPED | Y        | OEORDD       | Only applies if IntegrationPost is true |
| UOM          | ORDUNIT    | N        | OEORDD       ||

#### RECEIVE
- Granite Transaction: **RECEIVE**
- Accpac: **P/O Transactions Purchase Order Entry**
- Supports: 
    - POExchangeRate (See setting description)
    - PurchaseOrderOverrideLocation (See setting description)
    - DocumentReference (posts to the REFERENCE field in Accpac)
    - Lots with ExpiryDate
    - Serials
    - UOM
- IntegrationPost:
    - Not supported, will always process receipt
- Returns:
    - RCPNUMBER

| Granite           | Accpac SDK | Required | Accpac Table | Behaviour |
|-------------------|------------|----------|--------------|-----------|
| Document          | PONUMBER   | Y        | PORCPH1      ||
| DocumentReference | REFERENCE  | Y        | PORCPH1      ||
| UOM               | RCPUNIT    | Y        | PORCPL       ||
| ActionQty         | RQRECEIVED | Y        | PORCPL       ||
| ToLocation        | LOCATION   | Y        | PORCPL       | Only applies if PurchaseOrderOverrideLocation is true |
| MasterItemCode    | ITEMNO     | Y        | PORCPL       ||
| Batch             | LOTNUMF    | N        | PORCPLL      ||
| ExpiryDate         | EXPIRYDATE | N        | PORCPLL      ||
| ActionQty         | QTY        | N        | PORCPLL      ||
| SerialNumber      | SERIALNUMF | N        | PORCPLS      ||

#### RECEIVINGPOSTMULTIPLE
- Granite Transaction: **RECEIVE**
- Accpac: **P/O Transactions Purchase Order Entry**
- Supports:
    - POExchangeRate (See setting description)
    - PurchaseOrderOverrideLocation (See setting description)
    - DocumentReference (posts to REFERENCE field in Accpac)
    - Lots with ExpiryDate
    - Serials
    - UOM
- IntegrationPost:
    - Not supported, will always process receipt
- Returns:
    - RCPNUMBER

| Granite           | Accpac SDK | Required | Accpac Table | Behaviour |
|-------------------|------------|----------|--------------|-----------|
| Document          | PONUMBER   | Y        | PORCPR       ||
| DocumentReference | REFERENCE  | Y        | PORCPH1      ||
| UOM               | RCPUNIT    | Y        | PORCPL       ||
| ActionQty         | RQRECEIVED | Y        | PORCPL       ||
| ToLocation        | LOCATION   | Y        | PORCPL       | Only applies if PurchaseOrderOverrideLocation is true |
| MasterItemCode    | ITEMNO     | Y        | PORCPL       ||
| Batch             | LOTNUMF    | N        | PORCPLL      ||
| ExpiryDate         | EXPIRYDATE | N        | PORCPLL      ||
| ActionQty         | QTY        | N        | PORCPLL      ||
| SerialNumber      | SERIALNUMF | N        | PORCPLS      ||

#### RETURNRECEIPT

**`Take Note`** Return document must be brought in to Granite as an ORDER document. 
We pick against it to reduce stock, and when we post we update the Return document's qtys.

- Granite Transaction: **PICK**
- Accpac: **P/O Transactions Receipt Entry**
- IntegrationPost:
    - Not supported, will always create return
- Returns:
    - RETNUMBER

| Granite           | Accpac SDK | Required | Accpac Table | Behaviour |
|-------------------|------------|----------|--------------|-----------|
| Document          | RCPNUMBER  | Y        | PORETH1      ||
| LineNumber        | RCPLSEQ    | Y        | PORETL       ||
| ActionQty         | RQRETURNED | Y        | PORETL       ||

#### MANUFACTURE
- Granite Transaction: **MANUFACTURE**
- Accpac: **I/C Transactions Assemblies**
- Supports:
    - Comment
- IntegrationPost:
    - False - Enters assembly
    - True - Posts assembly
- Returns:
    - Comma separated list of DOCNUM

| Granite        | Accpac SDK | Required | Accpac Table | Behaviour |
|----------------|------------|----------|--------------|-----------|
| MasterItemCode | ITEMNO     | Y        | ICASEN       ||
| Comment        | BOMNO      | Y        | ICASEN       | Must contain Accpac BOMNO |
| FromLocation   | LOCATION   | Y        | ICASEN       ||
| ActionQty      | QUANTITY   | Y        | ICASEN       ||

#### UPDATE_ASSEMBLIES
- Granite Transaction: **CONSUME**
- Accpac: **I/C Transactions Assemblies**
- Supports:
    - Transaction IDs 
- IntegrationPost:
    - False - Enters assembly
    - True - Posts assembly
- Returns:
    - DOCNUM

| Granite        | Accpac SDK | Required | Accpac Table | Behaviour |
|----------------|------------|----------|--------------|-----------|
| Document       | DOCNUM     | Y        | ICASEN       ||
| MasterItemCode | ITEMNO     | Y        | ICASEN       ||
| ActionQty      | QUANTITY   | Y        | ICASEN       ||
| Transaction ID | REFERENCE  | Y        | ICASEN       ||

#### ***INTERNALUSAGE

**`Take Note`** Can be used with multiple Granite Transaction Types (Adjsutment, Scrap etc.). 
Granite Transactions must be linked to a document with a number matching the Accpac Internal Usage number


- Granite Process IntegrationMethod: **INTERNALUSAGE**
- Accpac: **I/C Transactions Internal Usage**. 
    - Based on document, update internal usage
- IntegrationPost:
    - False - Saves internal usage
    - True - Posts internal usage
    - GLACCT (GL Account), mapped to Granite Comment
- Returns:
    - DOCNUM

| Granite           | Accpac SDK | Required | Accpac Table | Behaviour |
|-------------------|------------|----------|--------------|-----------|
| Document          | DOCNUM     | Y        | ICICEH       | Must be the Accpac Internal Usage DOCNUM |
| "GRANITE WMS"     | REFERENCE  | Y        | ICICEH       ||
| MasterItemCode    | ITEMNO     | Y        | ICICED       ||
| FromLocation      | LOCATION   | Y        | ICICED       ||
| ActionQty         | QUANTITY   | Y        | ICICED       ||
| Comment           | GLACCT     | N        | ICICED       |if comment not empty, this is the GL account|

#### ***INTERNALUSAGEDYNAMIC

**`Take Note`** Can be used with multiple Granite Transaction Types, set the Process' IntegrationMethod to INTERNALUSAGEDYNAMIC to post. 

- Granite Process IntegrationMethod: **INTERNALUSAGEDYNAMIC**
- Accpac: **I/C Transactions Internal Usage**
- Supports: 
    - Integration Reference (Accpac Internal Usage Number)
    - Lots
- IntegrationPost:
    - False - Saves internal usage
    - True - Posts internal usage
- Returns:
    - DOCNUM

| Granite              | Accpac SDK | Required | Accpac Table | Behaviour |
|----------------------|------------|----------|--------------|-----------|
| IntegrationReference | DOCNUM     | Y        | ICICEH       | Create or update if exists, if empty follows Accpac sequence |
| "GRANITE WMS"        | REFERENCE  | Y        | ICICEH       ||
| LineNumber           | LINENO     | Y        | ICICED       ||
| ActionQty            | QUANTITY   | Y        | ICICED       ||
| Batch                | LOTNUMF    | N        | ICICEDL      ||
| ActionQty            | QTY        | N        | ICICEDL      ||

#### ***ISSUE

**`Take Note`** Requires custom module (Pacific Technology Solutions' Internal Issues)
Granite Document Description must be set to "NormalPick" to ensure that we post to an existing document in Accpac. 
If this is not set, we still post to an existing document with matching Number when one is found - however if a matching document is not found we create it (DynamicIssue).
Can be used with multiple Granite Transaction Types, set the Process' IntegrationMethod to ISSUE to post. 
Granite Transactions must be linked to a document with a number matching the Accpac Internal Issue Number

- Granite Process IntegrationMethod: **ISSUE**
- Accpac: **II Internal Issues** Custom module (Pacific Technology Solutions' Internal Issues)

#### ***MATERIALALLOCATION

**`Take Note`** Granite Document Description must be set to CONTRACT/PROJECT/CATEGORY (in that order with slashes separating them).


- Granite Process IntegrationMethod: **MATERIALALLOCATION**
- Accpac: **Project and Job Costing -> PJC Transactions -> Material Allocation**
- IntegrationPost:
    - Not supported, will always create material allocation
- Returns:
    - MALLOCNO

| Granite                       | Accpac SDK | Required | Accpac Table |
|-------------------------------|------------|----------|--------------|
| "GRANITE"                     | REFERENCE  | Y        | PMMTAH       |
| Document Description Contract | FMTCONTNO  | Y        | PMMTAD       |
| Document Description Project  | PROJECT    | Y        | PMMTAD       |
| Document Description Category | CATEGORY   | Y        | PMMTAD       |
| MasterItem Code               | RESOURCE   | Y        | PMMTAD       |
| ToLocation                    | LOCATION   | Y        | PMMTAD       |
| ActionQty                     | QUANTITY   | Y        | PMMTAD       |

#### AutoSimply (10 Oct 2023: under construction)

##### Issuances

This method is used when you want to post the consumption of the work order seperate from the receipt 
of the finish goods. It will post based on each CONSUME transaction.

- Granite Process IntegrationMethod: **AUTOSIMPLY_ISSUANCES**
- Accpac/AutoSimply: **Manufacture -> MF Transactions -> Material Issuances -> Issuances**
- Support for: 
    - Lots
- Returns:
    - ISSUENO
- Notes:
  - Single MO (work order) per Issuances
  - MO status released
  

| Granite              | Accpac SDK | Required | Accpac Table |
|----------------------|------------|----------|--------------|
| Document Description | ISSDESC    | N        | MFISSUH      |
| Document Number      | ToMO       | Y        | MFISSUH      |
| Document Number      | FromMO     | Y        | MFISSUH      |
| LineNumber           | DETAILNUM  | Y        | MFISSUD      |
| ActionQty            | ISSQTY     | Y        | MFISSUD      |
| ActionQty            | XGENALCQTY | N        | MFISSUD      |


##### Receipts

This method is also used by Backflush.
Perform an Receipt of finish goods based on the Granite Manufacture transactions for the WorkOrder.
Prior to receipt typically the Issuances need to be done, or you need to perform a backflush as per below.

- Granite Process IntegrationMethod: **AUTOSIMPLY_RECEIPT**
- Accpac/AutoSimply: **Manufacture -> MF Transactions -> Material Receipt -> Receipts**
- Support for: 
    - Lots

##### Backflush

Backflush will take the total based on manufactured transactions (finish goods) and will ask autosimply
to "automate" the issuances. This method ignores Granite consume transactions. 
The result will be both a Issuances and Receipt in one where only the Manufacture transactions of Granite is used.


- Granite Process IntegrationMethod: **AUTOSIMPLY_BACKFLUSH**
- Accpac/AutoSimply: **Manufacture -> MF Transactions -> MO Backflush**

| Granite              | Accpac SDK | Required | Accpac Table |
|----------------------|------------|----------|--------------|
| Document Number      | ToMO       | Y        | MFISSUH      |
| Document Number      | FromMO     | Y        | MFISSUH      |
| ActionQty            | BaseQty    | Y        | MFISSUD      |


## Integration Jobs

Integration jobs are a special type of [Scheduler](../scheduler/manual.md) job called [injected jobs](../scheduler/manual.md#injected-jobs-integration-jobs). 
See below for information for specifics on how document and master data jobs work

### How Document jobs work
Triggers on the ERP document tables insert a record into the Granite IntegrationDocumentQueue table whenever a change is applied to a document. 

GraniteScheduler runs injected jobs that monitor the IntegrationDocumentQueue table for records that need to be processed.

When a record with Status 'ENTERED' is found, the job uses views on the Granite database to fetch the 
information related to that document from the ERP database and apply the changes to the Granite document. 

All valid changes to data in the Granite tables are logged to the Audit table, showing the previous value and the new value.

If a change is made in the ERP system that would put Granite into an invalid state, no changes are applied. Instead, the ERPSyncFailed field is set to true and the ERPSyncFailedReason field shows the reason for the failure. The IntegrationLog table will contain futher details on the failure if applicable.

### How master data jobs work
MasterItems and TradingPartners have their own jobs. These jobs compare the results of their respective views to the data in the Granite tables and insert new records / update records as needed.

The document jobs themselves also sync changes to the TradingPartners & MasterItems that are on the document. This means that on sites that do not process a lot of changes to master data you can limit the MasterItem/TradingPartner jobs to running once a day or even less frequently. The only thing they are really still needed for is setting isActive to false when something is deactivated in the ERP system.

### Install

**`Take Note`** If you are upgrading from the old StoredProcedure/Trigger integration, ensure that ERPIdentification (Document, DocumentDetail, MasterItem, TradingPartner) column is populated with correct values before attempting to start the new jobs

#### Set up database triggers & views

Run the create scripts for the views and triggers that you will need for the version of ERP & document types that the site uses.

All document types also require the Integration_ERP_MasterItem view.

#### Add the Injected job files to GraniteScheduler
To add the injected job files to the GraniteScheduler, simply copy the dlls and xml files into the root folder of GraniteScheduler. 

Example:

![Injectedjobfiles](accpac-img\injectedjobfiles.png)

### Configure
#### Schedule configuration
See the GraniteScheduler manual for how to configure scheduled jobs - ERP document integration jobs are of type INJECTED

#### Email on Error
To enable mail notifications for failures you will need to add the Email_IntegrationError mail template stored procedure to your database and configure it. This is the template procedure that is used for all error notifications in these injected jobs. 

When there is a failure while syncing a document, a ONCE only email job is added to GraniteScheduler that will detail the error messages. The job input for the email job will contain the document number and the messages that were logged surrounding the failure.

See the GraniteScheduler documentation for more information on email jobs.

Then for each job that needs to send failure notifications, add a job input for MailOnError:

| JobName | Name | Value |
| --- | --- | --- |
| < JobName goes here >| MailOnError | true |

#### View customisation
Each view can be customised to include custom logic or map extra fields to fields on the corresponding Granite table. 

All of the standard fields on Granite tables are supported, simply add the required field to your view with an alias matching the Granite field name on the table the view maps to.

Non standard fields are also supported, but for these to work your column name on the destination table must start with 'Custom'. On the view, simply alias the name of the field to match the name of the field on the destination Granite table, including the 'Custom' prefix.

For fields like Document.Status where you may have custom rules / statuses, use a CASE statement in your view definition so that the view returns the Status that you want to set on the Granite Document table.

It is highly advised that you check the validity of yor job on the GraniteScheduler /config page after making a change to your view! Especially after changing filter criteria/joins, your view may be returning duplicate rows - the job validation will bring this to your attention.

### What's different about Accpac jobs

#### Inserting lines between existing lines in Accpac
If enough lines are added in between existing lines on an Accpac document, existing line numbers can change. This will break the document in Granite as we lose the reference to the specific line in Accpac. 
Luckily, this can be easily avoided by ensuring that the Accpac user modifying documents is trained to only ever add new lines at the bottom.

### Things to look out for

#### Importance of ERPIdentification
The injected jobs use the ERPIdentification column on the Document, DocumentDetail and MasterItem tables to look for matching records in the corresponding view. It is very important that you ensure that these values are populated for all records in Granite if you are upgrading from the old Document stored procedures.

#### Validation
Each job type has it's own validation criteria that must be passed before the job will execute. You can check the validity of injected jobs on the GraniteScheduler /config page. 

Here is an example of some failed validation:

![Injectedjobsvalidation](accpac-img\injectedjobsvalidation.png)

### Supported Document types

- ORDER (SalesOrder)
- RECEIVING (PurchaseOrder)
- INTRANSIT (Transit Transfer)
- RECEIPT (Transit Receipt)
- TRANSFER (Transfer)
- WORKORDER (Assemblies)