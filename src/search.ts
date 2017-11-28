//import {computedFrom} from 'aurelia-framework';
import {lazy} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

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

export class Search {

    heading: string = 'Search';
    cityDetails: Array<CityDetail> = [];
    http: HttpClient;
    searchQuery: String = "";

    constructor(@lazy(HttpClient) private getHttpClient: () => HttpClient) {}
    
    created(owningView, myView) {
        this.fetchConsolidatedDetails();
    }

    activate(params) {
        this.searchQuery = params.keyword;
    }

    async fetchConsolidatedDetails(): Promise<void> {
        if(this.searchQuery !== null && this.searchQuery !== undefined) {
            
            await fetchPolyfill;
            const http = this.http = this.getHttpClient();
    
            http.configure(config => {
            config
                .useStandardConfiguration()
                .withBaseUrl('http://localhost/weather.php');
            });
    
            const response = await http.fetch('?command=search&keyword='+this.searchQuery);
            this.cityDetails = await response.json();
    
        }
    }
}