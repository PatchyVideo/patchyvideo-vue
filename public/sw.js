var routeCache = {};
var cacheTime = 0;
var checkP = null;

function MakeQuerablePromise(promise) {
  if (promise.isResolved) return promise;
  var isPending = true;
  var isRejected = false;
  var isFulfilled = false;
  var result = promise.then(
    function(v) {
      isFulfilled = true;
      isPending = false;
      return v;
    },
    function(e) {
      isRejected = true;
      isPending = false;
      throw e;
    }
  );
  result.isFulfilled = function() {
    return isFulfilled;
  };
  result.isPending = function() {
    return isPending;
  };
  result.isRejected = function() {
    return isRejected;
  };
  return result;
}

function swroure(event) {
  try {
    const url = event.request.url.match(/\/\/[^/]+(\/[^.]+)/)[1];
    for (const r in routeCache) {
      try {
        if (!new RegExp(r).test(url)) continue;
        return fetch("http://127.0.0.1:15120" + url, {
          ...event.request,
          credentials: "include",
        });
      } catch (e) {
        // NOTINGTD
      }
    }
  } catch (e) {
    // NOTINGTD
  }
  return fetch(event.request);
}

this.addEventListener("fetch", function(event) {
  if (
    !(
      event.request.url.startsWith("https://thvideo.tv/") ||
      event.request.url.startsWith("https://patchyvideo.com/") ||
      event.request.url.startsWith("http://127.0.0.1")
    )
  ) {
    event.respondWith(fetch(event.request));
  } else {
    if (+new Date() - cacheTime > 5000) {
      const controller = new AbortController();
      const signal = controller.signal;
      setTimeout(() => {
        controller.abort();
      }, 200);
      if (checkP == null || !checkP.isPending()) checkP = MakeQuerablePromise(fetch("http://127.0.0.1:15120", { signal }));
      event.respondWith(
        checkP
          .then((res) => res.json())
          .then((data) => {
            data = data || {};
            routeCache = data.routeList || {};
            cacheTime = +new Date();
            return swroure(event);
          })
          .catch(() => {
            routeCache = {};
            cacheTime = +new Date() + 5000;
            return fetch(event.request);
          })
      );
    } else {
      event.respondWith(swroure(event));
    }
  }
});
