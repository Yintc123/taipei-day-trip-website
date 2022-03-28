from flask import *
from api.attractions_api import app2
from api.user_api import app3
from api.tour_api import app4

app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

app.register_blueprint(app2, url_prefix="/api")
app.register_blueprint(app3, url_prefix="/api")
app.register_blueprint(app4, url_prefix="/api")

app.debug=True
# app.run(host="0.0.0.0", port=3000)#change port to 3000
app.run(port=3000) #test on my computer

