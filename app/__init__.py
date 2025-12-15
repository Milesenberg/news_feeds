from flask import Flask

def create_app():
    app = Flask(__name__)

    from app.main.routes import main
    from app.news.routes import news, start_background_thread
    from app.sequencer.routes import sequencer



    app.register_blueprint(main)
    app.register_blueprint(news, url_prefix='/news')
    app.register_blueprint(sequencer, url_prefix='/sequencer')



    # Start background thread for news feed updates
    start_background_thread()

    from app.waifu.routes import waifu
    app.register_blueprint(waifu, url_prefix='/waifu')

    from app.time.routes import time
    app.register_blueprint(time, url_prefix='/time')

    from app.narrative.routes import narrative
    app.register_blueprint(narrative, url_prefix='/narrative')

    from app.picard.routes import picard
    app.register_blueprint(picard, url_prefix='/picard')

    from app.justice.routes import justice
    app.register_blueprint(justice, url_prefix='/justice')

    from app.dnd.routes import dnd
    app.register_blueprint(dnd, url_prefix='/dnd')

    from app.nhs_capitalism.routes import nhs_capitalism
    app.register_blueprint(nhs_capitalism, url_prefix='/nhs_capitalism')

    return app

