# SQL Table Job Examples

Use the following to create example jobs for the SQL Table Jobs. 

## Archive Table Job

```sql
INSERT INTO [dbo].[ScheduledJobs] (
      [isActive]
    , [JobName]
    , [JobDescription]
    , [Type]
    , [StoredProcedure]
    , [InjectJob]
    , [Interval]
    , [IntervalFormat]
    , [Status]
    , [LastExecutionTime]
    , [LastExecutionResult]
    , [AuditDate]
    , [AuditUser]
)
VALUES (
      0                  -- default switch off
    , 'ArchiveAuditData'
    , 'Archive Audit data older than 6 months'
    , 'ARCHIVETABLE'
    , NULL
    , NULL
    , '00 00 * * *'                
    , 'CRON'           
    , 'PENDING'          -- initial status
    , NULL
    , NULL
    , GETDATE()
    , 'SYSTEM'
);
GO

-- Table to clean
INSERT INTO [dbo].[ScheduledJobInput] (
      [JobName]
    , [Name]
    , [Value]
)
VALUES (
      'ArchiveAuditData'
    , 'TableName'
    , 'Audit'
);
GO

-- Initial Run as dry run
INSERT INTO [dbo].[ScheduledJobInput] (
      [JobName]
    , [Name]
    , [Value]
)
VALUES (
      'ArchiveAuditData'
    , 'DryRun'
    , 'true'
);
GO

-- Safer, parameterized filter (preferred)
-- Example: delete rows with Date < @Cutoff
INSERT INTO [dbo].[ScheduledJobInput] (
      [JobName]
    , [Name]
    , [Value]
)
VALUES (
      'ArchiveAuditData'
    , 'WhereTemplate'
    , 'AuditDate < @Cutoff'
);
GO

-- JSON parameters for the template (adjust Cutoff as needed)
INSERT INTO [dbo].[ScheduledJobInput] (
      [JobName]
    , [Name]
    , [Value]
)
VALUES (
      'ArchiveAuditData'
    , 'WhereParams'
    , '{"Cutoff":"${now-6M}"}'
);
GO

-- Optional: table optimization configuration
INSERT INTO [dbo].[ScheduledJobInput] (
      [JobName]
    , [Name]
    , [Value]
)
VALUES (
      'ArchiveAuditData'
    , 'OptimizeTable'
    , 'true'
);
GO

INSERT INTO [dbo].[ScheduledJobInput] (
      [JobName]
    , [Name]
    , [Value]
)
VALUES (
      'ArchiveAuditData'
    , 'OptimizeArchiveTable'
    , 'true'
);
GO

INSERT INTO [dbo].[ScheduledJobInput] (
      [JobName]
    , [Name]
    , [Value]
)
VALUES (
      'ArchiveAuditData'
    , 'OptimizeMode'                     -- options: Reorganize | Rebuild | Auto
    , 'Rebuild'
);
GO

INSERT INTO [dbo].[ScheduledJobInput] (
      [JobName]
    , [Name]
    , [Value]
)
VALUES (
      'ArchiveAuditData'
    , 'OnlineIndexRebuild'               -- used if OptimizeMode = Rebuild
    , 'true'
);
GO

INSERT INTO [dbo].[ScheduledJobInput] (
      [JobName]
    , [Name]
    , [Value]
)
VALUES (
      'ArchiveAuditData'
    , 'UpdateStatisticsAfterOptimization' -- default true for Reorganize; false for Rebuild
    , 'true'
);
GO

INSERT INTO [dbo].[ScheduledJobInput] (
      [JobName]
    , [Name]
    , [Value]
)
VALUES (
      'ArchiveAuditData'
    , 'UpdateStatisticsFullScan'          -- set true to use FULLSCAN on stats
    , 'false'
);
GO
```

## Delete Table Data Job

```sql
INSERT INTO [dbo].[ScheduledJobs] (
      [isActive]
    , [JobName]
    , [JobDescription]
    , [Type]
    , [StoredProcedure]
    , [InjectJob]
    , [Interval]
    , [IntervalFormat]
    , [Status]
    , [LastExecutionTime]
    , [LastExecutionResult]
    , [AuditDate]
    , [AuditUser]
)
VALUES (
      0                  -- default switch off
    , 'CleanScheduledJobsHistory'
    , 'Delete ScheduledJobsHistory older than 3 months'
    , 'DELETETABLEDATA'
    , NULL
    , NULL
    , '00 00 * * *'                
    , 'CRON'           
    , 'PENDING'          -- initial status
    , NULL
    , NULL
    , GETDATE()
    , 'SYSTEM'
);
GO

-- Table to clean
INSERT INTO [dbo].[ScheduledJobInput] (
      [JobName]
    , [Name]
    , [Value]
)
VALUES (
      'CleanScheduledJobsHistory'
    , 'TableName'
    , 'ScheduledJobsHistory'
);
GO

-- Initial Run as dry run
INSERT INTO [dbo].[ScheduledJobInput] (
      [JobName]
    , [Name]
    , [Value]
)
VALUES (
      'CleanScheduledJobsHistory'
    , 'DryRun'
    , 'true'
);
GO

-- Safer, parameterized filter (preferred)
-- Example: delete rows with Date < @Cutoff
INSERT INTO [dbo].[ScheduledJobInput] (
      [JobName]
    , [Name]
    , [Value]
)
VALUES (
      'CleanScheduledJobsHistory'
    , 'WhereTemplate'
    , 'Date < @Cutoff'
);
GO

-- JSON parameters for the template (adjust Cutoff as needed)
INSERT INTO [dbo].[ScheduledJobInput] (
      [JobName]
    , [Name]
    , [Value]
)
VALUES (
      'CleanScheduledJobsHistory'
    , 'WhereParams'
    , '{"Cutoff":"${now-3M}"}'
);
GO

-- Optional: table optimization configuration
INSERT INTO [dbo].[ScheduledJobInput] (
      [JobName]
    , [Name]
    , [Value]
)
VALUES (
      'CleanScheduledJobsHistory'
    , 'OptimizeTable'
    , 'true'
);
GO

INSERT INTO [dbo].[ScheduledJobInput] (
      [JobName]
    , [Name]
    , [Value]
)
VALUES (
      'CleanScheduledJobsHistory'
    , 'OptimizeMode'                     -- options: Reorganize | Rebuild | Auto
    , 'Reorganize'
);
GO

INSERT INTO [dbo].[ScheduledJobInput] (
      [JobName]
    , [Name]
    , [Value]
)
VALUES (
      'CleanScheduledJobsHistory'
    , 'OnlineIndexRebuild'               -- used if OptimizeMode = Rebuild
    , 'true'
);
GO

INSERT INTO [dbo].[ScheduledJobInput] (
      [JobName]
    , [Name]
    , [Value]
)
VALUES (
      'CleanScheduledJobsHistory'
    , 'UpdateStatisticsAfterOptimization' -- default true for Reorganize; false for Rebuild
    , 'true'
);
GO

INSERT INTO [dbo].[ScheduledJobInput] (
      [JobName]
    , [Name]
    , [Value]
)
VALUES (
      'CleanScheduledJobsHistory'
    , 'UpdateStatisticsFullScan'          -- set true to use FULLSCAN on stats
    , 'false'
);
GO
```

