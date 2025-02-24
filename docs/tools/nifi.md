# Apache NiFi

!!! warning
    Under construction

## Setup

Download the following:

- [NiFi Standard](https://nifi.apache.org/download/)
- [Java development kit x64 Compressed Archive](https://www.oracle.com/za/java/technologies/downloads/)
- [NSSM](https://nssm.cc/download)

Once you have extracted all the NiFi files, create a new folder inside the folder you will run Nifi from called `jdk`.
Paste all of the files from the JDK compressed archive into the jdk folder:

![](nifi-img/jdk.png)

Now we need to point NiFi to where we have the JDK installed. Browse into NiFi's `bin` folder and edit the `nifi-env.cmd` file to look like this:

```batch
rem Set application home directory based on parent directory of script location
pushd %~dp0..
set NIFI_HOME=%CD%
popd

rem Set Java version
set JAVA_HOME=%NIFI_HOME%\jdk

rem Set run directory for process identifier tracking
set NIFI_PID_DIR=%NIFI_HOME%\run

rem Set application log directory
set NIFI_LOG_DIR=%NIFI_HOME%\logs
```

By default NiFi will run on port 8443. If you need to change the port, open the `nifi\conf\nifi.properties` file and set the port on line 162:

![](nifi-img/nifi-port.png)

Next, copy the `nssm.exe` into the the `nifi\bin` folder. 
Open a terminal window and browse to the `nifi\bin` folder, then execute the following

```cmd
nssm install NiFi
```

Enter the path to the `nifi.cmd` file and provide Nssm with the folder path and start argument, then click Install Service:

![](nifi-img/nssm-install.png)