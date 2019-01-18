export default function(question, callback) {
  const { stdin, stdout } = process
  stdin.resume()
  stdout.write(question)

  stdin.once('data', data => {
    callback(data.toString().trim())
  })
}
