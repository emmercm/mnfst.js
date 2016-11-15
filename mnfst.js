/**
 * Documentation:
 *  - W3C: https://www.w3.org/TR/appmanifest/
 *  - MDN: https://developer.mozilla.org/en-US/docs/Web/Manifest
 *  - IE: https://msdn.microsoft.com/en-us/library/gg491732(v=vs.85).aspx
 *  - Safari: https://developer.apple.com/library/content/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html
 */


var mnfst = function() {
   // Map manifest properties to <meta> names
   var metaMapping = [
      {
         manifestName: 'display',
         name: ['mobile-web-app-capable', 'apple-mobile-web-app-capable']
      },
      {
         manifestName: 'name',
         name: ['apple-mobile-web-app-title', 'application-name', 'msapplication-tooltip']
      },
      {
         manifestName: 'short_name',
         name: ['apple-mobile-web-app-title', 'application-name']
      },
      {
         manifestName: 'theme_color',
         name: ['theme-color', 'msapplication-TileColor']
      },
      {
         manifestName: 'start_url',
         name: ['msapplication-starturl']
      }
   ];

   // Exit if XMLHttpRequest isn't available
   if(!window.XMLHttpRequest) {
      return 1;
   }

   // Find the <head> tag
   var headTag = document.getElementsByTagName('head');
   if(!headTag.length) {
      // <head> tag not found, exit, we need it for everything
      return 1;
   }
   headTag = headTag[0];

   // Find the first manifest <link>
   var manifestHref;
   var links = document.getElementsByTagName('link');
   for(var i = 0; i < links.length; i++) {
      if('rel' in links[i] && links[i].rel == 'manifest') {
         manifestHref = links[i].href;
         break;
      }
   }
   if(!manifestHref) {
      // No manifest found, exit, we need it for everything
      return 1;
   }

   // Generate full manifest URL
   var locationHref;
   if(/^[a-z]+:\/\//i.test(manifestHref)) {
      locationHref = manifestHref;
   } else {
      locationHref = window.location.hostname + manifestHref;
   }

   // Fetch the manifest
   var ajax = new XMLHttpRequest();
   ajax.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200) {
         var manifestRelative = locationHref.replace(document.location.origin + '/', '');
         manifestRelative = manifestRelative.substr(0, manifestRelative.lastIndexOf('/'));

         var manifest = JSON.parse(this.responseText);
         var metaTags = {};
         var linkTags = {};

         // Process metaMapping properties
         for(var i = 0; i < metaMapping.length; i++) {
            if(metaMapping[i].manifestName in manifest) {
               for(var j = 0; j < metaMapping[i].name.length; j++) {
                  // Special cases
                  if(metaMapping[i].name[j] == 'apple-mobile-web-app-capable' && manifest[metaMapping[i].manifestName] == 'standalone') {
                     manifest[metaMapping[i].manifestName] = 'yes';
                     metaTags['apple-mobile-web-app-status-bar-style'] = {
                        name: 'apple-mobile-web-app-status-bar-style',
                        content: 'black-translucent'
                     };
                  }
                  // Store properties
                  metaTags[metaMapping[i].name[j]] = {
                     name: metaMapping[i].name[j],
                     content: manifest[metaMapping[i].manifestName]
                  };
               }
            }
         }

         // Process icons
         if('icons' in manifest) {
            for(var i = 0; i < manifest.icons.length; i++) {
               // Don't process icons with multiple sizes
               if(manifest.icons[i].sizes.indexOf(' ') === -1) {
                  // Generate complete relative URL
                  if(manifestRelative != '') {
                     manifest.icons[i].src = manifestRelative + '/' + manifest.icons[i].src;
                  }
                  // Parse sizes
                  manifest.icons[i].sizes = manifest.icons[i].sizes.split('x');

                  // msapplication
                  if(manifest.icons[i].sizes[0] == manifest.icons[i].sizes[1]) {
                     var msappName = 'msapplication-square' + manifest.icons[i].sizes[0] + 'x' + manifest.icons[i].sizes[1] + 'logo';
                     metaTags[msappName] = {
                        name: msappName,
                        content: manifest.icons[i].src
                     };
                  } else if(manifest.icons[i].sizes[0] > manifest.icons[i].sizes[1]) {
                     var msappName = 'msapplication-wide' + manifest.icons[i].sizes[0] + 'x' + manifest.icons[i].sizes[1] + 'logo';
                     metaTags[metName] = {
                        name: msappName,
                        content: manifest.icons[i].src
                     };
                  }

                  // apple-touch-icon
                  linkTags['ati-' + manifest.icons[i].sizes[0] + 'x' + manifest.icons[i].sizes[1]] = {
                     rel: 'apple-touch-icon',
                     sizes: manifest.icons[i].sizes[0] + 'x' + manifest.icons[i].sizes[1],
                     href: manifest.icons[i].src
                  };
               }
            }
         }

         // Add <meta> tags
         for(var key in metaTags) {
            var metaTag = document.createElement('meta');
            for(var prop in metaTags[key]) {
               metaTag[prop] = metaTags[key][prop];
            }
            headTag.appendChild(metaTag);
         }

         // Add <link> tags
         for(var key in linkTags) {
            var linkTag = document.createElement('link');
            for(var prop in linkTags[key]) {
               linkTag[prop] = linkTags[key][prop];
            }
            headTag.appendChild(linkTag);
         }
      }
   };
   ajax.open('GET', locationHref, true);
   ajax.send();

   return 0;
}();
