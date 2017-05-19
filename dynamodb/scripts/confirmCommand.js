
function prompt(question, callback) {
  var stdin = process.stdin;
  var stdout = process.stdout;

  stdin.resume();
  stdout.write(question);

  stdin.once('data', function (data) {
      callback(data.toString().trim());
  });
}

// Safety check to prevent accidentally running commands on production.
function confirmCommand(callback) {
  if (process.env.DYNAMODB_ENDPOINT !== 'http://localhost:8000') {
    var msg = 'You are running against a database at ' + process.env.DYNAMODB_ENDPOINT + '. ' +
      'Are you sure you want to continue? (y/n)\n';
    prompt(msg, function(input) {
      if (input !== 'y') {
        console.log('Exiting.');
        process.exit();
      } else {
        callback();
      }
    });
  }
  callback();
}

module.exports = confirmCommand;
