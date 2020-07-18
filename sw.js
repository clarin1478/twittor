// IMPORTS

importScripts('js/sw-utils.js');


// 2. Creamos los diferentes caché
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v1';
// 2.3. Caché de las librerias
const INMUTABLE_CACHE = 'inmutable-v1';

// 3. Creamos el app shell (corazón de nuestra aplicación)
const APP_SHELL = [

    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/spiderman.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/hulk.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',

];

// 3.1. Creamos el app shell (inmutable con las librerias)
const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js',

];

// 4. Al instalar el service worker, guardamos el app shell en el caché static y
// el app shell inmutable en el caché inmutable, esperamos a que las dos respondan.
self.addEventListener('install', event =>{

    const cacheStatic = caches.open( STATIC_CACHE ).then( cache =>{
        cache.addAll( APP_SHELL);
    });

    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then( cache =>{
        cache.addAll( APP_SHELL_INMUTABLE);
    });

    event.waitUntil( Promise.all([ cacheStatic, cacheInmutable]))
})

// 5. En el activate actualizaremos el caché si es necesario. borramos el viejo.
self.addEventListener('activate', event => {

    const respuesta = caches.keys().then( keys => {
        keys.forEach( key => {
            if ( key !== STATIC_CACHE && key.includes('static') ){
                return caches.delete(key);
            }
        })
    });

    event.waitUntil(respuesta);

});

// 6. Estrategia del caché: Network 

self.addEventListener('fetch', event =>{

    const respuesta = caches.match(event.request).then( resp => {

        if (resp) {
            return resp;
        } else {
            return fetch(event.request).then( resp2 => {
                return actualizaCacheDinamico( DYNAMIC_CACHE, event.request, resp2);
            });
        }
    })



    event.waitUntil(respuesta);

})