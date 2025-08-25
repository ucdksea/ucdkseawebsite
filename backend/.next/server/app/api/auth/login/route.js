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
exports.id = "app/api/auth/login/route";
exports.ids = ["app/api/auth/login/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "./action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "./request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "./static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

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

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=%2FUsers%2Fstephanie%2FDesktop%2Fucdksea-website%2Fbackend%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fstephanie%2FDesktop%2Fucdksea-website%2Fbackend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=%2FUsers%2Fstephanie%2FDesktop%2Fucdksea-website%2Fbackend%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fstephanie%2FDesktop%2Fucdksea-website%2Fbackend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_stephanie_Desktop_ucdksea_website_backend_app_api_auth_login_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/login/route.ts */ \"(rsc)/./app/api/auth/login/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/login/route\",\n        pathname: \"/api/auth/login\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/login/route\"\n    },\n    resolvedPagePath: \"/Users/stephanie/Desktop/ucdksea-website/backend/app/api/auth/login/route.ts\",\n    nextConfigOutput,\n    userland: _Users_stephanie_Desktop_ucdksea_website_backend_app_api_auth_login_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/auth/login/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGbG9naW4lMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkZsb2dpbiUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkZsb2dpbiUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRnN0ZXBoYW5pZSUyRkRlc2t0b3AlMkZ1Y2Rrc2VhLXdlYnNpdGUlMkZiYWNrZW5kJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRnN0ZXBoYW5pZSUyRkRlc2t0b3AlMkZ1Y2Rrc2VhLXdlYnNpdGUlMkZiYWNrZW5kJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBc0c7QUFDdkM7QUFDYztBQUM0QjtBQUN6RztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLGlFQUFpRTtBQUN6RTtBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ3VIOztBQUV2SCIsInNvdXJjZXMiOlsid2VicGFjazovL3VjZGtzZWEtd2Vic2l0ZS1iYWNrZW5kLz82Mzg3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9zdGVwaGFuaWUvRGVza3RvcC91Y2Rrc2VhLXdlYnNpdGUvYmFja2VuZC9hcHAvYXBpL2F1dGgvbG9naW4vcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2F1dGgvbG9naW4vcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9hdXRoL2xvZ2luXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hdXRoL2xvZ2luL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL1VzZXJzL3N0ZXBoYW5pZS9EZXNrdG9wL3VjZGtzZWEtd2Vic2l0ZS9iYWNrZW5kL2FwcC9hcGkvYXV0aC9sb2dpbi9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvYXV0aC9sb2dpbi9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=%2FUsers%2Fstephanie%2FDesktop%2Fucdksea-website%2Fbackend%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fstephanie%2FDesktop%2Fucdksea-website%2Fbackend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/auth/login/route.ts":
/*!*************************************!*\
  !*** ./app/api/auth/login/route.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST),\n/* harmony export */   runtime: () => (/* binding */ runtime)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcrypt */ \"bcrypt\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcrypt__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! zod */ \"(rsc)/./node_modules/zod/v3/types.js\");\n// app/api/auth/login/route.ts\nconst runtime = \"nodejs\"; // jsonwebtoken 사용 → Node 런타임 고정\n\n\n\n\n\nconst loginSchema = zod__WEBPACK_IMPORTED_MODULE_4__.object({\n    email: zod__WEBPACK_IMPORTED_MODULE_4__.string().email(),\n    password: zod__WEBPACK_IMPORTED_MODULE_4__.string().min(8)\n});\nasync function POST(req) {\n    try {\n        const body = await req.json();\n        const parsed = loginSchema.safeParse(body);\n        if (!parsed.success) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Invalid input\"\n            }, {\n                status: 400\n            });\n        }\n        const { email, password } = parsed.data;\n        const user = await _lib_prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.user.findUnique({\n            where: {\n                email\n            }\n        });\n        if (!user) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Invalid credentials\"\n        }, {\n            status: 401\n        });\n        const ok = await bcrypt__WEBPACK_IMPORTED_MODULE_1___default().compare(password, user.passwordHash);\n        if (!ok) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Invalid credentials\"\n        }, {\n            status: 401\n        });\n        if (!user.isApproved) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"관리자 승인 대기 중입니다.\"\n            }, {\n                status: 403\n            });\n        }\n        const token = (0,_lib_auth__WEBPACK_IMPORTED_MODULE_3__.signToken)({\n            uid: user.id,\n            email: user.email\n        });\n        await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_3__.setAuthCookie)(token); // ✅ async\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            ok: true,\n            user: {\n                id: user.id,\n                email: user.email,\n                username: user.username,\n                mustChangePassword: user.mustChangePassword\n            }\n        });\n    } catch (e) {\n        console.error(e);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Server error\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvbG9naW4vcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSw4QkFBOEI7QUFDdkIsTUFBTUEsVUFBVSxTQUFTLENBQUMsZ0NBQWdDO0FBRXRCO0FBQ2Y7QUFDVTtBQUNnQjtBQUM5QjtBQUV4QixNQUFNTyxjQUFjRCx1Q0FBUSxDQUFDO0lBQzNCRyxPQUFPSCx1Q0FBUSxHQUFHRyxLQUFLO0lBQ3ZCRSxVQUFVTCx1Q0FBUSxHQUFHTSxHQUFHLENBQUM7QUFDM0I7QUFFTyxlQUFlQyxLQUFLQyxHQUFZO0lBQ3JDLElBQUk7UUFDRixNQUFNQyxPQUFPLE1BQU1ELElBQUlFLElBQUk7UUFDM0IsTUFBTUMsU0FBU1YsWUFBWVcsU0FBUyxDQUFDSDtRQUNyQyxJQUFJLENBQUNFLE9BQU9FLE9BQU8sRUFBRTtZQUNuQixPQUFPbEIscURBQVlBLENBQUNlLElBQUksQ0FBQztnQkFBRUksT0FBTztZQUFnQixHQUFHO2dCQUFFQyxRQUFRO1lBQUk7UUFDckU7UUFDQSxNQUFNLEVBQUVaLEtBQUssRUFBRUUsUUFBUSxFQUFFLEdBQUdNLE9BQU9LLElBQUk7UUFFdkMsTUFBTUMsT0FBTyxNQUFNcEIsK0NBQU1BLENBQUNvQixJQUFJLENBQUNDLFVBQVUsQ0FBQztZQUFFQyxPQUFPO2dCQUFFaEI7WUFBTTtRQUFFO1FBQzdELElBQUksQ0FBQ2MsTUFBTSxPQUFPdEIscURBQVlBLENBQUNlLElBQUksQ0FBQztZQUFFSSxPQUFPO1FBQXNCLEdBQUc7WUFBRUMsUUFBUTtRQUFJO1FBRXBGLE1BQU1LLEtBQUssTUFBTXhCLHFEQUFjLENBQUNTLFVBQVVZLEtBQUtLLFlBQVk7UUFDM0QsSUFBSSxDQUFDRixJQUFJLE9BQU96QixxREFBWUEsQ0FBQ2UsSUFBSSxDQUFDO1lBQUVJLE9BQU87UUFBc0IsR0FBRztZQUFFQyxRQUFRO1FBQUk7UUFFbEYsSUFBSSxDQUFDRSxLQUFLTSxVQUFVLEVBQUU7WUFDcEIsT0FBTzVCLHFEQUFZQSxDQUFDZSxJQUFJLENBQUM7Z0JBQUVJLE9BQU87WUFBa0IsR0FBRztnQkFBRUMsUUFBUTtZQUFJO1FBQ3ZFO1FBRUEsTUFBTVMsUUFBUTFCLG9EQUFTQSxDQUFDO1lBQUUyQixLQUFLUixLQUFLUyxFQUFFO1lBQUV2QixPQUFPYyxLQUFLZCxLQUFLO1FBQUM7UUFDMUQsTUFBTUosd0RBQWFBLENBQUN5QixRQUFRLFVBQVU7UUFFdEMsT0FBTzdCLHFEQUFZQSxDQUFDZSxJQUFJLENBQUM7WUFDdkJVLElBQUk7WUFDSkgsTUFBTTtnQkFDSlMsSUFBSVQsS0FBS1MsRUFBRTtnQkFDWHZCLE9BQU9jLEtBQUtkLEtBQUs7Z0JBQ2pCd0IsVUFBVVYsS0FBS1UsUUFBUTtnQkFDdkJDLG9CQUFvQlgsS0FBS1csa0JBQWtCO1lBQzdDO1FBQ0Y7SUFDRixFQUFFLE9BQU9DLEdBQUc7UUFDVkMsUUFBUWhCLEtBQUssQ0FBQ2U7UUFDZCxPQUFPbEMscURBQVlBLENBQUNlLElBQUksQ0FBQztZQUFFSSxPQUFPO1FBQWUsR0FBRztZQUFFQyxRQUFRO1FBQUk7SUFDcEU7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL3VjZGtzZWEtd2Vic2l0ZS1iYWNrZW5kLy4vYXBwL2FwaS9hdXRoL2xvZ2luL3JvdXRlLnRzPzRmMjQiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gYXBwL2FwaS9hdXRoL2xvZ2luL3JvdXRlLnRzXG5leHBvcnQgY29uc3QgcnVudGltZSA9IFwibm9kZWpzXCI7IC8vIGpzb253ZWJ0b2tlbiDsgqzsmqkg4oaSIE5vZGUg65+w7YOA7J6EIOqzoOyglVxuXG5pbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIjtcbmltcG9ydCBiY3J5cHQgZnJvbSBcImJjcnlwdFwiO1xuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSBcIkAvbGliL3ByaXNtYVwiO1xuaW1wb3J0IHsgc2lnblRva2VuLCBzZXRBdXRoQ29va2llIH0gZnJvbSBcIkAvbGliL2F1dGhcIjtcbmltcG9ydCB7IHogfSBmcm9tIFwiem9kXCI7XG5cbmNvbnN0IGxvZ2luU2NoZW1hID0gei5vYmplY3Qoe1xuICBlbWFpbDogei5zdHJpbmcoKS5lbWFpbCgpLFxuICBwYXNzd29yZDogei5zdHJpbmcoKS5taW4oOCksXG59KTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxOiBSZXF1ZXN0KSB7XG4gIHRyeSB7XG4gICAgY29uc3QgYm9keSA9IGF3YWl0IHJlcS5qc29uKCk7XG4gICAgY29uc3QgcGFyc2VkID0gbG9naW5TY2hlbWEuc2FmZVBhcnNlKGJvZHkpO1xuICAgIGlmICghcGFyc2VkLnN1Y2Nlc3MpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBcIkludmFsaWQgaW5wdXRcIiB9LCB7IHN0YXR1czogNDAwIH0pO1xuICAgIH1cbiAgICBjb25zdCB7IGVtYWlsLCBwYXNzd29yZCB9ID0gcGFyc2VkLmRhdGE7XG5cbiAgICBjb25zdCB1c2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7IHdoZXJlOiB7IGVtYWlsIH0gfSk7XG4gICAgaWYgKCF1c2VyKSByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJJbnZhbGlkIGNyZWRlbnRpYWxzXCIgfSwgeyBzdGF0dXM6IDQwMSB9KTtcblxuICAgIGNvbnN0IG9rID0gYXdhaXQgYmNyeXB0LmNvbXBhcmUocGFzc3dvcmQsIHVzZXIucGFzc3dvcmRIYXNoKTtcbiAgICBpZiAoIW9rKSByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJJbnZhbGlkIGNyZWRlbnRpYWxzXCIgfSwgeyBzdGF0dXM6IDQwMSB9KTtcblxuICAgIGlmICghdXNlci5pc0FwcHJvdmVkKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCLqtIDrpqzsnpAg7Iq57J24IOuMgOq4sCDspJHsnoXri4jri6QuXCIgfSwgeyBzdGF0dXM6IDQwMyB9KTtcbiAgICB9XG5cbiAgICBjb25zdCB0b2tlbiA9IHNpZ25Ub2tlbih7IHVpZDogdXNlci5pZCwgZW1haWw6IHVzZXIuZW1haWwgfSk7XG4gICAgYXdhaXQgc2V0QXV0aENvb2tpZSh0b2tlbik7IC8vIOKchSBhc3luY1xuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcbiAgICAgIG9rOiB0cnVlLFxuICAgICAgdXNlcjoge1xuICAgICAgICBpZDogdXNlci5pZCxcbiAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXG4gICAgICAgIHVzZXJuYW1lOiB1c2VyLnVzZXJuYW1lLFxuICAgICAgICBtdXN0Q2hhbmdlUGFzc3dvcmQ6IHVzZXIubXVzdENoYW5nZVBhc3N3b3JkLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiU2VydmVyIGVycm9yXCIgfSwgeyBzdGF0dXM6IDUwMCB9KTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbInJ1bnRpbWUiLCJOZXh0UmVzcG9uc2UiLCJiY3J5cHQiLCJwcmlzbWEiLCJzaWduVG9rZW4iLCJzZXRBdXRoQ29va2llIiwieiIsImxvZ2luU2NoZW1hIiwib2JqZWN0IiwiZW1haWwiLCJzdHJpbmciLCJwYXNzd29yZCIsIm1pbiIsIlBPU1QiLCJyZXEiLCJib2R5IiwianNvbiIsInBhcnNlZCIsInNhZmVQYXJzZSIsInN1Y2Nlc3MiLCJlcnJvciIsInN0YXR1cyIsImRhdGEiLCJ1c2VyIiwiZmluZFVuaXF1ZSIsIndoZXJlIiwib2siLCJjb21wYXJlIiwicGFzc3dvcmRIYXNoIiwiaXNBcHByb3ZlZCIsInRva2VuIiwidWlkIiwiaWQiLCJ1c2VybmFtZSIsIm11c3RDaGFuZ2VQYXNzd29yZCIsImUiLCJjb25zb2xlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/login/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth.ts":
/*!*********************!*\
  !*** ./lib/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   clearAuthCookie: () => (/* binding */ clearAuthCookie),\n/* harmony export */   getAuthFromCookie: () => (/* binding */ getAuthFromCookie),\n/* harmony export */   setAuthCookie: () => (/* binding */ setAuthCookie),\n/* harmony export */   signToken: () => (/* binding */ signToken),\n/* harmony export */   verifyToken: () => (/* binding */ verifyToken)\n/* harmony export */ });\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jsonwebtoken */ \"(rsc)/./node_modules/jsonwebtoken/index.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n// lib/auth.ts\n\n\nconst JWT_SECRET = process.env.JWT_SECRET;\nfunction signToken(payload) {\n    return jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default().sign(payload, JWT_SECRET, {\n        expiresIn: \"7d\"\n    });\n}\nfunction verifyToken(token) {\n    try {\n        return jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default().verify(token, JWT_SECRET);\n    } catch  {\n        return null;\n    }\n}\nasync function setAuthCookie(token) {\n    const jar = await (0,next_headers__WEBPACK_IMPORTED_MODULE_1__.cookies)();\n    jar.set(\"auth\", token, {\n        httpOnly: true,\n        sameSite: \"lax\",\n        secure: \"development\" === \"production\",\n        path: \"/\",\n        maxAge: 60 * 60 * 24 * 7\n    });\n}\nasync function getAuthFromCookie() {\n    const jar = await (0,next_headers__WEBPACK_IMPORTED_MODULE_1__.cookies)();\n    const token = jar.get(\"auth\")?.value;\n    if (!token) return null;\n    return verifyToken(token);\n}\nasync function clearAuthCookie() {\n    const jar = await (0,next_headers__WEBPACK_IMPORTED_MODULE_1__.cookies)();\n    // delete 또는 만료로 제거\n    jar.set(\"auth\", \"\", {\n        path: \"/\",\n        maxAge: 0\n    });\n// or: jar.delete(\"auth\");\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXV0aC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLGNBQWM7QUFDaUI7QUFDUTtBQUV2QyxNQUFNRSxhQUFhQyxRQUFRQyxHQUFHLENBQUNGLFVBQVU7QUFHbEMsU0FBU0csVUFBVUMsT0FBbUI7SUFDM0MsT0FBT04sd0RBQVEsQ0FBQ00sU0FBU0osWUFBWTtRQUFFTSxXQUFXO0lBQUs7QUFDekQ7QUFFTyxTQUFTQyxZQUFZQyxLQUFhO0lBQ3ZDLElBQUk7UUFDRixPQUFPViwwREFBVSxDQUFDVSxPQUFPUjtJQUMzQixFQUFFLE9BQU07UUFDTixPQUFPO0lBQ1Q7QUFDRjtBQUVPLGVBQWVVLGNBQWNGLEtBQWE7SUFDL0MsTUFBTUcsTUFBTSxNQUFNWixxREFBT0E7SUFDekJZLElBQUlDLEdBQUcsQ0FBQyxRQUFRSixPQUFPO1FBQ3JCSyxVQUFVO1FBQ1ZDLFVBQVU7UUFDVkMsUUFBUWQsa0JBQXlCO1FBQ2pDZSxNQUFNO1FBQ05DLFFBQVEsS0FBSyxLQUFLLEtBQUs7SUFDekI7QUFDRjtBQUVPLGVBQWVDO0lBQ3BCLE1BQU1QLE1BQU0sTUFBTVoscURBQU9BO0lBQ3pCLE1BQU1TLFFBQVFHLElBQUlRLEdBQUcsQ0FBQyxTQUFTQztJQUMvQixJQUFJLENBQUNaLE9BQU8sT0FBTztJQUNuQixPQUFPRCxZQUFZQztBQUNyQjtBQUVPLGVBQWVhO0lBQ3BCLE1BQU1WLE1BQU0sTUFBTVoscURBQU9BO0lBQ3pCLG1CQUFtQjtJQUNuQlksSUFBSUMsR0FBRyxDQUFDLFFBQVEsSUFBSTtRQUFFSSxNQUFNO1FBQUtDLFFBQVE7SUFBRTtBQUMzQywwQkFBMEI7QUFDNUIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly91Y2Rrc2VhLXdlYnNpdGUtYmFja2VuZC8uL2xpYi9hdXRoLnRzP2JmN2UiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gbGliL2F1dGgudHNcbmltcG9ydCBqd3QgZnJvbSBcImpzb253ZWJ0b2tlblwiO1xuaW1wb3J0IHsgY29va2llcyB9IGZyb20gXCJuZXh0L2hlYWRlcnNcIjtcblxuY29uc3QgSldUX1NFQ1JFVCA9IHByb2Nlc3MuZW52LkpXVF9TRUNSRVQhO1xuZXhwb3J0IHR5cGUgSnd0UGF5bG9hZCA9IHsgdWlkOiBzdHJpbmc7IGVtYWlsOiBzdHJpbmcgfTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNpZ25Ub2tlbihwYXlsb2FkOiBKd3RQYXlsb2FkKSB7XG4gIHJldHVybiBqd3Quc2lnbihwYXlsb2FkLCBKV1RfU0VDUkVULCB7IGV4cGlyZXNJbjogXCI3ZFwiIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmVyaWZ5VG9rZW4odG9rZW46IHN0cmluZyk6IEp3dFBheWxvYWQgfCBudWxsIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gand0LnZlcmlmeSh0b2tlbiwgSldUX1NFQ1JFVCkgYXMgSnd0UGF5bG9hZDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldEF1dGhDb29raWUodG9rZW46IHN0cmluZykge1xuICBjb25zdCBqYXIgPSBhd2FpdCBjb29raWVzKCk7XG4gIGphci5zZXQoXCJhdXRoXCIsIHRva2VuLCB7XG4gICAgaHR0cE9ubHk6IHRydWUsXG4gICAgc2FtZVNpdGU6IFwibGF4XCIsXG4gICAgc2VjdXJlOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIsXG4gICAgcGF0aDogXCIvXCIsXG4gICAgbWF4QWdlOiA2MCAqIDYwICogMjQgKiA3LCAvLyA3ZFxuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEF1dGhGcm9tQ29va2llKCk6IFByb21pc2U8Snd0UGF5bG9hZCB8IG51bGw+IHtcbiAgY29uc3QgamFyID0gYXdhaXQgY29va2llcygpO1xuICBjb25zdCB0b2tlbiA9IGphci5nZXQoXCJhdXRoXCIpPy52YWx1ZTtcbiAgaWYgKCF0b2tlbikgcmV0dXJuIG51bGw7XG4gIHJldHVybiB2ZXJpZnlUb2tlbih0b2tlbik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjbGVhckF1dGhDb29raWUoKSB7XG4gIGNvbnN0IGphciA9IGF3YWl0IGNvb2tpZXMoKTtcbiAgLy8gZGVsZXRlIOuYkOuKlCDrp4zro4zroZwg7KCc6rGwXG4gIGphci5zZXQoXCJhdXRoXCIsIFwiXCIsIHsgcGF0aDogXCIvXCIsIG1heEFnZTogMCB9KTtcbiAgLy8gb3I6IGphci5kZWxldGUoXCJhdXRoXCIpO1xufVxuIl0sIm5hbWVzIjpbImp3dCIsImNvb2tpZXMiLCJKV1RfU0VDUkVUIiwicHJvY2VzcyIsImVudiIsInNpZ25Ub2tlbiIsInBheWxvYWQiLCJzaWduIiwiZXhwaXJlc0luIiwidmVyaWZ5VG9rZW4iLCJ0b2tlbiIsInZlcmlmeSIsInNldEF1dGhDb29raWUiLCJqYXIiLCJzZXQiLCJodHRwT25seSIsInNhbWVTaXRlIiwic2VjdXJlIiwicGF0aCIsIm1heEFnZSIsImdldEF1dGhGcm9tQ29va2llIiwiZ2V0IiwidmFsdWUiLCJjbGVhckF1dGhDb29raWUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.ts\n");

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
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/semver","vendor-chunks/jsonwebtoken","vendor-chunks/zod","vendor-chunks/jws","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/safe-buffer","vendor-chunks/ms","vendor-chunks/lodash.once","vendor-chunks/lodash.isstring","vendor-chunks/lodash.isplainobject","vendor-chunks/lodash.isnumber","vendor-chunks/lodash.isinteger","vendor-chunks/lodash.isboolean","vendor-chunks/lodash.includes","vendor-chunks/jwa","vendor-chunks/buffer-equal-constant-time"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=%2FUsers%2Fstephanie%2FDesktop%2Fucdksea-website%2Fbackend%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fstephanie%2FDesktop%2Fucdksea-website%2Fbackend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();