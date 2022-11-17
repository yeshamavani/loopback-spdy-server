import {BindingScope, inject, injectable, Provider} from '@loopback/core';
import {OperationRetval, Request, Response, RestBindings} from '@loopback/rest';

export type Http2Send = any;

@injectable({scope: BindingScope.TRANSIENT})
export class Http2SendProvider implements Provider<Http2Send> {
  constructor(@inject(RestBindings.Http.REQUEST) public request: Request) {}

  value() {
    return (response: Response, result: OperationRetval) => {
      this.action(response, result);
    };
  }

  action(response: Response, result: OperationRetval) {
    // console.log('Result', response, result);
    console.log(`send provider -- ${JSON.stringify(result)}`);
    response.send(result);
  }
}
