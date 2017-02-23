FROM node:6.9

# Make our app directories.
RUN mkdir /web
WORKDIR /web

# Install Node modules.
ADD package.json package.json
RUN npm install

# Copy our app.
ADD ./ /web
EXPOSE 3000

CMD npm run start
