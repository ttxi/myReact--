window._mda_ahas = window._mda_ahas || []
window._AHAS_OBJ = window._AHAS_OBJ || {}

if (window._trackPVTrigger) {
  // track pv by trigger, cancel auto send
} else {
  _mda_ahas.push(["_trackPageInit"])
  _mda_ahas.push(["_trackPageView"])
}

window._ahas_all_config = window._ahas_all_config || {
  allClick: false,
  allShow: false
}
if (_ahas_all_config.allClick) {
  _mda_ahas.push(["_trackAllClick"])
}
if (_ahas_all_config.allShow) {
  _mda_ahas.push(["_trackAllShow"])
}

if (typeof Array.prototype.indexOf !== "function") {
  Array.prototype.indexOf = function (item) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] == item) return i
    }
    return -1
  }
}

if (typeof JSON !== "object") {
  JSON = {}
}

;(function () {
  "use strict"

  var rx_one = /^[\],:{}\s]*$/
  var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g
  var rx_three =
    /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g
  var rx_four = /(?:^|:|,)(?:\s*\[)+/g
  var rx_escapable =
    /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g
  var rx_dangerous =
    /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g

  function f(n) {
    // Format integers to have at least two digits.
    return n < 10 ? "0" + n : n
  }

  function this_value() {
    return this.valueOf()
  }

  if (typeof Date.prototype.toJSON !== "function") {
    Date.prototype.toJSON = function () {
      return isFinite(this.valueOf())
        ? this.getUTCFullYear() +
            "-" +
            f(this.getUTCMonth() + 1) +
            "-" +
            f(this.getUTCDate()) +
            "T" +
            f(this.getUTCHours()) +
            ":" +
            f(this.getUTCMinutes()) +
            ":" +
            f(this.getUTCSeconds()) +
            "Z"
        : null
    }

    Boolean.prototype.toJSON = this_value
    Number.prototype.toJSON = this_value
    String.prototype.toJSON = this_value
  }

  var gap
  var indent
  var meta
  var rep

  function quote(string) {
    // If the string contains no control characters, no quote characters, and no
    // backslash characters, then we can safely slap some quotes around it.
    // Otherwise we must also replace the offending characters with safe escape
    // sequences.

    rx_escapable.lastIndex = 0
    return rx_escapable.test(string)
      ? '"' +
          string.replace(rx_escapable, function (a) {
            var c = meta[a]
            return typeof c === "string"
              ? c
              : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
          }) +
          '"'
      : '"' + string + '"'
  }

  function str(key, holder) {
    // Produce a string from holder[key].

    var i // The loop counter.
    var k // The member key.
    var v // The member value.
    var length
    var mind = gap
    var partial
    var value = holder[key]

    // If the value has a toJSON method, call it to obtain a replacement value.

    if (
      value &&
      typeof value === "object" &&
      typeof value.toJSON === "function"
    ) {
      value = value.toJSON(key)
    }

    // If we were called with a replacer function, then call the replacer to
    // obtain a replacement value.

    if (typeof rep === "function") {
      value = rep.call(holder, key, value)
    }

    // What happens next depends on the value's type.

    switch (typeof value) {
      case "string":
        return quote(value)

      case "number":
        // JSON numbers must be finite. Encode non-finite numbers as null.

        return isFinite(value) ? String(value) : "null"

      case "boolean":
      case "null":
        // If the value is a boolean or null, convert it to a string. Note:
        // typeof null does not produce "null". The case is included here in
        // the remote chance that this gets fixed someday.

        return String(value)

      // If the type is "object", we might be dealing with an object or an array or
      // null.

      case "object":
        // Due to a specification blunder in ECMAScript, typeof null is "object",
        // so watch out for that case.

        if (!value) {
          return "null"
        }

        // Make an array to hold the partial results of stringifying this object value.

        gap += indent
        partial = []

        // Is the value an array?

        if (Object.prototype.toString.apply(value) === "[object Array]") {
          // The value is an array. Stringify every element. Use null as a placeholder
          // for non-JSON values.

          length = value.length
          for (i = 0; i < length; i += 1) {
            partial[i] = str(i, value) || "null"
          }

          // Join all of the elements together, separated with commas, and wrap them in
          // brackets.

          v =
            partial.length === 0
              ? "[]"
              : gap
              ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]"
              : "[" + partial.join(",") + "]"
          gap = mind
          return v
        }

        // If the replacer is an array, use it to select the members to be stringified.

        if (rep && typeof rep === "object") {
          length = rep.length
          for (i = 0; i < length; i += 1) {
            if (typeof rep[i] === "string") {
              k = rep[i]
              v = str(k, value)
              if (v) {
                partial.push(quote(k) + (gap ? ": " : ":") + v)
              }
            }
          }
        } else {
          // Otherwise, iterate through all of the keys in the object.

          for (k in value) {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              v = str(k, value)
              if (v) {
                partial.push(quote(k) + (gap ? ": " : ":") + v)
              }
            }
          }
        }

        // Join all of the member texts together, separated with commas,
        // and wrap them in braces.

        v =
          partial.length === 0
            ? "{}"
            : gap
            ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
            : "{" + partial.join(",") + "}"
        gap = mind
        return v
    }
  }

  // If the JSON object does not yet have a stringify method, give it one.

  if (typeof JSON.stringify !== "function") {
    meta = {
      // table of character substitutions
      "\b": "\\b",
      "\t": "\\t",
      "\n": "\\n",
      "\f": "\\f",
      "\r": "\\r",
      '"': '\\"',
      "\\": "\\\\"
    }
    JSON.stringify = function (value, replacer, space) {
      // The stringify method takes a value and an optional replacer, and an optional
      // space parameter, and returns a JSON text. The replacer can be a function
      // that can replace values, or an array of strings that will select the keys.
      // A default replacer method can be provided. Use of the space parameter can
      // produce text that is more easily readable.

      var i
      gap = ""
      indent = ""

      // If the space parameter is a number, make an indent string containing that
      // many spaces.

      if (typeof space === "number") {
        for (i = 0; i < space; i += 1) {
          indent += " "
        }

        // If the space parameter is a string, it will be used as the indent string.
      } else if (typeof space === "string") {
        indent = space
      }

      // If there is a replacer, it must be a function or an array.
      // Otherwise, throw an error.

      rep = replacer
      if (
        replacer &&
        typeof replacer !== "function" &&
        (typeof replacer !== "object" || typeof replacer.length !== "number")
      ) {
        throw new Error("JSON.stringify")
      }

      // Make a fake root object containing our value under the key of "".
      // Return the result of stringifying the value.

      return str("", {
        "": value
      })
    }
  }

  // If the JSON object does not yet have a parse method, give it one.

  if (typeof JSON.parse !== "function") {
    JSON.parse = function (text, reviver) {
      // The parse method takes a text and an optional reviver function, and returns
      // a JavaScript value if the text is a valid JSON text.

      var j

      function walk(holder, key) {
        // The walk method is used to recursively walk the resulting structure so
        // that modifications can be made.

        var k
        var v
        var value = holder[key]
        if (value && typeof value === "object") {
          for (k in value) {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              v = walk(value, k)
              if (v !== undefined) {
                value[k] = v
              } else {
                delete value[k]
              }
            }
          }
        }
        return reviver.call(holder, key, value)
      }

      // Parsing happens in four stages. In the first stage, we replace certain
      // Unicode characters with escape sequences. JavaScript handles many characters
      // incorrectly, either silently deleting them, or treating them as line endings.

      text = String(text)
      rx_dangerous.lastIndex = 0
      if (rx_dangerous.test(text)) {
        text = text.replace(rx_dangerous, function (a) {
          return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        })
      }

      // In the second stage, we run the text against regular expressions that look
      // for non-JSON patterns. We are especially concerned with "()" and "new"
      // because they can cause invocation, and "=" because it can cause mutation.
      // But just to be safe, we want to reject all unexpected forms.

      // We split the second stage into 4 regexp operations in order to work around
      // crippling inefficiencies in IE's and Safari's regexp engines. First we
      // replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
      // replace all simple value tokens with "]" characters. Third, we delete all
      // open brackets that follow a colon or comma or that begin the text. Finally,
      // we look to see that the remaining characters are only whitespace or "]" or
      // "," or ":" or "{" or "}". If that is so, then the text is safe for eval.

      if (
        rx_one.test(
          text.replace(rx_two, "@").replace(rx_three, "]").replace(rx_four, "")
        )
      ) {
        // In the third stage we use the eval function to compile the text into a
        // JavaScript structure. The "{" operator is subject to a syntactic ambiguity
        // in JavaScript: it can begin a block or an object literal. We wrap the text
        // in parens to eliminate the ambiguity.

        j = eval("(" + text + ")")

        // In the optional fourth stage, we recursively walk the new structure, passing
        // each name/value pair to a reviver function for possible transformation.

        return typeof reviver === "function"
          ? walk(
              {
                "": j
              },
              ""
            )
          : j
      }

      // If the text is not JSON parseable, then a SyntaxError is thrown.

      throw new SyntaxError("JSON.parse")
    }
  }
})()

