import { setWorldConstructor } from 'cucumber';

class World {
  public requestHeaders: any = null;

  public setRequestHeaders(headers: any) {
    this.requestHeaders = headers;
  }
}

setWorldConstructor(World);
