"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/me/route";
exports.ids = ["app/api/auth/me/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fme%2Froute&page=%2Fapi%2Fauth%2Fme%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fme%2Froute.ts&appDir=%2FUsers%2Fbharat%2FDesktop%2Flynk-labs%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fbharat%2FDesktop%2Flynk-labs&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fme%2Froute&page=%2Fapi%2Fauth%2Fme%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fme%2Froute.ts&appDir=%2FUsers%2Fbharat%2FDesktop%2Flynk-labs%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fbharat%2FDesktop%2Flynk-labs&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_bharat_Desktop_lynk_labs_src_app_api_auth_me_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/auth/me/route.ts */ \"(rsc)/./src/app/api/auth/me/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/me/route\",\n        pathname: \"/api/auth/me\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/me/route\"\n    },\n    resolvedPagePath: \"/Users/bharat/Desktop/lynk-labs/src/app/api/auth/me/route.ts\",\n    nextConfigOutput,\n    userland: _Users_bharat_Desktop_lynk_labs_src_app_api_auth_me_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/auth/me/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGbWUlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkZtZSUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkZtZSUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmJoYXJhdCUyRkRlc2t0b3AlMkZseW5rLWxhYnMlMkZzcmMlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGYmhhcmF0JTJGRGVza3RvcCUyRmx5bmstbGFicyZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDWTtBQUN6RjtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLGlFQUFpRTtBQUN6RTtBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ3VIOztBQUV2SCIsInNvdXJjZXMiOlsid2VicGFjazovL2x5bmstbGFicy8/MmZhNyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvVXNlcnMvYmhhcmF0L0Rlc2t0b3AvbHluay1sYWJzL3NyYy9hcHAvYXBpL2F1dGgvbWUvcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2F1dGgvbWUvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9hdXRoL21lXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hdXRoL21lL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL1VzZXJzL2JoYXJhdC9EZXNrdG9wL2x5bmstbGFicy9zcmMvYXBwL2FwaS9hdXRoL21lL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9hdXRoL21lL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fme%2Froute&page=%2Fapi%2Fauth%2Fme%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fme%2Froute.ts&appDir=%2FUsers%2Fbharat%2FDesktop%2Flynk-labs%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fbharat%2FDesktop%2Flynk-labs&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/auth/me/route.ts":
/*!**************************************!*\
  !*** ./src/app/api/auth/me/route.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_auth_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/auth-utils */ \"(rsc)/./src/lib/auth-utils.ts\");\n\n\nasync function GET(request) {\n    try {\n        const user = await (0,_lib_auth_utils__WEBPACK_IMPORTED_MODULE_1__.verifyAuth)(request);\n        if (!user) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Not authenticated\"\n            }, {\n                status: 401\n            });\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            user: {\n                id: user.id,\n                name: user.name,\n                phone: user.phone,\n                role: user.role\n            }\n        });\n    } catch (error) {\n        console.error(\"Error fetching user:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Internal server error\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9hdXRoL21lL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUF3RDtBQUNWO0FBRXZDLGVBQWVFLElBQUlDLE9BQW9CO0lBQzVDLElBQUk7UUFDRixNQUFNQyxPQUFPLE1BQU1ILDJEQUFVQSxDQUFDRTtRQUU5QixJQUFJLENBQUNDLE1BQU07WUFDVCxPQUFPSixxREFBWUEsQ0FBQ0ssSUFBSSxDQUN0QjtnQkFBRUMsT0FBTztZQUFvQixHQUM3QjtnQkFBRUMsUUFBUTtZQUFJO1FBRWxCO1FBRUEsT0FBT1AscURBQVlBLENBQUNLLElBQUksQ0FBQztZQUN2QkQsTUFBTTtnQkFDSkksSUFBSUosS0FBS0ksRUFBRTtnQkFDWEMsTUFBTUwsS0FBS0ssSUFBSTtnQkFDZkMsT0FBT04sS0FBS00sS0FBSztnQkFDakJDLE1BQU1QLEtBQUtPLElBQUk7WUFDakI7UUFDRjtJQUNGLEVBQUUsT0FBT0wsT0FBTztRQUNkTSxRQUFRTixLQUFLLENBQUMsd0JBQXdCQTtRQUN0QyxPQUFPTixxREFBWUEsQ0FBQ0ssSUFBSSxDQUN0QjtZQUFFQyxPQUFPO1FBQXdCLEdBQ2pDO1lBQUVDLFFBQVE7UUFBSTtJQUVsQjtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbHluay1sYWJzLy4vc3JjL2FwcC9hcGkvYXV0aC9tZS9yb3V0ZS50cz81OGJmIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIjtcbmltcG9ydCB7IHZlcmlmeUF1dGggfSBmcm9tIFwiQC9saWIvYXV0aC11dGlsc1wiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKHJlcXVlc3Q6IE5leHRSZXF1ZXN0KSB7XG4gIHRyeSB7XG4gICAgY29uc3QgdXNlciA9IGF3YWl0IHZlcmlmeUF1dGgocmVxdWVzdCk7XG4gICAgXG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgZXJyb3I6IFwiTm90IGF1dGhlbnRpY2F0ZWRcIiB9LFxuICAgICAgICB7IHN0YXR1czogNDAxIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcbiAgICAgIHVzZXI6IHtcbiAgICAgICAgaWQ6IHVzZXIuaWQsXG4gICAgICAgIG5hbWU6IHVzZXIubmFtZSxcbiAgICAgICAgcGhvbmU6IHVzZXIucGhvbmUsXG4gICAgICAgIHJvbGU6IHVzZXIucm9sZSxcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgZmV0Y2hpbmcgdXNlcjpcIiwgZXJyb3IpO1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgIHsgZXJyb3I6IFwiSW50ZXJuYWwgc2VydmVyIGVycm9yXCIgfSxcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxuICAgICk7XG4gIH1cbn0gIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsInZlcmlmeUF1dGgiLCJHRVQiLCJyZXF1ZXN0IiwidXNlciIsImpzb24iLCJlcnJvciIsInN0YXR1cyIsImlkIiwibmFtZSIsInBob25lIiwicm9sZSIsImNvbnNvbGUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/auth/me/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/auth-utils.ts":
/*!*******************************!*\
  !*** ./src/lib/auth-utils.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   requireAuth: () => (/* binding */ requireAuth),\n/* harmony export */   requireRole: () => (/* binding */ requireRole),\n/* harmony export */   verifyAuth: () => (/* binding */ verifyAuth)\n/* harmony export */ });\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jsonwebtoken */ \"(rsc)/./node_modules/jsonwebtoken/index.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./src/lib/db.ts\");\n\n\nasync function verifyAuth(request) {\n    try {\n        const token = request.cookies.get(\"auth-token\")?.value;\n        if (!token) {\n            return null;\n        }\n        const decoded = (0,jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__.verify)(token, process.env.NEXTAUTH_SECRET);\n        if (!decoded.userId) {\n            return null;\n        }\n        // Verify user still exists in database\n        const user = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.user.findUnique({\n            where: {\n                id: decoded.userId\n            },\n            select: {\n                id: true,\n                phone: true,\n                name: true,\n                role: true,\n                isActive: true\n            }\n        });\n        if (!user || !user.isActive) {\n            return null;\n        }\n        return {\n            id: user.id,\n            phone: user.phone,\n            name: user.name,\n            role: user.role\n        };\n    } catch (error) {\n        console.error(\"Auth verification error:\", error);\n        return null;\n    }\n}\nasync function requireAuth(request) {\n    const user = await verifyAuth(request);\n    if (!user) {\n        throw new Error(\"Authentication required\");\n    }\n    return user;\n}\nasync function requireRole(request, allowedRoles) {\n    const user = await requireAuth(request);\n    if (!allowedRoles.includes(user.role)) {\n        throw new Error(\"Insufficient permissions\");\n    }\n    return user;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2F1dGgtdXRpbHMudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ3NDO0FBQ0o7QUFTM0IsZUFBZUUsV0FBV0MsT0FBb0I7SUFDbkQsSUFBSTtRQUNGLE1BQU1DLFFBQVFELFFBQVFFLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLGVBQWVDO1FBRWpELElBQUksQ0FBQ0gsT0FBTztZQUNWLE9BQU87UUFDVDtRQUVBLE1BQU1JLFVBQVVSLG9EQUFNQSxDQUFDSSxPQUFPSyxRQUFRQyxHQUFHLENBQUNDLGVBQWU7UUFFekQsSUFBSSxDQUFDSCxRQUFRSSxNQUFNLEVBQUU7WUFDbkIsT0FBTztRQUNUO1FBRUEsdUNBQXVDO1FBQ3ZDLE1BQU1DLE9BQU8sTUFBTVosMkNBQU1BLENBQUNZLElBQUksQ0FBQ0MsVUFBVSxDQUFDO1lBQ3hDQyxPQUFPO2dCQUFFQyxJQUFJUixRQUFRSSxNQUFNO1lBQUM7WUFDNUJLLFFBQVE7Z0JBQ05ELElBQUk7Z0JBQ0pFLE9BQU87Z0JBQ1BDLE1BQU07Z0JBQ05DLE1BQU07Z0JBQ05DLFVBQVU7WUFDWjtRQUNGO1FBRUEsSUFBSSxDQUFDUixRQUFRLENBQUNBLEtBQUtRLFFBQVEsRUFBRTtZQUMzQixPQUFPO1FBQ1Q7UUFFQSxPQUFPO1lBQ0xMLElBQUlILEtBQUtHLEVBQUU7WUFDWEUsT0FBT0wsS0FBS0ssS0FBSztZQUNqQkMsTUFBTU4sS0FBS00sSUFBSTtZQUNmQyxNQUFNUCxLQUFLTyxJQUFJO1FBQ2pCO0lBQ0YsRUFBRSxPQUFPRSxPQUFPO1FBQ2RDLFFBQVFELEtBQUssQ0FBQyw0QkFBNEJBO1FBQzFDLE9BQU87SUFDVDtBQUNGO0FBRU8sZUFBZUUsWUFBWXJCLE9BQW9CO0lBQ3BELE1BQU1VLE9BQU8sTUFBTVgsV0FBV0M7SUFFOUIsSUFBSSxDQUFDVSxNQUFNO1FBQ1QsTUFBTSxJQUFJWSxNQUFNO0lBQ2xCO0lBRUEsT0FBT1o7QUFDVDtBQUVPLGVBQWVhLFlBQVl2QixPQUFvQixFQUFFd0IsWUFBc0I7SUFDNUUsTUFBTWQsT0FBTyxNQUFNVyxZQUFZckI7SUFFL0IsSUFBSSxDQUFDd0IsYUFBYUMsUUFBUSxDQUFDZixLQUFLTyxJQUFJLEdBQUc7UUFDckMsTUFBTSxJQUFJSyxNQUFNO0lBQ2xCO0lBRUEsT0FBT1o7QUFDVCIsInNvdXJjZXMiOlsid2VicGFjazovL2x5bmstbGFicy8uL3NyYy9saWIvYXV0aC11dGlscy50cz85ZTkxIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0IH0gZnJvbSBcIm5leHQvc2VydmVyXCI7XG5pbXBvcnQgeyB2ZXJpZnkgfSBmcm9tIFwianNvbndlYnRva2VuXCI7XG5pbXBvcnQgeyBwcmlzbWEgfSBmcm9tIFwiQC9saWIvZGJcIjtcblxuZXhwb3J0IGludGVyZmFjZSBBdXRoVXNlciB7XG4gIGlkOiBzdHJpbmc7XG4gIHBob25lOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZyB8IG51bGw7XG4gIHJvbGU6IHN0cmluZztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHZlcmlmeUF1dGgocmVxdWVzdDogTmV4dFJlcXVlc3QpOiBQcm9taXNlPEF1dGhVc2VyIHwgbnVsbD4ge1xuICB0cnkge1xuICAgIGNvbnN0IHRva2VuID0gcmVxdWVzdC5jb29raWVzLmdldChcImF1dGgtdG9rZW5cIik/LnZhbHVlO1xuICAgIFxuICAgIGlmICghdG9rZW4pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGRlY29kZWQgPSB2ZXJpZnkodG9rZW4sIHByb2Nlc3MuZW52Lk5FWFRBVVRIX1NFQ1JFVCEpIGFzIGFueTtcbiAgICBcbiAgICBpZiAoIWRlY29kZWQudXNlcklkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBWZXJpZnkgdXNlciBzdGlsbCBleGlzdHMgaW4gZGF0YWJhc2VcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7XG4gICAgICB3aGVyZTogeyBpZDogZGVjb2RlZC51c2VySWQgfSxcbiAgICAgIHNlbGVjdDoge1xuICAgICAgICBpZDogdHJ1ZSxcbiAgICAgICAgcGhvbmU6IHRydWUsXG4gICAgICAgIG5hbWU6IHRydWUsXG4gICAgICAgIHJvbGU6IHRydWUsXG4gICAgICAgIGlzQWN0aXZlOiB0cnVlLFxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKCF1c2VyIHx8ICF1c2VyLmlzQWN0aXZlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IHVzZXIuaWQsXG4gICAgICBwaG9uZTogdXNlci5waG9uZSEsXG4gICAgICBuYW1lOiB1c2VyLm5hbWUsXG4gICAgICByb2xlOiB1c2VyLnJvbGUsXG4gICAgfTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiQXV0aCB2ZXJpZmljYXRpb24gZXJyb3I6XCIsIGVycm9yKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVxdWlyZUF1dGgocmVxdWVzdDogTmV4dFJlcXVlc3QpOiBQcm9taXNlPEF1dGhVc2VyPiB7XG4gIGNvbnN0IHVzZXIgPSBhd2FpdCB2ZXJpZnlBdXRoKHJlcXVlc3QpO1xuICBcbiAgaWYgKCF1c2VyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQXV0aGVudGljYXRpb24gcmVxdWlyZWRcIik7XG4gIH1cbiAgXG4gIHJldHVybiB1c2VyO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVxdWlyZVJvbGUocmVxdWVzdDogTmV4dFJlcXVlc3QsIGFsbG93ZWRSb2xlczogc3RyaW5nW10pOiBQcm9taXNlPEF1dGhVc2VyPiB7XG4gIGNvbnN0IHVzZXIgPSBhd2FpdCByZXF1aXJlQXV0aChyZXF1ZXN0KTtcbiAgXG4gIGlmICghYWxsb3dlZFJvbGVzLmluY2x1ZGVzKHVzZXIucm9sZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnN1ZmZpY2llbnQgcGVybWlzc2lvbnNcIik7XG4gIH1cbiAgXG4gIHJldHVybiB1c2VyO1xufSAiXSwibmFtZXMiOlsidmVyaWZ5IiwicHJpc21hIiwidmVyaWZ5QXV0aCIsInJlcXVlc3QiLCJ0b2tlbiIsImNvb2tpZXMiLCJnZXQiLCJ2YWx1ZSIsImRlY29kZWQiLCJwcm9jZXNzIiwiZW52IiwiTkVYVEFVVEhfU0VDUkVUIiwidXNlcklkIiwidXNlciIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsImlkIiwic2VsZWN0IiwicGhvbmUiLCJuYW1lIiwicm9sZSIsImlzQWN0aXZlIiwiZXJyb3IiLCJjb25zb2xlIiwicmVxdWlyZUF1dGgiLCJFcnJvciIsInJlcXVpcmVSb2xlIiwiYWxsb3dlZFJvbGVzIiwiaW5jbHVkZXMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/auth-utils.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/db.ts":
