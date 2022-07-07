const xss = require('xss');

let xssFilter = new xss.FilterXSS({
    whiteList: {
        a: ["href", "title", "target"],
        img: ["src", "alt"],
        input: ["type", "checked", "disabled"],
        div: [],
        tbody: [],
        table: [],
        colgroup: [],
        th: ["colspan", "rowspan", "width"],
        td: ["colspan", "rowspan", "width"],
        tr: ["colspan", "rowspan", "width"],
        ul: [],
        ol: [],
        li: [],
        span: [],
        blockquote: [],
        p: [],
        code: [],
        pre: [],
        b: [],
        u: [],
        i: [],
        strong: [],
        em: [],
        sub: [],
        sup: [],
        hr: [],
        br: [],
        video: ["controls"],
        source: ["src"],
        h1: [],
        h2: [],
        h3: [],
        h4: [],
        h5: [],
        s:[]
    },
    onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
        if (["style", "class", "width"].includes(name)) {
            return name + '="' + xss.escapeAttrValue(value) + '"';
        } else if (name.substr(0, 5) === "data-") {
            return name + '="' + xss.escapeAttrValue(value) + '"';
        }
    }
});

module.exports = (val) => xssFilter.process(val);

// module.exports = (val) => val;

// module.exports = xssFilter.process;