# Process App

The Granite Process App is an ASP.NET Core mobile application designed specifically for warehouse operations. It provides users with intuitive, step-driven workflows to perform various warehouse transactions directly from mobile devices.

The application guides users through structured processes, ensuring accuracy and efficiency in warehouse operations such as receiving, picking, shipping, and inventory management. Each workflow is designed to be simple and user-friendly, and ensure all warehouse activities are properly recorded and tracked.

---
## Setup

### Requirements

- [ASP.NET Core 8 Hosting Bundle](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- [IIS](../iis/getting-started.md)

## Configuration

### Menu Layout

You can configure the menu layout in the appSettings.json:

```json
    "MenuLayout": "Default", /* Options: Default, Collapsible, Tree */
```

### Process Layout

In the Process table you can configure the layout that the process should use. 

The default is `StepSequence`, but you can select a `Form` layout as well.

### Process Functions

Process functions are configured in the following two database tables:

- [dbo].[ProcessFunction]
- [dbo].[ProcessFunctionMapping]

#### ProcessFunction
Links a process as function to a specific parent process step or parent process.

```sql
INSERT INTO [dbo].[ProcessFunction]
(
    Process_id,                 -- the ID of the Process that will be available as a function
    ParentProcessStep_id,       -- the ID of the ProcessStep that the function will be available on. EITHER this OR ParentProcess_id must be set
    ParentProcess_id,           -- the ID of the Process that the function will be available on. EITHER this OR ParentProcessStep_id must be set
    IsActive,                   -- is the process function enabled?
    ProcessFunctionMenuIndex,   -- determines the order of the process function menu
    FinalStepBehavior,          -- CLOSE or CONTINUE.
    ProcessLayoutOverride,      -- leave empty to use the process' layout, or specify StepSequence or Form to override.
    AuditUser,                  -- user that edited this record.
    AuditDate,                  -- date this record was edited. 
    Version                     -- number of times this record has changed
)
VALUES
(
    101,                
    5,                  
    1,                  
    1,                  
    1,                  
    'CLOSE',   
    NULL,       
    '0',       
    GETDATE(),          
    1                   
);
```

#### ProcessFunctionMapping
Maps steps between the parent process and the function process.

```sql
INSERT INTO [dbo].[ProcessFunctionMapping]
(
    ProcessFunction_id,
    ParentProcessStep,
    FunctionStep
)
VALUES
(
    10,            -- ProcessFunction ID
    'FromLocation', -- Step in parent process
    'ToLocation'   -- Step in function process
);
```

Notes
Step names in ProcessFunctionMapping must exist in their respective process definitions.

You can define multiple mappings for a single function if more than one step needs to be passed through.


### Business Rules

#### Picking

**BestBeforeOverride**
- When BestBeforeOverride's value is 'YES', users will be allowed to pick stock that is past the ExpiryDate

**OnHoldOverride**
- When OnHoldOverride's value is 'YES', users will be allowed to pick stock that is on hold

**SerialValidationOverride**
- When SerialValidationOverride's value is 'YES', the Business API will not validate the picked serial number against the document lines

#### Transfer

**ActionQtyAllowance**
- When set to a value above 0, allows the user to transfer the specified percentage more than the document requires

#### Receive

**SerialValidationOverride**
- When SerialValidationOverride's value is 'YES', the Business API will not validate the received serial number against the document lines

#### Manufacture

**ActionQtyAllowance**
- Percentage allowance for manufacturing more than the document line quantity. Default is 0%

#### Consume

**ActionQtyAllowance**
- Percentage allowance for consuming more than the document line quantity. Default is 0%

#### Correction

**PreventInStockCorrection**
- Prevent not in stock tracking entities from being placed back into stock