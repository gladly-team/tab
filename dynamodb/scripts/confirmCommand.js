
function prompt(question, callback) {
  const stdin = process.stdin;
  const stdout = process.stdout;

  stdin.resume();
  stdout.write(question);

  stdin.once('data', (data) => {
    callback(data.toString().trim());
  });
}

const databaseEndpoint = process.env.DYNAMODB_ENDPOINT;

// Safety check to prevent accidentally running database operations
// against a production DB.
const confirmCommand = function(callback) {

  // Standard local dev enpoint.
  if (databaseEndpoint === 'http://localhost:8000') {
    callback();
    return;
  }

  console.log(`You are running against a database at ${databaseEndpoint}.`);
  console.log('Are you sure you want to continue? (y/n)');
  prompt('', (input) => {
    if (input != 'y') {
      console.log('Exiting.');
      process.exit();
    } else {
      callback();
    }
  });
};

export default confirmCommand;
