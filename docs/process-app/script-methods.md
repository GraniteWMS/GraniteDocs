#  Script Methods

Script Methods are server side functions that can be used in Process App Webtemplates. Here you will find details on the available methods, their options, and how to use them.


##  `multiSelectTable`

Render a table with checkboxes and multi-select support.

###  Example

```handlebars
{{ 
    'SELECT Barcode, Name FROM Location' 
    | dbSelect({}) 
    | multiSelectTable({
        valueColumn: 'Barcode',
        enableSearch: true
    }) 
}}
```

###  Behavior

* Selected rows are highlighted
* Selected values are comma delimited
* Clicking submit populates `textBox`
* Automatically calls `Next()` or `ProceedNext()`

###  Options

| Option         | Type   | Description                   |
| -------------- | ------ | ----------------------------- |
| `valueColumn`  | string | Column used as selected value |
| `enableSearch` | bool   | Adds search box               |

---

##  `numericKeyboard`

Render an onscreen numeric keypad.

###  Example

```handlebars
{{ numericKeyboard() }}
```

###  Features

* Numeric input
* Decimal support
* Backspace button
* Enter button
* Integrates with `textBox`

---

##  `navigateToStep`

Programmatically navigate to another process step.

###  Example

####  Use textbox value

```handlebars
{{ 
    navigateToStep({
        stepName: 'ConfirmLocation',
        submitFinalStep: true
    }) 
}}
```

####  Override textbox value

```handlebars
{{ 
    navigateToStep({
        stepName: 'ConfirmLocation',
        stepInputOverride: 'ABC123',
        submitFinalStep: true
    }) 
}}
```

###  Options

| Option              | Type   | Description                     |
| ------------------- | ------ | ------------------------------- |
| `stepName`          | string | Target step                     |
| `stepInputOverride` | string | Manual input value              |
| `submitFinalStep`   | bool   | Submit final step automatically |

---

##  `navigateToStepButton`

Create a button that navigates to a Process Step when clicked.

###  Example

####  Use current textbox value

```handlebars
{{ 
    navigateToStepButton({
        stepName: 'ConfirmLocation'
    }) 
}}
```

####  Override textbox value and Submit final step

```handlebars
{{ 
    navigateToStepButton({
        stepName: 'ConfirmLocation',
        stepInputOverride: 'ABC123',
        submitFinalStep: true
    }) 
}}
```

###  Options

| Option              | Type   | Description                                |
| ------------------- | ------ | ------------------------------------------ |
| `stepName`          | string | Target step                                |
| `stepInputOverride` | string | Manual input value                         |
| `submitFinalStep`   | bool   | Submit final step automatically            |
| `buttonText`        | string | Set the text that displays on the button   |


---

##  `basicList`

Render a Bootstrap list group.

###  Example

```handlebars
{{ 
    'SELECT Name FROM Warehouse' 
    | dbSelect({}) 
    | basicList({
        submitOnClick: true,
        enableSearch: true
    }) 
}}
```

###  Options

| Option          | Type | Description                 |
| --------------- | ---- | --------------------------- |
| `submitOnClick` | bool | Clicking item submits value |
| `enableSearch`  | bool | Adds search box             |

---

##  `basicTable`

Render a searchable HTML table from a query result.

###  Example

```handlebars
{{ 
    'SELECT Barcode, Name, Site FROM Location' 
    | dbSelect({}) 
    | basicTable({ 
        selectOnColumn: 'Barcode',
        enableSearch: true
    }) 
}}
```

###  Options

| Option           | Type   | Description                |
| ---------------- | ------ | -------------------------- |
| `selectOnColumn` | string | Makes the column clickable |
| `enableSearch`   | bool   | Adds search box            |

---

##  `pagedTable`

Render a paged table backed by a server-side SQL view.

###  Example

```handlebars
{{ 
    pagedTable({
        dataSource: 'LocationView',
        selectOnColumn: 'Barcode',
        enableSearch: true,
        searchColumn: 'Barcode',
        pageSize: 50
    }) 
}}
```

###  Behavior

* Loads data from `/{Controller}/SqlView` using `sqlViewName`
* Uses server-side paging and optional search
* `selectOnColumn` values call `ProceedNext(...)`

