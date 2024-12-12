import process from 'node:process';globalThis._importMeta_={url:import.meta.url,env:process.env};import { mkdirSync } from 'node:fs';
import { Server } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parentPort, threadId } from 'node:worker_threads';
import { getRequestHeader, splitCookiesString, setResponseHeader, setResponseStatus, send, defineEventHandler, handleCacheHeaders, createEvent, fetchWithEvent, isEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, createApp, createRouter as createRouter$1, toNodeListener, lazyEventHandler, createError, getRouterParam, getQuery as getQuery$1, readBody, getValidatedQuery, getHeader, sendError } from 'file://C:/Users/PC/Downloads/UTL%20SHORTENER%20REAL/APIShortener/node_modules/h3/dist/index.mjs';
import { provider, isWindows } from 'file://C:/Users/PC/Downloads/UTL%20SHORTENER%20REAL/APIShortener/node_modules/std-env/dist/index.mjs';
import destr from 'file://C:/Users/PC/Downloads/UTL%20SHORTENER%20REAL/APIShortener/node_modules/destr/dist/index.mjs';
import { createHooks } from 'file://C:/Users/PC/Downloads/UTL%20SHORTENER%20REAL/APIShortener/node_modules/hookable/dist/index.mjs';
import { createFetch as createFetch$1, Headers as Headers$1 } from 'file://C:/Users/PC/Downloads/UTL%20SHORTENER%20REAL/APIShortener/node_modules/ofetch/dist/node.mjs';
import { createCall, createFetch } from 'file://C:/Users/PC/Downloads/UTL%20SHORTENER%20REAL/APIShortener/node_modules/unenv/runtime/fetch/index.mjs';
import { hash } from 'file://C:/Users/PC/Downloads/UTL%20SHORTENER%20REAL/APIShortener/node_modules/ohash/dist/index.mjs';
import { parseURL, withoutBase, joinURL, getQuery, withQuery } from 'file://C:/Users/PC/Downloads/UTL%20SHORTENER%20REAL/APIShortener/node_modules/ufo/dist/index.mjs';
import { createStorage, prefixStorage } from 'file://C:/Users/PC/Downloads/UTL%20SHORTENER%20REAL/APIShortener/node_modules/unstorage/dist/index.mjs';
import unstorage_47drivers_47fs from 'file://C:/Users/PC/Downloads/UTL%20SHORTENER%20REAL/APIShortener/node_modules/unstorage/drivers/fs.mjs';
import defu, { defuFn } from 'file://C:/Users/PC/Downloads/UTL%20SHORTENER%20REAL/APIShortener/node_modules/defu/dist/defu.mjs';
import { toRouteMatcher, createRouter } from 'file://C:/Users/PC/Downloads/UTL%20SHORTENER%20REAL/APIShortener/node_modules/radix3/dist/index.mjs';
import { z } from 'file://C:/Users/PC/Downloads/UTL%20SHORTENER%20REAL/APIShortener/node_modules/zod/lib/index.mjs';
import jwt from 'file://C:/Users/PC/Downloads/UTL%20SHORTENER%20REAL/APIShortener/node_modules/jsonwebtoken/index.js';
import { klona } from 'file://C:/Users/PC/Downloads/UTL%20SHORTENER%20REAL/APIShortener/node_modules/klona/dist/index.mjs';
import { snakeCase } from 'file://C:/Users/PC/Downloads/UTL%20SHORTENER%20REAL/APIShortener/node_modules/scule/dist/index.mjs';
import { nanoid } from 'file://C:/Users/PC/Downloads/UTL%20SHORTENER%20REAL/APIShortener/node_modules/nanoid/index.js';
import { eq } from 'file://C:/Users/PC/Downloads/UTL%20SHORTENER%20REAL/APIShortener/node_modules/drizzle-orm/index.js';
import { pgTable, text, integer, timestamp, primaryKey } from 'file://C:/Users/PC/Downloads/UTL%20SHORTENER%20REAL/APIShortener/node_modules/drizzle-orm/pg-core/index.js';
import { drizzle } from 'file://C:/Users/PC/Downloads/UTL%20SHORTENER%20REAL/APIShortener/node_modules/drizzle-orm/node-postgres/index.js';

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  if (hasReqHeader(event, "accept", "text/html")) {
    return false;
  }
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function normalizeError(error, isDev) {
  const cwd = typeof process.cwd === "function" ? process.cwd() : "/";
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Not Found" : "");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}
function _captureError(error, type) {
  console.error(`[nitro] [${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function defineNitroErrorHandler(handler) {
  return handler;
}
const errorHandler = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const { stack, statusCode, statusMessage, message } = normalizeError(
      error);
    const showDetails = statusCode !== 404;
    const errorObject = {
      url: event.path || "",
      statusCode,
      statusMessage,
      message,
      stack: showDetails ? stack.map((i) => i.text) : void 0
    };
    if (error.unhandled || error.fatal) {
      const tags = [
        "[nitro]",
        "[request error]",
        error.unhandled && "[unhandled]",
        error.fatal && "[fatal]"
      ].filter(Boolean).join(" ");
      console.error(
        tags,
        error.message + "\n" + stack.map((l) => "  " + l.text).join("  \n")
      );
    }
    if (statusCode === 404) {
      setResponseHeader(event, "Cache-Control", "no-cache");
    }
    setResponseStatus(event, statusCode, statusMessage);
    if (isJsonRequest(event)) {
      setResponseHeader(event, "Content-Type", "application/json");
      return send(event, JSON.stringify(errorObject));
    }
    setResponseHeader(event, "Content-Type", "text/html");
    return send(event, renderHTMLError(errorObject));
  }
);
function renderHTMLError(error) {
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Request Error";
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${statusCode} ${statusMessage}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico/css/pico.min.css">
  </head>
  <body>
    <main class="container">
      <dialog open>
        <article>
          <header>
            <h2>${statusCode} ${statusMessage}</h2>
          </header>
          <code>
            ${error.message}<br><br>
            ${"\n" + (error.stack || []).map((i) => `&nbsp;&nbsp;${i}`).join("<br>")}
          </code>
          <footer>
            <a href="/" onclick="event.preventDefault();history.back();">Go Back</a>
          </footer>
        </article>
      </dialog>
    </main>
  </body>
</html>
`;
}

const plugins = [
  
];

const _lazy_ZQAN5O = () => Promise.resolve().then(function () { return callback_get$1; });
const _lazy_aoJjao = () => Promise.resolve().then(function () { return login_get$1; });
const _lazy_OVPboM = () => Promise.resolve().then(function () { return index$1; });
const _lazy_FcqTjS = () => Promise.resolve().then(function () { return links_delete$1; });
const _lazy_al3uC2 = () => Promise.resolve().then(function () { return links_get$1; });
const _lazy_tsd4Pk = () => Promise.resolve().then(function () { return links_post$1; });
const _lazy_MqxIh6 = () => Promise.resolve().then(function () { return _slug__delete$1; });
const _lazy_bUathe = () => Promise.resolve().then(function () { return _slug__get$1; });
const _lazy_G5MuOd = () => Promise.resolve().then(function () { return _slug__put$1; });
const _lazy_DjJ9Bc = () => Promise.resolve().then(function () { return tags_delete$1; });
const _lazy_j7pRd8 = () => Promise.resolve().then(function () { return tags_get$1; });
const _lazy_NQ9WZ1 = () => Promise.resolve().then(function () { return tags_post$1; });
const _lazy_2LEAwV = () => Promise.resolve().then(function () { return _id__delete$1; });
const _lazy_JF4eE8 = () => Promise.resolve().then(function () { return _id__put$1; });

const handlers = [
  { route: '/auth/callback', handler: _lazy_ZQAN5O, lazy: true, middleware: false, method: "get" },
  { route: '/auth/login', handler: _lazy_aoJjao, lazy: true, middleware: false, method: "get" },
  { route: '/', handler: _lazy_OVPboM, lazy: true, middleware: false, method: undefined },
  { route: '/links', handler: _lazy_FcqTjS, lazy: true, middleware: false, method: "delete" },
  { route: '/links', handler: _lazy_al3uC2, lazy: true, middleware: false, method: "get" },
  { route: '/links', handler: _lazy_tsd4Pk, lazy: true, middleware: false, method: "post" },
  { route: '/links/:slug', handler: _lazy_MqxIh6, lazy: true, middleware: false, method: "delete" },
  { route: '/links/:slug', handler: _lazy_bUathe, lazy: true, middleware: false, method: "get" },
  { route: '/links/:slug', handler: _lazy_G5MuOd, lazy: true, middleware: false, method: "put" },
  { route: '/tags', handler: _lazy_DjJ9Bc, lazy: true, middleware: false, method: "delete" },
  { route: '/tags', handler: _lazy_j7pRd8, lazy: true, middleware: false, method: "get" },
  { route: '/tags', handler: _lazy_NQ9WZ1, lazy: true, middleware: false, method: "post" },
  { route: '/tags/:id', handler: _lazy_2LEAwV, lazy: true, middleware: false, method: "delete" },
  { route: '/tags/:id', handler: _lazy_JF4eE8, lazy: true, middleware: false, method: "put" }
];

const serverAssets = [{"baseName":"server","dir":"C:/Users/PC/Downloads/UTL SHORTENER REAL/APIShortener/server/assets"}];

const assets = createStorage();

for (const asset of serverAssets) {
  assets.mount(asset.baseName, unstorage_47drivers_47fs({ base: asset.dir, ignore: (asset?.ignore || []) }));
}

const storage = createStorage({});

storage.mount('/assets', assets);

storage.mount('root', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"C:\\Users\\PC\\Downloads\\UTL SHORTENER REAL\\APIShortener","ignore":["**/node_modules/**","**/.git/**"]}));
storage.mount('src', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"C:\\Users\\PC\\Downloads\\UTL SHORTENER REAL\\APIShortener\\server","ignore":["**/node_modules/**","**/.git/**"]}));
storage.mount('build', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"C:\\Users\\PC\\Downloads\\UTL SHORTENER REAL\\APIShortener\\.nitro","ignore":["**/node_modules/**","**/.git/**"]}));
storage.mount('cache', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"C:\\Users\\PC\\Downloads\\UTL SHORTENER REAL\\APIShortener\\.nitro\\cache","ignore":["**/node_modules/**","**/.git/**"]}));
storage.mount('data', unstorage_47drivers_47fs({"driver":"fs","base":"C:\\Users\\PC\\Downloads\\UTL SHORTENER REAL\\APIShortener\\.data\\kv","ignore":["**/node_modules/**","**/.git/**"]}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[nitro] [cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[nitro] [cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[nitro] [cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[nitro] [cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args, {}) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const inlineAppConfig = {};



const appConfig = defuFn(inlineAppConfig);

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /{{(.*?)}}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/"
  },
  "nitro": {
    "routeRules": {}
  },
  "github": {
    "clientId": "",
    "clientSecret": "",
    "redirectUri": ""
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(true),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter$1({
    preemptive: true
  });
  const localCall = createCall(toNodeListener(h3App));
  const _localFetch = createFetch(localCall, globalThis.fetch);
  const localFetch = (input, init) => _localFetch(input, init).then(
    (response) => normalizeFetchResponse(response)
  );
  const $fetch = createFetch$1({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  h3App.use(
    eventHandler((event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const envContext = event.node.req?.__unenv__;
      if (envContext) {
        Object.assign(event.context, envContext);
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (envContext?.waitUntil) {
          envContext.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
    })
  );
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

const scheduledTasks = false;

const tasks = {
  
};

const __runningTasks__ = {};
async function runTask(name, {
  payload = {},
  context = {}
} = {}) {
  if (__runningTasks__[name]) {
    return __runningTasks__[name];
  }
  if (!(name in tasks)) {
    throw createError({
      message: `Task \`${name}\` is not available!`,
      statusCode: 404
    });
  }
  if (!tasks[name].resolve) {
    throw createError({
      message: `Task \`${name}\` is not implemented!`,
      statusCode: 501
    });
  }
  const handler = await tasks[name].resolve();
  const taskEvent = { name, payload, context };
  __runningTasks__[name] = handler.run(taskEvent);
  try {
    const res = await __runningTasks__[name];
    return res;
  } finally {
    delete __runningTasks__[name];
  }
}

const nitroApp = useNitroApp();
const server = new Server(toNodeListener(nitroApp.h3App));
function getAddress() {
  if (provider === "stackblitz" || process.env.NITRO_NO_UNIX_SOCKET || process.versions.bun) {
    return 0;
  }
  const socketName = `worker-${process.pid}-${threadId}.sock`;
  if (isWindows) {
    return join(String.raw`\\.\pipe\nitro`, socketName);
  }
  const socketDir = join(tmpdir(), "nitro");
  mkdirSync(socketDir, { recursive: true });
  return join(socketDir, socketName);
}
const listenAddress = getAddress();
server.listen(listenAddress, () => {
  const _address = server.address();
  parentPort?.postMessage({
    event: "listen",
    address: typeof _address === "string" ? { socketPath: _address } : { host: "localhost", port: _address?.port }
  });
});
nitroApp.router.get(
  "/_nitro/tasks",
  defineEventHandler(async (event) => {
    const _tasks = await Promise.all(
      Object.entries(tasks).map(async ([name, task]) => {
        const _task = await task.resolve?.();
        return [name, { description: _task?.meta?.description }];
      })
    );
    return {
      tasks: Object.fromEntries(_tasks),
      scheduledTasks
    };
  })
);
nitroApp.router.use(
  "/_nitro/tasks/:name",
  defineEventHandler(async (event) => {
    const name = getRouterParam(event, "name");
    const payload = {
      ...getQuery$1(event),
      ...await readBody(event).then((r) => r?.payload).catch(() => ({}))
    };
    return await runTask(name, { payload });
  })
);
trapUnhandledNodeErrors();
async function onShutdown(signal) {
  await nitroApp.hooks.callHook("close");
}
parentPort?.on("message", async (msg) => {
  if (msg && msg.event === "shutdown") {
    await onShutdown();
    parentPort?.postMessage({ event: "exit" });
  }
});

const CodeSchema = z.object({
  code: z.string().min(1, { message: "Le code d'authentification est requis." })
});
const callback_get = defineEventHandler(async (event) => {
  const { github } = useRuntimeConfig(event);
  const { code } = await getValidatedQuery(event, CodeSchema.parse);
  try {
    console.log("Demande de token GitHub...");
    const response = await $fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json"
      },
      body: {
        client_id: github.clientId,
        client_secret: github.clientSecret,
        code
        // Code récupéré depuis l'URL
      }
    });
    console.log("R\xE9ponse de GitHub:", response);
    const { access_token } = response;
    console.log("R\xE9cup\xE9ration des donn\xE9es utilisateur...");
    const userData = await $fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    console.log("Donn\xE9es utilisateur r\xE9cup\xE9r\xE9es:", userData);
    console.log("G\xE9n\xE9ration du token JWT...");
    const tokenSecret = "09765a3505e4151d3bcb3d6f58f4d17d2d874862";
    const payload = {
      login: userData.login,
      // Identifiant GitHub
      id: userData.id,
      // ID utilisateur GitHub
      email: userData.email
      // Email (si disponible)
    };
    const token = jwt.sign(payload, tokenSecret, {
      expiresIn: "1h",
      // Durée d'expiration du token
      subject: userData.login,
      // Identifiant de l'utilisateur (login GitHub)
      audience: "url-shortener"
      // Public visé par le token
    });
    return { token };
  } catch (error) {
    console.error("Erreur lors de la r\xE9cup\xE9ration du token OAuth ou des donn\xE9es utilisateur :", error);
    throw new Error("Erreur lors de l'authentification GitHub");
  }
});

const callback_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: callback_get
});

const login_get = defineEventHandler((event) => {
  const { github } = useRuntimeConfig(event);
  console.log("Client ID:", github.clientId);
  console.log("Redirect URI:", github.redirectUri);
  if (!github.clientId || !github.redirectUri) {
    throw new Error("Client ID ou Redirect URI manquant dans la configuration GitHub");
  }
  const scope = "user";
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.append("client_id", github.clientId);
  url.searchParams.append("redirect_uri", github.redirectUri);
  url.searchParams.append("scope", scope);
  console.log("Redirection vers GitHub:", url.toString());
  return sendRedirect(event, url.toString());
});

const login_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: login_get
});

const links = pgTable("links", {
  // Colonne 'slug' utilisée comme clé primaire
  slug: text().primaryKey(),
  // Colonne 'url' obligatoire (non-null) pour stocker l'URL associée
  url: text().notNull(),
  // Colonne 'title' obligatoire pour stocker le titre associé au lien
  title: text().notNull(),
  // Colonne 'max_visits' pour définir un nombre maximum de visites autorisées (optionnel)
  max_visits: integer(),
  // Colonne 'available_at' obligatoire pour spécifier la date/heure de disponibilité du lien
  available_at: timestamp().notNull(),
  // Colonne 'expired_at' pour spécifier la date/heure d'expiration du lien (optionnelle)
  expired_at: timestamp(),
  // Colonne 'created_at' obligatoire pour indiquer la date/heure de création du lien
  created_at: timestamp().notNull(),
  // Colonne 'update_at' obligatoire pour la date/heure de dernière mise à jour du lien
  update_at: timestamp().notNull()
});

const tags = pgTable("tags", {
  // Colonne 'id' utilisée comme clé primaire, de type texte
  id: integer().primaryKey(),
  // Colonne 'name' obligatoire et unique pour stocker le nom du tag
  name: text().unique().notNull(),
  // Colonne 'color' obligatoire pour stocker la couleur associée au tag
  color: text().notNull()
});

const visits = pgTable("visits", {
  // Colonne 'id' utilisée comme clé primaire, de type texte
  id: text().primaryKey(),
  // Colonne 'link_id' obligatoire pour faire référence au lien visité
  link_id: text().notNull(),
  // Colonne 'created_at' obligatoire pour enregistrer la date et l'heure de la visite
  created_at: timestamp().notNull(),
  // Colonne 'ip' obligatoire pour enregistrer l'adresse IP de l'utilisateur
  ip: text().notNull(),
  // Colonne 'user_agent' obligatoire pour stocker les informations du User-Agent de l'utilisateur
  user_agent: text().notNull()
});

const link_tags = pgTable(
  "link_tags",
  // Nom de la table dans la base de données
  {
    // Colonne 'link_slug' qui référence la colonne 'slug' de la table 'links'
    link_slug: text().references(() => links.slug).notNull(),
    // Colonne 'tag_id' qui référence la colonne 'id' de la table 'tags'
    tag_id: integer().references(() => tags.id).notNull()
  },
  (columns) => ({
    // Définition de la clé primaire composite basée sur 'link_slug' et 'tag_id'
    pk: primaryKey({ columns: [columns.link_slug, columns.tag_id] })
  })
);

const schema = /*#__PURE__*/Object.freeze({
  __proto__: null,
  link_tags: link_tags,
  links: links,
  tags: tags,
  visits: visits
});

function useDrizzle() {
  return drizzle(process.env.DATABASE_URL, {
    schema
  });
}

const index = eventHandler(async (event) => {
  const db = useDrizzle();
  const results = await db.query.links.findMany();
  return results;
});

const index$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index
});

