.PHONY: build pub clean

build:
	tsc || true
	rm -rf build
	mkdir build
	cp Dockerfile build/Dockerfile
	cp deploy.sh build/deploy.sh
	cp yarn.lock build/yarn.lock
	cp package.json build/package.json
	cp -R dist build/dist
	rm build/dist/src/test.js
	rm build/dist/src/test.js.map
	yarn --cwd ./build install --production
