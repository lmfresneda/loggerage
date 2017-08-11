## Contributing

If you want to contribute to coding, check this pending tasks:

- [x] Implement async methods
- [x] Implement object options in constructor, instead defaultLogLevel and version
- [x] Save the loggers to offer them with a get methods, like `Loggerage.getLogger('NAME_LOGGER')`
- [x] Implement get log by query system
- [ ] Implement getStreamLog method
- [ ] Implement method or property that promisify all async methods automatically
- [ ] Develop storages for different scenarios (like mysql, files log, etc)
- [ ] Allow multiple storage (appendStorage method, for example)
- [ ] Test, more test

### Run test

```bash
$ npm install && npm test
```

## Documentation

This doc is built thanks to [MkDocs](http://www.mkdocs.org/). For contributing in doc, you must install [mkdocs (with python)](http://www.mkdocs.org/#installation) and install [markdown-checklist.extension](https://github.com/FND/markdown-checklist) also.

### Instructions

* Clone the [loggerage repository](https://github.com/lmfresneda/loggerage) if you have not done it before:

```bash
$ git clone https://github.com/lmfresneda/loggerage.git
$ cd loggerage
```

* Clone again but this time the 'gh-pages' branch in the 'site' folder

```bash
$ git clone -b gh-pages --single-branch https://github.com/lmfresneda/loggerage.git ./site/
```

* Your project looks like this now:

```
...
src/
docs/
site/ <-- created by second clone
...
package.json
...
```

In `docs` folder are the complete documentation in Markdown format, and this is where you will work. When you building de page with the command `mkdocs build`, a `site` folder is updated.

* Happy doc!
