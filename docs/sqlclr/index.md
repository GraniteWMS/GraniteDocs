---
hide:
  - toc
---

# SQLCLR
<!-- ![alt text](image.jpg) -->

The SQL CLR (Common Language Runtime) integration offers a unique approach by `abstracting HTTP` technology away from direct SQL manipulation. 
This encourages users to interact with our `API` instead of directly manipulating data within SQL Server.
By promoting interaction with the API, this integration enhances security, maintains `data integrity`, and streamlines data processing workflows, empowering users to leverage our API's full capabilities within the SQL environment.

!!! note 
	SQLCLR will only work consistently on 64bit versions of SQL Server, Please see this error from a 32bit system: [Stack Overflow](https://stackoverflowteams.com/c/granitewms/questions/653)

## Currently supported operations

<div class="grid cards" markdown>

-   __Label Printing__

    ---

    TRACKINGENTITY, MASTERITEM, LOCATION

-   __Integration__

    ---

    POST, POST TO ENDPOINT, UPDATE

-   __Custodian API__

    ---

    REPORT PRINT, REPORT EXPORT, SQL TABLE EXPORT, SIMPLE EMAIL, TEMPLATE EMAIL

-   __Business API__

    ---

    **INVENTORY:** TAKEON, SCRAP, ADJUST, MOVE, PALLETIZE, REPLENISH, RECLASSIFY, TRANSFER, SAVE TRACKING ENTITY OPTIONAL FIELD

    **OUTBOUND** :PICK, PACK

    **INBOUND:** RECEIVE

    **STOCKTAKE:** STOCKTAKECOUNT, STOCKTAKEHOLD, STOCKTAKERELEASE

    **OTHER:** COPY DOCUMENT, SAVE OPTIONAL FIELDS

</div>
