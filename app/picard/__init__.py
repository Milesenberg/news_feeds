from flask import Blueprint

picard = Blueprint('picard', __name__, template_folder='templates', static_folder='static')

from app.picard import routes
