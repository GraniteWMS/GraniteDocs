# Getting Started

## Database connection

The first thing you will need to do in Superset is to connect it to a database. Go to settings > Database Connections

Under supported databases select Other.

![](./superset-img/database_connection_1.PNG)

Then set your database name and add the connection string using one of the following connection string templates.

```
mssql+pymssql://<username>:<password>@<ip>:<port>/<database name>
```
Example: 
mssql+pymssql://Granite:password123@localhost:1433/GraniteDatabase

```
mssql+pymssql://<username>:<password>@<named instance>/<database name>
```
Example: 
mssql+pymssql://Granite:password123@DESKTOP-123\LocalSql/GraniteDatabase

If your password contains the @ symbol. You will need to replace that with %40 for it to work. 
So if your password is password@123 you would need to use password%40123.

![](./superset-img/database_connection_2.PNG)

### Troubleshooting

If you get an error like this when testing the connection

![](./superset-img/database_connection_error.png)

Ensure that tcp/ip is enable in sql server configuration as below. 

![](./superset-img/database_connection_tcp.png)