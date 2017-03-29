FROM ubuntu:14.04

RUN mkdir /opt/dynamodb
RUN mkdir /opt/dynamodb/db

WORKDIR /opt/dynamodb

RUN apt-get update && apt-get install -y \
  curl \
  default-jre \
  wget

RUN wget -O /tmp/dynamodb https://s3-us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_latest.tar.gz
RUN tar xfz /tmp/dynamodb

# Install Node.
RUN curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash - \
    && apt-get update \
    && apt-get install -y nodejs

ENTRYPOINT ["java", "-Djava.library.path=.", "-jar", "/opt/dynamodb/DynamoDBLocal.jar", "-dbPath", "/opt/dynamodb/db", "-sharedDb"]
CMD ["-port", "8000"]

VOLUME ["/opt/dynamodb/db"]

EXPOSE 8000

RUN mkdir /dynamodb
WORKDIR /dynamodb
