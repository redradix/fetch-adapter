# fetch-adapter

`fetch-adapter` is a network adapter designed to enable [`redux-query`](https://github.com/amplitude/redux-query) to work with the [Fetch API](https://developer.mozilla.org/en/docs/Web/API/Fetch_API).

Say you start using `redux-query` in a project your project, following its README:

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

Say you then realize you need `redux-query` to make use of `window.fetch()`. All you need to do is pass this adapter to `queryMiddlewareAdvanced`:

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
