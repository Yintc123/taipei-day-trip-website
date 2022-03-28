from mysql.connector.pooling import MySQLConnectionPool

con_pool=MySQLConnectionPool(
    host="localhost",
    user="root",
    # password="AbC123456",
    database="taipei_scene",
    pool_name="myPool",
    pool_size=20,
    # auth_plugin="mysql_native_password",
    port="3400",
    password="abc123456"
)