REPORTER = spec
test: npm-install
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter $(REPORTER)

lib-cov:
	rm -rf lib-cov
	jscoverage lib lib-cov

npm-install:
	npm install

test-cov:	lib-cov
	rm -f coverage.html
	@THRASHER_COVERAGE=1 $(MAKE) test REPORTER=html-cov > coverage.html
	rm -rf lib-cov

test-coveralls:	lib-cov
	echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@THRASHER_COVERAGE=1 $(MAKE) test REPORTER=json-cov 2> /dev/null | ./node_modules/coveralls/bin/coveralls.js
	rm -rf lib-cov


.PHONY: test

