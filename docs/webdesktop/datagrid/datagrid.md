### Grids

Our system empowers users to customize numerous grids according to their preferences and requirements.
Determine whether a grid is configurable by right-clicking on it and selecting the Show Grid Definition option from the context menu.

![Local Image](gridmenu.png)

In addition to displaying the JSON definition, the dialog provides visibility into both the API operation and the SQL syntax linked with the data source.
Modify the JSON layout directly within this dialog interface for seamless customization.

![Local Image](griddialog.png)

The Datagrid **table** is responsible to store the grid information.
When a grid is customized, its name will be prefixed with Custom and the column **isCustomGrid** will be set accordingly.
The column **isApplicationGrid** serves as an indicator that the grid is integrated into the WebDesktop and forms an integral part of the application. These grids are preconfigured and we do not configure the SQL view (empty).
Conversely, when **isApplicationGrid** is set to false, it signifies that the grid is designated as an **Enquiry** grid, allowing for further customization.


![Local Image](TableDatagrid.png)

----

### Grid Definition

```json
{
        "headerName": "Column_Name",
        "field": "SQLView_ColumnName",
        "width": 100,
        "filter": "agTextColumnFilter",
        "cellRenderer": "dateCellRenderer",
        "hide": true,
        "cellClassRules": {
                "text-error": "x == 0"
        }
}
```

| Property       | Value                  |
|--------------|------------|
| headerName     | Name you want to display on grid |
| field          | Name of field in your SQL View|
| width          | Width of the column |
| filter         | Type of filter for the column. Options : agTextColumnFilter, agDateColumnFilter, agNumberColumnFilter   |
| cellRenderer   | How do render the cell value. Options : "dateCellRenderer"     |
| hide           | Hide the column. true / false                   |
| cellClassRules | Condition styling, "text-error": "x == 0" . Options : **more below** |


### Cell Formatting

Cell customization is done at the column level via the grid definition using the property cellClassRules. 
You can define rules which can be applied to include certain CSS classes. These rules are provided as a JavaScript map where the keys are the class names and the values are expressions that if evaluated to true, the class gets used. 

Example Document status
```json
{
        // other column related properties...
        "cellClassRules": {
                "bg-warning": "x == 'ONHOLD'",
                "bg-error": "x == 'CANCELLED'",
                "bg-success": "x == 'COMPLETE'"
        }
}
```

### Row Formatting (Version 6 ~)

You can define rules which can be applied to include certain CSS classes. 
These rules are provided as a map where the keys are CSS class names and the values are expression string that if evaluated to true, the class gets used. 

Example changing background color 
```json
{
    "bg-error text-bold": "data.Qty == 0", // combine classes separating by space
    "bg-success": "data.NonStock == 1",
    "bg-primary": "data.Qty > 0"
}
```

### Styling Guidelines (Version 6 ~)


!!! note 
	In order to keep a professional and consistent look to the application please use the below styling regarding colors.


This guide covers the available CSS classes for styling rows and cells. The following sections describe how to use each class for text formatting, background colors, borders, and alignment.

- Text Styles: Format text with colors, bold, italic, and text alignment.
- Background Styles: Set background colors for rows, cells, or sections based on states like success, warning, or error.
- Borders: Add or modify borders around elements to highlight specific areas.
- Padding and Alignment: Adjust spacing and alignment for better layout control.

