# Scaffold

Scaffold is a straightforward command line interface that makes it easy to install, setup, and configure Granite WMS.

## Requirements
Before you get started, ensure that you have done the following: 

- **All Granite applications (including Scaffold) that you want to install are copied to the folder where they will be installed.**

    Scaffold looks for applications to install in the parent folder of the Scaffold application. 
    This means that you need to have everything you want to install already in place before you start Scaffold.

- **The application requires administrative privileges to run.**

    Ensure that you have the necessary permissions. Admin privileges are required to do things like add sites to IIS and change folder permissions for logging.

- **Ensure that a SQL instance is properly configured and you have credentials before starting the installation.**

    Scaffold does not install SQL, but you can use it to run the Granite database create script. 
    To do this you will need SQL credentials with sysadmin privilege.

- **Ensure that required label printing software (Bartender) and ERP software is already installed.**

    Scaffold does not support installing ERPs or other 3rd party software.
    
  
## Functionality (Menu Options)

- **View** : View existing Granite IIS applications
- **Prerequisites** : Check and install prerequisites (IIS, .Net)
- **Database** : Create Granite database
- **Install** : Install Granite

### View
Show all applications currently hosted in IIS.
From here you can also easily select sites to remove from IIS.

### Prerequisites
Allows you to install and configure IIS and .NET Hosting bundles.

Running the IIS install option will install the following components:

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

The .NET option will allow you to install the .NET 6 and .NET 8 Hosting bundles.
Granite version 5 requires both hosting bundles, but Granite version 6 only requires .NET 8

### Database
Allows you to run the Granite database create script against a SQL server connection. 
This can be useful if SQL Server Management Studio is not yet installed.

### Install

When you install applications using Scaffold, you will specify an Environment name to install. 
The Environment name becomes the prefix for the sites in IIS, this makes it easy to see which applications are connected to each other at a glance - especially when there are multiple installs (e.g. TEST and LIVE).

As you progress through the installation process, you will be prompted for SQL connection details, SSL certificate details, and port numbers for each of the applications being installed.

Scaffold will configure the connection strings for all of the applications being installed, as well configuring the endpoints in each of the configuration files and SystemSettings table.

#### Https and certificates

As of version 7 every Granite application runs as https, and Scaffold sets this up using the certificate that you select (or create) during the install:

- **IIS sites** are given an https binding with the certificate.
- **Windows services** (the Integration Service and the Bartender Label Print Service) have the certificate bound to their port. Enter an https address when prompted for the service's endpoint, e.g. `https://+:40091/`. Scaffold will warn you if you enter an http address.
- The addresses that are written to the configuration files and the SystemSettings table use `https://<server IP address>:<port>/`.
- The firewall rule that Scaffold creates includes the ports of the Windows services.

Scaffold does not add a self-signed certificate to the server's trusted root store. The Granite applications accept the certificate when calling each other, but a browser will show a certificate warning until the certificate is trusted on the device.

!!! note
    If Scaffold reports that it could not bind the certificate to a service's port, the service will not be able to start.
    Follow the steps in [Certificates for Windows Services](../security/service-certificates.md) to bind the certificate manually.

#### Label printing

A site uses either the ZPL Label Print site or the Bartender Label Print Service. If both are in the install folder, Scaffold will ask which one you want to install and skip the other. The label print addresses in the SystemSettings table and the ProcessApp will point to the one that was installed.

!!! note
    The Integration Service and the ZPL Label Print site both default to port `40091`. Choose a different port for one of them when installing both.

Any out of the ordinary settings in IIS that are required for specific applications (e.g. the Scheduler app pool settings) will also be configured.