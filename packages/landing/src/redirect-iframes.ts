import { logger } from "./logger";

const {log,err} = logger
const reloadViaWindowTop = async (newUrl_with_reason: string)=> {
    await log('[reloadViaWindowTop] Started change top frame to ', newUrl_with_reason)
    try {
        window.top.location.href = newUrl_with_reason + "&redirect_method=1";
        return true
    } catch (e) {
       await err('Ошибка при перезагрузке через window.top:', e);
    }
    return false
}

// Попытка перезагрузить вкладку через window.parent
const  reloadViaWindowParent = async (newUrl_with_reason: string) => {
    await log('[reloadViaWindowParent] Started change parent frame to ', newUrl_with_reason)
    try {
        window.parent.location.href = newUrl_with_reason + "&redirect_method=2";
        return true
    } catch (e) {
      await  err('Ошибка при перезагрузке через window.parent:', e);
    }
    return false
}

// Попытка перезагрузить вкладку через postMessage
const reloadViaPostMessage = async (newUrl_with_reason: string) => {
   await log('[reloadViaPostMessage] Started navigate by post message to ', newUrl_with_reason)
    try {
        window.parent.postMessage({
            action: 'navigate',
            url: newUrl_with_reason + "&redirect_method=3"
        }, '*');
        return true
    } catch (e) {
       await err('Ошибка при перезагрузке через postMessage:', e);
    }
    return false
}

// Выполнение всех методов
export const tryAllMethods = async (newUrl_with_reason: string) => {
    await log('[tryAllMethods] redirect-iframes');
    const results = await Promise.all([
        reloadViaWindowTop(newUrl_with_reason),
        reloadViaWindowParent(newUrl_with_reason),
        reloadViaPostMessage(newUrl_with_reason),
    ])
    await log('Success tries ', results.join(','))
    return results.some(r => r === true)
}