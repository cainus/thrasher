REPORTER = spec
test:
	@NODE_ENV=test ./node_modules/.bin/mocha -b --reporter $(REPORTER)

lib-cov:
	rm -rf lib-cov
	jscoverage lib lib-cov

test-cov:	lib-cov
	rm -f coverage.html
	@THRASHER_COVERAGE=1 $(MAKE) test REPORTER=html-cov > coverage.html
	rm -rf lib-cov

.PHONY: test

