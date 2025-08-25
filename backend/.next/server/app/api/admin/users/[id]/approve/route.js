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
exports.id = "app/api/admin/users/[id]/approve/route";
exports.ids = ["app/api/admin/users/[id]/approve/route"];
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

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "dns":
/*!**********************!*\
  !*** external "dns" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("dns");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("net");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("tls");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fadmin%2Fusers%2F%5Bid%5D%2Fapprove%2Froute&page=%2Fapi%2Fadmin%2Fusers%2F%5Bid%5D%2Fapprove%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fusers%2F%5Bid%5D%2Fapprove%2Froute.ts&appDir=%2FUsers%2Fstephanie%2FDesktop%2Fucdksea-website%2Fbackend%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fstephanie%2FDesktop%2Fucdksea-website%2Fbackend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fadmin%2Fusers%2F%5Bid%5D%2Fapprove%2Froute&page=%2Fapi%2Fadmin%2Fusers%2F%5Bid%5D%2Fapprove%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fusers%2F%5Bid%5D%2Fapprove%2Froute.ts&appDir=%2FUsers%2Fstephanie%2FDesktop%2Fucdksea-website%2Fbackend%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fstephanie%2FDesktop%2Fucdksea-website%2Fbackend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_stephanie_Desktop_ucdksea_website_backend_app_api_admin_users_id_approve_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/admin/users/[id]/approve/route.ts */ \"(rsc)/./app/api/admin/users/[id]/approve/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/admin/users/[id]/approve/route\",\n        pathname: \"/api/admin/users/[id]/approve\",\n        filename: \"route\",\n        bundlePath: \"app/api/admin/users/[id]/approve/route\"\n    },\n    resolvedPagePath: \"/Users/stephanie/Desktop/ucdksea-website/backend/app/api/admin/users/[id]/approve/route.ts\",\n    nextConfigOutput,\n    userland: _Users_stephanie_Desktop_ucdksea_website_backend_app_api_admin_users_id_approve_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/admin/users/[id]/approve/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhZG1pbiUyRnVzZXJzJTJGJTVCaWQlNUQlMkZhcHByb3ZlJTJGcm91dGUmcGFnZT0lMkZhcGklMkZhZG1pbiUyRnVzZXJzJTJGJTVCaWQlNUQlMkZhcHByb3ZlJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGYWRtaW4lMkZ1c2VycyUyRiU1QmlkJTVEJTJGYXBwcm92ZSUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRnN0ZXBoYW5pZSUyRkRlc2t0b3AlMkZ1Y2Rrc2VhLXdlYnNpdGUlMkZiYWNrZW5kJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRnN0ZXBoYW5pZSUyRkRlc2t0b3AlMkZ1Y2Rrc2VhLXdlYnNpdGUlMkZiYWNrZW5kJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBc0c7QUFDdkM7QUFDYztBQUMwQztBQUN2SDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLGlFQUFpRTtBQUN6RTtBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ3VIOztBQUV2SCIsInNvdXJjZXMiOlsid2VicGFjazovL3VjZGtzZWEtd2Vic2l0ZS1iYWNrZW5kLz84YmM4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9zdGVwaGFuaWUvRGVza3RvcC91Y2Rrc2VhLXdlYnNpdGUvYmFja2VuZC9hcHAvYXBpL2FkbWluL3VzZXJzL1tpZF0vYXBwcm92ZS9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYWRtaW4vdXNlcnMvW2lkXS9hcHByb3ZlL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvYWRtaW4vdXNlcnMvW2lkXS9hcHByb3ZlXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hZG1pbi91c2Vycy9baWRdL2FwcHJvdmUvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvc3RlcGhhbmllL0Rlc2t0b3AvdWNka3NlYS13ZWJzaXRlL2JhY2tlbmQvYXBwL2FwaS9hZG1pbi91c2Vycy9baWRdL2FwcHJvdmUvcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5jb25zdCBvcmlnaW5hbFBhdGhuYW1lID0gXCIvYXBpL2FkbWluL3VzZXJzL1tpZF0vYXBwcm92ZS9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fadmin%2Fusers%2F%5Bid%5D%2Fapprove%2Froute&page=%2Fapi%2Fadmin%2Fusers%2F%5Bid%5D%2Fapprove%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fusers%2F%5Bid%5D%2Fapprove%2Froute.ts&appDir=%2FUsers%2Fstephanie%2FDesktop%2Fucdksea-website%2Fbackend%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fstephanie%2FDesktop%2Fucdksea-website%2Fbackend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/admin/users/[id]/approve/route.ts":
