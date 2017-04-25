# fetch-adapter

[![npm version](https://img.shields.io/npm/v/fetch-adapter.svg)](https://www.npmjs.com/package/fetch-adapter)

`fetch-adapter` is a network adapter designed to enable [`redux-query`](https://github.com/amplitude/redux-query) to work with the [Fetch API](https://developer.mozilla.org/en/docs/Web/API/Fetch_API).

> This adapter will not work with versions >= 1.4.0 and < 2.0.0 of `redux-query` due to [an issue in the library](https://github.com/amplitude/redux-query/issues/68).

## Getting started

Install `fetch-adapter` via npm:

```sh
$ npm install --save fetch-adapter
```

If you are already using or setting up `redux-query` in your project, your store configuration should look like this:

```js
// configureStore.js
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { entitiesReducer, queriesReducer, queryMiddleware } from 'redux-query';
import createLogger from 'redux-logger';

export const getQueries = (state) => state.queries;
export const getEntities = (state) => state.entities;

const reducer = combineReducers({
    entities: entitiesReducer,
    queries: queriesReducer,
});

const logger = createLogger();
const store = createStore(
    reducer,
    applyMiddleware(queryMiddleware(getQueries, getEntities), logger)
);
```

In order to get `redux-query` to perform network requests with `window.fetch()`, all you need to do is pass this adapter to the advanced query middleware:

```diff
diff --git a/configureStore.js b/configureStore.js
index cd5be03..b3bda95 100644
--- a/index.js
+++ b/index.js
@@ -1,5 +1,6 @@
 import { applyMiddleware, createStore, combineReducers } from 'redux';
-import { entitiesReducer, queriesReducer, queryMiddleware } from 'redux-query';
+import { entitiesReducer, queriesReducer, queryMiddlewareAdvanced } from 'redux-query';
+import fetchNetworkAdapter from 'fetch-adapter';
 import createLogger from 'redux-logger';

 export const getQueries = (state) => state.queries;
@@ -13,5 +14,8 @@ const reducer = combineReducers({
 const logger = createLogger();
 const store = createStore(
     reducer,
-    applyMiddleware(queryMiddleware(getQueries, getEntities), logger)
+    applyMiddleware(
+      queryMiddlewareAdvanced(fetchNetworkAdapter)(getQueries, getEntities),
+      logger
+    )
 );
```
