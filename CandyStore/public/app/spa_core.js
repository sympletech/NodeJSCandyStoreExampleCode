﻿var Core = new (function () {
    var self = this;

    self.apiUrl = '';

    var $ContentWindow = $("#content-window"),
        loginPath = 'login',
        homePath = 'home';

    $c.DEBUG_MODE = false;

    //************************************************
    // Current User Management
    //************************************************

    self.currentUser = null;
    var authCookieName = "userinfo";

    $.cookie.json = true;
    self.loginUser = function (userDetails) {
        self.currentUser = userDetails;

        //Set Current User cookie
        var expires = (userDetails.rememberMe == true) ? 7 : 1;

        $.cookie(authCookieName, self.currentUser, { expires: expires });

        globalViewModel.currentUser(userDetails.username);

        //Check to see if there was a redirect 
        self.loadPage(homePath);
    };

    self.logoutUser = function () {
        self.currentUser = null;
        $.removeCookie(authCookieName);
        globalViewModel.currentUser(null);

        self.loadPage(loginPath);
    };

    self.getCurrentUser = function () {
        if (self.currentUser != null) {
            return self.currentUser;
        } else {
            return $.cookie(authCookieName);
        }
    };

    //************************************************
    // Page Loading and Page State
    //************************************************

    self.currentPath = null;
    self.currentPageState = null;

    //Loads Specified path's content into Content Window protects paths if no user is logged in
    self.loadPage = function (path, state, securedPage) {

        //Set current Path
        path = path ? path : homePath;
        if (securedPage == true) {
            path = (self.getCurrentUser() != null) ? path : loginPath;
        }
        $SET("@p", path, { defer: true });

        self.setPageState(state, true);

        $COMMIT();
    };

    var templateContainer = $("#template-container");
    self.loadTemplates = function (templates) {
        var deferred = Q.defer();

        templateContainer.html("");
        if (templates.length > 0) {
            var promises = [];
            _.each(templates, function (template) {
                promises.push(self.getTemplate(template));
            });
            Q.all(promises).spread(function (results) {
                deferred.resolve();
            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    };

    self.getTemplate = function (template) {
        var d = Q.defer();

        $.get('app/templates/' + template + '.html', function (data) {
            templateContainer.append(data);
            d.resolve(template);
        });
        return d.promise;
    };

    self.setPageState = function (pageState, defer) {
        if (pageState) {
            $SET("@s", encodeURI(JSON.stringify(pageState)), { defer: defer });
        } else {
            $DEL("s");
        }
        self.currentPageState = pageState;
    };

    self.updatePageState = function (updatedPageState) {
        var pageState = $.extend(self.currentPageState, updatedPageState);
        self.setPageState(pageState);
    };

    $(window).on('hashchange', function () {
        self.loadPageFromCurrentUrl();
    });

    //Load the current url 
    self.loadPageFromCurrentUrl = function () {
        var page = $GET('p');
        var state = $GET('s');

        if (state) {
            try {
                state = unescape(state);
                state = JSON.parse(state);
            } catch (e) {
            }
        }

        self.currentPageState = state;

        if (!page) {
            self.loadPage(homePath, state);
        } else if (self.currentPath != page) {
            var navigationEntry = _.findWhere(appRoutes, { path: page });
            self.loadTemplates(navigationEntry.templates).then(function () {
                self.loadPageHtml(navigationEntry);
            });
        }
    };


    self.loadPageHtml = function (navigationEntry) {
        //Load the page
        $.get("app/views/" + navigationEntry.path + ".html", function (data) {
            self.currentPath = navigationEntry.path;
            $ContentWindow.html(data);

            var vModel;
            eval('vModel = ' + navigationEntry.path + 'ViewModel;');
            if (vModel) {
                self.bindViewModel(vModel);
            }

            var pageTitle = globalViewModel.basePageTitle + " - " + navigationEntry.title;
            globalViewModel.pageTitle(pageTitle);

            _.each(globalViewModel.navigation(), function (navEntry) {
                navEntry.active(navEntry.path == navigationEntry.path);
            });
        });
    };

    self.bindViewModel = function (vModel) {
        ko.cleanNode($ContentWindow[0]);
        ko.applyBindings(new vModel(), $ContentWindow[0]);
    };


    //************************************************
    // API Methods
    //************************************************


    self.apiGet = function (endpoint, params, onSuccess, onFail) {
        return self.apiAjaxRequest("GET", endpoint, params, onSuccess, onFail);
    };

    self.apiPost = function (endpoint, params, onSuccess, onFail) {
        return self.apiAjaxRequest("POST", endpoint, params, onSuccess, onFail);
    };

    self.apiPostAsJson = function (endpoint, payloadObject, onSuccess, onFail) {
        var payloadJson = JSON.stringify(payloadObject);
        return self.apiAjaxRequest("POST", endpoint, { payload: payloadJson }, onSuccess, onFail);
    };

    self.apiAjaxRequest = function (method, endpoint, params, onSuccess, onFail) {
        self.currentUser = self.getCurrentUser();
        if (self.currentUser) {
            params = $.extend({ token: self.currentUser.token }, params);
        }

        if (self.apiUrl.endsWith("/") && endpoint.startsWith("/")) {
            endpoint = endpoint.substring(1, endpoint.length);
        }

        $.ajax({
            url: self.apiUrl + endpoint,
            type: method,
            data: params,
            success: function (data) {
                if (data.success == true) {
                    onSuccess(data.data);
                } else {
                    logit("Error : " + data.errorMessage);
                    onFail(data.errorMessage);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status == 403) {
                    self.loadPage(loginPath);
                } else {
                    logit("Error : " + errorThrown);
                    onFail(errorThrown);
                }
            }
        });
    };

    return self;
})();

$(function () {
    //Fire it off on first pass (page load) and when hash changes
    Core.loadPageFromCurrentUrl();
});