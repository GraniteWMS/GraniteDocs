# Bartender

We support the following versions of Bartender:
- 2010 R1 
- 2016 
- 2016 R4 
- 2016 R9 
- 2019 R6 
- 2020
- 2021 R6


## Setup

### Label formats and SQL view

For each Label format we have a SQL view representing the information/data that displays on the label.
The application will query this view with a key (Barcode, Item Code, etc) to fetch the relevant information.
After that the application will map the SQL view columns to the label. 

### ConnectionStrings 
- Granite WMS connection string.
   
``` xml
<connectionStrings>
    <add name="CONNECTION" connectionString="Data Source=.\;Initial Catalog=Granite;Persist Security Info=True;User ID=******;Password=****" providerName="System.Data.SqlClient" />
</connectionStrings>
```

### appSettings

The endpoint address of the printing service. Hosted via windows service.
``` xml
<add key="EndPoint" value="http://localhost:2077/"/>
```
Provider options ZPL OR Bartender. **Ensure that the default labels below is relevant to your provider. The extension and file needs to be setup correctly .zpl or .btw** 
``` xml
<add key="Provider" value="Bartender"/> <!--Bartender or ZPL-->
```
Default printer for the instance of the service, you can override the windows default printer by specifying a printer name.
``` xml
<add key="PrinterName" value=""/>
```
Printer name for error label printing. If configured a label with information about the application error will print. This will typical be the error you see on the screen but just printed out. Used to keep track of errors.
``` xml
<add key="PrinterNameErrorLabel" value=""/>
```
Path to the default labels location
``` xml
<add key="DefaultLabelPath" value="C:\Program Files\Common Files\Cradle Technology Services\Granite\Labels\"/>
```
Default TrackingEntity Label (.btw or .zpl). Information for label based on setting: ViewTrackingEntityLabel
``` xml
<add key="DefaultTrackingEntityLabel" value="TrackingEntity.btw"/>
```
Default MasterItem Label (.btw or .zpl). Information for label based on setting: ViewMasterItemLabel
``` xml
<add key="DefaultMasterItemLabel" value="MasterItem.btw"/>
```
Default Location Label (.btw or .zpl). Information for label based on setting: ViewLocationLabel
``` xml
<add key="DefaultLocationLabel" value="Location.btw"/>
```
Default User Label (.btw or .zpl). Information for label based on setting: ViewUserLabel
``` xml
<add key="DefaultUserLabel" value="User.btw"/>
```
Default Pallet Label (.btw or .zpl). Information for label based on setting: PalletLabel
``` xml
<add key="DefaultPalletLabel" value="Pallet.btw"/>
```
Default Box Label (.btw or .zpl). Information for label based on setting: ViewBoxLabel
``` xml
<add key="DefaultBoxLabel" value="Box.btw"/>
```
Default Error Label. If setting *PrinterNameErrorLabel* is set this will be the label to use.
``` xml
<add key="DefaultErrorLabel" value="ErrorLabel.btw"/>
```
SQL View for TrackingEntityLabel
``` xml
<add key="ViewTrackingEntityLabel" value="Label_TrackingEntity"/>
```
SQL View for MasterItemLabel
``` xml
<add key="ViewMasterItemLabel" value="Label_MasterItem"/>
```
SQL View for LocationLabel
``` xml
<add key="ViewLocationLabel" value="Label_Location"/>
```
SQL View for UserLabel
``` xml
<add key="ViewUserLabel" value="Label_Users"/>
```
SQL View for PalletLabel
``` xml
<add key="PalletLabel" value="Label_Pallet"/>
```
SQL View for BoxLabel
``` xml
<add key="ViewBoxLabel" value="Label_Box"/>
```