FROM node:6.9

# Make our app directories.
RUN mkdir /graphql
WORKDIR /graphql

# Install Node modules.
ADD package.json package.json
RUN npm install

# Copy our app.
ADD ./ /graphql
EXPOSE 8080

CMD npm run start
