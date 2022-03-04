from mysql.connector.pooling import MySQLConnectionPool

con_pool=MySQLConnectionPool(
    host="localhost",
    port="3400",
    user="root",
    password="abc123456",
    database="Taipei_Scene",
    pool_name="myPool",
    pool_size=20,
)