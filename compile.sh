cp src/js/constants.js bin/constants.js
cp src/html/entry.html bin/index.html
cp src/app.js /bin/app.js
cat src/js/loader.js src/js/controller.js src/js/controller-net.js src/js/network.js src/js/physics.js src/js/player.js src/js/player.net.js src/js/rendering.js src/js/rendering.net.js src/js/ui.js > tmp.full.js
java -jar yuicompressor.jar tmp.full.js -o bin/loader.min.js
rm tmp.full.js
