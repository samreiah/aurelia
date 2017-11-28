import { bindable, inject } from 'aurelia-framework';
import {Router} from 'aurelia-router';
import * as moment from 'moment';
import {lazy} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

// polyfill fetch client conditionally
const fetchPolyfill = !self.fetch
? import('isomorphic-fetch' /* webpackChunkName: 'fetch' */)
: Promise.resolve(self.fetch);

interface WeatherDetail {
    time: string;
    sun_rise: number;
    sun_set: string;
    location_type: string;
    timezone_name: string;
    title: string;
    woeid: string;
    latt_long: string;
    timezone: string
    consolidated_weather: Array<ConsolidatedWeather>
}

interface ConsolidatedWeather {
    air_pressure: number;
    applicable_date: string;
    created:string;
    humidity:number;
    id:number;
    max_temp: number;
    min_temp: number;
    predictability:number;
    the_temp:number;
    visibility:number;
    weather_state_abbr:string;
    weather_state_name:string;
    wind_direction:number;
    wind_direction_compass:string;
    wind_speed:string;
}

export class Detail {

    woeid: number;

    ImageBaseUrl: string = "https://www.metaweather.com/static/img/weather/png/64/";
    ImageUrl: string = "https://www.metaweather.com/static/img/weather/png/64/c.png";

    heading: string = 'Weather Details for next Five days';
    weatherDetail: WeatherDetail;
    http: HttpClient;

    constructor(@lazy(HttpClient) private getHttpClient: () => HttpClient) {}

    created(owningView, myView) {
        this.fetchConsolidatedDetails();
    }

    activate(params) {
        this.woeid = params.woeid;
    }

    async fetchConsolidatedDetails(): Promise<void> {
        // ensure fetch is polyfilled before we create the http client
        await fetchPolyfill;
        const http = this.http = this.getHttpClient();
    
        http.configure(config => {
          config
            .useStandardConfiguration()
            .withBaseUrl('http://localhost/weather.php');
        });
    
        const response = await http.fetch('?command=location&woeid='+this.woeid);
        this.weatherDetail = await response.json();

        if(this.weatherDetail !== null && this.weatherDetail !== undefined) {
            this.ImageUrl = this.ImageBaseUrl + this.weatherDetail.consolidated_weather[0].weather_state_abbr + '.png';
        }
    }
    
}

export class DateFormatValueConverter {
    toView(value) {
       return moment(value).format('dddd Do MMM YYYY');
    }
}

export class DecimalFormatValueConverter {
    toView(value) {
        return parseFloat(value).toFixed(2);
    }
}