import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

API_KEY = "a2gMxrvXE4w05sgZaGuNmTYzEGWpUJ6o"
API_ENDPOINT = "https://app.ticketmaster.com/discovery/v2"

@app.route("/")
def home():
    return app.send_static_file("index.html")

# Define a route to retrieve events from the Ticketmaster API
@app.route('/events')
def get_events():
    geopoint = request.args.get('geoPoint', None)
    radius = request.args.get('radius', 10)
    category = request.args.get('category')
    keyword = request.args.get('keyword')

    if category == "music":
        segmentId = "KZFzniwnSyZfZ7v7nJ"
    elif category == "sports":
        segmentId = "KZFzniwnSyZfZ7v7nE"
    elif category == "arts":
        segmentId = "KZFzniwnSyZfZ7v7na"
    elif category == "film":
        segmentId = "KZFzniwnSyZfZ7v7nn"
    elif category == 'misc':
        segmentId = "KZFzniwnSyZfZ7v7n1"
    else:
        segmentId = ''
        
    params = {
        'apikey': API_KEY,
        'unit': "miles",
        'segmentId': segmentId,
        'keyword': keyword, 
        'radius': radius,
        'geoPoint': geopoint
    }

    response = requests.get(f'{API_ENDPOINT}/events.json', params=params)
    if response.status_code == 200:
      data = response.json()
      if '_embedded' in data and 'events' in data['_embedded']:
        event_data = response.json()['_embedded']['events']
        return jsonify(event_data)
      else:
         return jsonify({'error': 'No Records Found'})
    else:
        return jsonify({'error': 'Unable to retrieve events'}), response.status_code


@app.route('/event/<event_id>', methods=['GET'])
def get_event(event_id):
    url = f'https://app.ticketmaster.com/discovery/v2/events/{event_id}?apikey={API_KEY}'
    response = requests.get(url)
    if response.status_code == 200 and response.content:
        event_data = response.json()
        return jsonify(event_data)
    else:
        return jsonify({'message': 'Event not found'}), 404

@app.route('/venues/<venue_name>')
def get_venue(venue_name):
    response = requests.get(f'https://app.ticketmaster.com/discovery/v2/venues?apikey={API_KEY}&keyword={venue_name}')
    if response.status_code == 200 and response.content:
        venue_data = response.json()['_embedded']['venues'][0]
        return jsonify(venue_data)
    else:
        return jsonify({'message': 'Venue not found'}), 404

if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. You
    # can configure startup instructions by adding `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)