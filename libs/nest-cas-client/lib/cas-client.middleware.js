"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasClientMiddleware = void 0;
const common_1 = require("@nestjs/common");
const cas_client_service_1 = require("./cas-client.service");
const cas_client_constants_1 = require("./cas-client.constants");
let CasClientMiddleware = class CasClientMiddleware {
    constructor(options, casClient) {
        this.options = options;
        this.casClient = casClient;
    }
    getFullUrl(req) {
        const protocol = req.protocol;
        const host = req.get('host');
        const path = req.baseUrl;
        return `${protocol}://${host}${path}`;
    }
    async isUserLoggedIn(uid) {
        const sessionId = `mwp:${uid}`;
        const userInfo = await this.casClient.getSessionInfo(sessionId);
        return !!userInfo.result;
    }
    async handleTicketValidation(ticket, fullUrl, req, res) {
        const user = await this.casClient.validateTicket(ticket, fullUrl);
        this.setUserToSession(user, req);
        this.setSessionCookie(res, user);
        const cleanUrl = this.removeTicketFromUrl(fullUrl);
        return res.redirect(cleanUrl);
    }
    async setUserToSession(user, req) {
        const sessionId = `mwp:${user.userId}`;
        await this.casClient.setSessionInfo(sessionId, user);
        req.user = user;
    }
    setSessionCookie(res, user) {
        const userId = user.userId;
        if (userId) {
            res.cookie('__casuid', userId, {
                httpOnly: true,
                secure: false,
                maxAge: 1 * 60 * 60 * 1000,
            });
        }
    }
    redirectToLogin(res, fullUrl) {
        const loginUrl = this.casClient.getLoginUrl(fullUrl);
        return res.redirect(loginUrl);
    }
    async handleTgtValidation(tgt, fullUrl, req, res) {
        const st = await this.casClient.getServiceTicket(tgt, fullUrl);
        console.log('CAS Middleware - st:', st);
        const user = await this.casClient.validateTicket(st, fullUrl);
        console.log('CAS Middleware - user:', user);
        await this.setUserToSession(user, req);
        this.setSessionCookie(res, user);
        const cleanUrl = this.removeTicketFromUrl(fullUrl);
        return res.redirect(cleanUrl);
    }
    removeTicketFromUrl(url) {
        const urlObj = new URL(url);
        urlObj.searchParams.delete('ticket');
        return urlObj.toString();
    }
    async use(req, res, next) {
        const fullUrl = this.getFullUrl(req);
        try {
            console.log('CAS Middleware - fullUrl:', fullUrl);
            const casuid = req.cookies?.['__casuid'];
            if (casuid) {
                const isLogin = await this.isUserLoggedIn(casuid);
                if (isLogin) {
                    return next();
                }
            }
            console.log('CAS Middleware - no user in session');
            const ticket = req.query.ticket;
            if (ticket) {
                await this.handleTicketValidation(ticket, fullUrl, req, res);
                return;
            }
            console.log('CAS Middleware - no ticket in url');
            const tgt = req.cookies?.['__tgc'];
            console.log('CAS Middleware - __tgc:', tgt);
            if (tgt) {
                await this.handleTgtValidation(tgt, fullUrl, req, res);
                return;
            }
            console.log('CAS Middleware - no __tgc in cookie');
            this.redirectToLogin(res, fullUrl);
        }
        catch (error) {
            this.redirectToLogin(res, fullUrl);
        }
    }
};
exports.CasClientMiddleware = CasClientMiddleware;
exports.CasClientMiddleware = CasClientMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cas_client_constants_1.CAS_CLIENT_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object, cas_client_service_1.CasClientService])
], CasClientMiddleware);
//# sourceMappingURL=cas-client.middleware.js.map