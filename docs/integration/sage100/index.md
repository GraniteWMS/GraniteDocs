# Sage 100

![maturity](https://img.shields.io/badge/maturity-low-cd242c)

![production_readiness](https://img.shields.io/badge/production_readiness-partial-cd242c)

![clients](https://img.shields.io/badge/live_clients-yes-449336)

![status](https://img.shields.io/badge/development_status-none-cd242c)

![note](https://img.shields.io/badge/product_support-low-cd242c)

This document contains all of the information needed to set up and configure integration with Sage 100.
There are two parts to the complete integration solution:

The [SDK Provider](sdk-provider.md) is used by the Integration Service to map transactions performed in Granite to the relevant format for Sage 100.

The [integration jobs](integration-jobs.md) are used by the [Scheduler](../../scheduler/manual.md) to pull Sage 100's documents, item codes, and trading partners into Granite.