/*!***************************************************!*\
  !*** ./app/api/admin/users/[id]/approve/route.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST),\n/* harmony export */   runtime: () => (/* binding */ runtime)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n/* harmony import */ var _lib_mail__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/mail */ \"(rsc)/./lib/mail.ts\");\nconst runtime = \"nodejs\";\n\n\n // 메일 유틸을 만들었으면 사용, 없으면 이 import와 호출을 주석처리\nfunction isAdmin(req) {\n    const t = req.headers.get(\"x-admin-token\");\n    return t && t === process.env.ADMIN_TOKEN;\n}\nasync function POST(req, { params }) {\n    if (!isAdmin(req)) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Unauthorized\"\n        }, {\n            status: 401\n        });\n    }\n    const user = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.user.findUnique({\n        where: {\n            id: params.id\n        }\n    });\n    if (!user) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"Not found\"\n    }, {\n        status: 404\n    });\n    if (user.isApproved) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            ok: true,\n            message: \"이미 승인된 사용자입니다.\"\n        });\n    }\n    const updated = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.user.update({\n        where: {\n            id: user.id\n        },\n        data: {\n            isApproved: true\n        },\n        select: {\n            id: true,\n            email: true,\n            username: true,\n            isApproved: true\n        }\n    });\n    // 승인 메일 발송 (메일 설정이 되어 있을 때만)\n    try {\n        if (updated.email && process.env.SMTP_HOST) {\n            await (0,_lib_mail__WEBPACK_IMPORTED_MODULE_2__.sendApprovalEmail)(updated.email, updated.username);\n        }\n    } catch (e) {\n        console.error(\"MAIL_ERROR:\", e);\n    // 메일 실패해도 승인 자체는 성공 처리\n    }\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        ok: true,\n        user: updated,\n        message: \"승인 완료\"\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2FkbWluL3VzZXJzL1tpZF0vYXBwcm92ZS9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFPLE1BQU1BLFVBQVUsU0FBUztBQUVXO0FBQ0w7QUFDUyxDQUFDLDBDQUEwQztBQUUxRixTQUFTSSxRQUFRQyxHQUFZO0lBQzNCLE1BQU1DLElBQUlELElBQUlFLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDO0lBQzFCLE9BQU9GLEtBQUtBLE1BQU1HLFFBQVFDLEdBQUcsQ0FBQ0MsV0FBVztBQUMzQztBQUlPLGVBQWVDLEtBQUtQLEdBQVksRUFBRSxFQUFFUSxNQUFNLEVBQVU7SUFDekQsSUFBSSxDQUFDVCxRQUFRQyxNQUFNO1FBQ2pCLE9BQU9KLHFEQUFZQSxDQUFDYSxJQUFJLENBQUM7WUFBRUMsT0FBTztRQUFlLEdBQUc7WUFBRUMsUUFBUTtRQUFJO0lBQ3BFO0lBRUEsTUFBTUMsT0FBTyxNQUFNZiwrQ0FBTUEsQ0FBQ2UsSUFBSSxDQUFDQyxVQUFVLENBQUM7UUFBRUMsT0FBTztZQUFFQyxJQUFJUCxPQUFPTyxFQUFFO1FBQUM7SUFBRTtJQUNyRSxJQUFJLENBQUNILE1BQU0sT0FBT2hCLHFEQUFZQSxDQUFDYSxJQUFJLENBQUM7UUFBRUMsT0FBTztJQUFZLEdBQUc7UUFBRUMsUUFBUTtJQUFJO0lBQzFFLElBQUlDLEtBQUtJLFVBQVUsRUFBRTtRQUNuQixPQUFPcEIscURBQVlBLENBQUNhLElBQUksQ0FBQztZQUFFUSxJQUFJO1lBQU1DLFNBQVM7UUFBaUI7SUFDakU7SUFFQSxNQUFNQyxVQUFVLE1BQU10QiwrQ0FBTUEsQ0FBQ2UsSUFBSSxDQUFDUSxNQUFNLENBQUM7UUFDdkNOLE9BQU87WUFBRUMsSUFBSUgsS0FBS0csRUFBRTtRQUFDO1FBQ3JCTSxNQUFNO1lBQUVMLFlBQVk7UUFBSztRQUN6Qk0sUUFBUTtZQUFFUCxJQUFJO1lBQU1RLE9BQU87WUFBTUMsVUFBVTtZQUFNUixZQUFZO1FBQUs7SUFDcEU7SUFFQSw2QkFBNkI7SUFDN0IsSUFBSTtRQUNGLElBQUlHLFFBQVFJLEtBQUssSUFBSW5CLFFBQVFDLEdBQUcsQ0FBQ29CLFNBQVMsRUFBRTtZQUMxQyxNQUFNM0IsNERBQWlCQSxDQUFDcUIsUUFBUUksS0FBSyxFQUFFSixRQUFRSyxRQUFRO1FBQ3pEO0lBQ0YsRUFBRSxPQUFPRSxHQUFHO1FBQ1ZDLFFBQVFqQixLQUFLLENBQUMsZUFBZWdCO0lBQzdCLHVCQUF1QjtJQUN6QjtJQUVBLE9BQU85QixxREFBWUEsQ0FBQ2EsSUFBSSxDQUFDO1FBQUVRLElBQUk7UUFBTUwsTUFBTU87UUFBU0QsU0FBUztJQUFRO0FBQ3ZFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdWNka3NlYS13ZWJzaXRlLWJhY2tlbmQvLi9hcHAvYXBpL2FkbWluL3VzZXJzL1tpZF0vYXBwcm92ZS9yb3V0ZS50cz82N2NjIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBydW50aW1lID0gXCJub2RlanNcIjtcblxuaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSBcIm5leHQvc2VydmVyXCI7XG5pbXBvcnQgeyBwcmlzbWEgfSBmcm9tIFwiQC9saWIvcHJpc21hXCI7XG5pbXBvcnQgeyBzZW5kQXBwcm92YWxFbWFpbCB9IGZyb20gXCJAL2xpYi9tYWlsXCI7IC8vIOuplOydvCDsnKDti7jsnYQg66eM65Ok7JeI7Jy866m0IOyCrOyaqSwg7JeG7Jy866m0IOydtCBpbXBvcnTsmYAg7Zi47Lac7J2EIOyjvOyEneyymOumrFxuXG5mdW5jdGlvbiBpc0FkbWluKHJlcTogUmVxdWVzdCkge1xuICBjb25zdCB0ID0gcmVxLmhlYWRlcnMuZ2V0KFwieC1hZG1pbi10b2tlblwiKTtcbiAgcmV0dXJuIHQgJiYgdCA9PT0gcHJvY2Vzcy5lbnYuQURNSU5fVE9LRU47XG59XG5cbnR5cGUgUGFyYW1zID0geyBwYXJhbXM6IHsgaWQ6IHN0cmluZyB9IH07XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcTogUmVxdWVzdCwgeyBwYXJhbXMgfTogUGFyYW1zKSB7XG4gIGlmICghaXNBZG1pbihyZXEpKSB7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiVW5hdXRob3JpemVkXCIgfSwgeyBzdGF0dXM6IDQwMSB9KTtcbiAgfVxuXG4gIGNvbnN0IHVzZXIgPSBhd2FpdCBwcmlzbWEudXNlci5maW5kVW5pcXVlKHsgd2hlcmU6IHsgaWQ6IHBhcmFtcy5pZCB9IH0pO1xuICBpZiAoIXVzZXIpIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBcIk5vdCBmb3VuZFwiIH0sIHsgc3RhdHVzOiA0MDQgfSk7XG4gIGlmICh1c2VyLmlzQXBwcm92ZWQpIHtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBvazogdHJ1ZSwgbWVzc2FnZTogXCLsnbTrr7gg7Iq57J2465CcIOyCrOyaqeyekOyeheuLiOuLpC5cIiB9KTtcbiAgfVxuXG4gIGNvbnN0IHVwZGF0ZWQgPSBhd2FpdCBwcmlzbWEudXNlci51cGRhdGUoe1xuICAgIHdoZXJlOiB7IGlkOiB1c2VyLmlkIH0sXG4gICAgZGF0YTogeyBpc0FwcHJvdmVkOiB0cnVlIH0sXG4gICAgc2VsZWN0OiB7IGlkOiB0cnVlLCBlbWFpbDogdHJ1ZSwgdXNlcm5hbWU6IHRydWUsIGlzQXBwcm92ZWQ6IHRydWUgfSxcbiAgfSk7XG5cbiAgLy8g7Iq57J24IOuplOydvCDrsJzshqEgKOuplOydvCDshKTsoJXsnbQg65CY7Ja0IOyeiOydhCDrlYzrp4wpXG4gIHRyeSB7XG4gICAgaWYgKHVwZGF0ZWQuZW1haWwgJiYgcHJvY2Vzcy5lbnYuU01UUF9IT1NUKSB7XG4gICAgICBhd2FpdCBzZW5kQXBwcm92YWxFbWFpbCh1cGRhdGVkLmVtYWlsLCB1cGRhdGVkLnVzZXJuYW1lKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiTUFJTF9FUlJPUjpcIiwgZSk7XG4gICAgLy8g66mU7J28IOyLpO2MqO2VtOuPhCDsirnsnbgg7J6Q7LK064qUIOyEseqztSDsspjrpqxcbiAgfVxuXG4gIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IG9rOiB0cnVlLCB1c2VyOiB1cGRhdGVkLCBtZXNzYWdlOiBcIuyKueyduCDsmYTro4xcIiB9KTtcbn1cbiJdLCJuYW1lcyI6WyJydW50aW1lIiwiTmV4dFJlc3BvbnNlIiwicHJpc21hIiwic2VuZEFwcHJvdmFsRW1haWwiLCJpc0FkbWluIiwicmVxIiwidCIsImhlYWRlcnMiLCJnZXQiLCJwcm9jZXNzIiwiZW52IiwiQURNSU5fVE9LRU4iLCJQT1NUIiwicGFyYW1zIiwianNvbiIsImVycm9yIiwic3RhdHVzIiwidXNlciIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsImlkIiwiaXNBcHByb3ZlZCIsIm9rIiwibWVzc2FnZSIsInVwZGF0ZWQiLCJ1cGRhdGUiLCJkYXRhIiwic2VsZWN0IiwiZW1haWwiLCJ1c2VybmFtZSIsIlNNVFBfSE9TVCIsImUiLCJjb25zb2xlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/admin/users/[id]/approve/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/mail.ts":
