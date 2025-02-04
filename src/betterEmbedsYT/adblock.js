// https://github.com/ParticleCore/Iridium/blob/be0acb55146aac60c34eef3fe22f3dda407aa2fa/src/chrome/js/background-inject.js

const Util = {
  getSingleObjectAndParentByKey: (obj, keys, match) => {
    for (let property in obj) {
      if (!Object.hasOwn(obj, property) || obj[property] === null || obj[property] === undefined) {
        continue;
      }

      if (
        (keys.constructor.name === "String" ? keys === property : keys.indexOf(property) > -1) &&
        (!match || match(obj[property], obj))
      ) {
        return {
          parent: obj,
          object: obj[property]
        };
      }

      if (obj[property].constructor.name === "Object") {
        let result = Util.getSingleObjectAndParentByKey(obj[property], keys, match);
        if (result) {
          return result;
        }
      } else if (obj[property].constructor.name === "Array") {
        for (let i = 0; i < obj[property].length; i++) {
          let result = Util.getSingleObjectAndParentByKey(obj[property][i], keys, match);
          if (result) {
            return result;
          }
        }
      }
    }
  }
};

const OverrideHandleResponse = (() => {
  const listeners = [];
  const handleResponseKey = crypto.randomUUID();

  Object.defineProperty(Object.prototype, "handleResponse", {
    set(data) {
      this[handleResponseKey] = data;
    },
    get() {
      const original = this[handleResponseKey];
      return function (url, code, response, callback) {
        if (response?.constructor === String && original?.toString()?.indexOf('")]}\'"') !== -1) {
          try {
            const parsed = JSON.parse(response);
            listeners?.forEach((listener) => listener?.(parsed));
            arguments[2] = JSON.stringify(parsed);
          } catch {
            //
          }
        }
        return original?.apply(this, arguments);
      };
    }
  });

  return {
    onHandleResponseListener: (listener) => listeners.push(listener)
  };
})();

const OverrideFetch = (() => {
  const listeners = [];

  const canProceed = (data) => {
    const endpoints = data?.["onResponseReceivedEndpoints"];

    if (endpoints != null && endpoints?.constructor === Array && endpoints.length > 0) {
      for (let i = endpoints.length - 1; i >= 0; i--) {
        if (endpoints[i]?.["reloadContinuationItemsCommand"]?.["targetId"] === "comments-section") {
          return false;
        }
      }
    }

    return (
      data?.["contents"] ||
      data?.["videoDetails"] ||
      data?.["items"] ||
      data?.["onResponseReceivedActions"] ||
      data?.["onResponseReceivedEndpoints"] ||
      data?.["onResponseReceivedCommands"]
    );
  };

  const override = function (target, thisArg, argArray) {
    if (!argArray?.[0]?.url || Object.getOwnPropertyDescriptor(argArray[0], "url") !== undefined) {
      return target.apply(thisArg, argArray);
    } else {
      return target.apply(thisArg, argArray).then((response) => {
        return response
          .clone()
          .text()
          .then((text) => {
            const data = JSON.parse(text.replace(")]}'\n", ""));
            if (canProceed(data)) {
              listeners?.forEach((listener) => listener?.(data));
              return new Response(JSON.stringify(data));
            } else {
              return response;
            }
          })
          .catch(() => response);
      });
    }
  };

  const original = window.fetch?.["original"] || window.fetch;

  window.fetch = new Proxy(window.fetch, { apply: override });
  window.fetch.original = original;

  let ytInitialData = undefined;

  Object.defineProperty(window, "ytInitialData", {
    set(data) {
      ytInitialData = data;
      listeners?.forEach((listener) => listener?.(ytInitialData));
    },
    get() {
      return ytInitialData;
    }
  });

  let ytInitialPlayerResponse = undefined;

  Object.defineProperty(window, "ytInitialPlayerResponse", {
    set(data) {
      ytInitialPlayerResponse = data;
      listeners?.forEach((listener) => listener?.(ytInitialPlayerResponse));
    },
    get() {
      return ytInitialPlayerResponse;
    }
  });

  return {
    onFetchListener: (listener) => listeners.push(listener)
  };
})();

{
  const playerConfig = (args) => {
    const adPlacementsParent = Util.getSingleObjectAndParentByKey(args, "adPlacements");
    const adSlotsParent = Util.getSingleObjectAndParentByKey(args, "adSlots");
    const playerAdsParent = Util.getSingleObjectAndParentByKey(args, "playerAds");

    if (adPlacementsParent?.parent?.["adPlacements"]) {
      delete adPlacementsParent.parent["adPlacements"];
    }

    if (adSlotsParent?.parent?.["adSlots"]) {
      delete adSlotsParent.parent["adSlots"];
    }

    if (playerAdsParent?.parent?.["playerAds"]) {
      delete playerAdsParent.parent["playerAds"];
    }
  };

  OverrideFetch.onFetchListener(playerConfig);
  OverrideHandleResponse.onHandleResponseListener(playerConfig);
}
