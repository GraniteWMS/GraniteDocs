---
hide:
  - toc
---

# SQLCLR
<!-- ![alt text](image.jpg) -->

The SQL CLR (Common Language Runtime) integration offers a unique approach by `abstracting HTTP` technology away from direct SQL manipulation. 
This encourages users to interact with our `API` instead of directly manipulating data within SQL Server.
By promoting interaction with the API, this integration enhances security, maintains `data integrity`, and streamlines data processing workflows, empowering users to leverage our API's full capabilities within the SQL environment.

## Currently supported operations

<div class="grid cards" markdown>

-   __Inventory__

    ---

    TAKEON, SCRAP, ADJUST, MOVE, PALLETIZE, REPLENISH, RECLASSIFY, TRANSFER

-   __Inbound__

    ---

    RECEIVE

-   __Outbound__

    ---

    PICK, PACK

-   __Stocktake__

    ---

    STOCKTAKECOUNT, STOCKTAKEHOLD, STOCKTAKERELEASE

-   __Label Printing__

    ---

    TRACKINGENTITY, MASTERITEM, LOCATION

-   __Integration__

    ---

    POST, POST TO ENDPOINT, UPDATE

-   __Utility API__

    ---

    REPORT PRINT, REPORT EXPORT, SQL TABLE EXPORT, SIMPLE EMAIL, TEMPLATE EMAIL

-   __Repository API__

    ---

    COPY DOCUMENT, SAVE OPTIONAL FIELDS

</div>