/*!***********************!*\
  !*** ./src/lib/db.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log: [\n        \"query\"\n    ]\n});\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2RiLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE2QztBQUU3QyxNQUFNQyxrQkFBa0JDO0FBSWpCLE1BQU1DLFNBQ1hGLGdCQUFnQkUsTUFBTSxJQUN0QixJQUFJSCx3REFBWUEsQ0FBQztJQUNmSSxLQUFLO1FBQUM7S0FBUTtBQUNoQixHQUFFO0FBRUosSUFBSUMsSUFBeUIsRUFBY0osZ0JBQWdCRSxNQUFNLEdBQUdBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbHluay1sYWJzLy4vc3JjL2xpYi9kYi50cz85ZTRmIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gJ0BwcmlzbWEvY2xpZW50J1xuXG5jb25zdCBnbG9iYWxGb3JQcmlzbWEgPSBnbG9iYWxUaGlzIGFzIHVua25vd24gYXMge1xuICBwcmlzbWE6IFByaXNtYUNsaWVudCB8IHVuZGVmaW5lZFxufVxuXG5leHBvcnQgY29uc3QgcHJpc21hID1cbiAgZ2xvYmFsRm9yUHJpc21hLnByaXNtYSA/P1xuICBuZXcgUHJpc21hQ2xpZW50KHtcbiAgICBsb2c6IFsncXVlcnknXSxcbiAgfSlcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPSBwcmlzbWEgIl0sIm5hbWVzIjpbIlByaXNtYUNsaWVudCIsImdsb2JhbEZvclByaXNtYSIsImdsb2JhbFRoaXMiLCJwcmlzbWEiLCJsb2ciLCJwcm9jZXNzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/db.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/semver","vendor-chunks/jsonwebtoken","vendor-chunks/lodash.includes","vendor-chunks/jws","vendor-chunks/lodash.once","vendor-chunks/jwa","vendor-chunks/lodash.isinteger","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/lodash.isplainobject","vendor-chunks/ms","vendor-chunks/lodash.isstring","vendor-chunks/lodash.isnumber","vendor-chunks/lodash.isboolean","vendor-chunks/safe-buffer","vendor-chunks/buffer-equal-constant-time"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fme%2Froute&page=%2Fapi%2Fauth%2Fme%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fme%2Froute.ts&appDir=%2FUsers%2Fbharat%2FDesktop%2Flynk-labs%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fbharat%2FDesktop%2Flynk-labs&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();