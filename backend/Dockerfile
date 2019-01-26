FROM 8.15.0-alpine
COPY . /app
RUN cd /app && npm install
EXEC ["node", "index.js"]
