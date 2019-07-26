import { DefaultUrlSerializer, UrlTree } from '@angular/router';

export class LowerCaseUrlSerializer extends DefaultUrlSerializer {
  parse(url: string): UrlTree {
    // Optional Step: Do some stuff with the url if needed.

    // If you lower it in the optional step 
    // you don't need to use "toLowerCase" 
    // when you pass it down to the next function
    // if (url && url[1]) {
    //     url = url[1].toUpperCase() + url.substr(2).toLowerCase();
    // }
    console.log("path "+url);
    return super.parse(url);
  }
}
