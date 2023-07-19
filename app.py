from flask import Flask, request, jsonify, send_file
from flask_cors import CORS, cross_origin
import csv

from chat import get_response

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.get('/')
@cross_origin()
def index():
    return jsonify({"teste": "teste"})


@app.post('/predict')
def predict():
    print(request)
    text = request.get_json().get('message')
    # TODO: check if text is valid
    reponse = get_response(text)
    message = {"answer": reponse}
    return jsonify(message)


@app.route('/download')
def download():
    return send_file('./data/pf.csv')


@app.post('/upload')
def upload():
    all_conv_data = request.get_json().get('data')
    lista = list()
    for a in all_conv_data:
        lista.append((a["createdAt"], a["body"]))
    with open(f'./data/zebra.csv', 'w') as f:
        escritor_csv = csv.writer(f)
        escritor_csv.writerow(['datetime', 'message'])
        for createdAt, body in lista:
            escritor_csv.writerow([createdAt, body])
    return send_file(f'./data/zebra.csv')


if __name__ == '__main__':
    app.run(debug=True)
