# Sage Intacct

![maturity](https://img.shields.io/badge/maturity-medium-449336)

![production_readiness](https://img.shields.io/badge/production_readiness-partial-365893)

![clients](https://img.shields.io/badge/live_clients-yes-449336)

![status](https://img.shields.io/badge/development_status-active-365893)

This document contains all of the information needed to set up and configure integration with Intacct.
There are two parts to the complete integration solution:

- The [SDK Provider](sdk-provider.md) is used by the Integration Service to map transactions performed in Granite to the relevant format for Intacct.

- The [integration jobs](integration-jobs.md) are used by the [Scheduler](../../scheduler/manual.md) to pull Intacct's documents, item codes, and trading partners into Granite.

### Resources

- Dev: [https://developer.intacct.com/](https://developer.intacct.com/)
