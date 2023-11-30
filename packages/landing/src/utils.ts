
export const isIntentAvailable = (ua = navigator.userAgent) => 
    /Android/i.test(ua) && 
    (
        /Version\/.+(Chrome)\/(\d+)\.(\d+)\.(\d+)\.(\d+)/i.test(ua) || 
        /; wv\).+(Chrome)\/(\d+)\.(\d+)\.(\d+)\.(\d+)/i.test(ua) || 
        ua.includes("Samsung")
    );

export const getDefaultSleepTime = () => {
    const hash = window.location.hash.slice(1)
    const milis = Number(hash)
    return isNaN(milis) ? 0 : milis
}

export const sleep = async (time: number = getDefaultSleepTime()) =>
    new Promise(resolve =>
        setTimeout(resolve, time),
    )

export type ExtractRouteParams<RoutePath extends string> =
    RoutePath extends `${string} ${infer Path}`
        ?  ExtractRouteParams<Path>
        :   RoutePath extends `${string}/:${infer Param}/${infer Rest}`
            ? {
                [Entry in Param | keyof ExtractRouteParams<`/${Rest}`>]: string;
            }
            : RoutePath extends `${string}/:${infer Param}`
                ? {
                    [Entry in Param]: string;
                }
                : never

