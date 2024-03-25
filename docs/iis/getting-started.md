IIS is the web server that is used for hosting all of Granite's APIs and applications.
Once you've followed the steps below to install and configure IIS, you'll be ready to set up any of the Granite applications and APIs.

## Install

1. From the control panel, select Programs and then click on Turn Windows Features on or off:

    ![](img/controlPanelWindowsFeatures.png)


2. Go through the dialog that pops up to select the features shown below

    === "Windows Desktop"
        On desktop versions of Windows, select the following features under `Internet Information Services` and click OK:

        ![](img/desktopIisSettings.png)

    === "Windows Server"
        On windows server editions, the Server Manager page pops up instead. Click next until you get to the Server Roles page:

        ![](img/serverIisSettings.png)

        Select these features under Web Server, then go to the next page and click install.

3. Install the [IIS URL Rewrite Module](https://download.microsoft.com/download/1/2/8/128E2E22-C1B9-44A4-BE2A-5859ED1D4592/rewrite_amd64_en-US.msi)

4. Install the latest ASP.NET Core Runtime 6 and 8 hosting bundles

    - [ASP.NET Core 8](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
    - [ASP.NET Core 6](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)

    ![](img/hostingBundle.png)



