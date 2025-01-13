# Manual
`Released with Version 6 but can be used for V4.5 and V5 installations`

![image info](scaffold.png)

Scaffold is a easy to use CLI to install, setup and configure Granite WMS.

### Requirements
- The directory where this application is running will also serve as the location to find all Granite applications. Ensure that all Granite-related folders are copied to this directory locally.
- The application requires administrative privileges to run.
- Ensure that a SQL instance and Granite database are properly configured before starting the installation.
- Note that prerequisites exclude label printing software (Bartender) and ERP software.
  
### Functionality (Menu Options)

- **View** : View existing Granite IIS applications
- **Prerequisites** : Check and install prerequisites (IIS, .Net)
- **Database** : Create Granite database
- **Install** : Install Granite

### View
View all IIS applications. Option to easily remove IIS applications.

### Prerequisites
Run through all Granite WMS Prerequisites.

Verify and install IIS components:

- IIS-WebServerRole
- IIS-WebServer
- IIS-CommonHttpFeatures
- IIS-HttpErrors
- IIS-HttpRedirect
- IIS-ApplicationDevelopment
- IIS-ManagementConsole
- NetFx4Extended-ASPNET45
- IIS-NetFxExtensibility45
- IIS-ISAPIExtensions
- IIS-ISAPIFilter
- IIS-ASPNET45
- IIS-ApplicationInit
- URL Rewrite Module

Install .Net hosting bundle:

### Database

### Install

- Installation is environment-specific, and the name you provide will be used to uniquely configure this environment. 
- The environment name will be used to name IIS applications and Windows services, enabling the setup of multiple unique environments.
- The installation process will prompt you for database details and other configurations prior to installation, ensuring these settings are properly configured and validated.

