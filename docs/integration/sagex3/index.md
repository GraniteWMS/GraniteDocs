# Sage X3
![maturity](https://img.shields.io/badge/maturity-low-cd242c)

![production_readiness](https://img.shields.io/badge/production_readiness-partial-cd242c)

![clients](https://img.shields.io/badge/live_clients-yes-449336)

![note](https://img.shields.io/badge/customization-high-cd242c)

![status](https://img.shields.io/badge/development_status-active-365893)

!!! note
    This documentation is a work in progress and is intended to show the development progress of the integration with Sage X3. As such, it may be subject to change as progress is made. Due to the nature of Sage X3, 
    there will have to be custom integration work done per customer. Please reach out to the development team if you have a Sage X3 site.


This document contains all of the information needed to set up and configure integration with Sage X3.
There are two parts to the complete integration solution:

- The [SDK Provider](sdk-provider.md) is used by the Integration Service to map transactions performed in Granite to the relevant format for Sage X3.

- The [integration jobs](integration-jobs.md) are used by the [Scheduler](../../scheduler/manual.md) to pull Sage X3's documents, item codes, and trading partners into Granite.

To get an overview of the Sage X3 entities/objects that are used in integration see [Sage X3 Overview](sagex3-overview.md)
