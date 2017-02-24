FROM node:6.9

# Make our app directories.
RUN mkdir /lambda
WORKDIR /lambda

# Install Node modules.
ADD package.json package.json
RUN npm install

ADD ./ /lambda
EXPOSE 8001

CMD npm run start
