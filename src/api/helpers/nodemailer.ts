import { env } from './env'
import { Template } from '../../..';

export default async (sendTo: string, template: Template) => {

	const mailOptions = {
		from: env('SENDER_EMAIL'),
		to: sendTo,
		subject: template.subject,
		text: template.text,
		html: template.html
	}

	console.log('mail Sent', mailOptions)
}
