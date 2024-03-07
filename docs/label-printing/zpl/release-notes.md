## ZPL Release Notes

### September 2023 (4.5.2.0)
#### New
- (RFC-78) Add validation of printer name

### August 2023 (4.5.1.0)
#### Change
- Variables in ZPL file must be prefixed with @

### 2 June 2023 (4.5.0.0) 

#### New
- Print multiple Pallet labels
- Print multiple Box labels
#### Changes
- Switch from Log4Net to NLog
- Each class uses own logger instead of logger inherited from BaseService
- Updated to ServiceStack 6.8.0
- Switch from ImageSharp to ImageMagick



### 06 Jan 2023 (4.2.0.1)
#### New
- LabelDataPreview allows populating a preview with actual data
#### Changes
- Default labels in appsettings.json settings changed. Take note **LabelName replaces Name**. ViewName setting added.
    ```json
      "DefaultTrackingEntityLabel": {
        "ViewName": "Label_TrackingEntity",
        "LabelName": "TrackingEntity.zpl",
        "Width": "100",
        "Height": "30"
      }
    ```
- Reworked inline SQL to limit injection risk
- Minor cleaning up

### 24 May 2022
- New appsettings.json setting
    ```json
    "IsPublic":  false
    ```
### 28 Feb 2022
- New Label preview functionality