###  Options

| Option           | Type   | Description                                                      |
| ---------------- | ------ | ---------------------------------------------------------------- |
| `dataSource`     | string | SQL view name passed as `sqlViewName`                            |
| `selectOnColumn` | string | Makes the column clickable                                       |
| `pageSize`       | int    | Rows per page (defaults to 50)                                   |
| `enableSearch`   | bool   | Adds server-side search input                                    |
| `searchColumn`   | string | Column to filter with `[lk]` when search is enabled and provided |

---

##  `setInputModeDecimal`

Configure the main textbox for decimal entry.

###  Example

```handlebars
{{ setInputModeDecimal() }}
```

###  Behavior

* Sets `inputMode='decimal'`
* Adds decimal validation pattern

---

##  `createCardList`

Render records as mobile-friendly cards.

###  Example

```handlebars
{{ 
    'SELECT Barcode, Description, Qty, ActionQty FROM Stock' 
    | dbSelect({}) 
    | createCardList({
        selectOnColumn: 'Barcode',
        enableSearch: true
    }) 
}}
```

###  Features

* Mobile-friendly layout
* Optional search
* Clickable primary field
* Automatic progress bars when `Qty` and `ActionQty` exist

###  Options

| Option           | Type   | Description     |
| ---------------- | ------ | --------------- |
| `selectOnColumn` | string | Clickable field |
| `enableSearch`   | bool   | Adds search box |

---

##  `createButtonList`

Render records as large action buttons.

###  Example

```handlebars
{{ 
    'SELECT Barcode FROM Location' 
    | dbSelect({}) 
    | createButtonList({
        columnName: 'Barcode'
    }) 
}}

{{ hideTextBox() }}
```

###  Behavior

* Generates one large button per row
* Calls `OptionNext(value)` when clicked

###  Parameters

| Option       | Type   | Description                   |
| ------------ | ------ | ----------------------------- |
| `columnName` | string | Column to use as button value |

---

##  `hideTextBox`

Hide the default textbox input.

###  Example

```handlebars
{{ hideTextBox() }}
```

###  Typical Usage

Usually combined with:

* `createButtonList`
* `basicList`
* `multiSelectTable`
* `numericKeyboard`

---

##  `notificationMessageBox`

Render a dismissible banner that consolidates process messages.

###  Example

```handlebars
{{ notificationMessageBox({ hideTextBox: true }) }}
```

###  Behavior

* Reads from `divError`, `divInformation`, and `divSuccess`
* Hides the original message divs and shows a banner with dismiss buttons
* Optionally hides the textbox until all messages are dismissed

###  Options

| Option        | Type | Description                                                  |
| ------------- | ---- | ------------------------------------------------------------ |
| `hideTextBox` | bool | Hide the textbox while messages are visible                  |
| `error`       | bool | Show error messages                                          |
| `info`        | bool | Show informational messages                                  |
| `success`     | bool | Show success messages                                        |

---

##  Common Pattern Examples

###  Mobile Scanner Selection Screen

```handlebars
{{ 
    'SELECT Barcode FROM Location WHERE isActive = 1' 
    | dbSelect({}) 
    | createButtonList({}) 
}}

{{ hideTextBox() }}
```

---

###  Picking Progress Screen

```handlebars
{{ 
    'SELECT ItemCode, Qty, ActionQty FROM PickSlipLines' 
    | dbSelect({}) 
    | createCardList({
        selectOnColumn: 'ItemCode',
        enableSearch: true
    }) 
}}
```

---

###  Multi Select Batch Capture

```handlebars
{{ 
    'SELECT BatchNo, Qty FROM Batch' 
    | dbSelect({}) 
    | multiSelectTable({
        valueColumn: 'BatchNo',
        enableSearch: true
    }) 
}}

{{ hideTextBox() }}
```

---

###  Numeric Quantity Capture

```handlebars
{{ setInputModeDecimal() }}

{{ numericKeyboard() }}
```

---

###  Searchable Lookup Table

```handlebars
{{ 
    'SELECT Barcode, Name, Site FROM Location' 
    | dbSelect({}) 
    | basicTable({
        selectOnColumn: 'Barcode',
        enableSearch: true
    }) 
}}
```
