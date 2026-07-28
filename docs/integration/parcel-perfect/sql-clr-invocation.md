# SQL CLR Invocation

!!! note "Coming soon"
    The SQL CLR specifics for calling the Parcel Perfect service — procedure names, parameters, and deployment — haven't been written up yet. This page is a placeholder.

Unlike every other integration in this section, Parcel Perfect is not called by the Integration Service through an SDK Provider. Granite calls the [Parcel Perfect service](service.md)'s `/quotes` endpoints directly from SQL Server using SQL CLR.

In the meantime, see the general [SQLCLR](../../sqlclr/index.md) documentation and [Getting Started](../../sqlclr/getting-started.md) guide for background on how Granite's SQL CLR integration works.
