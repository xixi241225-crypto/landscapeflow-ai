
      let global = globalThis;
      globalThis.global = globalThis;

      if (typeof global.navigator === 'undefined') {
        global.navigator = {
          userAgent: 'edge-runtime',
          language: 'en-US',
          languages: ['en-US'],
        };
      } else {
        if (typeof global.navigator.language === 'undefined') {
          global.navigator.language = 'en-US';
        }
        if (!global.navigator.languages || global.navigator.languages.length === 0) {
          global.navigator.languages = [global.navigator.language];
        }
        if (typeof global.navigator.userAgent === 'undefined') {
          global.navigator.userAgent = 'edge-runtime';
        }
      }

      class MessageChannel {
        constructor() {
          this.port1 = new MessagePort();
          this.port2 = new MessagePort();
        }
      }
      class MessagePort {
        constructor() {
          this.onmessage = null;
        }
        postMessage(data) {
          if (this.onmessage) {
            setTimeout(() => this.onmessage({ data }), 0);
          }
        }
      }
      global.MessageChannel = MessageChannel;

      // if ((typeof globalThis.fetch === 'undefined' || typeof globalThis.Headers === 'undefined' || typeof globalThis.Request === 'undefined' || typeof globalThis.Response === 'undefined') && typeof require !== 'undefined') {
      //   try {
      //     const undici = require('undici');
      //     if (undici.fetch && !globalThis.fetch) {
      //       globalThis.fetch = undici.fetch;
      //     }
      //     if (undici.Headers && typeof globalThis.Headers === 'undefined') {
      //       globalThis.Headers = undici.Headers;
      //     }
      //     if (undici.Request && typeof globalThis.Request === 'undefined') {
      //       globalThis.Request = undici.Request;
      //     }
      //     if (undici.Response && typeof globalThis.Response === 'undefined') {
      //       globalThis.Response = undici.Response;
      //     }
      //   } catch (polyfillError) {
      //     console.warn('Edge middleware polyfill failed:', polyfillError && polyfillError.message ? polyfillError.message : polyfillError);
      //   }
      // }

      '__MIDDLEWARE_BUNDLE_CODE__'

      function recreateRequest(request, overrides = {}) {
        const cloned = typeof request.clone === 'function' ? request.clone() : request;
        const headers = new Headers(cloned.headers);

        if (overrides.headerPatches) {
          Object.keys(overrides.headerPatches).forEach((key) => {
            const value = overrides.headerPatches[key];
            if (value === null || typeof value === 'undefined') {
              headers.delete(key);
            } else {
              headers.set(key, value);
            }
          });
        }

        if (overrides.headers) {
          const extraHeaders = new Headers(overrides.headers);
          extraHeaders.forEach((value, key) => headers.set(key, value));
        }

        const url = overrides.url || cloned.url;
        const method = overrides.method || cloned.method || 'GET';
        const canHaveBody = method && method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'HEAD';
        const body = overrides.body !== undefined ? overrides.body : canHaveBody ? cloned.body : undefined;

        // 如果rewrite传入的是完整URL（第三方地址），需要更新host
        if (overrides.url) {
          try {
            const newUrl = new URL(overrides.url, cloned.url);
            // 只有当新URL是绝对路径（包含协议和host）时才更新host
            if (overrides.url.startsWith('http://') || overrides.url.startsWith('https://')) {
              headers.set('host', newUrl.host);
            }
            // 相对路径时保持原有host不变
          } catch (e) {
            // URL解析失败时保持原有host
          }
        }

        const init = {
          method,
          headers,
          redirect: cloned.redirect,
          credentials: cloned.credentials,
          cache: cloned.cache,
          mode: cloned.mode,
          referrer: cloned.referrer,
          referrerPolicy: cloned.referrerPolicy,
          integrity: cloned.integrity,
          keepalive: cloned.keepalive,
          signal: cloned.signal,
        };

        if (canHaveBody && body !== undefined) {
          init.body = body;
        }

        if ('duplex' in cloned) {
          init.duplex = cloned.duplex;
        }

        return new Request(url, init);

      }

      
      async function executeMiddleware(context) {
        return null; // 没有中间件，继续执行后续函数
      }
    

      async function handleRequest(context){
        let routeParams = {};
        let pagesFunctionResponse = null;
        let request = context.request;
        const waitUntil = context.waitUntil;
        let urlInfo = new URL(request.url);
        const eo = request.eo || {};

        const normalizePathname = () => {
          if (urlInfo.pathname !== '/' && urlInfo.pathname.endsWith('/')) {
            urlInfo.pathname = urlInfo.pathname.slice(0, -1);
          }
        };

        function getSuffix(pathname = '') {
          // Use a regular expression to extract the file extension from the URL
          const suffix = pathname.match(/.([^.]+)$/);
          // If an extension is found, return it, otherwise return an empty string
          return suffix ? '.' + suffix[1] : null;
        }

        normalizePathname();

        let matchedFunc = false;

        
        const runEdgeFunctions = () => {
          
          if(!matchedFunc && '/api/brief' === urlInfo.pathname) {
            matchedFunc = true;
              (() => {
  // functions/api/brief.js
  async function onRequest({ request }) {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" }
      });
    }
    const body = await request.json();
    const { projectName, projectType, area, style, goal } = body;
    const brief = `
\u3010\u9879\u76EE\u6982\u51B5\u3011
${projectName}\u5B9A\u4F4D\u4E3A${projectType}\u9879\u76EE\uFF0C\u89C4\u5212\u7528\u5730\u7EA6 ${area} \u33A1\uFF0C\u6574\u4F53\u8BBE\u8BA1\u8BED\u8A00\u9075\u5FAA"${style}"\u7F8E\u5B66\u903B\u8F91\u3002

\u3010\u8BBE\u8BA1\u76EE\u6807\u3011
\u672C\u9879\u76EE\u6838\u5FC3\u76EE\u6807\u4E3A\uFF1A${goal || "\u6253\u9020\u9AD8\u54C1\u8D28\u57CE\u5E02\u516C\u5171\u7A7A\u95F4"}\u3002\u56F4\u7ED5\u8FD9\u4E00\u76EE\u6807\uFF0C\u65B9\u6848\u5728\u529F\u80FD\u7B56\u5212\u3001\u7A7A\u95F4\u5E8F\u5217\u3001\u690D\u7269\u914D\u7F6E\u3001\u6750\u6599\u9009\u578B\u56DB\u4E2A\u7EF4\u5EA6\u5C55\u5F00\u7CFB\u7EDF\u6027\u8BBE\u8BA1\u3002

\u3010\u8BBE\u8BA1\u7B56\u7565\u3011
\u5176\u4E00\uFF0C\u4EE5\u4EBA\u7FA4\u884C\u4E3A\u4E3A\u9A71\u52A8\u91CD\u7EC4\u529F\u80FD\u5206\u533A\u3002\u5176\u4E8C\uFF0C\u5F15\u5165\u5FAE\u6C14\u5019\u8C03\u8282\u7B56\u7565\uFF0C\u901A\u8FC7\u4E54\u6728\u9635\u5217\u3001\u6C34\u4F53\u964D\u6E29\u3001\u94FA\u88C5\u900F\u6C34\u63D0\u5347\u573A\u5730\u5168\u5E74\u8212\u9002\u5EA6\u3002\u5176\u4E09\uFF0C\u690D\u7269\u914D\u7F6E\u9075\u5FAA\u5B63\u76F8\u4E3B\u9898\u539F\u5219\u3002\u5176\u56DB\uFF0C\u6750\u6599\u9009\u578B\u7ACB\u8DB3\u8010\u4E45\u6027\u4E0E\u672C\u571F\u6027\u3002

\u3010\u521B\u65B0\u70B9\u3011
\u672C\u65B9\u6848\u5728\u4F20\u7EDF${projectType}\u8BBE\u8BA1\u903B\u8F91\u57FA\u7840\u4E0A\uFF0C\u53E0\u52A0 AI \u5168\u6D41\u7A0B\u8F85\u52A9\u51B3\u7B56\u673A\u5236\uFF0C\u901A\u8FC7 LandscapeFlow AI \u5DE5\u4F5C\u53F0\u5B8C\u6210\u4ECE\u8E0F\u52D8\u89E3\u8BFB\u5230\u6C47\u62A5\u6210\u679C\u7684\u95ED\u73AF\u8F93\u51FA\u3002

\u2014\u2014 \u7531 LandscapeFlow AI \u81EA\u52A8\u751F\u6210
`.trim();
    return new Response(JSON.stringify({ success: true, brief, timestamp: Date.now() }), {
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }

        pagesFunctionResponse = onRequest;
      })();
          }
        

          if(!matchedFunc && '/api/cases' === urlInfo.pathname) {
            matchedFunc = true;
              (() => {
  // functions/api/cases.js
  var DEFAULT_CASES = [
    { id: "coast", name: "\u6EE8\u6D77\u666F\u89C2\u516C\u56ED", tag: "\u70ED\u95E8", meta: "12 \u5F20\u5E7B\u706F\u7247 \xB7 \u542B\u5E73\u9762\u56FE \xB7 \u542B\u6548\u679C\u56FE", img: "assets/tmpl-coast.jpg" },
    { id: "playground", name: "\u513F\u7AE5\u53CB\u597D\u4E50\u56ED", tag: "\u7CBE\u9009", meta: "10 \u5F20\u5E7B\u706F\u7247 \xB7 \u542B\u8272\u5F69\u65B9\u6848 \xB7 \u542B\u8BBE\u65BD\u6E05\u5355", img: "assets/tmpl-playground.jpg" },
    { id: "pocket", name: "\u57CE\u5E02\u53E3\u888B\u516C\u56ED", tag: null, meta: "14 \u5F20\u5E7B\u706F\u7247 \xB7 \u542B\u529F\u80FD\u5206\u6790 \xB7 \u542B\u690D\u7269\u914D\u7F6E", img: "assets/tmpl-pocket.jpg" },
    { id: "commercial", name: "\u5546\u4E1A\u8857\u533A\u666F\u89C2", tag: "\u65B0\u54C1", meta: "16 \u5F20\u5E7B\u706F\u7247 \xB7 \u542B\u591C\u666F\u65B9\u6848 \xB7 \u542B\u94FA\u88C5\u7EC6\u8282", img: "assets/tmpl-commercial.jpg" },
    { id: "community", name: "\u793E\u533A\u5C45\u4F4F\u666F\u89C2", tag: null, meta: "12 \u5F20\u5E7B\u706F\u7247 \xB7 \u542B\u56DB\u5B63\u53D8\u5316 \xB7 \u542B\u704C\u6E89\u7CFB\u7EDF", img: "assets/tmpl-community.jpg" },
    { id: "wetland", name: "\u751F\u6001\u6E7F\u5730\u4FEE\u590D", tag: "\u7CBE\u9009", meta: "18 \u5F20\u5E7B\u706F\u7247 \xB7 \u542B\u751F\u6001\u5206\u6790 \xB7 \u542B\u6C34\u6587\u8BBE\u8BA1", img: "assets/tmpl-wetland.jpg" }
  ];
  async function onRequest({ request }) {
    let cases = DEFAULT_CASES;
    let source = "default";
    try {
      if (typeof LANDSCAPE_CASES !== "undefined") {
        await LANDSCAPE_CASES.put("cases", JSON.stringify(DEFAULT_CASES));
        const stored = await LANDSCAPE_CASES.get("cases", "json");
        if (stored && Array.isArray(stored) && stored.length > 0) {
          cases = stored;
          source = "kv";
        }
      }
    } catch (e) {
      source = "fallback";
    }
    return new Response(JSON.stringify({ success: true, cases, source, count: cases.length }), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60"
      }
    });
  }

        pagesFunctionResponse = onRequest;
      })();
          }
        

          if(!matchedFunc && '/_middleware' === urlInfo.pathname) {
            matchedFunc = true;
              (() => {
  // functions/_middleware.js
  async function onRequest({ request, next }) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }
    const response = await next();
    if (url.pathname.startsWith("/api")) {
      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set("X-Powered-By", "LandscapeFlow AI");
    }
    return response;
  }

        pagesFunctionResponse = onRequest;
      })();
          }
        
        };
      

        
        const runMiddleware = typeof executeMiddleware !== 'undefined' ? executeMiddleware : async function() { return null; };
        let middlewareResponseHeaders = null; // 保存中间件设置的响应头
        const middlewareResponse = await runMiddleware({
          request,
          urlInfo: new URL(urlInfo.toString()),
          env: {"NG_CLI_ANALYTICS":"false","NUXT_TELEMETRY_DISABLED":"1","COREPACK_ENABLE_DOWNLOAD_PROMPT":"0","COREPACK_ENABLE_STRICT":"0","YARN_ENABLE_INTERACTIVE":"0","NPM_CONFIG_YES":"true","CI":"true","TMPDIR":"/var/folders/sq/90r7d60542x8vmb5k61k2ct00000gn/T/"},
          waitUntil
        });

        if (middlewareResponse) {
          const headers = middlewareResponse.headers;
          const hasNext = headers && headers.get('x-middleware-next') === '1';
          const rewriteTarget = headers && headers.get('x-middleware-rewrite');
          const requestHeadersOverride = headers && headers.get('x-middleware-request-headers');
          // Next.js 使用 x-middleware-override-headers 传递需要修改的请求头列表
          const overrideHeadersList = headers && headers.get('x-middleware-override-headers');

          if (rewriteTarget) {
            try {
              const rewrittenUrl = rewriteTarget.startsWith('http://') || rewriteTarget.startsWith('https://')
                ? rewriteTarget
                : new URL(rewriteTarget, urlInfo.origin).toString();
              request = recreateRequest(request, { url: rewrittenUrl });
              urlInfo = new URL(rewrittenUrl);
              normalizePathname();
            } catch (rewriteError) {
              console.error('Middleware rewrite error:', rewriteError);
            }
          }

          // 处理 Next.js 的 x-middleware-override-headers 机制
          if (overrideHeadersList) {
            try {
              const overrideKeys = overrideHeadersList.split(',').map(k => k.trim());
              for (const key of overrideKeys) {
                const newValue = headers.get('x-middleware-request-' + key);
                if (newValue !== null) {
                  request.headers.set(key, newValue);
                } else {
                  request.headers.delete(key);
                }
              }
            } catch (overrideError) {
              console.error('Middleware override headers error:', overrideError);
            }
          }
          // 处理旧的 x-middleware-request-headers 机制（兼容）
          else if (requestHeadersOverride) {
            try {
              const decoded = decodeURIComponent(requestHeadersOverride);
              const headerPatch = JSON.parse(decoded);
              Object.keys(headerPatch).forEach((key) => {
                const value = headerPatch[key];
                if (value === null || typeof value === 'undefined') {
                  request.headers.delete(key);
                } else {
                  request.headers.set(key, value);
                }
              });
            } catch (requestPatchError) {
              console.error('Middleware request header override error:', requestPatchError);
            }
          }

          if (!hasNext && !rewriteTarget) {
            return middlewareResponse;
          }

          if (hasNext) {
            middlewareResponseHeaders = new Headers();
            const skipHeaders = new Set([
              'x-middleware-next',
              'x-middleware-rewrite',
              'x-middleware-request-headers',
              'x-middleware-override-headers',
              'x-middleware-set-cookie',
              'date',
              'connection',
              'content-length',
              'content-encoding', // 避免中间件传递的压缩头覆盖到最终响应，破坏流式响应
              'transfer-encoding',
              'set-cookie', // Set-Cookie 需要特殊处理，避免重复
            ]);
            headers.forEach((value, key) => {
              const lowerKey = key.toLowerCase();
              // 过滤内部使用的 header：skipHeaders 中的 + x-middleware-request-* 前缀的请求头修改标记
              if (!skipHeaders.has(lowerKey) && !lowerKey.startsWith('x-middleware-request-')) {
                middlewareResponseHeaders.set(key, value);
              }
            });
            // 特殊处理 Set-Cookie，可能有多个，使用 getSetCookie 获取完整的 cookie 值
            const setCookies = headers.getSetCookie ? headers.getSetCookie() : [];
            setCookies.forEach(cookie => {
              middlewareResponseHeaders.append('Set-Cookie', cookie);
            });
          }
        }
      
        
        // 走到这里说明：
        // 1. 没有中间件响应（middlewareResponse 为 null/undefined）
        // 2. 或者中间件返回了 next
        // 需要判断是否命中边缘函数

        runEdgeFunctions();

        //没有命中边缘函数，执行回源
        if (!matchedFunc) {
          // 允许压缩的文件后缀白名单
          const ALLOW_COMPRESS_SUFFIXES = [
            '.html', '.htm', '.xml', '.txt', '.text', '.conf', '.def', '.list', '.log', '.in',
            '.css', '.js', '.json', '.rss', '.svg', '.tif', '.tiff', '.rtx', '.htc',
            '.java', '.md', '.markdown', '.ico', '.pl', '.pm', '.cgi', '.pb', '.proto',
            '.xhtml', '.xht', '.ttf', '.otf', '.woff', '.eot', '.wasm', '.binast', '.webmanifest'
          ];
          
          // 检查请求路径是否有允许压缩的后缀
          const pathname = urlInfo.pathname;
          const suffix = getSuffix(pathname);
          const hasCompressibleSuffix = ALLOW_COMPRESS_SUFFIXES.includes(suffix);
          
          // 如果不是可压缩的文件类型，删除 Accept-Encoding 头以禁用 CDN 压缩
          if (!hasCompressibleSuffix) {
              request.headers.delete('accept-encoding');
          }
          
          const originResponse = await fetch(request);
          
          // 如果中间件设置了响应头，合并到回源响应中
          if (middlewareResponseHeaders) {
            const mergedHeaders = new Headers(originResponse.headers);
            // 删除可能导致问题的编码相关头
            mergedHeaders.delete('content-encoding');
            mergedHeaders.delete('content-length');
            middlewareResponseHeaders.forEach((value, key) => {
              if (key.toLowerCase() === 'set-cookie') {
                mergedHeaders.append(key, value);
              } else {
                mergedHeaders.set(key, value);
              }
            });
            return new Response(originResponse.body, {
              status: originResponse.status,
              statusText: originResponse.statusText,
              headers: mergedHeaders,
            });
          }
          
          return originResponse;
        }
        
        // 命中了边缘函数，继续执行边缘函数逻辑

        const params = {};
        if (routeParams.id) {
          if (routeParams.mode === 1) {
            const value = urlInfo.pathname.match(routeParams.left);        
            for (let i = 1; i < value.length; i++) {
              params[routeParams.id[i - 1]] = value[i];
            }
          } else {
            const value = urlInfo.pathname.replace(routeParams.left, '');
            const splitedValue = value.split('/');
            if (splitedValue.length === 1) {
              params[routeParams.id] = splitedValue[0];
            } else {
              params[routeParams.id] = splitedValue;
            }
          }
          
        }
        const edgeFunctionResponse = await pagesFunctionResponse({request, params, env: {"NG_CLI_ANALYTICS":"false","NUXT_TELEMETRY_DISABLED":"1","COREPACK_ENABLE_DOWNLOAD_PROMPT":"0","COREPACK_ENABLE_STRICT":"0","YARN_ENABLE_INTERACTIVE":"0","NPM_CONFIG_YES":"true","CI":"true","TMPDIR":"/var/folders/sq/90r7d60542x8vmb5k61k2ct00000gn/T/"}, waitUntil, eo });
        
        // 如果中间件设置了响应头，合并到边缘函数响应中
        if (middlewareResponseHeaders && edgeFunctionResponse) {
          const mergedHeaders = new Headers(edgeFunctionResponse.headers);
          // 删除可能导致问题的编码相关头
          mergedHeaders.delete('content-encoding');
          mergedHeaders.delete('content-length');
          middlewareResponseHeaders.forEach((value, key) => {
            if (key.toLowerCase() === 'set-cookie') {
              mergedHeaders.append(key, value);
            } else {
              mergedHeaders.set(key, value);
            }
          });
          return new Response(edgeFunctionResponse.body, {
            status: edgeFunctionResponse.status,
            statusText: edgeFunctionResponse.statusText,
            headers: mergedHeaders,
          });
        }
        
        return edgeFunctionResponse;
      }
      addEventListener('fetch', event=>{return event.respondWith(handleRequest({request:event.request,params: {}, env: {"NG_CLI_ANALYTICS":"false","NUXT_TELEMETRY_DISABLED":"1","COREPACK_ENABLE_DOWNLOAD_PROMPT":"0","COREPACK_ENABLE_STRICT":"0","YARN_ENABLE_INTERACTIVE":"0","NPM_CONFIG_YES":"true","CI":"true","TMPDIR":"/var/folders/sq/90r7d60542x8vmb5k61k2ct00000gn/T/"}, waitUntil: event.waitUntil.bind(event) }))});
