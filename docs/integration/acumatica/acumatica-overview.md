# Acumatica Overview

The purpose of the this to provide of an overview of the parts of Acumatica's system that Granite interacts with in the upwards and downwards integration. 

## Investigating Acumatica

Acumatica has a useful feature that gives more detail on the details of the various fields in the system. 
To use it, hover over the name of a field until the ? icon appears, select the icon and a description will appear on the right. 

![Investigate](./acumatica-img/investigate.gif)

## StockItems

The StockItems are Acumatica's MasterItems. They can be found under Inventory > Stock Items.

![StockItem](./acumatica-img/stockitem.PNG)

The most notable field is the Lot/Serial Class (this is only visible if Lot/Serial tracking is enabled). In Acumatica, Lot and Serial number share the same property call LotSerialNbr. This class determines if either lot, serial, or neither is tracked. 

Expiry date can only be tracked in the standard way if either lot or serial is tracked and cannot be tracked separately. 

## Warehouses

Warehouses in Acumatica represent a physical location where stock can be kept (a warehouse, a section of a warehouse, a store).

The only relevant field for Granite is the WarehouseID which is the ERPLocation

These are found under Inventory > Warehouses.

![Warehouses](./acumatica-img/warehouses.PNG)

## Documents

Documents follow a similar structure to Granite's documents with one main difference being Allocations. Allocations will only be visible if Lot/Serial Tracking is enabled. 
The hierarchy is as follows: Document (Header) > Details > Allocations. Not all documents have Allocations. 

The header contains the info of the documents status, vendor/customer, and number.

The Details contain the Inventory ID (MasterItem Code), Qty, and processed qty. 

The Allocations are seen under Line details and contain the serial numbers or lot numbers, Quantity, and expiry date if applicable. 

![TransferDocument](./acumatica-img/transfer.PNG)
![LineDetails](./acumatica-img/line-details.PNG)

### Document Types:

The following documents are used in the integration process:

- Purchase Orders
- Purchase Receipts
- Transfers
- Receipts
- Sales Orders
- Shipments
- Issues

#### Purchase Orders

Purchase orders are inbound documents and are brought into Granite as Receiving documents. 
They do not have allocations (line details) as these are on the purchase receipt.

These documents are not updated with directly with received quantities, rather, Purchase Receipts are created that specify the received quantities. 

![PurchaseOrder](./acumatica-img/purchase-order.PNG)

#### Purchase Receipts

Purchase receipts are associated with a Purchase order and represent what was actually received against the Purchase Order. 
You can have multiple Purchase Receipts per Purchase order or multiple Purchase orders on a single receipt. 

These documents can also be brought into Granite as a purchase order with `LinkedDetail_id` on the lines allowing you to group the receiving of multiple purchase orders. See [Purchase Receipt Job](./integration-jobs.md#purchase-receipt-job)

The purchase receipt also functions as a return to supplier when of type (RN). This can be brought into Granite as an ORDER with the Return to Supplier job and posted back to Acumatica with the [RTS method](./sdk-provider.md#returntosupplier).

![PurchaseReceipt](./acumatica-img/purchase-receipt.PNG)

#### Transfers

Transfers are movements of goods between warehouses. 

There are 2 types of Transfers: 1-step and 2-step

- 1-Step Transfers are the equivalent of Transfers in Granite. A difference to note is the the quantity on the document is the quantity that will be transferred when the document is marked as Released, there is no Action Qty. 

![1-Step](./acumatica-img/1-step.PNG)

- 2-Step Transfers are the equivalent of Intransit documents in Granite. Similar to the 1-Step, there is no Action Qty, the quantity on the document is the quantity that will be removed from the warehouse and marked as intransit when the document is marked as Released. 

![2-Step](./acumatica-img/2-step.PNG)


#### Receipts

Receipts are transactions that bring stock into Acumatica. For the purpose of our we will only be using Receipts that are associated with a Transfer and have a TransferNbr in the header. These receipts are brought into Granite as Receipt documents.

As with transfers, they do not have an Action Qty and the quantity will be the quantity that is received at the warehouse when the document is marked as Released. 

![Receipt](./acumatica-img/receipt.PNG)


#### Sales Orders

These are outbound documents and are brought into Granite as Order documents. 
Like Purchase orders, they do not have allocations (Line details), these are on the Shipment. 

These documents are not updated directly with picked quantities. Instead, shipments are created against it that specify the quantities picked. 

![SalesOrders](./acumatica-img/sales-order.PNG)

#### Shipments

Shipments are associated with a Sales order and represent the quantities picked. 
There can only one open Shipment against per Sales order. Once a Shipment is Released, a new shipment can be created if back orders are allowed on the Sales Order. 

![Shipments](./acumatica-img/shipment.PNG)

Shipments can also include information on the packages shipped. These can be integrated from Granite using the [Pack method](./sdk-provider.md#pack)

![](./acumatica-img/shipment-packages.png)

#### Issues

Inventory Issues are used to issue inventory from stock. Once issued it is removed from stock and no further record is kept for it. This is currently not associated with any Granite document or process but is an integration method that can be used. For details please see the Acumatica [SDK-Provider](sdk-provider.md)

![Issues](./acumatica-img/issue.PNG)

## Physical Inventory Count

This is the stock take in Acumatica and is generated from a Physical Inventory Count Type. A full inventory count will count all of the stock in a specific [Warehouse](#warehouses) (ERPLocation in Granite). This can be brought into Granite as a stock take session with [Stock Take Session Job](./integration-jobs.md#stock-take-session-job) and is posted back with the [Stock Take Method](./sdk-provider.md#stocktake)

![](./acumatica-img/physical-inventory.png)