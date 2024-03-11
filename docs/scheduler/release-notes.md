# Release Notes

## 5.0.0.0 (TBA)

##### Changes
- Email jobs updated to use new Utility API

## 4.5.1.0 (September 2023) 
##### Changes
- Improved log file archival

## 4.5.0.2 (27 July 2023) 

##### Changes
- Remove execution timeout for Sql jobs.

## 4.5.0.0 (31 May 2023) 

##### Changes
- New setting for EmailAddress
- Switch from Log4Net to Nlog
- Update dependencies
    - ServiceStack 6.8.0
    - Coravel 4.2.1
    - Mailkit 4.0.0
    - EmailValidation 1.0.9

## 4.2.0.4 (08 March 2023)  

##### New
- Add TimeZone configuration option for CRON jobs.

## 4.2.0.3 (22 November 2022) 

##### Bug fix
- Fix only check for @input table if job is of type EMAIL or STOREDPROCEDURE and has inputs
- Fix handle null AuditDate on ScheduledJobs table when recording an execution to ScheduledJobsHistory
- Fix handle null Status for ONCE jobs
- Fix handle null email attachment path
- Fix set NOT SCHEDULED for non active jobs

##### Changes
- Move SQL queries to OrmLite
- Update to ServiceStack 6.3.0
- Move interfaces to ServiceModel.Interfaces
- Move ScheduledJobs, ScheduledJobInputs, ScheduledJobHistory to GraniteScheduler.Entities

## 4.2.0.2 (15 September 2022) 
##### Bug fix
- Prevent System.InvalidOperationException error when a job is added/removed while application is running

## 4.2.0.1 (5 September 2022) 

##### Bug fixes
- Fix injected jobs not getting a reference to application configuration
- Fix email jobs not getting some values from stored procedure correctly
- Fix jobs that have status SCHEDULED but are inactive not being set to NOT SCHEDULED
- Fix /config does not load when connection string is invalid

##### Injected Jobs
- Add validation of Injected jobs
- Update IInjectableJob (Required for new downward integration jobs)

##### /config
- Add Injected jobs validation results to /config

##### Change
- Upgrade to ServiceStack 6.2
- Change default log level to INFO

## 4.2.0.0 (29 July 2022) 
Initial release
##### Supported job types
- StoredProcedure
- Email
- Injected

##### Supported interval formats
- Once
- Seconds
- Minutes
- Hours
- CRON 