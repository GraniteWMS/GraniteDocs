# Evolution
![maturity](https://img.shields.io/badge/maturity-high-449336)

![production_readiness](https://img.shields.io/badge/production_readiness-full-449336)

![clients](https://img.shields.io/badge/live_clients-yes-449336)

![status](https://img.shields.io/badge/development_status-none-365893)

This document contains all of the information needed to set up and configure integration with Evolution.
There are two parts to the complete integration solution:

The [SDK Provider](sdk-provider.md) is used by the Integration Service to map transactions performed in Granite to the relevant format for Evolution.

The [integration jobs](integration-jobs.md) are used by the [Scheduler](../../scheduler/manual.md) to pull Evolution's documents, item codes, and trading partners into Granite.