/*!*********************!*\
  !*** ./lib/mail.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   mailer: () => (/* binding */ mailer),\n/* harmony export */   sendApprovalEmail: () => (/* binding */ sendApprovalEmail)\n/* harmony export */ });\n/* harmony import */ var nodemailer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! nodemailer */ \"(rsc)/./node_modules/nodemailer/lib/nodemailer.js\");\n// lib/mail.ts\n\nconst mailer = nodemailer__WEBPACK_IMPORTED_MODULE_0__.createTransport({\n    host: process.env.SMTP_HOST,\n    port: Number(process.env.SMTP_PORT ?? 587),\n    secure: Number(process.env.SMTP_PORT) === 465,\n    auth: {\n        user: process.env.SMTP_USER,\n        pass: process.env.SMTP_PASS\n    }\n});\nasync function sendApprovalEmail(to, username) {\n    const from = process.env.FROM_EMAIL || process.env.SMTP_USER;\n    const appName = process.env.APP_NAME || \"Our Service\";\n    const loginUrl = process.env.APP_LOGIN_URL || \"http://localhost:3000/login\";\n    const subject = `[${appName}] 회원가입 승인 완료 안내`;\n    const text = [\n        `${username}님, 안녕하세요.`,\n        ``,\n        `회원가입 승인이 완료되었습니다.`,\n        `아래 링크에서 아이디(${username})와 비밀번호로 로그인 해주세요.`,\n        loginUrl,\n        ``,\n        `감사합니다.`\n    ].join(\"\\n\");\n    const html = `\n    <div style=\"font-family:system-ui, AppleSDGothicNeo, Arial; line-height:1.6;\">\n      <h2>${appName} 회원가입 승인 완료</h2>\n      <p><b>${username}</b>님, 안녕하세요.</p>\n      <p>회원가입 승인이 완료되었습니다. 아래 버튼을 눌러 로그인하세요.</p>\n      <p style=\"margin:24px 0;\">\n        <a href=\"${loginUrl}\" style=\"background:#111827;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;\">\n          로그인 하기\n        </a>\n      </p>\n      <p>아이디: <b>${username}</b></p>\n      <hr />\n      <small>본 메일은 발신전용입니다.</small>\n    </div>\n  `;\n    await mailer.sendMail({\n        from,\n        to,\n        subject,\n        text,\n        html\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvbWFpbC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxjQUFjO0FBQ3NCO0FBRTdCLE1BQU1DLFNBQVNELHVEQUEwQixDQUFDO0lBQy9DRyxNQUFNQyxRQUFRQyxHQUFHLENBQUNDLFNBQVM7SUFDM0JDLE1BQU1DLE9BQU9KLFFBQVFDLEdBQUcsQ0FBQ0ksU0FBUyxJQUFJO0lBQ3RDQyxRQUFRRixPQUFPSixRQUFRQyxHQUFHLENBQUNJLFNBQVMsTUFBTTtJQUMxQ0UsTUFBTTtRQUNKQyxNQUFNUixRQUFRQyxHQUFHLENBQUNRLFNBQVM7UUFDM0JDLE1BQU1WLFFBQVFDLEdBQUcsQ0FBQ1UsU0FBUztJQUM3QjtBQUNGLEdBQUc7QUFFSSxlQUFlQyxrQkFBa0JDLEVBQVUsRUFBRUMsUUFBZ0I7SUFDbEUsTUFBTUMsT0FBT2YsUUFBUUMsR0FBRyxDQUFDZSxVQUFVLElBQUloQixRQUFRQyxHQUFHLENBQUNRLFNBQVM7SUFDNUQsTUFBTVEsVUFBVWpCLFFBQVFDLEdBQUcsQ0FBQ2lCLFFBQVEsSUFBSTtJQUN4QyxNQUFNQyxXQUFXbkIsUUFBUUMsR0FBRyxDQUFDbUIsYUFBYSxJQUFJO0lBRTlDLE1BQU1DLFVBQVUsQ0FBQyxDQUFDLEVBQUVKLFFBQVEsZUFBZSxDQUFDO0lBQzVDLE1BQU1LLE9BQU87UUFDWCxDQUFDLEVBQUVSLFNBQVMsU0FBUyxDQUFDO1FBQ3RCLENBQUMsQ0FBQztRQUNGLENBQUMsaUJBQWlCLENBQUM7UUFDbkIsQ0FBQyxZQUFZLEVBQUVBLFNBQVMsa0JBQWtCLENBQUM7UUFDM0NLO1FBQ0EsQ0FBQyxDQUFDO1FBQ0YsQ0FBQyxNQUFNLENBQUM7S0FDVCxDQUFDSSxJQUFJLENBQUM7SUFFUCxNQUFNQyxPQUFPLENBQUM7O1VBRU4sRUFBRVAsUUFBUTtZQUNSLEVBQUVILFNBQVM7OztpQkFHTixFQUFFSyxTQUFTOzs7O2lCQUlYLEVBQUVMLFNBQVM7Ozs7RUFJMUIsQ0FBQztJQUVELE1BQU1qQixPQUFPNEIsUUFBUSxDQUFDO1FBQUVWO1FBQU1GO1FBQUlRO1FBQVNDO1FBQU1FO0lBQUs7QUFDeEQiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly91Y2Rrc2VhLXdlYnNpdGUtYmFja2VuZC8uL2xpYi9tYWlsLnRzP2QxYzkiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gbGliL21haWwudHNcbmltcG9ydCBub2RlbWFpbGVyIGZyb20gXCJub2RlbWFpbGVyXCI7XG5cbmV4cG9ydCBjb25zdCBtYWlsZXIgPSBub2RlbWFpbGVyLmNyZWF0ZVRyYW5zcG9ydCh7XG4gIGhvc3Q6IHByb2Nlc3MuZW52LlNNVFBfSE9TVCEsXG4gIHBvcnQ6IE51bWJlcihwcm9jZXNzLmVudi5TTVRQX1BPUlQgPz8gNTg3KSxcbiAgc2VjdXJlOiBOdW1iZXIocHJvY2Vzcy5lbnYuU01UUF9QT1JUKSA9PT0gNDY1LCAvLyA0NjUg7Y+s7Yq466m0IFRMU1xuICBhdXRoOiB7XG4gICAgdXNlcjogcHJvY2Vzcy5lbnYuU01UUF9VU0VSISxcbiAgICBwYXNzOiBwcm9jZXNzLmVudi5TTVRQX1BBU1MhLFxuICB9LFxufSk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZW5kQXBwcm92YWxFbWFpbCh0bzogc3RyaW5nLCB1c2VybmFtZTogc3RyaW5nKSB7XG4gIGNvbnN0IGZyb20gPSBwcm9jZXNzLmVudi5GUk9NX0VNQUlMIHx8IHByb2Nlc3MuZW52LlNNVFBfVVNFUiE7XG4gIGNvbnN0IGFwcE5hbWUgPSBwcm9jZXNzLmVudi5BUFBfTkFNRSB8fCBcIk91ciBTZXJ2aWNlXCI7XG4gIGNvbnN0IGxvZ2luVXJsID0gcHJvY2Vzcy5lbnYuQVBQX0xPR0lOX1VSTCB8fCBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9sb2dpblwiO1xuXG4gIGNvbnN0IHN1YmplY3QgPSBgWyR7YXBwTmFtZX1dIO2ajOybkOqwgOyehSDsirnsnbgg7JmE66OMIOyViOuCtGA7XG4gIGNvbnN0IHRleHQgPSBbXG4gICAgYCR7dXNlcm5hbWV964uYLCDslYjrhZXtlZjshLjsmpQuYCxcbiAgICBgYCxcbiAgICBg7ZqM7JuQ6rCA7J6FIOyKueyduOydtCDsmYTro4zrkJjsl4jsirXri4jri6QuYCxcbiAgICBg7JWE656YIOunge2BrOyXkOyEnCDslYTsnbTrlJQoJHt1c2VybmFtZX0p7JmAIOu5hOuwgOuyiO2YuOuhnCDroZzqt7jsnbgg7ZW07KO87IS47JqULmAsXG4gICAgbG9naW5VcmwsXG4gICAgYGAsXG4gICAgYOqwkOyCrO2VqeuLiOuLpC5gLFxuICBdLmpvaW4oXCJcXG5cIik7XG5cbiAgY29uc3QgaHRtbCA9IGBcbiAgICA8ZGl2IHN0eWxlPVwiZm9udC1mYW1pbHk6c3lzdGVtLXVpLCBBcHBsZVNER290aGljTmVvLCBBcmlhbDsgbGluZS1oZWlnaHQ6MS42O1wiPlxuICAgICAgPGgyPiR7YXBwTmFtZX0g7ZqM7JuQ6rCA7J6FIOyKueyduCDsmYTro4w8L2gyPlxuICAgICAgPHA+PGI+JHt1c2VybmFtZX08L2I+64uYLCDslYjrhZXtlZjshLjsmpQuPC9wPlxuICAgICAgPHA+7ZqM7JuQ6rCA7J6FIOyKueyduOydtCDsmYTro4zrkJjsl4jsirXri4jri6QuIOyVhOuemCDrsoTtirzsnYQg64iM65+sIOuhnOq3uOyduO2VmOyEuOyalC48L3A+XG4gICAgICA8cCBzdHlsZT1cIm1hcmdpbjoyNHB4IDA7XCI+XG4gICAgICAgIDxhIGhyZWY9XCIke2xvZ2luVXJsfVwiIHN0eWxlPVwiYmFja2dyb3VuZDojMTExODI3O2NvbG9yOiNmZmY7cGFkZGluZzoxMHB4IDE2cHg7Ym9yZGVyLXJhZGl1czo4cHg7dGV4dC1kZWNvcmF0aW9uOm5vbmU7XCI+XG4gICAgICAgICAg66Gc6re47J24IO2VmOq4sFxuICAgICAgICA8L2E+XG4gICAgICA8L3A+XG4gICAgICA8cD7slYTsnbTrlJQ6IDxiPiR7dXNlcm5hbWV9PC9iPjwvcD5cbiAgICAgIDxociAvPlxuICAgICAgPHNtYWxsPuuzuCDrqZTsnbzsnYAg67Cc7Iug7KCE7Jqp7J6F64uI64ukLjwvc21hbGw+XG4gICAgPC9kaXY+XG4gIGA7XG5cbiAgYXdhaXQgbWFpbGVyLnNlbmRNYWlsKHsgZnJvbSwgdG8sIHN1YmplY3QsIHRleHQsIGh0bWwgfSk7XG59XG4iXSwibmFtZXMiOlsibm9kZW1haWxlciIsIm1haWxlciIsImNyZWF0ZVRyYW5zcG9ydCIsImhvc3QiLCJwcm9jZXNzIiwiZW52IiwiU01UUF9IT1NUIiwicG9ydCIsIk51bWJlciIsIlNNVFBfUE9SVCIsInNlY3VyZSIsImF1dGgiLCJ1c2VyIiwiU01UUF9VU0VSIiwicGFzcyIsIlNNVFBfUEFTUyIsInNlbmRBcHByb3ZhbEVtYWlsIiwidG8iLCJ1c2VybmFtZSIsImZyb20iLCJGUk9NX0VNQUlMIiwiYXBwTmFtZSIsIkFQUF9OQU1FIiwibG9naW5VcmwiLCJBUFBfTE9HSU5fVVJMIiwic3ViamVjdCIsInRleHQiLCJqb2luIiwiaHRtbCIsInNlbmRNYWlsIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/mail.ts\n");