const links_delete = eventHandler(async (event) => {
  const db = useDrizzle();
  const results = await db.delete(links);
  return results;
});

const links_delete$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: links_delete
});

const links_get = eventHandler(async (event) => {
  const db = useDrizzle();
  const results = await db.query.links.findMany();
  return results;
});

const links_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: links_get
});

function requireUser(event) {
  try {
    const authHeader = getHeader(event, "Authorization");
    console.log({ authHeader });
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError({
        statusCode: 401,
        message: "Token manquant"
      });
    }
    const token = authHeader.substring(7);
    console.log("Token extrait :", token);
    const decoded = jwt.verify(token, "09765a3505e4151d3bcb3d6f58f4d17d2d874862", {
      audience: "url-shortener"
      // vérifier que le token est destiné à notre application
    });
    return decoded;
  } catch (err) {
    console.error("Erreur de v\xE9rification du token :", err);
    throw sendError(event, createError({
      statusCode: 401,
      message: "Token invalide ou expir\xE9"
    }));
  }
}

const links_post = defineEventHandler(async (event) => {
  const user = requireUser(event);
  console.log(user);
  const db = useDrizzle();
  const body = await readBody(event);
  if (!body || !body.url) {
    throw createError({
      statusCode: 400,
      statusMessage: "Le corps de la requ\xEAte doit contenir une cl\xE9 'url'."
    });
  }
  const slug = nanoid(8);
  const newLink = await db.insert(links).values({
    url: String(body.url),
    slug,
    title: body.title || null,
    max_visits: body.max_visits || null,
    available_at: new Date(body.available_at || Date.now()),
    expired_at: body.expired_at ? new Date(body.expired_at) : null,
    created_at: /* @__PURE__ */ new Date(),
    update_at: /* @__PURE__ */ new Date()
  }).returning().then((res) => res[0]);
  if (body.tags && Array.isArray(body.tags)) {
    for (const tagId of body.tags) {
      await db.insert(link_tags).values({
        link_slug: newLink.slug,
        tag_id: tagId
      });
    }
  }
  return {
    statusCode: 201,
    body: {
      message: "URL raccourcie cr\xE9\xE9e avec succ\xE8s.",
      shortLink: `http://localhost:3000/links/${newLink.slug}`,
      // Le lien court généré
      link: newLink
    }
  };
});

