declare namespace UniCrazyGlobalTypes {
    interface UniCrazyRouterParams {
        passedParams?: Record<string,any>;
        routeParams?: Record<string,any>;
    }
}

declare namespace UniNamespace {
    interface RedirectToOptions extends UniCrazyGlobalTypes.UniCrazyRouterParams {}
    interface ReLaunchOptions extends UniCrazyGlobalTypes.UniCrazyRouterParams {}
    interface SwitchTabOptions extends UniCrazyGlobalTypes.UniCrazyRouterParams {}
    interface NavigateBackOptions extends UniCrazyGlobalTypes.UniCrazyRouterParams {}
    interface NavigateToOptions extends UniCrazyGlobalTypes.UniCrazyRouterParams {}
}

import UniApp = UniNamespace