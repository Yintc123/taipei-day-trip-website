from mysql.connector.pooling import MySQLConnectionPool

con_pool=MySQLConnectionPool(
    user="root",
    password="AbC123456",
    database="Taipei_Scene",
    pool_name="myPool",
    pool_size=20,
    auth_plugin="mysql_native_password"
)