const links_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: links_post
});

const _slug__delete = defineEventHandler(async (event) => {
  const db = useDrizzle();
  const slug = getRouterParam(event, "slug");
  const results = await db.delete(links).where(eq(links.slug, slug));
  return results;
});

const _slug__delete$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _slug__delete
});

const _slug__get = defineEventHandler(async (event) => {
  const db = useDrizzle();
  const slug = getRouterParam(event, "slug");
  if (!slug) {
    throw createError({
      statusCode: 400,
      // Erreur 400 : Mauvaise requête
      statusMessage: "Slug manquant dans la requ\xEAte."
    });
  }
  const link = await db.select().from(links).where(eq(links.slug, slug)).then((res) => res[0]);
  if (!link) {
    throw createError({
      statusCode: 404,
      // Erreur 404 : Ressource non trouvée
      statusMessage: "Lien non trouv\xE9 pour le slug fourni."
    });
  }
  return sendRedirect(event, link.url, 302);
});

const _slug__get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _slug__get
});

const _slug__put = defineEventHandler(async (event) => {
  const db = useDrizzle();
  const body = await readBody(event);
  const slug = getRouterParam(event, "slug");
  console.log(body);
  await db.update(links).set({ title: body.title, update_at: /* @__PURE__ */ new Date() }).where(eq(links.slug, slug)).returning({ updatedId: links.slug });
  return { body };
});

