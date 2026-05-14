FROM python

WORKDIR /app

COPY requierements.txt .

RUN pip install -r requierements.txt

COPY . .

CMD [ "python", "app.py" ]