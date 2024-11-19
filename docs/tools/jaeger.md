![](jaeger-img/jaeger-horizontal-black.svg#only-light)
![](jaeger-img/jaeger-horizontal-grey.svg#only-dark)

# Jaeger
Jaeger is an observability platform that allows you to view a complete picture of what happens across all of Granite's various layers when a user does something.
This is almost like looking at the logs, but instead of having to hunt down the specific entry that corresponds to what you're looking at in another file, the correlation is all done for you.

## Traces & spans

Jaeger records each user action and the related backend operations and stores them together in a trace. 
A single trace can contain each of the parts of the system that are triggered as a result of a user action, right down to the database queries.

Here we can see traces representing multiple steps in a TAKEON process:
![](jaeger-img/jaeger-dash.png)

We can see that there are errors on the final step. Clicking on the trace allows us to drill down and see the spans that make up this trace.
Here we can see where the errors are actually coming from:
![](jaeger-img/jaeger-trace.png)

Drilling down further into the labelprint-service entry we can see each of the logs that are related to this request, as well as the error message that was returned:
![](jaeger-img/jaeger-trace-expanded.png)


## Querying Jaeger

![](jaeger-img/jaeger-query.png){ align=right }

You can select the service that you want to query from the dropdown. 

If you are running multiple instances of Granite that are pointing to the same telemetry collector, 
the service name can be set in each of the services' config files. This will allow you to distinguish between the environments in Jaeger.

The Operation dropdown allows you to select a specific operation on the API to filter by. 
For APIs this corresponds to the operation name from the ServiceStack `/metadata` page.
For the Process App, the operation name will be the name of the process and the step name.


You can use the tags of a span to query Jaeger for trace data.

You can only search for exact matches on tags. There is no LIKE operator in Jaeger.

Click the question mark above the tags field for more details on filtering using tags.


## Tags
You can find tags by expanding a trace to see what each service is recording.

Process App tags example:
![](jaeger-img/process-app-tags.png)

Business API tags example:
![](jaeger-img/business-api-tags.png)

There are a lot of tags included by default, but we've added some Granite specific ones to help you find what you're looking for. 
See the sections below for the specific tags added to each service.

### Process App

- `user.name`   
The username of the user performing this transaction
- `process.name`    
Name of the process 
- `process.step.isfinal`    
True if it is the final step of the process, otherwise false
- `process.step.name`	
Name of the process step
- `process.step.value`  
The value the user entered on this step.

### Business API

- `user.name`   
The username of the user making the request
- `session.authprovider`    
The authentication method being used for this request (credentials / api-key)
- `request.origin`  
Only used when the request comes from SQLCLR, most other requests will show the parent span in Jaeger's trace waterfall. 
- `operation`   
The operation that was performed on the API. This corresponds to the Operations on the `/metadata` page

### Repo API

- `user.name`   
The username of the user making the request
- `session.authprovider`    
The authentication method being used for this request (credentials / api-key)
- `request.origin`  
Only used when the request comes from SQLCLR, most other requests will show the parent span in Jaeger's trace waterfall. 
- `operation`   
The operation that was performed on the API. This corresponds to the Operations on the `/metadata` page

### Scheduler
- `job.name`    
Name of the job as defined in the ScheduledJobs.Name column
- `job.type`    
The type of job (EMAIL, STOREDPROCEDURE, INJECTED)

### Labelprinting ZPL
- `request.origin`  
Only used when the request comes from SQLCLR, most other requests will show the parent span in Jaeger's trace waterfall. 
- `operation`   
The operation that was performed on the API. This corresponds to the Operations on the `/metadata` page

### Integration Service
- `request.origin`  
Only used when the request comes from SQLCLR, most other requests will show the parent span in Jaeger's trace waterfall. 
- `operation`   
The operation that was performed on the API. This corresponds to the Operations on the `/metadata` page