| CSS Class           | Description                                          | Cell Format Example (`cellClassRules`)                   | Row Format Example (`rowClassRules`)                        |
|---------------------|------------------------------------------------------|----------------------------------------------------------|-------------------------------------------------------------|
| `.text-bold`        | Makes text bold.                                      | `"cellClassRules": { "text-bold": "x === 'COMPLETE'" }`  | `{ "text-bold": "data.Status === 'COMPLETE'" }`             |
| `.text-italic`      | Makes text italic.                                    | `"cellClassRules": { "text-italic": "x === 'ENTERED'" }` | `{ "text-italic": "data.Status === 'ENTERED'" }`            |
| `.text-primary`     | Applies the primary color (blue) to text.             | `"cellClassRules": { "text-primary": "x === 'ONHOLD'" }` | `{ "text-primary": "data.Status === 'ONHOLD'" }`            |
| `.text-success`     | Applies the success color (green) to text.            | `"cellClassRules": { "text-success": "x === 'COMPLETE'" }` | `{ "text-success": "data.Status === 'COMPLETE'" }`          |
| `.text-error`       | Applies the error color (red) to text.                | `"cellClassRules": { "text-error": "x == 0" }`           | `{ "text-error": "data.Qty == 0" }`                         |
| `.text-warning`     | Applies the warning color (orange) to text.           | `"cellClassRules": { "text-warning": "x === 'ONHOLD'" }` | `{ "text-warning": "data.Status === 'ONHOLD'" }`            |
| `.text-info`        | Applies the info color (cyan/light blue) to text.     | `"cellClassRules": { "text-info": "x === 'ENTERED'" }`   | `{ "text-info": "data.Status === 'ENTERED'" }`              |
| `.text-muted`       | Applies a muted grey color to de-emphasize text.      | `"cellClassRules": { "text-muted": "x === false" }`      | `{ "text-muted": "data.isActive === false" }`               |
| `.text-center`      | Centers text within an element.                       | `"cellClassRules": { "text-center": "x === 'ONHOLD'" }`  | `{ "text-center": "data.Status === 'ONHOLD'" }`             |
| `.bg-primary`       | Sets the primary background color (blue).             | `"cellClassRules": { "bg-primary": "x === 'COMPLETE'" }` | `{ "bg-primary": "data.Status === 'COMPLETE'" }`            |
| `.bg-success`       | Sets the success background color (green).            | `"cellClassRules": { "bg-success": "x === 'COMPLETE'" }` | `{ "bg-success": "data.Status === 'COMPLETE'" }`            |
| `.bg-error`         | Sets the error background color (red).                | `"cellClassRules": { "bg-error": "x == 0" }`             | `{ "bg-error": "data.Qty == 0" }`                           |
| `.bg-warning`       | Sets the warning background color (orange).           | `"cellClassRules": { "bg-warning": "x === 'ONHOLD'" }`   | `{ "bg-warning": "data.Status === 'ONHOLD'" }`              |
| `.bg-info`          | Sets the info background color (cyan/light blue).     | `"cellClassRules": { "bg-info": "x === 'ENTERED'" }`     | `{ "bg-info": "data.Status === 'ENTERED'" }`                |
| `.border`           | Adds a default grey border to the element.            | `"cellClassRules": { "border": "x === false" }`          | `{ "border": "data.isActive === false" }`                   |
| `.border-primary`   | Adds a blue border around the element.                | `"cellClassRules": { "border-primary": "x === 'ONHOLD'" }` | `{ "border-primary": "data.Status === 'ONHOLD'" }`         |
| `.border-error`     | Adds a red border for elements with errors.           | `"cellClassRules": { "border-error": "x == 0" }`         | `{ "border-error": "data.Qty == 0" }`                       |
| `.padding-small`    | Adds small padding (4px) inside the element.          | `"cellClassRules": { "padding-small": "x === 'COMPLETE'" }` | `{ "padding-small": "data.Status === 'COMPLETE'" }`       |
| `.padding-medium`   | Adds medium padding (8px) inside the element.         | `"cellClassRules": { "padding-medium": "x === 'ENTERED'" }` | `{ "padding-medium": "data.Status === 'ENTERED'" }`       |
| `.padding-large`    | Adds large padding (16px) inside the element.         | `"cellClassRules": { "padding-large": "x === 'ONHOLD'" }` | `{ "padding-large": "data.Status === 'ONHOLD'" }`         |
           

### Complete list of CSS Classes Definitions

