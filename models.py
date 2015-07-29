from server import db
import datetime


class SiteUsers(db.Model):
    __tablename__ = 'siteusers'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True)
    email = db.Column(db.String(30), unique=True)
    password = db.column(db.String(20))
    registered_on = db.Column(db.DateTime, default=datetime.datetime.now())

    def is_authenticated(self):
        return True

    def is_anonymous(self):
        return False

    def is_active(self):
        return True

    def get_id(self):
        return self.id

    def __repr__(self):
        return '<User: {}'.format(self.username)