/***/ }),

/***/ "(rsc)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = global;\nconst prisma = globalForPrisma.prisma || new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log: [\n        \"query\",\n        \"error\",\n        \"warn\"\n    ]\n});\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE4QztBQUU5QyxNQUFNQyxrQkFBa0JDO0FBQ2pCLE1BQU1DLFNBQ1hGLGdCQUFnQkUsTUFBTSxJQUN0QixJQUFJSCx3REFBWUEsQ0FBQztJQUNmSSxLQUFLO1FBQUM7UUFBUztRQUFTO0tBQU87QUFDakMsR0FBRztBQUVMLElBQUlDLElBQXFDLEVBQUVKLGdCQUFnQkUsTUFBTSxHQUFHQSIsInNvdXJjZXMiOlsid2VicGFjazovL3VjZGtzZWEtd2Vic2l0ZS1iYWNrZW5kLy4vbGliL3ByaXNtYS50cz85ODIyIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gXCJAcHJpc21hL2NsaWVudFwiO1xuXG5jb25zdCBnbG9iYWxGb3JQcmlzbWEgPSBnbG9iYWwgYXMgdW5rbm93biBhcyB7IHByaXNtYTogUHJpc21hQ2xpZW50IH07XG5leHBvcnQgY29uc3QgcHJpc21hID1cbiAgZ2xvYmFsRm9yUHJpc21hLnByaXNtYSB8fFxuICBuZXcgUHJpc21hQ2xpZW50KHtcbiAgICBsb2c6IFtcInF1ZXJ5XCIsIFwiZXJyb3JcIiwgXCJ3YXJuXCJdLFxuICB9KTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgZ2xvYmFsRm9yUHJpc21hLnByaXNtYSA9IHByaXNtYTtcbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJnbG9iYWxGb3JQcmlzbWEiLCJnbG9iYWwiLCJwcmlzbWEiLCJsb2ciLCJwcm9jZXNzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/nodemailer"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fadmin%2Fusers%2F%5Bid%5D%2Fapprove%2Froute&page=%2Fapi%2Fadmin%2Fusers%2F%5Bid%5D%2Fapprove%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fusers%2F%5Bid%5D%2Fapprove%2Froute.ts&appDir=%2FUsers%2Fstephanie%2FDesktop%2Fucdksea-website%2Fbackend%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fstephanie%2FDesktop%2Fucdksea-website%2Fbackend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();