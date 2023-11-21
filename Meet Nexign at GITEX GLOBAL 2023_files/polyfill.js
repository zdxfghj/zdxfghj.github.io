Object.values = Object.values ? Object.values : function(obj) {
    var allowedTypes = ["[object String]", "[object Object]", "[object Array]", "[object Function]"];
    var objType = Object.prototype.toString.call(obj);

    if(obj === null || typeof obj === "undefined") {
        throw new TypeError("Cannot convert undefined or null to object");
    } else if(!~allowedTypes.indexOf(objType)) {
        return [];
    } else {
        // if ES6 is supported
        if (Object.keys) {
            return Object.keys(obj).map(function (key) {
                return obj[key];
            });
        }

        var result = [];
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                result.push(obj[prop]);
            }
        }

        return result;
    }
};

[].indexOf||(Array.prototype.indexOf=
    function(
        a, // search item
        b, // startIndex and/or counter
        c  // length placeholder
    ) {
        for (
            // initialize length
            var c = this.length,
                // initialize counter (allow for negative startIndex)
                b = (c + ~~b) % c;
            // loop if index is smaller than length,
            // index is set in (possibly sparse) array
            // and item at index is not identical to the searched one
            b < c && (!(b in this || this[b] !== a));
        // increment counter
        b++
    );
        // if counter equals length (not found), return -1, otherwise counter
        return b ^ c ? b : -1;
    });