;(function () {
  var _version_ = "20190320"

  var CreateBinder = function (o) {
      return function (method, func) {
        o[method] = function () {
          return func.apply(o, arguments)
        }
        return func
      }
    },
    IsArray = function (o) {
      return Object.prototype["toString"].call(Object(o)) == "[object Array]"
    },
    IsEmpty = function (o) {
      return undefined == o || "-" == o || "" == o
    },
    Encode = function (uri, isAll) {
      var _encode = encodeURIComponent
      if (_encode instanceof Function) {
        return isAll ? encodeURI(uri) : encodeURIComponent(uri)
      } else {
        return escape(uri)
      }
    },
    UUID = function () {
      var s = []
      var hexDigits = "0123456789ABCDEF"
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = "4" // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-"

      var uuid = s.join("")
      return uuid
    },
    AddListener = function (element, type, listener, useCapture) {
      if (element.addEventListener) {
        element.addEventListener(type, listener, !!useCapture)
      } else if (element.attachEvent) {
        element.attachEvent("on" + type, listener)
      } else {
        element["on" + type] = listener
      }
    }

  var Tracker = function (name) {
    var oThis = this,
      bind = CreateBinder(oThis),
      config = new Config()

    oThis.name = name

    oThis.client = new Client()
    oThis.ahAjax = new AHAjax()
    oThis.ahCookie = new AHCookie(config)
    oThis.ahUtil = new AHUtil()

    // mark pvareaid chains
    var url_pvareaid = 0
    var cookie_pvareaids = ""

    try {
      url_pvareaid = oThis.ahUtil.getPVAreaId(window.location)
      if (url_pvareaid && url_pvareaid > 0) {
        cookie_pvareaids = oThis.ahCookie.readCookie("pvidchain")
        if (IsEmpty(cookie_pvareaids)) {
          cookie_pvareaids = url_pvareaid
        } else {
          cookie_pvareaids += "," + url_pvareaid
          var count = cookie_pvareaids.match(/,/g).length
          if (count > 9) {
            var pos = cookie_pvareaids.indexOf(",")
            cookie_pvareaids = cookie_pvareaids.substr(pos + 1)
          }
        }
        oThis.ahCookie.setCookie("pvidchain", cookie_pvareaids, 1800)
      } else {
        cookie_pvareaids = oThis.ahCookie.readCookie("pvidchain")
      }
    } catch (e) {
      cookie_pvareaids = "err"
    }

    // uuid
    var auto_session_id = oThis.ahCookie.readCookie("sessionid")
    var ah_uuid = oThis.ahCookie.readCookie("__ah_uuid_ng")
    var club_user_show = oThis.ahCookie.readCookie("clubUserShow")

    if (IsEmpty(ah_uuid)) {
      if (IsEmpty(club_user_show)) {
        ah_uuid = auto_session_id ? "c_" + auto_session_id.split("||")[0] : ""
        oThis.ahCookie.setCookie("__ah_uuid_ng", ah_uuid, 24 * 3600 * 365 * 10)
      } else {
        ah_uuid = "u_" + club_user_show.split("|")[0]
        oThis.ahCookie.setCookie("__ah_uuid_ng", ah_uuid, 24 * 3600 * 365 * 10)
      }
    } else {
      if (club_user_show && ah_uuid != "u_" + club_user_show) {
        ah_uuid = "u_" + club_user_show.split("|")[0]
        oThis.ahCookie.setCookie("__ah_uuid_ng", ah_uuid, 24 * 3600 * 365 * 10)
      }
    }

    oThis.getSign = function () {
      if (IsEmpty(window.pageLoadId)) {
        return "noloadid"
      }
      return [
        window.pageLoadId.substring(2, 10) >> 3,
        Math.random().toString().substring(2, 5)
      ].join("")
    }

    oThis.getNessInfo = function () {
      return (
        "ahpvers=" +
        _version_ +
        "&ahpplid=" +
        window.pageLoadId +
        "&ahpprlid=" +
        window.rPageLoadId +
        "&ahpsign=" +
        oThis.getSign()
      )
    }

    oThis.getPageInfo = function () {
      var scene_type =
        oThis.ahUtil.parseUri(window.location)["queryKey"]["scene_type"] || "0"
      var show_id =
        oThis.ahUtil.parseUri(window.location)["queryKey"]["show_id"] || "0"

      return (
        "&ref=" +
        Encode(document.referrer) +
        "&cur=" +
        Encode(document.URL) +
        "&scene_type=" +
        scene_type +
        "&show_id=" +
        show_id
      )
    }

    oThis.getRefAndCur = function () {
      return (
        "&ref=" + Encode(document.referrer) + "&cur=" + Encode(document.URL)
      )
    }

    oThis.getPVTrackerInfo = function () {
      if (!IsEmpty(window.pvTrack)) {
        var t = window.pvTrack

        var pgvar = {}
        if (t.type != null) pgvar["type"] = t.type
        if (t.typeid != null) pgvar["typeid"] = t.typeid
        if (t.abtest != null) pgvar["abtest"] = t.abtest
        if (t.bcTypeId != null) pgvar["bcTypeId"] = t.bcTypeId
        if (t.site_ref != null) pgvar["site_ref"] = t.site_ref
        if (!IsEmpty(cookie_pvareaids)) pgvar["pvidchain"] = cookie_pvareaids
        pgvar["ah_uuid"] = ah_uuid

        var _vs = t.pageVars
        if (_vs != null) {
          for (var key in _vs) {
            pgvar[key] = _vs[key]
          }
        }

        return (
          (t.site != null ? "&site=" + t.site : "") +
          (t.category != null ? "&category=" + t.category : "") +
          (t.subcategory != null ? "&subcategory=" + t.subcategory : "") +
          (t.object != null
            ? "&object=" + t.object
            : t.objectid != null
            ? "&object=" + t.objectid
            : "") +
          (t.series != null
            ? "&series=" + t.series
            : t.seriesid != null
            ? "&series=" + t.seriesid
            : "") +
          (t.spec != null
            ? "&spec=" + t.spec
            : t.specid != null
            ? "&spec=" + t.specid
            : "") +
          (t.level != null ? "&level=" + t.level : "") +
          (t.dealer != null ? "&dealer=" + t.dealer : "") +
          "&pgvar=" +
          Encode(JSON.stringify(pgvar))
        )
      }

      var pgvar = {}
      if (!IsEmpty(cookie_pvareaids)) pgvar["pvidchain"] = cookie_pvareaids
      pgvar["ah_uuid"] = ah_uuid

      return "&pgvar=" + Encode(JSON.stringify(pgvar))
    }

    oThis.getPassivePVTrackerInfo = function (_track) {
      if (!IsEmpty(_track)) {
        var t = _track

        var pgvar = {}
        if (t.type != null) pgvar["type"] = t.type
        if (t.typeid != null) pgvar["typeid"] = t.typeid
        if (t.abtest != null) pgvar["abtest"] = t.abtest
        if (t.bcTypeId != null) pgvar["bcTypeId"] = t.bcTypeId
        if (t.site_ref != null) pgvar["site_ref"] = t.site_ref
        if (!IsEmpty(cookie_pvareaids)) pgvar["pvidchain"] = cookie_pvareaids
        pgvar["ah_uuid"] = ah_uuid

        var _vs = t.pageVars
        if (_vs != null) {
          for (var key in _vs) {
            pgvar[key] = _vs[key]
          }
        }

        return (
          (t.site != null ? "&site=" + t.site : "") +
          (t.category != null ? "&category=" + t.category : "") +
          (t.subcategory != null ? "&subcategory=" + t.subcategory : "") +
          (t.object != null
            ? "&object=" + t.object
            : t.objectid != null
            ? "&object=" + t.objectid
            : "") +
          (t.series != null
            ? "&series=" + t.series
            : t.seriesid != null
            ? "&series=" + t.seriesid
            : "") +
          (t.spec != null
            ? "&spec=" + t.spec
            : t.specid != null
            ? "&spec=" + t.specid
            : "") +
          (t.level != null ? "&level=" + t.level : "") +
          (t.dealer != null ? "&dealer=" + t.dealer : "") +
          "&pgvar=" +
          Encode(JSON.stringify(pgvar))
        )
      }

      var pgvar = {}
      if (!IsEmpty(cookie_pvareaids)) pgvar["pvidchain"] = cookie_pvareaids
      pgvar["ah_uuid"] = ah_uuid

      return "&pgvar=" + Encode(JSON.stringify(pgvar))
    }

    oThis.getSiteInfo = function () {
      if (!IsEmpty(window.pvTrack)) {
        var t = window.pvTrack
        return (
          (t.site != null ? "&site=" + t.site : "") +
          (t.category != null ? "&category=" + t.category : "") +
          (t.subcategory != null ? "&subcategory=" + t.subcategory : "") +
          (t.object != null
            ? "&object=" + t.object
            : t.objectid != null
            ? "&object=" + t.objectid
            : "")
        )
      }
      return ""
    }

    oThis.trackerPageView = bind("_trackPageView", function () {
      var sendPVDelay = function () {
        var fvlid = oThis.ahCookie.readCookie("fvlid")
        var pvDelayPath =
          config.pvDelayPath +
          oThis.getNessInfo() +
          oThis.getPageInfo() +
          oThis.getPVTrackerInfo() +
          oThis.client.getClientInfo() +
          "&fvlid=" +
          Encode(fvlid)
        oThis.ahAjax.sendByImage(config.alPath + pvDelayPath)
      }
      setTimeout(sendPVDelay, 3000)
    })

    oThis.trackerPageInit = bind("_trackPageInit", function () {
      var fvlid = oThis.ahCookie.readCookie("fvlid")
      if (IsEmpty(fvlid)) {
        fvlid = window.pageLoadId
        oThis.ahCookie.setCookie("fvlid", fvlid, 10 * 365 * 24 * 60 * 60)
      }

      var pvInitPath =
        config.pvInitPath +
        oThis.getNessInfo() +
        oThis.getPageInfo() +
        oThis.getPVTrackerInfo() +
        oThis.client.getClientInfo() +
        "&fvlid=" +
        Encode(fvlid)
      oThis.ahAjax.sendByImage(config.alPath + pvInitPath)
    })

    oThis.trackPageInitPassive = bind("_trackPageInitPassive", function () {
      window.rPageLoadId = window.pageLoadId
      window.pageLoadId = getBodyLoadId(10)

      var _pvTrack = arguments[0] ? arguments[0] : {}
      var pageVars = _pvTrack["pageVars"] ? _pvTrack["pageVars"] : {}
      pageVars["passive"] = "1"
      _pvTrack["pageVars"] = pageVars
      var fvlid = oThis.ahCookie.readCookie("fvlid")
      var pvDelayPath =
        config.pvInitPath +
        oThis.getNessInfo() +
        oThis.getPageInfo() +
        oThis.getPassivePVTrackerInfo(_pvTrack) +
        oThis.client.getClientInfo() +
        "&fvlid=" +
        Encode(fvlid)
      oThis.ahAjax.sendByImage(config.alPath + pvDelayPath)
    })

    oThis.trackPageViewPassive = bind("_trackPageViewPassive", function () {
      var _pvTrack = arguments[0] ? arguments[0] : {}
      var pageVars = _pvTrack["pageVars"] ? _pvTrack["pageVars"] : {}
      pageVars["passive"] = "1"
      _pvTrack["pageVars"] = pageVars

      var fvlid = oThis.ahCookie.readCookie("fvlid")
      var pvDelayPath =
        config.pvDelayPath +
        oThis.getNessInfo() +
        oThis.getPageInfo() +
        oThis.getPassivePVTrackerInfo(_pvTrack) +
        oThis.client.getClientInfo() +
        "&fvlid=" +
        Encode(fvlid)
      oThis.ahAjax.sendByImage(config.alPath + pvDelayPath)
    })

    oThis.trackerEvent = bind("_trackEvent", function () {
      var _arguments = arguments
      var _category = arguments[0]
      var _params = arguments[1]

      var eventPath =
        _category + "?" + oThis.getNessInfo() + oThis.getSiteInfo()
      if (!IsEmpty(_params)) {
        for (var _key in _params) {
          eventPath += "&" + _key + "=" + _params[_key]
        }
      }

      eventPath += oThis.getRefAndCur()

      if (arguments.length > 2 && !IsEmpty(arguments[2])) {
        var _extends = JSON.stringify(arguments[2])
        eventPath += "&evextends=" + _extends
      }

      oThis.ahAjax.sendByImage(config.alPath + eventPath)
    })

    oThis.trackerEventPath = bind("_trackerEventPath", function () {
      return oThis.getNessInfo() + oThis.getSiteInfo() + oThis.getRefAndCur()
    })

    window._AHAS_OBJ.trackerEventPath = oThis.trackerEventPath

    oThis.bindDataClickListenner = function () {
      AddListener(
        document,
        "click",
        function (e) {
          oThis.sendEventTarget(e)
        },
        true
      )
    }

    var pather = (function () {
      function e(e) {
        var t,
          r,
          o =
            /(^| )(clear|clearfix|active|hover|enabled|hidden|display|focus|disabled)[^\. ]*/g
        ;(this.node = e),
          (this.name = e.tagName.toLowerCase()),
          (t =
            null != (r = e.getAttribute("class")) ? r.replace(o, "") : void 0),
          (null != t ? t.length : void 0) > 0 &&
            (this.klass = t.split(/\s+/).sort()),
          xpath.hasAttr(e, "id") &&
            null === e.getAttribute("id").match(/^[0-9]/) &&
            (this.id = e.getAttribute("id")),
          xpath.hasAttr(e, "href") && (this.href = e.getAttribute("href"))
      }

      return (
        (e.prototype.path = function () {
          var e, t, r, n, i
          if (
            ((n = "/" + this.name),
            null != this.id && (n += "#" + this.id),
            null != this.klass)
          )
            for (i = this.klass, e = 0, r = i.length; r > e; e++)
              (t = i[e]), (n += "." + t)
          return n
        }),
        e
      )
    })()
    var duplicate = ["TR", "LI", "DL"]
    var xpath = {
      path: function (e) {
        var t, r, n, o
        for (
          r = "", t = new pather(e);
          "body" !== t.name &&
          "html" !== t.name &&
          ((n = t.path()),
          (r = n + r),
          (o = t.node.parentNode),
          o && o.tagName);

        )
          t = new pather(o)
        return r
      },
      index: function (e) {
        var t, r, n, i, o, a, s
        for (
          o = e;
          o &&
          "BODY" !== o.tagName &&
          -1 === xpath.indexOf(duplicate, o.tagName);

        )
          o = o.parentNode
        if (o)
          for (
            a = o.parentNode, r = 1, s = a.childNodes, t = 0, n = s.length;
            n > t;
            t++
          )
            if (((i = s[t]), i.tagName === o.tagName)) {
              if (i === o) {
                return r
              }
              r += 1
            }
      },
      hasAttr: function (e, t) {
        return e.hasAttribute ? e.hasAttribute(t) : !!e[t]
      },
      indexOf: function (e, t) {
        var r, n, i
        if (null != Array.prototype.indexOf) return e.indexOf(t)
        for (n = e.length, r = -1; ++r < n; )
          if (((i = e[r]), i === t)) return r
        return -1
      }
    }

    oThis.sendEventTarget = function (e) {
      var ev = e || window.event
      var element = ev.target || ev.srcElement
      if (!element) return

      var _target_path = xpath.path(element)
      var _target_index = xpath.index(element)

      var _target_tag = IsEmpty(element.tagName)
        ? ""
        : element.tagName.toLowerCase()
      var _target_id = IsEmpty(element.id) ? "" : element.id
      var _target_name = IsEmpty(element.name) ? "" : element.name
      var _target_title = IsEmpty(element.title) ? "" : element.title
      var _target_href = IsEmpty(element.href) ? "" : element.href
      var _target_value = IsEmpty(element.value) ? "" : element.value

      var _target_content = ""
      if (element.childNodes && element.childNodes.length == 1) {
        _target_content = IsEmpty(element.innerHTML)
          ? ""
          : element.innerHTML.substring(0, 64)
      }

      var scrollX =
        document.documentElement.scrollLeft || document.body.scrollLeft
      var scrollY =
        document.documentElement.scrollTop || document.body.scrollTop
      var _scroll_xy = scrollX + "," + scrollY

      var _show_rect = ""
      var _bound_rect = element.getBoundingClientRect()
      if (!IsEmpty(_bound_rect)) {
        _show_rect =
          Math.round(_bound_rect.left) +
          "," +
          Math.round(_bound_rect.top) +
          "," +
          Math.round(_bound_rect.width) +
          "," +
          Math.round(_bound_rect.height)
      }

      var params = "&evtype=click"
      params +=
        "&tg" +
        [
          "path=" + Encode(_target_path),
          "index=" + Encode(_target_index),
          "tag=" + Encode(_target_tag),
          "id=" + Encode(_target_id),
          "name=" + Encode(_target_name),
          "title=" + Encode(_target_title),
          "href=" + Encode(_target_href),
          "value=" + Encode(_target_value),
          "content=" + Encode(_target_content)
        ]["join"]("&tg")
      params += "&scrollxy=" + _scroll_xy + "&tgrect=" + _show_rect

      if (!IsEmpty(window.pvTrack)) {
        var t = {
          site: window.pvTrack.site,
          category: window.pvTrack.category,
          subcategory: window.pvTrack.subcategory
        }
        params += "&pvtrack=" + Encode(JSON.stringify(t))
      }

      var clickPath =
        config.alPath +
        config.allClickPath +
        oThis.getNessInfo() +
        oThis.getRefAndCur() +
        params
      oThis.ahAjax.sendByImage(clickPath)
    }

    oThis.trackAllClick = bind("_trackAllClick", function () {
      oThis.bindDataClickListenner()
    })

    var hasBindScroll = false
    var checkVisShowEles = []
    var computeVisTimer
    oThis.bindDataShowListenner = function () {
      if (hasBindScroll !== true) {
        AddListener(window, "scroll", function () {
          oThis.computeVisShow()
        })
        hasBindScroll = true
      }
    }

    oThis.computeVisShow = function () {
      function compute() {
        if (checkVisShowEles && checkVisShowEles.length > 0) {
          var len = checkVisShowEles.length
          var item
          for (var i = 0; i < len; i++) {
            item = checkVisShowEles[i]
            if (item && oThis.isVisible(item) && oThis.isInViewport(item)) {
              oThis.sendShowTarget(item)
              checkVisShowEles[i] = null
            }
          }
        }
      }

      computeVisTimer && clearTimeout(computeVisTimer)
      computeVisTimer = setTimeout(compute, 200)
    }

    oThis.isVisible = function (ele) {
      return (
        "none" !== ele.style.display &&
        "hidden" !== ele.style.visibility &&
        "0" !== ele.style.opacity &&
        0 !== ele.offsetHeight &&
        0 !== ele.offsetWidth
      )
    }

    oThis.isInViewport = function (ele) {
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      var winHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight
      var clientTop =
        document.documentElement.clientTop || document.body.clientTop
      var rect = ele.getBoundingClientRect()
      var elemTop = rect.top + scrollTop - clientTop

      return elemTop >= scrollTop && elemTop <= scrollTop + winHeight
    }

    oThis.sendShowTarget = function (trigger) {
      var element = trigger

      if (!element) return

      var _target_path = xpath.path(element)
      var _target_index = xpath.index(element)

      var _target_tag = IsEmpty(element.tagName)
        ? ""
        : element.tagName.toLowerCase()
      var _target_id = IsEmpty(element.id) ? "" : element.id
      var _target_name = IsEmpty(element.name) ? "" : element.name
      var _target_title = IsEmpty(element.title) ? "" : element.title
      var _target_value = IsEmpty(element.value) ? "" : element.value

      var scrollX =
        document.documentElement.scrollLeft || document.body.scrollLeft
      var scrollY =
        document.documentElement.scrollTop || document.body.scrollTop
      var _scroll_xy = scrollX + "," + scrollY

      var _show_rect = ""
      var _bound_rect = element.getBoundingClientRect()
      if (!IsEmpty(_bound_rect)) {
        _show_rect =
          Math.round(_bound_rect.left) +
          "," +
          Math.round(_bound_rect.top) +
          "," +
          Math.round(_bound_rect.width) +
          "," +
          Math.round(_bound_rect.height)
      }

      var params = "&evtype=show"
      params +=
        "&tg" +
        [
          "path=" + Encode(_target_path),
          "index=" + Encode(_target_index),
          "tag=" + Encode(_target_tag),
          "id=" + Encode(_target_id),
          "name=" + Encode(_target_name),
          "title=" + Encode(_target_title),
          "value=" + Encode(_target_value)
        ]["join"]("&tg")
      params += "&scrollxy=" + _scroll_xy + "&tgrect=" + _show_rect

      if (!IsEmpty(window.pvTrack)) {
        var t = {
          site: window.pvTrack.site,
          category: window.pvTrack.category,
          subcategory: window.pvTrack.subcategory
        }
        params += "&pvtrack=" + Encode(JSON.stringify(t))
      }

      var showPath =
        config.alPath +
        config.allShowPath +
        oThis.getNessInfo() +
        oThis.getRefAndCur() +
        params
      oThis.ahAjax.sendByImage(showPath)
    }

    oThis.trackAllShow = bind("_trackAllShow", function () {
      var bindVisElements = document.querySelectorAll(".ahas-all-show")
      if (bindVisElements != null && bindVisElements.length > 0) {
        var trigger
        for (var i = 0; i < bindVisElements.length; i++) {
          trigger = bindVisElements[i]
          checkVisShowEles.push(trigger)
        }
      }
      oThis.computeVisShow()
      oThis.bindDataShowListenner()
    })
  }

  var AHAjax = function () {
    var oThis = this
    oThis.sendByImage = function (src) {
      var image = new Image(1, 1)
      image.onload = image.onerror = function () {
        image.onload = image.onerror = null
        image = null
      }
      image.src = src
    }
  }

  var AHCookie = function (config) {
    var oThis = this,
      _config = config,
      _path = "/"

    oThis.readCookie = function (key) {
      var reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)")
      var r = document.cookie.match(reg)
      if (r != null) {
        return decodeURIComponent(r[2])
      }
      return ""
    }

    oThis.setCookie = function (key, value, timeout) {
      var cookie = timeout > 0 ? oThis.getCookieExpires(timeout) : ""
      key = key + "=" + value
      if (key.length > 256) {
        key = key.substring(0, 256)
      }
      cookie =
        key +
        "; path=" +
        _path +
        "; " +
        cookie +
        "domain=" +
        _config.domain +
        ";"
      document.cookie = cookie
    }

    oThis.getCookieExpires = function (timeout) {
      var date = new Date()
      timeout = new Date(date.getTime() + timeout * 1000)
      return "expires=" + timeout.toGMTString() + "; "
    }
  }

  var AHUtil = function () {
    var oThis = this

    oThis.getPVAreaId = function (url) {
      var ah_pvareaid = 0
      var reg = new RegExp("(^|&|#)pvareaid=([0-9]*)", "i")
      var r = url.search.substr(1).match(reg)
      if (r != null) {
        ah_pvareaid = unescape(r[2])
      }
      r = url.hash.substr(1).match(reg)
      if (r != null) {
        ah_pvareaid = unescape(r[2])
      }
      return ah_pvareaid
    }

    oThis.parseUri = function (str) {
      var o = oThis.parseUri.options,
        m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
        uri = {},
        i = 14

      while (i--) uri[o.key[i]] = m[i] || ""

      uri[o.q.name] = {}
      uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
        if ($1) uri[o.q.name][$1] = $2
      })

      return uri
    }

    oThis.parseUri.options = {
      strictMode: true,
      key: [
        "source",
        "protocol",
        "authority",
        "userInfo",
        "user",
        "password",
        "host",
        "port",
        "relative",
        "path",
        "directory",
        "file",
        "query",
        "anchor"
      ],
      q: {
        name: "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
      },
      parser: {
        strict:
          /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose:
          /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
      }
    }
  }

  var Client = function () {
    var oThis = this,
      _empty = "-",
      screen = window.screen,
      navigator = window.navigator

    oThis.screen = screen ? screen.width + "x" + screen.height : _empty
    oThis.colorDepth = screen ? screen.colorDepth + "-bit" : _empty
    oThis.charset = Encode(
      document.characterSet
        ? document.characterSet
        : document.charset
        ? document.charset
        : _empty
    )
    oThis.language = (
      navigator && navigator.language
        ? navigator.language
        : navigator && navigator.browserLanguage
        ? navigator.browserLanguage
        : _empty
    )["toLowerCase"]()
    oThis.cookieEnabled = navigator && navigator.cookieEnabled ? 1 : 0
    oThis.docTitle = document.title ? document.title.substring(0, 126) : ""

    oThis.getClientInfo = function () {
      return (
        "&ahp" +
        [
          "cs=" + Encode(oThis.charset),
          "sr=" + oThis.screen,
          "sc=" + oThis.colorDepth,
          "ul=" + oThis.language,
          "ce=" + oThis.cookieEnabled,
          "dtl=" + Encode(oThis.docTitle)
        ]["join"]("&ahp")
      )
    }
  }

  var Config = function () {
    var oThis = this
    oThis.domain = ".autohome.com.cn"

    if ("https:" == document.location.protocol)
      oThis.alPath = "https://al.autohome.com.cn/"
    else oThis.alPath = "http://al.autohome.com.cn/"

    oThis.pvInitPath = "mda_pv_init?"
    oThis.pvDelayPath = "mda_pv_log?"
    oThis.allClickPath = "page_all_click?"
    oThis.allShowPath = "page_all_vis_show?"
  }

  var AsyncTrackerFactory = function () {
    var oThis = this,
      bind = CreateBinder(oThis)

    oThis.defaultTracker = new Tracker("default")

    oThis.push = function (commandArray) {
      for (
        var _arguments = arguments, err = 0, i = 0;
        i < _arguments.length;
        i++
      ) {
        try {
          if (typeof _arguments[i] === "function") {
            _arguments[i]()
          } else {
            var o = _arguments[i][0],
              func = o
            var oTracker = oThis.defaultTracker
            oTracker[func].apply(oTracker, _arguments[i].slice(1))
          }
        } catch (ex) {
          console.log(ex)
          err++
        }
      }
      return err
    }
  }

  function getBodyLoadId(len) {
    var randchar = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z"
    ]
    var i = 0
    var r = ""
    for (i = 0; i < len; i++) {
      var index = parseInt(Math.random() * Math.pow(10, 6)) % randchar.length
      r += randchar[index]
    }
    var d = new Date()
    return d.getTime() + r
  }

  if (IsEmpty(window.pageLoadId)) {
    try {
      window.pageLoadId = getBodyLoadId(9) + "_"
    } catch (e) {
      window.pageLoadId = new Date().getTime() + "_aaaaaaaa_"
    }
  }

  var _AsyncTrackerFactory = new AsyncTrackerFactory()

  _tracker_: {
    var ahas = window._mda_ahas,
      isArray = false
    if (ahas && typeof ahas["push"] == "function") {
      isArray = IsArray(ahas)
      if (!isArray) {
        break _tracker_
      }
    }
    window._mda_ahas = _AsyncTrackerFactory
    isArray && _AsyncTrackerFactory["push"].apply(_AsyncTrackerFactory, ahas)
  }
})()
