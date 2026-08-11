# Sage Intacct

![maturity](https://img.shields.io/badge/maturity-medium-449336)

![production_readiness](https://img.shields.io/badge/production_readiness-partial-365893)

![clients](https://img.shields.io/badge/live_clients-yes-449336)

![status](https://img.shields.io/badge/development_status-active-365893)

This document contains all of the information needed to set up and configure integration with Intacct.
There are three parts to the complete integration solution:

- The [Integration Service](standalone-service.md) handles upward integration, posting transactions performed in Granite (TAKEON, ADJUSTMENT, MOVE, RECLASSIFY, SCRAP, PICK, RECEIVE, TRANSFER) to Sage Intacct.

- The [Integration Jobs](integration-jobs.md) are used by the [Scheduler](../../scheduler/manual.md) to pull Intacct's documents, item codes, trading partners, and inventory totals into Granite.

- The [Webhook Listener API](webhook-listener-api.md) lets Sage Intacct notify Granite in real time that a document has changed, so the Integration Jobs can fetch the new/modified document.

### Resources

- Dev: [https://developer.intacct.com/](https://developer.intacct.com/)