const _slug__put$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _slug__put
});

const tags_delete = eventHandler(async (event) => {
  const db = useDrizzle();
  const results = await db.delete(tags);
  return results;
});

const tags_delete$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: tags_delete
});

const tags_get = eventHandler(async (event) => {
  const db = useDrizzle();
  const results = await db.query.tags.findMany();
  return results;
});

const tags_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: tags_get
});

const tags_post = defineEventHandler(async (event) => {
  const db = useDrizzle();
  const body = await readBody(event);
  console.log(body);
  await db.insert(tags).values({
    id: body.id,
    name: body.name,
    color: body.color
  }).returning();
  return { body };
});

const tags_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: tags_post
});

const _id__delete = defineEventHandler(async (event) => {
  const db = useDrizzle();
  const id = getRouterParam(event, "id");
  const results = await db.delete(tags).where(eq(tags.id, id));
  return results;
});

const _id__delete$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__delete
});

const _id__put = defineEventHandler(async (event) => {
  const db = useDrizzle();
  const body = await readBody(event);
  const id = getRouterParam(event, "id");
  console.log(body);
  await db.update(tags).set({ name: body.title, color: body.color }).where(eq(tags.id, id)).returning({ updatedId: tags.id });
  return { body };
});

const _id__put$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__put
});
//# sourceMappingURL=index.mjs.map
