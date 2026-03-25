# CIN7
![maturity](https://img.shields.io/badge/maturity-medium-yellow)

![production_readiness](https://img.shields.io/badge/production_readiness-partial-yellow)

![clients](https://img.shields.io/badge/live_clients-yes-449336)

![status](https://img.shields.io/badge/development_status-active-365893)

!!! note
    This documentation is a work in progress and is intended to show the development progress of the integration with CIN7. As such, it may be subject to change as progress is made. 

This document contains all of the information needed to set up and configure integration with CIN7.
There are two parts to the complete integration solution:

- The [SDK Provider](sdk-provider.md) is used by the Integration Service to map transactions performed in Granite to the relevant format for CIN7.

- The [integration jobs](integration-jobs.md) are used by the [Scheduler](../../scheduler/manual.md) to pull CIN7's documents, item codes, and trading partners into Granite.

To get an overview of the CIN7 entities/objects that are used in integration see [CIN7 Overview](cin7-overview.md)
