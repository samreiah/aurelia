import {Aurelia} from 'aurelia-framework';
import {Router, RouterConfiguration} from 'aurelia-router';
import {PLATFORM} from 'aurelia-pal';

export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Weather App';
    config.map([
      { route: ['', 'home'],    name: 'home',         moduleId: PLATFORM.moduleName('./home'),      nav: true, title: 'Home' },
      { route: 'weather/:woeid', name: 'weather',      moduleId: PLATFORM.moduleName('./detail'),      nav: false, title: 'Detail' },
      { route: 'search/:keyword', name: 'search',      moduleId: PLATFORM.moduleName('./search'),      nav: false, title: 'Search' },
    ]);

    this.router = router;
  }
}
