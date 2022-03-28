from flask import Blueprint

app4=Blueprint("tour_api", __name__)

@app4.route("/booking")
def book():
    return "123"