import { Catch, ArgumentsHost } from "@nestjs/common";
import { BaseWsExceptionFilter } from "@nestjs/websockets";

@Catch()
export class WebSocketExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
  }
}
