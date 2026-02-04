# Acumatica
![maturity](https://img.shields.io/badge/maturity-low-cd242c)

![production_readiness](https://img.shields.io/badge/production_readiness-no-cd242c)

![clients](https://img.shields.io/badge/live_clients-no-cd242c)

![status](https://img.shields.io/badge/development_status-active-365893)

This document contains all of the information needed to set up and configure integration with Acumatica.
There are two parts to the complete integration solution:

- The [SDK Provider](sdk-provider.md) is used by the Integration Service to map transactions performed in Granite to the relevant format for Acumatica.

- The [integration jobs](integration-jobs.md) are used by the [Scheduler](../../scheduler/manual.md) to pull Acumatica's documents, item codes, and trading partners into Granite.

To get an overview of the Acumatica entities/objects that are used in integration see [Acumatica Overview](acumatica-overview.md)

