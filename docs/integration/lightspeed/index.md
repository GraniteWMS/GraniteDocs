# LightSpeed

!!! note
    This documentation is a work in progress and is intended to show the development progress of the integration with LightSpeed. As such, it may be subject to change as progress is made.
    It is also specific to Lightspeed R-Series. This is a older Lighspeed offering and is not longer available to new customers. 

This document contains all of the information needed to set up and configure integration with LightSpeed.
There are two parts to the complete integration solution:

- The [SDK Provider](sdk-provider.md) is used by the Integration Service to map transactions performed in Granite to the relevant format for LightSpeed.

- The [integration jobs](integration-jobs.md) are used by the [Scheduler](../../scheduler/manual.md) to pull LightSpeed's documents, item codes, and trading partners into Granite.

To get an overview of the LightSpeed entities/objects that are used in integration see [LightSpeed Overview](lightspeed-overview.md)

### External Resources
- [LightSpeed API Documentation](https://developers.lightspeedhq.com/retail/introduction/introduction/)
