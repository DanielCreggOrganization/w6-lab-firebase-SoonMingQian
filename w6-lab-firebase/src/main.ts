import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)), provideFirebaseApp(() => initializeApp({"projectId":"firebasse-ionic-project","appId":"1:960420931619:web:eccca905f4e5c8a8752996","storageBucket":"firebasse-ionic-project.appspot.com","apiKey":"AIzaSyC8AckwIqxDrqv2l5sJpYeg-Oj3QhUgXHs","authDomain":"firebasse-ionic-project.firebaseapp.com","messagingSenderId":"960420931619"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),
  ],
});