| CSS Class             | Description                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| text-bold             | **Applies bold font weight.**                                               |
| text-italic           | *Applies italic font style.*                                                |
| text-primary          | <span style="color: #00A6CE;">Sets text color to blue (#00A6CE).</span>     |
| bg-primary            | <span style="background-color: #00A6CE;">Sets background color to blue (#00A6CE).</span> |
| text-primary-dark     | <span style="color: #008CBA;">Sets text color to darker blue (#008CBA).</span> |
| bg-primary-dark       | <span style="background-color: #008CBA;">Sets background color to darker blue (#008CBA).</span> |
| text-success          | <span style="color: #51AA6C;">Sets text color to green (#51AA6C).</span>    |
| bg-success            | <span style="background-color: #51AA6C;">Sets background color to green (#51AA6C).</span> |
| text-success-light    | <span style="color: #4F9E63;">Sets text color to darker green (#4F9E63).</span> |
| bg-success-light      | <span style="background-color: #B0D7B8;">Sets background color to pastel green (#B0D7B8).</span> |
| text-error            | <span style="color: #F24C3D;">Sets text color to red (#F24C3D).</span>      |
| bg-error              | <span style="background-color: #F24C3D;">Sets background color to red (#F24C3D).</span> |
| text-warning          | <span style="color: #FFA500;">Sets text color to orange (#FFA500).</span>   |
| bg-warning            | <span style="background-color: #FFA500;">Sets background color to orange (#FFA500).</span> |
| text-info             | <span style="color: #17A2B8;">Sets text color to light blue/cyan (#17A2B8).</span> |
| bg-info               | <span style="background-color: #17A2B8;">Sets background color to light blue/cyan (#17A2B8).</span> |
| text-secondary        | <span style="color: #6C757D;">Sets text color to grey/neutral (#6C757D).</span> |
| bg-secondary          | <span style="background-color: #6C757D;">Sets background color to grey/neutral (#6C757D).</span> |
| text-secondary-light  | <span style="color: #AEB6BF;">Sets text color to lighter neutral (#AEB6BF).</span> |
| bg-secondary-light    | <span style="background-color: #AEB6BF;">Sets background color to lighter neutral (#AEB6BF).</span> |
| text-dark             | <span style="color: #343A40;">Sets text color to dark grey (#343A40).</span> |
| bg-dark               | <span style="background-color: #343A40;">Sets background color to dark grey (#343A40).</span> |
| text-light            | <span style="color: #F8F9FA;">Sets text color to light grey (#F8F9FA).</span> |
| bg-light              | <span style="background-color: #F8F9FA;">Sets background color to light grey (#F8F9FA).</span> |
| text-center           | Centers text alignment.                                                     |
| text-left             | Aligns text to the left.                                                    |
| text-right            | Aligns text to the right.                                                   |
| padding-small         | Adds small padding (4px) inside the element.                                |
| padding-medium        | Adds medium padding (8px) inside the element.                               |
| padding-large         | Adds large padding (16px) inside the element.                               |
| border                | Adds a default grey border (1px solid #ddd).                                |
| border-primary        | Adds a blue border (1px solid #00A6CE).                                     |
| border-error          | Adds a red border (1px solid #F24C3D).                                      |
| border-success        | Adds a green border (1px solid #51AA6C).                                    |
| border-warning        | Adds an orange border (1px solid #FFA500).                                  |
| border-dark           | Adds a dark grey border (1px solid #343A40).                                |




### Grid Data Columns


The WebDesktop mandates a **minimum** set of columns to be present in both the SQL data and grid.
These typically include the primary key fields such as Document.Number, MasterItem.Code, etc.
To verify the necessary columns, access the **API operation**.

![Local Image](gridmenuapioperation.png)

If you navigate to the API operation documentation, you can observe that we document the SQL view name and the essential columns required for its proper functionality.

![Local Image](apioperation.png)


In the example provided above, ID, Code, and isActive are explicitly designated as required columns.
