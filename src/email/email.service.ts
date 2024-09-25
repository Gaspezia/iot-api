import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as hbs from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import * as mjml2html from 'mjml';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    hbs.registerHelper('eq', (a, b) => a === b);
    hbs.registerHelper('gt', (a, b) => a > b);
    hbs.registerHelper('abs', (value) => Math.abs(value));
  }

  // TODO: Julien await / return

  private getTemplate(templateName: string, context: any): string {
    const filePath = path.resolve(process.cwd(), `src/email/templates/${templateName}.mjml`);
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = hbs.compile(source);
    const mjmlContent = template(context);
    const { html } = mjml2html(mjmlContent);
    return html;
  }

  async sendEmail(to: string, subject: string, templateName: string, context: any) {
    const html = this.getTemplate(templateName, context);

    const mailOptions = {
      from: '"Gaspezia Network" <contact@gaspezia.fr>',
      to,
      subject,
      html
    };

    await this.transporter.sendMail(mailOptions);
  }
}
