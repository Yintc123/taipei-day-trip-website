from dotenv import load_dotenv, dotenv_values

env=".env.production"
load_dotenv()
load_dotenv(override=True)
# print(load_dotenv())
print(dotenv_values())
print(dotenv_values(env)["mysql_password"])