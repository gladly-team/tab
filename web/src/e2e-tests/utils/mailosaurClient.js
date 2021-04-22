import MailosaurClient from 'mailosaur'
import promiseRetry from 'promise-retry'

/**
 * Email Client Builder.
 * call EmailClient.build({params}) to receive a client
 * @param {string} emailOverride - an override email instead of getting a newly generated email address
 * @param {Date} returnedAfter - to search all emails returned after a certain date
 * @return {Class} An instance of EmailClient, a mock function
 * * @method getLink - gets the email validation link for the email address it generated
 * * @property  email - a randomly generated email address to send and receive emails from
 */
class EmailClient {
  constructor(email, initializedClient, receivedAfter) {
    this.mailosaur = initializedClient
    this.email = email
    this.serverId = process.env.MAILOSAUR_SERVER_ID
    this.receivedAfter = receivedAfter
  }
  static async build({ emailOverride, receivedAfter } = {}) {
    const mailosaur = new MailosaurClient(process.env.MAILOSAUR_API_KEY)
    console.log(process.env.MAILOSAUR_SERVER_ID)
    const email = emailOverride
      ? emailOverride
      : await mailosaur.servers.generateEmailAddress(
          process.env.MAILOSAUR_SERVER_ID
        )
    return new EmailClient(email, mailosaur, receivedAfter)
  }
  async getLink() {
    const criteria = {
      sentTo: this.email,
    }
    const email = await promiseRetry(
      async () =>
        this.mailosaur.messages.get(this.serverId, criteria, {
          receivedAfter: this.receivedAfter,
        }),
      { maxTimeout: 5000 }
    )
    const firstLink = email.html.links[0]
    return firstLink.href
  }
}
export default EmailClient
