import { ModuleBaseConstant } from './abstraction';

export class ContentTypeConstant extends ModuleBaseConstant {
  public static readonly APPLICATION_JSON = 'application/json';
  public static readonly MULTIPART_FORM_DATA = 'multipart/form-data';
  public static readonly APPLICATION_X_WWW_FORM_URLENCODED = 'application/x-www-form-urlencoded';
  public static readonly TEXT_PLAIN = 'text/plain';
  public static readonly TEXT_HTML = 'text/html';
  public static readonly APPLICATION_OCTET_STREAM = 'application/octet-stream';
  public static readonly APPLICATION_PDF = 'application/pdf';
}
