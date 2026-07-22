export interface IEmailService {
  sendEmail(to: string, subject: string, template: string, payload: Record<string, any>): Promise<boolean>;
}
