from mysql.connector.pooling import MySQLConnectionPool
from dotenv import load_dotenv, dotenv_values

# env=".env.develop" # 開發環境
env=".env.production" # 正式環境
load_dotenv(override=True)

con_pool=MySQLConnectionPool(
    host="localhost",
    user="root",
    password=dotenv_values(env)["mysql_password"],
    database="taipei_scene",
    pool_name="myPool",
    pool_size=20,
    auth_plugin="mysql_native_password",
    port=dotenv_values(env)["mysql_port"]
)