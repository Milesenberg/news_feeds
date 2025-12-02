from flask import Blueprint, render_template

waifu = Blueprint('waifu', __name__, template_folder='templates', static_folder='static')

@waifu.route('/')
def index():
    return render_template('waifu.html')
