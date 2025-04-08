# ISync

!!! note
    This provider has been specifically created for integration with ISync for a single customer. As such, there may be aspects of the code which have been tailored for their specific requirement. If needed for another customer please reach out to the development team to discuss. 

This document contains all of the information needed to set up and configure integration with ISync.
There are two parts to the complete integration solution:

- The [SDK Provider](sdk-provider.md) is used by the Integration Service to map transactions performed in Granite to the relevant format for ISync.

- The [integration jobs](integration-jobs.md) are used by the [Scheduler](../../scheduler/manual.md) to pull ISync's documents and item codes into Granite.