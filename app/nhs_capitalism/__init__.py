from flask import Blueprint

nhs_capitalism = Blueprint('nhs_capitalism', __name__, template_folder='templates', static_folder='static')

from app.nhs_capitalism import routes
