export default function(question, callback) {
  const stdin = process.stdin
  const stdout = process.stdout

  stdin.resume()
  stdout.write(question)

  stdin.once('data', data => {
    callback(data.toString().trim())
  })
}
