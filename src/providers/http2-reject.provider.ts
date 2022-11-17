import {BindingScope, injectable, Provider} from '@loopback/core';
import {HandlerContext} from '@loopback/rest';

export type Http2Reject = any;

@injectable({scope: BindingScope.TRANSIENT})
export class Http2RejectProvider implements Provider<Http2Reject> {
  constructor(/* Add @inject to inject parameters */) {}

  value() {
    return (ctx: HandlerContext, err: Error) => {
      console.log('reject provider--', err);
    };
  }
}
