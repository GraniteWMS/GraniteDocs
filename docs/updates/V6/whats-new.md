# Granite WMS What's New V 6.0

*Also see [V6 Cheat Sheet](../V6/cheatsheet.md) for a high level overview and reference* 
___
## Overview

### API Consolidation changes

!!! danger
    These changes will impact settings and configuration of the endpoint addresses. Please ensure that you understand the changes.

- The **Utility API** is now merged into the **Custodian API**, consolidating functionalities under the unified name: **Custodian API**.
- The **Repo API** is now merged into the new **Business API**, consolidating functionalities under the unified name: **Business API**.

### New Applications & Tools

- [Scaffold CLI](#scaffold) - A simple to use CLI application (command line interface) to install, setup and configure Granite WMS.
- [Business API](#business-api) - An upgraded replacement for the Webservice, and also the new home for the Repo API functionality
- [Jaeger](#system-observability-with-jaeger) - Your new favorite way to "check the logs"

### New Integration Providers

- [Sage 100](../../integration/sage100/index.md)
- [Acumatica](../../integration/acumatica/index.md)
- [Sage Intacct](../../integration/intacct/index.md)

### Webdesktop Enhancements

- [Document Copy](#document-copy) - Functionality to copy any document as a new document. Allowing the user to change the type of document.
- [Data Capture](#datacapture-feature) - A new feature that gives you the ability to easily create input forms to streamline your users' experience capturing repetitive data.
- [Data Grid Improvements](#data-grid-improvements) - Data Grids now support conditional formatting and configurable page sizes
- [Process Management](#process-management-changes) - Styled Menu dividers  
- [StockTake Session Auditing](#stocktake-session-management-improvements) - Stocktake session creation criteria are now audited, giving you better visibility
- [Process Template](#process-template-sqlobjects) - Allow user to add any SQLObjects (View, Proc, Table, Function) to process template.
 
### [Security and Permissions Enhancements](#security-permissions-and-user-management-changes)
- User Management - User permissions are now managed at the User Group level. You can also copy users from within the Webdesktop    
- New Permissions tables- Permissions are no longer columns on the user table
- Security Settings - Opt-in system wide settings that allow you enforce policies like password strength and user account lock outs
- API Keys - a new way of authenticating against our APIs

___
## Scaffold
<iframe src="https://share.descript.com/embed/jY8IZ5GAL32" width="640" height="360" frameborder="0" allowfullscreen></iframe>

Scaffold is a straightforward command line interface that makes it easy to install, setup, and configure Granite WMS.
## Business API
In this first release of the Business API, our aim is that you shouldn't notice any major differences between it and the Webservice & Repo API. However, this doesn't mean nothing has changed. Under the hood we've moved away from the legacy technology the Webservice was built on. This modernization enhances our ability to adapt to new requirements, allowing us to respond to business needs more quickly and efficiently. With this new API, we are better positioned to support innovation and deliver improved services to our users.

The Repo API has been moved into it's new home without any major changes. There have been some bug fixes, but nothing has materially changed.

On the Webservice functionality side, while the aim is to remain as consistent as possible, there are some changes to the behaviour in the Business API. The most notable change is that creating a pallet will require a location. This is to ensure better transactional consistency throughout the lifetime of the pallet. This means that you will need to have a Location step _before_ any CarryingEntity step that creates pallets. This affects the following process types:

- Take On
- Manufacture
- Receiving
- Return
- Palletize

Aside from that, the other changes are fixes that require no changes to processes:

- All Transaction types write FromContainableEntity_id and ToContainableEntity_id where applicable
- STOCKTAKERELEASE requires the TrackingEntity to be on hold.
- QCRELEASE Pallet writes ActionQty to transaction
- RECEIVING & TAKEON of a MasterItem with DirectOnHold writes ProcessName to QCHOLD transaction
- RECEIVING a document with the same item with multiple ToLocations correctly validates the ToLocation
- MANUFACTURE validates against document detail TO Location (Webservice incorrectly validates against FROM Location)
- TRANSFER document validates against FromLocation and ToLocation
- INTRANSIT document validates against FromLocation and IntransitLocation
- RECEIPT document validates against IntransitLocation and ToLocation
- BarcodeMaster will skip barcodes for failed transactions more often than the Webservice - this is part of the strategy to avoid assigning barcodes twice.

You can find out more in the [Business API manual](../../business-api/manual.md) 
___

## System observability with [Jaeger](../../tools/jaeger.md)

<iframe src="https://share.descript.com/embed/U18gcAOZSln" width="640" height="360" frameborder="0" allowfullscreen></iframe>
___

## Webdesktop Enhancements

### Document Copy
<iframe src="https://share.descript.com/embed/slZUqnHkFMg" width="640" height="360" frameborder="0" allowfullscreen></iframe>


### [Datacapture Feature](../../webdesktop/datacapture/data-capture.md)

<iframe src="https://share.descript.com/embed/XnsGLzgZkiW" width="640" height="360" frameborder="0" allowfullscreen></iframe>

### Data Grid Improvements 
- [Page Size](../../webdesktop/datagrid/datagrid.md#page-size) configuration
- [Row Formatting](../../webdesktop/datagrid/datagrid.md#row-formatting) rule based row formatting
- [Styling Guidelines](../../webdesktop/datagrid/datagrid.md#styling-guidelines) built in style classes for improved look across application  
<iframe src="https://share.descript.com/embed/X27OtafGcj2" width="640" height="360" frameborder="0" allowfullscreen></iframe>

### Process Management changes

- Rename process 
- Delete process 
- Process menu dividers

<iframe src="https://share.descript.com/embed/F1TEUB5PWxq" width="640" height="360" frameborder="0" allowfullscreen></iframe>

---

### Stocktake Session management improvements

- Refresh button
- Stock Session (heading) audit

<iframe src="https://share.descript.com/embed/nXrFmWnpEwl" width="640" height="360" frameborder="0" allowfullscreen></iframe>


### Process Template SQLObjects

- Include adhoc SQL views, functions or stored procedures
 
<iframe src="https://share.descript.com/embed/tyzK3FNH0C1" width="640" height="360" frameborder="0" allowfullscreen></iframe>

### Minor Changes
- `new` MasterItem Alias SQL view preview. Allow user to preview the SQL view configured for MasterItem Alias.
  
___
## Security, Permissions and User Management changes

<iframe src="https://share.descript.com/embed/7HPXdbfGbY9" width="640" height="360" frameborder="0" allowfullscreen></iframe>

- [Security Settings](../../security/system-security.md)
- [API keys](../../security/api-keys.md)
- [New User permissions](../../security/user-permissions.md)


___