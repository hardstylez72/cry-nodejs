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
	yarn --cwd ./build install --production
