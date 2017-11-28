//import {computedFrom} from 'aurelia-framework';
import {lazy} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {Router} from 'aurelia-router';

// polyfill fetch client conditionally
const fetchPolyfill = !self.fetch
? import('isomorphic-fetch' /* webpackChunkName: 'fetch' */)
: Promise.resolve(self.fetch);

interface CityDetail {
  city: string;
  woeid: number;
  title: string;
  location_type: string;
  latt_long: string;
}

export class Home {

  heading: string = 'Welcome to the Aurelia Weather App';
  cities: Array<string> = ['Istanbul', 'Berlin', 'London', 'Helsinki', 'Dublin', 'Vancouver'];
  cityDetails: Array<CityDetail> = [];
  http: HttpClient;
  searchQuery: String = "";
  theRouter;

  constructor(@lazy(HttpClient) private getHttpClient: () => HttpClient) {
  }

  async activate(): Promise<void> {
    // ensure fetch is polyfilled before we create the http client
    if(this.searchQuery === null || this.searchQuery === "" || this.searchQuery === undefined) {

      await fetchPolyfill;
      const http = this.http = this.getHttpClient();
  
      http.configure(config => {
        config
          .useStandardConfiguration()
          .withBaseUrl('http://localhost/weather.php');
      });
  
      for (var i = 0; i < this.cities.length; i++) { 
        const response = await http.fetch('?command=search&keyword='+this.cities[i]);
        let temp = await response.json();
        this.cityDetails.push(temp[0]);
      }
    }
    
  }

  async submit() {
    //this.theRouter.navigate("/search/"+this.searchQuery);
  }


}


