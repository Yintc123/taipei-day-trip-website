# WSGI Gunicorn
from app import app
import multiprocessing as mp


bind = "0.0.0.0:3000"
# 如要使用127.0.0.1，僅需":port"，127.0.0.1 為 default
# bind = ":3000"

# daemon = True # 背景運行

# workers = mp.cpu_count() * 2 + 1
workers = 4 # 如僅有 workers，worker_class 為 sync
threads = 4 # 每個 worker 分配的 threads 數量，如 threads > 1，worker_class 為 gthread
# worker_class = "gthread"

# import gevent.monkey
# gevent.monkey.patch_all() # 如 worker_class 設定為 gevent
# worker_class = "gevent" # 非同步處理 HTTP request

keepalive = 60 # 當請求結束後，仍然持續 60 秒的連線時間，避免不斷請求連線（三次握手）消耗資源
timeout = 30 # 請求的超時時間，30秒未完成 Server 即斷開連線