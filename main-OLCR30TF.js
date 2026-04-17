var ID = Object.defineProperty
    , DD = Object.defineProperties;
var CD = Object.getOwnPropertyDescriptors;
var Gi = Object.getOwnPropertySymbols;
var $h = Object.prototype.hasOwnProperty
    , zh = Object.prototype.propertyIsEnumerable;
var Bh = (e, t, n) => t in e ? ID(e, t, {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: n
}) : e[t] = n
    , m = (e, t) => {
        for (var n in t ||= {})
            $h.call(t, n) && Bh(e, n, t[n]);
        if (Gi)
            for (var n of Gi(t))
                zh.call(t, n) && Bh(e, n, t[n]);
        return e
    }
    , P = (e, t) => DD(e, CD(t));
var Gh = (e, t) => {
    var n = {};
    for (var r in e)
        $h.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
    if (e != null && Gi)
        for (var r of Gi(e))
            t.indexOf(r) < 0 && zh.call(e, r) && (n[r] = e[r]);
    return n
}
    ;
var Te = null
    , qi = !1
    , vl = 1
    , bD = null
    , ve = Symbol("SIGNAL");
function C(e) {
    let t = Te;
    return Te = e,
        t
}
function Qi() {
    return Te
}
var vr = {
    version: 0,
    lastCleanEpoch: 0,
    dirty: !1,
    producers: void 0,
    producersTail: void 0,
    consumers: void 0,
    consumersTail: void 0,
    recomputing: !1,
    consumerAllowSignalWrites: !1,
    consumerIsAlwaysLive: !1,
    kind: "unknown",
    producerMustRecompute: () => !1,
    producerRecomputeValue: () => { }
    ,
    consumerMarkedDirty: () => { }
    ,
    consumerOnSignalRead: () => { }
};
function yr(e) {
    if (qi)
        throw new Error("");
    if (Te === null)
        return;
    Te.consumerOnSignalRead(e);
    let t = Te.producersTail;
    if (t !== void 0 && t.producer === e)
        return;
    let n, r = Te.recomputing;
    if (r && (n = t !== void 0 ? t.nextProducer : Te.producers,
        n !== void 0 && n.producer === e)) {
        Te.producersTail = n,
            n.lastReadVersion = e.version;
        return
    }
    let o = e.consumersTail;
    if (o !== void 0 && o.consumer === Te && (!r || _D(o, Te)))
        return;
    let i = Ir(Te)
        , s = {
            producer: e,
            consumer: Te,
            nextProducer: n,
            prevConsumer: o,
            lastReadVersion: e.version,
            nextConsumer: void 0
        };
    Te.producersTail = s,
        t !== void 0 ? t.nextProducer = s : Te.producers = s,
        i && Zh(e, s)
}
function qh() {
    vl++
}
function yl(e) {
    if (!(Ir(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === vl)) {
        if (!e.producerMustRecompute(e) && !Do(e)) {
            ml(e);
            return
        }
        e.producerRecomputeValue(e),
            ml(e)
    }
}
function El(e) {
    if (e.consumers === void 0)
        return;
    let t = qi;
    qi = !0;
    try {
        for (let n = e.consumers; n !== void 0; n = n.nextConsumer) {
            let r = n.consumer;
            r.dirty || wD(r)
        }
    } finally {
        qi = t
    }
}
function Il() {
    return Te?.consumerAllowSignalWrites !== !1
}
function wD(e) {
    e.dirty = !0,
        El(e),
        e.consumerMarkedDirty?.(e)
}
function ml(e) {
    e.dirty = !1,
        e.lastCleanEpoch = vl
}
function Er(e) {
    return e && Wh(e),
        C(e)
}
function Wh(e) {
    e.producersTail = void 0,
        e.recomputing = !0
}
function Io(e, t) {
    C(t),
        e && Qh(e)
}
function Qh(e) {
    e.recomputing = !1;
    let t = e.producersTail
        , n = t !== void 0 ? t.nextProducer : e.producers;
    if (n !== void 0) {
        if (Ir(e))
            do
                n = Dl(n);
            while (n !== void 0);
        t !== void 0 ? t.nextProducer = void 0 : e.producers = void 0
    }
}
function Do(e) {
    for (let t = e.producers; t !== void 0; t = t.nextProducer) {
        let n = t.producer
            , r = t.lastReadVersion;
        if (r !== n.version || (yl(n),
            r !== n.version))
            return !0
    }
    return !1
}
function Rn(e) {
    if (Ir(e)) {
        let t = e.producers;
        for (; t !== void 0;)
            t = Dl(t)
    }
    e.producers = void 0,
        e.producersTail = void 0,
        e.consumers = void 0,
        e.consumersTail = void 0
}
function Zh(e, t) {
    let n = e.consumersTail
        , r = Ir(e);
    if (n !== void 0 ? (t.nextConsumer = n.nextConsumer,
        n.nextConsumer = t) : (t.nextConsumer = void 0,
            e.consumers = t),
        t.prevConsumer = n,
        e.consumersTail = t,
        !r)
        for (let o = e.producers; o !== void 0; o = o.nextProducer)
            Zh(o.producer, o)
}
function Dl(e) {
    let t = e.producer
        , n = e.nextProducer
        , r = e.nextConsumer
        , o = e.prevConsumer;
    if (e.nextConsumer = void 0,
        e.prevConsumer = void 0,
        r !== void 0 ? r.prevConsumer = o : t.consumersTail = o,
        o !== void 0)
        o.nextConsumer = r;
    else if (t.consumers = r,
        !Ir(t)) {
        let i = t.producers;
        for (; i !== void 0;)
            i = Dl(i)
    }
    return n
}
function Ir(e) {
    return e.consumerIsAlwaysLive || e.consumers !== void 0
}
function Cl(e) {
    bD?.(e)
}
function _D(e, t) {
    let n = t.producersTail;
    if (n !== void 0) {
        let r = t.producers;
        do {
            if (r === e)
                return !0;
            if (r === n)
                break;
            r = r.nextProducer
        } while (r !== void 0)
    }
    return !1
}
function bl(e, t) {
    return Object.is(e, t)
}
function Co(e, t) {
    let n = Object.create(TD);
    n.computation = e,
        t !== void 0 && (n.equal = t);
    let r = () => {
        if (yl(n),
            yr(n),
            n.value === Wi)
            throw n.error;
        return n.value
    }
        ;
    return r[ve] = n,
        Cl(n),
        r
}
var pl = Symbol("UNSET")
    , gl = Symbol("COMPUTING")
    , Wi = Symbol("ERRORED")
    , TD = P(m({}, vr), {
        value: pl,
        dirty: !0,
        error: null,
        equal: bl,
        kind: "computed",
        producerMustRecompute(e) {
            return e.value === pl || e.value === gl
        },
        producerRecomputeValue(e) {
            if (e.value === gl)
                throw new Error("");
            let t = e.value;
            e.value = gl;
            let n = Er(e), r, o = !1;
            try {
                r = e.computation(),
                    C(null),
                    o = t !== pl && t !== Wi && r !== Wi && e.equal(t, r)
            } catch (i) {
                r = Wi,
                    e.error = i
            } finally {
                Io(e, n)
            }
            if (o) {
                e.value = t;
                return
            }
            e.value = r,
                e.version++
        }
    });
function SD() {
    throw new Error
}
var Yh = SD;
function Kh(e) {
    Yh(e)
}
function wl(e) {
    Yh = e
}
var MD = null;
function _l(e, t) {
    let n = Object.create(Zi);
    n.value = e,
        t !== void 0 && (n.equal = t);
    let r = () => Jh(n);
    return r[ve] = n,
        Cl(n),
        [r, s => Dr(n, s), s => Xh(n, s)]
}
function Jh(e) {
    return yr(e),
        e.value
}
function Dr(e, t) {
    Il() || Kh(e),
        e.equal(e.value, t) || (e.value = t,
            ND(e))
}
function Xh(e, t) {
    Il() || Kh(e),
        Dr(e, t(e.value))
}
var Zi = P(m({}, vr), {
    equal: bl,
    value: void 0,
    kind: "signal"
});
function ND(e) {
    e.version++,
        qh(),
        El(e),
        MD?.(e)
}
function Tl(e) {
    let t = C(null);
    try {
        return e()
    } finally {
        C(t)
    }
}
var Sl = P(m({}, vr), {
    consumerIsAlwaysLive: !0,
    consumerAllowSignalWrites: !0,
    dirty: !0,
    kind: "effect"
});
function Ml(e) {
    if (e.dirty = !1,
        e.version > 0 && !Do(e))
        return;
    e.version++;
    let t = Er(e);
    try {
        e.cleanup(),
            e.fn()
    } finally {
        Io(e, t)
    }
}
function R(e) {
    return typeof e == "function"
}
function Cr(e) {
    let n = e(r => {
        Error.call(r),
            r.stack = new Error().stack
    }
    );
    return n.prototype = Object.create(Error.prototype),
        n.prototype.constructor = n,
        n
}
var Yi = Cr(e => function (n) {
    e(this),
        this.message = n ? `${n.length} errors occurred during unsubscription:
${n.map((r, o) => `${o + 1}) ${r.toString()}`).join(`
  `)}` : "",
        this.name = "UnsubscriptionError",
        this.errors = n
}
);
function bo(e, t) {
    if (e) {
        let n = e.indexOf(t);
        0 <= n && e.splice(n, 1)
    }
}
var ye = class e {
    constructor(t) {
        this.initialTeardown = t,
            this.closed = !1,
            this._parentage = null,
            this._finalizers = null
    }
    unsubscribe() {
        let t;
        if (!this.closed) {
            this.closed = !0;
            let { _parentage: n } = this;
            if (n)
                if (this._parentage = null,
                    Array.isArray(n))
                    for (let i of n)
                        i.remove(this);
                else
                    n.remove(this);
            let { initialTeardown: r } = this;
            if (R(r))
                try {
                    r()
                } catch (i) {
                    t = i instanceof Yi ? i.errors : [i]
                }
            let { _finalizers: o } = this;
            if (o) {
                this._finalizers = null;
                for (let i of o)
                    try {
                        ep(i)
                    } catch (s) {
                        t = t ?? [],
                            s instanceof Yi ? t = [...t, ...s.errors] : t.push(s)
                    }
            }
            if (t)
                throw new Yi(t)
        }
    }
    add(t) {
        var n;
        if (t && t !== this)
            if (this.closed)
                ep(t);
            else {
                if (t instanceof e) {
                    if (t.closed || t._hasParent(this))
                        return;
                    t._addParent(this)
                }
                (this._finalizers = (n = this._finalizers) !== null && n !== void 0 ? n : []).push(t)
            }
    }
    _hasParent(t) {
        let { _parentage: n } = this;
        return n === t || Array.isArray(n) && n.includes(t)
    }
    _addParent(t) {
        let { _parentage: n } = this;
        this._parentage = Array.isArray(n) ? (n.push(t),
            n) : n ? [n, t] : t
    }
    _removeParent(t) {
        let { _parentage: n } = this;
        n === t ? this._parentage = null : Array.isArray(n) && bo(n, t)
    }
    remove(t) {
        let { _finalizers: n } = this;
        n && bo(n, t),
            t instanceof e && t._removeParent(this)
    }
}
    ;
ye.EMPTY = (() => {
    let e = new ye;
    return e.closed = !0,
        e
}
)();
var Nl = ye.EMPTY;
function Ki(e) {
    return e instanceof ye || e && "closed" in e && R(e.remove) && R(e.add) && R(e.unsubscribe)
}
function ep(e) {
    R(e) ? e() : e.unsubscribe()
}
var pt = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: void 0,
    useDeprecatedSynchronousErrorHandling: !1,
    useDeprecatedNextContext: !1
};
var br = {
    setTimeout(e, t, ...n) {
        let { delegate: r } = br;
        return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n)
    },
    clearTimeout(e) {
        let { delegate: t } = br;
        return (t?.clearTimeout || clearTimeout)(e)
    },
    delegate: void 0
};
function Ji(e) {
    br.setTimeout(() => {
        let { onUnhandledError: t } = pt;
        if (t)
            t(e);
        else
            throw e
    }
    )
}
function wo() { }
var tp = Rl("C", void 0, void 0);
function np(e) {
    return Rl("E", void 0, e)
}
function rp(e) {
    return Rl("N", e, void 0)
}
function Rl(e, t, n) {
    return {
        kind: e,
        value: t,
        error: n
    }
}
var An = null;
function wr(e) {
    if (pt.useDeprecatedSynchronousErrorHandling) {
        let t = !An;
        if (t && (An = {
            errorThrown: !1,
            error: null
        }),
            e(),
            t) {
            let { errorThrown: n, error: r } = An;
            if (An = null,
                n)
                throw r
        }
    } else
        e()
}
function op(e) {
    pt.useDeprecatedSynchronousErrorHandling && An && (An.errorThrown = !0,
        An.error = e)
}
var xn = class extends ye {
    constructor(t) {
        super(),
            this.isStopped = !1,
            t ? (this.destination = t,
                Ki(t) && t.add(this)) : this.destination = xD
    }
    static create(t, n, r) {
        return new _r(t, n, r)
    }
    next(t) {
        this.isStopped ? xl(rp(t), this) : this._next(t)
    }
    error(t) {
        this.isStopped ? xl(np(t), this) : (this.isStopped = !0,
            this._error(t))
    }
    complete() {
        this.isStopped ? xl(tp, this) : (this.isStopped = !0,
            this._complete())
    }
    unsubscribe() {
        this.closed || (this.isStopped = !0,
            super.unsubscribe(),
            this.destination = null)
    }
    _next(t) {
        this.destination.next(t)
    }
    _error(t) {
        try {
            this.destination.error(t)
        } finally {
            this.unsubscribe()
        }
    }
    _complete() {
        try {
            this.destination.complete()
        } finally {
            this.unsubscribe()
        }
    }
}
    , RD = Function.prototype.bind;
function Al(e, t) {
    return RD.call(e, t)
}
var Ol = class {
    constructor(t) {
        this.partialObserver = t
    }
    next(t) {
        let { partialObserver: n } = this;
        if (n.next)
            try {
                n.next(t)
            } catch (r) {
                Xi(r)
            }
    }
    error(t) {
        let { partialObserver: n } = this;
        if (n.error)
            try {
                n.error(t)
            } catch (r) {
                Xi(r)
            }
        else
            Xi(t)
    }
    complete() {
        let { partialObserver: t } = this;
        if (t.complete)
            try {
                t.complete()
            } catch (n) {
                Xi(n)
            }
    }
}
    , _r = class extends xn {
        constructor(t, n, r) {
            super();
            let o;
            if (R(t) || !t)
                o = {
                    next: t ?? void 0,
                    error: n ?? void 0,
                    complete: r ?? void 0
                };
            else {
                let i;
                this && pt.useDeprecatedNextContext ? (i = Object.create(t),
                    i.unsubscribe = () => this.unsubscribe(),
                    o = {
                        next: t.next && Al(t.next, i),
                        error: t.error && Al(t.error, i),
                        complete: t.complete && Al(t.complete, i)
                    }) : o = t
            }
            this.destination = new Ol(o)
        }
    }
    ;
function Xi(e) {
    pt.useDeprecatedSynchronousErrorHandling ? op(e) : Ji(e)
}
function AD(e) {
    throw e
}
function xl(e, t) {
    let { onStoppedNotification: n } = pt;
    n && br.setTimeout(() => n(e, t))
}
var xD = {
    closed: !0,
    next: wo,
    error: AD,
    complete: wo
};
var Tr = typeof Symbol == "function" && Symbol.observable || "@@observable";
function gt(e) {
    return e
}
function kl(...e) {
    return Pl(e)
}
function Pl(e) {
    return e.length === 0 ? gt : e.length === 1 ? e[0] : function (n) {
        return e.reduce((r, o) => o(r), n)
    }
}
var V = (() => {
    class e {
        constructor(n) {
            n && (this._subscribe = n)
        }
        lift(n) {
            let r = new e;
            return r.source = this,
                r.operator = n,
                r
        }
        subscribe(n, r, o) {
            let i = kD(n) ? n : new _r(n, r, o);
            return wr(() => {
                let { operator: s, source: a } = this;
                i.add(s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i))
            }
            ),
                i
        }
        _trySubscribe(n) {
            try {
                return this._subscribe(n)
            } catch (r) {
                n.error(r)
            }
        }
        forEach(n, r) {
            return r = ip(r),
                new r((o, i) => {
                    let s = new _r({
                        next: a => {
                            try {
                                n(a)
                            } catch (c) {
                                i(c),
                                    s.unsubscribe()
                            }
                        }
                        ,
                        error: i,
                        complete: o
                    });
                    this.subscribe(s)
                }
                )
        }
        _subscribe(n) {
            var r;
            return (r = this.source) === null || r === void 0 ? void 0 : r.subscribe(n)
        }
        [Tr]() {
            return this
        }
        pipe(...n) {
            return Pl(n)(this)
        }
        toPromise(n) {
            return n = ip(n),
                new n((r, o) => {
                    let i;
                    this.subscribe(s => i = s, s => o(s), () => r(i))
                }
                )
        }
    }
    return e.create = t => new e(t),
        e
}
)();
function ip(e) {
    var t;
    return (t = e ?? pt.Promise) !== null && t !== void 0 ? t : Promise
}
function OD(e) {
    return e && R(e.next) && R(e.error) && R(e.complete)
}
function kD(e) {
    return e && e instanceof xn || OD(e) && Ki(e)
}
function PD(e) {
    return R(e?.lift)
}
function G(e) {
    return t => {
        if (PD(t))
            return t.lift(function (n) {
                try {
                    return e(n, this)
                } catch (r) {
                    this.error(r)
                }
            });
        throw new TypeError("Unable to lift unknown Observable type")
    }
}
function q(e, t, n, r, o) {
    return new Ll(e, t, n, r, o)
}
var Ll = class extends xn {
    constructor(t, n, r, o, i, s) {
        super(t),
            this.onFinalize = i,
            this.shouldUnsubscribe = s,
            this._next = n ? function (a) {
                try {
                    n(a)
                } catch (c) {
                    t.error(c)
                }
            }
                : super._next,
            this._error = o ? function (a) {
                try {
                    o(a)
                } catch (c) {
                    t.error(c)
                } finally {
                    this.unsubscribe()
                }
            }
                : super._error,
            this._complete = r ? function () {
                try {
                    r()
                } catch (a) {
                    t.error(a)
                } finally {
                    this.unsubscribe()
                }
            }
                : super._complete
    }
    unsubscribe() {
        var t;
        if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            let { closed: n } = this;
            super.unsubscribe(),
                !n && ((t = this.onFinalize) === null || t === void 0 || t.call(this))
        }
    }
}
    ;
var sp = Cr(e => function () {
    e(this),
        this.name = "ObjectUnsubscribedError",
        this.message = "object unsubscribed"
}
);
var ce = (() => {
    class e extends V {
        constructor() {
            super(),
                this.closed = !1,
                this.currentObservers = null,
                this.observers = [],
                this.isStopped = !1,
                this.hasError = !1,
                this.thrownError = null
        }
        lift(n) {
            let r = new es(this, this);
            return r.operator = n,
                r
        }
        _throwIfClosed() {
            if (this.closed)
                throw new sp
        }
        next(n) {
            wr(() => {
                if (this._throwIfClosed(),
                    !this.isStopped) {
                    this.currentObservers || (this.currentObservers = Array.from(this.observers));
                    for (let r of this.currentObservers)
                        r.next(n)
                }
            }
            )
        }
        error(n) {
            wr(() => {
                if (this._throwIfClosed(),
                    !this.isStopped) {
                    this.hasError = this.isStopped = !0,
                        this.thrownError = n;
                    let { observers: r } = this;
                    for (; r.length;)
                        r.shift().error(n)
                }
            }
            )
        }
        complete() {
            wr(() => {
                if (this._throwIfClosed(),
                    !this.isStopped) {
                    this.isStopped = !0;
                    let { observers: n } = this;
                    for (; n.length;)
                        n.shift().complete()
                }
            }
            )
        }
        unsubscribe() {
            this.isStopped = this.closed = !0,
                this.observers = this.currentObservers = null
        }
        get observed() {
            var n;
            return ((n = this.observers) === null || n === void 0 ? void 0 : n.length) > 0
        }
        _trySubscribe(n) {
            return this._throwIfClosed(),
                super._trySubscribe(n)
        }
        _subscribe(n) {
            return this._throwIfClosed(),
                this._checkFinalizedStatuses(n),
                this._innerSubscribe(n)
        }
        _innerSubscribe(n) {
            let { hasError: r, isStopped: o, observers: i } = this;
            return r || o ? Nl : (this.currentObservers = null,
                i.push(n),
                new ye(() => {
                    this.currentObservers = null,
                        bo(i, n)
                }
                ))
        }
        _checkFinalizedStatuses(n) {
            let { hasError: r, thrownError: o, isStopped: i } = this;
            r ? n.error(o) : i && n.complete()
        }
        asObservable() {
            let n = new V;
            return n.source = this,
                n
        }
    }
    return e.create = (t, n) => new es(t, n),
        e
}
)()
    , es = class extends ce {
        constructor(t, n) {
            super(),
                this.destination = t,
                this.source = n
        }
        next(t) {
            var n, r;
            (r = (n = this.destination) === null || n === void 0 ? void 0 : n.next) === null || r === void 0 || r.call(n, t)
        }
        error(t) {
            var n, r;
            (r = (n = this.destination) === null || n === void 0 ? void 0 : n.error) === null || r === void 0 || r.call(n, t)
        }
        complete() {
            var t, n;
            (n = (t = this.destination) === null || t === void 0 ? void 0 : t.complete) === null || n === void 0 || n.call(t)
        }
        _subscribe(t) {
            var n, r;
            return (r = (n = this.source) === null || n === void 0 ? void 0 : n.subscribe(t)) !== null && r !== void 0 ? r : Nl
        }
    }
    ;
var Ee = class extends ce {
    constructor(t) {
        super(),
            this._value = t
    }
    get value() {
        return this.getValue()
    }
    _subscribe(t) {
        let n = super._subscribe(t);
        return !n.closed && t.next(this._value),
            n
    }
    getValue() {
        let { hasError: t, thrownError: n, _value: r } = this;
        if (t)
            throw n;
        return this._throwIfClosed(),
            r
    }
    next(t) {
        super.next(this._value = t)
    }
}
    ;
var Ie = new V(e => e.complete());
function ap(e) {
    return e && R(e.schedule)
}
function cp(e) {
    return e[e.length - 1]
}
function ts(e) {
    return R(cp(e)) ? e.pop() : void 0
}
function ln(e) {
    return ap(cp(e)) ? e.pop() : void 0
}
function up(e, t, n, r) {
    function o(i) {
        return i instanceof n ? i : new n(function (s) {
            s(i)
        }
        )
    }
    return new (n || (n = Promise))(function (i, s) {
        function a(u) {
            try {
                l(r.next(u))
            } catch (d) {
                s(d)
            }
        }
        function c(u) {
            try {
                l(r.throw(u))
            } catch (d) {
                s(d)
            }
        }
        function l(u) {
            u.done ? i(u.value) : o(u.value).then(a, c)
        }
        l((r = r.apply(e, t || [])).next())
    }
    )
}
function lp(e) {
    var t = typeof Symbol == "function" && Symbol.iterator
        , n = t && e[t]
        , r = 0;
    if (n)
        return n.call(e);
    if (e && typeof e.length == "number")
        return {
            next: function () {
                return e && r >= e.length && (e = void 0),
                {
                    value: e && e[r++],
                    done: !e
                }
            }
        };
    throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.")
}
function On(e) {
    return this instanceof On ? (this.v = e,
        this) : new On(e)
}
function dp(e, t, n) {
    if (!Symbol.asyncIterator)
        throw new TypeError("Symbol.asyncIterator is not defined.");
    var r = n.apply(e, t || []), o, i = [];
    return o = Object.create((typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype),
        a("next"),
        a("throw"),
        a("return", s),
        o[Symbol.asyncIterator] = function () {
            return this
        }
        ,
        o;
    function s(f) {
        return function (g) {
            return Promise.resolve(g).then(f, d)
        }
    }
    function a(f, g) {
        r[f] && (o[f] = function (E) {
            return new Promise(function (M, x) {
                i.push([f, E, M, x]) > 1 || c(f, E)
            }
            )
        }
            ,
            g && (o[f] = g(o[f])))
    }
    function c(f, g) {
        try {
            l(r[f](g))
        } catch (E) {
            h(i[0][3], E)
        }
    }
    function l(f) {
        f.value instanceof On ? Promise.resolve(f.value.v).then(u, d) : h(i[0][2], f)
    }
    function u(f) {
        c("next", f)
    }
    function d(f) {
        c("throw", f)
    }
    function h(f, g) {
        f(g),
            i.shift(),
            i.length && c(i[0][0], i[0][1])
    }
}
function fp(e) {
    if (!Symbol.asyncIterator)
        throw new TypeError("Symbol.asyncIterator is not defined.");
    var t = e[Symbol.asyncIterator], n;
    return t ? t.call(e) : (e = typeof lp == "function" ? lp(e) : e[Symbol.iterator](),
        n = {},
        r("next"),
        r("throw"),
        r("return"),
        n[Symbol.asyncIterator] = function () {
            return this
        }
        ,
        n);
    function r(i) {
        n[i] = e[i] && function (s) {
            return new Promise(function (a, c) {
                s = e[i](s),
                    o(a, c, s.done, s.value)
            }
            )
        }
    }
    function o(i, s, a, c) {
        Promise.resolve(c).then(function (l) {
            i({
                value: l,
                done: a
            })
        }, s)
    }
}
var ns = e => e && typeof e.length == "number" && typeof e != "function";
function rs(e) {
    return R(e?.then)
}
function os(e) {
    return R(e[Tr])
}
function is(e) {
    return Symbol.asyncIterator && R(e?.[Symbol.asyncIterator])
}
function ss(e) {
    return new TypeError(`You provided ${e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`)
}
function LD() {
    return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator
}
var as = LD();
function cs(e) {
    return R(e?.[as])
}
function ls(e) {
    return dp(this, arguments, function* () {
        let n = e.getReader();
        try {
            for (; ;) {
                let { value: r, done: o } = yield On(n.read());
                if (o)
                    return yield On(void 0);
                yield yield On(r)
            }
        } finally {
            n.releaseLock()
        }
    })
}
function us(e) {
    return R(e?.getReader)
}
function le(e) {
    if (e instanceof V)
        return e;
    if (e != null) {
        if (os(e))
            return FD(e);
        if (ns(e))
            return jD(e);
        if (rs(e))
            return VD(e);
        if (is(e))
            return hp(e);
        if (cs(e))
            return UD(e);
        if (us(e))
            return HD(e)
    }
    throw ss(e)
}
function FD(e) {
    return new V(t => {
        let n = e[Tr]();
        if (R(n.subscribe))
            return n.subscribe(t);
        throw new TypeError("Provided object does not correctly implement Symbol.observable")
    }
    )
}
function jD(e) {
    return new V(t => {
        for (let n = 0; n < e.length && !t.closed; n++)
            t.next(e[n]);
        t.complete()
    }
    )
}
function VD(e) {
    return new V(t => {
        e.then(n => {
            t.closed || (t.next(n),
                t.complete())
        }
            , n => t.error(n)).then(null, Ji)
    }
    )
}
function UD(e) {
    return new V(t => {
        for (let n of e)
            if (t.next(n),
                t.closed)
                return;
        t.complete()
    }
    )
}
function hp(e) {
    return new V(t => {
        BD(e, t).catch(n => t.error(n))
    }
    )
}
function HD(e) {
    return hp(ls(e))
}
function BD(e, t) {
    var n, r, o, i;
    return up(this, void 0, void 0, function* () {
        try {
            for (n = fp(e); r = yield n.next(),
                !r.done;) {
                let s = r.value;
                if (t.next(s),
                    t.closed)
                    return
            }
        } catch (s) {
            o = {
                error: s
            }
        } finally {
            try {
                r && !r.done && (i = n.return) && (yield i.call(n))
            } finally {
                if (o)
                    throw o.error
            }
        }
        t.complete()
    })
}
function Fe(e, t, n, r = 0, o = !1) {
    let i = t.schedule(function () {
        n(),
            o ? e.add(this.schedule(null, r)) : this.unsubscribe()
    }, r);
    if (e.add(i),
        !o)
        return i
}
function ds(e, t = 0) {
    return G((n, r) => {
        n.subscribe(q(r, o => Fe(r, e, () => r.next(o), t), () => Fe(r, e, () => r.complete(), t), o => Fe(r, e, () => r.error(o), t)))
    }
    )
}
function fs(e, t = 0) {
    return G((n, r) => {
        r.add(e.schedule(() => n.subscribe(r), t))
    }
    )
}
function pp(e, t) {
    return le(e).pipe(fs(t), ds(t))
}
function gp(e, t) {
    return le(e).pipe(fs(t), ds(t))
}
function mp(e, t) {
    return new V(n => {
        let r = 0;
        return t.schedule(function () {
            r === e.length ? n.complete() : (n.next(e[r++]),
                n.closed || this.schedule())
        })
    }
    )
}
function vp(e, t) {
    return new V(n => {
        let r;
        return Fe(n, t, () => {
            r = e[as](),
                Fe(n, t, () => {
                    let o, i;
                    try {
                        ({ value: o, done: i } = r.next())
                    } catch (s) {
                        n.error(s);
                        return
                    }
                    i ? n.complete() : n.next(o)
                }
                    , 0, !0)
        }
        ),
            () => R(r?.return) && r.return()
    }
    )
}
function hs(e, t) {
    if (!e)
        throw new Error("Iterable cannot be null");
    return new V(n => {
        Fe(n, t, () => {
            let r = e[Symbol.asyncIterator]();
            Fe(n, t, () => {
                r.next().then(o => {
                    o.done ? n.complete() : n.next(o.value)
                }
                )
            }
                , 0, !0)
        }
        )
    }
    )
}
function yp(e, t) {
    return hs(ls(e), t)
}
function Ep(e, t) {
    if (e != null) {
        if (os(e))
            return pp(e, t);
        if (ns(e))
            return mp(e, t);
        if (rs(e))
            return gp(e, t);
        if (is(e))
            return hs(e, t);
        if (cs(e))
            return vp(e, t);
        if (us(e))
            return yp(e, t)
    }
    throw ss(e)
}
function re(e, t) {
    return t ? Ep(e, t) : le(e)
}
function L(...e) {
    let t = ln(e);
    return re(e, t)
}
function Fl(e, t) {
    let n = R(e) ? e : () => e
        , r = o => o.error(n());
    return new V(t ? o => t.schedule(r, 0, o) : r)
}
function ps(e) {
    return !!e && (e instanceof V || R(e.lift) && R(e.subscribe))
}
var kn = Cr(e => function () {
    e(this),
        this.name = "EmptyError",
        this.message = "no elements in sequence"
}
);
function K(e, t) {
    return G((n, r) => {
        let o = 0;
        n.subscribe(q(r, i => {
            r.next(e.call(t, i, o++))
        }
        ))
    }
    )
}
var { isArray: $D } = Array;
function zD(e, t) {
    return $D(t) ? e(...t) : e(t)
}
function gs(e) {
    return K(t => zD(e, t))
}
var { isArray: GD } = Array
    , { getPrototypeOf: qD, prototype: WD, keys: QD } = Object;
function ms(e) {
    if (e.length === 1) {
        let t = e[0];
        if (GD(t))
            return {
                args: t,
                keys: null
            };
        if (ZD(t)) {
            let n = QD(t);
            return {
                args: n.map(r => t[r]),
                keys: n
            }
        }
    }
    return {
        args: e,
        keys: null
    }
}
function ZD(e) {
    return e && typeof e == "object" && qD(e) === WD
}
function vs(e, t) {
    return e.reduce((n, r, o) => (n[r] = t[o],
        n), {})
}
function jl(...e) {
    let t = ln(e)
        , n = ts(e)
        , { args: r, keys: o } = ms(e);
    if (r.length === 0)
        return re([], t);
    let i = new V(YD(r, t, o ? s => vs(o, s) : gt));
    return n ? i.pipe(gs(n)) : i
}
function YD(e, t, n = gt) {
    return r => {
        Ip(t, () => {
            let { length: o } = e
                , i = new Array(o)
                , s = o
                , a = o;
            for (let c = 0; c < o; c++)
                Ip(t, () => {
                    let l = re(e[c], t)
                        , u = !1;
                    l.subscribe(q(r, d => {
                        i[c] = d,
                            u || (u = !0,
                                a--),
                            a || r.next(n(i.slice()))
                    }
                        , () => {
                            --s || r.complete()
                        }
                    ))
                }
                    , r)
        }
            , r)
    }
}
function Ip(e, t, n) {
    e ? Fe(n, e, t) : t()
}
function Dp(e, t, n, r, o, i, s, a) {
    let c = []
        , l = 0
        , u = 0
        , d = !1
        , h = () => {
            d && !c.length && !l && t.complete()
        }
        , f = E => l < r ? g(E) : c.push(E)
        , g = E => {
            i && t.next(E),
                l++;
            let M = !1;
            le(n(E, u++)).subscribe(q(t, x => {
                o?.(x),
                    i ? f(x) : t.next(x)
            }
                , () => {
                    M = !0
                }
                , void 0, () => {
                    if (M)
                        try {
                            for (l--; c.length && l < r;) {
                                let x = c.shift();
                                s ? Fe(t, s, () => g(x)) : g(x)
                            }
                            h()
                        } catch (x) {
                            t.error(x)
                        }
                }
            ))
        }
        ;
    return e.subscribe(q(t, f, () => {
        d = !0,
            h()
    }
    )),
        () => {
            a?.()
        }
}
function Se(e, t, n = 1 / 0) {
    return R(t) ? Se((r, o) => K((i, s) => t(r, i, o, s))(le(e(r, o))), n) : (typeof t == "number" && (n = t),
        G((r, o) => Dp(r, o, e, n)))
}
function Sr(e = 1 / 0) {
    return Se(gt, e)
}
function Cp() {
    return Sr(1)
}
function Mr(...e) {
    return Cp()(re(e, ln(e)))
}
function _o(e) {
    return new V(t => {
        le(e()).subscribe(t)
    }
    )
}
function Vl(...e) {
    let t = ts(e)
        , { args: n, keys: r } = ms(e)
        , o = new V(i => {
            let { length: s } = n;
            if (!s) {
                i.complete();
                return
            }
            let a = new Array(s)
                , c = s
                , l = s;
            for (let u = 0; u < s; u++) {
                let d = !1;
                le(n[u]).subscribe(q(i, h => {
                    d || (d = !0,
                        l--),
                        a[u] = h
                }
                    , () => c--, void 0, () => {
                        (!c || !d) && (l || i.next(r ? vs(r, a) : a),
                            i.complete())
                    }
                ))
            }
        }
        );
    return t ? o.pipe(gs(t)) : o
}
function ze(e, t) {
    return G((n, r) => {
        let o = 0;
        n.subscribe(q(r, i => e.call(t, i, o++) && r.next(i)))
    }
    )
}
function Nr(e) {
    return G((t, n) => {
        let r = null, o = !1, i;
        r = t.subscribe(q(n, void 0, void 0, s => {
            i = le(e(s, Nr(e)(t))),
                r ? (r.unsubscribe(),
                    r = null,
                    i.subscribe(n)) : o = !0
        }
        )),
            o && (r.unsubscribe(),
                r = null,
                i.subscribe(n))
    }
    )
}
function To(e, t) {
    return R(t) ? Se(e, t, 1) : Se(e, 1)
}
function bp(e) {
    return G((t, n) => {
        let r = !1;
        t.subscribe(q(n, o => {
            r = !0,
                n.next(o)
        }
            , () => {
                r || n.next(e),
                    n.complete()
            }
        ))
    }
    )
}
function Bt(e) {
    return e <= 0 ? () => Ie : G((t, n) => {
        let r = 0;
        t.subscribe(q(n, o => {
            ++r <= e && (n.next(o),
                e <= r && n.complete())
        }
        ))
    }
    )
}
function wp(e = KD) {
    return G((t, n) => {
        let r = !1;
        t.subscribe(q(n, o => {
            r = !0,
                n.next(o)
        }
            , () => r ? n.complete() : n.error(e())))
    }
    )
}
function KD() {
    return new kn
}
function Ul(e) {
    return G((t, n) => {
        try {
            t.subscribe(n)
        } finally {
            n.add(e)
        }
    }
    )
}
function $t(e, t) {
    let n = arguments.length >= 2;
    return r => r.pipe(e ? ze((o, i) => e(o, i, r)) : gt, Bt(1), n ? bp(t) : wp(() => new kn))
}
function ys(e) {
    return e <= 0 ? () => Ie : G((t, n) => {
        let r = [];
        t.subscribe(q(n, o => {
            r.push(o),
                e < r.length && r.shift()
        }
            , () => {
                for (let o of r)
                    n.next(o);
                n.complete()
            }
            , void 0, () => {
                r = null
            }
        ))
    }
    )
}
function Hl(...e) {
    let t = ln(e);
    return G((n, r) => {
        (t ? Mr(e, n, t) : Mr(e, n)).subscribe(r)
    }
    )
}
function zt(e, t) {
    return G((n, r) => {
        let o = null
            , i = 0
            , s = !1
            , a = () => s && !o && r.complete();
        n.subscribe(q(r, c => {
            o?.unsubscribe();
            let l = 0
                , u = i++;
            le(e(c, u)).subscribe(o = q(r, d => r.next(t ? t(c, d, u, l++) : d), () => {
                o = null,
                    a()
            }
            ))
        }
            , () => {
                s = !0,
                    a()
            }
        ))
    }
    )
}
function So(e) {
    return G((t, n) => {
        le(e).subscribe(q(n, () => n.complete(), wo)),
            !n.closed && t.subscribe(n)
    }
    )
}
function _t(e, t, n) {
    let r = R(e) || t || n ? {
        next: e,
        error: t,
        complete: n
    } : e;
    return r ? G((o, i) => {
        var s;
        (s = r.subscribe) === null || s === void 0 || s.call(r);
        let a = !0;
        o.subscribe(q(i, c => {
            var l;
            (l = r.next) === null || l === void 0 || l.call(r, c),
                i.next(c)
        }
            , () => {
                var c;
                a = !1,
                    (c = r.complete) === null || c === void 0 || c.call(r),
                    i.complete()
            }
            , c => {
                var l;
                a = !1,
                    (l = r.error) === null || l === void 0 || l.call(r, c),
                    i.error(c)
            }
            , () => {
                var c, l;
                a && ((c = r.unsubscribe) === null || c === void 0 || c.call(r)),
                    (l = r.finalize) === null || l === void 0 || l.call(r)
            }
        ))
    }
    ) : gt
}
var Bl;
function Es() {
    return Bl
}
function Tt(e) {
    let t = Bl;
    return Bl = e,
        t
}
var _p = Symbol("NotFound");
function Rr(e) {
    return e === _p || e?.name === "\u0275NotFound"
}
var Ts = "https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss"
    , y = class extends Error {
        code;
        constructor(t, n) {
            super(St(t, n)),
                this.code = t
        }
    }
    ;
function JD(e) {
    return `NG0${Math.abs(e)}`
}
function St(e, t) {
    return `${JD(e)}${t ? ": " + t : ""}`
}
var xr = globalThis;
function W(e) {
    for (let t in e)
        if (e[t] === W)
            return t;
    throw Error("")
}
function Rp(e, t) {
    for (let n in t)
        t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n])
}
function qt(e) {
    if (typeof e == "string")
        return e;
    if (Array.isArray(e))
        return `[${e.map(qt).join(", ")}]`;
    if (e == null)
        return "" + e;
    let t = e.overriddenName || e.name;
    if (t)
        return `${t}`;
    let n = e.toString();
    if (n == null)
        return "" + n;
    let r = n.indexOf(`
`);
    return r >= 0 ? n.slice(0, r) : n
}
function Ss(e, t) {
    return e ? t ? `${e} ${t}` : e : t || ""
}
var XD = W({
    __forward_ref__: W
});
function mt(e) {
    return e.__forward_ref__ = mt,
        e.toString = function () {
            return qt(this())
        }
        ,
        e
}
function De(e) {
    return tu(e) ? e() : e
}
function tu(e) {
    return typeof e == "function" && e.hasOwnProperty(XD) && e.__forward_ref__ === mt
}
function w(e) {
    return {
        token: e.token,
        providedIn: e.providedIn || null,
        factory: e.factory,
        value: void 0
    }
}
function fn(e) {
    return {
        providers: e.providers || [],
        imports: e.imports || []
    }
}
function ko(e) {
    return eC(e, Ms)
}
function nu(e) {
    return ko(e) !== null
}
function eC(e, t) {
    return e.hasOwnProperty(t) && e[t] || null
}
function tC(e) {
    let t = e?.[Ms] ?? null;
    return t || null
}
function zl(e) {
    return e && e.hasOwnProperty(Ds) ? e[Ds] : null
}
var Ms = W({
    \u0275prov: W
})
    , Ds = W({
        \u0275inj: W
    })
    , v = class {
        _desc;
        ngMetadataName = "InjectionToken";
        \u0275prov;
        constructor(t, n) {
            this._desc = t,
                this.\u0275prov = void 0,
                typeof n == "number" ? this.__NG_ELEMENT_ID__ = n : n !== void 0 && (this.\u0275prov = w({
                    token: this,
                    providedIn: n.providedIn || "root",
                    factory: n.factory
                }))
        }
        get multi() {
            return this
        }
        toString() {
            return `InjectionToken ${this._desc}`
        }
    }
    ;
function ru(e) {
    return e && !!e.\u0275providers
}
var ou = W({
    \u0275cmp: W
})
    , iu = W({
        \u0275dir: W
    })
    , su = W({
        \u0275pipe: W
    })
    , au = W({
        \u0275mod: W
    })
    , No = W({
        \u0275fac: W
    })
    , Un = W({
        __NG_ELEMENT_ID__: W
    })
    , Tp = W({
        __NG_ENV_ID__: W
    });
function cu(e) {
    return Rs(e, "@NgModule"),
        e[au] || null
}
function Qt(e) {
    return Rs(e, "@Component"),
        e[ou] || null
}
function Ns(e) {
    return Rs(e, "@Directive"),
        e[iu] || null
}
function lu(e) {
    return Rs(e, "@Pipe"),
        e[su] || null
}
function Rs(e, t) {
    if (e == null)
        throw new y(-919, !1)
}
function As(e) {
    return typeof e == "string" ? e : e == null ? "" : String(e)
}
var Ap = W({
    ngErrorCode: W
})
    , nC = W({
        ngErrorMessage: W
    })
    , rC = W({
        ngTokenPath: W
    });
function uu(e, t) {
    return xp("", -200, t)
}
function xs(e, t) {
    throw new y(-201, !1)
}
function xp(e, t, n) {
    let r = new y(t, e);
    return r[Ap] = t,
        r[nC] = e,
        n && (r[rC] = n),
        r
}
function oC(e) {
    return e[Ap]
}
var Gl;
function Op() {
    return Gl
}
function Ge(e) {
    let t = Gl;
    return Gl = e,
        t
}
function du(e, t, n) {
    let r = ko(e);
    if (r && r.providedIn == "root")
        return r.value === void 0 ? r.value = r.factory() : r.value;
    if (n & 8)
        return null;
    if (t !== void 0)
        return t;
    xs(e, "")
}
var iC = {}
    , Pn = iC
    , sC = "__NG_DI_FLAG__"
    , ql = class {
        injector;
        constructor(t) {
            this.injector = t
        }
        retrieve(t, n) {
            let r = Ln(n) || 0;
            try {
                return this.injector.get(t, r & 8 ? null : Pn, r)
            } catch (o) {
                if (Rr(o))
                    return o;
                throw o
            }
        }
    }
    ;
function aC(e, t = 0) {
    let n = Es();
    if (n === void 0)
        throw new y(-203, !1);
    if (n === null)
        return du(e, void 0, t);
    {
        let r = cC(t)
            , o = n.retrieve(e, r);
        if (Rr(o)) {
            if (r.optional)
                return null;
            throw o
        }
        return o
    }
}
function k(e, t = 0) {
    return (Op() || aC)(De(e), t)
}
function p(e, t) {
    return k(e, Ln(t))
}
function Ln(e) {
    return typeof e > "u" || typeof e == "number" ? e : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4)
}
function cC(e) {
    return {
        optional: !!(e & 8),
        host: !!(e & 1),
        self: !!(e & 2),
        skipSelf: !!(e & 4)
    }
}
function Wl(e) {
    let t = [];
    for (let n = 0; n < e.length; n++) {
        let r = De(e[n]);
        if (Array.isArray(r)) {
            if (r.length === 0)
                throw new y(900, !1);
            let o, i = 0;
            for (let s = 0; s < r.length; s++) {
                let a = r[s]
                    , c = lC(a);
                typeof c == "number" ? c === -1 ? o = a.token : i |= c : o = a
            }
            t.push(k(o, i))
        } else
            t.push(k(r))
    }
    return t
}
function lC(e) {
    return e[sC]
}
function Fn(e, t) {
    let n = e.hasOwnProperty(No);
    return n ? e[No] : null
}
function kp(e, t, n) {
    if (e.length !== t.length)
        return !1;
    for (let r = 0; r < e.length; r++) {
        let o = e[r]
            , i = t[r];
        if (n && (o = n(o),
            i = n(i)),
            i !== o)
            return !1
    }
    return !0
}
function Pp(e) {
    return e.flat(Number.POSITIVE_INFINITY)
}
function Os(e, t) {
    e.forEach(n => Array.isArray(n) ? Os(n, t) : t(n))
}
function fu(e, t, n) {
    t >= e.length ? e.push(n) : e.splice(t, 0, n)
}
function Po(e, t) {
    return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0]
}
function Lp(e, t) {
    let n = [];
    for (let r = 0; r < e; r++)
        n.push(t);
    return n
}
function Fp(e, t, n, r) {
    let o = e.length;
    if (o == t)
        e.push(n, r);
    else if (o === 1)
        e.push(r, e[0]),
            e[0] = n;
    else {
        for (o--,
            e.push(e[o - 1], e[o]); o > t;) {
            let i = o - 2;
            e[o] = e[i],
                o--
        }
        e[t] = n,
            e[t + 1] = r
    }
}
function ks(e, t, n) {
    let r = Or(e, t);
    return r >= 0 ? e[r | 1] = n : (r = ~r,
        Fp(e, r, t, n)),
        r
}
function Ps(e, t) {
    let n = Or(e, t);
    if (n >= 0)
        return e[n | 1]
}
function Or(e, t) {
    return uC(e, t, 1)
}
function uC(e, t, n) {
    let r = 0
        , o = e.length >> n;
    for (; o !== r;) {
        let i = r + (o - r >> 1)
            , s = e[i << n];
        if (t === s)
            return i << n;
        s > t ? o = i : r = i + 1
    }
    return ~(o << n)
}
var hn = {}
    , Me = []
    , Mt = new v("")
    , hu = new v("", -1)
    , pu = new v("")
    , Ro = class {
        get(t, n = Pn) {
            if (n === Pn) {
                let o = xp("", -201);
                throw o.name = "\u0275NotFound",
                o
            }
            return n
        }
    }
    ;
function Nt(e) {
    return {
        \u0275providers: e
    }
}
function jp(e) {
    return Nt([{
        provide: Mt,
        multi: !0,
        useValue: e
    }])
}
function Vp(...e) {
    return {
        \u0275providers: Ls(!0, e),
        \u0275fromNgModule: !0
    }
}
function Ls(e, ...t) {
    let n = [], r = new Set, o, i = s => {
        n.push(s)
    }
        ;
    return Os(t, s => {
        let a = s;
        Cs(a, i, [], r) && (o ||= [],
            o.push(a))
    }
    ),
        o !== void 0 && Up(o, i),
        n
}
function Up(e, t) {
    for (let n = 0; n < e.length; n++) {
        let { ngModule: r, providers: o } = e[n];
        gu(o, i => {
            t(i, r)
        }
        )
    }
}
function Cs(e, t, n, r) {
    if (e = De(e),
        !e)
        return !1;
    let o = null
        , i = zl(e)
        , s = !i && Qt(e);
    if (!i && !s) {
        let c = e.ngModule;
        if (i = zl(c),
            i)
            o = c;
        else
            return !1
    } else {
        if (s && !s.standalone)
            return !1;
        o = e
    }
    let a = r.has(o);
    if (s) {
        if (a)
            return !1;
        if (r.add(o),
            s.dependencies) {
            let c = typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
            for (let l of c)
                Cs(l, t, n, r)
        }
    } else if (i) {
        if (i.imports != null && !a) {
            r.add(o);
            let l;
            Os(i.imports, u => {
                Cs(u, t, n, r) && (l ||= [],
                    l.push(u))
            }
            ),
                l !== void 0 && Up(l, t)
        }
        if (!a) {
            let l = Fn(o) || (() => new o);
            t({
                provide: o,
                useFactory: l,
                deps: Me
            }, o),
                t({
                    provide: pu,
                    useValue: o,
                    multi: !0
                }, o),
                t({
                    provide: Mt,
                    useValue: () => k(o),
                    multi: !0
                }, o)
        }
        let c = i.providers;
        if (c != null && !a) {
            let l = e;
            gu(c, u => {
                t(u, l)
            }
            )
        }
    } else
        return !1;
    return o !== e && e.providers !== void 0
}
function gu(e, t) {
    for (let n of e)
        ru(n) && (n = n.\u0275providers),
            Array.isArray(n) ? gu(n, t) : t(n)
}
var dC = W({
    provide: String,
    useValue: W
});
function Hp(e) {
    return e !== null && typeof e == "object" && dC in e
}
function fC(e) {
    return !!(e && e.useExisting)
}
function hC(e) {
    return !!(e && e.useFactory)
}
function jn(e) {
    return typeof e == "function"
}
function Bp(e) {
    return !!e.useClass
}
var Lo = new v(""), Is = {}, Sp = {}, $l;
function Fo() {
    return $l === void 0 && ($l = new Ro),
        $l
}
var te = class {
}
    , Vn = class extends te {
        parent;
        source;
        scopes;
        records = new Map;
        _ngOnDestroyHooks = new Set;
        _onDestroyHooks = [];
        get destroyed() {
            return this._destroyed
        }
        _destroyed = !1;
        injectorDefTypes;
        constructor(t, n, r, o) {
            super(),
                this.parent = n,
                this.source = r,
                this.scopes = o,
                Zl(t, s => this.processProvider(s)),
                this.records.set(hu, Ar(void 0, this)),
                o.has("environment") && this.records.set(te, Ar(void 0, this));
            let i = this.records.get(Lo);
            i != null && typeof i.value == "string" && this.scopes.add(i.value),
                this.injectorDefTypes = new Set(this.get(pu, Me, {
                    self: !0
                }))
        }
        retrieve(t, n) {
            let r = Ln(n) || 0;
            try {
                return this.get(t, Pn, r)
            } catch (o) {
                if (Rr(o))
                    return o;
                throw o
            }
        }
        destroy() {
            Mo(this),
                this._destroyed = !0;
            let t = C(null);
            try {
                for (let r of this._ngOnDestroyHooks)
                    r.ngOnDestroy();
                let n = this._onDestroyHooks;
                this._onDestroyHooks = [];
                for (let r of n)
                    r()
            } finally {
                this.records.clear(),
                    this._ngOnDestroyHooks.clear(),
                    this.injectorDefTypes.clear(),
                    C(t)
            }
        }
        onDestroy(t) {
            return Mo(this),
                this._onDestroyHooks.push(t),
                () => this.removeOnDestroy(t)
        }
        runInContext(t) {
            Mo(this);
            let n = Tt(this), r = Ge(void 0), o;
            try {
                return t()
            } finally {
                Tt(n),
                    Ge(r)
            }
        }
        get(t, n = Pn, r) {
            if (Mo(this),
                t.hasOwnProperty(Tp))
                return t[Tp](this);
            let o = Ln(r), i, s = Tt(this), a = Ge(void 0);
            try {
                if (!(o & 4)) {
                    let l = this.records.get(t);
                    if (l === void 0) {
                        let u = yC(t) && ko(t);
                        u && this.injectableDefInScope(u) ? l = Ar(Ql(t), Is) : l = null,
                            this.records.set(t, l)
                    }
                    if (l != null)
                        return this.hydrate(t, l, o)
                }
                let c = o & 2 ? Fo() : this.parent;
                return n = o & 8 && n === Pn ? null : n,
                    c.get(t, n)
            } catch (c) {
                let l = oC(c);
                throw l === -200 || l === -201 ? new y(l, null) : c
            } finally {
                Ge(a),
                    Tt(s)
            }
        }
        resolveInjectorInitializers() {
            let t = C(null), n = Tt(this), r = Ge(void 0), o;
            try {
                let i = this.get(Mt, Me, {
                    self: !0
                });
                for (let s of i)
                    s()
            } finally {
                Tt(n),
                    Ge(r),
                    C(t)
            }
        }
        toString() {
            let t = []
                , n = this.records;
            for (let r of n.keys())
                t.push(qt(r));
            return `R3Injector[${t.join(", ")}]`
        }
        processProvider(t) {
            t = De(t);
            let n = jn(t) ? t : De(t && t.provide)
                , r = gC(t);
            if (!jn(t) && t.multi === !0) {
                let o = this.records.get(n);
                o || (o = Ar(void 0, Is, !0),
                    o.factory = () => Wl(o.multi),
                    this.records.set(n, o)),
                    n = t,
                    o.multi.push(t)
            }
            this.records.set(n, r)
        }
        hydrate(t, n, r) {
            let o = C(null);
            try {
                if (n.value === Sp)
                    throw uu(qt(t));
                return n.value === Is && (n.value = Sp,
                    n.value = n.factory(void 0, r)),
                    typeof n.value == "object" && n.value && vC(n.value) && this._ngOnDestroyHooks.add(n.value),
                    n.value
            } finally {
                C(o)
            }
        }
        injectableDefInScope(t) {
            if (!t.providedIn)
                return !1;
            let n = De(t.providedIn);
            return typeof n == "string" ? n === "any" || this.scopes.has(n) : this.injectorDefTypes.has(n)
        }
        removeOnDestroy(t) {
            let n = this._onDestroyHooks.indexOf(t);
            n !== -1 && this._onDestroyHooks.splice(n, 1)
        }
    }
    ;
function Ql(e) {
    let t = ko(e)
        , n = t !== null ? t.factory : Fn(e);
    if (n !== null)
        return n;
    if (e instanceof v)
        throw new y(204, !1);
    if (e instanceof Function)
        return pC(e);
    throw new y(204, !1)
}
function pC(e) {
    if (e.length > 0)
        throw new y(204, !1);
    let n = tC(e);
    return n !== null ? () => n.factory(e) : () => new e
}
function gC(e) {
    if (Hp(e))
        return Ar(void 0, e.useValue);
    {
        let t = mu(e);
        return Ar(t, Is)
    }
}
function mu(e, t, n) {
    let r;
    if (jn(e)) {
        let o = De(e);
        return Fn(o) || Ql(o)
    } else if (Hp(e))
        r = () => De(e.useValue);
    else if (hC(e))
        r = () => e.useFactory(...Wl(e.deps || []));
    else if (fC(e))
        r = (o, i) => k(De(e.useExisting), i !== void 0 && i & 8 ? 8 : void 0);
    else {
        let o = De(e && (e.useClass || e.provide));
        if (mC(e))
            r = () => new o(...Wl(e.deps));
        else
            return Fn(o) || Ql(o)
    }
    return r
}
function Mo(e) {
    if (e.destroyed)
        throw new y(205, !1)
}
function Ar(e, t, n = !1) {
    return {
        factory: e,
        value: t,
        multi: n ? [] : void 0
    }
}
function mC(e) {
    return !!e.deps
}
function vC(e) {
    return e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
}
function yC(e) {
    return typeof e == "function" || typeof e == "object" && e.ngMetadataName === "InjectionToken"
}
function Zl(e, t) {
    for (let n of e)
        Array.isArray(n) ? Zl(n, t) : n && ru(n) ? Zl(n.\u0275providers, t) : t(n)
}
function Ce(e, t) {
    let n;
    e instanceof Vn ? (Mo(e),
        n = e) : n = new ql(e);
    let r, o = Tt(n), i = Ge(void 0);
    try {
        return t()
    } finally {
        Tt(o),
            Ge(i)
    }
}
function $p() {
    return Op() !== void 0 || Es() != null
}
var xe = 0
    , D = 1
    , S = 2
    , oe = 3
    , ot = 4
    , Oe = 5
    , ke = 6
    , kr = 7
    , ie = 8
    , qe = 9
    , Rt = 10
    , B = 11
    , Pr = 12
    , vu = 13
    , Hn = 14
    , be = 15
    , pn = 16
    , Bn = 17
    , At = 18
    , Zt = 19
    , yu = 20
    , Gt = 21
    , Fs = 22
    , un = 23
    , We = 24
    , $n = 25
    , zn = 26
    , Q = 27
    , zp = 1
    , vt = 6
    , xt = 7
    , jo = 8
    , Gn = 9
    , J = 10;
function Qe(e) {
    return Array.isArray(e) && typeof e[zp] == "object"
}
function Ze(e) {
    return Array.isArray(e) && e[zp] === !0
}
function Eu(e) {
    return (e.flags & 4) !== 0
}
function Yt(e) {
    return e.componentOffset > -1
}
function js(e) {
    return (e.flags & 1) === 1
}
function Ot(e) {
    return !!e.template
}
function qn(e) {
    return (e[S] & 512) !== 0
}
function gn(e) {
    return (e[S] & 256) === 256
}
var Iu = "svg"
    , Gp = "math";
function Ye(e) {
    for (; Array.isArray(e);)
        e = e[xe];
    return e
}
function Du(e, t) {
    return Ye(t[e])
}
function it(e, t) {
    return Ye(t[e.index])
}
function Wn(e, t) {
    return e.data[t]
}
function st(e, t) {
    let n = t[e];
    return Qe(n) ? n : n[xe]
}
function qp(e) {
    return (e[S] & 4) === 4
}
function Vs(e) {
    return (e[S] & 128) === 128
}
function Wp(e) {
    return Ze(e[oe])
}
function kt(e, t) {
    return t == null ? null : e[t]
}
function Cu(e) {
    e[Bn] = 0
}
function bu(e) {
    e[S] & 1024 || (e[S] |= 1024,
        Vs(e) && Qn(e))
}
function Qp(e, t) {
    for (; e > 0;)
        t = t[Hn],
            e--;
    return t
}
function Vo(e) {
    return !!(e[S] & 9216 || e[We]?.dirty)
}
function Us(e) {
    e[Rt].changeDetectionScheduler?.notify(8),
        e[S] & 64 && (e[S] |= 1024),
        Vo(e) && Qn(e)
}
function Qn(e) {
    e[Rt].changeDetectionScheduler?.notify(0);
    let t = dn(e);
    for (; t !== null && !(t[S] & 8192 || (t[S] |= 8192,
        !Vs(t)));)
        t = dn(t)
}
function wu(e, t) {
    if (gn(e))
        throw new y(911, !1);
    e[Gt] === null && (e[Gt] = []),
        e[Gt].push(t)
}
function Zp(e, t) {
    if (e[Gt] === null)
        return;
    let n = e[Gt].indexOf(t);
    n !== -1 && e[Gt].splice(n, 1)
}
function dn(e) {
    let t = e[oe];
    return Ze(t) ? t[oe] : t
}
function _u(e) {
    return e[kr] ??= []
}
function Tu(e) {
    return e.cleanup ??= []
}
function Yp(e, t, n, r) {
    let o = _u(t);
    o.push(n),
        e.firstCreatePass && Tu(e).push(r, o.length - 1)
}
var O = {
    lFrame: cg(null),
    bindingsEnabled: !0,
    skipHydrationRootTNode: null
};
var Yl = !1;
function Kp() {
    return O.lFrame.elementDepthCount
}
function Jp() {
    O.lFrame.elementDepthCount++
}
function Su() {
    O.lFrame.elementDepthCount--
}
function Xp() {
    return O.bindingsEnabled
}
function Hs() {
    return O.skipHydrationRootTNode !== null
}
function Mu(e) {
    return O.skipHydrationRootTNode === e
}
function eg(e) {
    O.skipHydrationRootTNode = e
}
function Nu() {
    O.skipHydrationRootTNode = null
}
function A() {
    return O.lFrame.lView
}
function ue() {
    return O.lFrame.tView
}
function Pe(e) {
    return O.lFrame.contextLView = e,
        e[ie]
}
function Le(e) {
    return O.lFrame.contextLView = null,
        e
}
function we() {
    let e = Ru();
    for (; e !== null && e.type === 64;)
        e = e.parent;
    return e
}
function Ru() {
    return O.lFrame.currentTNode
}
function tg() {
    let e = O.lFrame
        , t = e.currentTNode;
    return e.isParent ? t : t.parent
}
function Lr(e, t) {
    let n = O.lFrame;
    n.currentTNode = e,
        n.isParent = t
}
function Au() {
    return O.lFrame.isParent
}
function xu() {
    O.lFrame.isParent = !1
}
function Ou() {
    return Yl
}
function Ao(e) {
    let t = Yl;
    return Yl = e,
        t
}
function ku() {
    let e = O.lFrame
        , t = e.bindingRootIndex;
    return t === -1 && (t = e.bindingRootIndex = e.tView.bindingStartIndex),
        t
}
function ng(e) {
    return O.lFrame.bindingIndex = e
}
function Zn() {
    return O.lFrame.bindingIndex++
}
function Pu(e) {
    let t = O.lFrame
        , n = t.bindingIndex;
    return t.bindingIndex = t.bindingIndex + e,
        n
}
function rg() {
    return O.lFrame.inI18n
}
function og(e, t) {
    let n = O.lFrame;
    n.bindingIndex = n.bindingRootIndex = e,
        Bs(t)
}
function ig() {
    return O.lFrame.currentDirectiveIndex
}
function Bs(e) {
    O.lFrame.currentDirectiveIndex = e
}
function sg(e) {
    let t = O.lFrame.currentDirectiveIndex;
    return t === -1 ? null : e[t]
}
function $s() {
    return O.lFrame.currentQueryIndex
}
function Uo(e) {
    O.lFrame.currentQueryIndex = e
}
function EC(e) {
    let t = e[D];
    return t.type === 2 ? t.declTNode : t.type === 1 ? e[Oe] : null
}
function Lu(e, t, n) {
    if (n & 4) {
        let o = t
            , i = e;
        for (; o = o.parent,
            o === null && !(n & 1);)
            if (o = EC(i),
                o === null || (i = i[Hn],
                    o.type & 10))
                break;
        if (o === null)
            return !1;
        t = o,
            e = i
    }
    let r = O.lFrame = ag();
    return r.currentTNode = t,
        r.lView = e,
        !0
}
function zs(e) {
    let t = ag()
        , n = e[D];
    O.lFrame = t,
        t.currentTNode = n.firstChild,
        t.lView = e,
        t.tView = n,
        t.contextLView = e,
        t.bindingIndex = n.bindingStartIndex,
        t.inI18n = !1
}
function ag() {
    let e = O.lFrame
        , t = e === null ? null : e.child;
    return t === null ? cg(e) : t
}
function cg(e) {
    let t = {
        currentTNode: null,
        isParent: !0,
        lView: null,
        tView: null,
        selectedIndex: -1,
        contextLView: null,
        elementDepthCount: 0,
        currentNamespace: null,
        currentDirectiveIndex: -1,
        bindingRootIndex: -1,
        bindingIndex: -1,
        currentQueryIndex: 0,
        parent: e,
        child: null,
        inI18n: !1
    };
    return e !== null && (e.child = t),
        t
}
function lg() {
    let e = O.lFrame;
    return O.lFrame = e.parent,
        e.currentTNode = null,
        e.lView = null,
        e
}
var Fu = lg;
function Gs() {
    let e = lg();
    e.isParent = !0,
        e.tView = null,
        e.selectedIndex = -1,
        e.contextLView = null,
        e.elementDepthCount = 0,
        e.currentDirectiveIndex = -1,
        e.currentNamespace = null,
        e.bindingRootIndex = -1,
        e.bindingIndex = -1,
        e.currentQueryIndex = 0
}
function ug(e) {
    return (O.lFrame.contextLView = Qp(e, O.lFrame.contextLView))[ie]
}
function Kt() {
    return O.lFrame.selectedIndex
}
function mn(e) {
    O.lFrame.selectedIndex = e
}
function qs() {
    let e = O.lFrame;
    return Wn(e.tView, e.selectedIndex)
}
function je() {
    O.lFrame.currentNamespace = Iu
}
function at() {
    IC()
}
function IC() {
    O.lFrame.currentNamespace = null
}
function ju() {
    return O.lFrame.currentNamespace
}
var dg = !0;
function Ws() {
    return dg
}
function Jt(e) {
    dg = e
}
function Kl(e, t = null, n = null, r) {
    let o = Vu(e, t, n, r);
    return o.resolveInjectorInitializers(),
        o
}
function Vu(e, t = null, n = null, r, o = new Set) {
    let i = [n || Me, Vp(e)];
    return r = r || (typeof e == "object" ? void 0 : qt(e)),
        new Vn(i, t || Fo(), r || null, o)
}
var Ne = class e {
    static THROW_IF_NOT_FOUND = Pn;
    static NULL = new Ro;
    static create(t, n) {
        if (Array.isArray(t))
            return Kl({
                name: ""
            }, n, t, "");
        {
            let r = t.name ?? "";
            return Kl({
                name: r
            }, t.parent, t.providers, r)
        }
    }
    static \u0275prov = w({
        token: e,
        providedIn: "any",
        factory: () => k(hu)
    });
    static __NG_ELEMENT_ID__ = -1
}
    , ne = new v("")
    , Ve = (() => {
        class e {
            static __NG_ELEMENT_ID__ = DC;
            static __NG_ENV_ID__ = n => n
        }
        return e
    }
    )()
    , bs = class extends Ve {
        _lView;
        constructor(t) {
            super(),
                this._lView = t
        }
        get destroyed() {
            return gn(this._lView)
        }
        onDestroy(t) {
            let n = this._lView;
            return wu(n, t),
                () => Zp(n, t)
        }
    }
    ;
function DC() {
    return new bs(A())
}
var fg = !1
    , hg = new v("")
    , Pt = (() => {
        class e {
            taskId = 0;
            pendingTasks = new Set;
            destroyed = !1;
            pendingTask = new Ee(!1);
            debugTaskTracker = p(hg, {
                optional: !0
            });
            get hasPendingTasks() {
                return this.destroyed ? !1 : this.pendingTask.value
            }
            get hasPendingTasksObservable() {
                return this.destroyed ? new V(n => {
                    n.next(!1),
                        n.complete()
                }
                ) : this.pendingTask
            }
            add() {
                !this.hasPendingTasks && !this.destroyed && this.pendingTask.next(!0);
                let n = this.taskId++;
                return this.pendingTasks.add(n),
                    this.debugTaskTracker?.add(n),
                    n
            }
            has(n) {
                return this.pendingTasks.has(n)
            }
            remove(n) {
                this.pendingTasks.delete(n),
                    this.debugTaskTracker?.remove(n),
                    this.pendingTasks.size === 0 && this.hasPendingTasks && this.pendingTask.next(!1)
            }
            ngOnDestroy() {
                this.pendingTasks.clear(),
                    this.hasPendingTasks && this.pendingTask.next(!1),
                    this.destroyed = !0,
                    this.pendingTask.unsubscribe()
            }
            static \u0275prov = w({
                token: e,
                providedIn: "root",
                factory: () => new e
            })
        }
        return e
    }
    )()
    , Jl = class extends ce {
        __isAsync;
        destroyRef = void 0;
        pendingTasks = void 0;
        constructor(t = !1) {
            super(),
                this.__isAsync = t,
                $p() && (this.destroyRef = p(Ve, {
                    optional: !0
                }) ?? void 0,
                    this.pendingTasks = p(Pt, {
                        optional: !0
                    }) ?? void 0)
        }
        emit(t) {
            let n = C(null);
            try {
                super.next(t)
            } finally {
                C(n)
            }
        }
        subscribe(t, n, r) {
            let o = t
                , i = n || (() => null)
                , s = r;
            if (t && typeof t == "object") {
                let c = t;
                o = c.next?.bind(c),
                    i = c.error?.bind(c),
                    s = c.complete?.bind(c)
            }
            this.__isAsync && (i = this.wrapInTimeout(i),
                o && (o = this.wrapInTimeout(o)),
                s && (s = this.wrapInTimeout(s)));
            let a = super.subscribe({
                next: o,
                error: i,
                complete: s
            });
            return t instanceof ye && t.add(a),
                a
        }
        wrapInTimeout(t) {
            return n => {
                let r = this.pendingTasks?.add();
                setTimeout(() => {
                    try {
                        t(n)
                    } finally {
                        r !== void 0 && this.pendingTasks?.remove(r)
                    }
                }
                )
            }
        }
    }
    , ee = Jl;
function ws(...e) { }
function Uu(e) {
    let t, n;
    function r() {
        e = ws;
        try {
            n !== void 0 && typeof cancelAnimationFrame == "function" && cancelAnimationFrame(n),
                t !== void 0 && clearTimeout(t)
        } catch { }
    }
    return t = setTimeout(() => {
        e(),
            r()
    }
    ),
        typeof requestAnimationFrame == "function" && (n = requestAnimationFrame(() => {
            e(),
                r()
        }
        )),
        () => r()
}
function pg(e) {
    return queueMicrotask(() => e()),
        () => {
            e = ws
        }
}
var Hu = "isAngularZone"
    , xo = Hu + "_ID"
    , CC = 0
    , Ae = class e {
        hasPendingMacrotasks = !1;
        hasPendingMicrotasks = !1;
        isStable = !0;
        onUnstable = new ee(!1);
        onMicrotaskEmpty = new ee(!1);
        onStable = new ee(!1);
        onError = new ee(!1);
        constructor(t) {
            let { enableLongStackTrace: n = !1, shouldCoalesceEventChangeDetection: r = !1, shouldCoalesceRunChangeDetection: o = !1, scheduleInRootZone: i = fg } = t;
            if (typeof Zone > "u")
                throw new y(908, !1);
            Zone.assertZonePatched();
            let s = this;
            s._nesting = 0,
                s._outer = s._inner = Zone.current,
                Zone.TaskTrackingZoneSpec && (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec)),
                n && Zone.longStackTraceZoneSpec && (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)),
                s.shouldCoalesceEventChangeDetection = !o && r,
                s.shouldCoalesceRunChangeDetection = o,
                s.callbackScheduled = !1,
                s.scheduleInRootZone = i,
                _C(s)
        }
        static isInAngularZone() {
            return typeof Zone < "u" && Zone.current.get(Hu) === !0
        }
        static assertInAngularZone() {
            if (!e.isInAngularZone())
                throw new y(909, !1)
        }
        static assertNotInAngularZone() {
            if (e.isInAngularZone())
                throw new y(909, !1)
        }
        run(t, n, r) {
            return this._inner.run(t, n, r)
        }
        runTask(t, n, r, o) {
            let i = this._inner
                , s = i.scheduleEventTask("NgZoneEvent: " + o, t, bC, ws, ws);
            try {
                return i.runTask(s, n, r)
            } finally {
                i.cancelTask(s)
            }
        }
        runGuarded(t, n, r) {
            return this._inner.runGuarded(t, n, r)
        }
        runOutsideAngular(t) {
            return this._outer.run(t)
        }
    }
    , bC = {};
function Bu(e) {
    if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
        try {
            e._nesting++,
                e.onMicrotaskEmpty.emit(null)
        } finally {
            if (e._nesting--,
                !e.hasPendingMicrotasks)
                try {
                    e.runOutsideAngular(() => e.onStable.emit(null))
                } finally {
                    e.isStable = !0
                }
        }
}
function wC(e) {
    if (e.isCheckStableRunning || e.callbackScheduled)
        return;
    e.callbackScheduled = !0;
    function t() {
        Uu(() => {
            e.callbackScheduled = !1,
                Xl(e),
                e.isCheckStableRunning = !0,
                Bu(e),
                e.isCheckStableRunning = !1
        }
        )
    }
    e.scheduleInRootZone ? Zone.root.run(() => {
        t()
    }
    ) : e._outer.run(() => {
        t()
    }
    ),
        Xl(e)
}
function _C(e) {
    let t = () => {
        wC(e)
    }
        , n = CC++;
    e._inner = e._inner.fork({
        name: "angular",
        properties: {
            [Hu]: !0,
            [xo]: n,
            [xo + n]: !0
        },
        onInvokeTask: (r, o, i, s, a, c) => {
            if (TC(c))
                return r.invokeTask(i, s, a, c);
            try {
                return Mp(e),
                    r.invokeTask(i, s, a, c)
            } finally {
                (e.shouldCoalesceEventChangeDetection && s.type === "eventTask" || e.shouldCoalesceRunChangeDetection) && t(),
                    Np(e)
            }
        }
        ,
        onInvoke: (r, o, i, s, a, c, l) => {
            try {
                return Mp(e),
                    r.invoke(i, s, a, c, l)
            } finally {
                e.shouldCoalesceRunChangeDetection && !e.callbackScheduled && !SC(c) && t(),
                    Np(e)
            }
        }
        ,
        onHasTask: (r, o, i, s) => {
            r.hasTask(i, s),
                o === i && (s.change == "microTask" ? (e._hasPendingMicrotasks = s.microTask,
                    Xl(e),
                    Bu(e)) : s.change == "macroTask" && (e.hasPendingMacrotasks = s.macroTask))
        }
        ,
        onHandleError: (r, o, i, s) => (r.handleError(i, s),
            e.runOutsideAngular(() => e.onError.emit(s)),
            !1)
    })
}
function Xl(e) {
    e._hasPendingMicrotasks || (e.shouldCoalesceEventChangeDetection || e.shouldCoalesceRunChangeDetection) && e.callbackScheduled === !0 ? e.hasPendingMicrotasks = !0 : e.hasPendingMicrotasks = !1
}
function Mp(e) {
    e._nesting++,
        e.isStable && (e.isStable = !1,
            e.onUnstable.emit(null))
}
function Np(e) {
    e._nesting--,
        Bu(e)
}
var Oo = class {
    hasPendingMicrotasks = !1;
    hasPendingMacrotasks = !1;
    isStable = !0;
    onUnstable = new ee;
    onMicrotaskEmpty = new ee;
    onStable = new ee;
    onError = new ee;
    run(t, n, r) {
        return t.apply(n, r)
    }
    runGuarded(t, n, r) {
        return t.apply(n, r)
    }
    runOutsideAngular(t) {
        return t()
    }
    runTask(t, n, r, o) {
        return t.apply(n, r)
    }
}
    ;
function TC(e) {
    return gg(e, "__ignore_ng_zone__")
}
function SC(e) {
    return gg(e, "__scheduler_tick__")
}
function gg(e, t) {
    return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[t] === !0
}
var rt = class {
    _console = console;
    handleError(t) {
        this._console.error("ERROR", t)
    }
}
    , ct = new v("", {
        factory: () => {
            let e = p(Ae), t = p(te), n;
            return r => {
                e.runOutsideAngular(() => {
                    t.destroyed && !n ? setTimeout(() => {
                        throw r
                    }
                    ) : (n ??= t.get(rt),
                        n.handleError(r))
                }
                )
            }
        }
    })
    , mg = {
        provide: Mt,
        useValue: () => {
            let e = p(rt, {
                optional: !0
            })
        }
        ,
        multi: !0
    }
    , MC = new v("", {
        factory: () => {
            let e = p(ne).defaultView;
            if (!e)
                return;
            let t = p(ct)
                , n = i => {
                    t(i.reason),
                        i.preventDefault()
                }
                , r = i => {
                    i.error ? t(i.error) : t(new Error(i.message, {
                        cause: i
                    })),
                        i.preventDefault()
                }
                , o = () => {
                    e.addEventListener("unhandledrejection", n),
                        e.addEventListener("error", r)
                }
                ;
            typeof Zone < "u" ? Zone.root.run(o) : o(),
                p(Ve).onDestroy(() => {
                    e.removeEventListener("error", r),
                        e.removeEventListener("unhandledrejection", n)
                }
                )
        }
    });
function $u() {
    return Nt([jp(() => {
        p(MC)
    }
    )])
}
function $(e, t) {
    let [n, r, o] = _l(e, t?.equal)
        , i = n
        , s = i[ve];
    return i.set = r,
        i.update = o,
        i.asReadonly = Qs.bind(i),
        i
}
function Qs() {
    let e = this[ve];
    if (e.readonlyFn === void 0) {
        let t = () => this();
        t[ve] = e,
            e.readonlyFn = t
    }
    return e.readonlyFn
}
var Ho = (() => {
    class e {
        view;
        node;
        constructor(n, r) {
            this.view = n,
                this.node = r
        }
        static __NG_ELEMENT_ID__ = NC
    }
    return e
}
)();
function NC() {
    return new Ho(A(), we())
}
var Wt = class {
}
    , Bo = new v("", {
        factory: () => !0
    });
var zu = new v("")
    , $o = (() => {
        class e {
            internalPendingTasks = p(Pt);
            scheduler = p(Wt);
            errorHandler = p(ct);
            add() {
                let n = this.internalPendingTasks.add();
                return () => {
                    this.internalPendingTasks.has(n) && (this.scheduler.notify(11),
                        this.internalPendingTasks.remove(n))
                }
            }
            run(n) {
                let r = this.add();
                n().catch(this.errorHandler).finally(r)
            }
            static \u0275prov = w({
                token: e,
                providedIn: "root",
                factory: () => new e
            })
        }
        return e
    }
    )()
    , Zs = (() => {
        class e {
            static \u0275prov = w({
                token: e,
                providedIn: "root",
                factory: () => new eu
            })
        }
        return e
    }
    )()
    , eu = class {
        dirtyEffectCount = 0;
        queues = new Map;
        add(t) {
            this.enqueue(t),
                this.schedule(t)
        }
        schedule(t) {
            t.dirty && this.dirtyEffectCount++
        }
        remove(t) {
            let n = t.zone
                , r = this.queues.get(n);
            r.has(t) && (r.delete(t),
                t.dirty && this.dirtyEffectCount--)
        }
        enqueue(t) {
            let n = t.zone;
            this.queues.has(n) || this.queues.set(n, new Set);
            let r = this.queues.get(n);
            r.has(t) || r.add(t)
        }
        flush() {
            for (; this.dirtyEffectCount > 0;) {
                let t = !1;
                for (let [n, r] of this.queues)
                    n === null ? t ||= this.flushQueue(r) : t ||= n.run(() => this.flushQueue(r));
                t || (this.dirtyEffectCount = 0)
            }
        }
        flushQueue(t) {
            let n = !1;
            for (let r of t)
                r.dirty && (this.dirtyEffectCount--,
                    n = !0,
                    r.run());
            return n
        }
    }
    , _s = class {
        [ve];
        constructor(t) {
            this[ve] = t
        }
        destroy() {
            this[ve].destroy()
        }
    }
    ;
function zo(e, t) {
    let n = t?.injector ?? p(Ne), r = t?.manualCleanup !== !0 ? n.get(Ve) : null, o, i = n.get(Ho, null, {
        optional: !0
    }), s = n.get(Wt);
    return i !== null ? (o = xC(i.view, s, e),
        r instanceof bs && r._lView === i.view && (r = null)) : o = OC(e, n.get(Zs), s),
        o.injector = n,
        r !== null && (o.onDestroyFns = [r.onDestroy(() => o.destroy())]),
        new _s(o)
}
var vg = P(m({}, Sl), {
    cleanupFns: void 0,
    zone: null,
    onDestroyFns: null,
    run() {
        let e = Ao(!1);
        try {
            Ml(this)
        } finally {
            Ao(e)
        }
    },
    cleanup() {
        if (!this.cleanupFns?.length)
            return;
        let e = C(null);
        try {
            for (; this.cleanupFns.length;)
                this.cleanupFns.pop()()
        } finally {
            this.cleanupFns = [],
                C(e)
        }
    }
})
    , RC = P(m({}, vg), {
        consumerMarkedDirty() {
            this.scheduler.schedule(this),
                this.notifier.notify(12)
        },
        destroy() {
            if (Rn(this),
                this.onDestroyFns !== null)
                for (let e of this.onDestroyFns)
                    e();
            this.cleanup(),
                this.scheduler.remove(this)
        }
    })
    , AC = P(m({}, vg), {
        consumerMarkedDirty() {
            this.view[S] |= 8192,
                Qn(this.view),
                this.notifier.notify(13)
        },
        destroy() {
            if (Rn(this),
                this.onDestroyFns !== null)
                for (let e of this.onDestroyFns)
                    e();
            this.cleanup(),
                this.view[un]?.delete(this)
        }
    });
function xC(e, t, n) {
    let r = Object.create(AC);
    return r.view = e,
        r.zone = typeof Zone < "u" ? Zone.current : null,
        r.notifier = t,
        r.fn = yg(r, n),
        e[un] ??= new Set,
        e[un].add(r),
        r.consumerMarkedDirty(r),
        r
}
function OC(e, t, n) {
    let r = Object.create(RC);
    return r.fn = yg(r, e),
        r.scheduler = t,
        r.notifier = n,
        r.zone = typeof Zone < "u" ? Zone.current : null,
        r.scheduler.add(r),
        r.notifier.notify(12),
        r
}
function yg(e, t) {
    return () => {
        t(n => (e.cleanupFns ??= []).push(n))
    }
}
function de(e) {
    return Tl(e)
}
var Ys = {
    JSACTION: "jsaction"
};
function ni(e) {
    return {
        toString: e
    }.toString()
}
function UC(e) {
    return typeof e == "function"
}
function rm(e, t, n, r) {
    t !== null ? t.applyValueToInputSignal(t, r) : e[n] = r
}
var sa = class {
    previousValue;
    currentValue;
    firstChange;
    constructor(t, n, r) {
        this.previousValue = t,
            this.currentValue = n,
            this.firstChange = r
    }
    isFirstChange() {
        return this.firstChange
    }
}
    , jt = (() => {
        let e = () => om;
        return e.ngInherit = !0,
            e
    }
    )();
function om(e) {
    return e.type.prototype.ngOnChanges && (e.setInput = BC),
        HC
}
function HC() {
    let e = sm(this)
        , t = e?.current;
    if (t) {
        let n = e.previous;
        if (n === hn)
            e.previous = t;
        else
            for (let r in t)
                n[r] = t[r];
        e.current = null,
            this.ngOnChanges(t)
    }
}
function BC(e, t, n, r, o) {
    let i = this.declaredInputs[r]
        , s = sm(e) || $C(e, {
            previous: hn,
            current: null
        })
        , a = s.current || (s.current = {})
        , c = s.previous
        , l = c[i];
    a[i] = new sa(l && l.currentValue, n, c === hn),
        rm(e, t, o, n)
}
var im = "__ngSimpleChanges__";
function sm(e) {
    return e[im] || null
}
function $C(e, t) {
    return e[im] = t
}
var Eg = [];
var U = function (e, t = null, n) {
    for (let r = 0; r < Eg.length; r++) {
        let o = Eg[r];
        o(e, t, n)
    }
}
    , j = (function (e) {
        return e[e.TemplateCreateStart = 0] = "TemplateCreateStart",
            e[e.TemplateCreateEnd = 1] = "TemplateCreateEnd",
            e[e.TemplateUpdateStart = 2] = "TemplateUpdateStart",
            e[e.TemplateUpdateEnd = 3] = "TemplateUpdateEnd",
            e[e.LifecycleHookStart = 4] = "LifecycleHookStart",
            e[e.LifecycleHookEnd = 5] = "LifecycleHookEnd",
            e[e.OutputStart = 6] = "OutputStart",
            e[e.OutputEnd = 7] = "OutputEnd",
            e[e.BootstrapApplicationStart = 8] = "BootstrapApplicationStart",
            e[e.BootstrapApplicationEnd = 9] = "BootstrapApplicationEnd",
            e[e.BootstrapComponentStart = 10] = "BootstrapComponentStart",
            e[e.BootstrapComponentEnd = 11] = "BootstrapComponentEnd",
            e[e.ChangeDetectionStart = 12] = "ChangeDetectionStart",
            e[e.ChangeDetectionEnd = 13] = "ChangeDetectionEnd",
            e[e.ChangeDetectionSyncStart = 14] = "ChangeDetectionSyncStart",
            e[e.ChangeDetectionSyncEnd = 15] = "ChangeDetectionSyncEnd",
            e[e.AfterRenderHooksStart = 16] = "AfterRenderHooksStart",
            e[e.AfterRenderHooksEnd = 17] = "AfterRenderHooksEnd",
            e[e.ComponentStart = 18] = "ComponentStart",
            e[e.ComponentEnd = 19] = "ComponentEnd",
            e[e.DeferBlockStateStart = 20] = "DeferBlockStateStart",
            e[e.DeferBlockStateEnd = 21] = "DeferBlockStateEnd",
            e[e.DynamicComponentStart = 22] = "DynamicComponentStart",
            e[e.DynamicComponentEnd = 23] = "DynamicComponentEnd",
            e[e.HostBindingsUpdateStart = 24] = "HostBindingsUpdateStart",
            e[e.HostBindingsUpdateEnd = 25] = "HostBindingsUpdateEnd",
            e
    }
    )(j || {});
function zC(e, t, n) {
    let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
    if (r) {
        let s = om(t);
        (n.preOrderHooks ??= []).push(e, s),
            (n.preOrderCheckHooks ??= []).push(e, s)
    }
    o && (n.preOrderHooks ??= []).push(0 - e, o),
        i && ((n.preOrderHooks ??= []).push(e, i),
            (n.preOrderCheckHooks ??= []).push(e, i))
}
function GC(e, t) {
    for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
        let i = e.data[n].type.prototype
            , { ngAfterContentInit: s, ngAfterContentChecked: a, ngAfterViewInit: c, ngAfterViewChecked: l, ngOnDestroy: u } = i;
        s && (e.contentHooks ??= []).push(-n, s),
            a && ((e.contentHooks ??= []).push(n, a),
                (e.contentCheckHooks ??= []).push(n, a)),
            c && (e.viewHooks ??= []).push(-n, c),
            l && ((e.viewHooks ??= []).push(n, l),
                (e.viewCheckHooks ??= []).push(n, l)),
            u != null && (e.destroyHooks ??= []).push(n, u)
    }
}
function Xs(e, t, n) {
    am(e, t, 3, n)
}
function ea(e, t, n, r) {
    (e[S] & 3) === n && am(e, t, n, r)
}
function Gu(e, t) {
    let n = e[S];
    (n & 3) === t && (n &= 16383,
        n += 1,
        e[S] = n)
}
function am(e, t, n, r) {
    let o = r !== void 0 ? e[Bn] & 65535 : 0
        , i = r ?? -1
        , s = t.length - 1
        , a = 0;
    for (let c = o; c < s; c++)
        if (typeof t[c + 1] == "number") {
            if (a = t[c],
                r != null && a >= r)
                break
        } else
            t[c] < 0 && (e[Bn] += 65536),
                (a < i || i == -1) && (qC(e, n, t, c),
                    e[Bn] = (e[Bn] & 4294901760) + c + 2),
                c++
}
function Ig(e, t) {
    U(j.LifecycleHookStart, e, t);
    let n = C(null);
    try {
        t.call(e)
    } finally {
        C(n),
            U(j.LifecycleHookEnd, e, t)
    }
}
function qC(e, t, n, r) {
    let o = n[r] < 0
        , i = n[r + 1]
        , s = o ? -n[r] : n[r]
        , a = e[s];
    o ? e[S] >> 14 < e[Bn] >> 16 && (e[S] & 3) === t && (e[S] += 16384,
        Ig(a, i)) : Ig(a, i)
}
var jr = -1
    , Jn = class {
        factory;
        name;
        injectImpl;
        resolving = !1;
        canSeeViewProviders;
        multi;
        componentProviders;
        index;
        providerFactory;
        constructor(t, n, r, o) {
            this.factory = t,
                this.name = o,
                this.canSeeViewProviders = n,
                this.injectImpl = r
        }
    }
    ;
function WC(e) {
    return (e.flags & 8) !== 0
}
function QC(e) {
    return (e.flags & 16) !== 0
}
function ZC(e, t, n) {
    let r = 0;
    for (; r < n.length;) {
        let o = n[r];
        if (typeof o == "number") {
            if (o !== 0)
                break;
            r++;
            let i = n[r++]
                , s = n[r++]
                , a = n[r++];
            e.setAttribute(t, s, a, i)
        } else {
            let i = o
                , s = n[++r];
            YC(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s),
                r++
        }
    }
    return r
}
function cm(e) {
    return e === 3 || e === 4 || e === 6
}
function YC(e) {
    return e.charCodeAt(0) === 64
}
function Hr(e, t) {
    if (!(t === null || t.length === 0))
        if (e === null || e.length === 0)
            e = t.slice();
        else {
            let n = -1;
            for (let r = 0; r < t.length; r++) {
                let o = t[r];
                typeof o == "number" ? n = o : n === 0 || (n === -1 || n === 2 ? Dg(e, n, o, null, t[++r]) : Dg(e, n, o, null, null))
            }
        }
    return e
}
function Dg(e, t, n, r, o) {
    let i = 0
        , s = e.length;
    if (t === -1)
        s = -1;
    else
        for (; i < e.length;) {
            let a = e[i++];
            if (typeof a == "number") {
                if (a === t) {
                    s = -1;
                    break
                } else if (a > t) {
                    s = i - 1;
                    break
                }
            }
        }
    for (; i < e.length;) {
        let a = e[i];
        if (typeof a == "number")
            break;
        if (a === n) {
            o !== null && (e[i + 1] = o);
            return
        }
        i++,
            o !== null && i++
    }
    s !== -1 && (e.splice(s, 0, t),
        i = s + 1),
        e.splice(i++, 0, n),
        o !== null && e.splice(i++, 0, o)
}
function lm(e) {
    return e !== jr
}
function aa(e) {
    return e & 32767
}
function KC(e) {
    return e >> 16
}
function ca(e, t) {
    let n = KC(e)
        , r = t;
    for (; n > 0;)
        r = r[Hn],
            n--;
    return r
}
var od = !0;
function Cg(e) {
    let t = od;
    return od = e,
        t
}
var JC = 256
    , um = JC - 1
    , dm = 5
    , XC = 0
    , Lt = {};
function eb(e, t, n) {
    let r;
    typeof n == "string" ? r = n.charCodeAt(0) || 0 : n.hasOwnProperty(Un) && (r = n[Un]),
        r == null && (r = n[Un] = XC++);
    let o = r & um
        , i = 1 << o;
    t.data[e + (o >> dm)] |= i
}
function la(e, t) {
    let n = fm(e, t);
    if (n !== -1)
        return n;
    let r = t[D];
    r.firstCreatePass && (e.injectorIndex = t.length,
        qu(r.data, e),
        qu(t, null),
        qu(r.blueprint, null));
    let o = xd(e, t)
        , i = e.injectorIndex;
    if (lm(o)) {
        let s = aa(o)
            , a = ca(o, t)
            , c = a[D].data;
        for (let l = 0; l < 8; l++)
            t[i + l] = a[s + l] | c[s + l]
    }
    return t[i + 8] = o,
        i
}
function qu(e, t) {
    e.push(0, 0, 0, 0, 0, 0, 0, 0, t)
}
function fm(e, t) {
    return e.injectorIndex === -1 || e.parent && e.parent.injectorIndex === e.injectorIndex || t[e.injectorIndex + 8] === null ? -1 : e.injectorIndex
}
function xd(e, t) {
    if (e.parent && e.parent.injectorIndex !== -1)
        return e.parent.injectorIndex;
    let n = 0
        , r = null
        , o = t;
    for (; o !== null;) {
        if (r = vm(o),
            r === null)
            return jr;
        if (n++,
            o = o[Hn],
            r.injectorIndex !== -1)
            return r.injectorIndex | n << 16
    }
    return jr
}
function id(e, t, n) {
    eb(e, t, n)
}
function tb(e, t) {
    if (t === "class")
        return e.classes;
    if (t === "style")
        return e.styles;
    let n = e.attrs;
    if (n) {
        let r = n.length
            , o = 0;
        for (; o < r;) {
            let i = n[o];
            if (cm(i))
                break;
            if (i === 0)
                o = o + 2;
            else if (typeof i == "number")
                for (o++; o < r && typeof n[o] == "string";)
                    o++;
            else {
                if (i === t)
                    return n[o + 1];
                o = o + 2
            }
        }
    }
    return null
}
function hm(e, t, n) {
    if (n & 8 || e !== void 0)
        return e;
    xs(t, "NodeInjector")
}
function pm(e, t, n, r) {
    if (n & 8 && r === void 0 && (r = null),
        (n & 3) === 0) {
        let o = e[qe]
            , i = Ge(void 0);
        try {
            return o ? o.get(t, r, n & 8) : du(t, r, n & 8)
        } finally {
            Ge(i)
        }
    }
    return hm(r, t, n)
}
function gm(e, t, n, r = 0, o) {
    if (e !== null) {
        if (t[S] & 2048 && !(r & 2)) {
            let s = ib(e, t, n, r, Lt);
            if (s !== Lt)
                return s
        }
        let i = mm(e, t, n, r, Lt);
        if (i !== Lt)
            return i
    }
    return pm(t, n, r, o)
}
function mm(e, t, n, r, o) {
    let i = rb(n);
    if (typeof i == "function") {
        if (!Lu(t, e, r))
            return r & 1 ? hm(o, n, r) : pm(t, n, r, o);
        try {
            let s;
            if (s = i(r),
                s == null && !(r & 8))
                xs(n);
            else
                return s
        } finally {
            Fu()
        }
    } else if (typeof i == "number") {
        let s = null
            , a = fm(e, t)
            , c = jr
            , l = r & 1 ? t[be][Oe] : null;
        for ((a === -1 || r & 4) && (c = a === -1 ? xd(e, t) : t[a + 8],
            c === jr || !wg(r, !1) ? a = -1 : (s = t[D],
                a = aa(c),
                t = ca(c, t))); a !== -1;) {
            let u = t[D];
            if (bg(i, a, u.data)) {
                let d = nb(a, t, n, s, r, l);
                if (d !== Lt)
                    return d
            }
            c = t[a + 8],
                c !== jr && wg(r, t[D].data[a + 8] === l) && bg(i, a, t) ? (s = u,
                    a = aa(c),
                    t = ca(c, t)) : a = -1
        }
    }
    return o
}
function nb(e, t, n, r, o, i) {
    let s = t[D]
        , a = s.data[e + 8]
        , c = r == null ? Yt(a) && od : r != s && (a.type & 3) !== 0
        , l = o & 1 && i === a
        , u = ta(a, s, n, c, l);
    return u !== null ? Wo(t, s, u, a, o) : Lt
}
function ta(e, t, n, r, o) {
    let i = e.providerIndexes
        , s = t.data
        , a = i & 1048575
        , c = e.directiveStart
        , l = e.directiveEnd
        , u = i >> 20
        , d = r ? a : a + u
        , h = o ? a + u : l;
    for (let f = d; f < h; f++) {
        let g = s[f];
        if (f < c && n === g || f >= c && g.type === n)
            return f
    }
    if (o) {
        let f = s[c];
        if (f && Ot(f) && f.type === n)
            return c
    }
    return null
}
function Wo(e, t, n, r, o) {
    let i = e[n]
        , s = t.data;
    if (i instanceof Jn) {
        let a = i;
        if (a.resolving)
            throw uu("");
        let c = Cg(a.canSeeViewProviders);
        a.resolving = !0;
        let l = s[n].type || s[n], u, d = a.injectImpl ? Ge(a.injectImpl) : null, h = Lu(e, r, 0);
        try {
            i = e[n] = a.factory(void 0, o, s, e, r),
                t.firstCreatePass && n >= r.directiveStart && zC(n, s[n], t)
        } finally {
            d !== null && Ge(d),
                Cg(c),
                a.resolving = !1,
                Fu()
        }
    }
    return i
}
function rb(e) {
    if (typeof e == "string")
        return e.charCodeAt(0) || 0;
    let t = e.hasOwnProperty(Un) ? e[Un] : void 0;
    return typeof t == "number" ? t >= 0 ? t & um : ob : t
}
function bg(e, t, n) {
    let r = 1 << e;
    return !!(n[t + (e >> dm)] & r)
}
function wg(e, t) {
    return !(e & 2) && !(e & 1 && t)
}
var Kn = class {
    _tNode;
    _lView;
    constructor(t, n) {
        this._tNode = t,
            this._lView = n
    }
    get(t, n, r) {
        return gm(this._tNode, this._lView, t, Ln(r), n)
    }
}
    ;
function ob() {
    return new Kn(we(), A())
}
function rr(e) {
    return ni(() => {
        let t = e.prototype.constructor
            , n = t[No] || sd(t)
            , r = Object.prototype
            , o = Object.getPrototypeOf(e.prototype).constructor;
        for (; o && o !== r;) {
            let i = o[No] || sd(o);
            if (i && i !== n)
                return i;
            o = Object.getPrototypeOf(o)
        }
        return i => new i
    }
    )
}
function sd(e) {
    return tu(e) ? () => {
        let t = sd(De(e));
        return t && t()
    }
        : Fn(e)
}
function ib(e, t, n, r, o) {
    let i = e
        , s = t;
    for (; i !== null && s !== null && s[S] & 2048 && !qn(s);) {
        let a = mm(i, s, n, r | 2, Lt);
        if (a !== Lt)
            return a;
        let c = i.parent;
        if (!c) {
            let l = s[yu];
            if (l) {
                let u = l.get(n, Lt, r);
                if (u !== Lt)
                    return u
            }
            c = vm(s),
                s = s[Hn]
        }
        i = c
    }
    return o
}
function vm(e) {
    let t = e[D]
        , n = t.type;
    return n === 2 ? t.declTNode : n === 1 ? e[Oe] : null
}
function Ta(e) {
    return tb(we(), e)
}
function sb() {
    return qr(we(), A())
}
function qr(e, t) {
    return new Dt(it(e, t))
}
var Dt = (() => {
    class e {
        nativeElement;
        constructor(n) {
            this.nativeElement = n
        }
        static __NG_ELEMENT_ID__ = sb
    }
    return e
}
)();
function ym(e) {
    return e instanceof Dt ? e.nativeElement : e
}
function ab() {
    return this._results[Symbol.iterator]()
}
var ua = class {
    _emitDistinctChangesOnly;
    dirty = !0;
    _onDirty = void 0;
    _results = [];
    _changesDetected = !1;
    _changes = void 0;
    length = 0;
    first = void 0;
    last = void 0;
    get changes() {
        return this._changes ??= new ce
    }
    constructor(t = !1) {
        this._emitDistinctChangesOnly = t
    }
    get(t) {
        return this._results[t]
    }
    map(t) {
        return this._results.map(t)
    }
    filter(t) {
        return this._results.filter(t)
    }
    find(t) {
        return this._results.find(t)
    }
    reduce(t, n) {
        return this._results.reduce(t, n)
    }
    forEach(t) {
        this._results.forEach(t)
    }
    some(t) {
        return this._results.some(t)
    }
    toArray() {
        return this._results.slice()
    }
    toString() {
        return this._results.toString()
    }
    reset(t, n) {
        this.dirty = !1;
        let r = Pp(t);
        (this._changesDetected = !kp(this._results, r, n)) && (this._results = r,
            this.length = r.length,
            this.last = r[this.length - 1],
            this.first = r[0])
    }
    notifyOnChanges() {
        this._changes !== void 0 && (this._changesDetected || !this._emitDistinctChangesOnly) && this._changes.next(this)
    }
    onDirty(t) {
        this._onDirty = t
    }
    setDirty() {
        this.dirty = !0,
            this._onDirty?.()
    }
    destroy() {
        this._changes !== void 0 && (this._changes.complete(),
            this._changes.unsubscribe())
    }
    [Symbol.iterator] = ab
}
    , Em = "ngSkipHydration"
    , cb = "ngskiphydration";
function Im(e) {
    let t = e.mergedAttrs;
    if (t === null)
        return !1;
    for (let n = 0; n < t.length; n += 2) {
        let r = t[n];
        if (typeof r == "number")
            return !1;
        if (typeof r == "string" && r.toLowerCase() === cb)
            return !0
    }
    return !1
}
function Dm(e) {
    return e.hasAttribute(Em)
}
function da(e) {
    return (e.flags & 128) === 128
}
function Cm(e) {
    if (da(e))
        return !0;
    let t = e.parent;
    for (; t;) {
        if (da(e) || Im(t))
            return !0;
        t = t.parent
    }
    return !1
}
var Od = (function (e) {
    return e[e.OnPush = 0] = "OnPush",
        e[e.Default = 1] = "Default",
        e
}
)(Od || {})
    , bm = new Map
    , lb = 0;
function ub() {
    return lb++
}
function db(e) {
    bm.set(e[Zt], e)
}
function ad(e) {
    bm.delete(e[Zt])
}
var _g = "__ngContext__";
function Br(e, t) {
    Qe(t) ? (e[_g] = t[Zt],
        db(t)) : e[_g] = t
}
function wm(e) {
    return Tm(e[Pr])
}
function _m(e) {
    return Tm(e[ot])
}
function Tm(e) {
    for (; e !== null && !Ze(e);)
        e = e[ot];
    return e
}
var cd;
function kd(e) {
    cd = e
}
function Sm() {
    if (cd !== void 0)
        return cd;
    if (typeof document < "u")
        return document;
    throw new y(210, !1)
}
var Vt = new v("", {
    factory: () => fb
})
    , fb = "ng";
var Sa = new v("")
    , ri = new v("", {
        providedIn: "platform",
        factory: () => "unknown"
    });
var Ma = new v("", {
    factory: () => p(ne).body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") || null
});
var Wr = (() => {
    class e {
        static \u0275prov = w({
            token: e,
            providedIn: "root",
            factory: () => {
                let n = new e;
                return n.store = hb(p(ne), p(Vt)),
                    n
            }
        });
        store = {};
        onSerializeCallbacks = {};
        get(n, r) {
            return this.store[n] !== void 0 ? this.store[n] : r
        }
        set(n, r) {
            this.store[n] = r
        }
        remove(n) {
            delete this.store[n]
        }
        hasKey(n) {
            return this.store.hasOwnProperty(n)
        }
        get isEmpty() {
            return Object.keys(this.store).length === 0
        }
        onSerialize(n, r) {
            this.onSerializeCallbacks[n] = r
        }
        toJson() {
            for (let n in this.onSerializeCallbacks)
                if (this.onSerializeCallbacks.hasOwnProperty(n))
                    try {
                        this.store[n] = this.onSerializeCallbacks[n]()
                    } catch (r) {
                        console.warn("Exception in onSerialize callback: ", r)
                    }
            return JSON.stringify(this.store).replace(/</g, "\\u003C")
        }
    }
    return e
}
)();
function hb(e, t) {
    let n = e.getElementById(t + "-state");
    if (n?.textContent)
        try {
            return JSON.parse(n.textContent)
        } catch (r) {
            console.warn("Exception while restoring TransferState for app " + t, r)
        }
    return {}
}
var Mm = "h"
    , Nm = "b"
    , pb = "f"
    , gb = "n"
    , Rm = "e"
    , Am = "t"
    , Na = "c"
    , Pd = "x"
    , Qo = "r"
    , xm = "i"
    , Om = "n"
    , Ld = "d";
var km = "di"
    , Pm = "s"
    , Lm = "p";
var oi = new v("")
    , Fm = !1
    , Fd = new v("", {
        factory: () => Fm
    });
var jd = new v("")
    , jm = !1
    , Vm = new v("", {
        factory: () => []
    })
    , Um = new v("")
    , Vd = new v("", {
        factory: () => new Map
    });
var ii = "ngb";
var Hm = (e, t, n) => {
    let r = e
        , o = r.__jsaction_fns ?? new Map
        , i = o.get(t) ?? [];
    i.push(n),
        o.set(t, i),
        r.__jsaction_fns = o
}
    , Bm = (e, t) => {
        let n = e
            , r = n.getAttribute(ii) ?? ""
            , o = t.get(r) ?? new Set;
        o.has(n) || o.add(n),
            t.set(r, o)
    }
    ;
var $m = e => {
    e.removeAttribute(Ys.JSACTION),
        e.removeAttribute(ii),
        e.__jsaction_fns = void 0
}
    , zm = new v("", {
        factory: () => ({})
    });
function Ud(e, t) {
    let n = t?.__jsaction_fns?.get(e.type);
    if (!(!n || !t?.isConnected))
        for (let r of n)
            r(e)
}
var ld = new Map;
function Gm(e, t) {
    return ld.set(e, t),
        () => ld.delete(e)
}
var Tg = !1
    , qm = (e, t, n, r) => { }
    ;
function mb(e, t, n, r) {
    qm(e, t, n, r)
}
function Wm() {
    Tg || (qm = (e, t, n, r) => {
        let o = e[qe].get(Vt);
        ld.get(o)?.(t, n, r)
    }
        ,
        Tg = !0)
}
var Ra = new v("");
function si(e) {
    return (e.flags & 32) === 32
}
var vb = "__nghData__"
    , Hd = vb
    , yb = "__nghDeferData__"
    , Qm = yb;
var na = "ngh"
    , Zm = "nghm"
    , Ym = () => null;
function Eb(e, t, n = !1) {
    let r = e.getAttribute(na);
    if (r == null)
        return null;
    let [o, i] = r.split("|");
    if (r = n ? i : o,
        !r)
        return null;
    let s = i ? `|${i}` : ""
        , a = n ? o : s
        , c = {};
    if (r !== "") {
        let u = t.get(Wr, null, {
            optional: !0
        });
        u !== null && (c = u.get(Hd, [])[Number(r)])
    }
    let l = {
        data: c,
        firstChild: e.firstChild ?? null
    };
    return n && (l.firstChild = e,
        Aa(l, 0, e.nextSibling)),
        a ? e.setAttribute(na, a) : e.removeAttribute(na),
        l
}
function Km() {
    Ym = Eb
}
function Jm(e, t, n = !1) {
    return Ym(e, t, n)
}
function Xm(e) {
    let t = e._lView;
    return t[D].type === 2 ? null : (qn(t) && (t = t[Q]),
        t)
}
function Ib(e) {
    return e.textContent?.replace(/\s/gm, "")
}
function Db(e) {
    let t = Sm(), n = t.createNodeIterator(e, NodeFilter.SHOW_COMMENT, {
        acceptNode(i) {
            let s = Ib(i);
            return s === "ngetn" || s === "ngtns" ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
        }
    }), r, o = [];
    for (; r = n.nextNode();)
        o.push(r);
    for (let i of o)
        i.textContent === "ngetn" ? i.replaceWith(t.createTextNode("")) : i.remove()
}
function Aa(e, t, n) {
    e.segmentHeads ??= {},
        e.segmentHeads[t] = n
}
function ud(e, t) {
    return e.segmentHeads?.[t] ?? null
}
function ev(e) {
    return e.get(Um, !1, {
        optional: !0
    })
}
function Cb(e, t) {
    let n = e.data
        , r = n[Rm]?.[t] ?? null;
    return r === null && n[Na]?.[t] && (r = Bd(e, t)),
        r
}
function tv(e, t) {
    return e.data[Na]?.[t] ?? null
}
function Bd(e, t) {
    let n = tv(e, t) ?? []
        , r = 0;
    for (let o of n)
        r += o[Qo] * (o[Pd] ?? 1);
    return r
}
function bb(e) {
    if (typeof e.disconnectedNodes > "u") {
        let t = e.data[Ld];
        e.disconnectedNodes = t ? new Set(t) : null
    }
    return e.disconnectedNodes
}
function nv(e, t) {
    if (typeof e.disconnectedNodes > "u") {
        let n = e.data[Ld];
        e.disconnectedNodes = n ? new Set(n) : null
    }
    return !!bb(e)?.has(t)
}
function xa(e, t) {
    let n = e[ke];
    return n !== null && !Hs() && !si(t) && !nv(n, t.index - Q)
}
function wb(e, t) {
    let n = t.get(Ra)
        , o = t.get(Wr).get(Qm, {})
        , i = !1
        , s = e
        , a = null
        , c = [];
    for (; !i && s;) {
        i = n.has(s);
        let l = n.hydrating.get(s);
        if (a === null && l != null) {
            a = l.promise;
            break
        }
        c.unshift(s),
            s = o[s][Lm]
    }
    return {
        parentBlockPromise: a,
        hydrationQueue: c
    }
}
function Wu(e) {
    return !!e && e.nodeType === Node.COMMENT_NODE && e.textContent?.trim() === Zm
}
function Sg(e) {
    for (; e && e.nodeType === Node.TEXT_NODE;)
        e = e.previousSibling;
    return e
}
function rv(e) {
    for (let r of e.body.childNodes)
        if (Wu(r))
            return;
    let t = Sg(e.body.previousSibling);
    if (Wu(t))
        return;
    let n = Sg(e.head.lastChild);
    if (!Wu(n))
        throw new y(-507, !1)
}
function ov(e, t) {
    let n = e.contentQueries;
    if (n !== null) {
        let r = C(null);
        try {
            for (let o = 0; o < n.length; o += 2) {
                let i = n[o]
                    , s = n[o + 1];
                if (s !== -1) {
                    let a = e.data[s];
                    Uo(i),
                        a.contentQueries(2, t[s], s)
                }
            }
        } finally {
            C(r)
        }
    }
}
function dd(e, t, n) {
    Uo(0);
    let r = C(null);
    try {
        t(e, n)
    } finally {
        C(r)
    }
}
function iv(e, t, n) {
    if (Eu(t)) {
        let r = C(null);
        try {
            let o = t.directiveStart
                , i = t.directiveEnd;
            for (let s = o; s < i; s++) {
                let a = e.data[s];
                if (a.contentQueries) {
                    let c = n[s];
                    a.contentQueries(1, c, s)
                }
            }
        } finally {
            C(r)
        }
    }
}
var It = (function (e) {
    return e[e.Emulated = 0] = "Emulated",
        e[e.None = 2] = "None",
        e[e.ShadowDom = 3] = "ShadowDom",
        e[e.ExperimentalIsolatedShadowDom = 4] = "ExperimentalIsolatedShadowDom",
        e
}
)(It || {});
var Ks;
function _b() {
    if (Ks === void 0 && (Ks = null,
        xr.trustedTypes))
        try {
            Ks = xr.trustedTypes.createPolicy("angular#unsafe-bypass", {
                createHTML: e => e,
                createScript: e => e,
                createScriptURL: e => e
            })
        } catch { }
    return Ks
}
function Mg(e) {
    return _b()?.createScriptURL(e) || e
}
var fa = class {
    changingThisBreaksApplicationSecurity;
    constructor(t) {
        this.changingThisBreaksApplicationSecurity = t
    }
    toString() {
        return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Ts})`
    }
}
    ;
function Qr(e) {
    return e instanceof fa ? e.changingThisBreaksApplicationSecurity : e
}
function Oa(e, t) {
    let n = sv(e);
    if (n != null && n !== t) {
        if (n === "ResourceURL" && t === "URL")
            return !0;
        throw new Error(`Required a safe ${t}, got a ${n} (see ${Ts})`)
    }
    return n === t
}
function sv(e) {
    return e instanceof fa && e.getTypeName() || null
}
var Tb = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function $d(e) {
    return e = String(e),
        e.match(Tb) ? e : "unsafe:" + e
}
var Sb = /^>|^->|<!--|-->|--!>|<!-$/g
    , Mb = /(<|>)/g
    , Nb = "\u200B$1\u200B";
function Rb(e) {
    return e.replace(Sb, t => t.replace(Mb, Nb))
}
function av(e, t) {
    return e.createText(t)
}
function Ab(e, t, n) {
    e.setValue(t, n)
}
function cv(e, t) {
    return e.createComment(Rb(t))
}
function zd(e, t, n) {
    return e.createElement(t, n)
}
function ha(e, t, n, r, o) {
    e.insertBefore(t, n, r, o)
}
function lv(e, t, n) {
    e.appendChild(t, n)
}
function Ng(e, t, n, r, o) {
    r !== null ? ha(e, t, n, r, o) : lv(e, t, n)
}
function Gd(e, t, n, r) {
    e.removeChild(null, t, n, r)
}
function uv(e) {
    e.textContent = ""
}
function xb(e, t, n) {
    e.setAttribute(t, "style", n)
}
function Ob(e, t, n) {
    n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n)
}
function dv(e, t, n) {
    let { mergedAttrs: r, classes: o, styles: i } = n;
    r !== null && ZC(e, t, r),
        o !== null && Ob(e, t, o),
        i !== null && xb(e, t, i)
}
var ai = (function (e) {
    return e[e.NONE = 0] = "NONE",
        e[e.HTML = 1] = "HTML",
        e[e.STYLE = 2] = "STYLE",
        e[e.SCRIPT = 3] = "SCRIPT",
        e[e.URL = 4] = "URL",
        e[e.RESOURCE_URL = 5] = "RESOURCE_URL",
        e
}
)(ai || {});
function fv(e) {
    let t = pv();
    return t ? t.sanitize(ai.URL, e) || "" : Oa(e, "URL") ? Qr(e) : $d(As(e))
}
function hv(e) {
    let t = pv();
    if (t)
        return Mg(t.sanitize(ai.RESOURCE_URL, e) || "");
    if (Oa(e, "ResourceURL"))
        return Mg(Qr(e));
    throw new y(904, !1)
}
var kb = new Set(["embed", "frame", "iframe", "media", "script"])
    , Pb = new Set(["base", "link", "script"]);
function Lb(e, t) {
    return t === "src" && kb.has(e) || t === "href" && Pb.has(e) || t === "xlink:href" && e === "script" ? hv : fv
}
function qd(e, t, n) {
    return Lb(t, n)(e)
}
function pv() {
    let e = A();
    return e && e[Rt].sanitizer
}
function gv(e) {
    return e.ownerDocument.body
}
function mv(e) {
    return e instanceof Function ? e() : e
}
function Fb(e, t, n) {
    let r = e.length;
    for (; ;) {
        let o = e.indexOf(t, n);
        if (o === -1)
            return o;
        if (o === 0 || e.charCodeAt(o - 1) <= 32) {
            let i = t.length;
            if (o + i === r || e.charCodeAt(o + i) <= 32)
                return o
        }
        n = o + 1
    }
}
var vv = "ng-template";
function jb(e, t, n, r) {
    let o = 0;
    if (r) {
        for (; o < t.length && typeof t[o] == "string"; o += 2)
            if (t[o] === "class" && Fb(t[o + 1].toLowerCase(), n, 0) !== -1)
                return !0
    } else if (Wd(e))
        return !1;
    if (o = t.indexOf(1, o),
        o > -1) {
        let i;
        for (; ++o < t.length && typeof (i = t[o]) == "string";)
            if (i.toLowerCase() === n)
                return !0
    }
    return !1
}
function Wd(e) {
    return e.type === 4 && e.value !== vv
}
function Vb(e, t, n) {
    let r = e.type === 4 && !n ? vv : e.value;
    return t === r
}
function Ub(e, t, n) {
    let r = 4
        , o = e.attrs
        , i = o !== null ? $b(o) : 0
        , s = !1;
    for (let a = 0; a < t.length; a++) {
        let c = t[a];
        if (typeof c == "number") {
            if (!s && !yt(r) && !yt(c))
                return !1;
            if (s && yt(c))
                continue;
            s = !1,
                r = c | r & 1;
            continue
        }
        if (!s)
            if (r & 4) {
                if (r = 2 | r & 1,
                    c !== "" && !Vb(e, c, n) || c === "" && t.length === 1) {
                    if (yt(r))
                        return !1;
                    s = !0
                }
            } else if (r & 8) {
                if (o === null || !jb(e, o, c, n)) {
                    if (yt(r))
                        return !1;
                    s = !0
                }
            } else {
                let l = t[++a]
                    , u = Hb(c, o, Wd(e), n);
                if (u === -1) {
                    if (yt(r))
                        return !1;
                    s = !0;
                    continue
                }
                if (l !== "") {
                    let d;
                    if (u > i ? d = "" : d = o[u + 1].toLowerCase(),
                        r & 2 && l !== d) {
                        if (yt(r))
                            return !1;
                        s = !0
                    }
                }
            }
    }
    return yt(r) || s
}
function yt(e) {
    return (e & 1) === 0
}
function Hb(e, t, n, r) {
    if (t === null)
        return -1;
    let o = 0;
    if (r || !n) {
        let i = !1;
        for (; o < t.length;) {
            let s = t[o];
            if (s === e)
                return o;
            if (s === 3 || s === 6)
                i = !0;
            else if (s === 1 || s === 2) {
                let a = t[++o];
                for (; typeof a == "string";)
                    a = t[++o];
                continue
            } else {
                if (s === 4)
                    break;
                if (s === 0) {
                    o += 4;
                    continue
                }
            }
            o += i ? 1 : 2
        }
        return -1
    } else
        return zb(t, e)
}
function yv(e, t, n = !1) {
    for (let r = 0; r < t.length; r++)
        if (Ub(e, t[r], n))
            return !0;
    return !1
}
function Bb(e) {
    let t = e.attrs;
    if (t != null) {
        let n = t.indexOf(5);
        if ((n & 1) === 0)
            return t[n + 1]
    }
    return null
}
function $b(e) {
    for (let t = 0; t < e.length; t++) {
        let n = e[t];
        if (cm(n))
            return t
    }
    return e.length
}
function zb(e, t) {
    let n = e.indexOf(4);
    if (n > -1)
        for (n++; n < e.length;) {
            let r = e[n];
            if (typeof r == "number")
                return -1;
            if (r === t)
                return n;
            n++
        }
    return -1
}
function Gb(e, t) {
    e: for (let n = 0; n < t.length; n++) {
        let r = t[n];
        if (e.length === r.length) {
            for (let o = 0; o < e.length; o++)
                if (e[o] !== r[o])
                    continue e;
            return !0
        }
    }
    return !1
}
function Rg(e, t) {
    return e ? ":not(" + t.trim() + ")" : t
}
function qb(e) {
    let t = e[0]
        , n = 1
        , r = 2
        , o = ""
        , i = !1;
    for (; n < e.length;) {
        let s = e[n];
        if (typeof s == "string")
            if (r & 2) {
                let a = e[++n];
                o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]"
            } else
                r & 8 ? o += "." + s : r & 4 && (o += " " + s);
        else
            o !== "" && !yt(s) && (t += Rg(i, o),
                o = ""),
                r = s,
                i = i || !yt(r);
        n++
    }
    return o !== "" && (t += Rg(i, o)),
        t
}
function Wb(e) {
    return e.map(qb).join(",")
}
function Qb(e) {
    let t = []
        , n = []
        , r = 1
        , o = 2;
    for (; r < e.length;) {
        let i = e[r];
        if (typeof i == "string")
            o === 2 ? i !== "" && t.push(i, e[++r]) : o === 8 && n.push(i);
        else {
            if (!yt(o))
                break;
            o = i
        }
        r++
    }
    return n.length && t.push(1, ...n),
        t
}
var Je = {};
function Qd(e, t, n, r, o, i, s, a, c, l, u) {
    let d = Q + r
        , h = d + o
        , f = Zb(d, h)
        , g = typeof l == "function" ? l() : l;
    return f[D] = {
        type: e,
        blueprint: f,
        template: n,
        queries: null,
        viewQuery: a,
        declTNode: t,
        data: f.slice().fill(null, d),
        bindingStartIndex: d,
        expandoStartIndex: h,
        hostBindingOpCodes: null,
        firstCreatePass: !0,
        firstUpdatePass: !0,
        staticViewQueries: !1,
        staticContentQueries: !1,
        preOrderHooks: null,
        preOrderCheckHooks: null,
        contentHooks: null,
        contentCheckHooks: null,
        viewHooks: null,
        viewCheckHooks: null,
        destroyHooks: null,
        cleanup: null,
        contentQueries: null,
        components: null,
        directiveRegistry: typeof i == "function" ? i() : i,
        pipeRegistry: typeof s == "function" ? s() : s,
        firstChild: null,
        schemas: c,
        consts: g,
        incompleteFirstPass: !1,
        ssrId: u
    }
}
function Zb(e, t) {
    let n = [];
    for (let r = 0; r < t; r++)
        n.push(r < e ? null : Je);
    return n
}
function Yb(e) {
    let t = e.tView;
    return t === null || t.incompleteFirstPass ? e.tView = Qd(1, null, e.template, e.decls, e.vars, e.directiveDefs, e.pipeDefs, e.viewQuery, e.schemas, e.consts, e.id) : t
}
function Zd(e, t, n, r, o, i, s, a, c, l, u) {
    let d = t.blueprint.slice();
    return d[xe] = o,
        d[S] = r | 4 | 128 | 8 | 64 | 1024,
        (l !== null || e && e[S] & 2048) && (d[S] |= 2048),
        Cu(d),
        d[oe] = d[Hn] = e,
        d[ie] = n,
        d[Rt] = s || e && e[Rt],
        d[B] = a || e && e[B],
        d[qe] = c || e && e[qe] || null,
        d[Oe] = i,
        d[Zt] = ub(),
        d[ke] = u,
        d[yu] = l,
        d[be] = t.type == 2 ? e[be] : d,
        d
}
function Kb(e, t, n) {
    let r = it(t, e)
        , o = Yb(n)
        , i = e[Rt].rendererFactory
        , s = Yd(e, Zd(e, o, null, Ev(n), r, t, null, i.createRenderer(r, n), null, null, null));
    return e[t.index] = s
}
function Ev(e) {
    let t = 16;
    return e.signals ? t = 4096 : e.onPush && (t = 64),
        t
}
function Iv(e, t, n, r) {
    if (n === 0)
        return -1;
    let o = t.length;
    for (let i = 0; i < n; i++)
        t.push(r),
            e.blueprint.push(r),
            e.data.push(null);
    return o
}
function Yd(e, t) {
    return e[Pr] ? e[vu][ot] = t : e[Pr] = t,
        e[vu] = t,
        t
}
function Z(e = 1) {
    Dv(ue(), A(), Kt() + e, !1)
}
function Dv(e, t, n, r) {
    if (!r)
        if ((t[S] & 3) === 3) {
            let i = e.preOrderCheckHooks;
            i !== null && Xs(t, i, n)
        } else {
            let i = e.preOrderHooks;
            i !== null && ea(t, i, 0, n)
        }
    mn(n)
}
var ka = (function (e) {
    return e[e.None = 0] = "None",
        e[e.SignalBased = 1] = "SignalBased",
        e[e.HasDecoratorInputTransform = 2] = "HasDecoratorInputTransform",
        e
}
)(ka || {});
function fd(e, t, n, r) {
    let o = C(null);
    try {
        let [i, s, a] = e.inputs[n]
            , c = null;
        (s & ka.SignalBased) !== 0 && (c = t[i][ve]),
            c !== null && c.transformFn !== void 0 ? r = c.transformFn(r) : a !== null && (r = a.call(t, r)),
            e.setInput !== null ? e.setInput(t, c, r, n, i) : rm(t, c, i, r)
    } finally {
        C(o)
    }
}
var Xt = (function (e) {
    return e[e.Important = 1] = "Important",
        e[e.DashCase = 2] = "DashCase",
        e
}
)(Xt || {}), Jb;
function Kd(e, t) {
    return Jb(e, t)
}
var Xn = new Set
    , Pa = (function (e) {
        return e[e.CHANGE_DETECTION = 0] = "CHANGE_DETECTION",
            e[e.AFTER_NEXT_RENDER = 1] = "AFTER_NEXT_RENDER",
            e
    }
    )(Pa || {})
    , yn = new v("")
    , Ag = new Set;
function lt(e) {
    Ag.has(e) || (Ag.add(e),
        performance?.mark?.("mark_feature_usage", {
            detail: {
                feature: e
            }
        }))
}
var Jd = (() => {
    class e {
        impl = null;
        execute() {
            this.impl?.execute()
        }
        static \u0275prov = w({
            token: e,
            providedIn: "root",
            factory: () => new e
        })
    }
    return e
}
)()
    , Cv = [0, 1, 2, 3]
    , bv = (() => {
        class e {
            ngZone = p(Ae);
            scheduler = p(Wt);
            errorHandler = p(rt, {
                optional: !0
            });
            sequences = new Set;
            deferredRegistrations = new Set;
            executing = !1;
            constructor() {
                p(yn, {
                    optional: !0
                })
            }
            execute() {
                let n = this.sequences.size > 0;
                n && U(j.AfterRenderHooksStart),
                    this.executing = !0;
                for (let r of Cv)
                    for (let o of this.sequences)
                        if (!(o.erroredOrDestroyed || !o.hooks[r]))
                            try {
                                o.pipelinedValue = this.ngZone.runOutsideAngular(() => this.maybeTrace(() => {
                                    let i = o.hooks[r];
                                    return i(o.pipelinedValue)
                                }
                                    , o.snapshot))
                            } catch (i) {
                                o.erroredOrDestroyed = !0,
                                    this.errorHandler?.handleError(i)
                            }
                this.executing = !1;
                for (let r of this.sequences)
                    r.afterRun(),
                        r.once && (this.sequences.delete(r),
                            r.destroy());
                for (let r of this.deferredRegistrations)
                    this.sequences.add(r);
                this.deferredRegistrations.size > 0 && this.scheduler.notify(7),
                    this.deferredRegistrations.clear(),
                    n && U(j.AfterRenderHooksEnd)
            }
            register(n) {
                let { view: r } = n;
                r !== void 0 ? ((r[$n] ??= []).push(n),
                    Qn(r),
                    r[S] |= 8192) : this.executing ? this.deferredRegistrations.add(n) : this.addSequence(n)
            }
            addSequence(n) {
                this.sequences.add(n),
                    this.scheduler.notify(7)
            }
            unregister(n) {
                this.executing && this.sequences.has(n) ? (n.erroredOrDestroyed = !0,
                    n.pipelinedValue = void 0,
                    n.once = !0) : (this.sequences.delete(n),
                        this.deferredRegistrations.delete(n))
            }
            maybeTrace(n, r) {
                return r ? r.run(Pa.AFTER_NEXT_RENDER, n) : n()
            }
            static \u0275prov = w({
                token: e,
                providedIn: "root",
                factory: () => new e
            })
        }
        return e
    }
    )()
    , pa = class {
        impl;
        hooks;
        view;
        once;
        snapshot;
        erroredOrDestroyed = !1;
        pipelinedValue = void 0;
        unregisterOnDestroy;
        constructor(t, n, r, o, i, s = null) {
            this.impl = t,
                this.hooks = n,
                this.view = r,
                this.once = o,
                this.snapshot = s,
                this.unregisterOnDestroy = i?.onDestroy(() => this.destroy())
        }
        afterRun() {
            this.erroredOrDestroyed = !1,
                this.pipelinedValue = void 0,
                this.snapshot?.dispose(),
                this.snapshot = null
        }
        destroy() {
            this.impl.unregister(this),
                this.unregisterOnDestroy?.();
            let t = this.view?.[$n];
            t && (this.view[$n] = t.filter(n => n !== this))
        }
    }
    ;
function ci(e, t) {
    let n = t?.injector ?? p(Ne);
    return lt("NgAfterNextRender"),
        ew(e, n, t, !0)
}
function Xb(e) {
    return e instanceof Function ? [void 0, void 0, e, void 0] : [e.earlyRead, e.write, e.mixedReadWrite, e.read]
}
function ew(e, t, n, r) {
    let o = t.get(Jd);
    o.impl ??= t.get(bv);
    let i = t.get(yn, null, {
        optional: !0
    })
        , s = n?.manualCleanup !== !0 ? t.get(Ve) : null
        , a = t.get(Ho, null, {
            optional: !0
        })
        , c = new pa(o.impl, Xb(e), a?.view, r, s, i?.snapshot(null));
    return o.impl.register(c),
        c
}
var Xd = new v("", {
    factory: () => ({
        queue: new Set,
        isScheduled: !1,
        scheduler: null,
        injector: p(te)
    })
});
function wv(e, t, n) {
    let r = e.get(Xd);
    if (Array.isArray(t))
        for (let o of t)
            r.queue.add(o),
                n?.detachedLeaveAnimationFns?.push(o);
    else
        r.queue.add(t),
            n?.detachedLeaveAnimationFns?.push(t);
    r.scheduler && r.scheduler(e)
}
function tw(e, t) {
    let n = e.get(Xd);
    if (t.detachedLeaveAnimationFns) {
        for (let r of t.detachedLeaveAnimationFns)
            n.queue.delete(r);
        t.detachedLeaveAnimationFns = void 0
    }
}
function nw(e, t) {
    for (let [n, r] of t)
        wv(e, r.animateFns)
}
function rw(e, t) {
    let n = e.get(Xd);
    if (Array.isArray(t))
        for (let r of t)
            n.queue.delete(r);
    else
        n.queue.delete(t)
}
function xg(e, t, n, r) {
    let o = e?.[zn]?.enter;
    t !== null && o && o.has(n.index) && nw(r, o)
}
function Fr(e, t, n, r, o, i, s, a) {
    if (o != null) {
        let c, l = !1;
        Ze(o) ? c = o : Qe(o) && (l = !0,
            o = o[xe]);
        let u = Ye(o);
        e === 0 && r !== null ? (xg(a, r, i, n),
            s == null ? lv(t, r, u) : ha(t, r, u, s || null, !0)) : e === 1 && r !== null ? (xg(a, r, i, n),
                ha(t, r, u, s || null, !0)) : e === 2 ? Og(a, i, n, d => {
                    Gd(t, u, l, d)
                }
                ) : e === 3 && Og(a, i, n, () => {
                    t.destroyNode(u)
                }
                ),
            c != null && pw(t, e, n, c, i, r, s)
    }
}
function ow(e, t) {
    _v(e, t),
        t[xe] = null,
        t[Oe] = null
}
function iw(e, t, n, r, o, i) {
    r[xe] = o,
        r[Oe] = t,
        Fa(e, r, n, 1, o, i)
}
function _v(e, t) {
    t[Rt].changeDetectionScheduler?.notify(9),
        Fa(e, t, t[B], 2, null, null)
}
function sw(e) {
    let t = e[Pr];
    if (!t)
        return Qu(e[D], e);
    for (; t;) {
        let n = null;
        if (Qe(t))
            n = t[Pr];
        else {
            let r = t[J];
            r && (n = r)
        }
        if (!n) {
            for (; t && !t[ot] && t !== e;)
                Qe(t) && Qu(t[D], t),
                    t = t[oe];
            t === null && (t = e),
                Qe(t) && Qu(t[D], t),
                n = t && t[ot]
        }
        t = n
    }
}
function ef(e, t) {
    let n = e[Gn]
        , r = n.indexOf(t);
    n.splice(r, 1)
}
function La(e, t) {
    if (gn(t))
        return;
    let n = t[B];
    n.destroyNode && Fa(e, t, n, 3, null, null),
        sw(t)
}
function Qu(e, t) {
    if (gn(t))
        return;
    let n = C(null);
    try {
        t[S] &= -129,
            t[S] |= 256,
            t[We] && Rn(t[We]),
            lw(e, t),
            cw(e, t),
            t[D].type === 1 && t[B].destroy();
        let r = t[pn];
        if (r !== null && Ze(t[oe])) {
            r !== t[oe] && ef(r, t);
            let o = t[At];
            o !== null && o.detachView(e)
        }
        ad(t)
    } finally {
        C(n)
    }
}
function Og(e, t, n, r) {
    let o = e?.[zn];
    if (o?.enter?.has(t.index) && rw(n, o.enter.get(t.index).animateFns),
        o == null || o.leave == null || !o.leave.has(t.index))
        return r(!1);
    e && Xn.add(e[Zt]),
        wv(n, () => {
            if (o.leave && o.leave.has(t.index)) {
                let s = o.leave.get(t.index)
                    , a = [];
                if (s) {
                    for (let c = 0; c < s.animateFns.length; c++) {
                        let l = s.animateFns[c]
                            , { promise: u } = l();
                        a.push(u)
                    }
                    o.detachedLeaveAnimationFns = void 0
                }
                o.running = Promise.allSettled(a),
                    aw(e, r)
            } else
                e && Xn.delete(e[Zt]),
                    r(!1)
        }
            , o)
}
function aw(e, t) {
    let n = e[zn]?.running;
    if (n) {
        n.then(() => {
            e[zn].running = void 0,
                Xn.delete(e[Zt]),
                t(!0)
        }
        );
        return
    }
    t(!1)
}
function cw(e, t) {
    let n = e.cleanup
        , r = t[kr];
    if (n !== null)
        for (let s = 0; s < n.length - 1; s += 2)
            if (typeof n[s] == "string") {
                let a = n[s + 3];
                a >= 0 ? r[a]() : r[-a].unsubscribe(),
                    s += 2
            } else {
                let a = r[n[s + 1]];
                n[s].call(a)
            }
    r !== null && (t[kr] = null);
    let o = t[Gt];
    if (o !== null) {
        t[Gt] = null;
        for (let s = 0; s < o.length; s++) {
            let a = o[s];
            a()
        }
    }
    let i = t[un];
    if (i !== null) {
        t[un] = null;
        for (let s of i)
            s.destroy()
    }
}
function lw(e, t) {
    let n;
    if (e != null && (n = e.destroyHooks) != null)
        for (let r = 0; r < n.length; r += 2) {
            let o = t[n[r]];
            if (!(o instanceof Jn)) {
                let i = n[r + 1];
                if (Array.isArray(i))
                    for (let s = 0; s < i.length; s += 2) {
                        let a = o[i[s]]
                            , c = i[s + 1];
                        U(j.LifecycleHookStart, a, c);
                        try {
                            c.call(a)
                        } finally {
                            U(j.LifecycleHookEnd, a, c)
                        }
                    }
                else {
                    U(j.LifecycleHookStart, o, i);
                    try {
                        i.call(o)
                    } finally {
                        U(j.LifecycleHookEnd, o, i)
                    }
                }
            }
        }
}
function Tv(e, t, n) {
    return uw(e, t.parent, n)
}
function uw(e, t, n) {
    let r = t;
    for (; r !== null && r.type & 168;)
        t = r,
            r = t.parent;
    if (r === null)
        return n[xe];
    if (Yt(r)) {
        let { encapsulation: o } = e.data[r.directiveStart + r.componentOffset];
        if (o === It.None || o === It.Emulated)
            return null
    }
    return it(r, n)
}
function Sv(e, t, n) {
    return fw(e, t, n)
}
function dw(e, t, n) {
    return e.type & 40 ? it(e, n) : null
}
var fw = dw, kg;
function tf(e, t, n, r) {
    let o = Tv(e, r, t)
        , i = t[B]
        , s = r.parent || t[Oe]
        , a = Sv(s, r, t);
    if (o != null)
        if (Array.isArray(n))
            for (let c = 0; c < n.length; c++)
                Ng(i, o, n[c], a, !1);
        else
            Ng(i, o, n, a, !1);
    kg !== void 0 && kg(i, r, t, n, o)
}
function Go(e, t) {
    if (t !== null) {
        let n = t.type;
        if (n & 3)
            return it(t, e);
        if (n & 4)
            return hd(-1, e[t.index]);
        if (n & 8) {
            let r = t.child;
            if (r !== null)
                return Go(e, r);
            {
                let o = e[t.index];
                return Ze(o) ? hd(-1, o) : Ye(o)
            }
        } else {
            if (n & 128)
                return Go(e, t.next);
            if (n & 32)
                return Kd(t, e)() || Ye(e[t.index]);
            {
                let r = Mv(e, t);
                if (r !== null) {
                    if (Array.isArray(r))
                        return r[0];
                    let o = dn(e[be]);
                    return Go(o, r)
                } else
                    return Go(e, t.next)
            }
        }
    }
    return null
}
function Mv(e, t) {
    if (t !== null) {
        let r = e[be][Oe]
            , o = t.projection;
        return r.projection[o]
    }
    return null
}
function hd(e, t) {
    let n = J + e + 1;
    if (n < t.length) {
        let r = t[n]
            , o = r[D].firstChild;
        if (o !== null)
            return Go(r, o)
    }
    return t[xt]
}
function nf(e, t, n, r, o, i, s) {
    for (; n != null;) {
        let a = r[qe];
        if (n.type === 128) {
            n = n.next;
            continue
        }
        let c = r[n.index]
            , l = n.type;
        if (s && t === 0 && (c && Br(Ye(c), r),
            n.flags |= 2),
            !si(n))
            if (l & 8)
                nf(e, t, n.child, r, o, i, !1),
                    Fr(t, e, a, o, c, n, i, r);
            else if (l & 32) {
                let u = Kd(n, r), d;
                for (; d = u();)
                    Fr(t, e, a, o, d, n, i, r);
                Fr(t, e, a, o, c, n, i, r)
            } else
                l & 16 ? Nv(e, t, r, n, o, i) : Fr(t, e, a, o, c, n, i, r);
        n = s ? n.projectionNext : n.next
    }
}
function Fa(e, t, n, r, o, i) {
    nf(n, r, e.firstChild, t, o, i, !1)
}
function hw(e, t, n) {
    let r = t[B]
        , o = Tv(e, n, t)
        , i = n.parent || t[Oe]
        , s = Sv(i, n, t);
    Nv(r, 0, t, n, o, s)
}
function Nv(e, t, n, r, o, i) {
    let s = n[be]
        , c = s[Oe].projection[r.projection];
    if (Array.isArray(c))
        for (let l = 0; l < c.length; l++) {
            let u = c[l];
            Fr(t, e, n[qe], o, u, r, i, n)
        }
    else {
        let l = c
            , u = s[oe];
        da(r) && (l.flags |= 128),
            nf(e, t, l, u, o, i, !0)
    }
}
function pw(e, t, n, r, o, i, s) {
    let a = r[xt]
        , c = Ye(r);
    a !== c && Fr(t, e, n, i, a, o, s);
    for (let l = J; l < r.length; l++) {
        let u = r[l];
        Fa(u[D], u, e, t, i, a)
    }
}
function gw(e, t, n, r, o) {
    if (t)
        o ? e.addClass(n, r) : e.removeClass(n, r);
    else {
        let i = r.indexOf("-") === -1 ? void 0 : Xt.DashCase;
        o == null ? e.removeStyle(n, r, i) : (typeof o == "string" && o.endsWith("!important") && (o = o.slice(0, -10),
            i |= Xt.Important),
            e.setStyle(n, r, o, i))
    }
}
function Rv(e, t, n, r, o) {
    let i = Kt()
        , s = r & 2;
    try {
        mn(-1),
            s && t.length > Q && Dv(e, t, Q, !1);
        let a = s ? j.TemplateUpdateStart : j.TemplateCreateStart;
        U(a, o, n),
            n(r, o)
    } finally {
        mn(i);
        let a = s ? j.TemplateUpdateEnd : j.TemplateCreateEnd;
        U(a, o, n)
    }
}
function Av(e, t, n) {
    Cw(e, t, n),
        (n.flags & 64) === 64 && bw(e, t, n)
}
function rf(e, t, n = it) {
    let r = t.localNames;
    if (r !== null) {
        let o = t.index + 1;
        for (let i = 0; i < r.length; i += 2) {
            let s = r[i + 1]
                , a = s === -1 ? n(t, e) : e[s];
            e[o++] = a
        }
    }
}
function mw(e, t, n, r) {
    let i = r.get(Fd, Fm) || n === It.ShadowDom || n === It.ExperimentalIsolatedShadowDom
        , s = e.selectRootElement(t, i);
    return vw(s),
        s
}
function vw(e) {
    xv(e)
}
var xv = () => null;
function yw(e) {
    Dm(e) ? uv(e) : Db(e)
}
function Ov() {
    xv = yw
}
function Ew(e) {
    return e === "class" ? "className" : e === "for" ? "htmlFor" : e === "formaction" ? "formAction" : e === "innerHtml" ? "innerHTML" : e === "readonly" ? "readOnly" : e === "tabindex" ? "tabIndex" : e
}
function Iw(e, t, n, r, o, i) {
    let s = t[D];
    if (sf(e, s, t, n, r)) {
        Yt(e) && Dw(t, e.index);
        return
    }
    e.type & 3 && (n = Ew(n)),
        kv(e, t, n, r, o, i)
}
function kv(e, t, n, r, o, i) {
    if (e.type & 3) {
        let s = it(e, t);
        r = i != null ? i(r, e.value || "", n) : r,
            o.setProperty(s, n, r)
    } else
        e.type & 12
}
function Dw(e, t) {
    let n = st(t, e);
    n[S] & 16 || (n[S] |= 64)
}
function Cw(e, t, n) {
    let r = n.directiveStart
        , o = n.directiveEnd;
    Yt(n) && Kb(t, n, e.data[r + n.componentOffset]),
        e.firstCreatePass || la(n, t);
    let i = n.initialInputs;
    for (let s = r; s < o; s++) {
        let a = e.data[s]
            , c = Wo(t, e, s, n);
        if (Br(c, t),
            i !== null && Mw(t, s - r, c, a, n, i),
            Ot(a)) {
            let l = st(n.index, t);
            l[ie] = Wo(t, e, s, n)
        }
    }
}
function bw(e, t, n) {
    let r = n.directiveStart
        , o = n.directiveEnd
        , i = n.index
        , s = ig();
    try {
        mn(i);
        for (let a = r; a < o; a++) {
            let c = e.data[a]
                , l = t[a];
            Bs(a),
                (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) && ww(c, l)
        }
    } finally {
        mn(-1),
            Bs(s)
    }
}
function ww(e, t) {
    e.hostBindings !== null && e.hostBindings(1, t)
}
function _w(e, t) {
    let n = e.directiveRegistry
        , r = null;
    if (n)
        for (let o = 0; o < n.length; o++) {
            let i = n[o];
            yv(t, i.selectors, !1) && (r ??= [],
                Ot(i) ? r.unshift(i) : r.push(i))
        }
    return r
}
function Tw(e, t, n, r, o, i) {
    let s = it(e, t);
    Sw(t[B], s, i, e.value, n, r, o)
}
function Sw(e, t, n, r, o, i, s) {
    if (i == null)
        e.removeAttribute(t, o, n);
    else {
        let a = s == null ? As(i) : s(i, r || "", o);
        e.setAttribute(t, o, a, n)
    }
}
function Mw(e, t, n, r, o, i) {
    let s = i[t];
    if (s !== null)
        for (let a = 0; a < s.length; a += 2) {
            let c = s[a]
                , l = s[a + 1];
            fd(r, n, c, l)
        }
}
function Pv(e, t, n, r, o) {
    let i = Q + n
        , s = t[D]
        , a = o(s, t, e, r, n);
    t[i] = a,
        Lr(e, !0);
    let c = e.type === 2;
    return c ? (dv(t[B], a, e),
        (Kp() === 0 || js(e)) && Br(a, t),
        Jp()) : Br(a, t),
        Ws() && (!c || !si(e)) && tf(s, t, a, e),
        e
}
function Lv(e) {
    let t = e;
    return Au() ? xu() : (t = t.parent,
        Lr(t, !1)),
        t
}
function of(e, t) {
    let n = e[qe];
    if (!n)
        return;
    let r;
    try {
        r = n.get(ct, null)
    } catch {
        r = null
    }
    r?.(t)
}
function sf(e, t, n, r, o) {
    let i = e.inputs?.[r]
        , s = e.hostDirectiveInputs?.[r]
        , a = !1;
    if (s)
        for (let c = 0; c < s.length; c += 2) {
            let l = s[c]
                , u = s[c + 1]
                , d = t.data[l];
            fd(d, n[l], u, o),
                a = !0
        }
    if (i)
        for (let c of i) {
            let l = n[c]
                , u = t.data[c];
            fd(u, l, r, o),
                a = !0
        }
    return a
}
function Nw(e, t) {
    let n = st(t, e)
        , r = n[D];
    Rw(r, n);
    let o = n[xe];
    o !== null && n[ke] === null && (n[ke] = Jm(o, n[qe])),
        U(j.ComponentStart);
    try {
        af(r, n, n[ie])
    } finally {
        U(j.ComponentEnd, n[ie])
    }
}
function Rw(e, t) {
    for (let n = t.length; n < e.blueprint.length; n++)
        t.push(e.blueprint[n])
}
function af(e, t, n) {
    zs(t);
    try {
        let r = e.viewQuery;
        r !== null && dd(1, r, n);
        let o = e.template;
        o !== null && Rv(e, t, o, 1, n),
            e.firstCreatePass && (e.firstCreatePass = !1),
            t[At]?.finishViewCreation(e),
            e.staticContentQueries && ov(e, t),
            e.staticViewQueries && dd(2, e.viewQuery, n);
        let i = e.components;
        i !== null && Aw(t, i)
    } catch (r) {
        throw e.firstCreatePass && (e.incompleteFirstPass = !0,
            e.firstCreatePass = !1),
        r
    } finally {
        t[S] &= -5,
            Gs()
    }
}
function Aw(e, t) {
    for (let n = 0; n < t.length; n++)
        Nw(e, t[n])
}
function Zr(e, t, n, r) {
    let o = C(null);
    try {
        let i = t.tView
            , a = e[S] & 4096 ? 4096 : 16
            , c = Zd(e, i, n, a, null, t, null, null, r?.injector ?? null, r?.embeddedViewInjector ?? null, r?.dehydratedView ?? null)
            , l = e[t.index];
        c[pn] = l;
        let u = e[At];
        return u !== null && (c[At] = u.createEmbeddedView(i)),
            af(i, c, n),
            c
    } finally {
        C(o)
    }
}
function er(e, t) {
    return !t || t.firstChild === null || da(e)
}
function Zo(e, t, n, r, o = !1) {
    for (; n !== null;) {
        if (n.type === 128) {
            n = o ? n.projectionNext : n.next;
            continue
        }
        let i = t[n.index];
        i !== null && r.push(Ye(i)),
            Ze(i) && Fv(i, r);
        let s = n.type;
        if (s & 8)
            Zo(e, t, n.child, r);
        else if (s & 32) {
            let a = Kd(n, t), c;
            for (; c = a();)
                r.push(c)
        } else if (s & 16) {
            let a = Mv(t, n);
            if (Array.isArray(a))
                r.push(...a);
            else {
                let c = dn(t[be]);
                Zo(c[D], c, a, r, !0)
            }
        }
        n = o ? n.projectionNext : n.next
    }
    return r
}
function Fv(e, t) {
    for (let n = J; n < e.length; n++) {
        let r = e[n]
            , o = r[D].firstChild;
        o !== null && Zo(r[D], r, o, t)
    }
    e[xt] !== e[xe] && t.push(e[xt])
}
function jv(e) {
    if (e[$n] !== null) {
        for (let t of e[$n])
            t.impl.addSequence(t);
        e[$n].length = 0
    }
}
var Vv = [];
function xw(e) {
    return e[We] ?? Ow(e)
}
function Ow(e) {
    let t = Vv.pop() ?? Object.create(Pw);
    return t.lView = e,
        t
}
function kw(e) {
    e.lView[We] !== e && (e.lView = null,
        Vv.push(e))
}
var Pw = P(m({}, vr), {
    consumerIsAlwaysLive: !0,
    kind: "template",
    consumerMarkedDirty: e => {
        Qn(e.lView)
    }
    ,
    consumerOnSignalRead() {
        this.lView[We] = this
    }
});
function Lw(e) {
    let t = e[We] ?? Object.create(Fw);
    return t.lView = e,
        t
}
var Fw = P(m({}, vr), {
    consumerIsAlwaysLive: !0,
    kind: "template",
    consumerMarkedDirty: e => {
        let t = dn(e.lView);
        for (; t && !Uv(t[D]);)
            t = dn(t);
        t && bu(t)
    }
    ,
    consumerOnSignalRead() {
        this.lView[We] = this
    }
});
function Uv(e) {
    return e.type !== 2
}
function Hv(e) {
    if (e[un] === null)
        return;
    let t = !0;
    for (; t;) {
        let n = !1;
        for (let r of e[un])
            r.dirty && (n = !0,
                r.zone === null || Zone.current === r.zone ? r.run() : r.zone.run(() => r.run()));
        t = n && !!(e[S] & 8192)
    }
}
var jw = 100;
function Bv(e, t = 0) {
    let r = e[Rt].rendererFactory
        , o = !1;
    o || r.begin?.();
    try {
        Vw(e, t)
    } finally {
        o || r.end?.()
    }
}
function Vw(e, t) {
    let n = Ou();
    try {
        Ao(!0),
            pd(e, t);
        let r = 0;
        for (; Vo(e);) {
            if (r === jw)
                throw new y(103, !1);
            r++,
                pd(e, 1)
        }
    } finally {
        Ao(n)
    }
}
function Uw(e, t, n, r) {
    if (gn(t))
        return;
    let o = t[S]
        , i = !1
        , s = !1;
    zs(t);
    let a = !0
        , c = null
        , l = null;
    i || (Uv(e) ? (l = xw(t),
        c = Er(l)) : Qi() === null ? (a = !1,
            l = Lw(t),
            c = Er(l)) : t[We] && (Rn(t[We]),
                t[We] = null));
    try {
        Cu(t),
            ng(e.bindingStartIndex),
            n !== null && Rv(e, t, n, 2, r);
        let u = (o & 3) === 3;
        if (!i)
            if (u) {
                let f = e.preOrderCheckHooks;
                f !== null && Xs(t, f, null)
            } else {
                let f = e.preOrderHooks;
                f !== null && ea(t, f, 0, null),
                    Gu(t, 0)
            }
        if (s || Hw(t),
            Hv(t),
            $v(t, 0),
            e.contentQueries !== null && ov(e, t),
            !i)
            if (u) {
                let f = e.contentCheckHooks;
                f !== null && Xs(t, f)
            } else {
                let f = e.contentHooks;
                f !== null && ea(t, f, 1),
                    Gu(t, 1)
            }
        $w(e, t);
        let d = e.components;
        d !== null && Gv(t, d, 0);
        let h = e.viewQuery;
        if (h !== null && dd(2, h, r),
            !i)
            if (u) {
                let f = e.viewCheckHooks;
                f !== null && Xs(t, f)
            } else {
                let f = e.viewHooks;
                f !== null && ea(t, f, 2),
                    Gu(t, 2)
            }
        if (e.firstUpdatePass === !0 && (e.firstUpdatePass = !1),
            t[Fs]) {
            for (let f of t[Fs])
                f();
            t[Fs] = null
        }
        i || (jv(t),
            t[S] &= -73)
    } catch (u) {
        throw i || Qn(t),
        u
    } finally {
        l !== null && (Io(l, c),
            a && kw(l)),
            Gs()
    }
}
function $v(e, t) {
    for (let n = wm(e); n !== null; n = _m(n))
        for (let r = J; r < n.length; r++) {
            let o = n[r];
            zv(o, t)
        }
}
function Hw(e) {
    for (let t = wm(e); t !== null; t = _m(t)) {
        if (!(t[S] & 2))
            continue;
        let n = t[Gn];
        for (let r = 0; r < n.length; r++) {
            let o = n[r];
            bu(o)
        }
    }
}
function Bw(e, t, n) {
    U(j.ComponentStart);
    let r = st(t, e);
    try {
        zv(r, n)
    } finally {
        U(j.ComponentEnd, r[ie])
    }
}
function zv(e, t) {
    Vs(e) && pd(e, t)
}
function pd(e, t) {
    let r = e[D]
        , o = e[S]
        , i = e[We]
        , s = !!(t === 0 && o & 16);
    if (s ||= !!(o & 64 && t === 0),
        s ||= !!(o & 1024),
        s ||= !!(i?.dirty && Do(i)),
        s ||= !1,
        i && (i.dirty = !1),
        e[S] &= -9217,
        s)
        Uw(r, e, r.template, e[ie]);
    else if (o & 8192) {
        let a = C(null);
        try {
            Hv(e),
                $v(e, 1);
            let c = r.components;
            c !== null && Gv(e, c, 1),
                jv(e)
        } finally {
            C(a)
        }
    }
}
function Gv(e, t, n) {
    for (let r = 0; r < t.length; r++)
        Bw(e, t[r], n)
}
function $w(e, t) {
    let n = e.hostBindingOpCodes;
    if (n !== null)
        try {
            for (let r = 0; r < n.length; r++) {
                let o = n[r];
                if (o < 0)
                    mn(~o);
                else {
                    let i = o
                        , s = n[++r]
                        , a = n[++r];
                    og(s, i);
                    let c = t[i];
                    U(j.HostBindingsUpdateStart, c);
                    try {
                        a(2, c)
                    } finally {
                        U(j.HostBindingsUpdateEnd, c)
                    }
                }
            }
        } finally {
            mn(-1)
        }
}
function ja(e, t) {
    let n = Ou() ? 64 : 1088;
    for (e[Rt].changeDetectionScheduler?.notify(t); e;) {
        e[S] |= n;
        let r = dn(e);
        if (qn(e) && !r)
            return e;
        e = r
    }
    return null
}
function qv(e, t, n, r) {
    return [e, !0, 0, t, null, r, null, n, null, null]
}
function Wv(e, t) {
    let n = J + t;
    if (n < e.length)
        return e[n]
}
function Yr(e, t, n, r = !0) {
    let o = t[D];
    if (zw(o, t, e, n),
        r) {
        let s = hd(n, e)
            , a = t[B]
            , c = a.parentNode(e[xt]);
        c !== null && iw(o, e[Oe], a, t, c, s)
    }
    let i = t[ke];
    i !== null && i.firstChild !== null && (i.firstChild = null)
}
function cf(e, t) {
    let n = Yo(e, t);
    return n !== void 0 && La(n[D], n),
        n
}
function Yo(e, t) {
    if (e.length <= J)
        return;
    let n = J + t
        , r = e[n];
    if (r) {
        let o = r[pn];
        o !== null && o !== e && ef(o, r),
            t > 0 && (e[n - 1][ot] = r[ot]);
        let i = Po(e, J + t);
        ow(r[D], r);
        let s = i[At];
        s !== null && s.detachView(i[D]),
            r[oe] = null,
            r[ot] = null,
            r[S] &= -129
    }
    return r
}
function zw(e, t, n, r) {
    let o = J + r
        , i = n.length;
    r > 0 && (n[o - 1][ot] = t),
        r < i - J ? (t[ot] = n[o],
            fu(n, J + r, t)) : (n.push(t),
                t[ot] = null),
        t[oe] = n;
    let s = t[pn];
    s !== null && n !== s && Qv(s, t);
    let a = t[At];
    a !== null && a.insertView(e),
        Us(t),
        t[S] |= 128
}
function Qv(e, t) {
    let n = e[Gn]
        , r = t[oe];
    if (Qe(r))
        e[S] |= 2;
    else {
        let o = r[oe][be];
        t[be] !== o && (e[S] |= 2)
    }
    n === null ? e[Gn] = [t] : n.push(t)
}
var vn = class {
    _lView;
    _cdRefInjectingView;
    _appRef = null;
    _attachedToViewContainer = !1;
    exhaustive;
    get rootNodes() {
        let t = this._lView
            , n = t[D];
        return Zo(n, t, n.firstChild, [])
    }
    constructor(t, n) {
        this._lView = t,
            this._cdRefInjectingView = n
    }
    get context() {
        return this._lView[ie]
    }
    set context(t) {
        this._lView[ie] = t
    }
    get destroyed() {
        return gn(this._lView)
    }
    destroy() {
        if (this._appRef)
            this._appRef.detachView(this);
        else if (this._attachedToViewContainer) {
            let t = this._lView[oe];
            if (Ze(t)) {
                let n = t[jo]
                    , r = n ? n.indexOf(this) : -1;
                r > -1 && (Yo(t, r),
                    Po(n, r))
            }
            this._attachedToViewContainer = !1
        }
        La(this._lView[D], this._lView)
    }
    onDestroy(t) {
        wu(this._lView, t)
    }
    markForCheck() {
        ja(this._cdRefInjectingView || this._lView, 4)
    }
    detach() {
        this._lView[S] &= -129
    }
    reattach() {
        Us(this._lView),
            this._lView[S] |= 128
    }
    detectChanges() {
        this._lView[S] |= 1024,
            Bv(this._lView)
    }
    checkNoChanges() { }
    attachToViewContainerRef() {
        if (this._appRef)
            throw new y(902, !1);
        this._attachedToViewContainer = !0
    }
    detachFromAppRef() {
        this._appRef = null;
        let t = qn(this._lView)
            , n = this._lView[pn];
        n !== null && !t && ef(n, this._lView),
            _v(this._lView[D], this._lView)
    }
    attachToAppRef(t) {
        if (this._attachedToViewContainer)
            throw new y(902, !1);
        this._appRef = t;
        let n = qn(this._lView)
            , r = this._lView[pn];
        r !== null && !n && Qv(r, this._lView),
            Us(this._lView)
    }
}
    ;
var Ko = (() => {
    class e {
        _declarationLView;
        _declarationTContainer;
        elementRef;
        static __NG_ELEMENT_ID__ = Gw;
        constructor(n, r, o) {
            this._declarationLView = n,
                this._declarationTContainer = r,
                this.elementRef = o
        }
        get ssrId() {
            return this._declarationTContainer.tView?.ssrId || null
        }
        createEmbeddedView(n, r) {
            return this.createEmbeddedViewImpl(n, r)
        }
        createEmbeddedViewImpl(n, r, o) {
            let i = Zr(this._declarationLView, this._declarationTContainer, n, {
                embeddedViewInjector: r,
                dehydratedView: o
            });
            return new vn(i)
        }
    }
    return e
}
)();
function Gw() {
    return lf(we(), A())
}
function lf(e, t) {
    return e.type & 4 ? new Ko(t, e, qr(e, t)) : null
}
function li(e, t, n, r, o) {
    let i = e.data[t];
    if (i === null)
        i = qw(e, t, n, r, o),
            rg() && (i.flags |= 32);
    else if (i.type & 64) {
        i.type = n,
            i.value = r,
            i.attrs = o;
        let s = tg();
        i.injectorIndex = s === null ? -1 : s.injectorIndex
    }
    return Lr(i, !0),
        i
}
function qw(e, t, n, r, o) {
    let i = Ru()
        , s = Au()
        , a = s ? i : i && i.parent
        , c = e.data[t] = Qw(e, a, n, t, r, o);
    return Ww(e, c, i, s),
        c
}
function Ww(e, t, n, r) {
    e.firstChild === null && (e.firstChild = t),
        n !== null && (r ? n.child == null && t.parent !== null && (n.child = t) : n.next === null && (n.next = t,
            t.prev = n))
}
function Qw(e, t, n, r, o, i) {
    let s = t ? t.injectorIndex : -1
        , a = 0;
    return Hs() && (a |= 128),
    {
        type: n,
        index: r,
        insertBeforeIndex: null,
        injectorIndex: s,
        directiveStart: -1,
        directiveEnd: -1,
        directiveStylingLast: -1,
        componentOffset: -1,
        fieldIndex: -1,
        customControlIndex: -1,
        propertyBindings: null,
        flags: a,
        providerIndexes: 0,
        value: o,
        attrs: i,
        mergedAttrs: null,
        localNames: null,
        initialInputs: null,
        inputs: null,
        hostDirectiveInputs: null,
        outputs: null,
        hostDirectiveOutputs: null,
        directiveToIndex: null,
        tView: null,
        next: null,
        prev: null,
        projectionNext: null,
        child: null,
        parent: t,
        projection: null,
        styles: null,
        stylesWithoutHost: null,
        residualStyles: void 0,
        classes: null,
        classesWithoutHost: null,
        residualClasses: void 0,
        classBindings: 0,
        styleBindings: 0
    }
}
var Zw = new RegExp(`^(\\d+)*(${Nm}|${Mm})*(.*)`);
function Yw(e) {
    let t = e.match(Zw)
        , [n, r, o, i] = t
        , s = r ? parseInt(r, 10) : o
        , a = [];
    for (let [c, l, u] of i.matchAll(/(f|n)(\d*)/g)) {
        let d = parseInt(u, 10) || 1;
        a.push(l, d)
    }
    return [s, ...a]
}
function Kw(e) {
    return !e.prev && e.parent?.type === 8
}
function Zu(e) {
    return e.index - Q
}
function Jw(e, t) {
    let n = e.i18nNodes;
    if (n)
        return n.get(t)
}
function Va(e, t, n, r) {
    let o = Zu(r)
        , i = Jw(e, o);
    if (i === void 0) {
        let s = e.data[Om];
        if (s?.[o])
            i = e_(s[o], n);
        else if (t.firstChild === r)
            i = e.firstChild;
        else {
            let a = r.prev === null
                , c = r.prev ?? r.parent;
            if (Kw(r)) {
                let l = Zu(r.parent);
                i = ud(e, l)
            } else {
                let l = it(c, n);
                if (a)
                    i = l.firstChild;
                else {
                    let u = Zu(c)
                        , d = ud(e, u);
                    if (c.type === 2 && d) {
                        let f = Bd(e, u) + 1;
                        i = Ua(f, d)
                    } else
                        i = l.nextSibling
                }
            }
        }
    }
    return i
}
function Ua(e, t) {
    let n = t;
    for (let r = 0; r < e; r++)
        n = n.nextSibling;
    return n
}
function Xw(e, t) {
    let n = e;
    for (let r = 0; r < t.length; r += 2) {
        let o = t[r]
            , i = t[r + 1];
        for (let s = 0; s < i; s++)
            switch (o) {
                case pb:
                    n = n.firstChild;
                    break;
                case gb:
                    n = n.nextSibling;
                    break
            }
    }
    return n
}
function e_(e, t) {
    let [n, ...r] = Yw(e), o;
    if (n === Mm)
        o = t[be][xe];
    else if (n === Nm)
        o = gv(t[be][xe]);
    else {
        let i = Number(n);
        o = Ye(t[i + Q])
    }
    return Xw(o, r)
}
var t_ = !1;
function Zv(e) {
    t_ = e
}
function n_(e) {
    let t = e[ke];
    if (t) {
        let { i18nNodes: n, dehydratedIcuData: r } = t;
        if (n && r) {
            let o = e[B];
            for (let i of r.values())
                r_(o, n, i)
        }
        t.i18nNodes = void 0,
            t.dehydratedIcuData = void 0
    }
}
function r_(e, t, n) {
    for (let r of n.node.cases[n.case]) {
        let o = t.get(r.index - Q);
        o && Gd(e, o, !1)
    }
}
function Ha(e) {
    let t = e[vt] ?? []
        , r = e[oe][B]
        , o = [];
    for (let i of t)
        i.data[km] !== void 0 ? o.push(i) : Yv(i, r);
    e[vt] = o
}
function o_(e) {
    let { lContainer: t } = e
        , n = t[vt];
    if (n === null)
        return;
    let o = t[oe][B];
    for (let i of n)
        Yv(i, o)
}
function Yv(e, t) {
    let n = 0
        , r = e.firstChild;
    if (r) {
        let o = e.data[Qo];
        for (; n < o;) {
            let i = r.nextSibling;
            Gd(t, r, !1),
                r = i,
                n++
        }
    }
}
function Ba(e) {
    Ha(e);
    let t = e[xe];
    Qe(t) && ga(t);
    for (let n = J; n < e.length; n++)
        ga(e[n])
}
function ga(e) {
    n_(e);
    let t = e[D];
    for (let n = Q; n < t.bindingStartIndex; n++)
        if (Ze(e[n])) {
            let r = e[n];
            Ba(r)
        } else
            Qe(e[n]) && ga(e[n])
}
function uf(e) {
    let t = e._views;
    for (let n of t) {
        let r = Xm(n);
        r !== null && r[xe] !== null && (Qe(r) ? ga(r) : Ba(r))
    }
}
function i_(e, t, n, r) {
    e !== null && (n.cleanup(t),
        Ba(e.lContainer),
        uf(r))
}
function s_(e, t) {
    let n = [];
    for (let r of t)
        for (let o = 0; o < (r[Pd] ?? 1); o++) {
            let i = {
                data: r,
                firstChild: null
            };
            r[Qo] > 0 && (i.firstChild = e,
                e = Ua(r[Qo], e)),
                n.push(i)
        }
    return [e, n]
}
var Kv = () => null
    , Jv = () => null;
function Xv() {
    Kv = a_,
        Jv = c_
}
function a_(e, t) {
    return ty(e, t) ? e[vt].shift() : (Ha(e),
        null)
}
function Jo(e, t) {
    return Kv(e, t)
}
function c_(e, t, n) {
    if (t.tView.ssrId === null)
        return null;
    let r = Jo(e, t.tView.ssrId);
    return n[D].firstUpdatePass && r === null && l_(n, t),
        r
}
function ey(e, t, n) {
    return Jv(e, t, n)
}
function l_(e, t) {
    let n = t;
    for (; n;) {
        if (Pg(e, n))
            return;
        if ((n.flags & 256) === 256)
            break;
        n = n.prev
    }
    for (n = t.next; n && (n.flags & 512) === 512;) {
        if (Pg(e, n))
            return;
        n = n.next
    }
}
function ty(e, t) {
    let n = e[vt];
    return !t || n === null || n.length === 0 ? !1 : n[0].data[xm] === t
}
function Pg(e, t) {
    let n = t.tView?.ssrId;
    if (n == null)
        return !1;
    let r = e[t.index];
    return Ze(r) && ty(r, n) ? (Ha(r),
        !0) : !1
}
var ny = class {
}
    , $a = class {
    }
    , gd = class {
        resolveComponentFactory(t) {
            throw new y(917, !1)
        }
    }
    , ui = class {
        static NULL = new gd
    }
    , tr = class {
    }
    , or = (() => {
        class e {
            destroyNode = null;
            static __NG_ELEMENT_ID__ = () => u_()
        }
        return e
    }
    )();
function u_() {
    let e = A()
        , t = we()
        , n = st(t.index, e);
    return (Qe(n) ? n : e)[B]
}
var ry = (() => {
    class e {
        static \u0275prov = w({
            token: e,
            providedIn: "root",
            factory: () => null
        })
    }
    return e
}
)();
var ra = {}
    , Vr = class {
        injector;
        parentInjector;
        constructor(t, n) {
            this.injector = t,
                this.parentInjector = n
        }
        get(t, n, r) {
            let o = this.injector.get(t, ra, r);
            return o !== ra || n === ra ? o : this.parentInjector.get(t, n, r)
        }
    }
    ;
function ma(e, t, n) {
    let r = n ? e.styles : null
        , o = n ? e.classes : null
        , i = 0;
    if (t !== null)
        for (let s = 0; s < t.length; s++) {
            let a = t[s];
            if (typeof a == "number")
                i = a;
            else if (i == 1)
                o = Ss(o, a);
            else if (i == 2) {
                let c = a
                    , l = t[++s];
                r = Ss(r, c + ": " + l + ";")
            }
        }
    n ? e.styles = r : e.stylesWithoutHost = r,
        n ? e.classes = o : e.classesWithoutHost = o
}
function F(e, t = 0) {
    let n = A();
    if (n === null)
        return k(e, t);
    let r = we();
    return gm(r, n, De(e), t)
}
function d_(e, t, n, r, o) {
    let i = r === null ? null : {
        "": -1
    }
        , s = o(e, n);
    if (s !== null) {
        let a = s
            , c = null
            , l = null;
        for (let u of s)
            if (u.resolveHostDirectives !== null) {
                [a, c, l] = u.resolveHostDirectives(s);
                break
            }
        p_(e, t, n, a, i, c, l)
    }
    i !== null && r !== null && f_(n, r, i)
}
function f_(e, t, n) {
    let r = e.localNames = [];
    for (let o = 0; o < t.length; o += 2) {
        let i = n[t[o + 1]];
        if (i == null)
            throw new y(-301, !1);
        r.push(t[o], i)
    }
}
function h_(e, t, n) {
    t.componentOffset = n,
        (e.components ??= []).push(t.index)
}
function p_(e, t, n, r, o, i, s) {
    let a = r.length
        , c = null;
    for (let h = 0; h < a; h++) {
        let f = r[h];
        c === null && Ot(f) && (c = f,
            h_(e, n, h)),
            id(la(n, t), e, f.type)
    }
    I_(n, e.data.length, a),
        c?.viewProvidersResolver && c.viewProvidersResolver(c);
    for (let h = 0; h < a; h++) {
        let f = r[h];
        f.providersResolver && f.providersResolver(f)
    }
    let l = !1
        , u = !1
        , d = Iv(e, t, a, null);
    a > 0 && (n.directiveToIndex = new Map);
    for (let h = 0; h < a; h++) {
        let f = r[h];
        if (n.mergedAttrs = Hr(n.mergedAttrs, f.hostAttrs),
            m_(e, n, t, d, f),
            E_(d, f, o),
            s !== null && s.has(f)) {
            let [E, M] = s.get(f);
            n.directiveToIndex.set(f.type, [d, E + n.directiveStart, M + n.directiveStart])
        } else
            (i === null || !i.has(f)) && n.directiveToIndex.set(f.type, d);
        f.contentQueries !== null && (n.flags |= 4),
            (f.hostBindings !== null || f.hostAttrs !== null || f.hostVars !== 0) && (n.flags |= 64);
        let g = f.type.prototype;
        !l && (g.ngOnChanges || g.ngOnInit || g.ngDoCheck) && ((e.preOrderHooks ??= []).push(n.index),
            l = !0),
            !u && (g.ngOnChanges || g.ngDoCheck) && ((e.preOrderCheckHooks ??= []).push(n.index),
                u = !0),
            d++
    }
    g_(e, n, i)
}
function g_(e, t, n) {
    for (let r = t.directiveStart; r < t.directiveEnd; r++) {
        let o = e.data[r];
        if (n === null || !n.has(o))
            Lg(0, t, o, r),
                Lg(1, t, o, r),
                jg(t, r, !1);
        else {
            let i = n.get(o);
            Fg(0, t, i, r),
                Fg(1, t, i, r),
                jg(t, r, !0)
        }
    }
}
function Lg(e, t, n, r) {
    let o = e === 0 ? n.inputs : n.outputs;
    for (let i in o)
        if (o.hasOwnProperty(i)) {
            let s;
            e === 0 ? s = t.inputs ??= {} : s = t.outputs ??= {},
                s[i] ??= [],
                s[i].push(r),
                oy(t, i)
        }
}
function Fg(e, t, n, r) {
    let o = e === 0 ? n.inputs : n.outputs;
    for (let i in o)
        if (o.hasOwnProperty(i)) {
            let s = o[i], a;
            e === 0 ? a = t.hostDirectiveInputs ??= {} : a = t.hostDirectiveOutputs ??= {},
                a[s] ??= [],
                a[s].push(r, i),
                oy(t, s)
        }
}
function oy(e, t) {
    t === "class" ? e.flags |= 8 : t === "style" && (e.flags |= 16)
}
function jg(e, t, n) {
    let { attrs: r, inputs: o, hostDirectiveInputs: i } = e;
    if (r === null || !n && o === null || n && i === null || Wd(e)) {
        e.initialInputs ??= [],
            e.initialInputs.push(null);
        return
    }
    let s = null
        , a = 0;
    for (; a < r.length;) {
        let c = r[a];
        if (c === 0) {
            a += 4;
            continue
        } else if (c === 5) {
            a += 2;
            continue
        } else if (typeof c == "number")
            break;
        if (!n && o.hasOwnProperty(c)) {
            let l = o[c];
            for (let u of l)
                if (u === t) {
                    s ??= [],
                        s.push(c, r[a + 1]);
                    break
                }
        } else if (n && i.hasOwnProperty(c)) {
            let l = i[c];
            for (let u = 0; u < l.length; u += 2)
                if (l[u] === t) {
                    s ??= [],
                        s.push(l[u + 1], r[a + 1]);
                    break
                }
        }
        a += 2
    }
    e.initialInputs ??= [],
        e.initialInputs.push(s)
}
function m_(e, t, n, r, o) {
    e.data[r] = o;
    let i = o.factory || (o.factory = Fn(o.type, !0))
        , s = new Jn(i, Ot(o), F, null);
    e.blueprint[r] = s,
        n[r] = s,
        v_(e, t, r, Iv(e, n, o.hostVars, Je), o)
}
function v_(e, t, n, r, o) {
    let i = o.hostBindings;
    if (i) {
        let s = e.hostBindingOpCodes;
        s === null && (s = e.hostBindingOpCodes = []);
        let a = ~t.index;
        y_(s) != a && s.push(a),
            s.push(n, r, i)
    }
}
function y_(e) {
    let t = e.length;
    for (; t > 0;) {
        let n = e[--t];
        if (typeof n == "number" && n < 0)
            return n
    }
    return 0
}
function E_(e, t, n) {
    if (n) {
        if (t.exportAs)
            for (let r = 0; r < t.exportAs.length; r++)
                n[t.exportAs[r]] = e;
        Ot(t) && (n[""] = e)
    }
}
function I_(e, t, n) {
    e.flags |= 1,
        e.directiveStart = t,
        e.directiveEnd = t + n,
        e.providerIndexes = t
}
function iy(e, t, n, r, o, i, s, a) {
    let c = t[D]
        , l = c.consts
        , u = kt(l, s)
        , d = li(c, e, n, r, u);
    return i && d_(c, t, d, kt(l, a), o),
        d.mergedAttrs = Hr(d.mergedAttrs, d.attrs),
        d.attrs !== null && ma(d, d.attrs, !1),
        d.mergedAttrs !== null && ma(d, d.mergedAttrs, !0),
        c.queries !== null && c.queries.elementStart(c, d),
        d
}
function sy(e, t) {
    GC(e, t),
        Eu(t) && e.queries.elementEnd(t)
}
function D_(e, t, n, r, o, i) {
    let s = t.consts
        , a = kt(s, o)
        , c = li(t, e, n, r, a);
    if (c.mergedAttrs = Hr(c.mergedAttrs, c.attrs),
        i != null) {
        let l = kt(s, i);
        c.localNames = [];
        for (let u = 0; u < l.length; u += 2)
            c.localNames.push(l[u], -1)
    }
    return c.attrs !== null && ma(c, c.attrs, !1),
        c.mergedAttrs !== null && ma(c, c.mergedAttrs, !0),
        t.queries !== null && t.queries.elementStart(t, c),
        c
}
function ay(e, t, n) {
    return e[t] = n
}
function C_(e, t) {
    return e[t]
}
function Ft(e, t, n) {
    if (n === Je)
        return !1;
    let r = e[t];
    return Object.is(r, n) ? !1 : (e[t] = n,
        !0)
}
function b_(e, t, n, r) {
    let o = Ft(e, t, n);
    return Ft(e, t + 1, r) || o
}
function oa(e, t, n) {
    return function r(o) {
        let i = Yt(e) ? st(e.index, t) : t;
        ja(i, 5);
        let s = t[ie]
            , a = Vg(t, s, n, o)
            , c = r.__ngNextListenerFn__;
        for (; c;)
            a = Vg(t, s, c, o) && a,
                c = c.__ngNextListenerFn__;
        return a
    }
}
function Vg(e, t, n, r) {
    let o = C(null);
    try {
        return U(j.OutputStart, t, n),
            n(r) !== !1
    } catch (i) {
        return of(e, i),
            !1
    } finally {
        U(j.OutputEnd, t, n),
            C(o)
    }
}
function cy(e, t, n, r, o, i, s, a) {
    let c = js(e)
        , l = !1
        , u = null;
    if (!r && c && (u = __(t, n, i, e.index)),
        u !== null) {
        let d = u.__ngLastListenerFn__ || u;
        d.__ngNextListenerFn__ = s,
            u.__ngLastListenerFn__ = s,
            l = !0
    } else {
        let d = it(e, n)
            , h = r ? r(d) : d;
        mb(n, h, i, a);
        let f = o.listen(h, i, a);
        if (!w_(i)) {
            let g = r ? E => r(Ye(E[e.index])) : e.index;
            ly(g, t, n, i, a, f, !1)
        }
    }
    return l
}
function w_(e) {
    return e.startsWith("animation") || e.startsWith("transition")
}
function __(e, t, n, r) {
    let o = e.cleanup;
    if (o != null)
        for (let i = 0; i < o.length - 1; i += 2) {
            let s = o[i];
            if (s === n && o[i + 1] === r) {
                let a = t[kr]
                    , c = o[i + 2];
                return a && a.length > c ? a[c] : null
            }
            typeof s == "string" && (i += 2)
        }
    return null
}
function ly(e, t, n, r, o, i, s) {
    let a = t.firstCreatePass ? Tu(t) : null
        , c = _u(n)
        , l = c.length;
    c.push(o, i),
        a && a.push(r, e, l, (l + 1) * (s ? -1 : 1))
}
function Ug(e, t, n, r, o, i) {
    let s = t[n]
        , a = t[D]
        , l = a.data[n].outputs[r]
        , d = s[l].subscribe(i);
    ly(e.index, a, t, o, i, d, !0)
}
var md = Symbol("BINDING");
var va = class extends ui {
    ngModule;
    constructor(t) {
        super(),
            this.ngModule = t
    }
    resolveComponentFactory(t) {
        let n = Qt(t);
        return new $r(n, this.ngModule)
    }
}
    ;
function T_(e) {
    return Object.keys(e).map(t => {
        let [n, r, o] = e[t]
            , i = {
                propName: n,
                templateName: t,
                isSignal: (r & ka.SignalBased) !== 0
            };
        return o && (i.transform = o),
            i
    }
    )
}
function S_(e) {
    return Object.keys(e).map(t => ({
        propName: e[t],
        templateName: t
    }))
}
function M_(e, t, n) {
    let r = t instanceof te ? t : t?.injector;
    return r && e.getStandaloneInjector !== null && (r = e.getStandaloneInjector(r) || r),
        r ? new Vr(n, r) : n
}
function N_(e) {
    let t = e.get(tr, null);
    if (t === null)
        throw new y(407, !1);
    let n = e.get(ry, null)
        , r = e.get(Wt, null);
    return {
        rendererFactory: t,
        sanitizer: n,
        changeDetectionScheduler: r,
        ngReflect: !1
    }
}
function R_(e, t) {
    let n = uy(e);
    return zd(t, n, n === "svg" ? Iu : n === "math" ? Gp : null)
}
function uy(e) {
    return (e.selectors[0][0] || "div").toLowerCase()
}
var $r = class extends $a {
    componentDef;
    ngModule;
    selector;
    componentType;
    ngContentSelectors;
    isBoundToModule;
    cachedInputs = null;
    cachedOutputs = null;
    get inputs() {
        return this.cachedInputs ??= T_(this.componentDef.inputs),
            this.cachedInputs
    }
    get outputs() {
        return this.cachedOutputs ??= S_(this.componentDef.outputs),
            this.cachedOutputs
    }
    constructor(t, n) {
        super(),
            this.componentDef = t,
            this.ngModule = n,
            this.componentType = t.type,
            this.selector = Wb(t.selectors),
            this.ngContentSelectors = t.ngContentSelectors ?? [],
            this.isBoundToModule = !!n
    }
    create(t, n, r, o, i, s) {
        U(j.DynamicComponentStart);
        let a = C(null);
        try {
            let c = this.componentDef
                , l = A_(r, c, s, i)
                , u = M_(c, o || this.ngModule, t)
                , d = N_(u)
                , h = d.rendererFactory.createRenderer(null, c)
                , f = r ? mw(h, r, c.encapsulation, u) : R_(c, h)
                , g = s?.some(Hg) || i?.some(x => typeof x != "function" && x.bindings.some(Hg))
                , E = Zd(null, l, null, 512 | Ev(c), null, null, d, h, u, null, Jm(f, u, !0));
            E[Q] = f,
                zs(E);
            let M = null;
            try {
                let x = iy(Q, E, 2, "#host", () => l.directiveRegistry, !0, 0);
                dv(h, f, x),
                    Br(f, E),
                    Av(l, E, x),
                    iv(l, x, E),
                    sy(l, x),
                    n !== void 0 && O_(x, this.ngContentSelectors, n),
                    M = st(x.index, E),
                    E[ie] = M[ie],
                    af(l, E, null)
            } catch (x) {
                throw M !== null && ad(M),
                ad(E),
                x
            } finally {
                U(j.DynamicComponentEnd),
                    Gs()
            }
            return new ya(this.componentType, E, !!g)
        } finally {
            C(a)
        }
    }
}
    ;
function A_(e, t, n, r) {
    let o = e ? ["ng-version", "21.1.3"] : Qb(t.selectors[0])
        , i = null
        , s = null
        , a = 0;
    if (n)
        for (let u of n)
            a += u[md].requiredVars,
                u.create && (u.targetIdx = 0,
                    (i ??= []).push(u)),
                u.update && (u.targetIdx = 0,
                    (s ??= []).push(u));
    if (r)
        for (let u = 0; u < r.length; u++) {
            let d = r[u];
            if (typeof d != "function")
                for (let h of d.bindings) {
                    a += h[md].requiredVars;
                    let f = u + 1;
                    h.create && (h.targetIdx = f,
                        (i ??= []).push(h)),
                        h.update && (h.targetIdx = f,
                            (s ??= []).push(h))
                }
        }
    let c = [t];
    if (r)
        for (let u of r) {
            let d = typeof u == "function" ? u : u.type
                , h = Ns(d);
            c.push(h)
        }
    return Qd(0, null, x_(i, s), 1, a, c, null, null, null, [o], null)
}
function x_(e, t) {
    return !e && !t ? null : n => {
        if (n & 1 && e)
            for (let r of e)
                r.create();
        if (n & 2 && t)
            for (let r of t)
                r.update()
    }
}
function Hg(e) {
    let t = e[md].kind;
    return t === "input" || t === "twoWay"
}
var ya = class extends ny {
    _rootLView;
    _hasInputBindings;
    instance;
    hostView;
    changeDetectorRef;
    componentType;
    location;
    previousInputValues = null;
    _tNode;
    constructor(t, n, r) {
        super(),
            this._rootLView = n,
            this._hasInputBindings = r,
            this._tNode = Wn(n[D], Q),
            this.location = qr(this._tNode, n),
            this.instance = st(this._tNode.index, n)[ie],
            this.hostView = this.changeDetectorRef = new vn(n, void 0),
            this.componentType = t
    }
    setInput(t, n) {
        this._hasInputBindings;
        let r = this._tNode;
        if (this.previousInputValues ??= new Map,
            this.previousInputValues.has(t) && Object.is(this.previousInputValues.get(t), n))
            return;
        let o = this._rootLView
            , i = sf(r, o[D], o, t, n);
        this.previousInputValues.set(t, n);
        let s = st(r.index, o);
        ja(s, 1)
    }
    get injector() {
        return new Kn(this._tNode, this._rootLView)
    }
    destroy() {
        this.hostView.destroy()
    }
    onDestroy(t) {
        this.hostView.onDestroy(t)
    }
}
    ;
function O_(e, t, n) {
    let r = e.projection = [];
    for (let o = 0; o < t.length; o++) {
        let i = n[o];
        r.push(i != null && i.length ? Array.from(i) : null)
    }
}
var Kr = (() => {
    class e {
        static __NG_ELEMENT_ID__ = k_
    }
    return e
}
)();
function k_() {
    let e = we();
    return fy(e, A())
}
var P_ = Kr
    , dy = class extends P_ {
        _lContainer;
        _hostTNode;
        _hostLView;
        constructor(t, n, r) {
            super(),
                this._lContainer = t,
                this._hostTNode = n,
                this._hostLView = r
        }
        get element() {
            return qr(this._hostTNode, this._hostLView)
        }
        get injector() {
            return new Kn(this._hostTNode, this._hostLView)
        }
        get parentInjector() {
            let t = xd(this._hostTNode, this._hostLView);
            if (lm(t)) {
                let n = ca(t, this._hostLView)
                    , r = aa(t)
                    , o = n[D].data[r + 8];
                return new Kn(o, n)
            } else
                return new Kn(null, this._hostLView)
        }
        clear() {
            for (; this.length > 0;)
                this.remove(this.length - 1)
        }
        get(t) {
            let n = Bg(this._lContainer);
            return n !== null && n[t] || null
        }
        get length() {
            return this._lContainer.length - J
        }
        createEmbeddedView(t, n, r) {
            let o, i;
            typeof r == "number" ? o = r : r != null && (o = r.index,
                i = r.injector);
            let s = Jo(this._lContainer, t.ssrId)
                , a = t.createEmbeddedViewImpl(n || {}, i, s);
            return this.insertImpl(a, o, er(this._hostTNode, s)),
                a
        }
        createComponent(t, n, r, o, i, s, a) {
            let c = t && !UC(t), l;
            if (c)
                l = n;
            else {
                let M = n || {};
                l = M.index,
                    r = M.injector,
                    o = M.projectableNodes,
                    i = M.environmentInjector || M.ngModuleRef,
                    s = M.directives,
                    a = M.bindings
            }
            let u = c ? t : new $r(Qt(t))
                , d = r || this.parentInjector;
            if (!i && u.ngModule == null) {
                let x = (c ? d : this.parentInjector).get(te, null);
                x && (i = x)
            }
            let h = Qt(u.componentType ?? {})
                , f = Jo(this._lContainer, h?.id ?? null)
                , g = f?.firstChild ?? null
                , E = u.create(d, o, g, i, s, a);
            return this.insertImpl(E.hostView, l, er(this._hostTNode, f)),
                E
        }
        insert(t, n) {
            return this.insertImpl(t, n, !0)
        }
        insertImpl(t, n, r) {
            let o = t._lView;
            if (Wp(o)) {
                let a = this.indexOf(t);
                if (a !== -1)
                    this.detach(a);
                else {
                    let c = o[oe]
                        , l = new dy(c, c[Oe], c[oe]);
                    l.detach(l.indexOf(t))
                }
            }
            let i = this._adjustIndex(n)
                , s = this._lContainer;
            return Yr(s, o, i, r),
                t.attachToViewContainerRef(),
                fu(Yu(s), i, t),
                t
        }
        move(t, n) {
            return this.insert(t, n)
        }
        indexOf(t) {
            let n = Bg(this._lContainer);
            return n !== null ? n.indexOf(t) : -1
        }
        remove(t) {
            let n = this._adjustIndex(t, -1)
                , r = Yo(this._lContainer, n);
            r && (Po(Yu(this._lContainer), n),
                La(r[D], r))
        }
        detach(t) {
            let n = this._adjustIndex(t, -1)
                , r = Yo(this._lContainer, n);
            return r && Po(Yu(this._lContainer), n) != null ? new vn(r) : null
        }
        _adjustIndex(t, n = 0) {
            return t ?? this.length + n
        }
    }
    ;
function Bg(e) {
    return e[jo]
}
function Yu(e) {
    return e[jo] || (e[jo] = [])
}
function fy(e, t) {
    let n, r = t[e.index];
    return Ze(r) ? n = r : (n = qv(r, t, null, e),
        t[e.index] = n,
        Yd(t, n)),
        hy(n, t, e, r),
        new dy(n, e, t)
}
function L_(e, t) {
    let n = e[B]
        , r = n.createComment("")
        , o = it(t, e)
        , i = n.parentNode(o);
    return ha(n, i, r, n.nextSibling(o), !1),
        r
}
var hy = py
    , df = () => !1;
function F_(e, t, n) {
    return df(e, t, n)
}
function py(e, t, n, r) {
    if (e[xt])
        return;
    let o;
    n.type & 8 ? o = Ye(r) : o = L_(t, n),
        e[xt] = o
}
function j_(e, t, n) {
    if (e[xt] && e[vt])
        return !0;
    let r = n[ke]
        , o = t.index - Q;
    if (!r || Cm(t) || nv(r, o))
        return !1;
    let s = ud(r, o)
        , a = r.data[Na]?.[o]
        , [c, l] = s_(s, a);
    return e[xt] = c,
        e[vt] = l,
        !0
}
function V_(e, t, n, r) {
    df(e, n, t) || py(e, t, n, r)
}
function gy() {
    hy = V_,
        df = j_
}
var vd = class e {
    queryList;
    matches = null;
    constructor(t) {
        this.queryList = t
    }
    clone() {
        return new e(this.queryList)
    }
    setDirty() {
        this.queryList.setDirty()
    }
}
    , yd = class e {
        queries;
        constructor(t = []) {
            this.queries = t
        }
        createEmbeddedView(t) {
            let n = t.queries;
            if (n !== null) {
                let r = t.contentQueries !== null ? t.contentQueries[0] : n.length
                    , o = [];
                for (let i = 0; i < r; i++) {
                    let s = n.getByIndex(i)
                        , a = this.queries[s.indexInDeclarationView];
                    o.push(a.clone())
                }
                return new e(o)
            }
            return null
        }
        insertView(t) {
            this.dirtyQueriesWithMatches(t)
        }
        detachView(t) {
            this.dirtyQueriesWithMatches(t)
        }
        finishViewCreation(t) {
            this.dirtyQueriesWithMatches(t)
        }
        dirtyQueriesWithMatches(t) {
            for (let n = 0; n < this.queries.length; n++)
                hf(t, n).matches !== null && this.queries[n].setDirty()
        }
    }
    , Ea = class {
        flags;
        read;
        predicate;
        constructor(t, n, r = null) {
            this.flags = n,
                this.read = r,
                typeof t == "string" ? this.predicate = q_(t) : this.predicate = t
        }
    }
    , Ed = class e {
        queries;
        constructor(t = []) {
            this.queries = t
        }
        elementStart(t, n) {
            for (let r = 0; r < this.queries.length; r++)
                this.queries[r].elementStart(t, n)
        }
        elementEnd(t) {
            for (let n = 0; n < this.queries.length; n++)
                this.queries[n].elementEnd(t)
        }
        embeddedTView(t) {
            let n = null;
            for (let r = 0; r < this.length; r++) {
                let o = n !== null ? n.length : 0
                    , i = this.getByIndex(r).embeddedTView(t, o);
                i && (i.indexInDeclarationView = r,
                    n !== null ? n.push(i) : n = [i])
            }
            return n !== null ? new e(n) : null
        }
        template(t, n) {
            for (let r = 0; r < this.queries.length; r++)
                this.queries[r].template(t, n)
        }
        getByIndex(t) {
            return this.queries[t]
        }
        get length() {
            return this.queries.length
        }
        track(t) {
            this.queries.push(t)
        }
    }
    , Id = class e {
        metadata;
        matches = null;
        indexInDeclarationView = -1;
        crossesNgTemplate = !1;
        _declarationNodeIndex;
        _appliesToNextNode = !0;
        constructor(t, n = -1) {
            this.metadata = t,
                this._declarationNodeIndex = n
        }
        elementStart(t, n) {
            this.isApplyingToNode(n) && this.matchTNode(t, n)
        }
        elementEnd(t) {
            this._declarationNodeIndex === t.index && (this._appliesToNextNode = !1)
        }
        template(t, n) {
            this.elementStart(t, n)
        }
        embeddedTView(t, n) {
            return this.isApplyingToNode(t) ? (this.crossesNgTemplate = !0,
                this.addMatch(-t.index, n),
                new e(this.metadata)) : null
        }
        isApplyingToNode(t) {
            if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
                let n = this._declarationNodeIndex
                    , r = t.parent;
                for (; r !== null && r.type & 8 && r.index !== n;)
                    r = r.parent;
                return n === (r !== null ? r.index : -1)
            }
            return this._appliesToNextNode
        }
        matchTNode(t, n) {
            let r = this.metadata.predicate;
            if (Array.isArray(r))
                for (let o = 0; o < r.length; o++) {
                    let i = r[o];
                    this.matchTNodeWithReadOption(t, n, U_(n, i)),
                        this.matchTNodeWithReadOption(t, n, ta(n, t, i, !1, !1))
                }
            else
                r === Ko ? n.type & 4 && this.matchTNodeWithReadOption(t, n, -1) : this.matchTNodeWithReadOption(t, n, ta(n, t, r, !1, !1))
        }
        matchTNodeWithReadOption(t, n, r) {
            if (r !== null) {
                let o = this.metadata.read;
                if (o !== null)
                    if (o === Dt || o === Kr || o === Ko && n.type & 4)
                        this.addMatch(n.index, -2);
                    else {
                        let i = ta(n, t, o, !1, !1);
                        i !== null && this.addMatch(n.index, i)
                    }
                else
                    this.addMatch(n.index, r)
            }
        }
        addMatch(t, n) {
            this.matches === null ? this.matches = [t, n] : this.matches.push(t, n)
        }
    }
    ;
function U_(e, t) {
    let n = e.localNames;
    if (n !== null) {
        for (let r = 0; r < n.length; r += 2)
            if (n[r] === t)
                return n[r + 1]
    }
    return null
}
function H_(e, t) {
    return e.type & 11 ? qr(e, t) : e.type & 4 ? lf(e, t) : null
}
function B_(e, t, n, r) {
    return n === -1 ? H_(t, e) : n === -2 ? $_(e, t, r) : Wo(e, e[D], n, t)
}
function $_(e, t, n) {
    if (n === Dt)
        return qr(t, e);
    if (n === Ko)
        return lf(t, e);
    if (n === Kr)
        return fy(t, e)
}
function my(e, t, n, r) {
    let o = t[At].queries[r];
    if (o.matches === null) {
        let i = e.data
            , s = n.matches
            , a = [];
        for (let c = 0; s !== null && c < s.length; c += 2) {
            let l = s[c];
            if (l < 0)
                a.push(null);
            else {
                let u = i[l];
                a.push(B_(t, u, s[c + 1], n.metadata.read))
            }
        }
        o.matches = a
    }
    return o.matches
}
function Dd(e, t, n, r) {
    let o = e.queries.getByIndex(n)
        , i = o.matches;
    if (i !== null) {
        let s = my(e, t, o, n);
        for (let a = 0; a < i.length; a += 2) {
            let c = i[a];
            if (c > 0)
                r.push(s[a / 2]);
            else {
                let l = i[a + 1]
                    , u = t[-c];
                for (let d = J; d < u.length; d++) {
                    let h = u[d];
                    h[pn] === h[oe] && Dd(h[D], h, l, r)
                }
                if (u[Gn] !== null) {
                    let d = u[Gn];
                    for (let h = 0; h < d.length; h++) {
                        let f = d[h];
                        Dd(f[D], f, l, r)
                    }
                }
            }
        }
    }
    return r
}
function ff(e, t) {
    return e[At].queries[t].queryList
}
function vy(e, t, n) {
    let r = new ua((n & 4) === 4);
    return Yp(e, t, r, r.destroy),
        (t[At] ??= new yd).queries.push(new vd(r)) - 1
}
function z_(e, t, n) {
    let r = ue();
    return r.firstCreatePass && (yy(r, new Ea(e, t, n), -1),
        (t & 2) === 2 && (r.staticViewQueries = !0)),
        vy(r, A(), t)
}
function G_(e, t, n, r) {
    let o = ue();
    if (o.firstCreatePass) {
        let i = we();
        yy(o, new Ea(t, n, r), i.index),
            W_(o, e),
            (n & 2) === 2 && (o.staticContentQueries = !0)
    }
    return vy(o, A(), n)
}
function q_(e) {
    return e.split(",").map(t => t.trim())
}
function yy(e, t, n) {
    e.queries === null && (e.queries = new Ed),
        e.queries.track(new Id(t, n))
}
function W_(e, t) {
    let n = e.contentQueries || (e.contentQueries = [])
        , r = n.length ? n[n.length - 1] : -1;
    t !== r && n.push(e.queries.length - 1, t)
}
function hf(e, t) {
    return e.queries.getByIndex(t)
}
function Ey(e, t) {
    let n = e[D]
        , r = hf(n, t);
    return r.crossesNgTemplate ? Dd(n, e, t, []) : my(n, e, r, t)
}
function Iy(e, t, n) {
    let r, o = Co(() => {
        r._dirtyCounter();
        let i = Z_(r, e);
        if (t && i === void 0)
            throw new y(-951, !1);
        return i
    }
    );
    return r = o[ve],
        r._dirtyCounter = $(0),
        r._flatValue = void 0,
        o
}
function Dy(e) {
    return Iy(!0, !1, e)
}
function Cy(e) {
    return Iy(!0, !0, e)
}
function Q_(e, t) {
    let n = e[ve];
    n._lView = A(),
        n._queryIndex = t,
        n._queryList = ff(n._lView, t),
        n._queryList.onDirty(() => n._dirtyCounter.update(r => r + 1))
}
function Z_(e, t) {
    let n = e._lView
        , r = e._queryIndex;
    if (n === void 0 || r === void 0 || n[S] & 4)
        return t ? void 0 : Me;
    let o = ff(n, r)
        , i = Ey(n, r);
    return o.reset(i, ym),
        t ? o.first : o._changesDetected || e._flatValue === void 0 ? e._flatValue = o.toArray() : e._flatValue
}
var zr = class {
}
    , za = class {
    }
    ;
var Ia = class extends zr {
    ngModuleType;
    _parent;
    _bootstrapComponents = [];
    _r3Injector;
    instance;
    destroyCbs = [];
    componentFactoryResolver = new va(this);
    constructor(t, n, r, o = !0) {
        super(),
            this.ngModuleType = t,
            this._parent = n;
        let i = cu(t);
        this._bootstrapComponents = mv(i.bootstrap),
            this._r3Injector = Vu(t, n, [{
                provide: zr,
                useValue: this
            }, {
                provide: ui,
                useValue: this.componentFactoryResolver
            }, ...r], qt(t), new Set(["environment"])),
            o && this.resolveInjectorInitializers()
    }
    resolveInjectorInitializers() {
        this._r3Injector.resolveInjectorInitializers(),
            this.instance = this._r3Injector.get(this.ngModuleType)
    }
    get injector() {
        return this._r3Injector
    }
    destroy() {
        let t = this._r3Injector;
        !t.destroyed && t.destroy(),
            this.destroyCbs.forEach(n => n()),
            this.destroyCbs = null
    }
    onDestroy(t) {
        this.destroyCbs.push(t)
    }
}
    , Da = class extends za {
        moduleType;
        constructor(t) {
            super(),
                this.moduleType = t
        }
        create(t) {
            return new Ia(this.moduleType, t, [])
        }
    }
    ;
var Xo = class extends zr {
    injector;
    componentFactoryResolver = new va(this);
    instance = null;
    constructor(t) {
        super();
        let n = new Vn([...t.providers, {
            provide: zr,
            useValue: this
        }, {
            provide: ui,
            useValue: this.componentFactoryResolver
        }], t.parent || Fo(), t.debugName, new Set(["environment"]));
        this.injector = n,
            t.runEnvironmentInitializers && n.resolveInjectorInitializers()
    }
    destroy() {
        this.injector.destroy()
    }
    onDestroy(t) {
        this.injector.onDestroy(t)
    }
}
    ;
function Jr(e, t, n = null) {
    return new Xo({
        providers: e,
        parent: t,
        debugName: n,
        runEnvironmentInitializers: !0
    }).injector
}
var Y_ = (() => {
    class e {
        _injector;
        cachedInjectors = new Map;
        constructor(n) {
            this._injector = n
        }
        getOrCreateStandaloneInjector(n) {
            if (!n.standalone)
                return null;
            if (!this.cachedInjectors.has(n)) {
                let r = Ls(!1, n.type)
                    , o = r.length > 0 ? Jr([r], this._injector, "") : null;
                this.cachedInjectors.set(n, o)
            }
            return this.cachedInjectors.get(n)
        }
        ngOnDestroy() {
            try {
                for (let n of this.cachedInjectors.values())
                    n !== null && n.destroy()
            } finally {
                this.cachedInjectors.clear()
            }
        }
        static \u0275prov = w({
            token: e,
            providedIn: "environment",
            factory: () => new e(k(te))
        })
    }
    return e
}
)();
function X(e) {
    return ni(() => {
        let t = by(e)
            , n = P(m({}, t), {
                decls: e.decls,
                vars: e.vars,
                template: e.template,
                consts: e.consts || null,
                ngContentSelectors: e.ngContentSelectors,
                onPush: e.changeDetection === Od.OnPush,
                directiveDefs: null,
                pipeDefs: null,
                dependencies: t.standalone && e.dependencies || null,
                getStandaloneInjector: t.standalone ? o => o.get(Y_).getOrCreateStandaloneInjector(n) : null,
                getExternalStyles: null,
                signals: e.signals ?? !1,
                data: e.data || {},
                encapsulation: e.encapsulation || It.Emulated,
                styles: e.styles || Me,
                _: null,
                schemas: e.schemas || null,
                tView: null,
                id: ""
            });
        t.standalone && lt("NgStandalone"),
            wy(n);
        let r = e.dependencies;
        return n.directiveDefs = $g(r, K_),
            n.pipeDefs = $g(r, lu),
            n.id = eT(n),
            n
    }
    )
}
function K_(e) {
    return Qt(e) || Ns(e)
}
function ir(e) {
    return ni(() => ({
        type: e.type,
        bootstrap: e.bootstrap || Me,
        declarations: e.declarations || Me,
        imports: e.imports || Me,
        exports: e.exports || Me,
        transitiveCompileScopes: null,
        schemas: e.schemas || null,
        id: e.id || null
    }))
}
function J_(e, t) {
    if (e == null)
        return hn;
    let n = {};
    for (let r in e)
        if (e.hasOwnProperty(r)) {
            let o = e[r], i, s, a, c;
            Array.isArray(o) ? (a = o[0],
                i = o[1],
                s = o[2] ?? i,
                c = o[3] || null) : (i = o,
                    s = o,
                    a = ka.None,
                    c = null),
                n[i] = [r, a, c],
                t[i] = s
        }
    return n
}
function X_(e) {
    if (e == null)
        return hn;
    let t = {};
    for (let n in e)
        e.hasOwnProperty(n) && (t[e[n]] = n);
    return t
}
function _e(e) {
    return ni(() => {
        let t = by(e);
        return wy(t),
            t
    }
    )
}
function by(e) {
    let t = {};
    return {
        type: e.type,
        providersResolver: null,
        viewProvidersResolver: null,
        factory: null,
        hostBindings: e.hostBindings || null,
        hostVars: e.hostVars || 0,
        hostAttrs: e.hostAttrs || null,
        contentQueries: e.contentQueries || null,
        declaredInputs: t,
        inputConfig: e.inputs || hn,
        exportAs: e.exportAs || null,
        standalone: e.standalone ?? !0,
        signals: e.signals === !0,
        selectors: e.selectors || Me,
        viewQuery: e.viewQuery || null,
        features: e.features || null,
        setInput: null,
        resolveHostDirectives: null,
        hostDirectives: null,
        inputs: J_(e.inputs, t),
        outputs: X_(e.outputs),
        debugInfo: null
    }
}
function wy(e) {
    e.features?.forEach(t => t(e))
}
function $g(e, t) {
    return e ? () => {
        let n = typeof e == "function" ? e() : e
            , r = [];
        for (let o of n) {
            let i = t(o);
            i !== null && r.push(i)
        }
        return r
    }
        : null
}
function eT(e) {
    let t = 0
        , n = typeof e.consts == "function" ? "" : e.consts
        , r = [e.selectors, e.ngContentSelectors, e.hostVars, e.hostAttrs, n, e.vars, e.decls, e.encapsulation, e.standalone, e.signals, e.exportAs, JSON.stringify(e.inputs), JSON.stringify(e.outputs), Object.getOwnPropertyNames(e.type.prototype), !!e.contentQueries, !!e.viewQuery];
    for (let i of r.join("|"))
        t = Math.imul(31, t) + i.charCodeAt(0) << 0;
    return t += 2147483648,
        "c" + t
}
function tT(e) {
    return Object.getPrototypeOf(e.prototype).constructor
}
function Ct(e) {
    let t = tT(e.type)
        , n = !0
        , r = [e];
    for (; t;) {
        let o;
        if (Ot(e))
            o = t.\u0275cmp || t.\u0275dir;
        else {
            if (t.\u0275cmp)
                throw new y(903, !1);
            o = t.\u0275dir
        }
        if (o) {
            if (n) {
                r.push(o);
                let s = e;
                s.inputs = Ku(e.inputs),
                    s.declaredInputs = Ku(e.declaredInputs),
                    s.outputs = Ku(e.outputs);
                let a = o.hostBindings;
                a && sT(e, a);
                let c = o.viewQuery
                    , l = o.contentQueries;
                if (c && oT(e, c),
                    l && iT(e, l),
                    nT(e, o),
                    Rp(e.outputs, o.outputs),
                    Ot(o) && o.data.animation) {
                    let u = e.data;
                    u.animation = (u.animation || []).concat(o.data.animation)
                }
            }
            let i = o.features;
            if (i)
                for (let s = 0; s < i.length; s++) {
                    let a = i[s];
                    a && a.ngInherit && a(e),
                        a === Ct && (n = !1)
                }
        }
        t = Object.getPrototypeOf(t)
    }
    rT(r)
}
function nT(e, t) {
    for (let n in t.inputs) {
        if (!t.inputs.hasOwnProperty(n) || e.inputs.hasOwnProperty(n))
            continue;
        let r = t.inputs[n];
        r !== void 0 && (e.inputs[n] = r,
            e.declaredInputs[n] = t.declaredInputs[n])
    }
}
function rT(e) {
    let t = 0
        , n = null;
    for (let r = e.length - 1; r >= 0; r--) {
        let o = e[r];
        o.hostVars = t += o.hostVars,
            o.hostAttrs = Hr(o.hostAttrs, n = Hr(n, o.hostAttrs))
    }
}
function Ku(e) {
    return e === hn ? {} : e === Me ? [] : e
}
function oT(e, t) {
    let n = e.viewQuery;
    n ? e.viewQuery = (r, o) => {
        t(r, o),
            n(r, o)
    }
        : e.viewQuery = t
}
function iT(e, t) {
    let n = e.contentQueries;
    n ? e.contentQueries = (r, o, i) => {
        t(r, o, i),
            n(r, o, i)
    }
        : e.contentQueries = t
}
function sT(e, t) {
    let n = e.hostBindings;
    n ? e.hostBindings = (r, o) => {
        t(r, o),
            n(r, o)
    }
        : e.hostBindings = t
}
function aT(e, t, n, r, o, i, s, a) {
    if (n.firstCreatePass) {
        e.mergedAttrs = Hr(e.mergedAttrs, e.attrs);
        let u = e.tView = Qd(2, e, o, i, s, n.directiveRegistry, n.pipeRegistry, null, n.schemas, n.consts, null);
        n.queries !== null && (n.queries.template(n, e),
            u.queries = n.queries.embeddedTView(e))
    }
    a && (e.flags |= a),
        Lr(e, !1);
    let c = _y(n, t, e, r);
    Ws() && tf(n, t, c, e),
        Br(c, t);
    let l = qv(c, t, c, e);
    t[r + Q] = l,
        Yd(t, l),
        F_(l, e, t)
}
function ei(e, t, n, r, o, i, s, a, c, l, u) {
    let d = n + Q, h;
    if (t.firstCreatePass) {
        if (h = li(t, d, 4, s || null, a || null),
            l != null) {
            let f = kt(t.consts, l);
            h.localNames = [];
            for (let g = 0; g < f.length; g += 2)
                h.localNames.push(f[g], -1)
        }
    } else
        h = t.data[d];
    return aT(h, e, t, n, r, o, i, c),
        l != null && rf(e, h, u),
        h
}
var _y = Ty;
function Ty(e, t, n, r) {
    return Jt(!0),
        t[B].createComment("")
}
function cT(e, t, n, r) {
    let o = !xa(t, n);
    Jt(o);
    let i = t[ke]?.data[Am]?.[r] ?? null;
    if (i !== null && n.tView !== null && n.tView.ssrId === null && (n.tView.ssrId = i),
        o)
        return Ty(e, t);
    let s = t[ke]
        , a = Va(s, e, t, n);
    Aa(s, r, a);
    let c = Bd(s, r);
    return Ua(c, a)
}
function Sy() {
    _y = cT
}
var Ke = (function (e) {
    return e[e.NOT_STARTED = 0] = "NOT_STARTED",
        e[e.IN_PROGRESS = 1] = "IN_PROGRESS",
        e[e.COMPLETE = 2] = "COMPLETE",
        e[e.FAILED = 3] = "FAILED",
        e
}
)(Ke || {})
    , zg = 0
    , lT = 1
    , fe = (function (e) {
        return e[e.Placeholder = 0] = "Placeholder",
            e[e.Loading = 1] = "Loading",
            e[e.Complete = 2] = "Complete",
            e[e.Error = 3] = "Error",
            e
    }
    )(fe || {});
var uT = 0
    , di = 1;
var dT = 4
    , fT = 5;
var hT = 7
    , Ur = 8
    , pT = 9
    , pf = (function (e) {
        return e[e.Manual = 0] = "Manual",
            e[e.Playthrough = 1] = "Playthrough",
            e
    }
    )(pf || {});
function ia(e, t) {
    let n = mT(e)
        , r = t[n];
    if (r !== null) {
        for (let o of r)
            o();
        t[n] = null
    }
}
function gT(e) {
    ia(1, e),
        ia(0, e),
        ia(2, e)
}
function mT(e) {
    let t = dT;
    return e === 1 ? t = fT : e === 2 && (t = pT),
        t
}
function My(e) {
    return e + 1
}
function Xr(e, t) {
    let n = e[D]
        , r = My(t.index);
    return e[r]
}
function fi(e, t) {
    let n = My(t.index);
    return e.data[n]
}
function vT(e, t, n) {
    let r = t[D]
        , o = fi(r, n);
    switch (e) {
        case fe.Complete:
            return o.primaryTmplIndex;
        case fe.Loading:
            return o.loadingTmplIndex;
        case fe.Error:
            return o.errorTmplIndex;
        case fe.Placeholder:
            return o.placeholderTmplIndex;
        default:
            return null
    }
}
function Gg(e, t) {
    return t === fe.Placeholder ? e.placeholderBlockConfig?.[zg] ?? null : t === fe.Loading ? e.loadingBlockConfig?.[zg] ?? null : null
}
function yT(e) {
    return e.loadingBlockConfig?.[lT] ?? null
}
function qg(e, t) {
    if (!e || e.length === 0)
        return t;
    let n = new Set(e);
    for (let r of t)
        n.add(r);
    return e.length === n.size ? e : Array.from(n)
}
function ET(e, t) {
    let n = t.primaryTmplIndex + Q;
    return Wn(e, n)
}
var IT = (() => {
    class e {
        cachedInjectors = new Map;
        getOrCreateInjector(n, r, o, i) {
            if (!this.cachedInjectors.has(n)) {
                let s = o.length > 0 ? Jr(o, r, i) : null;
                this.cachedInjectors.set(n, s)
            }
            return this.cachedInjectors.get(n)
        }
        ngOnDestroy() {
            try {
                for (let n of this.cachedInjectors.values())
                    n !== null && n.destroy()
            } finally {
                this.cachedInjectors.clear()
            }
        }
        static \u0275prov = w({
            token: e,
            providedIn: "environment",
            factory: () => new e
        })
    }
    return e
}
)();
var Ny = new v("");
function Ju(e, t, n) {
    return e.get(IT).getOrCreateInjector(t, e, n, "")
}
function DT(e, t, n) {
    if (e instanceof Vr) {
        let o = e.injector
            , i = e.parentInjector
            , s = Ju(i, t, n);
        return new Vr(o, s)
    }
    let r = e.get(te);
    if (r !== e) {
        let o = Ju(r, t, n);
        return new Vr(e, o)
    }
    return Ju(e, t, n)
}
function Yn(e, t, n, r = !1) {
    let o = n[oe]
        , i = o[D];
    if (gn(o))
        return;
    let s = Xr(o, t)
        , a = s[di]
        , c = s[hT];
    if (!(c !== null && e < c) && Wg(a, e) && Wg(s[uT] ?? -1, e)) {
        let l = fi(i, t)
            , d = !r && !0 && (yT(l) !== null || Gg(l, fe.Loading) !== null || Gg(l, fe.Placeholder)) ? wT : bT;
        try {
            d(e, s, n, t, o)
        } catch (h) {
            of(o, h)
        }
    }
}
function CT(e, t) {
    let n = e[vt]?.findIndex(o => o.data[Pm] === t[di]) ?? -1;
    return {
        dehydratedView: n > -1 ? e[vt][n] : null,
        dehydratedViewIx: n
    }
}
function bT(e, t, n, r, o) {
    U(j.DeferBlockStateStart);
    let i = vT(e, o, r);
    if (i !== null) {
        t[di] = e;
        let s = o[D]
            , a = i + Q
            , c = Wn(s, a)
            , l = 0;
        cf(n, l);
        let u;
        if (e === fe.Complete) {
            let g = fi(s, r)
                , E = g.providers;
            E && E.length > 0 && (u = DT(o[qe], g, E))
        }
        let { dehydratedView: d, dehydratedViewIx: h } = CT(n, t)
            , f = Zr(o, c, null, {
                injector: u,
                dehydratedView: d
            });
        if (Yr(n, f, l, er(c, d)),
            ja(f, 2),
            h > -1 && n[vt]?.splice(h, 1),
            (e === fe.Complete || e === fe.Error) && Array.isArray(t[Ur])) {
            for (let g of t[Ur])
                g();
            t[Ur] = null
        }
    }
    U(j.DeferBlockStateEnd)
}
function Wg(e, t) {
    return e < t
}
function Qg(e, t, n) {
    e.loadingPromise.then(() => {
        e.loadingState === Ke.COMPLETE ? Yn(fe.Complete, t, n) : e.loadingState === Ke.FAILED && Yn(fe.Error, t, n)
    }
    )
}
var wT = null;
var Ga = (() => {
    class e {
        log(n) {
            console.log(n)
        }
        warn(n) {
            console.warn(n)
        }
        static \u0275fac = function (r) {
            return new (r || e)
        }
            ;
        static \u0275prov = w({
            token: e,
            factory: e.\u0275fac,
            providedIn: "platform"
        })
    }
    return e
}
)();
var gf = new v("");
function sr(e) {
    return !!e && typeof e.then == "function"
}
function Ry(e) {
    return !!e && typeof e.subscribe == "function"
}
var Ay = new v("");
var mf = (() => {
    class e {
        resolve;
        reject;
        initialized = !1;
        done = !1;
        donePromise = new Promise((n, r) => {
            this.resolve = n,
                this.reject = r
        }
        );
        appInits = p(Ay, {
            optional: !0
        }) ?? [];
        injector = p(Ne);
        constructor() { }
        runInitializers() {
            if (this.initialized)
                return;
            let n = [];
            for (let o of this.appInits) {
                let i = Ce(this.injector, o);
                if (sr(i))
                    n.push(i);
                else if (Ry(i)) {
                    let s = new Promise((a, c) => {
                        i.subscribe({
                            complete: a,
                            error: c
                        })
                    }
                    );
                    n.push(s)
                }
            }
            let r = () => {
                this.done = !0,
                    this.resolve()
            }
                ;
            Promise.all(n).then(() => {
                r()
            }
            ).catch(o => {
                this.reject(o)
            }
            ),
                n.length === 0 && r(),
                this.initialized = !0
        }
        static \u0275fac = function (r) {
            return new (r || e)
        }
            ;
        static \u0275prov = w({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
}
)()
    , En = new v("");
function xy() {
    wl(() => {
        let e = "";
        throw new y(600, e)
    }
    )
}
function Oy(e) {
    return e.isBoundToModule
}
var _T = 10;
var Ue = (() => {
    class e {
        _runningTick = !1;
        _destroyed = !1;
        _destroyListeners = [];
        _views = [];
        internalErrorHandler = p(ct);
        afterRenderManager = p(Jd);
        zonelessEnabled = p(Bo);
        rootEffectScheduler = p(Zs);
        dirtyFlags = 0;
        tracingSnapshot = null;
        allTestViews = new Set;
        autoDetectTestViews = new Set;
        includeAllTestViews = !1;
        afterTick = new ce;
        get allViews() {
            return [...(this.includeAllTestViews ? this.allTestViews : this.autoDetectTestViews).keys(), ...this._views]
        }
        get destroyed() {
            return this._destroyed
        }
        componentTypes = [];
        components = [];
        internalPendingTask = p(Pt);
        get isStable() {
            return this.internalPendingTask.hasPendingTasksObservable.pipe(K(n => !n))
        }
        constructor() {
            p(yn, {
                optional: !0
            })
        }
        whenStable() {
            let n;
            return new Promise(r => {
                n = this.isStable.subscribe({
                    next: o => {
                        o && r()
                    }
                })
            }
            ).finally(() => {
                n.unsubscribe()
            }
            )
        }
        _injector = p(te);
        _rendererFactory = null;
        get injector() {
            return this._injector
        }
        bootstrap(n, r) {
            return this.bootstrapImpl(n, r)
        }
        bootstrapImpl(n, r, o = Ne.NULL) {
            return this._injector.get(Ae).run(() => {
                U(j.BootstrapComponentStart);
                let s = n instanceof $a;
                if (!this._injector.get(mf).done) {
                    let g = "";
                    throw new y(405, g)
                }
                let c;
                s ? c = n : c = this._injector.get(ui).resolveComponentFactory(n),
                    this.componentTypes.push(c.componentType);
                let l = Oy(c) ? void 0 : this._injector.get(zr)
                    , u = r || c.selector
                    , d = c.create(o, [], u, l)
                    , h = d.location.nativeElement
                    , f = d.injector.get(gf, null);
                return f?.registerApplication(h),
                    d.onDestroy(() => {
                        this.detachView(d.hostView),
                            qo(this.components, d),
                            f?.unregisterApplication(h)
                    }
                    ),
                    this._loadComponent(d),
                    U(j.BootstrapComponentEnd, d),
                    d
            }
            )
        }
        tick() {
            this.zonelessEnabled || (this.dirtyFlags |= 1),
                this._tick()
        }
        _tick() {
            U(j.ChangeDetectionStart),
                this.tracingSnapshot !== null ? this.tracingSnapshot.run(Pa.CHANGE_DETECTION, this.tickImpl) : this.tickImpl()
        }
        tickImpl = () => {
            if (this._runningTick)
                throw U(j.ChangeDetectionEnd),
                new y(101, !1);
            let n = C(null);
            try {
                this._runningTick = !0,
                    this.synchronize()
            } finally {
                this._runningTick = !1,
                    this.tracingSnapshot?.dispose(),
                    this.tracingSnapshot = null,
                    C(n),
                    this.afterTick.next(),
                    U(j.ChangeDetectionEnd)
            }
        }
            ;
        synchronize() {
            this._rendererFactory === null && !this._injector.destroyed && (this._rendererFactory = this._injector.get(tr, null, {
                optional: !0
            }));
            let n = 0;
            for (; this.dirtyFlags !== 0 && n++ < _T;) {
                U(j.ChangeDetectionSyncStart);
                try {
                    this.synchronizeOnce()
                } finally {
                    U(j.ChangeDetectionSyncEnd)
                }
            }
        }
        synchronizeOnce() {
            this.dirtyFlags & 16 && (this.dirtyFlags &= -17,
                this.rootEffectScheduler.flush());
            let n = !1;
            if (this.dirtyFlags & 7) {
                let r = !!(this.dirtyFlags & 1);
                this.dirtyFlags &= -8,
                    this.dirtyFlags |= 8;
                for (let { _lView: o } of this.allViews) {
                    if (!r && !Vo(o))
                        continue;
                    let i = r && !this.zonelessEnabled ? 0 : 1;
                    Bv(o, i),
                        n = !0
                }
                if (this.dirtyFlags &= -5,
                    this.syncDirtyFlagsWithViews(),
                    this.dirtyFlags & 23)
                    return
            }
            n || (this._rendererFactory?.begin?.(),
                this._rendererFactory?.end?.()),
                this.dirtyFlags & 8 && (this.dirtyFlags &= -9,
                    this.afterRenderManager.execute()),
                this.syncDirtyFlagsWithViews()
        }
        syncDirtyFlagsWithViews() {
            if (this.allViews.some(({ _lView: n }) => Vo(n))) {
                this.dirtyFlags |= 2;
                return
            } else
                this.dirtyFlags &= -8
        }
        attachView(n) {
            let r = n;
            this._views.push(r),
                r.attachToAppRef(this)
        }
        detachView(n) {
            let r = n;
            qo(this._views, r),
                r.detachFromAppRef()
        }
        _loadComponent(n) {
            this.attachView(n.hostView);
            try {
                this.tick()
            } catch (o) {
                this.internalErrorHandler(o)
            }
            this.components.push(n),
                this._injector.get(En, []).forEach(o => o(n))
        }
        ngOnDestroy() {
            if (!this._destroyed)
                try {
                    this._destroyListeners.forEach(n => n()),
                        this._views.slice().forEach(n => n.destroy())
                } finally {
                    this._destroyed = !0,
                        this._views = [],
                        this._destroyListeners = []
                }
        }
        onDestroy(n) {
            return this._destroyListeners.push(n),
                () => qo(this._destroyListeners, n)
        }
        destroy() {
            if (this._destroyed)
                throw new y(406, !1);
            let n = this._injector;
            n.destroy && !n.destroyed && n.destroy()
        }
        get viewCount() {
            return this._views.length
        }
        static \u0275fac = function (r) {
            return new (r || e)
        }
            ;
        static \u0275prov = w({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
}
)();
function qo(e, t) {
    let n = e.indexOf(t);
    n > -1 && e.splice(n, 1)
}
function vf() {
    let e, t;
    return {
        promise: new Promise((r, o) => {
            e = r,
                t = o
        }
        ),
        resolve: e,
        reject: t
    }
}
function ky(e, t, n) {
    let r = t[qe]
        , o = t[D];
    if (e.loadingState !== Ke.NOT_STARTED)
        return e.loadingPromise ?? Promise.resolve();
    let i = Xr(t, n)
        , s = ET(o, e);
    e.loadingState = Ke.IN_PROGRESS,
        ia(1, i);
    let a = e.dependencyResolverFn
        , c = r.get($o).add();
    return a ? (e.loadingPromise = Promise.allSettled(a()).then(l => {
        let u = !1
            , d = []
            , h = [];
        for (let f of l)
            if (f.status === "fulfilled") {
                let g = f.value
                    , E = Qt(g) || Ns(g);
                if (E)
                    d.push(E);
                else {
                    let M = lu(g);
                    M && h.push(M)
                }
            } else {
                u = !0;
                break
            }
        if (u) {
            if (e.loadingState = Ke.FAILED,
                e.errorTmplIndex === null) {
                let g = new y(-750, !1);
                of(t, g)
            }
        } else {
            e.loadingState = Ke.COMPLETE;
            let f = s.tView;
            if (d.length > 0) {
                f.directiveRegistry = qg(f.directiveRegistry, d);
                let g = d.map(M => M.type)
                    , E = Ls(!1, ...g);
                e.providers = E
            }
            h.length > 0 && (f.pipeRegistry = qg(f.pipeRegistry, h))
        }
    }
    ),
        e.loadingPromise.finally(() => {
            e.loadingPromise = null,
                c()
        }
        )) : (e.loadingPromise = Promise.resolve().then(() => {
            e.loadingPromise = null,
                e.loadingState = Ke.COMPLETE,
                c()
        }
        ),
            e.loadingPromise)
}
function TT(e, t) {
    return t[qe].get(Ny, null, {
        optional: !0
    })?.behavior !== pf.Manual
}
function ST(e, t, n) {
    let r = t[D]
        , o = t[n.index];
    if (!TT(e, t))
        return;
    let i = Xr(t, n)
        , s = fi(r, n);
    switch (gT(i),
    s.loadingState) {
        case Ke.NOT_STARTED:
            Yn(fe.Loading, n, o),
                ky(s, t, n),
                s.loadingState === Ke.IN_PROGRESS && Qg(s, n, o);
            break;
        case Ke.IN_PROGRESS:
            Yn(fe.Loading, n, o),
                Qg(s, n, o);
            break;
        case Ke.COMPLETE:
            Yn(fe.Complete, n, o);
            break;
        case Ke.FAILED:
            Yn(fe.Error, n, o);
            break;
        default:
    }
}
async function Py(e, t, n) {
    let r = e.get(Ra);
    if (r.hydrating.has(t))
        return;
    let { parentBlockPromise: i, hydrationQueue: s } = wb(t, e);
    if (s.length === 0)
        return;
    i !== null && s.shift(),
        RT(r, s),
        i !== null && await i;
    let a = s[0];
    r.has(a) ? await Zg(e, s, n) : r.awaitParentBlock(a, async () => await Zg(e, s, n))
}
async function Zg(e, t, n) {
    let r = e.get(Ra)
        , o = r.hydrating
        , i = e.get(Pt)
        , s = i.add();
    for (let c = 0; c < t.length; c++) {
        let l = t[c]
            , u = r.get(l);
        if (u != null) {
            if (await xT(u),
                await AT(e),
                MT(u)) {
                o_(u),
                    Yg(t.slice(c), r);
                break
            }
            o.get(l).resolve()
        } else {
            NT(c, t, r),
                Yg(t.slice(c), r);
            break
        }
    }
    let a = t[t.length - 1];
    await o.get(a)?.promise,
        i.remove(s),
        n && n(t),
        i_(r.get(a), t, r, e.get(Ue))
}
function MT(e) {
    return Xr(e.lView, e.tNode)[di] === fe.Error
}
function NT(e, t, n) {
    let r = e - 1
        , o = r > -1 ? n.get(t[r]) : null;
    o && Ba(o.lContainer)
}
function Yg(e, t) {
    let n = t.hydrating;
    for (let r in e)
        n.get(r)?.reject();
    t.cleanup(e)
}
function RT(e, t) {
    for (let n of t)
        e.hydrating.set(n, vf())
}
function AT(e) {
    return new Promise(t => ci(t, {
        injector: e
    }))
}
async function xT(e) {
    let { tNode: t, lView: n } = e
        , r = Xr(n, t);
    return new Promise(o => {
        OT(r, o),
            ST(2, n, t)
    }
    )
}
function OT(e, t) {
    Array.isArray(e[Ur]) || (e[Ur] = []),
        e[Ur].push(t)
}
function en(e, t, n, r) {
    let o = A()
        , i = Zn();
    if (Ft(o, i, t)) {
        let s = ue()
            , a = qs();
        Tw(a, o, e, t, n, r)
    }
    return en
}
var a1 = typeof document < "u" && typeof document?.documentElement?.getAnimations == "function";
var Cd = class {
    destroy(t) { }
    updateValue(t, n) { }
    swap(t, n) {
        let r = Math.min(t, n)
            , o = Math.max(t, n)
            , i = this.detach(o);
        if (o - r > 1) {
            let s = this.detach(r);
            this.attach(r, i),
                this.attach(o, s)
        } else
            this.attach(r, i)
    }
    move(t, n) {
        this.attach(n, this.detach(t))
    }
}
    ;
function Xu(e, t, n, r, o) {
    return e === n && Object.is(t, r) ? 1 : Object.is(o(e, t), o(n, r)) ? -1 : 0
}
function kT(e, t, n, r) {
    let o, i, s = 0, a = e.length - 1, c = void 0;
    if (Array.isArray(t)) {
        C(r);
        let l = t.length - 1;
        for (C(null); s <= a && s <= l;) {
            let u = e.at(s)
                , d = t[s]
                , h = Xu(s, u, s, d, n);
            if (h !== 0) {
                h < 0 && e.updateValue(s, d),
                    s++;
                continue
            }
            let f = e.at(a)
                , g = t[l]
                , E = Xu(a, f, l, g, n);
            if (E !== 0) {
                E < 0 && e.updateValue(a, g),
                    a--,
                    l--;
                continue
            }
            let M = n(s, u)
                , x = n(a, f)
                , $e = n(s, d);
            if (Object.is($e, x)) {
                let Nn = n(l, g);
                Object.is(Nn, M) ? (e.swap(s, a),
                    e.updateValue(a, g),
                    l--,
                    a--) : e.move(a, s),
                    e.updateValue(s, d),
                    s++;
                continue
            }
            if (o ??= new Ca,
                i ??= Jg(e, s, a, n),
                bd(e, o, s, $e))
                e.updateValue(s, d),
                    s++,
                    a++;
            else if (i.has($e))
                o.set(M, e.detach(s)),
                    a--;
            else {
                let Nn = e.create(s, t[s]);
                e.attach(s, Nn),
                    s++,
                    a++
            }
        }
        for (; s <= l;)
            Kg(e, o, n, s, t[s]),
                s++
    } else if (t != null) {
        C(r);
        let l = t[Symbol.iterator]();
        C(null);
        let u = l.next();
        for (; !u.done && s <= a;) {
            let d = e.at(s)
                , h = u.value
                , f = Xu(s, d, s, h, n);
            if (f !== 0)
                f < 0 && e.updateValue(s, h),
                    s++,
                    u = l.next();
            else {
                o ??= new Ca,
                    i ??= Jg(e, s, a, n);
                let g = n(s, h);
                if (bd(e, o, s, g))
                    e.updateValue(s, h),
                        s++,
                        a++,
                        u = l.next();
                else if (!i.has(g))
                    e.attach(s, e.create(s, h)),
                        s++,
                        a++,
                        u = l.next();
                else {
                    let E = n(s, d);
                    o.set(E, e.detach(s)),
                        a--
                }
            }
        }
        for (; !u.done;)
            Kg(e, o, n, e.length, u.value),
                u = l.next()
    }
    for (; s <= a;)
        e.destroy(e.detach(a--));
    o?.forEach(l => {
        e.destroy(l)
    }
    )
}
function bd(e, t, n, r) {
    return t !== void 0 && t.has(r) ? (e.attach(n, t.get(r)),
        t.delete(r),
        !0) : !1
}
function Kg(e, t, n, r, o) {
    if (bd(e, t, r, n(r, o)))
        e.updateValue(r, o);
    else {
        let i = e.create(r, o);
        e.attach(r, i)
    }
}
function Jg(e, t, n, r) {
    let o = new Set;
    for (let i = t; i <= n; i++)
        o.add(r(i, e.at(i)));
    return o
}
var Ca = class {
    kvMap = new Map;
    _vMap = void 0;
    has(t) {
        return this.kvMap.has(t)
    }
    delete(t) {
        if (!this.has(t))
            return !1;
        let n = this.kvMap.get(t);
        return this._vMap !== void 0 && this._vMap.has(n) ? (this.kvMap.set(t, this._vMap.get(n)),
            this._vMap.delete(n)) : this.kvMap.delete(t),
            !0
    }
    get(t) {
        return this.kvMap.get(t)
    }
    set(t, n) {
        if (this.kvMap.has(t)) {
            let r = this.kvMap.get(t);
            this._vMap === void 0 && (this._vMap = new Map);
            let o = this._vMap;
            for (; o.has(r);)
                r = o.get(r);
            o.set(r, n)
        } else
            this.kvMap.set(t, n)
    }
    forEach(t) {
        for (let [n, r] of this.kvMap)
            if (t(r, n),
                this._vMap !== void 0) {
                let o = this._vMap;
                for (; o.has(r);)
                    r = o.get(r),
                        t(r, n)
            }
    }
}
    ;
function ut(e, t, n, r, o, i, s, a) {
    lt("NgControlFlow");
    let c = A()
        , l = ue()
        , u = kt(l.consts, i);
    return ei(c, l, e, t, n, r, o, u, 256, s, a),
        yf
}
function yf(e, t, n, r, o, i, s, a) {
    lt("NgControlFlow");
    let c = A()
        , l = ue()
        , u = kt(l.consts, i);
    return ei(c, l, e, t, n, r, o, u, 512, s, a),
        yf
}
function dt(e, t) {
    lt("NgControlFlow");
    let n = A()
        , r = Zn()
        , o = n[r] !== Je ? n[r] : -1
        , i = o !== -1 ? ba(n, Q + o) : void 0
        , s = 0;
    if (Ft(n, r, e)) {
        let a = C(null);
        try {
            if (i !== void 0 && cf(i, s),
                e !== -1) {
                let c = Q + e
                    , l = ba(n, c)
                    , u = Sd(n[D], c)
                    , d = ey(l, u, n)
                    , h = Zr(n, u, t, {
                        dehydratedView: d
                    });
                Yr(l, h, s, er(u, d))
            }
        } finally {
            C(a)
        }
    } else if (i !== void 0) {
        let a = Wv(i, s);
        a !== void 0 && (a[ie] = t)
    }
}
var wd = class {
    lContainer;
    $implicit;
    $index;
    constructor(t, n, r) {
        this.lContainer = t,
            this.$implicit = n,
            this.$index = r
    }
    get $count() {
        return this.lContainer.length - J
    }
}
    ;
function qa(e) {
    return e
}
var _d = class {
    hasEmptyBlock;
    trackByFn;
    liveCollection;
    constructor(t, n, r) {
        this.hasEmptyBlock = t,
            this.trackByFn = n,
            this.liveCollection = r
    }
}
    ;
function eo(e, t, n, r, o, i, s, a, c, l, u, d, h) {
    lt("NgControlFlow");
    let f = A()
        , g = ue()
        , E = c !== void 0
        , M = A()
        , x = a ? s.bind(M[be][ie]) : s
        , $e = new _d(E, x);
    M[Q + e] = $e,
        ei(f, g, e + 1, t, n, r, o, kt(g.consts, i), 256),
        E && ei(f, g, e + 2, c, l, u, d, kt(g.consts, h), 512)
}
var Td = class extends Cd {
    lContainer;
    hostLView;
    templateTNode;
    operationsCounter = void 0;
    needsIndexUpdate = !1;
    constructor(t, n, r) {
        super(),
            this.lContainer = t,
            this.hostLView = n,
            this.templateTNode = r
    }
    get length() {
        return this.lContainer.length - J
    }
    at(t) {
        return this.getLView(t)[ie].$implicit
    }
    attach(t, n) {
        let r = n[ke];
        this.needsIndexUpdate ||= t !== this.length,
            Yr(this.lContainer, n, t, er(this.templateTNode, r)),
            PT(this.lContainer, t)
    }
    detach(t) {
        return this.needsIndexUpdate ||= t !== this.length - 1,
            LT(this.lContainer, t),
            FT(this.lContainer, t)
    }
    create(t, n) {
        let r = Jo(this.lContainer, this.templateTNode.tView.ssrId);
        return Zr(this.hostLView, this.templateTNode, new wd(this.lContainer, n, t), {
            dehydratedView: r
        })
    }
    destroy(t) {
        La(t[D], t)
    }
    updateValue(t, n) {
        this.getLView(t)[ie].$implicit = n
    }
    reset() {
        this.needsIndexUpdate = !1
    }
    updateIndexes() {
        if (this.needsIndexUpdate)
            for (let t = 0; t < this.length; t++)
                this.getLView(t)[ie].$index = t
    }
    getLView(t) {
        return jT(this.lContainer, t)
    }
}
    ;
function to(e) {
    let t = C(null)
        , n = Kt();
    try {
        let r = A()
            , o = r[D]
            , i = r[n]
            , s = n + 1
            , a = ba(r, s);
        if (i.liveCollection === void 0) {
            let l = Sd(o, s);
            i.liveCollection = new Td(a, r, l)
        } else
            i.liveCollection.reset();
        let c = i.liveCollection;
        if (kT(c, e, i.trackByFn, t),
            c.updateIndexes(),
            i.hasEmptyBlock) {
            let l = Zn()
                , u = c.length === 0;
            if (Ft(r, l, u)) {
                let d = n + 2
                    , h = ba(r, d);
                if (u) {
                    let f = Sd(o, d)
                        , g = ey(h, f, r)
                        , E = Zr(r, f, void 0, {
                            dehydratedView: g
                        });
                    Yr(h, E, 0, er(f, g))
                } else
                    o.firstUpdatePass && Ha(h),
                        cf(h, 0)
            }
        }
    } finally {
        C(t)
    }
}
function ba(e, t) {
    return e[t]
}
function PT(e, t) {
    if (e.length <= J)
        return;
    let n = J + t
        , r = e[n]
        , o = r ? r[zn] : void 0;
    if (r && o && o.detachedLeaveAnimationFns && o.detachedLeaveAnimationFns.length > 0) {
        let i = r[qe];
        tw(i, o),
            Xn.delete(r[Zt]),
            o.detachedLeaveAnimationFns = void 0
    }
}
function LT(e, t) {
    if (e.length <= J)
        return;
    let n = J + t
        , r = e[n]
        , o = r ? r[zn] : void 0;
    o && o.leave && o.leave.size > 0 && (o.detachedLeaveAnimationFns = [])
}
function FT(e, t) {
    return Yo(e, t)
}
function jT(e, t) {
    return Wv(e, t)
}
function Sd(e, t) {
    return Wn(e, t)
}
function bt(e, t, n) {
    let r = A()
        , o = Zn();
    if (Ft(r, o, t)) {
        let i = ue()
            , s = qs();
        Iw(s, r, e, t, r[B], n)
    }
    return bt
}
function Md(e, t, n, r, o) {
    sf(t, e, n, o ? "class" : "style", r)
}
function I(e, t, n, r) {
    let o = A()
        , i = o[D]
        , s = e + Q
        , a = i.firstCreatePass ? iy(s, o, 2, t, _w, Xp(), n, r) : i.data[s];
    if (Pv(a, o, e, t, Ef),
        js(a)) {
        let c = o[D];
        Av(c, o, a),
            iv(c, a, o)
    }
    return r != null && rf(o, a),
        I
}
function T() {
    let e = ue()
        , t = we()
        , n = Lv(t);
    return e.firstCreatePass && sy(e, n),
        Mu(n) && Nu(),
        Su(),
        n.classesWithoutHost != null && WC(n) && Md(e, n, A(), n.classesWithoutHost, !0),
        n.stylesWithoutHost != null && QC(n) && Md(e, n, A(), n.stylesWithoutHost, !1),
        T
}
function H(e, t, n, r) {
    return I(e, t, n, r),
        T(),
        H
}
function se(e, t, n, r) {
    let o = A()
        , i = o[D]
        , s = e + Q
        , a = i.firstCreatePass ? D_(s, i, 2, t, n, r) : i.data[s];
    return Pv(a, o, e, t, Ef),
        r != null && rf(o, a),
        se
}
function ae() {
    let e = we()
        , t = Lv(e);
    return Mu(t) && Nu(),
        Su(),
        ae
}
var Ef = (e, t, n, r, o) => (Jt(!0),
    zd(t[B], r, ju()));
function VT(e, t, n, r, o) {
    let i = !xa(t, n);
    if (Jt(i),
        i)
        return zd(t[B], r, ju());
    let s = t[ke]
        , a = Va(s, e, t, n);
    return tv(s, o) && Aa(s, o, a.nextSibling),
        s && (Im(n) || Dm(a)) && Yt(n) && (eg(n),
            uv(a)),
        a
}
function Ly() {
    Ef = VT
}
var UT = (e, t, n, r, o) => (Jt(!0),
    cv(t[B], ""));
function HT(e, t, n, r, o) {
    let i, s = !xa(t, n);
    if (Jt(s),
        s)
        return cv(t[B], "");
    let a = t[ke]
        , c = Va(a, e, t, n)
        , l = Cb(a, o);
    return Aa(a, o, c),
        i = Ua(l, c),
        i
}
function Fy() {
    UT = HT
}
function ar() {
    return A()
}
function Wa(e, t, n) {
    let r = A()
        , o = Zn();
    if (Ft(r, o, t)) {
        let i = ue()
            , s = qs();
        kv(s, r, e, t, r[B], n)
    }
    return Wa
}
var hi = "en-US";
var BT = hi;
function jy(e) {
    typeof e == "string" && (BT = e.toLowerCase().replace(/_/g, "-"))
}
function Y(e, t, n) {
    let r = A()
        , o = ue()
        , i = we();
    return $T(o, r, r[B], i, e, t, n),
        Y
}
function Qa(e, t, n) {
    let r = A()
        , o = ue()
        , i = we();
    return (i.type & 3 || n) && cy(i, o, r, n, r[B], e, t, oa(i, r, t)),
        Qa
}
function $T(e, t, n, r, o, i, s) {
    let a = !0
        , c = null;
    if ((r.type & 3 || s) && (c ??= oa(r, t, i),
        cy(r, e, t, s, n, o, i, c) && (a = !1)),
        a) {
        let l = r.outputs?.[o]
            , u = r.hostDirectiveOutputs?.[o];
        if (u && u.length)
            for (let d = 0; d < u.length; d += 2) {
                let h = u[d]
                    , f = u[d + 1];
                c ??= oa(r, t, i),
                    Ug(r, t, h, f, o, c)
            }
        if (l && l.length)
            for (let d of l)
                c ??= oa(r, t, i),
                    Ug(r, t, d, o, o, c)
    }
}
function he(e = 1) {
    return ug(e)
}
function zT(e, t) {
    let n = null
        , r = Bb(e);
    for (let o = 0; o < t.length; o++) {
        let i = t[o];
        if (i === "*") {
            n = o;
            continue
        }
        if (r === null ? yv(e, i, !0) : Gb(r, i))
            return o
    }
    return n
}
function If(e) {
    let t = A()[be][Oe];
    if (!t.projection) {
        let n = e ? e.length : 1
            , r = t.projection = Lp(n, null)
            , o = r.slice()
            , i = t.child;
        for (; i !== null;) {
            if (i.type !== 128) {
                let s = e ? zT(i, e) : 0;
                s !== null && (o[s] ? o[s].projectionNext = i : r[s] = i,
                    o[s] = i)
            }
            i = i.next
        }
    }
}
function Df(e, t = 0, n, r, o, i) {
    let s = A()
        , a = ue()
        , c = r ? e + 1 : null;
    c !== null && ei(s, a, c, r, o, i, null, n);
    let l = li(a, Q + e, 16, null, n || null);
    l.projection === null && (l.projection = t),
        xu();
    let d = !s[ke] || Hs();
    s[be][Oe].projection[l.projection] === null && c !== null ? GT(s, a, c) : d && !si(l) && hw(a, s, l)
}
function GT(e, t, n) {
    let r = Q + n
        , o = t.data[r]
        , i = e[r]
        , s = Jo(i, o.tView.ssrId)
        , a = Zr(e, o, void 0, {
            dehydratedView: s
        });
    Yr(i, a, 0, er(o, s))
}
function Za(e, t, n, r) {
    return G_(e, t, n, r),
        Za
}
function Cf(e) {
    let t = A()
        , n = ue()
        , r = $s();
    Uo(r + 1);
    let o = hf(n, r);
    if (e.dirty && qp(t) === ((o.metadata.flags & 2) === 2)) {
        if (o.matches === null)
            e.reset([]);
        else {
            let i = Ey(t, r);
            e.reset(i, ym),
                e.notifyOnChanges()
        }
        return !0
    }
    return !1
}
function bf() {
    return ff(A(), $s())
}
function Ya(e, t, n, r) {
    return Q_(e, z_(t, n, r)),
        Ya
}
function wf(e = 1) {
    Uo($s() + e)
}
function Js(e, t) {
    return e << 17 | t << 2
}
function nr(e) {
    return e >> 17 & 32767
}
function qT(e) {
    return (e & 2) == 2
}
function WT(e, t) {
    return e & 131071 | t << 17
}
function Nd(e) {
    return e | 2
}
function Gr(e) {
    return (e & 131068) >> 2
}
function ed(e, t) {
    return e & -131069 | t << 2
}
function QT(e) {
    return (e & 1) === 1
}
function Rd(e) {
    return e | 1
}
function ZT(e, t, n, r, o, i) {
    let s = i ? t.classBindings : t.styleBindings
        , a = nr(s)
        , c = Gr(s);
    e[r] = n;
    let l = !1, u;
    if (Array.isArray(n)) {
        let d = n;
        u = d[1],
            (u === null || Or(d, u) > 0) && (l = !0)
    } else
        u = n;
    if (o)
        if (c !== 0) {
            let h = nr(e[a + 1]);
            e[r + 1] = Js(h, a),
                h !== 0 && (e[h + 1] = ed(e[h + 1], r)),
                e[a + 1] = WT(e[a + 1], r)
        } else
            e[r + 1] = Js(a, 0),
                a !== 0 && (e[a + 1] = ed(e[a + 1], r)),
                a = r;
    else
        e[r + 1] = Js(c, 0),
            a === 0 ? a = r : e[c + 1] = ed(e[c + 1], r),
            c = r;
    l && (e[r + 1] = Nd(e[r + 1])),
        Xg(e, u, r, !0),
        Xg(e, u, r, !1),
        YT(t, u, e, r, i),
        s = Js(a, c),
        i ? t.classBindings = s : t.styleBindings = s
}
function YT(e, t, n, r, o) {
    let i = o ? e.residualClasses : e.residualStyles;
    i != null && typeof t == "string" && Or(i, t) >= 0 && (n[r + 1] = Rd(n[r + 1]))
}
function Xg(e, t, n, r) {
    let o = e[n + 1]
        , i = t === null
        , s = r ? nr(o) : Gr(o)
        , a = !1;
    for (; s !== 0 && (a === !1 || i);) {
        let c = e[s]
            , l = e[s + 1];
        KT(c, t) && (a = !0,
            e[s + 1] = r ? Rd(l) : Nd(l)),
            s = r ? nr(l) : Gr(l)
    }
    a && (e[n + 1] = r ? Nd(o) : Rd(o))
}
function KT(e, t) {
    return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t ? !0 : Array.isArray(e) && typeof t == "string" ? Or(e, t) >= 0 : !1
}
var Et = {
    textEnd: 0,
    key: 0,
    keyEnd: 0,
    value: 0,
    valueEnd: 0
};
function JT(e) {
    return e.substring(Et.key, Et.keyEnd)
}
function XT(e) {
    return eS(e),
        Vy(e, Uy(e, 0, Et.textEnd))
}
function Vy(e, t) {
    let n = Et.textEnd;
    return n === t ? -1 : (t = Et.keyEnd = tS(e, Et.key = t, n),
        Uy(e, t, n))
}
function eS(e) {
    Et.key = 0,
        Et.keyEnd = 0,
        Et.value = 0,
        Et.valueEnd = 0,
        Et.textEnd = e.length
}
function Uy(e, t, n) {
    for (; t < n && e.charCodeAt(t) <= 32;)
        t++;
    return t
}
function tS(e, t, n) {
    for (; t < n && e.charCodeAt(t) > 32;)
        t++;
    return t
}
function cr(e, t) {
    return rS(e, t, null, !0),
        cr
}
function pi(e) {
    oS(uS, nS, e, !0)
}
function nS(e, t) {
    for (let n = XT(t); n >= 0; n = Vy(t, n))
        ks(e, JT(t), !0)
}
function rS(e, t, n, r) {
    let o = A()
        , i = ue()
        , s = Pu(2);
    if (i.firstUpdatePass && By(i, e, s, r),
        t !== Je && Ft(o, s, t)) {
        let a = i.data[Kt()];
        $y(i, a, o, o[B], e, o[s + 1] = fS(t, n), r, s)
    }
}
function oS(e, t, n, r) {
    let o = ue()
        , i = Pu(2);
    o.firstUpdatePass && By(o, null, i, r);
    let s = A();
    if (n !== Je && Ft(s, i, n)) {
        let a = o.data[Kt()];
        if (zy(a, r) && !Hy(o, i)) {
            let c = r ? a.classesWithoutHost : a.stylesWithoutHost;
            c !== null && (n = Ss(c, n || "")),
                Md(o, a, s, n, r)
        } else
            dS(o, a, s, s[B], s[i + 1], s[i + 1] = lS(e, t, n), r, i)
    }
}
function Hy(e, t) {
    return t >= e.expandoStartIndex
}
function By(e, t, n, r) {
    let o = e.data;
    if (o[n + 1] === null) {
        let i = o[Kt()]
            , s = Hy(e, n);
        zy(i, r) && t === null && !s && (t = !1),
            t = iS(o, i, t, r),
            ZT(o, i, t, n, s, r)
    }
}
function iS(e, t, n, r) {
    let o = sg(e)
        , i = r ? t.residualClasses : t.residualStyles;
    if (o === null)
        (r ? t.classBindings : t.styleBindings) === 0 && (n = td(null, e, t, n, r),
            n = ti(n, t.attrs, r),
            i = null);
    else {
        let s = t.directiveStylingLast;
        if (s === -1 || e[s] !== o)
            if (n = td(o, e, t, n, r),
                i === null) {
                let c = sS(e, t, r);
                c !== void 0 && Array.isArray(c) && (c = td(null, e, t, c[1], r),
                    c = ti(c, t.attrs, r),
                    aS(e, t, r, c))
            } else
                i = cS(e, t, r)
    }
    return i !== void 0 && (r ? t.residualClasses = i : t.residualStyles = i),
        n
}
function sS(e, t, n) {
    let r = n ? t.classBindings : t.styleBindings;
    if (Gr(r) !== 0)
        return e[nr(r)]
}
function aS(e, t, n, r) {
    let o = n ? t.classBindings : t.styleBindings;
    e[nr(o)] = r
}
function cS(e, t, n) {
    let r, o = t.directiveEnd;
    for (let i = 1 + t.directiveStylingLast; i < o; i++) {
        let s = e[i].hostAttrs;
        r = ti(r, s, n)
    }
    return ti(r, t.attrs, n)
}
function td(e, t, n, r, o) {
    let i = null
        , s = n.directiveEnd
        , a = n.directiveStylingLast;
    for (a === -1 ? a = n.directiveStart : a++; a < s && (i = t[a],
        r = ti(r, i.hostAttrs, o),
        i !== e);)
        a++;
    return e !== null && (n.directiveStylingLast = a),
        r
}
function ti(e, t, n) {
    let r = n ? 1 : 2
        , o = -1;
    if (t !== null)
        for (let i = 0; i < t.length; i++) {
            let s = t[i];
            typeof s == "number" ? o = s : o === r && (Array.isArray(e) || (e = e === void 0 ? [] : ["", e]),
                ks(e, s, n ? !0 : t[++i]))
        }
    return e === void 0 ? null : e
}
function lS(e, t, n) {
    if (n == null || n === "")
        return Me;
    let r = []
        , o = Qr(n);
    if (Array.isArray(o))
        for (let i = 0; i < o.length; i++)
            e(r, o[i], !0);
    else if (o instanceof Set)
        for (let i of o)
            e(r, i, !0);
    else if (typeof o == "object")
        for (let i in o)
            o.hasOwnProperty(i) && e(r, i, o[i]);
    else
        typeof o == "string" && t(r, o);
    return r
}
function uS(e, t, n) {
    let r = String(t);
    r !== "" && !r.includes(" ") && ks(e, r, n)
}
function dS(e, t, n, r, o, i, s, a) {
    o === Je && (o = Me);
    let c = 0
        , l = 0
        , u = 0 < o.length ? o[0] : null
        , d = 0 < i.length ? i[0] : null;
    for (; u !== null || d !== null;) {
        let h = c < o.length ? o[c + 1] : void 0, f = l < i.length ? i[l + 1] : void 0, g = null, E;
        u === d ? (c += 2,
            l += 2,
            h !== f && (g = d,
                E = f)) : d === null || u !== null && u < d ? (c += 2,
                    g = u) : (l += 2,
                        g = d,
                        E = f),
            g !== null && $y(e, t, n, r, g, E, s, a),
            u = c < o.length ? o[c] : null,
            d = l < i.length ? i[l] : null
    }
}
function $y(e, t, n, r, o, i, s, a) {
    if (!(t.type & 3))
        return;
    let c = e.data
        , l = c[a + 1]
        , u = QT(l) ? em(c, t, n, o, Gr(l), s) : void 0;
    if (!wa(u)) {
        wa(i) || qT(l) && (i = em(c, null, n, o, a, s));
        let d = Du(Kt(), n);
        gw(r, s, d, o, i)
    }
}
function em(e, t, n, r, o, i) {
    let s = t === null, a;
    for (; o > 0;) {
        let c = e[o]
            , l = Array.isArray(c)
            , u = l ? c[1] : c
            , d = u === null
            , h = n[o + 1];
        h === Je && (h = d ? Me : void 0);
        let f = d ? Ps(h, r) : u === r ? h : void 0;
        if (l && !wa(f) && (f = Ps(c, r)),
            wa(f) && (a = f,
                s))
            return a;
        let g = e[o + 1];
        o = s ? nr(g) : Gr(g)
    }
    if (t !== null) {
        let c = i ? t.residualClasses : t.residualStyles;
        c != null && (a = Ps(c, r))
    }
    return a
}
function wa(e) {
    return e !== void 0
}
function fS(e, t) {
    return e == null || e === "" || (typeof t == "string" ? e = e + t : typeof e == "object" && (e = qt(Qr(e)))),
        e
}
function zy(e, t) {
    return (e.flags & (t ? 8 : 16)) !== 0
}
function _(e, t = "") {
    let n = A()
        , r = ue()
        , o = e + Q
        , i = r.firstCreatePass ? li(r, o, 1, t, null) : r.data[o]
        , s = Gy(r, n, i, t);
    n[o] = s,
        Ws() && tf(r, n, s, i),
        Lr(i, !1)
}
var Gy = (e, t, n, r) => (Jt(!0),
    av(t[B], r));
function hS(e, t, n, r) {
    let o = !xa(t, n);
    if (Jt(o),
        o)
        return av(t[B], r);
    let i = t[ke];
    return Va(i, e, t, n)
}
function qy() {
    Gy = hS
}
function pS(e, t, n, r = "") {
    return Ft(e, Zn(), n) ? t + As(n) + r : Je
}
function tn(e) {
    return In("", e),
        tn
}
function In(e, t, n) {
    let r = A()
        , o = pS(r, e, t, n);
    return o !== Je && gS(r, Kt(), o),
        In
}
function gS(e, t, n) {
    let r = Du(t, e);
    Ab(e[B], r, n)
}
function tm(e, t, n) {
    let r = ue();
    r.firstCreatePass && Wy(t, r.data, r.blueprint, Ot(e), n)
}
function Wy(e, t, n, r, o) {
    if (e = De(e),
        Array.isArray(e))
        for (let i = 0; i < e.length; i++)
            Wy(e[i], t, n, r, o);
    else {
        let i = ue()
            , s = A()
            , a = we()
            , c = jn(e) ? e : De(e.provide)
            , l = mu(e)
            , u = a.providerIndexes & 1048575
            , d = a.directiveStart
            , h = a.providerIndexes >> 20;
        if (jn(e) || !e.multi) {
            let f = new Jn(l, o, F, null)
                , g = rd(c, t, o ? u : u + h, d);
            g === -1 ? (id(la(a, s), i, c),
                nd(i, e, t.length),
                t.push(c),
                a.directiveStart++,
                a.directiveEnd++,
                o && (a.providerIndexes += 1048576),
                n.push(f),
                s.push(f)) : (n[g] = f,
                    s[g] = f)
        } else {
            let f = rd(c, t, u + h, d)
                , g = rd(c, t, u, u + h)
                , E = f >= 0 && n[f]
                , M = g >= 0 && n[g];
            if (o && !M || !o && !E) {
                id(la(a, s), i, c);
                let x = yS(o ? vS : mS, n.length, o, r, l, e);
                !o && M && (n[g].providerFactory = x),
                    nd(i, e, t.length, 0),
                    t.push(c),
                    a.directiveStart++,
                    a.directiveEnd++,
                    o && (a.providerIndexes += 1048576),
                    n.push(x),
                    s.push(x)
            } else {
                let x = Qy(n[o ? g : f], l, !o && r);
                nd(i, e, f > -1 ? f : g, x)
            }
            !o && r && M && n[g].componentProviders++
        }
    }
}
function nd(e, t, n, r) {
    let o = jn(t)
        , i = Bp(t);
    if (o || i) {
        let c = (i ? De(t.useClass) : t).prototype.ngOnDestroy;
        if (c) {
            let l = e.destroyHooks || (e.destroyHooks = []);
            if (!o && t.multi) {
                let u = l.indexOf(n);
                u === -1 ? l.push(n, [r, c]) : l[u + 1].push(r, c)
            } else
                l.push(n, c)
        }
    }
}
function Qy(e, t, n) {
    return n && e.componentProviders++,
        e.multi.push(t) - 1
}
function rd(e, t, n, r) {
    for (let o = n; o < r; o++)
        if (t[o] === e)
            return o;
    return -1
}
function mS(e, t, n, r, o) {
    return Ad(this.multi, [])
}
function vS(e, t, n, r, o) {
    let i = this.multi, s;
    if (this.providerFactory) {
        let a = this.providerFactory.componentProviders
            , c = Wo(r, r[D], this.providerFactory.index, o);
        s = c.slice(0, a),
            Ad(i, s);
        for (let l = a; l < c.length; l++)
            s.push(c[l])
    } else
        s = [],
            Ad(i, s);
    return s
}
function Ad(e, t) {
    for (let n = 0; n < e.length; n++) {
        let r = e[n];
        t.push(r())
    }
    return t
}
function yS(e, t, n, r, o, i) {
    let s = new Jn(e, n, F, null);
    return s.multi = [],
        s.index = t,
        s.componentProviders = 0,
        Qy(s, o, r && !n),
        s
}
function Dn(e, t) {
    return n => {
        n.providersResolver = (r, o) => tm(r, o ? o(e) : e, !1),
            t && (n.viewProvidersResolver = (r, o) => tm(r, o ? o(t) : t, !0))
    }
}
function Ka(e, t) {
    let n = ku() + e
        , r = A();
    return r[n] === Je ? ay(r, n, t()) : C_(r, n)
}
function _f(e, t, n, r) {
    return IS(A(), ku(), e, t, n, r)
}
function ES(e, t) {
    let n = e[t];
    return n === Je ? void 0 : n
}
function IS(e, t, n, r, o, i, s) {
    let a = t + n;
    return b_(e, a, o, i) ? ay(e, a + 2, s ? r.call(s, o, i) : r(o, i)) : ES(e, a + 2)
}
var _a = class {
    ngModuleFactory;
    componentFactories;
    constructor(t, n) {
        this.ngModuleFactory = t,
            this.componentFactories = n
    }
}
    , Tf = (() => {
        class e {
            compileModuleSync(n) {
                return new Da(n)
            }
            compileModuleAsync(n) {
                return Promise.resolve(this.compileModuleSync(n))
            }
            compileModuleAndAllComponentsSync(n) {
                let r = this.compileModuleSync(n)
                    , o = cu(n)
                    , i = mv(o.declarations).reduce((s, a) => {
                        let c = Qt(a);
                        return c && s.push(new $r(c)),
                            s
                    }
                        , []);
                return new _a(r, i)
            }
            compileModuleAndAllComponentsAsync(n) {
                return Promise.resolve(this.compileModuleAndAllComponentsSync(n))
            }
            clearCache() { }
            clearCacheFor(n) { }
            getModuleId(n) { }
            static \u0275fac = function (r) {
                return new (r || e)
            }
                ;
            static \u0275prov = w({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    }
    )();
var Zy = (() => {
    class e {
        applicationErrorHandler = p(ct);
        appRef = p(Ue);
        taskService = p(Pt);
        ngZone = p(Ae);
        zonelessEnabled = p(Bo);
        tracing = p(yn, {
            optional: !0
        });
        zoneIsDefined = typeof Zone < "u" && !!Zone.root.run;
        schedulerTickApplyArgs = [{
            data: {
                __scheduler_tick__: !0
            }
        }];
        subscriptions = new ye;
        angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(xo) : null;
        scheduleInRootZone = !this.zonelessEnabled && this.zoneIsDefined && (p(zu, {
            optional: !0
        }) ?? !1);
        cancelScheduledCallback = null;
        useMicrotaskScheduler = !1;
        runningTick = !1;
        pendingRenderTaskId = null;
        constructor() {
            this.subscriptions.add(this.appRef.afterTick.subscribe(() => {
                let n = this.taskService.add();
                if (!this.runningTick && (this.cleanup(),
                    !this.zonelessEnabled || this.appRef.includeAllTestViews)) {
                    this.taskService.remove(n);
                    return
                }
                this.switchToMicrotaskScheduler(),
                    this.taskService.remove(n)
            }
            )),
                this.subscriptions.add(this.ngZone.onUnstable.subscribe(() => {
                    this.runningTick || this.cleanup()
                }
                ))
        }
        switchToMicrotaskScheduler() {
            this.ngZone.runOutsideAngular(() => {
                let n = this.taskService.add();
                this.useMicrotaskScheduler = !0,
                    queueMicrotask(() => {
                        this.useMicrotaskScheduler = !1,
                            this.taskService.remove(n)
                    }
                    )
            }
            )
        }
        notify(n) {
            if (!this.zonelessEnabled && n === 5)
                return;
            switch (n) {
                case 0:
                    {
                        this.appRef.dirtyFlags |= 2;
                        break
                    }
                case 3:
                case 2:
                case 4:
                case 5:
                case 1:
                    {
                        this.appRef.dirtyFlags |= 4;
                        break
                    }
                case 6:
                    {
                        this.appRef.dirtyFlags |= 2;
                        break
                    }
                case 12:
                    {
                        this.appRef.dirtyFlags |= 16;
                        break
                    }
                case 13:
                    {
                        this.appRef.dirtyFlags |= 2;
                        break
                    }
                case 11:
                    break;
                default:
                    this.appRef.dirtyFlags |= 8
            }
            if (this.appRef.tracingSnapshot = this.tracing?.snapshot(this.appRef.tracingSnapshot) ?? null,
                !this.shouldScheduleTick())
                return;
            let r = this.useMicrotaskScheduler ? pg : Uu;
            this.pendingRenderTaskId = this.taskService.add(),
                this.scheduleInRootZone ? this.cancelScheduledCallback = Zone.root.run(() => r(() => this.tick())) : this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() => r(() => this.tick()))
        }
        shouldScheduleTick() {
            return !(this.appRef.destroyed || this.pendingRenderTaskId !== null || this.runningTick || this.appRef._runningTick || !this.zonelessEnabled && this.zoneIsDefined && Zone.current.get(xo + this.angularZoneId))
        }
        tick() {
            if (this.runningTick || this.appRef.destroyed)
                return;
            if (this.appRef.dirtyFlags === 0) {
                this.cleanup();
                return
            }
            !this.zonelessEnabled && this.appRef.dirtyFlags & 7 && (this.appRef.dirtyFlags |= 1);
            let n = this.taskService.add();
            try {
                this.ngZone.run(() => {
                    this.runningTick = !0,
                        this.appRef._tick()
                }
                    , void 0, this.schedulerTickApplyArgs)
            } catch (r) {
                this.applicationErrorHandler(r)
            } finally {
                this.taskService.remove(n),
                    this.cleanup()
            }
        }
        ngOnDestroy() {
            this.subscriptions.unsubscribe(),
                this.cleanup()
        }
        cleanup() {
            if (this.runningTick = !1,
                this.cancelScheduledCallback?.(),
                this.cancelScheduledCallback = null,
                this.pendingRenderTaskId !== null) {
                let n = this.pendingRenderTaskId;
                this.pendingRenderTaskId = null,
                    this.taskService.remove(n)
            }
        }
        static \u0275fac = function (r) {
            return new (r || e)
        }
            ;
        static \u0275prov = w({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
}
)();
function Yy() {
    return [{
        provide: Wt,
        useExisting: Zy
    }, {
        provide: Ae,
        useClass: Oo
    }, {
        provide: Bo,
        useValue: !0
    }]
}
function DS() {
    return typeof $localize < "u" && $localize.locale || hi
}
var Sf = new v("", {
    factory: () => p(Sf, {
        optional: !0,
        skipSelf: !0
    }) || DS()
});
var Ja = class {
    destroyed = !1;
    listeners = null;
    errorHandler = p(rt, {
        optional: !0
    });
    destroyRef = p(Ve);
    constructor() {
        this.destroyRef.onDestroy(() => {
            this.destroyed = !0,
                this.listeners = null
        }
        )
    }
    subscribe(t) {
        if (this.destroyed)
            throw new y(953, !1);
        return (this.listeners ??= []).push(t),
        {
            unsubscribe: () => {
                let n = this.listeners?.indexOf(t);
                n !== void 0 && n !== -1 && this.listeners?.splice(n, 1)
            }
        }
    }
    emit(t) {
        if (this.destroyed) {
            console.warn(St(953, !1));
            return
        }
        if (this.listeners === null)
            return;
        let n = C(null);
        try {
            for (let r of this.listeners)
                try {
                    r(t)
                } catch (o) {
                    this.errorHandler?.handleError(o)
                }
        } finally {
            C(n)
        }
    }
}
    ;
function pe(e, t) {
    return Co(e, t?.equal)
}
var xf = {
    JSACTION: "__jsaction",
    OWNER: "__owner"
}
    , eE = {};
function CS(e) {
    return e[xf.JSACTION]
}
function Ky(e, t) {
    e[xf.JSACTION] = t
}
function bS(e) {
    return eE[e]
}
function wS(e, t) {
    eE[e] = t
}
var b = {
    AUXCLICK: "auxclick",
    CHANGE: "change",
    CLICK: "click",
    CLICKMOD: "clickmod",
    CLICKONLY: "clickonly",
    DBLCLICK: "dblclick",
    FOCUS: "focus",
    FOCUSIN: "focusin",
    BLUR: "blur",
    FOCUSOUT: "focusout",
    SUBMIT: "submit",
    KEYDOWN: "keydown",
    KEYPRESS: "keypress",
    KEYUP: "keyup",
    MOUSEUP: "mouseup",
    MOUSEDOWN: "mousedown",
    MOUSEOVER: "mouseover",
    MOUSEOUT: "mouseout",
    MOUSEENTER: "mouseenter",
    MOUSELEAVE: "mouseleave",
    MOUSEMOVE: "mousemove",
    POINTERUP: "pointerup",
    POINTERDOWN: "pointerdown",
    POINTEROVER: "pointerover",
    POINTEROUT: "pointerout",
    POINTERENTER: "pointerenter",
    POINTERLEAVE: "pointerleave",
    POINTERMOVE: "pointermove",
    POINTERCANCEL: "pointercancel",
    GOTPOINTERCAPTURE: "gotpointercapture",
    LOSTPOINTERCAPTURE: "lostpointercapture",
    ERROR: "error",
    LOAD: "load",
    UNLOAD: "unload",
    TOUCHSTART: "touchstart",
    TOUCHEND: "touchend",
    TOUCHMOVE: "touchmove",
    INPUT: "input",
    SCROLL: "scroll",
    TOGGLE: "toggle",
    CUSTOM: "_custom"
}
    , _S = [b.MOUSEENTER, b.MOUSELEAVE, "pointerenter", "pointerleave"]
    , g1 = [b.CLICK, b.DBLCLICK, b.FOCUSIN, b.FOCUSOUT, b.KEYDOWN, b.KEYUP, b.KEYPRESS, b.MOUSEOVER, b.MOUSEOUT, b.SUBMIT, b.TOUCHSTART, b.TOUCHEND, b.TOUCHMOVE, "touchcancel", "auxclick", "change", "compositionstart", "compositionupdate", "compositionend", "beforeinput", "input", "select", "copy", "cut", "paste", "mousedown", "mouseup", "wheel", "contextmenu", "dragover", "dragenter", "dragleave", "drop", "dragstart", "dragend", "pointerdown", "pointermove", "pointerup", "pointercancel", "pointerover", "pointerout", "gotpointercapture", "lostpointercapture", "ended", "loadedmetadata", "pagehide", "pageshow", "visibilitychange", "beforematch"]
    , TS = [b.FOCUS, b.BLUR, b.ERROR, b.LOAD, b.TOGGLE]
    , Of = e => TS.indexOf(e) >= 0;
function SS(e) {
    return e === b.MOUSEENTER ? b.MOUSEOVER : e === b.MOUSELEAVE ? b.MOUSEOUT : e === b.POINTERENTER ? b.POINTEROVER : e === b.POINTERLEAVE ? b.POINTEROUT : e
}
function MS(e, t, n, r) {
    let o = !1;
    Of(t) && (o = !0);
    let i = typeof r == "boolean" ? {
        capture: o,
        passive: r
    } : o;
    return e.addEventListener(t, n, i),
    {
        eventType: t,
        handler: n,
        capture: o,
        passive: r
    }
}
function NS(e, t) {
    if (e.removeEventListener) {
        let n = typeof t.passive == "boolean" ? {
            capture: t.capture
        } : t.capture;
        e.removeEventListener(t.eventType, t.handler, n)
    } else
        e.detachEvent && e.detachEvent(`on${t.eventType}`, t.handler)
}
function RS(e) {
    e.preventDefault ? e.preventDefault() : e.returnValue = !1
}
var Jy = typeof navigator < "u" && /Macintosh/.test(navigator.userAgent);
function AS(e) {
    return e.which === 2 || e.which == null && e.button === 4
}
function xS(e) {
    return Jy && e.metaKey || !Jy && e.ctrlKey || AS(e) || e.shiftKey
}
function OS(e, t, n) {
    let r = e.relatedTarget;
    return (e.type === b.MOUSEOVER && t === b.MOUSEENTER || e.type === b.MOUSEOUT && t === b.MOUSELEAVE || e.type === b.POINTEROVER && t === b.POINTERENTER || e.type === b.POINTEROUT && t === b.POINTERLEAVE) && (!r || r !== n && !n.contains(r))
}
function kS(e, t) {
    let n = {};
    for (let r in e) {
        if (r === "srcElement" || r === "target")
            continue;
        let o = r
            , i = e[o];
        typeof i != "function" && (n[o] = i)
    }
    return e.type === b.MOUSEOVER ? n.type = b.MOUSEENTER : e.type === b.MOUSEOUT ? n.type = b.MOUSELEAVE : e.type === b.POINTEROVER ? n.type = b.POINTERENTER : n.type = b.POINTERLEAVE,
        n.target = n.srcElement = t,
        n.bubbles = !1,
        n._originalEvent = e,
        n
}
var PS = typeof navigator < "u" && /iPhone|iPad|iPod/.test(navigator.userAgent)
    , nc = class {
        element;
        handlerInfos = [];
        constructor(t) {
            this.element = t
        }
        addEventListener(t, n, r) {
            PS && (this.element.style.cursor = "pointer"),
                this.handlerInfos.push(MS(this.element, t, n(this.element), r))
        }
        cleanUp() {
            for (let t = 0; t < this.handlerInfos.length; t++)
                NS(this.element, this.handlerInfos[t]);
            this.handlerInfos = []
        }
    }
    , LS = {
        NAMESPACE_ACTION_SEPARATOR: ".",
        EVENT_ACTION_SEPARATOR: ":"
    };
function Cn(e) {
    return e.eventType
}
function kf(e, t) {
    e.eventType = t
}
function ec(e) {
    return e.event
}
function tE(e, t) {
    e.event = t
}
function nE(e) {
    return e.targetElement
}
function rE(e, t) {
    e.targetElement = t
}
function oE(e) {
    return e.eic
}
function FS(e, t) {
    e.eic = t
}
function jS(e) {
    return e.timeStamp
}
function VS(e, t) {
    e.timeStamp = t
}
function tc(e) {
    return e.eia
}
function iE(e, t, n) {
    e.eia = [t, n]
}
function Mf(e) {
    e.eia = void 0
}
function Xa(e) {
    return e[1]
}
function US(e) {
    return e.eirp
}
function sE(e, t) {
    e.eirp = t
}
function aE(e) {
    return e.eir
}
function cE(e, t) {
    e.eir = t
}
function lE(e) {
    return {
        eventType: e.eventType,
        event: e.event,
        targetElement: e.targetElement,
        eic: e.eic,
        eia: e.eia,
        timeStamp: e.timeStamp,
        eirp: e.eirp,
        eiack: e.eiack,
        eir: e.eir
    }
}
function HS(e, t, n, r, o, i, s, a) {
    return {
        eventType: e,
        event: t,
        targetElement: n,
        eic: r,
        timeStamp: o,
        eia: i,
        eirp: s,
        eiack: a
    }
}
var Nf = class e {
    eventInfo;
    constructor(t) {
        this.eventInfo = t
    }
    getEventType() {
        return Cn(this.eventInfo)
    }
    setEventType(t) {
        kf(this.eventInfo, t)
    }
    getEvent() {
        return ec(this.eventInfo)
    }
    setEvent(t) {
        tE(this.eventInfo, t)
    }
    getTargetElement() {
        return nE(this.eventInfo)
    }
    setTargetElement(t) {
        rE(this.eventInfo, t)
    }
    getContainer() {
        return oE(this.eventInfo)
    }
    setContainer(t) {
        FS(this.eventInfo, t)
    }
    getTimestamp() {
        return jS(this.eventInfo)
    }
    setTimestamp(t) {
        VS(this.eventInfo, t)
    }
    getAction() {
        let t = tc(this.eventInfo);
        if (t)
            return {
                name: t[0],
                element: t[1]
            }
    }
    setAction(t) {
        if (!t) {
            Mf(this.eventInfo);
            return
        }
        iE(this.eventInfo, t.name, t.element)
    }
    getIsReplay() {
        return US(this.eventInfo)
    }
    setIsReplay(t) {
        sE(this.eventInfo, t)
    }
    getResolved() {
        return aE(this.eventInfo)
    }
    setResolved(t) {
        cE(this.eventInfo, t)
    }
    clone() {
        return new e(lE(this.eventInfo))
    }
}
    , BS = {}
    , $S = /\s*;\s*/
    , zS = b.CLICK
    , Rf = class {
        a11yClickSupport = !1;
        clickModSupport = !0;
        syntheticMouseEventSupport;
        updateEventInfoForA11yClick = void 0;
        preventDefaultForA11yClick = void 0;
        populateClickOnlyAction = void 0;
        constructor({ syntheticMouseEventSupport: t = !1, clickModSupport: n = !0 } = {}) {
            this.syntheticMouseEventSupport = t,
                this.clickModSupport = n
        }
        resolveEventType(t) {
            this.clickModSupport && Cn(t) === b.CLICK && xS(ec(t)) ? kf(t, b.CLICKMOD) : this.a11yClickSupport && this.updateEventInfoForA11yClick(t)
        }
        resolveAction(t) {
            aE(t) || (this.populateAction(t, nE(t)),
                cE(t, !0))
        }
        resolveParentAction(t) {
            let n = tc(t)
                , r = n && Xa(n);
            Mf(t);
            let o = r && this.getParentNode(r);
            o && this.populateAction(t, o)
        }
        populateAction(t, n) {
            let r = n;
            for (; r && r !== oE(t) && (r.nodeType === Node.ELEMENT_NODE && this.populateActionOnElement(r, t),
                !tc(t));)
                r = this.getParentNode(r);
            let o = tc(t);
            if (o && (this.a11yClickSupport && this.preventDefaultForA11yClick(t),
                this.syntheticMouseEventSupport && (Cn(t) === b.MOUSEENTER || Cn(t) === b.MOUSELEAVE || Cn(t) === b.POINTERENTER || Cn(t) === b.POINTERLEAVE)))
                if (OS(ec(t), Cn(t), Xa(o))) {
                    let i = kS(ec(t), Xa(o));
                    tE(t, i),
                        rE(t, Xa(o))
                } else
                    Mf(t)
        }
        getParentNode(t) {
            let n = t[xf.OWNER];
            if (n)
                return n;
            let r = t.parentNode;
            return r?.nodeName === "#document-fragment" ? r?.host ?? null : r
        }
        populateActionOnElement(t, n) {
            let r = this.parseActions(t)
                , o = r[Cn(n)];
            o !== void 0 && iE(n, o, t),
                this.a11yClickSupport && this.populateClickOnlyAction(t, n, r)
        }
        parseActions(t) {
            let n = CS(t);
            if (!n) {
                let r = t.getAttribute(Ys.JSACTION);
                if (!r)
                    n = BS,
                        Ky(t, n);
                else {
                    if (n = bS(r),
                        !n) {
                        n = {};
                        let o = r.split($S);
                        for (let i = 0; i < o.length; i++) {
                            let s = o[i];
                            if (!s)
                                continue;
                            let a = s.indexOf(LS.EVENT_ACTION_SEPARATOR)
                                , c = a !== -1
                                , l = c ? s.substr(0, a).trim() : zS
                                , u = c ? s.substr(a + 1).trim() : s;
                            n[l] = u
                        }
                        wS(r, n)
                    }
                    Ky(t, n)
                }
            }
            return n
        }
        addA11yClickSupport(t, n, r) {
            this.a11yClickSupport = !0,
                this.updateEventInfoForA11yClick = t,
                this.preventDefaultForA11yClick = n,
                this.populateClickOnlyAction = r
        }
    }
    , uE = (function (e) {
        return e[e.I_AM_THE_JSACTION_FRAMEWORK = 0] = "I_AM_THE_JSACTION_FRAMEWORK",
            e
    }
    )(uE || {})
    , Af = class {
        dispatchDelegate;
        actionResolver;
        eventReplayer;
        eventReplayScheduled = !1;
        replayEventInfoWrappers = [];
        constructor(t, { actionResolver: n, eventReplayer: r } = {}) {
            this.dispatchDelegate = t,
                this.actionResolver = n,
                this.eventReplayer = r
        }
        dispatch(t) {
            let n = new Nf(t);
            this.actionResolver?.resolveEventType(t),
                this.actionResolver?.resolveAction(t);
            let r = n.getAction();
            if (r && GS(r.element, n) && RS(n.getEvent()),
                this.eventReplayer && n.getIsReplay()) {
                this.scheduleEventInfoWrapperReplay(n);
                return
            }
            this.dispatchDelegate(n)
        }
        scheduleEventInfoWrapperReplay(t) {
            this.replayEventInfoWrappers.push(t),
                !this.eventReplayScheduled && (this.eventReplayScheduled = !0,
                    Promise.resolve().then(() => {
                        this.eventReplayScheduled = !1,
                            this.eventReplayer(this.replayEventInfoWrappers)
                    }
                    ))
        }
    }
    ;
function GS(e, t) {
    return e.tagName === "A" && (t.getEventType() === b.CLICK || t.getEventType() === b.CLICKMOD)
}
var dE = Symbol.for("propagationStopped")
    , Pf = {
        REPLAY: 101
    };
var qS = "`preventDefault` called during event replay.";
var WS = "`composedPath` called during event replay."
    , rc = class {
        dispatchDelegate;
        clickModSupport;
        actionResolver;
        dispatcher;
        constructor(t, n = !0) {
            this.dispatchDelegate = t,
                this.clickModSupport = n,
                this.actionResolver = new Rf({
                    clickModSupport: n
                }),
                this.dispatcher = new Af(r => {
                    this.dispatchToDelegate(r)
                }
                    , {
                        actionResolver: this.actionResolver
                    })
        }
        dispatch(t) {
            this.dispatcher.dispatch(t)
        }
        dispatchToDelegate(t) {
            for (t.getIsReplay() && YS(t),
                QS(t); t.getAction();) {
                if (KS(t),
                    Of(t.getEventType()) && t.getAction().element !== t.getTargetElement() || (this.dispatchDelegate(t.getEvent(), t.getAction().name),
                        ZS(t)))
                    return;
                this.actionResolver.resolveParentAction(t.eventInfo)
            }
        }
    }
    ;
function QS(e) {
    let t = e.getEvent()
        , n = e.getEvent().stopPropagation.bind(t)
        , r = () => {
            t[dE] = !0,
                n()
        }
        ;
    lr(t, "stopPropagation", r),
        lr(t, "stopImmediatePropagation", r)
}
function ZS(e) {
    return !!e.getEvent()[dE]
}
function YS(e) {
    let t = e.getEvent()
        , n = e.getTargetElement()
        , r = t.preventDefault.bind(t);
    lr(t, "target", n),
        lr(t, "eventPhase", Pf.REPLAY),
        lr(t, "preventDefault", () => {
            throw r(),
            new Error(qS + "")
        }
        ),
        lr(t, "composedPath", () => {
            throw new Error(WS + "")
        }
        )
}
function KS(e) {
    let t = e.getEvent()
        , n = e.getAction()?.element;
    n && lr(t, "currentTarget", n, {
        configurable: !0
    })
}
function lr(e, t, n, { configurable: r = !1 } = {}) {
    Object.defineProperty(e, t, {
        value: n,
        configurable: r
    })
}
function fE(e, t) {
    e.ecrd(n => {
        t.dispatch(n)
    }
        , uE.I_AM_THE_JSACTION_FRAMEWORK)
}
function JS(e) {
    return e?.q ?? []
}
function XS(e) {
    e && (Xy(e.c, e.et, e.h),
        Xy(e.c, e.etc, e.h, !0))
}
function Xy(e, t, n, r) {
    for (let o = 0; o < t.length; o++)
        e.removeEventListener(t[o], n, r)
}
var eM = !1
    , hE = (() => {
        class e {
            static MOUSE_SPECIAL_SUPPORT = eM;
            containerManager;
            eventHandlers = {};
            browserEventTypeToExtraEventTypes = {};
            dispatcher = null;
            queuedEventInfos = [];
            constructor(n) {
                this.containerManager = n
            }
            handleEvent(n, r, o) {
                let i = HS(n, r, r.target, o, Date.now());
                this.handleEventInfo(i)
            }
            handleEventInfo(n) {
                if (!this.dispatcher) {
                    sE(n, !0),
                        this.queuedEventInfos?.push(n);
                    return
                }
                this.dispatcher(n)
            }
            addEvent(n, r, o) {
                if (n in this.eventHandlers || !this.containerManager || !e.MOUSE_SPECIAL_SUPPORT && _S.indexOf(n) >= 0)
                    return;
                let i = (a, c, l) => {
                    this.handleEvent(a, c, l)
                }
                    ;
                this.eventHandlers[n] = i;
                let s = SS(r || n);
                if (s !== n) {
                    let a = this.browserEventTypeToExtraEventTypes[s] || [];
                    a.push(n),
                        this.browserEventTypeToExtraEventTypes[s] = a
                }
                this.containerManager.addEventListener(s, a => c => {
                    i(n, c, a)
                }
                    , o)
            }
            replayEarlyEvents(n = window._ejsa) {
                n && (this.replayEarlyEventInfos(n.q),
                    XS(n),
                    delete window._ejsa)
            }
            replayEarlyEventInfos(n) {
                for (let r = 0; r < n.length; r++) {
                    let o = n[r]
                        , i = this.getEventTypesForBrowserEventType(o.eventType);
                    for (let s = 0; s < i.length; s++) {
                        let a = lE(o);
                        kf(a, i[s]),
                            this.handleEventInfo(a)
                    }
                }
            }
            getEventTypesForBrowserEventType(n) {
                let r = [];
                return this.eventHandlers[n] && r.push(n),
                    this.browserEventTypeToExtraEventTypes[n] && r.push(...this.browserEventTypeToExtraEventTypes[n]),
                    r
            }
            handler(n) {
                return this.eventHandlers[n]
            }
            cleanUp() {
                this.containerManager?.cleanUp(),
                    this.containerManager = null,
                    this.eventHandlers = {},
                    this.browserEventTypeToExtraEventTypes = {},
                    this.dispatcher = null,
                    this.queuedEventInfos = []
            }
            registerDispatcher(n, r) {
                this.ecrd(n, r)
            }
            ecrd(n, r) {
                if (this.dispatcher = n,
                    this.queuedEventInfos?.length) {
                    for (let o = 0; o < this.queuedEventInfos.length; o++)
                        this.handleEventInfo(this.queuedEventInfos[o]);
                    this.queuedEventInfos = null
                }
            }
        }
        return e
    }
    )();
function pE(e, t = window) {
    return JS(t._ejsas?.[e])
}
function Lf(e, t = window) {
    t._ejsas && (t._ejsas[e] = void 0)
}
var ac = Symbol("InputSignalNode#UNSET")
    , wE = P(m({}, Zi), {
        transformFn: void 0,
        applyValueToInputSignal(e, t) {
            Dr(e, t)
        }
    });
function _E(e, t) {
    let n = Object.create(wE);
    n.value = e,
        n.transformFn = t?.transform;
    function r() {
        if (yr(n),
            n.value === ac) {
            let o = null;
            throw new y(-950, o)
        }
        return n.value
    }
    return r[ve] = n,
        r
}
var sc = class {
    attributeName;
    constructor(t) {
        this.attributeName = t
    }
    __NG_ELEMENT_ID__ = () => Ta(this.attributeName);
    toString() {
        return `HostAttributeToken ${this.attributeName}`
    }
}
    ;
function gE(e, t) {
    return _E(e, t)
}
function DM(e) {
    return _E(ac, e)
}
var He = (gE.required = DM,
    gE);
function mE(e, t) {
    return Dy(t)
}
function CM(e, t) {
    return Cy(t)
}
var TE = (mE.required = CM,
    mE);
function SE(e, t) {
    let n = Object.create(wE)
        , r = new Ja;
    n.value = e;
    function o() {
        return yr(n),
            vE(n.value),
            n.value
    }
    return o[ve] = n,
        o.asReadonly = Qs.bind(o),
        o.set = i => {
            n.equal(n.value, i) || (Dr(n, i),
                r.emit(i))
        }
        ,
        o.update = i => {
            vE(n.value),
                o.set(i(n.value))
        }
        ,
        o.subscribe = r.subscribe.bind(r),
        o.destroyRef = r.destroyRef,
        o
}
function vE(e) {
    if (e === ac)
        throw new y(952, !1)
}
function yE(e, t) {
    return SE(e, t)
}
function bM(e) {
    return SE(ac, e)
}
var jf = (yE.required = bM,
    yE);
var Ff = new v("")
    , wM = new v("");
function gi(e) {
    return !e.moduleRef
}
function _M(e) {
    let t = gi(e) ? e.r3Injector : e.moduleRef.injector
        , n = t.get(Ae);
    return n.run(() => {
        gi(e) ? e.r3Injector.resolveInjectorInitializers() : e.moduleRef.resolveInjectorInitializers();
        let r = t.get(ct), o;
        if (n.runOutsideAngular(() => {
            o = n.onError.subscribe({
                next: r
            })
        }
        ),
            gi(e)) {
            let i = () => t.destroy()
                , s = e.platformInjector.get(Ff);
            s.add(i),
                t.onDestroy(() => {
                    o.unsubscribe(),
                        s.delete(i)
                }
                )
        } else {
            let i = () => e.moduleRef.destroy()
                , s = e.platformInjector.get(Ff);
            s.add(i),
                e.moduleRef.onDestroy(() => {
                    qo(e.allPlatformModules, e.moduleRef),
                        o.unsubscribe(),
                        s.delete(i)
                }
                )
        }
        return SM(r, n, () => {
            let i = t.get(Pt)
                , s = i.add()
                , a = t.get(mf);
            return a.runInitializers(),
                a.donePromise.then(() => {
                    let c = t.get(Sf, hi);
                    if (jy(c || hi),
                        !t.get(wM, !0))
                        return gi(e) ? t.get(Ue) : (e.allPlatformModules.push(e.moduleRef),
                            e.moduleRef);
                    if (gi(e)) {
                        let u = t.get(Ue);
                        return e.rootComponent !== void 0 && u.bootstrap(e.rootComponent),
                            u
                    } else
                        return TM?.(e.moduleRef, e.allPlatformModules),
                            e.moduleRef
                }
                ).finally(() => {
                    i.remove(s)
                }
                )
        }
        )
    }
    )
}
var TM;
function SM(e, t, n) {
    try {
        let r = n();
        return sr(r) ? r.catch(o => {
            throw t.runOutsideAngular(() => e(o)),
            o
        }
        ) : r
    } catch (r) {
        throw t.runOutsideAngular(() => e(r)),
        r
    }
}
var ic = null;
function MM(e = [], t) {
    return Ne.create({
        name: t,
        providers: [{
            provide: Lo,
            useValue: "platform"
        }, {
            provide: Ff,
            useValue: new Set([() => ic = null])
        }, ...e]
    })
}
function NM(e = []) {
    if (ic)
        return ic;
    let t = MM(e);
    return ic = t,
        xy(),
        RM(t),
        t
}
function RM(e) {
    let t = e.get(Sa, null);
    Ce(e, () => {
        t?.forEach(n => n())
    }
    )
}
var oc = new WeakSet
    , EE = "";
function IE(e) {
    return e.get(jd, jm)
}
function ME() {
    let e = [{
        provide: jd,
        useFactory: () => {
            let t = !0;
            {
                let n = p(Vt);
                t = !!window._ejsas?.[n]
            }
            return t && lt("NgEventReplay"),
                t
        }
    }];
    return e.push({
        provide: Mt,
        useValue: () => {
            let t = p(Ue)
                , { injector: n } = t;
            if (!oc.has(t)) {
                let r = p(Vd);
                if (IE(n)) {
                    Wm();
                    let o = n.get(Vt)
                        , i = Gm(o, (s, a, c) => {
                            s.nodeType === Node.ELEMENT_NODE && (Hm(s, a, c),
                                Bm(s, r))
                        }
                        );
                    t.onDestroy(i)
                }
            }
        }
        ,
        multi: !0
    }, {
        provide: En,
        useFactory: () => {
            let t = p(Ue)
                , { injector: n } = t;
            return () => {
                if (!IE(n) || oc.has(t))
                    return;
                oc.add(t);
                let r = n.get(Vt);
                t.onDestroy(() => {
                    oc.delete(t),
                        Lf(r)
                }
                ),
                    t.whenStable().then(() => {
                        if (t.destroyed)
                            return;
                        let o = n.get(zm);
                        AM(o, n);
                        let i = n.get(Vd);
                        i.get(EE)?.forEach($m),
                            i.delete(EE);
                        let s = o.instance;
                        ev(n) ? t.onDestroy(() => s.cleanUp()) : s.cleanUp()
                    }
                    )
            }
        }
        ,
        multi: !0
    }),
        e
}
var AM = (e, t) => {
    let n = t.get(Vt)
        , r = window._ejsas[n]
        , o = e.instance = new hE(new nc(r.c));
    for (let a of r.et)
        o.addEvent(a);
    for (let a of r.etc)
        o.addEvent(a);
    let i = pE(n);
    o.replayEarlyEventInfos(i),
        Lf(n);
    let s = new rc(a => {
        xM(t, a, a.currentTarget)
    }
    );
    fE(o, s)
}
    ;
function xM(e, t, n) {
    let r = (n && n.getAttribute(ii)) ?? "";
    /d\d+/.test(r) ? OM(r, e, t, n) : t.eventPhase === Pf.REPLAY && Ud(t, n)
}
function OM(e, t, n, r) {
    let o = t.get(Vm);
    o.push({
        event: n,
        currentTarget: r
    }),
        Py(t, e, kM(o))
}
function kM(e) {
    return t => {
        let n = new Set(t)
            , r = [];
        for (let { event: o, currentTarget: i } of e) {
            let s = i.getAttribute(ii);
            n.has(s) ? Ud(o, i) : r.push({
                event: o,
                currentTarget: i
            })
        }
        e.length = 0,
            e.push(...r)
    }
}
var DE = !1;
var PM = 1e4;
function LM() {
    DE || (DE = !0,
        Km(),
        Ly(),
        qy(),
        Fy(),
        Sy(),
        gy(),
        Xv(),
        Ov())
}
function FM(e) {
    return e.whenStable()
}
function NE() {
    let e = [{
        provide: oi,
        useFactory: () => {
            let t = !0;
            return t = !!p(Wr, {
                optional: !0
            })?.get(Hd, null),
                t && lt("NgHydration"),
                t
        }
    }, {
        provide: Mt,
        useValue: () => {
            Zv(!1);
            let t = p(ne);
            p(oi) && (rv(t),
                LM())
        }
        ,
        multi: !0
    }];
    return e.push({
        provide: Fd,
        useFactory: () => p(oi)
    }, {
        provide: En,
        useFactory: () => {
            if (p(oi)) {
                let t = p(Ue);
                return () => {
                    FM(t).then(() => {
                        t.destroyed || uf(t)
                    }
                    )
                }
            }
            return () => { }
        }
        ,
        multi: !0
    }),
        Nt(e)
}
var CB = PM - 1e3;
var mi = (() => {
    class e {
        static __NG_ELEMENT_ID__ = jM
    }
    return e
}
)();
function jM(e) {
    return VM(we(), A(), (e & 16) === 16)
}
function VM(e, t, n) {
    if (Yt(e) && !n) {
        let r = st(e.index, t);
        return new vn(r, r)
    } else if (e.type & 175) {
        let r = t[be];
        return new vn(r, t)
    }
    return null
}
function RE(e) {
    let { rootComponent: t, appProviders: n, platformProviders: r, platformRef: o } = e;
    U(j.BootstrapApplicationStart);
    try {
        let i = o?.injector ?? NM(r)
            , s = [Yy(), mg, ...n || []]
            , a = new Xo({
                providers: s,
                parent: i,
                debugName: "",
                runEnvironmentInitializers: !1
            });
        return _M({
            r3Injector: a.injector,
            platformInjector: i,
            rootComponent: t
        })
    } catch (i) {
        return Promise.reject(i)
    } finally {
        U(j.BootstrapApplicationEnd)
    }
}
function vi(e) {
    return typeof e == "boolean" ? e : e != null && e !== "false"
}
var AE = null;
function ft() {
    return AE
}
function Vf(e) {
    AE ??= e
}
var yi = class {
}
    , cc = (() => {
        class e {
            historyGo(n) {
                throw new Error("")
            }
            static \u0275fac = function (r) {
                return new (r || e)
            }
                ;
            static \u0275prov = w({
                token: e,
                factory: () => p(xE),
                providedIn: "platform"
            })
        }
        return e
    }
    )();
var xE = (() => {
    class e extends cc {
        _location;
        _history;
        _doc = p(ne);
        constructor() {
            super(),
                this._location = window.location,
                this._history = window.history
        }
        getBaseHrefFromDOM() {
            return ft().getBaseHref(this._doc)
        }
        onPopState(n) {
            let r = ft().getGlobalEventTarget(this._doc, "window");
            return r.addEventListener("popstate", n, !1),
                () => r.removeEventListener("popstate", n)
        }
        onHashChange(n) {
            let r = ft().getGlobalEventTarget(this._doc, "window");
            return r.addEventListener("hashchange", n, !1),
                () => r.removeEventListener("hashchange", n)
        }
        get href() {
            return this._location.href
        }
        get protocol() {
            return this._location.protocol
        }
        get hostname() {
            return this._location.hostname
        }
        get port() {
            return this._location.port
        }
        get pathname() {
            return this._location.pathname
        }
        get search() {
            return this._location.search
        }
        get hash() {
            return this._location.hash
        }
        set pathname(n) {
            this._location.pathname = n
        }
        pushState(n, r, o) {
            this._history.pushState(n, r, o)
        }
        replaceState(n, r, o) {
            this._history.replaceState(n, r, o)
        }
        forward() {
            this._history.forward()
        }
        back() {
            this._history.back()
        }
        historyGo(n = 0) {
            this._history.go(n)
        }
        getState() {
            return this._history.state
        }
        static \u0275fac = function (r) {
            return new (r || e)
        }
            ;
        static \u0275prov = w({
            token: e,
            factory: () => new e,
            providedIn: "platform"
        })
    }
    return e
}
)();
function PE(e, t) {
    return e ? t ? e.endsWith("/") ? t.startsWith("/") ? e + t.slice(1) : e + t : t.startsWith("/") ? e + t : `${e}/${t}` : e : t
}
function OE(e) {
    let t = e.search(/#|\?|$/);
    return e[t - 1] === "/" ? e.slice(0, t - 1) + e.slice(t) : e
}
function bn(e) {
    return e && e[0] !== "?" ? `?${e}` : e
}
var no = (() => {
    class e {
        historyGo(n) {
            throw new Error("")
        }
        static \u0275fac = function (r) {
            return new (r || e)
        }
            ;
        static \u0275prov = w({
            token: e,
            factory: () => p(HM),
            providedIn: "root"
        })
    }
    return e
}
)()
    , UM = new v("")
    , HM = (() => {
        class e extends no {
            _platformLocation;
            _baseHref;
            _removeListenerFns = [];
            constructor(n, r) {
                super(),
                    this._platformLocation = n,
                    this._baseHref = r ?? this._platformLocation.getBaseHrefFromDOM() ?? p(ne).location?.origin ?? ""
            }
            ngOnDestroy() {
                for (; this._removeListenerFns.length;)
                    this._removeListenerFns.pop()()
            }
            onPopState(n) {
                this._removeListenerFns.push(this._platformLocation.onPopState(n), this._platformLocation.onHashChange(n))
            }
            getBaseHref() {
                return this._baseHref
            }
            prepareExternalUrl(n) {
                return PE(this._baseHref, n)
            }
            path(n = !1) {
                let r = this._platformLocation.pathname + bn(this._platformLocation.search)
                    , o = this._platformLocation.hash;
                return o && n ? `${r}${o}` : r
            }
            pushState(n, r, o, i) {
                let s = this.prepareExternalUrl(o + bn(i));
                this._platformLocation.pushState(n, r, s)
            }
            replaceState(n, r, o, i) {
                let s = this.prepareExternalUrl(o + bn(i));
                this._platformLocation.replaceState(n, r, s)
            }
            forward() {
                this._platformLocation.forward()
            }
            back() {
                this._platformLocation.back()
            }
            getState() {
                return this._platformLocation.getState()
            }
            historyGo(n = 0) {
                this._platformLocation.historyGo?.(n)
            }
            static \u0275fac = function (r) {
                return new (r || e)(k(cc), k(UM, 8))
            }
                ;
            static \u0275prov = w({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    }
    )()
    , ro = (() => {
        class e {
            _subject = new ce;
            _basePath;
            _locationStrategy;
            _urlChangeListeners = [];
            _urlChangeSubscription = null;
            constructor(n) {
                this._locationStrategy = n;
                let r = this._locationStrategy.getBaseHref();
                this._basePath = zM(OE(kE(r))),
                    this._locationStrategy.onPopState(o => {
                        this._subject.next({
                            url: this.path(!0),
                            pop: !0,
                            state: o.state,
                            type: o.type
                        })
                    }
                    )
            }
            ngOnDestroy() {
                this._urlChangeSubscription?.unsubscribe(),
                    this._urlChangeListeners = []
            }
            path(n = !1) {
                return this.normalize(this._locationStrategy.path(n))
            }
            getState() {
                return this._locationStrategy.getState()
            }
            isCurrentPathEqualTo(n, r = "") {
                return this.path() == this.normalize(n + bn(r))
            }
            normalize(n) {
                return e.stripTrailingSlash($M(this._basePath, kE(n)))
            }
            prepareExternalUrl(n) {
                return n && n[0] !== "/" && (n = "/" + n),
                    this._locationStrategy.prepareExternalUrl(n)
            }
            go(n, r = "", o = null) {
                this._locationStrategy.pushState(o, "", n, r),
                    this._notifyUrlChangeListeners(this.prepareExternalUrl(n + bn(r)), o)
            }
            replaceState(n, r = "", o = null) {
                this._locationStrategy.replaceState(o, "", n, r),
                    this._notifyUrlChangeListeners(this.prepareExternalUrl(n + bn(r)), o)
            }
            forward() {
                this._locationStrategy.forward()
            }
            back() {
                this._locationStrategy.back()
            }
            historyGo(n = 0) {
                this._locationStrategy.historyGo?.(n)
            }
            onUrlChange(n) {
                return this._urlChangeListeners.push(n),
                    this._urlChangeSubscription ??= this.subscribe(r => {
                        this._notifyUrlChangeListeners(r.url, r.state)
                    }
                    ),
                    () => {
                        let r = this._urlChangeListeners.indexOf(n);
                        this._urlChangeListeners.splice(r, 1),
                            this._urlChangeListeners.length === 0 && (this._urlChangeSubscription?.unsubscribe(),
                                this._urlChangeSubscription = null)
                    }
            }
            _notifyUrlChangeListeners(n = "", r) {
                this._urlChangeListeners.forEach(o => o(n, r))
            }
            subscribe(n, r, o) {
                return this._subject.subscribe({
                    next: n,
                    error: r ?? void 0,
                    complete: o ?? void 0
                })
            }
            static normalizeQueryParams = bn;
            static joinWithSlash = PE;
            static stripTrailingSlash = OE;
            static \u0275fac = function (r) {
                return new (r || e)(k(no))
            }
                ;
            static \u0275prov = w({
                token: e,
                factory: () => BM(),
                providedIn: "root"
            })
        }
        return e
    }
    )();
function BM() {
    return new ro(k(no))
}
function $M(e, t) {
    if (!e || !t.startsWith(e))
        return t;
    let n = t.substring(e.length);
    return n === "" || ["/", ";", "?", "#"].includes(n[0]) ? n : t
}
function kE(e) {
    return e.replace(/\/index.html$/, "")
}
function zM(e) {
    if (new RegExp("^(https?:)?//").test(e)) {
        let [, n] = e.split(/\/\/[^\/]+/);
        return n
    }
    return e
}
function Uf(e, t) {
    t = encodeURIComponent(t);
    for (let n of e.split(";")) {
        let r = n.indexOf("=")
            , [o, i] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
        if (o.trim() === t)
            return decodeURIComponent(i)
    }
    return null
}
var Ei = class {
}
    ;
var LE = "browser";
var Ii = class {
    _doc;
    constructor(t) {
        this._doc = t
    }
    manager
}
    , lc = (() => {
        class e extends Ii {
            constructor(n) {
                super(n)
            }
            supports(n) {
                return !0
            }
            addEventListener(n, r, o, i) {
                return n.addEventListener(r, o, i),
                    () => this.removeEventListener(n, r, o, i)
            }
            removeEventListener(n, r, o, i) {
                return n.removeEventListener(r, o, i)
            }
            static \u0275fac = function (r) {
                return new (r || e)(k(ne))
            }
                ;
            static \u0275prov = w({
                token: e,
                factory: e.\u0275fac
            })
        }
        return e
    }
    )()
    , fc = new v("")
    , zf = (() => {
        class e {
            _zone;
            _plugins;
            _eventNameToPlugin = new Map;
            constructor(n, r) {
                this._zone = r,
                    n.forEach(s => {
                        s.manager = this
                    }
                    );
                let o = n.filter(s => !(s instanceof lc));
                this._plugins = o.slice().reverse();
                let i = n.find(s => s instanceof lc);
                i && this._plugins.push(i)
            }
            addEventListener(n, r, o, i) {
                return this._findPluginFor(r).addEventListener(n, r, o, i)
            }
            getZone() {
                return this._zone
            }
            _findPluginFor(n) {
                let r = this._eventNameToPlugin.get(n);
                if (r)
                    return r;
                if (r = this._plugins.find(i => i.supports(n)),
                    !r)
                    throw new y(5101, !1);
                return this._eventNameToPlugin.set(n, r),
                    r
            }
            static \u0275fac = function (r) {
                return new (r || e)(k(fc), k(Ae))
            }
                ;
            static \u0275prov = w({
                token: e,
                factory: e.\u0275fac
            })
        }
        return e
    }
    )()
    , Hf = "ng-app-id";
function FE(e) {
    for (let t of e)
        t.remove()
}
function jE(e, t) {
    let n = t.createElement("style");
    return n.textContent = e,
        n
}
function qM(e, t, n, r) {
    let o = e.head?.querySelectorAll(`style[${Hf}="${t}"],link[${Hf}="${t}"]`);
    if (o)
        for (let i of o)
            i.removeAttribute(Hf),
                i instanceof HTMLLinkElement ? r.set(i.href.slice(i.href.lastIndexOf("/") + 1), {
                    usage: 0,
                    elements: [i]
                }) : i.textContent && n.set(i.textContent, {
                    usage: 0,
                    elements: [i]
                })
}
function $f(e, t) {
    let n = t.createElement("link");
    return n.setAttribute("rel", "stylesheet"),
        n.setAttribute("href", e),
        n
}
var Gf = (() => {
    class e {
        doc;
        appId;
        nonce;
        inline = new Map;
        external = new Map;
        hosts = new Set;
        constructor(n, r, o, i = {}) {
            this.doc = n,
                this.appId = r,
                this.nonce = o,
                qM(n, r, this.inline, this.external),
                this.hosts.add(n.head)
        }
        addStyles(n, r) {
            for (let o of n)
                this.addUsage(o, this.inline, jE);
            r?.forEach(o => this.addUsage(o, this.external, $f))
        }
        removeStyles(n, r) {
            for (let o of n)
                this.removeUsage(o, this.inline);
            r?.forEach(o => this.removeUsage(o, this.external))
        }
        addUsage(n, r, o) {
            let i = r.get(n);
            i ? i.usage++ : r.set(n, {
                usage: 1,
                elements: [...this.hosts].map(s => this.addElement(s, o(n, this.doc)))
            })
        }
        removeUsage(n, r) {
            let o = r.get(n);
            o && (o.usage--,
                o.usage <= 0 && (FE(o.elements),
                    r.delete(n)))
        }
        ngOnDestroy() {
            for (let [, { elements: n }] of [...this.inline, ...this.external])
                FE(n);
            this.hosts.clear()
        }
        addHost(n) {
            this.hosts.add(n);
            for (let [r, { elements: o }] of this.inline)
                o.push(this.addElement(n, jE(r, this.doc)));
            for (let [r, { elements: o }] of this.external)
                o.push(this.addElement(n, $f(r, this.doc)))
        }
        removeHost(n) {
            this.hosts.delete(n)
        }
        addElement(n, r) {
            return this.nonce && r.setAttribute("nonce", this.nonce),
                n.appendChild(r)
        }
        static \u0275fac = function (r) {
            return new (r || e)(k(ne), k(Vt), k(Ma, 8), k(ri))
        }
            ;
        static \u0275prov = w({
            token: e,
            factory: e.\u0275fac
        })
    }
    return e
}
)()
    , Bf = {
        svg: "http://www.w3.org/2000/svg",
        xhtml: "http://www.w3.org/1999/xhtml",
        xlink: "http://www.w3.org/1999/xlink",
        xml: "http://www.w3.org/XML/1998/namespace",
        xmlns: "http://www.w3.org/2000/xmlns/",
        math: "http://www.w3.org/1998/Math/MathML"
    }
    , qf = /%COMP%/g;
var UE = "%COMP%"
    , WM = `_nghost-${UE}`
    , QM = `_ngcontent-${UE}`
    , ZM = !0
    , YM = new v("", {
        factory: () => ZM
    });
function KM(e) {
    return QM.replace(qf, e)
}
function JM(e) {
    return WM.replace(qf, e)
}
function HE(e, t) {
    return t.map(n => n.replace(qf, e))
}
var Wf = (() => {
    class e {
        eventManager;
        sharedStylesHost;
        appId;
        removeStylesOnCompDestroy;
        doc;
        ngZone;
        nonce;
        tracingService;
        rendererByCompId = new Map;
        defaultRenderer;
        constructor(n, r, o, i, s, a, c = null, l = null) {
            this.eventManager = n,
                this.sharedStylesHost = r,
                this.appId = o,
                this.removeStylesOnCompDestroy = i,
                this.doc = s,
                this.ngZone = a,
                this.nonce = c,
                this.tracingService = l,
                this.defaultRenderer = new Di(n, s, a, this.tracingService)
        }
        createRenderer(n, r) {
            if (!n || !r)
                return this.defaultRenderer;
            let o = this.getOrCreateRenderer(n, r);
            return o instanceof dc ? o.applyToHost(n) : o instanceof Ci && o.applyStyles(),
                o
        }
        getOrCreateRenderer(n, r) {
            let o = this.rendererByCompId
                , i = o.get(r.id);
            if (!i) {
                let s = this.doc
                    , a = this.ngZone
                    , c = this.eventManager
                    , l = this.sharedStylesHost
                    , u = this.removeStylesOnCompDestroy
                    , d = this.tracingService;
                switch (r.encapsulation) {
                    case It.Emulated:
                        i = new dc(c, l, r, this.appId, u, s, a, d);
                        break;
                    case It.ShadowDom:
                        return new uc(c, n, r, s, a, this.nonce, d, l);
                    case It.ExperimentalIsolatedShadowDom:
                        return new uc(c, n, r, s, a, this.nonce, d);
                    default:
                        i = new Ci(c, l, r, u, s, a, d);
                        break
                }
                o.set(r.id, i)
            }
            return i
        }
        ngOnDestroy() {
            this.rendererByCompId.clear()
        }
        componentReplaced(n) {
            this.rendererByCompId.delete(n)
        }
        static \u0275fac = function (r) {
            return new (r || e)(k(zf), k(Gf), k(Vt), k(YM), k(ne), k(Ae), k(Ma), k(yn, 8))
        }
            ;
        static \u0275prov = w({
            token: e,
            factory: e.\u0275fac
        })
    }
    return e
}
)()
    , Di = class {
        eventManager;
        doc;
        ngZone;
        tracingService;
        data = Object.create(null);
        throwOnSyntheticProps = !0;
        constructor(t, n, r, o) {
            this.eventManager = t,
                this.doc = n,
                this.ngZone = r,
                this.tracingService = o
        }
        destroy() { }
        destroyNode = null;
        createElement(t, n) {
            return n ? this.doc.createElementNS(Bf[n] || n, t) : this.doc.createElement(t)
        }
        createComment(t) {
            return this.doc.createComment(t)
        }
        createText(t) {
            return this.doc.createTextNode(t)
        }
        appendChild(t, n) {
            (VE(t) ? t.content : t).appendChild(n)
        }
        insertBefore(t, n, r) {
            t && (VE(t) ? t.content : t).insertBefore(n, r)
        }
        removeChild(t, n) {
            n.remove()
        }
        selectRootElement(t, n) {
            let r = typeof t == "string" ? this.doc.querySelector(t) : t;
            if (!r)
                throw new y(-5104, !1);
            return n || (r.textContent = ""),
                r
        }
        parentNode(t) {
            return t.parentNode
        }
        nextSibling(t) {
            return t.nextSibling
        }
        setAttribute(t, n, r, o) {
            if (o) {
                n = o + ":" + n;
                let i = Bf[o];
                i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r)
            } else
                t.setAttribute(n, r)
        }
        removeAttribute(t, n, r) {
            if (r) {
                let o = Bf[r];
                o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`)
            } else
                t.removeAttribute(n)
        }
        addClass(t, n) {
            t.classList.add(n)
        }
        removeClass(t, n) {
            t.classList.remove(n)
        }
        setStyle(t, n, r, o) {
            o & (Xt.DashCase | Xt.Important) ? t.style.setProperty(n, r, o & Xt.Important ? "important" : "") : t.style[n] = r
        }
        removeStyle(t, n, r) {
            r & Xt.DashCase ? t.style.removeProperty(n) : t.style[n] = ""
        }
        setProperty(t, n, r) {
            t != null && (t[n] = r)
        }
        setValue(t, n) {
            t.nodeValue = n
        }
        listen(t, n, r, o) {
            if (typeof t == "string" && (t = ft().getGlobalEventTarget(this.doc, t),
                !t))
                throw new y(5102, !1);
            let i = this.decoratePreventDefault(r);
            return this.tracingService?.wrapEventListener && (i = this.tracingService.wrapEventListener(t, n, i)),
                this.eventManager.addEventListener(t, n, i, o)
        }
        decoratePreventDefault(t) {
            return n => {
                if (n === "__ngUnwrap__")
                    return t;
                t(n) === !1 && n.preventDefault()
            }
        }
    }
    ;
function VE(e) {
    return e.tagName === "TEMPLATE" && e.content !== void 0
}
var uc = class extends Di {
    hostEl;
    sharedStylesHost;
    shadowRoot;
    constructor(t, n, r, o, i, s, a, c) {
        super(t, o, i, a),
            this.hostEl = n,
            this.sharedStylesHost = c,
            this.shadowRoot = n.attachShadow({
                mode: "open"
            }),
            this.sharedStylesHost && this.sharedStylesHost.addHost(this.shadowRoot);
        let l = r.styles;
        l = HE(r.id, l);
        for (let d of l) {
            let h = document.createElement("style");
            s && h.setAttribute("nonce", s),
                h.textContent = d,
                this.shadowRoot.appendChild(h)
        }
        let u = r.getExternalStyles?.();
        if (u)
            for (let d of u) {
                let h = $f(d, o);
                s && h.setAttribute("nonce", s),
                    this.shadowRoot.appendChild(h)
            }
    }
    nodeOrShadowRoot(t) {
        return t === this.hostEl ? this.shadowRoot : t
    }
    appendChild(t, n) {
        return super.appendChild(this.nodeOrShadowRoot(t), n)
    }
    insertBefore(t, n, r) {
        return super.insertBefore(this.nodeOrShadowRoot(t), n, r)
    }
    removeChild(t, n) {
        return super.removeChild(null, n)
    }
    parentNode(t) {
        return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)))
    }
    destroy() {
        this.sharedStylesHost && this.sharedStylesHost.removeHost(this.shadowRoot)
    }
}
    , Ci = class extends Di {
        sharedStylesHost;
        removeStylesOnCompDestroy;
        styles;
        styleUrls;
        constructor(t, n, r, o, i, s, a, c) {
            super(t, i, s, a),
                this.sharedStylesHost = n,
                this.removeStylesOnCompDestroy = o;
            let l = r.styles;
            this.styles = c ? HE(c, l) : l,
                this.styleUrls = r.getExternalStyles?.(c)
        }
        applyStyles() {
            this.sharedStylesHost.addStyles(this.styles, this.styleUrls)
        }
        destroy() {
            this.removeStylesOnCompDestroy && Xn.size === 0 && this.sharedStylesHost.removeStyles(this.styles, this.styleUrls)
        }
    }
    , dc = class extends Ci {
        contentAttr;
        hostAttr;
        constructor(t, n, r, o, i, s, a, c) {
            let l = o + "-" + r.id;
            super(t, n, r, i, s, a, c, l),
                this.contentAttr = KM(l),
                this.hostAttr = JM(l)
        }
        applyToHost(t) {
            this.applyStyles(),
                this.setAttribute(t, this.hostAttr, "")
        }
        createElement(t, n) {
            let r = super.createElement(t, n);
            return super.setAttribute(r, this.contentAttr, ""),
                r
        }
    }
    ;
var hc = class e extends yi {
    supportsDOMEvents = !0;
    static makeCurrent() {
        Vf(new e)
    }
    onAndCancel(t, n, r, o) {
        return t.addEventListener(n, r, o),
            () => {
                t.removeEventListener(n, r, o)
            }
    }
    dispatchEvent(t, n) {
        t.dispatchEvent(n)
    }
    remove(t) {
        t.remove()
    }
    createElement(t, n) {
        return n = n || this.getDefaultDocument(),
            n.createElement(t)
    }
    createHtmlDocument() {
        return document.implementation.createHTMLDocument("fakeTitle")
    }
    getDefaultDocument() {
        return document
    }
    isElementNode(t) {
        return t.nodeType === Node.ELEMENT_NODE
    }
    isShadowRoot(t) {
        return t instanceof DocumentFragment
    }
    getGlobalEventTarget(t, n) {
        return n === "window" ? window : n === "document" ? t : n === "body" ? t.body : null
    }
    getBaseHref(t) {
        let n = XM();
        return n == null ? null : eN(n)
    }
    resetBaseElement() {
        bi = null
    }
    getUserAgent() {
        return window.navigator.userAgent
    }
    getCookie(t) {
        return Uf(document.cookie, t)
    }
}
    , bi = null;
function XM() {
    return bi = bi || document.head.querySelector("base"),
        bi ? bi.getAttribute("href") : null
}
function eN(e) {
    return new URL(e, document.baseURI).pathname
}
var tN = (() => {
    class e {
        build() {
            return new XMLHttpRequest
        }
        static \u0275fac = function (r) {
            return new (r || e)
        }
            ;
        static \u0275prov = w({
            token: e,
            factory: e.\u0275fac
        })
    }
    return e
}
)()
    , BE = ["alt", "control", "meta", "shift"]
    , nN = {
        "\b": "Backspace",
        "	": "Tab",
        "\x7F": "Delete",
        "\x1B": "Escape",
        Del: "Delete",
        Esc: "Escape",
        Left: "ArrowLeft",
        Right: "ArrowRight",
        Up: "ArrowUp",
        Down: "ArrowDown",
        Menu: "ContextMenu",
        Scroll: "ScrollLock",
        Win: "OS"
    }
    , rN = {
        alt: e => e.altKey,
        control: e => e.ctrlKey,
        meta: e => e.metaKey,
        shift: e => e.shiftKey
    }
    , $E = (() => {
        class e extends Ii {
            constructor(n) {
                super(n)
            }
            supports(n) {
                return e.parseEventName(n) != null
            }
            addEventListener(n, r, o, i) {
                let s = e.parseEventName(r)
                    , a = e.eventCallback(s.fullKey, o, this.manager.getZone());
                return this.manager.getZone().runOutsideAngular(() => ft().onAndCancel(n, s.domEventName, a, i))
            }
            static parseEventName(n) {
                let r = n.toLowerCase().split(".")
                    , o = r.shift();
                if (r.length === 0 || !(o === "keydown" || o === "keyup"))
                    return null;
                let i = e._normalizeKey(r.pop())
                    , s = ""
                    , a = r.indexOf("code");
                if (a > -1 && (r.splice(a, 1),
                    s = "code."),
                    BE.forEach(l => {
                        let u = r.indexOf(l);
                        u > -1 && (r.splice(u, 1),
                            s += l + ".")
                    }
                    ),
                    s += i,
                    r.length != 0 || i.length === 0)
                    return null;
                let c = {};
                return c.domEventName = o,
                    c.fullKey = s,
                    c
            }
            static matchEventFullKeyCode(n, r) {
                let o = nN[n.key] || n.key
                    , i = "";
                return r.indexOf("code.") > -1 && (o = n.code,
                    i = "code."),
                    o == null || !o ? !1 : (o = o.toLowerCase(),
                        o === " " ? o = "space" : o === "." && (o = "dot"),
                        BE.forEach(s => {
                            if (s !== o) {
                                let a = rN[s];
                                a(n) && (i += s + ".")
                            }
                        }
                        ),
                        i += o,
                        i === r)
            }
            static eventCallback(n, r, o) {
                return i => {
                    e.matchEventFullKeyCode(i, n) && o.runGuarded(() => r(i))
                }
            }
            static _normalizeKey(n) {
                return n === "esc" ? "escape" : n
            }
            static \u0275fac = function (r) {
                return new (r || e)(k(ne))
            }
                ;
            static \u0275prov = w({
                token: e,
                factory: e.\u0275fac
            })
        }
        return e
    }
    )();
async function Qf(e, t, n) {
    let r = m({
        rootComponent: e
    }, oN(t, n));
    return RE(r)
}
function oN(e, t) {
    return {
        platformRef: t?.platformRef,
        appProviders: [...lN, ...e?.providers ?? []],
        platformProviders: cN
    }
}
function iN() {
    hc.makeCurrent()
}
function sN() {
    return new rt
}
function aN() {
    return kd(document),
        document
}
var cN = [{
    provide: ri,
    useValue: LE
}, {
    provide: Sa,
    useValue: iN,
    multi: !0
}, {
    provide: ne,
    useFactory: aN
}];
var lN = [{
    provide: Lo,
    useValue: "root"
}, {
    provide: rt,
    useFactory: sN
}, {
    provide: fc,
    useClass: lc,
    multi: !0
}, {
    provide: fc,
    useClass: $E,
    multi: !0
}, Wf, Gf, zf, {
    provide: tr,
    useExisting: Wf
}, {
    provide: Ei,
    useClass: tN
}, []];
var wi = class e {
    headers;
    normalizedNames = new Map;
    lazyInit;
    lazyUpdate = null;
    constructor(t) {
        t ? typeof t == "string" ? this.lazyInit = () => {
            this.headers = new Map,
                t.split(`
`).forEach(n => {
                    let r = n.indexOf(":");
                    if (r > 0) {
                        let o = n.slice(0, r)
                            , i = n.slice(r + 1).trim();
                        this.addHeaderEntry(o, i)
                    }
                }
                )
        }
            : typeof Headers < "u" && t instanceof Headers ? (this.headers = new Map,
                t.forEach((n, r) => {
                    this.addHeaderEntry(r, n)
                }
                )) : this.lazyInit = () => {
                    this.headers = new Map,
                        Object.entries(t).forEach(([n, r]) => {
                            this.setHeaderEntries(n, r)
                        }
                        )
                }
            : this.headers = new Map
    }
    has(t) {
        return this.init(),
            this.headers.has(t.toLowerCase())
    }
    get(t) {
        this.init();
        let n = this.headers.get(t.toLowerCase());
        return n && n.length > 0 ? n[0] : null
    }
    keys() {
        return this.init(),
            Array.from(this.normalizedNames.values())
    }
    getAll(t) {
        return this.init(),
            this.headers.get(t.toLowerCase()) || null
    }
    append(t, n) {
        return this.clone({
            name: t,
            value: n,
            op: "a"
        })
    }
    set(t, n) {
        return this.clone({
            name: t,
            value: n,
            op: "s"
        })
    }
    delete(t, n) {
        return this.clone({
            name: t,
            value: n,
            op: "d"
        })
    }
    maybeSetNormalizedName(t, n) {
        this.normalizedNames.has(n) || this.normalizedNames.set(n, t)
    }
    init() {
        this.lazyInit && (this.lazyInit instanceof e ? this.copyFrom(this.lazyInit) : this.lazyInit(),
            this.lazyInit = null,
            this.lazyUpdate && (this.lazyUpdate.forEach(t => this.applyUpdate(t)),
                this.lazyUpdate = null))
    }
    copyFrom(t) {
        t.init(),
            Array.from(t.headers.keys()).forEach(n => {
                this.headers.set(n, t.headers.get(n)),
                    this.normalizedNames.set(n, t.normalizedNames.get(n))
            }
            )
    }
    clone(t) {
        let n = new e;
        return n.lazyInit = this.lazyInit && this.lazyInit instanceof e ? this.lazyInit : this,
            n.lazyUpdate = (this.lazyUpdate || []).concat([t]),
            n
    }
    applyUpdate(t) {
        let n = t.name.toLowerCase();
        switch (t.op) {
            case "a":
            case "s":
                let r = t.value;
                if (typeof r == "string" && (r = [r]),
                    r.length === 0)
                    return;
                this.maybeSetNormalizedName(t.name, n);
                let o = (t.op === "a" ? this.headers.get(n) : void 0) || [];
                o.push(...r),
                    this.headers.set(n, o);
                break;
            case "d":
                let i = t.value;
                if (!i)
                    this.headers.delete(n),
                        this.normalizedNames.delete(n);
                else {
                    let s = this.headers.get(n);
                    if (!s)
                        return;
                    s = s.filter(a => i.indexOf(a) === -1),
                        s.length === 0 ? (this.headers.delete(n),
                            this.normalizedNames.delete(n)) : this.headers.set(n, s)
                }
                break
        }
    }
    addHeaderEntry(t, n) {
        let r = t.toLowerCase();
        this.maybeSetNormalizedName(t, r),
            this.headers.has(r) ? this.headers.get(r).push(n) : this.headers.set(r, [n])
    }
    setHeaderEntries(t, n) {
        let r = (Array.isArray(n) ? n : [n]).map(i => i.toString())
            , o = t.toLowerCase();
        this.headers.set(o, r),
            this.maybeSetNormalizedName(t, o)
    }
    forEach(t) {
        this.init(),
            Array.from(this.normalizedNames.keys()).forEach(n => t(this.normalizedNames.get(n), this.headers.get(n)))
    }
}
    ;
var uN = "text/plain"
    , dN = "application/json"
    , g2 = `${dN}, ${uN}, */*`;
var Yf = (function (e) {
    return e[e.Sent = 0] = "Sent",
        e[e.UploadProgress = 1] = "UploadProgress",
        e[e.ResponseHeader = 2] = "ResponseHeader",
        e[e.DownloadProgress = 3] = "DownloadProgress",
        e[e.Response = 4] = "Response",
        e[e.User = 5] = "User",
        e
}
)(Yf || {})
    , Zf = class {
        headers;
        status;
        statusText;
        url;
        ok;
        type;
        redirected;
        responseType;
        constructor(t, n = 200, r = "OK") {
            this.headers = t.headers || new wi,
                this.status = t.status !== void 0 ? t.status : n,
                this.statusText = t.statusText || r,
                this.url = t.url || null,
                this.redirected = t.redirected,
                this.responseType = t.responseType,
                this.ok = this.status >= 200 && this.status < 300
        }
    }
    ;
var pc = class e extends Zf {
    body;
    constructor(t = {}) {
        super(t),
            this.body = t.body !== void 0 ? t.body : null
    }
    type = Yf.Response;
    clone(t = {}) {
        return new e({
            body: t.body !== void 0 ? t.body : this.body,
            headers: t.headers || this.headers,
            status: t.status !== void 0 ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0,
            redirected: t.redirected ?? this.redirected,
            responseType: t.responseType ?? this.responseType
        })
    }
}
    ;
var zE = new v("");
var fN = new v("")
    , hN = "b"
    , pN = "h"
    , gN = "s"
    , mN = "st"
    , vN = "u"
    , yN = "rt"
    , Kf = new v("")
    , EN = ["GET", "HEAD"];
function IN(e, t) {
    let f = p(Kf)
        , { isCacheActive: n } = f
        , r = Gh(f, ["isCacheActive"])
        , { transferCache: o, method: i } = e;
    if (!n || o === !1 || i === "POST" && !r.includePostRequests && !o || i !== "POST" && !EN.includes(i) || !r.includeRequestsWithAuthHeaders && DN(e) || r.filter?.(e) === !1)
        return t(e);
    let s = p(Wr);
    if (p(fN, {
        optional: !0
    }))
        throw new y(2803, !1);
    let c = e.url
        , l = CN(e, c)
        , u = s.get(l, null)
        , d = r.includeHeaders;
    if (typeof o == "object" && o.includeHeaders && (d = o.includeHeaders),
        u) {
        let { [hN]: g, [yN]: E, [pN]: M, [gN]: x, [mN]: $e, [vN]: Nn } = u
            , hl = g;
        switch (E) {
            case "arraybuffer":
                hl = new TextEncoder().encode(g).buffer;
                break;
            case "blob":
                hl = new Blob([g]);
                break
        }
        let ED = new wi(M);
        return L(new pc({
            body: hl,
            headers: ED,
            status: x,
            statusText: $e,
            url: Nn
        }))
    }
    return t(e)
}
function DN(e) {
    return e.headers.has("authorization") || e.headers.has("proxy-authorization")
}
function GE(e) {
    return [...e.keys()].sort().map(t => `${t}=${e.getAll(t)}`).join("&")
}
function CN(e, t) {
    let { params: n, method: r, responseType: o } = e
        , i = GE(n)
        , s = e.serializeBody();
    s instanceof URLSearchParams ? s = GE(s) : typeof s != "string" && (s = "");
    let a = [r, o, t, s, i].join("|")
        , c = bN(a);
    return c
}
function bN(e) {
    let t = 0;
    for (let n of e)
        t = Math.imul(31, t) + n.charCodeAt(0) << 0;
    return t += 2147483648,
        t.toString()
}
function qE(e) {
    return [{
        provide: Kf,
        useFactory: () => (lt("NgHttpTransferCache"),
            m({
                isCacheActive: !0
            }, e))
    }, {
        provide: zE,
        useValue: IN,
        multi: !0
    }, {
        provide: En,
        multi: !0,
        useFactory: () => {
            let t = p(Ue)
                , n = p(Kf);
            return () => {
                t.whenStable().then(() => {
                    n.isCacheActive = !1
                }
                )
            }
        }
    }]
}
var WE = (() => {
    class e {
        _doc;
        constructor(n) {
            this._doc = n
        }
        getTitle() {
            return this._doc.title
        }
        setTitle(n) {
            this._doc.title = n || ""
        }
        static \u0275fac = function (r) {
            return new (r || e)(k(ne))
        }
            ;
        static \u0275prov = w({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
}
)();
var gc = (function (e) {
    return e[e.NoHttpTransferCache = 0] = "NoHttpTransferCache",
        e[e.HttpTransferCacheOptions = 1] = "HttpTransferCacheOptions",
        e[e.I18nSupport = 2] = "I18nSupport",
        e[e.EventReplay = 3] = "EventReplay",
        e[e.IncrementalHydration = 4] = "IncrementalHydration",
        e
}
)(gc || {});
function wN(e, t = [], n = {}) {
    return {
        \u0275kind: e,
        \u0275providers: t
    }
}
function QE() {
    return wN(gc.EventReplay, ME())
}
function ZE(...e) {
    let t = []
        , n = new Set;
    for (let { \u0275providers: o, \u0275kind: i } of e)
        n.add(i),
            o.length && t.push(o);
    let r = n.has(gc.HttpTransferCacheOptions);
    return Nt([[], [], NE(), n.has(gc.NoHttpTransferCache) || r ? [] : qE({}), t])
}
var N = "primary"
    , Li = Symbol("RouteTitle")
    , nh = class {
        params;
        constructor(t) {
            this.params = t || {}
        }
        has(t) {
            return Object.prototype.hasOwnProperty.call(this.params, t)
        }
        get(t) {
            if (this.has(t)) {
                let n = this.params[t];
                return Array.isArray(n) ? n[0] : n
            }
            return null
        }
        getAll(t) {
            if (this.has(t)) {
                let n = this.params[t];
                return Array.isArray(n) ? n : [n]
            }
            return []
        }
        get keys() {
            return Object.keys(this.params)
        }
    }
    ;
function fr(e) {
    return new nh(e)
}
function Jf(e, t, n) {
    for (let r = 0; r < e.length; r++) {
        let o = e[r]
            , i = t[r];
        if (o[0] === ":")
            n[o.substring(1)] = i;
        else if (o !== i.path)
            return !1
    }
    return !0
}
function oI(e, t, n) {
    let r = n.path.split("/")
        , o = r.indexOf("**");
    if (o === -1) {
        if (r.length > e.length || n.pathMatch === "full" && (t.hasChildren() || r.length < e.length))
            return null;
        let c = {}
            , l = e.slice(0, r.length);
        return Jf(r, l, c) ? {
            consumed: l,
            posParams: c
        } : null
    }
    if (o !== r.lastIndexOf("**"))
        return null;
    let i = r.slice(0, o)
        , s = r.slice(o + 1);
    if (i.length + s.length > e.length || n.pathMatch === "full" && t.hasChildren() && n.path !== "**")
        return null;
    let a = {};
    return !Jf(i, e.slice(0, i.length), a) || !Jf(s, e.slice(e.length - s.length), a) ? null : {
        consumed: e,
        posParams: a
    }
}
function Dc(e) {
    return new Promise((t, n) => {
        e.pipe($t()).subscribe({
            next: r => t(r),
            error: r => n(r)
        })
    }
    )
}
function TN(e, t) {
    if (e.length !== t.length)
        return !1;
    for (let n = 0; n < e.length; ++n)
        if (!Ht(e[n], t[n]))
            return !1;
    return !0
}
function Ht(e, t) {
    let n = e ? rh(e) : void 0
        , r = t ? rh(t) : void 0;
    if (!n || !r || n.length != r.length)
        return !1;
    let o;
    for (let i = 0; i < n.length; i++)
        if (o = n[i],
            !iI(e[o], t[o]))
            return !1;
    return !0
}
function rh(e) {
    return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)]
}
function iI(e, t) {
    if (Array.isArray(e) && Array.isArray(t)) {
        if (e.length !== t.length)
            return !1;
        let n = [...e].sort()
            , r = [...t].sort();
        return n.every((o, i) => r[i] === o)
    } else
        return e === t
}
function SN(e) {
    return e.length > 0 ? e[e.length - 1] : null
}
function gr(e) {
    return ps(e) ? e : sr(e) ? re(Promise.resolve(e)) : L(e)
}
function sI(e) {
    return ps(e) ? Dc(e) : Promise.resolve(e)
}
var MN = {
    exact: cI,
    subset: lI
}
    , aI = {
        exact: NN,
        subset: RN,
        ignored: () => !0
    };
function vh(e, t, n) {
    let r = e instanceof et ? e : t.parseUrl(e);
    return pe(() => oh(t.lastSuccessfulNavigation()?.finalUrl ?? new et, r, n))
}
function oh(e, t, n) {
    return MN[n.paths](e.root, t.root, n.matrixParams) && aI[n.queryParams](e.queryParams, t.queryParams) && !(n.fragment === "exact" && e.fragment !== t.fragment)
}
function NN(e, t) {
    return Ht(e, t)
}
function cI(e, t, n) {
    if (!ur(e.segments, t.segments) || !yc(e.segments, t.segments, n) || e.numberOfChildren !== t.numberOfChildren)
        return !1;
    for (let r in t.children)
        if (!e.children[r] || !cI(e.children[r], t.children[r], n))
            return !1;
    return !0
}
function RN(e, t) {
    return Object.keys(t).length <= Object.keys(e).length && Object.keys(t).every(n => iI(e[n], t[n]))
}
function lI(e, t, n) {
    return uI(e, t, t.segments, n)
}
function uI(e, t, n, r) {
    if (e.segments.length > n.length) {
        let o = e.segments.slice(0, n.length);
        return !(!ur(o, n) || t.hasChildren() || !yc(o, n, r))
    } else if (e.segments.length === n.length) {
        if (!ur(e.segments, n) || !yc(e.segments, n, r))
            return !1;
        for (let o in t.children)
            if (!e.children[o] || !lI(e.children[o], t.children[o], r))
                return !1;
        return !0
    } else {
        let o = n.slice(0, e.segments.length)
            , i = n.slice(e.segments.length);
        return !ur(e.segments, o) || !yc(e.segments, o, r) || !e.children[N] ? !1 : uI(e.children[N], t, i, r)
    }
}
function yc(e, t, n) {
    return t.every((r, o) => aI[n](e[o].parameters, r.parameters))
}
var et = class {
    root;
    queryParams;
    fragment;
    _queryParamMap;
    constructor(t = new z([], {}), n = {}, r = null) {
        this.root = t,
            this.queryParams = n,
            this.fragment = r
    }
    get queryParamMap() {
        return this._queryParamMap ??= fr(this.queryParams),
            this._queryParamMap
    }
    toString() {
        return ON.serialize(this)
    }
}
    , z = class {
        segments;
        children;
        parent = null;
        constructor(t, n) {
            this.segments = t,
                this.children = n,
                Object.values(n).forEach(r => r.parent = this)
        }
        hasChildren() {
            return this.numberOfChildren > 0
        }
        get numberOfChildren() {
            return Object.keys(this.children).length
        }
        toString() {
            return Ec(this)
        }
    }
    , wn = class {
        path;
        parameters;
        _parameterMap;
        constructor(t, n) {
            this.path = t,
                this.parameters = n
        }
        get parameterMap() {
            return this._parameterMap ??= fr(this.parameters),
                this._parameterMap
        }
        toString() {
            return fI(this)
        }
    }
    ;
function AN(e, t) {
    return ur(e, t) && e.every((n, r) => Ht(n.parameters, t[r].parameters))
}
function ur(e, t) {
    return e.length !== t.length ? !1 : e.every((n, r) => n.path === t[r].path)
}
function xN(e, t) {
    let n = [];
    return Object.entries(e.children).forEach(([r, o]) => {
        r === N && (n = n.concat(t(o, r)))
    }
    ),
        Object.entries(e.children).forEach(([r, o]) => {
            r !== N && (n = n.concat(t(o, r)))
        }
        ),
        n
}
var Fi = (() => {
    class e {
        static \u0275fac = function (r) {
            return new (r || e)
        }
            ;
        static \u0275prov = w({
            token: e,
            factory: () => new _n,
            providedIn: "root"
        })
    }
    return e
}
)()
    , _n = class {
        parse(t) {
            let n = new sh(t);
            return new et(n.parseRootSegment(), n.parseQueryParams(), n.parseFragment())
        }
        serialize(t) {
            let n = `/${_i(t.root, !0)}`
                , r = LN(t.queryParams)
                , o = typeof t.fragment == "string" ? `#${kN(t.fragment)}` : "";
            return `${n}${r}${o}`
        }
    }
    , ON = new _n;
function Ec(e) {
    return e.segments.map(t => fI(t)).join("/")
}
function _i(e, t) {
    if (!e.hasChildren())
        return Ec(e);
    if (t) {
        let n = e.children[N] ? _i(e.children[N], !1) : ""
            , r = [];
        return Object.entries(e.children).forEach(([o, i]) => {
            o !== N && r.push(`${o}:${_i(i, !1)}`)
        }
        ),
            r.length > 0 ? `${n}(${r.join("//")})` : n
    } else {
        let n = xN(e, (r, o) => o === N ? [_i(e.children[N], !1)] : [`${o}:${_i(r, !1)}`]);
        return Object.keys(e.children).length === 1 && e.children[N] != null ? `${Ec(e)}/${n[0]}` : `${Ec(e)}/(${n.join("//")})`
    }
}
function dI(e) {
    return encodeURIComponent(e).replace(/%40/g, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",")
}
function mc(e) {
    return dI(e).replace(/%3B/gi, ";")
}
function kN(e) {
    return encodeURI(e)
}
function ih(e) {
    return dI(e).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/%26/gi, "&")
}
function Ic(e) {
    return decodeURIComponent(e)
}
function YE(e) {
    return Ic(e.replace(/\+/g, "%20"))
}
function fI(e) {
    return `${ih(e.path)}${PN(e.parameters)}`
}
function PN(e) {
    return Object.entries(e).map(([t, n]) => `;${ih(t)}=${ih(n)}`).join("")
}
function LN(e) {
    let t = Object.entries(e).map(([n, r]) => Array.isArray(r) ? r.map(o => `${mc(n)}=${mc(o)}`).join("&") : `${mc(n)}=${mc(r)}`).filter(n => n);
    return t.length ? `?${t.join("&")}` : ""
}
var FN = /^[^\/()?;#]+/;
function Xf(e) {
    let t = e.match(FN);
    return t ? t[0] : ""
}
var jN = /^[^\/()?;=#]+/;
function VN(e) {
    let t = e.match(jN);
    return t ? t[0] : ""
}
var UN = /^[^=?&#]+/;
function HN(e) {
    let t = e.match(UN);
    return t ? t[0] : ""
}
var BN = /^[^&#]+/;
function $N(e) {
    let t = e.match(BN);
    return t ? t[0] : ""
}
var sh = class {
    url;
    remaining;
    constructor(t) {
        this.url = t,
            this.remaining = t
    }
    parseRootSegment() {
        return this.consumeOptional("/"),
            this.remaining === "" || this.peekStartsWith("?") || this.peekStartsWith("#") ? new z([], {}) : new z([], this.parseChildren())
    }
    parseQueryParams() {
        let t = {};
        if (this.consumeOptional("?"))
            do
                this.parseQueryParam(t);
            while (this.consumeOptional("&"));
        return t
    }
    parseFragment() {
        return this.consumeOptional("#") ? decodeURIComponent(this.remaining) : null
    }
    parseChildren(t = 0) {
        if (t > 50)
            throw new y(4010, !1);
        if (this.remaining === "")
            return {};
        this.consumeOptional("/");
        let n = [];
        for (this.peekStartsWith("(") || n.push(this.parseSegment()); this.peekStartsWith("/") && !this.peekStartsWith("//") && !this.peekStartsWith("/(");)
            this.capture("/"),
                n.push(this.parseSegment());
        let r = {};
        this.peekStartsWith("/(") && (this.capture("/"),
            r = this.parseParens(!0, t));
        let o = {};
        return this.peekStartsWith("(") && (o = this.parseParens(!1, t)),
            (n.length > 0 || Object.keys(r).length > 0) && (o[N] = new z(n, r)),
            o
    }
    parseSegment() {
        let t = Xf(this.remaining);
        if (t === "" && this.peekStartsWith(";"))
            throw new y(4009, !1);
        return this.capture(t),
            new wn(Ic(t), this.parseMatrixParams())
    }
    parseMatrixParams() {
        let t = {};
        for (; this.consumeOptional(";");)
            this.parseParam(t);
        return t
    }
    parseParam(t) {
        let n = VN(this.remaining);
        if (!n)
            return;
        this.capture(n);
        let r = "";
        if (this.consumeOptional("=")) {
            let o = Xf(this.remaining);
            o && (r = o,
                this.capture(r))
        }
        t[Ic(n)] = Ic(r)
    }
    parseQueryParam(t) {
        let n = HN(this.remaining);
        if (!n)
            return;
        this.capture(n);
        let r = "";
        if (this.consumeOptional("=")) {
            let s = $N(this.remaining);
            s && (r = s,
                this.capture(r))
        }
        let o = YE(n)
            , i = YE(r);
        if (t.hasOwnProperty(o)) {
            let s = t[o];
            Array.isArray(s) || (s = [s],
                t[o] = s),
                s.push(i)
        } else
            t[o] = i
    }
    parseParens(t, n) {
        let r = {};
        for (this.capture("("); !this.consumeOptional(")") && this.remaining.length > 0;) {
            let o = Xf(this.remaining)
                , i = this.remaining[o.length];
            if (i !== "/" && i !== ")" && i !== ";")
                throw new y(4010, !1);
            let s;
            o.indexOf(":") > -1 ? (s = o.slice(0, o.indexOf(":")),
                this.capture(s),
                this.capture(":")) : t && (s = N);
            let a = this.parseChildren(n + 1);
            r[s ?? N] = Object.keys(a).length === 1 && a[N] ? a[N] : new z([], a),
                this.consumeOptional("//")
        }
        return r
    }
    peekStartsWith(t) {
        return this.remaining.startsWith(t)
    }
    consumeOptional(t) {
        return this.peekStartsWith(t) ? (this.remaining = this.remaining.substring(t.length),
            !0) : !1
    }
    capture(t) {
        if (!this.consumeOptional(t))
            throw new y(4011, !1)
    }
}
    ;
function hI(e) {
    return e.segments.length > 0 ? new z([], {
        [N]: e
    }) : e
}
function pI(e) {
    let t = {};
    for (let [r, o] of Object.entries(e.children)) {
        let i = pI(o);
        if (r === N && i.segments.length === 0 && i.hasChildren())
            for (let [s, a] of Object.entries(i.children))
                t[s] = a;
        else
            (i.segments.length > 0 || i.hasChildren()) && (t[r] = i)
    }
    let n = new z(e.segments, t);
    return zN(n)
}
function zN(e) {
    if (e.numberOfChildren === 1 && e.children[N]) {
        let t = e.children[N];
        return new z(e.segments.concat(t.segments), t.children)
    }
    return e
}
function Tn(e) {
    return e instanceof et
}
function gI(e, t, n = null, r = null, o = new _n) {
    let i = mI(e);
    return vI(i, t, n, r, o)
}
function mI(e) {
    let t;
    function n(i) {
        let s = {};
        for (let c of i.children) {
            let l = n(c);
            s[c.outlet] = l
        }
        let a = new z(i.url, s);
        return i === e && (t = a),
            a
    }
    let r = n(e.root)
        , o = hI(r);
    return t ?? o
}
function vI(e, t, n, r, o) {
    let i = e;
    for (; i.parent;)
        i = i.parent;
    if (t.length === 0)
        return eh(i, i, i, n, r, o);
    let s = GN(t);
    if (s.toRoot())
        return eh(i, i, new z([], {}), n, r, o);
    let a = qN(s, i, e)
        , c = a.processChildren ? Si(a.segmentGroup, a.index, s.commands) : EI(a.segmentGroup, a.index, s.commands);
    return eh(i, a.segmentGroup, c, n, r, o)
}
function Cc(e) {
    return typeof e == "object" && e != null && !e.outlets && !e.segmentPath
}
function Ri(e) {
    return typeof e == "object" && e != null && e.outlets
}
function KE(e, t, n) {
    e ||= "\u0275";
    let r = new et;
    return r.queryParams = {
        [e]: t
    },
        n.parse(n.serialize(r)).queryParams[e]
}
function eh(e, t, n, r, o, i) {
    let s = {};
    for (let [l, u] of Object.entries(r ?? {}))
        s[l] = Array.isArray(u) ? u.map(d => KE(l, d, i)) : KE(l, u, i);
    let a;
    e === t ? a = n : a = yI(e, t, n);
    let c = hI(pI(a));
    return new et(c, s, o)
}
function yI(e, t, n) {
    let r = {};
    return Object.entries(e.children).forEach(([o, i]) => {
        i === t ? r[o] = n : r[o] = yI(i, t, n)
    }
    ),
        new z(e.segments, r)
}
var bc = class {
    isAbsolute;
    numberOfDoubleDots;
    commands;
    constructor(t, n, r) {
        if (this.isAbsolute = t,
            this.numberOfDoubleDots = n,
            this.commands = r,
            t && r.length > 0 && Cc(r[0]))
            throw new y(4003, !1);
        let o = r.find(Ri);
        if (o && o !== SN(r))
            throw new y(4004, !1)
    }
    toRoot() {
        return this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    }
}
    ;
function GN(e) {
    if (typeof e[0] == "string" && e.length === 1 && e[0] === "/")
        return new bc(!0, 0, e);
    let t = 0
        , n = !1
        , r = e.reduce((o, i, s) => {
            if (typeof i == "object" && i != null) {
                if (i.outlets) {
                    let a = {};
                    return Object.entries(i.outlets).forEach(([c, l]) => {
                        a[c] = typeof l == "string" ? l.split("/") : l
                    }
                    ),
                        [...o, {
                            outlets: a
                        }]
                }
                if (i.segmentPath)
                    return [...o, i.segmentPath]
            }
            return typeof i != "string" ? [...o, i] : s === 0 ? (i.split("/").forEach((a, c) => {
                c == 0 && a === "." || (c == 0 && a === "" ? n = !0 : a === ".." ? t++ : a != "" && o.push(a))
            }
            ),
                o) : [...o, i]
        }
            , []);
    return new bc(n, t, r)
}
var io = class {
    segmentGroup;
    processChildren;
    index;
    constructor(t, n, r) {
        this.segmentGroup = t,
            this.processChildren = n,
            this.index = r
    }
}
    ;
function qN(e, t, n) {
    if (e.isAbsolute)
        return new io(t, !0, 0);
    if (!n)
        return new io(t, !1, NaN);
    if (n.parent === null)
        return new io(n, !0, 0);
    let r = Cc(e.commands[0]) ? 0 : 1
        , o = n.segments.length - 1 + r;
    return WN(n, o, e.numberOfDoubleDots)
}
function WN(e, t, n) {
    let r = e
        , o = t
        , i = n;
    for (; i > o;) {
        if (i -= o,
            r = r.parent,
            !r)
            throw new y(4005, !1);
        o = r.segments.length
    }
    return new io(r, !1, o - i)
}
function QN(e) {
    return Ri(e[0]) ? e[0].outlets : {
        [N]: e
    }
}
function EI(e, t, n) {
    if (e ??= new z([], {}),
        e.segments.length === 0 && e.hasChildren())
        return Si(e, t, n);
    let r = ZN(e, t, n)
        , o = n.slice(r.commandIndex);
    if (r.match && r.pathIndex < e.segments.length) {
        let i = new z(e.segments.slice(0, r.pathIndex), {});
        return i.children[N] = new z(e.segments.slice(r.pathIndex), e.children),
            Si(i, 0, o)
    } else
        return r.match && o.length === 0 ? new z(e.segments, {}) : r.match && !e.hasChildren() ? ah(e, t, n) : r.match ? Si(e, 0, o) : ah(e, t, n)
}
function Si(e, t, n) {
    if (n.length === 0)
        return new z(e.segments, {});
    {
        let r = QN(n)
            , o = {};
        if (Object.keys(r).some(i => i !== N) && e.children[N] && e.numberOfChildren === 1 && e.children[N].segments.length === 0) {
            let i = Si(e.children[N], t, n);
            return new z(e.segments, i.children)
        }
        return Object.entries(r).forEach(([i, s]) => {
            typeof s == "string" && (s = [s]),
                s !== null && (o[i] = EI(e.children[i], t, s))
        }
        ),
            Object.entries(e.children).forEach(([i, s]) => {
                r[i] === void 0 && (o[i] = s)
            }
            ),
            new z(e.segments, o)
    }
}
function ZN(e, t, n) {
    let r = 0
        , o = t
        , i = {
            match: !1,
            pathIndex: 0,
            commandIndex: 0
        };
    for (; o < e.segments.length;) {
        if (r >= n.length)
            return i;
        let s = e.segments[o]
            , a = n[r];
        if (Ri(a))
            break;
        let c = `${a}`
            , l = r < n.length - 1 ? n[r + 1] : null;
        if (o > 0 && c === void 0)
            break;
        if (c && l && typeof l == "object" && l.outlets === void 0) {
            if (!XE(c, l, s))
                return i;
            r += 2
        } else {
            if (!XE(c, {}, s))
                return i;
            r++
        }
        o++
    }
    return {
        match: !0,
        pathIndex: o,
        commandIndex: r
    }
}
function ah(e, t, n) {
    let r = e.segments.slice(0, t)
        , o = 0;
    for (; o < n.length;) {
        let i = n[o];
        if (Ri(i)) {
            let c = YN(i.outlets);
            return new z(r, c)
        }
        if (o === 0 && Cc(n[0])) {
            let c = e.segments[t];
            r.push(new wn(c.path, JE(n[0]))),
                o++;
            continue
        }
        let s = Ri(i) ? i.outlets[N] : `${i}`
            , a = o < n.length - 1 ? n[o + 1] : null;
        s && a && Cc(a) ? (r.push(new wn(s, JE(a))),
            o += 2) : (r.push(new wn(s, {})),
                o++)
    }
    return new z(r, {})
}
function YN(e) {
    let t = {};
    return Object.entries(e).forEach(([n, r]) => {
        typeof r == "string" && (r = [r]),
            r !== null && (t[n] = ah(new z([], {}), 0, r))
    }
    ),
        t
}
function JE(e) {
    let t = {};
    return Object.entries(e).forEach(([n, r]) => t[n] = `${r}`),
        t
}
function XE(e, t, n) {
    return e == n.path && Ht(t, n.parameters)
}
var Mi = "imperative"
    , me = (function (e) {
        return e[e.NavigationStart = 0] = "NavigationStart",
            e[e.NavigationEnd = 1] = "NavigationEnd",
            e[e.NavigationCancel = 2] = "NavigationCancel",
            e[e.NavigationError = 3] = "NavigationError",
            e[e.RoutesRecognized = 4] = "RoutesRecognized",
            e[e.ResolveStart = 5] = "ResolveStart",
            e[e.ResolveEnd = 6] = "ResolveEnd",
            e[e.GuardsCheckStart = 7] = "GuardsCheckStart",
            e[e.GuardsCheckEnd = 8] = "GuardsCheckEnd",
            e[e.RouteConfigLoadStart = 9] = "RouteConfigLoadStart",
            e[e.RouteConfigLoadEnd = 10] = "RouteConfigLoadEnd",
            e[e.ChildActivationStart = 11] = "ChildActivationStart",
            e[e.ChildActivationEnd = 12] = "ChildActivationEnd",
            e[e.ActivationStart = 13] = "ActivationStart",
            e[e.ActivationEnd = 14] = "ActivationEnd",
            e[e.Scroll = 15] = "Scroll",
            e[e.NavigationSkipped = 16] = "NavigationSkipped",
            e
    }
    )(me || {})
    , tt = class {
        id;
        url;
        constructor(t, n) {
            this.id = t,
                this.url = n
        }
    }
    , hr = class extends tt {
        type = me.NavigationStart;
        navigationTrigger;
        restoredState;
        constructor(t, n, r = "imperative", o = null) {
            super(t, n),
                this.navigationTrigger = r,
                this.restoredState = o
        }
        toString() {
            return `NavigationStart(id: ${this.id}, url: '${this.url}')`
        }
    }
    , nt = class extends tt {
        urlAfterRedirects;
        type = me.NavigationEnd;
        constructor(t, n, r) {
            super(t, n),
                this.urlAfterRedirects = r
        }
        toString() {
            return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`
        }
    }
    , Re = (function (e) {
        return e[e.Redirect = 0] = "Redirect",
            e[e.SupersededByNewNavigation = 1] = "SupersededByNewNavigation",
            e[e.NoDataFromResolver = 2] = "NoDataFromResolver",
            e[e.GuardRejected = 3] = "GuardRejected",
            e[e.Aborted = 4] = "Aborted",
            e
    }
    )(Re || {})
    , Ai = (function (e) {
        return e[e.IgnoredSameUrlNavigation = 0] = "IgnoredSameUrlNavigation",
            e[e.IgnoredByUrlHandlingStrategy = 1] = "IgnoredByUrlHandlingStrategy",
            e
    }
    )(Ai || {})
    , ht = class extends tt {
        reason;
        code;
        type = me.NavigationCancel;
        constructor(t, n, r, o) {
            super(t, n),
                this.reason = r,
                this.code = o
        }
        toString() {
            return `NavigationCancel(id: ${this.id}, url: '${this.url}')`
        }
    }
    ;
function II(e) {
    return e instanceof ht && (e.code === Re.Redirect || e.code === Re.SupersededByNewNavigation)
}
var rn = class extends tt {
    reason;
    code;
    type = me.NavigationSkipped;
    constructor(t, n, r, o) {
        super(t, n),
            this.reason = r,
            this.code = o
    }
}
    , pr = class extends tt {
        error;
        target;
        type = me.NavigationError;
        constructor(t, n, r, o) {
            super(t, n),
                this.error = r,
                this.target = o
        }
        toString() {
            return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`
        }
    }
    , ao = class extends tt {
        urlAfterRedirects;
        state;
        type = me.RoutesRecognized;
        constructor(t, n, r, o) {
            super(t, n),
                this.urlAfterRedirects = r,
                this.state = o
        }
        toString() {
            return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
        }
    }
    , wc = class extends tt {
        urlAfterRedirects;
        state;
        type = me.GuardsCheckStart;
        constructor(t, n, r, o) {
            super(t, n),
                this.urlAfterRedirects = r,
                this.state = o
        }
        toString() {
            return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
        }
    }
    , _c = class extends tt {
        urlAfterRedirects;
        state;
        shouldActivate;
        type = me.GuardsCheckEnd;
        constructor(t, n, r, o, i) {
            super(t, n),
                this.urlAfterRedirects = r,
                this.state = o,
                this.shouldActivate = i
        }
        toString() {
            return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`
        }
    }
    , Tc = class extends tt {
        urlAfterRedirects;
        state;
        type = me.ResolveStart;
        constructor(t, n, r, o) {
            super(t, n),
                this.urlAfterRedirects = r,
                this.state = o
        }
        toString() {
            return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
        }
    }
    , Sc = class extends tt {
        urlAfterRedirects;
        state;
        type = me.ResolveEnd;
        constructor(t, n, r, o) {
            super(t, n),
                this.urlAfterRedirects = r,
                this.state = o
        }
        toString() {
            return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
        }
    }
    , Mc = class {
        route;
        type = me.RouteConfigLoadStart;
        constructor(t) {
            this.route = t
        }
        toString() {
            return `RouteConfigLoadStart(path: ${this.route.path})`
        }
    }
    , Nc = class {
        route;
        type = me.RouteConfigLoadEnd;
        constructor(t) {
            this.route = t
        }
        toString() {
            return `RouteConfigLoadEnd(path: ${this.route.path})`
        }
    }
    , Rc = class {
        snapshot;
        type = me.ChildActivationStart;
        constructor(t) {
            this.snapshot = t
        }
        toString() {
            return `ChildActivationStart(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`
        }
    }
    , Ac = class {
        snapshot;
        type = me.ChildActivationEnd;
        constructor(t) {
            this.snapshot = t
        }
        toString() {
            return `ChildActivationEnd(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`
        }
    }
    , xc = class {
        snapshot;
        type = me.ActivationStart;
        constructor(t) {
            this.snapshot = t
        }
        toString() {
            return `ActivationStart(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`
        }
    }
    , Oc = class {
        snapshot;
        type = me.ActivationEnd;
        constructor(t) {
            this.snapshot = t
        }
        toString() {
            return `ActivationEnd(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`
        }
    }
    ;
var co = class {
}
    , lo = class {
        url;
        navigationBehaviorOptions;
        constructor(t, n) {
            this.url = t,
                this.navigationBehaviorOptions = n
        }
    }
    ;
function KN(e) {
    return !(e instanceof co) && !(e instanceof lo)
}
var kc = class {
    rootInjector;
    outlet = null;
    route = null;
    children;
    attachRef = null;
    get injector() {
        return this.route?.snapshot._environmentInjector ?? this.rootInjector
    }
    constructor(t) {
        this.rootInjector = t,
            this.children = new ho(this.rootInjector)
    }
}
    , ho = (() => {
        class e {
            rootInjector;
            contexts = new Map;
            constructor(n) {
                this.rootInjector = n
            }
            onChildOutletCreated(n, r) {
                let o = this.getOrCreateContext(n);
                o.outlet = r,
                    this.contexts.set(n, o)
            }
            onChildOutletDestroyed(n) {
                let r = this.getContext(n);
                r && (r.outlet = null,
                    r.attachRef = null)
            }
            onOutletDeactivated() {
                let n = this.contexts;
                return this.contexts = new Map,
                    n
            }
            onOutletReAttached(n) {
                this.contexts = n
            }
            getOrCreateContext(n) {
                let r = this.getContext(n);
                return r || (r = new kc(this.rootInjector),
                    this.contexts.set(n, r)),
                    r
            }
            getContext(n) {
                return this.contexts.get(n) || null
            }
            static \u0275fac = function (r) {
                return new (r || e)(k(te))
            }
                ;
            static \u0275prov = w({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    }
    )()
    , Pc = class {
        _root;
        constructor(t) {
            this._root = t
        }
        get root() {
            return this._root.value
        }
        parent(t) {
            let n = this.pathFromRoot(t);
            return n.length > 1 ? n[n.length - 2] : null
        }
        children(t) {
            let n = ch(t, this._root);
            return n ? n.children.map(r => r.value) : []
        }
        firstChild(t) {
            let n = ch(t, this._root);
            return n && n.children.length > 0 ? n.children[0].value : null
        }
        siblings(t) {
            let n = lh(t, this._root);
            return n.length < 2 ? [] : n[n.length - 2].children.map(o => o.value).filter(o => o !== t)
        }
        pathFromRoot(t) {
            return lh(t, this._root).map(n => n.value)
        }
    }
    ;
function ch(e, t) {
    if (e === t.value)
        return t;
    for (let n of t.children) {
        let r = ch(e, n);
        if (r)
            return r
    }
    return null
}
function lh(e, t) {
    if (e === t.value)
        return [t];
    for (let n of t.children) {
        let r = lh(e, n);
        if (r.length)
            return r.unshift(t),
                r
    }
    return []
}
var Xe = class {
    value;
    children;
    constructor(t, n) {
        this.value = t,
            this.children = n
    }
    toString() {
        return `TreeNode(${this.value})`
    }
}
    ;
function oo(e) {
    let t = {};
    return e && e.children.forEach(n => t[n.value.outlet] = n),
        t
}
var xi = class extends Pc {
    snapshot;
    constructor(t, n) {
        super(t),
            this.snapshot = n,
            yh(this, t)
    }
    toString() {
        return this.snapshot.toString()
    }
}
    ;
function DI(e, t) {
    let n = JN(e, t)
        , r = new Ee([new wn("", {})])
        , o = new Ee({})
        , i = new Ee({})
        , s = new Ee({})
        , a = new Ee("")
        , c = new on(r, o, s, a, i, N, e, n.root);
    return c.snapshot = n.root,
        new xi(new Xe(c, []), n)
}
function JN(e, t) {
    let n = {}
        , r = {}
        , o = {}
        , s = new dr([], n, o, "", r, N, e, null, {}, t);
    return new Oi("", new Xe(s, []))
}
var on = class {
    urlSubject;
    paramsSubject;
    queryParamsSubject;
    fragmentSubject;
    dataSubject;
    outlet;
    component;
    snapshot;
    _futureSnapshot;
    _routerState;
    _paramMap;
    _queryParamMap;
    title;
    url;
    params;
    queryParams;
    fragment;
    data;
    constructor(t, n, r, o, i, s, a, c) {
        this.urlSubject = t,
            this.paramsSubject = n,
            this.queryParamsSubject = r,
            this.fragmentSubject = o,
            this.dataSubject = i,
            this.outlet = s,
            this.component = a,
            this._futureSnapshot = c,
            this.title = this.dataSubject?.pipe(K(l => l[Li])) ?? L(void 0),
            this.url = t,
            this.params = n,
            this.queryParams = r,
            this.fragment = o,
            this.data = i
    }
    get routeConfig() {
        return this._futureSnapshot.routeConfig
    }
    get root() {
        return this._routerState.root
    }
    get parent() {
        return this._routerState.parent(this)
    }
    get firstChild() {
        return this._routerState.firstChild(this)
    }
    get children() {
        return this._routerState.children(this)
    }
    get pathFromRoot() {
        return this._routerState.pathFromRoot(this)
    }
    get paramMap() {
        return this._paramMap ??= this.params.pipe(K(t => fr(t))),
            this._paramMap
    }
    get queryParamMap() {
        return this._queryParamMap ??= this.queryParams.pipe(K(t => fr(t))),
            this._queryParamMap
    }
    toString() {
        return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`
    }
}
    ;
function Lc(e, t, n = "emptyOnly") {
    let r, { routeConfig: o } = e;
    return t !== null && (n === "always" || o?.path === "" || !t.component && !t.routeConfig?.loadComponent) ? r = {
        params: m(m({}, t.params), e.params),
        data: m(m({}, t.data), e.data),
        resolve: m(m(m(m({}, e.data), t.data), o?.data), e._resolvedData)
    } : r = {
        params: m({}, e.params),
        data: m({}, e.data),
        resolve: m(m({}, e.data), e._resolvedData ?? {})
    },
        o && bI(o) && (r.resolve[Li] = o.title),
        r
}
var dr = class {
    url;
    params;
    queryParams;
    fragment;
    data;
    outlet;
    component;
    routeConfig;
    _resolve;
    _resolvedData;
    _routerState;
    _paramMap;
    _queryParamMap;
    _environmentInjector;
    get title() {
        return this.data?.[Li]
    }
    constructor(t, n, r, o, i, s, a, c, l, u) {
        this.url = t,
            this.params = n,
            this.queryParams = r,
            this.fragment = o,
            this.data = i,
            this.outlet = s,
            this.component = a,
            this.routeConfig = c,
            this._resolve = l,
            this._environmentInjector = u
    }
    get root() {
        return this._routerState.root
    }
    get parent() {
        return this._routerState.parent(this)
    }
    get firstChild() {
        return this._routerState.firstChild(this)
    }
    get children() {
        return this._routerState.children(this)
    }
    get pathFromRoot() {
        return this._routerState.pathFromRoot(this)
    }
    get paramMap() {
        return this._paramMap ??= fr(this.params),
            this._paramMap
    }
    get queryParamMap() {
        return this._queryParamMap ??= fr(this.queryParams),
            this._queryParamMap
    }
    toString() {
        let t = this.url.map(r => r.toString()).join("/")
            , n = this.routeConfig ? this.routeConfig.path : "";
        return `Route(url:'${t}', path:'${n}')`
    }
}
    , Oi = class extends Pc {
        url;
        constructor(t, n) {
            super(n),
                this.url = t,
                yh(this, n)
        }
        toString() {
            return CI(this._root)
        }
    }
    ;
function yh(e, t) {
    t.value._routerState = e,
        t.children.forEach(n => yh(e, n))
}
function CI(e) {
    let t = e.children.length > 0 ? ` { ${e.children.map(CI).join(", ")} } ` : "";
    return `${e.value}${t}`
}
function th(e) {
    if (e.snapshot) {
        let t = e.snapshot
            , n = e._futureSnapshot;
        e.snapshot = n,
            Ht(t.queryParams, n.queryParams) || e.queryParamsSubject.next(n.queryParams),
            t.fragment !== n.fragment && e.fragmentSubject.next(n.fragment),
            Ht(t.params, n.params) || e.paramsSubject.next(n.params),
            TN(t.url, n.url) || e.urlSubject.next(n.url),
            Ht(t.data, n.data) || e.dataSubject.next(n.data)
    } else
        e.snapshot = e._futureSnapshot,
            e.dataSubject.next(e._futureSnapshot.data)
}
function uh(e, t) {
    let n = Ht(e.params, t.params) && AN(e.url, t.url)
        , r = !e.parent != !t.parent;
    return n && !r && (!e.parent || uh(e.parent, t.parent))
}
function bI(e) {
    return typeof e.title == "string" || e.title === null
}
var wI = new v("")
    , sn = (() => {
        class e {
            activated = null;
            get activatedComponentRef() {
                return this.activated
            }
            _activatedRoute = null;
            name = N;
            activateEvents = new ee;
            deactivateEvents = new ee;
            attachEvents = new ee;
            detachEvents = new ee;
            routerOutletData = He();
            parentContexts = p(ho);
            location = p(Kr);
            changeDetector = p(mi);
            inputBinder = p(Uc, {
                optional: !0
            });
            supportsBindingToComponentInputs = !0;
            ngOnChanges(n) {
                if (n.name) {
                    let { firstChange: r, previousValue: o } = n.name;
                    if (r)
                        return;
                    this.isTrackedInParentContexts(o) && (this.deactivate(),
                        this.parentContexts.onChildOutletDestroyed(o)),
                        this.initializeOutletWithName()
                }
            }
            ngOnDestroy() {
                this.isTrackedInParentContexts(this.name) && this.parentContexts.onChildOutletDestroyed(this.name),
                    this.inputBinder?.unsubscribeFromRouteData(this)
            }
            isTrackedInParentContexts(n) {
                return this.parentContexts.getContext(n)?.outlet === this
            }
            ngOnInit() {
                this.initializeOutletWithName()
            }
            initializeOutletWithName() {
                if (this.parentContexts.onChildOutletCreated(this.name, this),
                    this.activated)
                    return;
                let n = this.parentContexts.getContext(this.name);
                n?.route && (n.attachRef ? this.attach(n.attachRef, n.route) : this.activateWith(n.route, n.injector))
            }
            get isActivated() {
                return !!this.activated
            }
            get component() {
                if (!this.activated)
                    throw new y(4012, !1);
                return this.activated.instance
            }
            get activatedRoute() {
                if (!this.activated)
                    throw new y(4012, !1);
                return this._activatedRoute
            }
            get activatedRouteData() {
                return this._activatedRoute ? this._activatedRoute.snapshot.data : {}
            }
            detach() {
                if (!this.activated)
                    throw new y(4012, !1);
                this.location.detach();
                let n = this.activated;
                return this.activated = null,
                    this._activatedRoute = null,
                    this.detachEvents.emit(n.instance),
                    n
            }
            attach(n, r) {
                this.activated = n,
                    this._activatedRoute = r,
                    this.location.insert(n.hostView),
                    this.inputBinder?.bindActivatedRouteToOutletComponent(this),
                    this.attachEvents.emit(n.instance)
            }
            deactivate() {
                if (this.activated) {
                    let n = this.component;
                    this.activated.destroy(),
                        this.activated = null,
                        this._activatedRoute = null,
                        this.deactivateEvents.emit(n)
                }
            }
            activateWith(n, r) {
                if (this.isActivated)
                    throw new y(4013, !1);
                this._activatedRoute = n;
                let o = this.location
                    , s = n.snapshot.component
                    , a = this.parentContexts.getOrCreateContext(this.name).children
                    , c = new dh(n, a, o.injector, this.routerOutletData);
                this.activated = o.createComponent(s, {
                    index: o.length,
                    injector: c,
                    environmentInjector: r
                }),
                    this.changeDetector.markForCheck(),
                    this.inputBinder?.bindActivatedRouteToOutletComponent(this),
                    this.activateEvents.emit(this.activated.instance)
            }
            static \u0275fac = function (r) {
                return new (r || e)
            }
                ;
            static \u0275dir = _e({
                type: e,
                selectors: [["router-outlet"]],
                inputs: {
                    name: "name",
                    routerOutletData: [1, "routerOutletData"]
                },
                outputs: {
                    activateEvents: "activate",
                    deactivateEvents: "deactivate",
                    attachEvents: "attach",
                    detachEvents: "detach"
                },
                exportAs: ["outlet"],
                features: [jt]
            })
        }
        return e
    }
    )()
    , dh = class {
        route;
        childContexts;
        parent;
        outletData;
        constructor(t, n, r, o) {
            this.route = t,
                this.childContexts = n,
                this.parent = r,
                this.outletData = o
        }
        get(t, n) {
            return t === on ? this.route : t === ho ? this.childContexts : t === wI ? this.outletData : this.parent.get(t, n)
        }
    }
    , Uc = new v("");
var Eh = (() => {
    class e {
        static \u0275fac = function (r) {
            return new (r || e)
        }
            ;
        static \u0275cmp = X({
            type: e,
            selectors: [["ng-component"]],
            exportAs: ["emptyRouterOutlet"],
            decls: 1,
            vars: 0,
            template: function (r, o) {
                r & 1 && H(0, "router-outlet")
            },
            dependencies: [sn],
            encapsulation: 2
        })
    }
    return e
}
)();
function Ih(e) {
    let t = e.children && e.children.map(Ih)
        , n = t ? P(m({}, e), {
            children: t
        }) : m({}, e);
    return !n.component && !n.loadComponent && (t || n.loadChildren) && n.outlet && n.outlet !== N && (n.component = Eh),
        n
}
function XN(e, t, n) {
    let r = ki(e, t._root, n ? n._root : void 0);
    return new xi(r, t)
}
function ki(e, t, n) {
    if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
        let r = n.value;
        r._futureSnapshot = t.value;
        let o = eR(e, t, n);
        return new Xe(r, o)
    } else {
        if (e.shouldAttach(t.value)) {
            let i = e.retrieve(t.value);
            if (i !== null) {
                let s = i.route;
                return s.value._futureSnapshot = t.value,
                    s.children = t.children.map(a => ki(e, a)),
                    s
            }
        }
        let r = tR(t.value)
            , o = t.children.map(i => ki(e, i));
        return new Xe(r, o)
    }
}
function eR(e, t, n) {
    return t.children.map(r => {
        for (let o of n.children)
            if (e.shouldReuseRoute(r.value, o.value.snapshot))
                return ki(e, r, o);
        return ki(e, r)
    }
    )
}
function tR(e) {
    return new on(new Ee(e.url), new Ee(e.params), new Ee(e.queryParams), new Ee(e.fragment), new Ee(e.data), e.outlet, e.component, e)
}
var uo = class {
    redirectTo;
    navigationBehaviorOptions;
    constructor(t, n) {
        this.redirectTo = t,
            this.navigationBehaviorOptions = n
    }
}
    , _I = "ngNavigationCancelingError";
function Fc(e, t) {
    let { redirectTo: n, navigationBehaviorOptions: r } = Tn(t) ? {
        redirectTo: t,
        navigationBehaviorOptions: void 0
    } : t
        , o = TI(!1, Re.Redirect);
    return o.url = n,
        o.navigationBehaviorOptions = r,
        o
}
function TI(e, t) {
    let n = new Error(`NavigationCancelingError: ${e || ""}`);
    return n[_I] = !0,
        n.cancellationCode = t,
        n
}
function nR(e) {
    return SI(e) && Tn(e.url)
}
function SI(e) {
    return !!e && e[_I]
}
var fh = class {
    routeReuseStrategy;
    futureState;
    currState;
    forwardEvent;
    inputBindingEnabled;
    constructor(t, n, r, o, i) {
        this.routeReuseStrategy = t,
            this.futureState = n,
            this.currState = r,
            this.forwardEvent = o,
            this.inputBindingEnabled = i
    }
    activate(t) {
        let n = this.futureState._root
            , r = this.currState ? this.currState._root : null;
        this.deactivateChildRoutes(n, r, t),
            th(this.futureState.root),
            this.activateChildRoutes(n, r, t)
    }
    deactivateChildRoutes(t, n, r) {
        let o = oo(n);
        t.children.forEach(i => {
            let s = i.value.outlet;
            this.deactivateRoutes(i, o[s], r),
                delete o[s]
        }
        ),
            Object.values(o).forEach(i => {
                this.deactivateRouteAndItsChildren(i, r)
            }
            )
    }
    deactivateRoutes(t, n, r) {
        let o = t.value
            , i = n ? n.value : null;
        if (o === i)
            if (o.component) {
                let s = r.getContext(o.outlet);
                s && this.deactivateChildRoutes(t, n, s.children)
            } else
                this.deactivateChildRoutes(t, n, r);
        else
            i && this.deactivateRouteAndItsChildren(n, r)
    }
    deactivateRouteAndItsChildren(t, n) {
        t.value.component && this.routeReuseStrategy.shouldDetach(t.value.snapshot) ? this.detachAndStoreRouteSubtree(t, n) : this.deactivateRouteAndOutlet(t, n)
    }
    detachAndStoreRouteSubtree(t, n) {
        let r = n.getContext(t.value.outlet)
            , o = r && t.value.component ? r.children : n
            , i = oo(t);
        for (let s of Object.values(i))
            this.deactivateRouteAndItsChildren(s, o);
        if (r && r.outlet) {
            let s = r.outlet.detach()
                , a = r.children.onOutletDeactivated();
            this.routeReuseStrategy.store(t.value.snapshot, {
                componentRef: s,
                route: t,
                contexts: a
            })
        }
    }
    deactivateRouteAndOutlet(t, n) {
        let r = n.getContext(t.value.outlet)
            , o = r && t.value.component ? r.children : n
            , i = oo(t);
        for (let s of Object.values(i))
            this.deactivateRouteAndItsChildren(s, o);
        r && (r.outlet && (r.outlet.deactivate(),
            r.children.onOutletDeactivated()),
            r.attachRef = null,
            r.route = null)
    }
    activateChildRoutes(t, n, r) {
        let o = oo(n);
        t.children.forEach(i => {
            this.activateRoutes(i, o[i.value.outlet], r),
                this.forwardEvent(new Oc(i.value.snapshot))
        }
        ),
            t.children.length && this.forwardEvent(new Ac(t.value.snapshot))
    }
    activateRoutes(t, n, r) {
        let o = t.value
            , i = n ? n.value : null;
        if (th(o),
            o === i)
            if (o.component) {
                let s = r.getOrCreateContext(o.outlet);
                this.activateChildRoutes(t, n, s.children)
            } else
                this.activateChildRoutes(t, n, r);
        else if (o.component) {
            let s = r.getOrCreateContext(o.outlet);
            if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
                let a = this.routeReuseStrategy.retrieve(o.snapshot);
                this.routeReuseStrategy.store(o.snapshot, null),
                    s.children.onOutletReAttached(a.contexts),
                    s.attachRef = a.componentRef,
                    s.route = a.route.value,
                    s.outlet && s.outlet.attach(a.componentRef, a.route.value),
                    th(a.route.value),
                    this.activateChildRoutes(t, null, s.children)
            } else
                s.attachRef = null,
                    s.route = o,
                    s.outlet && s.outlet.activateWith(o, s.injector),
                    this.activateChildRoutes(t, null, s.children)
        } else
            this.activateChildRoutes(t, null, r)
    }
}
    , jc = class {
        path;
        route;
        constructor(t) {
            this.path = t,
                this.route = this.path[this.path.length - 1]
        }
    }
    , so = class {
        component;
        route;
        constructor(t, n) {
            this.component = t,
                this.route = n
        }
    }
    ;
function rR(e, t, n) {
    let r = e._root
        , o = t ? t._root : null;
    return Ti(r, o, n, [r.value])
}
function oR(e) {
    let t = e.routeConfig ? e.routeConfig.canActivateChild : null;
    return !t || t.length === 0 ? null : {
        node: e,
        guards: t
    }
}
function po(e, t) {
    let n = Symbol()
        , r = t.get(e, n);
    return r === n ? typeof e == "function" && !nu(e) ? e : t.get(e) : r
}
function Ti(e, t, n, r, o = {
    canDeactivateChecks: [],
    canActivateChecks: []
}) {
    let i = oo(t);
    return e.children.forEach(s => {
        iR(s, i[s.value.outlet], n, r.concat([s.value]), o),
            delete i[s.value.outlet]
    }
    ),
        Object.entries(i).forEach(([s, a]) => Ni(a, n.getContext(s), o)),
        o
}
function iR(e, t, n, r, o = {
    canDeactivateChecks: [],
    canActivateChecks: []
}) {
    let i = e.value
        , s = t ? t.value : null
        , a = n ? n.getContext(e.value.outlet) : null;
    if (s && i.routeConfig === s.routeConfig) {
        let c = sR(s, i, i.routeConfig.runGuardsAndResolvers);
        c ? o.canActivateChecks.push(new jc(r)) : (i.data = s.data,
            i._resolvedData = s._resolvedData),
            i.component ? Ti(e, t, a ? a.children : null, r, o) : Ti(e, t, n, r, o),
            c && a && a.outlet && a.outlet.isActivated && o.canDeactivateChecks.push(new so(a.outlet.component, s))
    } else
        s && Ni(t, a, o),
            o.canActivateChecks.push(new jc(r)),
            i.component ? Ti(e, null, a ? a.children : null, r, o) : Ti(e, null, n, r, o);
    return o
}
function sR(e, t, n) {
    if (typeof n == "function")
        return Ce(t._environmentInjector, () => n(e, t));
    switch (n) {
        case "pathParamsChange":
            return !ur(e.url, t.url);
        case "pathParamsOrQueryParamsChange":
            return !ur(e.url, t.url) || !Ht(e.queryParams, t.queryParams);
        case "always":
            return !0;
        case "paramsOrQueryParamsChange":
            return !uh(e, t) || !Ht(e.queryParams, t.queryParams);
        default:
            return !uh(e, t)
    }
}
function Ni(e, t, n) {
    let r = oo(e)
        , o = e.value;
    Object.entries(r).forEach(([i, s]) => {
        o.component ? t ? Ni(s, t.children.getContext(i), n) : Ni(s, null, n) : Ni(s, t, n)
    }
    ),
        o.component ? t && t.outlet && t.outlet.isActivated ? n.canDeactivateChecks.push(new so(t.outlet.component, o)) : n.canDeactivateChecks.push(new so(null, o)) : n.canDeactivateChecks.push(new so(null, o))
}
function ji(e) {
    return typeof e == "function"
}
function aR(e) {
    return typeof e == "boolean"
}
function cR(e) {
    return e && ji(e.canLoad)
}
function lR(e) {
    return e && ji(e.canActivate)
}
function uR(e) {
    return e && ji(e.canActivateChild)
}
function dR(e) {
    return e && ji(e.canDeactivate)
}
function fR(e) {
    return e && ji(e.canMatch)
}
function MI(e) {
    return e instanceof kn || e?.name === "EmptyError"
}
var vc = Symbol("INITIAL_VALUE");
function fo() {
    return zt(e => jl(e.map(t => t.pipe(Bt(1), Hl(vc)))).pipe(K(t => {
        for (let n of t)
            if (n !== !0) {
                if (n === vc)
                    return vc;
                if (n === !1 || hR(n))
                    return n
            }
        return !0
    }
    ), ze(t => t !== vc), Bt(1)))
}
function hR(e) {
    return Tn(e) || e instanceof uo
}
function NI(e) {
    return e.aborted ? L(void 0).pipe(Bt(1)) : new V(t => {
        let n = () => {
            t.next(),
                t.complete()
        }
            ;
        return e.addEventListener("abort", n),
            () => e.removeEventListener("abort", n)
    }
    )
}
function RI(e) {
    return So(NI(e))
}
function pR(e) {
    return Se(t => {
        let { targetSnapshot: n, currentSnapshot: r, guards: { canActivateChecks: o, canDeactivateChecks: i } } = t;
        return i.length === 0 && o.length === 0 ? L(P(m({}, t), {
            guardsResult: !0
        })) : gR(i, n, r).pipe(Se(s => s && aR(s) ? mR(n, o, e) : L(s)), K(s => P(m({}, t), {
            guardsResult: s
        })))
    }
    )
}
function gR(e, t, n) {
    return re(e).pipe(Se(r => DR(r.component, r.route, n, t)), $t(r => r !== !0, !0))
}
function mR(e, t, n) {
    return re(t).pipe(To(r => Mr(yR(r.route.parent, n), vR(r.route, n), IR(e, r.path), ER(e, r.route))), $t(r => r !== !0, !0))
}
function vR(e, t) {
    return e !== null && t && t(new xc(e)),
        L(!0)
}
function yR(e, t) {
    return e !== null && t && t(new Rc(e)),
        L(!0)
}
function ER(e, t) {
    let n = t.routeConfig ? t.routeConfig.canActivate : null;
    if (!n || n.length === 0)
        return L(!0);
    let r = n.map(o => _o(() => {
        let i = t._environmentInjector
            , s = po(o, i)
            , a = lR(s) ? s.canActivate(t, e) : Ce(i, () => s(t, e));
        return gr(a).pipe($t())
    }
    ));
    return L(r).pipe(fo())
}
function IR(e, t) {
    let n = t[t.length - 1]
        , o = t.slice(0, t.length - 1).reverse().map(i => oR(i)).filter(i => i !== null).map(i => _o(() => {
            let s = i.guards.map(a => {
                let c = i.node._environmentInjector
                    , l = po(a, c)
                    , u = uR(l) ? l.canActivateChild(n, e) : Ce(c, () => l(n, e));
                return gr(u).pipe($t())
            }
            );
            return L(s).pipe(fo())
        }
        ));
    return L(o).pipe(fo())
}
function DR(e, t, n, r) {
    let o = t && t.routeConfig ? t.routeConfig.canDeactivate : null;
    if (!o || o.length === 0)
        return L(!0);
    let i = o.map(s => {
        let a = t._environmentInjector
            , c = po(s, a)
            , l = dR(c) ? c.canDeactivate(e, t, n, r) : Ce(a, () => c(e, t, n, r));
        return gr(l).pipe($t())
    }
    );
    return L(i).pipe(fo())
}
function CR(e, t, n, r, o) {
    let i = t.canLoad;
    if (i === void 0 || i.length === 0)
        return L(!0);
    let s = i.map(a => {
        let c = po(a, e)
            , l = cR(c) ? c.canLoad(t, n) : Ce(e, () => c(t, n))
            , u = gr(l);
        return o ? u.pipe(RI(o)) : u
    }
    );
    return L(s).pipe(fo(), AI(r))
}
function AI(e) {
    return kl(_t(t => {
        if (typeof t != "boolean")
            throw Fc(e, t)
    }
    ), K(t => t === !0))
}
function bR(e, t, n, r, o) {
    let i = t.canMatch;
    if (!i || i.length === 0)
        return L(!0);
    let s = i.map(a => {
        let c = po(a, e)
            , l = fR(c) ? c.canMatch(t, n) : Ce(e, () => c(t, n));
        return gr(l).pipe(RI(o))
    }
    );
    return L(s).pipe(fo(), AI(r))
}
var nn = class e extends Error {
    segmentGroup;
    constructor(t) {
        super(),
            this.segmentGroup = t || null,
            Object.setPrototypeOf(this, e.prototype)
    }
}
    , Pi = class e extends Error {
        urlTree;
        constructor(t) {
            super(),
                this.urlTree = t,
                Object.setPrototypeOf(this, e.prototype)
        }
    }
    ;
function wR(e) {
    throw new y(4e3, !1)
}
function _R(e) {
    throw TI(!1, Re.GuardRejected)
}
var hh = class {
    urlSerializer;
    urlTree;
    constructor(t, n) {
        this.urlSerializer = t,
            this.urlTree = n
    }
    async lineralizeSegments(t, n) {
        let r = []
            , o = n.root;
        for (; ;) {
            if (r = r.concat(o.segments),
                o.numberOfChildren === 0)
                return r;
            if (o.numberOfChildren > 1 || !o.children[N])
                throw wR(`${t.redirectTo}`);
            o = o.children[N]
        }
    }
    async applyRedirectCommands(t, n, r, o, i) {
        let s = await TR(n, o, i);
        if (s instanceof et)
            throw new Pi(s);
        let a = this.applyRedirectCreateUrlTree(s, this.urlSerializer.parse(s), t, r);
        if (s[0] === "/")
            throw new Pi(a);
        return a
    }
    applyRedirectCreateUrlTree(t, n, r, o) {
        let i = this.createSegmentGroup(t, n.root, r, o);
        return new et(i, this.createQueryParams(n.queryParams, this.urlTree.queryParams), n.fragment)
    }
    createQueryParams(t, n) {
        let r = {};
        return Object.entries(t).forEach(([o, i]) => {
            if (typeof i == "string" && i[0] === ":") {
                let a = i.substring(1);
                r[o] = n[a]
            } else
                r[o] = i
        }
        ),
            r
    }
    createSegmentGroup(t, n, r, o) {
        let i = this.createSegments(t, n.segments, r, o)
            , s = {};
        return Object.entries(n.children).forEach(([a, c]) => {
            s[a] = this.createSegmentGroup(t, c, r, o)
        }
        ),
            new z(i, s)
    }
    createSegments(t, n, r, o) {
        return n.map(i => i.path[0] === ":" ? this.findPosParam(t, i, o) : this.findOrReturn(i, r))
    }
    findPosParam(t, n, r) {
        let o = r[n.path.substring(1)];
        if (!o)
            throw new y(4001, !1);
        return o
    }
    findOrReturn(t, n) {
        let r = 0;
        for (let o of n) {
            if (o.path === t.path)
                return n.splice(r),
                    o;
            r++
        }
        return t
    }
}
    ;
function TR(e, t, n) {
    if (typeof e == "string")
        return Promise.resolve(e);
    let r = e
        , { queryParams: o, fragment: i, routeConfig: s, url: a, outlet: c, params: l, data: u, title: d, paramMap: h, queryParamMap: f } = t;
    return Dc(gr(Ce(n, () => r({
        params: l,
        data: u,
        queryParams: o,
        fragment: i,
        routeConfig: s,
        url: a,
        outlet: c,
        title: d,
        paramMap: h,
        queryParamMap: f
    }))))
}
function SR(e, t) {
    return e.providers && !e._injector && (e._injector = Jr(e.providers, t, `Route: ${e.path}`)),
        e._injector ?? t
}
function wt(e) {
    return e.outlet || N
}
function MR(e, t) {
    let n = e.filter(r => wt(r) === t);
    return n.push(...e.filter(r => wt(r) !== t)),
        n
}
var ph = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {}
};
function NR(e, t, n, r, o, i) {
    let s = xI(e, t, n);
    return s.matched ? (r = SR(t, r),
        bR(r, t, n, o, i).pipe(K(a => a === !0 ? s : m({}, ph)))) : L(s)
}
function xI(e, t, n) {
    if (t.path === "")
        return t.pathMatch === "full" && (e.hasChildren() || n.length > 0) ? m({}, ph) : {
            matched: !0,
            consumedSegments: [],
            remainingSegments: n,
            parameters: {},
            positionalParamSegments: {}
        };
    let o = (t.matcher || oI)(n, e, t);
    if (!o)
        return m({}, ph);
    let i = {};
    Object.entries(o.posParams ?? {}).forEach(([a, c]) => {
        i[a] = c.path
    }
    );
    let s = o.consumed.length > 0 ? m(m({}, i), o.consumed[o.consumed.length - 1].parameters) : i;
    return {
        matched: !0,
        consumedSegments: o.consumed,
        remainingSegments: n.slice(o.consumed.length),
        parameters: s,
        positionalParamSegments: o.posParams ?? {}
    }
}
function eI(e, t, n, r) {
    return n.length > 0 && xR(e, n, r) ? {
        segmentGroup: new z(t, AR(r, new z(n, e.children))),
        slicedSegments: []
    } : n.length === 0 && OR(e, n, r) ? {
        segmentGroup: new z(e.segments, RR(e, n, r, e.children)),
        slicedSegments: n
    } : {
        segmentGroup: new z(e.segments, e.children),
        slicedSegments: n
    }
}
function RR(e, t, n, r) {
    let o = {};
    for (let i of n)
        if (Hc(e, t, i) && !r[wt(i)]) {
            let s = new z([], {});
            o[wt(i)] = s
        }
    return m(m({}, r), o)
}
function AR(e, t) {
    let n = {};
    n[N] = t;
    for (let r of e)
        if (r.path === "" && wt(r) !== N) {
            let o = new z([], {});
            n[wt(r)] = o
        }
    return n
}
function xR(e, t, n) {
    return n.some(r => Hc(e, t, r) && wt(r) !== N)
}
function OR(e, t, n) {
    return n.some(r => Hc(e, t, r))
}
function Hc(e, t, n) {
    return (e.hasChildren() || t.length > 0) && n.pathMatch === "full" ? !1 : n.path === ""
}
function kR(e, t, n) {
    return t.length === 0 && !e.children[n]
}
var gh = class {
}
    ;
async function PR(e, t, n, r, o, i, s = "emptyOnly", a) {
    return new mh(e, t, n, r, o, s, i, a).recognize()
}
var LR = 31
    , mh = class {
        injector;
        configLoader;
        rootComponentType;
        config;
        urlTree;
        paramsInheritanceStrategy;
        urlSerializer;
        abortSignal;
        applyRedirects;
        absoluteRedirectCount = 0;
        allowRedirects = !0;
        constructor(t, n, r, o, i, s, a, c) {
            this.injector = t,
                this.configLoader = n,
                this.rootComponentType = r,
                this.config = o,
                this.urlTree = i,
                this.paramsInheritanceStrategy = s,
                this.urlSerializer = a,
                this.abortSignal = c,
                this.applyRedirects = new hh(this.urlSerializer, this.urlTree)
        }
        noMatchError(t) {
            return new y(4002, `'${t.segmentGroup}'`)
        }
        async recognize() {
            let t = eI(this.urlTree.root, [], [], this.config).segmentGroup
                , { children: n, rootSnapshot: r } = await this.match(t)
                , o = new Xe(r, n)
                , i = new Oi("", o)
                , s = gI(r, [], this.urlTree.queryParams, this.urlTree.fragment);
            return s.queryParams = this.urlTree.queryParams,
                i.url = this.urlSerializer.serialize(s),
            {
                state: i,
                tree: s
            }
        }
        async match(t) {
            let n = new dr([], Object.freeze({}), Object.freeze(m({}, this.urlTree.queryParams)), this.urlTree.fragment, Object.freeze({}), N, this.rootComponentType, null, {}, this.injector);
            try {
                return {
                    children: await this.processSegmentGroup(this.injector, this.config, t, N, n),
                    rootSnapshot: n
                }
            } catch (r) {
                if (r instanceof Pi)
                    return this.urlTree = r.urlTree,
                        this.match(r.urlTree.root);
                throw r instanceof nn ? this.noMatchError(r) : r
            }
        }
        async processSegmentGroup(t, n, r, o, i) {
            if (r.segments.length === 0 && r.hasChildren())
                return this.processChildren(t, n, r, i);
            let s = await this.processSegment(t, n, r, r.segments, o, !0, i);
            return s instanceof Xe ? [s] : []
        }
        async processChildren(t, n, r, o) {
            let i = [];
            for (let c of Object.keys(r.children))
                c === "primary" ? i.unshift(c) : i.push(c);
            let s = [];
            for (let c of i) {
                let l = r.children[c]
                    , u = MR(n, c)
                    , d = await this.processSegmentGroup(t, u, l, c, o);
                s.push(...d)
            }
            let a = OI(s);
            return FR(a),
                a
        }
        async processSegment(t, n, r, o, i, s, a) {
            for (let c of n)
                try {
                    return await this.processSegmentAgainstRoute(c._injector ?? t, n, c, r, o, i, s, a)
                } catch (l) {
                    if (l instanceof nn || MI(l))
                        continue;
                    throw l
                }
            if (kR(r, o, i))
                return new gh;
            throw new nn(r)
        }
        async processSegmentAgainstRoute(t, n, r, o, i, s, a, c) {
            if (wt(r) !== s && (s === N || !Hc(o, i, r)))
                throw new nn(o);
            if (r.redirectTo === void 0)
                return this.matchSegmentAgainstRoute(t, o, r, i, s, c);
            if (this.allowRedirects && a)
                return this.expandSegmentAgainstRouteUsingRedirect(t, o, n, r, i, s, c);
            throw new nn(o)
        }
        async expandSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s, a) {
            let { matched: c, parameters: l, consumedSegments: u, positionalParamSegments: d, remainingSegments: h } = xI(n, o, i);
            if (!c)
                throw new nn(n);
            typeof o.redirectTo == "string" && o.redirectTo[0] === "/" && (this.absoluteRedirectCount++,
                this.absoluteRedirectCount > LR && (this.allowRedirects = !1));
            let f = new dr(i, l, Object.freeze(m({}, this.urlTree.queryParams)), this.urlTree.fragment, tI(o), wt(o), o.component ?? o._loadedComponent ?? null, o, nI(o), t)
                , g = Lc(f, a, this.paramsInheritanceStrategy);
            if (f.params = Object.freeze(g.params),
                f.data = Object.freeze(g.data),
                this.abortSignal.aborted)
                throw new Error(this.abortSignal.reason);
            let E = await this.applyRedirects.applyRedirectCommands(u, o.redirectTo, d, f, t)
                , M = await this.applyRedirects.lineralizeSegments(o, E);
            return this.processSegment(t, r, n, M.concat(h), s, !1, a)
        }
        async matchSegmentAgainstRoute(t, n, r, o, i, s) {
            if (this.abortSignal.aborted)
                throw new Error(this.abortSignal.reason);
            let a = await Dc(NR(n, r, o, t, this.urlSerializer, this.abortSignal));
            if (r.path === "**" && (n.children = {}),
                !a?.matched)
                throw new nn(n);
            t = r._injector ?? t;
            let { routes: c } = await this.getChildConfig(t, r, o)
                , l = r._loadedInjector ?? t
                , { parameters: u, consumedSegments: d, remainingSegments: h } = a
                , f = new dr(d, u, Object.freeze(m({}, this.urlTree.queryParams)), this.urlTree.fragment, tI(r), wt(r), r.component ?? r._loadedComponent ?? null, r, nI(r), t)
                , g = Lc(f, s, this.paramsInheritanceStrategy);
            f.params = Object.freeze(g.params),
                f.data = Object.freeze(g.data);
            let { segmentGroup: E, slicedSegments: M } = eI(n, d, h, c);
            if (M.length === 0 && E.hasChildren()) {
                let Nn = await this.processChildren(l, c, E, f);
                return new Xe(f, Nn)
            }
            if (c.length === 0 && M.length === 0)
                return new Xe(f, []);
            let x = wt(r) === i
                , $e = await this.processSegment(l, c, E, M, x ? N : i, !0, f);
            return new Xe(f, $e instanceof Xe ? [$e] : [])
        }
        async getChildConfig(t, n, r) {
            if (n.children)
                return {
                    routes: n.children,
                    injector: t
                };
            if (n.loadChildren) {
                if (n._loadedRoutes !== void 0) {
                    let i = n._loadedNgModuleFactory;
                    return i && !n._loadedInjector && (n._loadedInjector = i.create(t).injector),
                    {
                        routes: n._loadedRoutes,
                        injector: n._loadedInjector
                    }
                }
                if (this.abortSignal.aborted)
                    throw new Error(this.abortSignal.reason);
                if (await Dc(CR(t, n, r, this.urlSerializer, this.abortSignal))) {
                    let i = await this.configLoader.loadChildren(t, n);
                    return n._loadedRoutes = i.routes,
                        n._loadedInjector = i.injector,
                        n._loadedNgModuleFactory = i.factory,
                        i
                }
                throw _R(n)
            }
            return {
                routes: [],
                injector: t
            }
        }
    }
    ;
function FR(e) {
    e.sort((t, n) => t.value.outlet === N ? -1 : n.value.outlet === N ? 1 : t.value.outlet.localeCompare(n.value.outlet))
}
function jR(e) {
    let t = e.value.routeConfig;
    return t && t.path === ""
}
function OI(e) {
    let t = []
        , n = new Set;
    for (let r of e) {
        if (!jR(r)) {
            t.push(r);
            continue
        }
        let o = t.find(i => r.value.routeConfig === i.value.routeConfig);
        o !== void 0 ? (o.children.push(...r.children),
            n.add(o)) : t.push(r)
    }
    for (let r of n) {
        let o = OI(r.children);
        t.push(new Xe(r.value, o))
    }
    return t.filter(r => !n.has(r))
}
function tI(e) {
    return e.data || {}
}
function nI(e) {
    return e.resolve || {}
}
function VR(e, t, n, r, o, i, s) {
    return Se(async a => {
        let { state: c, tree: l } = await PR(e, t, n, r, a.extractedUrl, o, i, s);
        return P(m({}, a), {
            targetSnapshot: c,
            urlAfterRedirects: l
        })
    }
    )
}
function UR(e) {
    return Se(t => {
        let { targetSnapshot: n, guards: { canActivateChecks: r } } = t;
        if (!r.length)
            return L(t);
        let o = new Set(r.map(a => a.route))
            , i = new Set;
        for (let a of o)
            if (!i.has(a))
                for (let c of kI(a))
                    i.add(c);
        let s = 0;
        return re(i).pipe(To(a => o.has(a) ? HR(a, n, e) : (a.data = Lc(a, a.parent, e).resolve,
            L(void 0))), _t(() => s++), ys(1), Se(a => s === i.size ? L(t) : Ie))
    }
    )
}
function kI(e) {
    let t = e.children.map(n => kI(n)).flat();
    return [e, ...t]
}
function HR(e, t, n) {
    let r = e.routeConfig
        , o = e._resolve;
    return r?.title !== void 0 && !bI(r) && (o[Li] = r.title),
        _o(() => (e.data = Lc(e, e.parent, n).resolve,
            BR(o, e, t).pipe(K(i => (e._resolvedData = i,
                e.data = m(m({}, e.data), i),
                null)))))
}
function BR(e, t, n) {
    let r = rh(e);
    if (r.length === 0)
        return L({});
    let o = {};
    return re(r).pipe(Se(i => $R(e[i], t, n).pipe($t(), _t(s => {
        if (s instanceof uo)
            throw Fc(new _n, s);
        o[i] = s
    }
    ))), ys(1), K(() => o), Nr(i => MI(i) ? Ie : Fl(i)))
}
function $R(e, t, n) {
    let r = t._environmentInjector
        , o = po(e, r)
        , i = o.resolve ? o.resolve(t, n) : Ce(r, () => o(t, n));
    return gr(i)
}
function rI(e) {
    return zt(t => {
        let n = e(t);
        return n ? re(n).pipe(K(() => t)) : L(t)
    }
    )
}
var Dh = (() => {
    class e {
        buildTitle(n) {
            let r, o = n.root;
            for (; o !== void 0;)
                r = this.getResolvedTitleForRoute(o) ?? r,
                    o = o.children.find(i => i.outlet === N);
            return r
        }
        getResolvedTitleForRoute(n) {
            return n.data[Li]
        }
        static \u0275fac = function (r) {
            return new (r || e)
        }
            ;
        static \u0275prov = w({
            token: e,
            factory: () => p(PI),
            providedIn: "root"
        })
    }
    return e
}
)()
    , PI = (() => {
        class e extends Dh {
            title;
            constructor(n) {
                super(),
                    this.title = n
            }
            updateTitle(n) {
                let r = this.buildTitle(n);
                r !== void 0 && this.title.setTitle(r)
            }
            static \u0275fac = function (r) {
                return new (r || e)(k(WE))
            }
                ;
            static \u0275prov = w({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    }
    )()
    , go = new v("", {
        factory: () => ({})
    })
    , Vi = new v("")
    , LI = (() => {
        class e {
            componentLoaders = new WeakMap;
            childrenLoaders = new WeakMap;
            onLoadStartListener;
            onLoadEndListener;
            compiler = p(Tf);
            async loadComponent(n, r) {
                if (this.componentLoaders.get(r))
                    return this.componentLoaders.get(r);
                if (r._loadedComponent)
                    return Promise.resolve(r._loadedComponent);
                this.onLoadStartListener && this.onLoadStartListener(r);
                let o = (async () => {
                    try {
                        let i = await sI(Ce(n, () => r.loadComponent()))
                            , s = await VI(jI(i));
                        return this.onLoadEndListener && this.onLoadEndListener(r),
                            r._loadedComponent = s,
                            s
                    } finally {
                        this.componentLoaders.delete(r)
                    }
                }
                )();
                return this.componentLoaders.set(r, o),
                    o
            }
            loadChildren(n, r) {
                if (this.childrenLoaders.get(r))
                    return this.childrenLoaders.get(r);
                if (r._loadedRoutes)
                    return Promise.resolve({
                        routes: r._loadedRoutes,
                        injector: r._loadedInjector
                    });
                this.onLoadStartListener && this.onLoadStartListener(r);
                let o = (async () => {
                    try {
                        let i = await FI(r, this.compiler, n, this.onLoadEndListener);
                        return r._loadedRoutes = i.routes,
                            r._loadedInjector = i.injector,
                            r._loadedNgModuleFactory = i.factory,
                            i
                    } finally {
                        this.childrenLoaders.delete(r)
                    }
                }
                )();
                return this.childrenLoaders.set(r, o),
                    o
            }
            static \u0275fac = function (r) {
                return new (r || e)
            }
                ;
            static \u0275prov = w({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    }
    )();
async function FI(e, t, n, r) {
    let o = await sI(Ce(n, () => e.loadChildren())), i = await VI(jI(o)), s;
    i instanceof za || Array.isArray(i) ? s = i : s = await t.compileModuleAsync(i),
        r && r(e);
    let a, c, l = !1, u;
    return Array.isArray(s) ? (c = s,
        l = !0) : (a = s.create(n).injector,
            u = s,
            c = a.get(Vi, [], {
                optional: !0,
                self: !0
            }).flat()),
    {
        routes: c.map(Ih),
        injector: a,
        factory: u
    }
}
function zR(e) {
    return e && typeof e == "object" && "default" in e
}
function jI(e) {
    return zR(e) ? e.default : e
}
async function VI(e) {
    return e
}
var Bc = (() => {
    class e {
        static \u0275fac = function (r) {
            return new (r || e)
        }
            ;
        static \u0275prov = w({
            token: e,
            factory: () => p(GR),
            providedIn: "root"
        })
    }
    return e
}
)()
    , GR = (() => {
        class e {
            shouldProcessUrl(n) {
                return !0
            }
            extract(n) {
                return n
            }
            merge(n, r) {
                return n
            }
            static \u0275fac = function (r) {
                return new (r || e)
            }
                ;
            static \u0275prov = w({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    }
    )()
    , UI = new v("");
var qR = () => { }
    , HI = new v("")
    , BI = (() => {
        class e {
            currentNavigation = $(null, {
                equal: () => !1
            });
            currentTransition = null;
            lastSuccessfulNavigation = $(null);
            events = new ce;
            transitionAbortWithErrorSubject = new ce;
            configLoader = p(LI);
            environmentInjector = p(te);
            destroyRef = p(Ve);
            urlSerializer = p(Fi);
            rootContexts = p(ho);
            location = p(ro);
            inputBindingEnabled = p(Uc, {
                optional: !0
            }) !== null;
            titleStrategy = p(Dh);
            options = p(go, {
                optional: !0
            }) || {};
            paramsInheritanceStrategy = this.options.paramsInheritanceStrategy || "emptyOnly";
            urlHandlingStrategy = p(Bc);
            createViewTransition = p(UI, {
                optional: !0
            });
            navigationErrorHandler = p(HI, {
                optional: !0
            });
            navigationId = 0;
            get hasRequestedNavigation() {
                return this.navigationId !== 0
            }
            transitions;
            afterPreactivation = () => L(void 0);
            rootComponentType = null;
            destroyed = !1;
            constructor() {
                let n = o => this.events.next(new Mc(o))
                    , r = o => this.events.next(new Nc(o));
                this.configLoader.onLoadEndListener = r,
                    this.configLoader.onLoadStartListener = n,
                    this.destroyRef.onDestroy(() => {
                        this.destroyed = !0
                    }
                    )
            }
            complete() {
                this.transitions?.complete()
            }
            handleNavigationRequest(n) {
                let r = ++this.navigationId;
                de(() => {
                    this.transitions?.next(P(m({}, n), {
                        extractedUrl: this.urlHandlingStrategy.extract(n.rawUrl),
                        targetSnapshot: null,
                        targetRouterState: null,
                        guards: {
                            canActivateChecks: [],
                            canDeactivateChecks: []
                        },
                        guardsResult: null,
                        id: r
                    }))
                }
                )
            }
            setupNavigations(n) {
                return this.transitions = new Ee(null),
                    this.transitions.pipe(ze(r => r !== null), zt(r => {
                        let o = !1
                            , i = new AbortController
                            , s = () => !o && this.currentTransition?.id === r.id;
                        return L(r).pipe(zt(a => {
                            if (this.navigationId > r.id)
                                return this.cancelNavigationTransition(r, "", Re.SupersededByNewNavigation),
                                    Ie;
                            this.currentTransition = r;
                            let c = this.lastSuccessfulNavigation();
                            this.currentNavigation.set({
                                id: a.id,
                                initialUrl: a.rawUrl,
                                extractedUrl: a.extractedUrl,
                                targetBrowserUrl: typeof a.extras.browserUrl == "string" ? this.urlSerializer.parse(a.extras.browserUrl) : a.extras.browserUrl,
                                trigger: a.source,
                                extras: a.extras,
                                previousNavigation: c ? P(m({}, c), {
                                    previousNavigation: null
                                }) : null,
                                abort: () => i.abort()
                            });
                            let l = !n.navigated || this.isUpdatingInternalState() || this.isUpdatedBrowserUrl()
                                , u = a.extras.onSameUrlNavigation ?? n.onSameUrlNavigation;
                            if (!l && u !== "reload")
                                return this.events.next(new rn(a.id, this.urlSerializer.serialize(a.rawUrl), "", Ai.IgnoredSameUrlNavigation)),
                                    a.resolve(!1),
                                    Ie;
                            if (this.urlHandlingStrategy.shouldProcessUrl(a.rawUrl))
                                return L(a).pipe(zt(d => (this.events.next(new hr(d.id, this.urlSerializer.serialize(d.extractedUrl), d.source, d.restoredState)),
                                    d.id !== this.navigationId ? Ie : Promise.resolve(d))), VR(this.environmentInjector, this.configLoader, this.rootComponentType, n.config, this.urlSerializer, this.paramsInheritanceStrategy, i.signal), _t(d => {
                                        r.targetSnapshot = d.targetSnapshot,
                                            r.urlAfterRedirects = d.urlAfterRedirects,
                                            this.currentNavigation.update(f => (f.finalUrl = d.urlAfterRedirects,
                                                f));
                                        let h = new ao(d.id, this.urlSerializer.serialize(d.extractedUrl), this.urlSerializer.serialize(d.urlAfterRedirects), d.targetSnapshot);
                                        this.events.next(h)
                                    }
                                    ));
                            if (l && this.urlHandlingStrategy.shouldProcessUrl(a.currentRawUrl)) {
                                let { id: d, extractedUrl: h, source: f, restoredState: g, extras: E } = a
                                    , M = new hr(d, this.urlSerializer.serialize(h), f, g);
                                this.events.next(M);
                                let x = DI(this.rootComponentType, this.environmentInjector).snapshot;
                                return this.currentTransition = r = P(m({}, a), {
                                    targetSnapshot: x,
                                    urlAfterRedirects: h,
                                    extras: P(m({}, E), {
                                        skipLocationChange: !1,
                                        replaceUrl: !1
                                    })
                                }),
                                    this.currentNavigation.update($e => ($e.finalUrl = h,
                                        $e)),
                                    L(r)
                            } else
                                return this.events.next(new rn(a.id, this.urlSerializer.serialize(a.extractedUrl), "", Ai.IgnoredByUrlHandlingStrategy)),
                                    a.resolve(!1),
                                    Ie
                        }
                        ), K(a => {
                            let c = new wc(a.id, this.urlSerializer.serialize(a.extractedUrl), this.urlSerializer.serialize(a.urlAfterRedirects), a.targetSnapshot);
                            return this.events.next(c),
                                this.currentTransition = r = P(m({}, a), {
                                    guards: rR(a.targetSnapshot, a.currentSnapshot, this.rootContexts)
                                }),
                                r
                        }
                        ), pR(a => this.events.next(a)), zt(a => {
                            if (r.guardsResult = a.guardsResult,
                                a.guardsResult && typeof a.guardsResult != "boolean")
                                throw Fc(this.urlSerializer, a.guardsResult);
                            let c = new _c(a.id, this.urlSerializer.serialize(a.extractedUrl), this.urlSerializer.serialize(a.urlAfterRedirects), a.targetSnapshot, !!a.guardsResult);
                            if (this.events.next(c),
                                !s())
                                return Ie;
                            if (!a.guardsResult)
                                return this.cancelNavigationTransition(a, "", Re.GuardRejected),
                                    Ie;
                            if (a.guards.canActivateChecks.length === 0)
                                return L(a);
                            let l = new Tc(a.id, this.urlSerializer.serialize(a.extractedUrl), this.urlSerializer.serialize(a.urlAfterRedirects), a.targetSnapshot);
                            if (this.events.next(l),
                                !s())
                                return Ie;
                            let u = !1;
                            return L(a).pipe(UR(this.paramsInheritanceStrategy), _t({
                                next: () => {
                                    u = !0;
                                    let d = new Sc(a.id, this.urlSerializer.serialize(a.extractedUrl), this.urlSerializer.serialize(a.urlAfterRedirects), a.targetSnapshot);
                                    this.events.next(d)
                                }
                                ,
                                complete: () => {
                                    u || this.cancelNavigationTransition(a, "", Re.NoDataFromResolver)
                                }
                            }))
                        }
                        ), rI(a => {
                            let c = u => {
                                let d = [];
                                if (u.routeConfig?._loadedComponent)
                                    u.component = u.routeConfig?._loadedComponent;
                                else if (u.routeConfig?.loadComponent) {
                                    let h = u._environmentInjector;
                                    d.push(this.configLoader.loadComponent(h, u.routeConfig).then(f => {
                                        u.component = f
                                    }
                                    ))
                                }
                                for (let h of u.children)
                                    d.push(...c(h));
                                return d
                            }
                                , l = c(a.targetSnapshot.root);
                            return l.length === 0 ? L(a) : re(Promise.all(l).then(() => a))
                        }
                        ), rI(() => this.afterPreactivation()), zt(() => {
                            let { currentSnapshot: a, targetSnapshot: c } = r
                                , l = this.createViewTransition?.(this.environmentInjector, a.root, c.root);
                            return l ? re(l).pipe(K(() => r)) : L(r)
                        }
                        ), Bt(1), K(a => {
                            let c = XN(n.routeReuseStrategy, a.targetSnapshot, a.currentRouterState);
                            this.currentTransition = r = a = P(m({}, a), {
                                targetRouterState: c
                            }),
                                this.currentNavigation.update(l => (l.targetRouterState = c,
                                    l)),
                                this.events.next(new co),
                                s() && (new fh(n.routeReuseStrategy, r.targetRouterState, r.currentRouterState, l => this.events.next(l), this.inputBindingEnabled).activate(this.rootContexts),
                                    s() && (o = !0,
                                        this.currentNavigation.update(l => (l.abort = qR,
                                            l)),
                                        this.lastSuccessfulNavigation.set(de(this.currentNavigation)),
                                        this.events.next(new nt(a.id, this.urlSerializer.serialize(a.extractedUrl), this.urlSerializer.serialize(a.urlAfterRedirects))),
                                        this.titleStrategy?.updateTitle(a.targetRouterState.snapshot),
                                        a.resolve(!0)))
                        }
                        ), So(NI(i.signal).pipe(ze(() => !o && !r.targetRouterState), _t(() => {
                            this.cancelNavigationTransition(r, i.signal.reason + "", Re.Aborted)
                        }
                        ))), _t({
                            complete: () => {
                                o = !0
                            }
                        }), So(this.transitionAbortWithErrorSubject.pipe(_t(a => {
                            throw a
                        }
                        ))), Ul(() => {
                            i.abort(),
                                o || this.cancelNavigationTransition(r, "", Re.SupersededByNewNavigation),
                                this.currentTransition?.id === r.id && (this.currentNavigation.set(null),
                                    this.currentTransition = null)
                        }
                        ), Nr(a => {
                            if (o = !0,
                                this.destroyed)
                                return r.resolve(!1),
                                    Ie;
                            if (SI(a))
                                this.events.next(new ht(r.id, this.urlSerializer.serialize(r.extractedUrl), a.message, a.cancellationCode)),
                                    nR(a) ? this.events.next(new lo(a.url, a.navigationBehaviorOptions)) : r.resolve(!1);
                            else {
                                let c = new pr(r.id, this.urlSerializer.serialize(r.extractedUrl), a, r.targetSnapshot ?? void 0);
                                try {
                                    let l = Ce(this.environmentInjector, () => this.navigationErrorHandler?.(c));
                                    if (l instanceof uo) {
                                        let { message: u, cancellationCode: d } = Fc(this.urlSerializer, l);
                                        this.events.next(new ht(r.id, this.urlSerializer.serialize(r.extractedUrl), u, d)),
                                            this.events.next(new lo(l.redirectTo, l.navigationBehaviorOptions))
                                    } else
                                        throw this.events.next(c),
                                        a
                                } catch (l) {
                                    this.options.resolveNavigationPromiseOnError ? r.resolve(!1) : r.reject(l)
                                }
                            }
                            return Ie
                        }
                        ))
                    }
                    ))
            }
            cancelNavigationTransition(n, r, o) {
                let i = new ht(n.id, this.urlSerializer.serialize(n.extractedUrl), r, o);
                this.events.next(i),
                    n.resolve(!1)
            }
            isUpdatingInternalState() {
                return this.currentTransition?.extractedUrl.toString() !== this.currentTransition?.currentUrlTree.toString()
            }
            isUpdatedBrowserUrl() {
                let n = this.urlHandlingStrategy.extract(this.urlSerializer.parse(this.location.path(!0)))
                    , r = de(this.currentNavigation)
                    , o = r?.targetBrowserUrl ?? r?.extractedUrl;
                return n.toString() !== o?.toString() && !r?.extras.skipLocationChange
            }
            static \u0275fac = function (r) {
                return new (r || e)
            }
                ;
            static \u0275prov = w({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    }
    )();
function WR(e) {
    return e !== Mi
}
var $I = new v("");
var zI = (() => {
    class e {
        static \u0275fac = function (r) {
            return new (r || e)
        }
            ;
        static \u0275prov = w({
            token: e,
            factory: () => p(QR),
            providedIn: "root"
        })
    }
    return e
}
)()
    , Vc = class {
        shouldDetach(t) {
            return !1
        }
        store(t, n) { }
        shouldAttach(t) {
            return !1
        }
        retrieve(t) {
            return null
        }
        shouldReuseRoute(t, n) {
            return t.routeConfig === n.routeConfig
        }
        shouldDestroyInjector(t) {
            return !0
        }
    }
    , QR = (() => {
        class e extends Vc {
            static \u0275fac = (() => {
                let n;
                return function (o) {
                    return (n || (n = rr(e)))(o || e)
                }
            }
            )();
            static \u0275prov = w({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    }
    )()
    , Ch = (() => {
        class e {
            urlSerializer = p(Fi);
            options = p(go, {
                optional: !0
            }) || {};
            canceledNavigationResolution = this.options.canceledNavigationResolution || "replace";
            location = p(ro);
            urlHandlingStrategy = p(Bc);
            urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
            currentUrlTree = new et;
            getCurrentUrlTree() {
                return this.currentUrlTree
            }
            rawUrlTree = this.currentUrlTree;
            getRawUrlTree() {
                return this.rawUrlTree
            }
            createBrowserPath({ finalUrl: n, initialUrl: r, targetBrowserUrl: o }) {
                let i = n !== void 0 ? this.urlHandlingStrategy.merge(n, r) : r
                    , s = o ?? i;
                return s instanceof et ? this.urlSerializer.serialize(s) : s
            }
            commitTransition({ targetRouterState: n, finalUrl: r, initialUrl: o }) {
                r && n ? (this.currentUrlTree = r,
                    this.rawUrlTree = this.urlHandlingStrategy.merge(r, o),
                    this.routerState = n) : this.rawUrlTree = o
            }
            routerState = DI(null, p(te));
            getRouterState() {
                return this.routerState
            }
            _stateMemento = this.createStateMemento();
            get stateMemento() {
                return this._stateMemento
            }
            updateStateMemento() {
                this._stateMemento = this.createStateMemento()
            }
            createStateMemento() {
                return {
                    rawUrlTree: this.rawUrlTree,
                    currentUrlTree: this.currentUrlTree,
                    routerState: this.routerState
                }
            }
            restoredState() {
                return this.location.getState()
            }
            static \u0275fac = function (r) {
                return new (r || e)
            }
                ;
            static \u0275prov = w({
                token: e,
                factory: () => p(ZR),
                providedIn: "root"
            })
        }
        return e
    }
    )()
    , ZR = (() => {
        class e extends Ch {
            currentPageId = 0;
            lastSuccessfulId = -1;
            get browserPageId() {
                return this.canceledNavigationResolution !== "computed" ? this.currentPageId : this.restoredState()?.\u0275routerPageId ?? this.currentPageId
            }
            registerNonRouterCurrentEntryChangeListener(n) {
                return this.location.subscribe(r => {
                    r.type === "popstate" && setTimeout(() => {
                        n(r.url, r.state, "popstate")
                    }
                    )
                }
                )
            }
            handleRouterEvent(n, r) {
                n instanceof hr ? this.updateStateMemento() : n instanceof rn ? this.commitTransition(r) : n instanceof ao ? this.urlUpdateStrategy === "eager" && (r.extras.skipLocationChange || this.setBrowserUrl(this.createBrowserPath(r), r)) : n instanceof co ? (this.commitTransition(r),
                    this.urlUpdateStrategy === "deferred" && !r.extras.skipLocationChange && this.setBrowserUrl(this.createBrowserPath(r), r)) : n instanceof ht && !II(n) ? this.restoreHistory(r) : n instanceof pr ? this.restoreHistory(r, !0) : n instanceof nt && (this.lastSuccessfulId = n.id,
                        this.currentPageId = this.browserPageId)
            }
            setBrowserUrl(n, { extras: r, id: o }) {
                let { replaceUrl: i, state: s } = r;
                if (this.location.isCurrentPathEqualTo(n) || i) {
                    let a = this.browserPageId
                        , c = m(m({}, s), this.generateNgRouterState(o, a));
                    this.location.replaceState(n, "", c)
                } else {
                    let a = m(m({}, s), this.generateNgRouterState(o, this.browserPageId + 1));
                    this.location.go(n, "", a)
                }
            }
            restoreHistory(n, r = !1) {
                if (this.canceledNavigationResolution === "computed") {
                    let o = this.browserPageId
                        , i = this.currentPageId - o;
                    i !== 0 ? this.location.historyGo(i) : this.getCurrentUrlTree() === n.finalUrl && i === 0 && (this.resetInternalState(n),
                        this.resetUrlToCurrentUrlTree())
                } else
                    this.canceledNavigationResolution === "replace" && (r && this.resetInternalState(n),
                        this.resetUrlToCurrentUrlTree())
            }
            resetInternalState({ finalUrl: n }) {
                this.routerState = this.stateMemento.routerState,
                    this.currentUrlTree = this.stateMemento.currentUrlTree,
                    this.rawUrlTree = this.urlHandlingStrategy.merge(this.currentUrlTree, n ?? this.rawUrlTree)
            }
            resetUrlToCurrentUrlTree() {
                this.location.replaceState(this.urlSerializer.serialize(this.getRawUrlTree()), "", this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId))
            }
            generateNgRouterState(n, r) {
                return this.canceledNavigationResolution === "computed" ? {
                    navigationId: n,
                    \u0275routerPageId: r
                } : {
                    navigationId: n
                }
            }
            static \u0275fac = (() => {
                let n;
                return function (o) {
                    return (n || (n = rr(e)))(o || e)
                }
            }
            )();
            static \u0275prov = w({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    }
    )();
function bh(e, t) {
    e.events.pipe(ze(n => n instanceof nt || n instanceof ht || n instanceof pr || n instanceof rn), K(n => n instanceof nt || n instanceof rn ? 0 : (n instanceof ht ? n.code === Re.Redirect || n.code === Re.SupersededByNewNavigation : !1) ? 2 : 1), ze(n => n !== 2), Bt(1)).subscribe(() => {
        t()
    }
    )
}
var wh = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact"
}
    , _h = {
        paths: "subset",
        fragment: "ignored",
        matrixParams: "ignored",
        queryParams: "subset"
    }
    , Be = (() => {
        class e {
            get currentUrlTree() {
                return this.stateManager.getCurrentUrlTree()
            }
            get rawUrlTree() {
                return this.stateManager.getRawUrlTree()
            }
            disposed = !1;
            nonRouterCurrentEntryChangeSubscription;
            console = p(Ga);
            stateManager = p(Ch);
            options = p(go, {
                optional: !0
            }) || {};
            pendingTasks = p(Pt);
            urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
            navigationTransitions = p(BI);
            urlSerializer = p(Fi);
            location = p(ro);
            urlHandlingStrategy = p(Bc);
            injector = p(te);
            _events = new ce;
            get events() {
                return this._events
            }
            get routerState() {
                return this.stateManager.getRouterState()
            }
            navigated = !1;
            routeReuseStrategy = p(zI);
            injectorCleanup = p($I, {
                optional: !0
            });
            onSameUrlNavigation = this.options.onSameUrlNavigation || "ignore";
            config = p(Vi, {
                optional: !0
            })?.flat() ?? [];
            componentInputBindingEnabled = !!p(Uc, {
                optional: !0
            });
            currentNavigation = this.navigationTransitions.currentNavigation.asReadonly();
            constructor() {
                this.resetConfig(this.config),
                    this.navigationTransitions.setupNavigations(this).subscribe({
                        error: n => { }
                    }),
                    this.subscribeToNavigationEvents()
            }
            eventsSubscription = new ye;
            subscribeToNavigationEvents() {
                let n = this.navigationTransitions.events.subscribe(r => {
                    try {
                        let o = this.navigationTransitions.currentTransition
                            , i = de(this.navigationTransitions.currentNavigation);
                        if (o !== null && i !== null) {
                            if (this.stateManager.handleRouterEvent(r, i),
                                r instanceof ht && r.code !== Re.Redirect && r.code !== Re.SupersededByNewNavigation)
                                this.navigated = !0;
                            else if (r instanceof nt)
                                this.navigated = !0,
                                    this.injectorCleanup?.(this.routeReuseStrategy, this.routerState, this.config);
                            else if (r instanceof lo) {
                                let s = r.navigationBehaviorOptions
                                    , a = this.urlHandlingStrategy.merge(r.url, o.currentRawUrl)
                                    , c = m({
                                        scroll: o.extras.scroll,
                                        browserUrl: o.extras.browserUrl,
                                        info: o.extras.info,
                                        skipLocationChange: o.extras.skipLocationChange,
                                        replaceUrl: o.extras.replaceUrl || this.urlUpdateStrategy === "eager" || WR(o.source)
                                    }, s);
                                this.scheduleNavigation(a, Mi, null, c, {
                                    resolve: o.resolve,
                                    reject: o.reject,
                                    promise: o.promise
                                })
                            }
                        }
                        KN(r) && this._events.next(r)
                    } catch (o) {
                        this.navigationTransitions.transitionAbortWithErrorSubject.next(o)
                    }
                }
                );
                this.eventsSubscription.add(n)
            }
            resetRootComponentType(n) {
                this.routerState.root.component = n,
                    this.navigationTransitions.rootComponentType = n
            }
            initialNavigation() {
                this.setUpLocationChangeListener(),
                    this.navigationTransitions.hasRequestedNavigation || this.navigateToSyncWithBrowser(this.location.path(!0), Mi, this.stateManager.restoredState())
            }
            setUpLocationChangeListener() {
                this.nonRouterCurrentEntryChangeSubscription ??= this.stateManager.registerNonRouterCurrentEntryChangeListener((n, r, o) => {
                    this.navigateToSyncWithBrowser(n, o, r)
                }
                )
            }
            navigateToSyncWithBrowser(n, r, o) {
                let i = {
                    replaceUrl: !0
                }
                    , s = o?.navigationId ? o : null;
                if (o) {
                    let c = m({}, o);
                    delete c.navigationId,
                        delete c.\u0275routerPageId,
                        Object.keys(c).length !== 0 && (i.state = c)
                }
                let a = this.parseUrl(n);
                this.scheduleNavigation(a, r, s, i).catch(c => {
                    this.disposed || this.injector.get(ct)(c)
                }
                )
            }
            get url() {
                return this.serializeUrl(this.currentUrlTree)
            }
            getCurrentNavigation() {
                return de(this.navigationTransitions.currentNavigation)
            }
            get lastSuccessfulNavigation() {
                return this.navigationTransitions.lastSuccessfulNavigation
            }
            resetConfig(n) {
                this.config = n.map(Ih),
                    this.navigated = !1
            }
            ngOnDestroy() {
                this.dispose()
            }
            dispose() {
                this._events.unsubscribe(),
                    this.navigationTransitions.complete(),
                    this.nonRouterCurrentEntryChangeSubscription?.unsubscribe(),
                    this.nonRouterCurrentEntryChangeSubscription = void 0,
                    this.disposed = !0,
                    this.eventsSubscription.unsubscribe()
            }
            createUrlTree(n, r = {}) {
                let { relativeTo: o, queryParams: i, fragment: s, queryParamsHandling: a, preserveFragment: c } = r
                    , l = c ? this.currentUrlTree.fragment : s
                    , u = null;
                switch (a ?? this.options.defaultQueryParamsHandling) {
                    case "merge":
                        u = m(m({}, this.currentUrlTree.queryParams), i);
                        break;
                    case "preserve":
                        u = this.currentUrlTree.queryParams;
                        break;
                    default:
                        u = i || null
                }
                u !== null && (u = this.removeEmptyProps(u));
                let d;
                try {
                    let h = o ? o.snapshot : this.routerState.snapshot.root;
                    d = mI(h)
                } catch {
                    (typeof n[0] != "string" || n[0][0] !== "/") && (n = []),
                        d = this.currentUrlTree.root
                }
                return vI(d, n, u, l ?? null, this.urlSerializer)
            }
            navigateByUrl(n, r = {
                skipLocationChange: !1
            }) {
                let o = Tn(n) ? n : this.parseUrl(n)
                    , i = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
                return this.scheduleNavigation(i, Mi, null, r)
            }
            navigate(n, r = {
                skipLocationChange: !1
            }) {
                return YR(n),
                    this.navigateByUrl(this.createUrlTree(n, r), r)
            }
            serializeUrl(n) {
                return this.urlSerializer.serialize(n)
            }
            parseUrl(n) {
                try {
                    return this.urlSerializer.parse(n)
                } catch {
                    return this.console.warn(St(4018, !1)),
                        this.urlSerializer.parse("/")
                }
            }
            isActive(n, r) {
                let o;
                if (r === !0 ? o = m({}, wh) : r === !1 ? o = m({}, _h) : o = r,
                    Tn(n))
                    return oh(this.currentUrlTree, n, o);
                let i = this.parseUrl(n);
                return oh(this.currentUrlTree, i, o)
            }
            removeEmptyProps(n) {
                return Object.entries(n).reduce((r, [o, i]) => (i != null && (r[o] = i),
                    r), {})
            }
            scheduleNavigation(n, r, o, i, s) {
                if (this.disposed)
                    return Promise.resolve(!1);
                let a, c, l;
                s ? (a = s.resolve,
                    c = s.reject,
                    l = s.promise) : l = new Promise((d, h) => {
                        a = d,
                            c = h
                    }
                    );
                let u = this.pendingTasks.add();
                return bh(this, () => {
                    queueMicrotask(() => this.pendingTasks.remove(u))
                }
                ),
                    this.navigationTransitions.handleNavigationRequest({
                        source: r,
                        restoredState: o,
                        currentUrlTree: this.currentUrlTree,
                        currentRawUrl: this.currentUrlTree,
                        rawUrl: n,
                        extras: i,
                        resolve: a,
                        reject: c,
                        promise: l,
                        currentSnapshot: this.routerState.snapshot,
                        currentRouterState: this.routerState
                    }),
                    l.catch(Promise.reject.bind(Promise))
            }
            static \u0275fac = function (r) {
                return new (r || e)
            }
                ;
            static \u0275prov = w({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    }
    )();
function YR(e) {
    for (let t = 0; t < e.length; t++)
        if (e[t] == null)
            throw new y(4008, !1)
}
var mo = (() => {
    class e {
        router;
        route;
        tabIndexAttribute;
        renderer;
        el;
        locationStrategy;
        reactiveHref = $(null);
        get href() {
            return de(this.reactiveHref)
        }
        set href(n) {
            this.reactiveHref.set(n)
        }
        target;
        queryParams;
        fragment;
        queryParamsHandling;
        state;
        info;
        relativeTo;
        isAnchorElement;
        subscription;
        onChanges = new ce;
        applicationErrorHandler = p(ct);
        options = p(go, {
            optional: !0
        });
        constructor(n, r, o, i, s, a) {
            this.router = n,
                this.route = r,
                this.tabIndexAttribute = o,
                this.renderer = i,
                this.el = s,
                this.locationStrategy = a,
                this.reactiveHref.set(p(new sc("href"), {
                    optional: !0
                }));
            let c = s.nativeElement.tagName?.toLowerCase();
            this.isAnchorElement = c === "a" || c === "area" || !!(typeof customElements == "object" && customElements.get(c)?.observedAttributes?.includes?.("href")),
                this.isAnchorElement && (this.setTabIndexIfNotOnNativeEl("0"),
                    this.subscribeToNavigationEventsIfNecessary())
        }
        subscribeToNavigationEventsIfNecessary() {
            this.subscription === void 0 && (this.subscription = this.router.events.subscribe(n => {
                n instanceof nt && this.updateHref()
            }
            ))
        }
        preserveFragment = !1;
        skipLocationChange = !1;
        replaceUrl = !1;
        setTabIndexIfNotOnNativeEl(n) {
            this.tabIndexAttribute != null || this.isAnchorElement || this.applyAttributeValue("tabindex", n)
        }
        ngOnChanges(n) {
            this.isAnchorElement && this.updateHref(),
                this.onChanges.next(this)
        }
        routerLinkInput = null;
        set routerLink(n) {
            n == null ? (this.routerLinkInput = null,
                this.setTabIndexIfNotOnNativeEl(null)) : (Tn(n) ? this.routerLinkInput = n : this.routerLinkInput = Array.isArray(n) ? n : [n],
                    this.setTabIndexIfNotOnNativeEl("0"))
        }
        onClick(n, r, o, i, s) {
            let a = this.urlTree;
            if (a === null || this.isAnchorElement && (n !== 0 || r || o || i || s || typeof this.target == "string" && this.target != "_self"))
                return !0;
            let c = {
                skipLocationChange: this.skipLocationChange,
                replaceUrl: this.replaceUrl,
                state: this.state,
                info: this.info
            };
            return this.router.navigateByUrl(a, c)?.catch(l => {
                this.applicationErrorHandler(l)
            }
            ),
                !this.isAnchorElement
        }
        ngOnDestroy() {
            this.subscription?.unsubscribe()
        }
        updateHref() {
            let n = this.urlTree;
            this.reactiveHref.set(n !== null && this.locationStrategy ? this.locationStrategy?.prepareExternalUrl(this.router.serializeUrl(n)) ?? "" : null)
        }
        applyAttributeValue(n, r) {
            let o = this.renderer
                , i = this.el.nativeElement;
            r !== null ? o.setAttribute(i, n, r) : o.removeAttribute(i, n)
        }
        get urlTree() {
            return this.routerLinkInput === null ? null : Tn(this.routerLinkInput) ? this.routerLinkInput : this.router.createUrlTree(this.routerLinkInput, {
                relativeTo: this.relativeTo !== void 0 ? this.relativeTo : this.route,
                queryParams: this.queryParams,
                fragment: this.fragment,
                queryParamsHandling: this.queryParamsHandling,
                preserveFragment: this.preserveFragment
            })
        }
        static \u0275fac = function (r) {
            return new (r || e)(F(Be), F(on), Ta("tabindex"), F(or), F(Dt), F(no))
        }
            ;
        static \u0275dir = _e({
            type: e,
            selectors: [["", "routerLink", ""]],
            hostVars: 2,
            hostBindings: function (r, o) {
                r & 1 && Y("click", function (s) {
                    return o.onClick(s.button, s.ctrlKey, s.shiftKey, s.altKey, s.metaKey)
                }),
                    r & 2 && en("href", o.reactiveHref(), qd)("target", o.target)
            },
            inputs: {
                target: "target",
                queryParams: "queryParams",
                fragment: "fragment",
                queryParamsHandling: "queryParamsHandling",
                state: "state",
                info: "info",
                relativeTo: "relativeTo",
                preserveFragment: [2, "preserveFragment", "preserveFragment", vi],
                skipLocationChange: [2, "skipLocationChange", "skipLocationChange", vi],
                replaceUrl: [2, "replaceUrl", "replaceUrl", vi],
                routerLink: "routerLink"
            },
            features: [jt]
        })
    }
    return e
}
)()
    , Th = (() => {
        class e {
            router;
            element;
            renderer;
            cdr;
            links;
            classes = [];
            routerEventsSubscription;
            linkInputChangesSubscription;
            _isActive = !1;
            get isActive() {
                return this._isActive
            }
            routerLinkActiveOptions = {
                exact: !1
            };
            ariaCurrentWhenActive;
            isActiveChange = new ee;
            link = p(mo, {
                optional: !0
            });
            constructor(n, r, o, i) {
                this.router = n,
                    this.element = r,
                    this.renderer = o,
                    this.cdr = i,
                    this.routerEventsSubscription = n.events.subscribe(s => {
                        s instanceof nt && this.update()
                    }
                    )
            }
            ngAfterContentInit() {
                L(this.links.changes, L(null)).pipe(Sr()).subscribe(n => {
                    this.update(),
                        this.subscribeToEachLinkOnChanges()
                }
                )
            }
            subscribeToEachLinkOnChanges() {
                this.linkInputChangesSubscription?.unsubscribe();
                let n = [...this.links.toArray(), this.link].filter(r => !!r).map(r => r.onChanges);
                this.linkInputChangesSubscription = re(n).pipe(Sr()).subscribe(r => {
                    this._isActive !== this.isLinkActive(this.router)(r) && this.update()
                }
                )
            }
            set routerLinkActive(n) {
                let r = Array.isArray(n) ? n : n.split(" ");
                this.classes = r.filter(o => !!o)
            }
            ngOnChanges(n) {
                this.update()
            }
            ngOnDestroy() {
                this.routerEventsSubscription.unsubscribe(),
                    this.linkInputChangesSubscription?.unsubscribe()
            }
            update() {
                !this.links || !this.router.navigated || queueMicrotask(() => {
                    let n = this.hasActiveLinks();
                    this.classes.forEach(r => {
                        n ? this.renderer.addClass(this.element.nativeElement, r) : this.renderer.removeClass(this.element.nativeElement, r)
                    }
                    ),
                        n && this.ariaCurrentWhenActive !== void 0 ? this.renderer.setAttribute(this.element.nativeElement, "aria-current", this.ariaCurrentWhenActive.toString()) : this.renderer.removeAttribute(this.element.nativeElement, "aria-current"),
                        this._isActive !== n && (this._isActive = n,
                            this.cdr.markForCheck(),
                            this.isActiveChange.emit(n))
                }
                )
            }
            isLinkActive(n) {
                let r = JR(this.routerLinkActiveOptions) ? this.routerLinkActiveOptions : this.routerLinkActiveOptions.exact ?? !1 ? m({}, wh) : m({}, _h);
                return o => {
                    let i = o.urlTree;
                    return i ? de(vh(i, n, r)) : !1
                }
            }
            hasActiveLinks() {
                let n = this.isLinkActive(this.router);
                return this.link && n(this.link) || this.links.some(n)
            }
            static \u0275fac = function (r) {
                return new (r || e)(F(Be), F(Dt), F(or), F(mi))
            }
                ;
            static \u0275dir = _e({
                type: e,
                selectors: [["", "routerLinkActive", ""]],
                contentQueries: function (r, o, i) {
                    if (r & 1 && Za(i, mo, 5),
                        r & 2) {
                        let s;
                        Cf(s = bf()) && (o.links = s)
                    }
                },
                inputs: {
                    routerLinkActiveOptions: "routerLinkActiveOptions",
                    ariaCurrentWhenActive: "ariaCurrentWhenActive",
                    routerLinkActive: "routerLinkActive"
                },
                outputs: {
                    isActiveChange: "isActiveChange"
                },
                exportAs: ["routerLinkActive"],
                features: [jt]
            })
        }
        return e
    }
    )();
function JR(e) {
    return !!e.paths
}
var XR = new v("");
function Sh(e, ...t) {
    return Nt([{
        provide: Vi,
        multi: !0,
        useValue: e
    }, [], {
        provide: on,
        useFactory: eA
    }, {
        provide: En,
        multi: !0,
        useFactory: tA
    }, t.map(n => n.\u0275providers)])
}
function eA() {
    return p(Be).routerState.root
}
function tA() {
    let e = p(Ne);
    return t => {
        let n = e.get(Ue);
        if (t !== n.components[0])
            return;
        let r = e.get(Be)
            , o = e.get(nA);
        e.get(rA) === 1 && r.initialNavigation(),
            e.get(oA, null, {
                optional: !0
            })?.setUpPreloading(),
            e.get(XR, null, {
                optional: !0
            })?.init(),
            r.resetRootComponentType(n.componentTypes[0]),
            o.closed || (o.next(),
                o.complete(),
                o.unsubscribe())
    }
}
var nA = new v("", {
    factory: () => new ce
})
    , rA = new v("", {
        factory: () => 1
    });
var oA = new v("");
var YI = (() => {
    class e {
        _renderer;
        _elementRef;
        onChange = n => { }
            ;
        onTouched = () => { }
            ;
        constructor(n, r) {
            this._renderer = n,
                this._elementRef = r
        }
        setProperty(n, r) {
            this._renderer.setProperty(this._elementRef.nativeElement, n, r)
        }
        registerOnTouched(n) {
            this.onTouched = n
        }
        registerOnChange(n) {
            this.onChange = n
        }
        setDisabledState(n) {
            this.setProperty("disabled", n)
        }
        static \u0275fac = function (r) {
            return new (r || e)(F(or), F(Dt))
        }
            ;
        static \u0275dir = _e({
            type: e
        })
    }
    return e
}
)()
    , sA = (() => {
        class e extends YI {
            static \u0275fac = (() => {
                let n;
                return function (o) {
                    return (n || (n = rr(e)))(o || e)
                }
            }
            )();
            static \u0275dir = _e({
                type: e,
                features: [Ct]
            })
        }
        return e
    }
    )()
    , zi = new v("");
var aA = {
    provide: zi,
    useExisting: mt(() => el),
    multi: !0
};
function cA() {
    let e = ft() ? ft().getUserAgent() : "";
    return /android (\d+)/.test(e.toLowerCase())
}
var lA = new v("")
    , el = (() => {
        class e extends YI {
            _compositionMode;
            _composing = !1;
            constructor(n, r, o) {
                super(n, r),
                    this._compositionMode = o,
                    this._compositionMode == null && (this._compositionMode = !cA())
            }
            writeValue(n) {
                let r = n ?? "";
                this.setProperty("value", r)
            }
            _handleInput(n) {
                (!this._compositionMode || this._compositionMode && !this._composing) && this.onChange(n)
            }
            _compositionStart() {
                this._composing = !0
            }
            _compositionEnd(n) {
                this._composing = !1,
                    this._compositionMode && this.onChange(n)
            }
            static \u0275fac = function (r) {
                return new (r || e)(F(or), F(Dt), F(lA, 8))
            }
                ;
            static \u0275dir = _e({
                type: e,
                selectors: [["input", "formControlName", "", 3, "type", "checkbox"], ["textarea", "formControlName", ""], ["input", "formControl", "", 3, "type", "checkbox"], ["textarea", "formControl", ""], ["input", "ngModel", "", 3, "type", "checkbox"], ["textarea", "ngModel", ""], ["", "ngDefaultControl", ""]],
                hostBindings: function (r, o) {
                    r & 1 && Y("input", function (s) {
                        return o._handleInput(s.target.value)
                    })("blur", function () {
                        return o.onTouched()
                    })("compositionstart", function () {
                        return o._compositionStart()
                    })("compositionend", function (s) {
                        return o._compositionEnd(s.target.value)
                    })
                },
                standalone: !1,
                features: [Dn([aA]), Ct]
            })
        }
        return e
    }
    )();
function Ah(e) {
    return e == null || xh(e) === 0
}
function xh(e) {
    return e == null ? null : Array.isArray(e) || typeof e == "string" ? e.length : e instanceof Set ? e.size : null
}
var Oh = new v("")
    , kh = new v("")
    , uA = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    , an = class {
        static min(t) {
            return dA(t)
        }
        static max(t) {
            return fA(t)
        }
        static required(t) {
            return hA(t)
        }
        static requiredTrue(t) {
            return pA(t)
        }
        static email(t) {
            return gA(t)
        }
        static minLength(t) {
            return mA(t)
        }
        static maxLength(t) {
            return vA(t)
        }
        static pattern(t) {
            return yA(t)
        }
        static nullValidator(t) {
            return KI()
        }
        static compose(t) {
            return rD(t)
        }
        static composeAsync(t) {
            return iD(t)
        }
    }
    ;
function dA(e) {
    return t => {
        if (t.value == null || e == null)
            return null;
        let n = parseFloat(t.value);
        return !isNaN(n) && n < e ? {
            min: {
                min: e,
                actual: t.value
            }
        } : null
    }
}
function fA(e) {
    return t => {
        if (t.value == null || e == null)
            return null;
        let n = parseFloat(t.value);
        return !isNaN(n) && n > e ? {
            max: {
                max: e,
                actual: t.value
            }
        } : null
    }
}
function hA(e) {
    return Ah(e.value) ? {
        required: !0
    } : null
}
function pA(e) {
    return e.value === !0 ? null : {
        required: !0
    }
}
function gA(e) {
    return Ah(e.value) || uA.test(e.value) ? null : {
        email: !0
    }
}
function mA(e) {
    return t => {
        let n = t.value?.length ?? xh(t.value);
        return n === null || n === 0 ? null : n < e ? {
            minlength: {
                requiredLength: e,
                actualLength: n
            }
        } : null
    }
}
function vA(e) {
    return t => {
        let n = t.value?.length ?? xh(t.value);
        return n !== null && n > e ? {
            maxlength: {
                requiredLength: e,
                actualLength: n
            }
        } : null
    }
}
function yA(e) {
    if (!e)
        return KI;
    let t, n;
    return typeof e == "string" ? (n = "",
        e.charAt(0) !== "^" && (n += "^"),
        n += e,
        e.charAt(e.length - 1) !== "$" && (n += "$"),
        t = new RegExp(n)) : (n = e.toString(),
            t = e),
        r => {
            if (Ah(r.value))
                return null;
            let o = r.value;
            return t.test(o) ? null : {
                pattern: {
                    requiredPattern: n,
                    actualValue: o
                }
            }
        }
}
function KI(e) {
    return null
}
function JI(e) {
    return e != null
}
function XI(e) {
    return sr(e) ? re(e) : e
}
function eD(e) {
    let t = {};
    return e.forEach(n => {
        t = n != null ? m(m({}, t), n) : t
    }
    ),
        Object.keys(t).length === 0 ? null : t
}
function tD(e, t) {
    return t.map(n => n(e))
}
function EA(e) {
    return !e.validate
}
function nD(e) {
    return e.map(t => EA(t) ? t : n => t.validate(n))
}
function rD(e) {
    if (!e)
        return null;
    let t = e.filter(JI);
    return t.length == 0 ? null : function (n) {
        return eD(tD(n, t))
    }
}
function oD(e) {
    return e != null ? rD(nD(e)) : null
}
function iD(e) {
    if (!e)
        return null;
    let t = e.filter(JI);
    return t.length == 0 ? null : function (n) {
        let r = tD(n, t).map(XI);
        return Vl(r).pipe(K(eD))
    }
}
function sD(e) {
    return e != null ? iD(nD(e)) : null
}
function GI(e, t) {
    return e === null ? [t] : Array.isArray(e) ? [...e, t] : [e, t]
}
function aD(e) {
    return e._rawValidators
}
function cD(e) {
    return e._rawAsyncValidators
}
function Mh(e) {
    return e ? Array.isArray(e) ? e : [e] : []
}
function zc(e, t) {
    return Array.isArray(e) ? e.includes(t) : e === t
}
function qI(e, t) {
    let n = Mh(t);
    return Mh(e).forEach(o => {
        zc(n, o) || n.push(o)
    }
    ),
        n
}
function WI(e, t) {
    return Mh(t).filter(n => !zc(e, n))
}
var Gc = class {
    get value() {
        return this.control ? this.control.value : null
    }
    get valid() {
        return this.control ? this.control.valid : null
    }
    get invalid() {
        return this.control ? this.control.invalid : null
    }
    get pending() {
        return this.control ? this.control.pending : null
    }
    get disabled() {
        return this.control ? this.control.disabled : null
    }
    get enabled() {
        return this.control ? this.control.enabled : null
    }
    get errors() {
        return this.control ? this.control.errors : null
    }
    get pristine() {
        return this.control ? this.control.pristine : null
    }
    get dirty() {
        return this.control ? this.control.dirty : null
    }
    get touched() {
        return this.control ? this.control.touched : null
    }
    get status() {
        return this.control ? this.control.status : null
    }
    get untouched() {
        return this.control ? this.control.untouched : null
    }
    get statusChanges() {
        return this.control ? this.control.statusChanges : null
    }
    get valueChanges() {
        return this.control ? this.control.valueChanges : null
    }
    get path() {
        return null
    }
    _composedValidatorFn;
    _composedAsyncValidatorFn;
    _rawValidators = [];
    _rawAsyncValidators = [];
    _setValidators(t) {
        this._rawValidators = t || [],
            this._composedValidatorFn = oD(this._rawValidators)
    }
    _setAsyncValidators(t) {
        this._rawAsyncValidators = t || [],
            this._composedAsyncValidatorFn = sD(this._rawAsyncValidators)
    }
    get validator() {
        return this._composedValidatorFn || null
    }
    get asyncValidator() {
        return this._composedAsyncValidatorFn || null
    }
    _onDestroyCallbacks = [];
    _registerOnDestroy(t) {
        this._onDestroyCallbacks.push(t)
    }
    _invokeOnDestroyCallbacks() {
        this._onDestroyCallbacks.forEach(t => t()),
            this._onDestroyCallbacks = []
    }
    reset(t = void 0) {
        this.control && this.control.reset(t)
    }
    hasError(t, n) {
        return this.control ? this.control.hasError(t, n) : !1
    }
    getError(t, n) {
        return this.control ? this.control.getError(t, n) : null
    }
}
    , Eo = class extends Gc {
        name;
        get formDirective() {
            return null
        }
        get path() {
            return null
        }
    }
    , cn = class extends Gc {
        _parent = null;
        name = null;
        valueAccessor = null
    }
    , qc = class {
        _cd;
        constructor(t) {
            this._cd = t
        }
        get isTouched() {
            return this._cd?.control?._touched?.(),
                !!this._cd?.control?.touched
        }
        get isUntouched() {
            return !!this._cd?.control?.untouched
        }
        get isPristine() {
            return this._cd?.control?._pristine?.(),
                !!this._cd?.control?.pristine
        }
        get isDirty() {
            return !!this._cd?.control?.dirty
        }
        get isValid() {
            return this._cd?.control?._status?.(),
                !!this._cd?.control?.valid
        }
        get isInvalid() {
            return !!this._cd?.control?.invalid
        }
        get isPending() {
            return !!this._cd?.control?.pending
        }
        get isSubmitted() {
            return this._cd?._submitted?.(),
                !!this._cd?.submitted
        }
    }
    ;
var tl = (() => {
    class e extends qc {
        constructor(n) {
            super(n)
        }
        static \u0275fac = function (r) {
            return new (r || e)(F(cn, 2))
        }
            ;
        static \u0275dir = _e({
            type: e,
            selectors: [["", "formControlName", ""], ["", "ngModel", ""], ["", "formControl", ""]],
            hostVars: 14,
            hostBindings: function (r, o) {
                r & 2 && cr("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)("ng-pristine", o.isPristine)("ng-dirty", o.isDirty)("ng-valid", o.isValid)("ng-invalid", o.isInvalid)("ng-pending", o.isPending)
            },
            standalone: !1,
            features: [Ct]
        })
    }
    return e
}
)()
    , lD = (() => {
        class e extends qc {
            constructor(n) {
                super(n)
            }
            static \u0275fac = function (r) {
                return new (r || e)(F(Eo, 10))
            }
                ;
            static \u0275dir = _e({
                type: e,
                selectors: [["", "formGroupName", ""], ["", "formArrayName", ""], ["", "ngModelGroup", ""], ["", "formGroup", ""], ["", "formArray", ""], ["form", 3, "ngNoForm", ""], ["", "ngForm", ""]],
                hostVars: 16,
                hostBindings: function (r, o) {
                    r & 2 && cr("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)("ng-pristine", o.isPristine)("ng-dirty", o.isDirty)("ng-valid", o.isValid)("ng-invalid", o.isInvalid)("ng-pending", o.isPending)("ng-submitted", o.isSubmitted)
                },
                standalone: !1,
                features: [Ct]
            })
        }
        return e
    }
    )();
var Ui = "VALID"
    , $c = "INVALID"
    , vo = "PENDING"
    , Hi = "DISABLED"
    , Sn = class {
    }
    , Wc = class extends Sn {
        value;
        source;
        constructor(t, n) {
            super(),
                this.value = t,
                this.source = n
        }
    }
    , Bi = class extends Sn {
        pristine;
        source;
        constructor(t, n) {
            super(),
                this.pristine = t,
                this.source = n
        }
    }
    , $i = class extends Sn {
        touched;
        source;
        constructor(t, n) {
            super(),
                this.touched = t,
                this.source = n
        }
    }
    , yo = class extends Sn {
        status;
        source;
        constructor(t, n) {
            super(),
                this.status = t,
                this.source = n
        }
    }
    , Nh = class extends Sn {
        source;
        constructor(t) {
            super(),
                this.source = t
        }
    }
    , Qc = class extends Sn {
        source;
        constructor(t) {
            super(),
                this.source = t
        }
    }
    ;
function uD(e) {
    return (nl(e) ? e.validators : e) || null
}
function IA(e) {
    return Array.isArray(e) ? oD(e) : e || null
}
function dD(e, t) {
    return (nl(t) ? t.asyncValidators : e) || null
}
function DA(e) {
    return Array.isArray(e) ? sD(e) : e || null
}
function nl(e) {
    return e != null && !Array.isArray(e) && typeof e == "object"
}
function CA(e, t, n) {
    let r = e.controls;
    if (!(t ? Object.keys(r) : r).length)
        throw new y(1e3, "");
    if (!r[n])
        throw new y(1001, "")
}
function bA(e, t, n) {
    e._forEachChild((r, o) => {
        if (n[o] === void 0)
            throw new y(1002, "")
    }
    )
}
var Zc = class {
    _pendingDirty = !1;
    _hasOwnPendingAsyncValidator = null;
    _pendingTouched = !1;
    _onCollectionChange = () => { }
        ;
    _updateOn;
    _parent = null;
    _asyncValidationSubscription;
    _composedValidatorFn;
    _composedAsyncValidatorFn;
    _rawValidators;
    _rawAsyncValidators;
    value;
    constructor(t, n) {
        this._assignValidators(t),
            this._assignAsyncValidators(n)
    }
    get validator() {
        return this._composedValidatorFn
    }
    set validator(t) {
        this._rawValidators = this._composedValidatorFn = t
    }
    get asyncValidator() {
        return this._composedAsyncValidatorFn
    }
    set asyncValidator(t) {
        this._rawAsyncValidators = this._composedAsyncValidatorFn = t
    }
    get parent() {
        return this._parent
    }
    get status() {
        return de(this.statusReactive)
    }
    set status(t) {
        de(() => this.statusReactive.set(t))
    }
    _status = pe(() => this.statusReactive());
    statusReactive = $(void 0);
    get valid() {
        return this.status === Ui
    }
    get invalid() {
        return this.status === $c
    }
    get pending() {
        return this.status == vo
    }
    get disabled() {
        return this.status === Hi
    }
    get enabled() {
        return this.status !== Hi
    }
    errors;
    get pristine() {
        return de(this.pristineReactive)
    }
    set pristine(t) {
        de(() => this.pristineReactive.set(t))
    }
    _pristine = pe(() => this.pristineReactive());
    pristineReactive = $(!0);
    get dirty() {
        return !this.pristine
    }
    get touched() {
        return de(this.touchedReactive)
    }
    set touched(t) {
        de(() => this.touchedReactive.set(t))
    }
    _touched = pe(() => this.touchedReactive());
    touchedReactive = $(!1);
    get untouched() {
        return !this.touched
    }
    _events = new ce;
    events = this._events.asObservable();
    valueChanges;
    statusChanges;
    get updateOn() {
        return this._updateOn ? this._updateOn : this.parent ? this.parent.updateOn : "change"
    }
    setValidators(t) {
        this._assignValidators(t)
    }
    setAsyncValidators(t) {
        this._assignAsyncValidators(t)
    }
    addValidators(t) {
        this.setValidators(qI(t, this._rawValidators))
    }
    addAsyncValidators(t) {
        this.setAsyncValidators(qI(t, this._rawAsyncValidators))
    }
    removeValidators(t) {
        this.setValidators(WI(t, this._rawValidators))
    }
    removeAsyncValidators(t) {
        this.setAsyncValidators(WI(t, this._rawAsyncValidators))
    }
    hasValidator(t) {
        return zc(this._rawValidators, t)
    }
    hasAsyncValidator(t) {
        return zc(this._rawAsyncValidators, t)
    }
    clearValidators() {
        this.validator = null
    }
    clearAsyncValidators() {
        this.asyncValidator = null
    }
    markAsTouched(t = {}) {
        let n = this.touched === !1;
        this.touched = !0;
        let r = t.sourceControl ?? this;
        this._parent && !t.onlySelf && this._parent.markAsTouched(P(m({}, t), {
            sourceControl: r
        })),
            n && t.emitEvent !== !1 && this._events.next(new $i(!0, r))
    }
    markAllAsDirty(t = {}) {
        this.markAsDirty({
            onlySelf: !0,
            emitEvent: t.emitEvent,
            sourceControl: this
        }),
            this._forEachChild(n => n.markAllAsDirty(t))
    }
    markAllAsTouched(t = {}) {
        this.markAsTouched({
            onlySelf: !0,
            emitEvent: t.emitEvent,
            sourceControl: this
        }),
            this._forEachChild(n => n.markAllAsTouched(t))
    }
    markAsUntouched(t = {}) {
        let n = this.touched === !0;
        this.touched = !1,
            this._pendingTouched = !1;
        let r = t.sourceControl ?? this;
        this._forEachChild(o => {
            o.markAsUntouched({
                onlySelf: !0,
                emitEvent: t.emitEvent,
                sourceControl: r
            })
        }
        ),
            this._parent && !t.onlySelf && this._parent._updateTouched(t, r),
            n && t.emitEvent !== !1 && this._events.next(new $i(!1, r))
    }
    markAsDirty(t = {}) {
        let n = this.pristine === !0;
        this.pristine = !1;
        let r = t.sourceControl ?? this;
        this._parent && !t.onlySelf && this._parent.markAsDirty(P(m({}, t), {
            sourceControl: r
        })),
            n && t.emitEvent !== !1 && this._events.next(new Bi(!1, r))
    }
    markAsPristine(t = {}) {
        let n = this.pristine === !1;
        this.pristine = !0,
            this._pendingDirty = !1;
        let r = t.sourceControl ?? this;
        this._forEachChild(o => {
            o.markAsPristine({
                onlySelf: !0,
                emitEvent: t.emitEvent
            })
        }
        ),
            this._parent && !t.onlySelf && this._parent._updatePristine(t, r),
            n && t.emitEvent !== !1 && this._events.next(new Bi(!0, r))
    }
    markAsPending(t = {}) {
        this.status = vo;
        let n = t.sourceControl ?? this;
        t.emitEvent !== !1 && (this._events.next(new yo(this.status, n)),
            this.statusChanges.emit(this.status)),
            this._parent && !t.onlySelf && this._parent.markAsPending(P(m({}, t), {
                sourceControl: n
            }))
    }
    disable(t = {}) {
        let n = this._parentMarkedDirty(t.onlySelf);
        this.status = Hi,
            this.errors = null,
            this._forEachChild(o => {
                o.disable(P(m({}, t), {
                    onlySelf: !0
                }))
            }
            ),
            this._updateValue();
        let r = t.sourceControl ?? this;
        t.emitEvent !== !1 && (this._events.next(new Wc(this.value, r)),
            this._events.next(new yo(this.status, r)),
            this.valueChanges.emit(this.value),
            this.statusChanges.emit(this.status)),
            this._updateAncestors(P(m({}, t), {
                skipPristineCheck: n
            }), this),
            this._onDisabledChange.forEach(o => o(!0))
    }
    enable(t = {}) {
        let n = this._parentMarkedDirty(t.onlySelf);
        this.status = Ui,
            this._forEachChild(r => {
                r.enable(P(m({}, t), {
                    onlySelf: !0
                }))
            }
            ),
            this.updateValueAndValidity({
                onlySelf: !0,
                emitEvent: t.emitEvent
            }),
            this._updateAncestors(P(m({}, t), {
                skipPristineCheck: n
            }), this),
            this._onDisabledChange.forEach(r => r(!1))
    }
    _updateAncestors(t, n) {
        this._parent && !t.onlySelf && (this._parent.updateValueAndValidity(t),
            t.skipPristineCheck || this._parent._updatePristine({}, n),
            this._parent._updateTouched({}, n))
    }
    setParent(t) {
        this._parent = t
    }
    getRawValue() {
        return this.value
    }
    updateValueAndValidity(t = {}) {
        if (this._setInitialStatus(),
            this._updateValue(),
            this.enabled) {
            let r = this._cancelExistingSubscription();
            this.errors = this._runValidator(),
                this.status = this._calculateStatus(),
                (this.status === Ui || this.status === vo) && this._runAsyncValidator(r, t.emitEvent)
        }
        let n = t.sourceControl ?? this;
        t.emitEvent !== !1 && (this._events.next(new Wc(this.value, n)),
            this._events.next(new yo(this.status, n)),
            this.valueChanges.emit(this.value),
            this.statusChanges.emit(this.status)),
            this._parent && !t.onlySelf && this._parent.updateValueAndValidity(P(m({}, t), {
                sourceControl: n
            }))
    }
    _updateTreeValidity(t = {
        emitEvent: !0
    }) {
        this._forEachChild(n => n._updateTreeValidity(t)),
            this.updateValueAndValidity({
                onlySelf: !0,
                emitEvent: t.emitEvent
            })
    }
    _setInitialStatus() {
        this.status = this._allControlsDisabled() ? Hi : Ui
    }
    _runValidator() {
        return this.validator ? this.validator(this) : null
    }
    _runAsyncValidator(t, n) {
        if (this.asyncValidator) {
            this.status = vo,
                this._hasOwnPendingAsyncValidator = {
                    emitEvent: n !== !1,
                    shouldHaveEmitted: t !== !1
                };
            let r = XI(this.asyncValidator(this));
            this._asyncValidationSubscription = r.subscribe(o => {
                this._hasOwnPendingAsyncValidator = null,
                    this.setErrors(o, {
                        emitEvent: n,
                        shouldHaveEmitted: t
                    })
            }
            )
        }
    }
    _cancelExistingSubscription() {
        if (this._asyncValidationSubscription) {
            this._asyncValidationSubscription.unsubscribe();
            let t = (this._hasOwnPendingAsyncValidator?.emitEvent || this._hasOwnPendingAsyncValidator?.shouldHaveEmitted) ?? !1;
            return this._hasOwnPendingAsyncValidator = null,
                t
        }
        return !1
    }
    setErrors(t, n = {}) {
        this.errors = t,
            this._updateControlsErrors(n.emitEvent !== !1, this, n.shouldHaveEmitted)
    }
    get(t) {
        let n = t;
        return n == null || (Array.isArray(n) || (n = n.split(".")),
            n.length === 0) ? null : n.reduce((r, o) => r && r._find(o), this)
    }
    getError(t, n) {
        let r = n ? this.get(n) : this;
        return r && r.errors ? r.errors[t] : null
    }
    hasError(t, n) {
        return !!this.getError(t, n)
    }
    get root() {
        let t = this;
        for (; t._parent;)
            t = t._parent;
        return t
    }
    _updateControlsErrors(t, n, r) {
        this.status = this._calculateStatus(),
            t && this.statusChanges.emit(this.status),
            (t || r) && this._events.next(new yo(this.status, n)),
            this._parent && this._parent._updateControlsErrors(t, n, r)
    }
    _initObservables() {
        this.valueChanges = new ee,
            this.statusChanges = new ee
    }
    _calculateStatus() {
        return this._allControlsDisabled() ? Hi : this.errors ? $c : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(vo) ? vo : this._anyControlsHaveStatus($c) ? $c : Ui
    }
    _anyControlsHaveStatus(t) {
        return this._anyControls(n => n.status === t)
    }
    _anyControlsDirty() {
        return this._anyControls(t => t.dirty)
    }
    _anyControlsTouched() {
        return this._anyControls(t => t.touched)
    }
    _updatePristine(t, n) {
        let r = !this._anyControlsDirty()
            , o = this.pristine !== r;
        this.pristine = r,
            this._parent && !t.onlySelf && this._parent._updatePristine(t, n),
            o && this._events.next(new Bi(this.pristine, n))
    }
    _updateTouched(t = {}, n) {
        this.touched = this._anyControlsTouched(),
            this._events.next(new $i(this.touched, n)),
            this._parent && !t.onlySelf && this._parent._updateTouched(t, n)
    }
    _onDisabledChange = [];
    _registerOnCollectionChange(t) {
        this._onCollectionChange = t
    }
    _setUpdateStrategy(t) {
        nl(t) && t.updateOn != null && (this._updateOn = t.updateOn)
    }
    _parentMarkedDirty(t) {
        let n = this._parent && this._parent.dirty;
        return !t && !!n && !this._parent._anyControlsDirty()
    }
    _find(t) {
        return null
    }
    _assignValidators(t) {
        this._rawValidators = Array.isArray(t) ? t.slice() : t,
            this._composedValidatorFn = IA(this._rawValidators)
    }
    _assignAsyncValidators(t) {
        this._rawAsyncValidators = Array.isArray(t) ? t.slice() : t,
            this._composedAsyncValidatorFn = DA(this._rawAsyncValidators)
    }
}
    , Yc = class extends Zc {
        constructor(t, n, r) {
            super(uD(n), dD(r, n)),
                this.controls = t,
                this._initObservables(),
                this._setUpdateStrategy(n),
                this._setUpControls(),
                this.updateValueAndValidity({
                    onlySelf: !0,
                    emitEvent: !!this.asyncValidator
                })
        }
        controls;
        registerControl(t, n) {
            return this.controls[t] ? this.controls[t] : (this.controls[t] = n,
                n.setParent(this),
                n._registerOnCollectionChange(this._onCollectionChange),
                n)
        }
        addControl(t, n, r = {}) {
            this.registerControl(t, n),
                this.updateValueAndValidity({
                    emitEvent: r.emitEvent
                }),
                this._onCollectionChange()
        }
        removeControl(t, n = {}) {
            this.controls[t] && this.controls[t]._registerOnCollectionChange(() => { }
            ),
                delete this.controls[t],
                this.updateValueAndValidity({
                    emitEvent: n.emitEvent
                }),
                this._onCollectionChange()
        }
        setControl(t, n, r = {}) {
            this.controls[t] && this.controls[t]._registerOnCollectionChange(() => { }
            ),
                delete this.controls[t],
                n && this.registerControl(t, n),
                this.updateValueAndValidity({
                    emitEvent: r.emitEvent
                }),
                this._onCollectionChange()
        }
        contains(t) {
            return this.controls.hasOwnProperty(t) && this.controls[t].enabled
        }
        setValue(t, n = {}) {
            bA(this, !0, t),
                Object.keys(t).forEach(r => {
                    CA(this, !0, r),
                        this.controls[r].setValue(t[r], {
                            onlySelf: !0,
                            emitEvent: n.emitEvent
                        })
                }
                ),
                this.updateValueAndValidity(n)
        }
        patchValue(t, n = {}) {
            t != null && (Object.keys(t).forEach(r => {
                let o = this.controls[r];
                o && o.patchValue(t[r], {
                    onlySelf: !0,
                    emitEvent: n.emitEvent
                })
            }
            ),
                this.updateValueAndValidity(n))
        }
        reset(t = {}, n = {}) {
            this._forEachChild((r, o) => {
                r.reset(t ? t[o] : null, P(m({}, n), {
                    onlySelf: !0
                }))
            }
            ),
                this._updatePristine(n, this),
                this._updateTouched(n, this),
                this.updateValueAndValidity(n),
                n?.emitEvent !== !1 && this._events.next(new Qc(this))
        }
        getRawValue() {
            return this._reduceChildren({}, (t, n, r) => (t[r] = n.getRawValue(),
                t))
        }
        _syncPendingControls() {
            let t = this._reduceChildren(!1, (n, r) => r._syncPendingControls() ? !0 : n);
            return t && this.updateValueAndValidity({
                onlySelf: !0
            }),
                t
        }
        _forEachChild(t) {
            Object.keys(this.controls).forEach(n => {
                let r = this.controls[n];
                r && t(r, n)
            }
            )
        }
        _setUpControls() {
            this._forEachChild(t => {
                t.setParent(this),
                    t._registerOnCollectionChange(this._onCollectionChange)
            }
            )
        }
        _updateValue() {
            this.value = this._reduceValue()
        }
        _anyControls(t) {
            for (let [n, r] of Object.entries(this.controls))
                if (this.contains(n) && t(r))
                    return !0;
            return !1
        }
        _reduceValue() {
            let t = {};
            return this._reduceChildren(t, (n, r, o) => ((r.enabled || this.disabled) && (n[o] = r.value),
                n))
        }
        _reduceChildren(t, n) {
            let r = t;
            return this._forEachChild((o, i) => {
                r = n(r, o, i)
            }
            ),
                r
        }
        _allControlsDisabled() {
            for (let t of Object.keys(this.controls))
                if (this.controls[t].enabled)
                    return !1;
            return Object.keys(this.controls).length > 0 || this.disabled
        }
        _find(t) {
            return this.controls.hasOwnProperty(t) ? this.controls[t] : null
        }
    }
    ;
var Ph = new v("", {
    factory: () => Lh
})
    , Lh = "always";
function wA(e, t) {
    return [...t.path, e]
}
function Rh(e, t, n = Lh) {
    Fh(e, t),
        t.valueAccessor.writeValue(e.value),
        (e.disabled || n === "always") && t.valueAccessor.setDisabledState?.(e.disabled),
        TA(e, t),
        MA(e, t),
        SA(e, t),
        _A(e, t)
}
function Kc(e, t, n = !0) {
    let r = () => { }
        ;
    t.valueAccessor && (t.valueAccessor.registerOnChange(r),
        t.valueAccessor.registerOnTouched(r)),
        Xc(e, t),
        e && (t._invokeOnDestroyCallbacks(),
            e._registerOnCollectionChange(() => { }
            ))
}
function Jc(e, t) {
    e.forEach(n => {
        n.registerOnValidatorChange && n.registerOnValidatorChange(t)
    }
    )
}
function _A(e, t) {
    if (t.valueAccessor.setDisabledState) {
        let n = r => {
            t.valueAccessor.setDisabledState(r)
        }
            ;
        e.registerOnDisabledChange(n),
            t._registerOnDestroy(() => {
                e._unregisterOnDisabledChange(n)
            }
            )
    }
}
function Fh(e, t) {
    let n = aD(e);
    t.validator !== null ? e.setValidators(GI(n, t.validator)) : typeof n == "function" && e.setValidators([n]);
    let r = cD(e);
    t.asyncValidator !== null ? e.setAsyncValidators(GI(r, t.asyncValidator)) : typeof r == "function" && e.setAsyncValidators([r]);
    let o = () => e.updateValueAndValidity();
    Jc(t._rawValidators, o),
        Jc(t._rawAsyncValidators, o)
}
function Xc(e, t) {
    let n = !1;
    if (e !== null) {
        if (t.validator !== null) {
            let o = aD(e);
            if (Array.isArray(o) && o.length > 0) {
                let i = o.filter(s => s !== t.validator);
                i.length !== o.length && (n = !0,
                    e.setValidators(i))
            }
        }
        if (t.asyncValidator !== null) {
            let o = cD(e);
            if (Array.isArray(o) && o.length > 0) {
                let i = o.filter(s => s !== t.asyncValidator);
                i.length !== o.length && (n = !0,
                    e.setAsyncValidators(i))
            }
        }
    }
    let r = () => { }
        ;
    return Jc(t._rawValidators, r),
        Jc(t._rawAsyncValidators, r),
        n
}
function TA(e, t) {
    t.valueAccessor.registerOnChange(n => {
        e._pendingValue = n,
            e._pendingChange = !0,
            e._pendingDirty = !0,
            e.updateOn === "change" && fD(e, t)
    }
    )
}
function SA(e, t) {
    t.valueAccessor.registerOnTouched(() => {
        e._pendingTouched = !0,
            e.updateOn === "blur" && e._pendingChange && fD(e, t),
            e.updateOn !== "submit" && e.markAsTouched()
    }
    )
}
function fD(e, t) {
    e._pendingDirty && e.markAsDirty(),
        e.setValue(e._pendingValue, {
            emitModelToViewChange: !1
        }),
        t.viewToModelUpdate(e._pendingValue),
        e._pendingChange = !1
}
function MA(e, t) {
    let n = (r, o) => {
        t.valueAccessor.writeValue(r),
            o && t.viewToModelUpdate(r)
    }
        ;
    e.registerOnChange(n),
        t._registerOnDestroy(() => {
            e._unregisterOnChange(n)
        }
        )
}
function NA(e, t) {
    e == null,
        Fh(e, t)
}
function RA(e, t) {
    return Xc(e, t)
}
function hD(e, t) {
    if (!e.hasOwnProperty("model"))
        return !1;
    let n = e.model;
    return n.isFirstChange() ? !0 : !Object.is(t, n.currentValue)
}
function AA(e) {
    return Object.getPrototypeOf(e.constructor) === sA
}
function xA(e, t) {
    e._syncPendingControls(),
        t.forEach(n => {
            let r = n.control;
            r.updateOn === "submit" && r._pendingChange && (n.viewToModelUpdate(r._pendingValue),
                r._pendingChange = !1)
        }
        )
}
function pD(e, t) {
    if (!t)
        return null;
    Array.isArray(t);
    let n, r, o;
    return t.forEach(i => {
        i.constructor === el ? n = i : AA(i) ? r = i : o = i
    }
    ),
        o || r || n || null
}
function OA(e, t) {
    let n = e.indexOf(t);
    n > -1 && e.splice(n, 1)
}
function QI(e, t) {
    let n = e.indexOf(t);
    n > -1 && e.splice(n, 1)
}
function ZI(e) {
    return typeof e == "object" && e !== null && Object.keys(e).length === 2 && "value" in e && "disabled" in e
}
var mr = class extends Zc {
    defaultValue = null;
    _onChange = [];
    _pendingValue;
    _pendingChange = !1;
    constructor(t = null, n, r) {
        super(uD(n), dD(r, n)),
            this._applyFormState(t),
            this._setUpdateStrategy(n),
            this._initObservables(),
            this.updateValueAndValidity({
                onlySelf: !0,
                emitEvent: !!this.asyncValidator
            }),
            nl(n) && (n.nonNullable || n.initialValueIsDefault) && (ZI(t) ? this.defaultValue = t.value : this.defaultValue = t)
    }
    setValue(t, n = {}) {
        this.value = this._pendingValue = t,
            this._onChange.length && n.emitModelToViewChange !== !1 && this._onChange.forEach(r => r(this.value, n.emitViewToModelChange !== !1)),
            this.updateValueAndValidity(n)
    }
    patchValue(t, n = {}) {
        this.setValue(t, n)
    }
    reset(t = this.defaultValue, n = {}) {
        this._applyFormState(t),
            this.markAsPristine(n),
            this.markAsUntouched(n),
            this.setValue(this.value, n),
            n.overwriteDefaultValue && (this.defaultValue = this.value),
            this._pendingChange = !1,
            n?.emitEvent !== !1 && this._events.next(new Qc(this))
    }
    _updateValue() { }
    _anyControls(t) {
        return !1
    }
    _allControlsDisabled() {
        return this.disabled
    }
    registerOnChange(t) {
        this._onChange.push(t)
    }
    _unregisterOnChange(t) {
        QI(this._onChange, t)
    }
    registerOnDisabledChange(t) {
        this._onDisabledChange.push(t)
    }
    _unregisterOnDisabledChange(t) {
        QI(this._onDisabledChange, t)
    }
    _forEachChild(t) { }
    _syncPendingControls() {
        return this.updateOn === "submit" && (this._pendingDirty && this.markAsDirty(),
            this._pendingTouched && this.markAsTouched(),
            this._pendingChange) ? (this.setValue(this._pendingValue, {
                onlySelf: !0,
                emitModelToViewChange: !1
            }),
                !0) : !1
    }
    _applyFormState(t) {
        ZI(t) ? (this.value = this._pendingValue = t.value,
            t.disabled ? this.disable({
                onlySelf: !0,
                emitEvent: !1
            }) : this.enable({
                onlySelf: !0,
                emitEvent: !1
            })) : this.value = this._pendingValue = t
    }
}
    ;
var kA = e => e instanceof mr;
var gD = (() => {
    class e {
        static \u0275fac = function (r) {
            return new (r || e)
        }
            ;
        static \u0275dir = _e({
            type: e,
            selectors: [["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""]],
            hostAttrs: ["novalidate", ""],
            standalone: !1
        })
    }
    return e
}
)();
var PA = (() => {
    class e extends Eo {
        callSetDisabledState;
        get submitted() {
            return de(this._submittedReactive)
        }
        set submitted(n) {
            this._submittedReactive.set(n)
        }
        _submitted = pe(() => this._submittedReactive());
        _submittedReactive = $(!1);
        _oldForm;
        _onCollectionChange = () => this._updateDomValue();
        directives = [];
        constructor(n, r, o) {
            super(),
                this.callSetDisabledState = o,
                this._setValidators(n),
                this._setAsyncValidators(r)
        }
        ngOnChanges(n) {
            this.onChanges(n)
        }
        ngOnDestroy() {
            this.onDestroy()
        }
        onChanges(n) {
            this._checkFormPresent(),
                n.hasOwnProperty("form") && (this._updateValidators(),
                    this._updateDomValue(),
                    this._updateRegistrations(),
                    this._oldForm = this.form)
        }
        onDestroy() {
            this.form && (Xc(this.form, this),
                this.form._onCollectionChange === this._onCollectionChange && this.form._registerOnCollectionChange(() => { }
                ))
        }
        get formDirective() {
            return this
        }
        get path() {
            return []
        }
        addControl(n) {
            let r = this.form.get(n.path);
            return Rh(r, n, this.callSetDisabledState),
                r.updateValueAndValidity({
                    emitEvent: !1
                }),
                this.directives.push(n),
                r
        }
        getControl(n) {
            return this.form.get(n.path)
        }
        removeControl(n) {
            Kc(n.control || null, n, !1),
                OA(this.directives, n)
        }
        addFormGroup(n) {
            this._setUpFormContainer(n)
        }
        removeFormGroup(n) {
            this._cleanUpFormContainer(n)
        }
        getFormGroup(n) {
            return this.form.get(n.path)
        }
        getFormArray(n) {
            return this.form.get(n.path)
        }
        addFormArray(n) {
            this._setUpFormContainer(n)
        }
        removeFormArray(n) {
            this._cleanUpFormContainer(n)
        }
        updateModel(n, r) {
            this.form.get(n.path).setValue(r)
        }
        onReset() {
            this.resetForm()
        }
        resetForm(n = void 0, r = {}) {
            this.form.reset(n, r),
                this._submittedReactive.set(!1)
        }
        onSubmit(n) {
            return this.submitted = !0,
                xA(this.form, this.directives),
                this.ngSubmit.emit(n),
                this.form._events.next(new Nh(this.control)),
                n?.target?.method === "dialog"
        }
        _updateDomValue() {
            this.directives.forEach(n => {
                let r = n.control
                    , o = this.form.get(n.path);
                r !== o && (Kc(r || null, n),
                    kA(o) && (Rh(o, n, this.callSetDisabledState),
                        n.control = o))
            }
            ),
                this.form._updateTreeValidity({
                    emitEvent: !1
                })
        }
        _setUpFormContainer(n) {
            let r = this.form.get(n.path);
            NA(r, n),
                r.updateValueAndValidity({
                    emitEvent: !1
                })
        }
        _cleanUpFormContainer(n) {
            if (this.form) {
                let r = this.form.get(n.path);
                r && RA(r, n) && r.updateValueAndValidity({
                    emitEvent: !1
                })
            }
        }
        _updateRegistrations() {
            this.form._registerOnCollectionChange(this._onCollectionChange),
                this._oldForm && this._oldForm._registerOnCollectionChange(() => { }
                )
        }
        _updateValidators() {
            Fh(this.form, this),
                this._oldForm && Xc(this._oldForm, this)
        }
        _checkFormPresent() {
            this.form
        }
        static \u0275fac = function (r) {
            return new (r || e)(F(Oh, 10), F(kh, 10), F(Ph, 8))
        }
            ;
        static \u0275dir = _e({
            type: e,
            features: [Ct, jt]
        })
    }
    return e
}
)();
var jh = new v("")
    , LA = {
        provide: cn,
        useExisting: mt(() => Vh)
    }
    , Vh = (() => {
        class e extends cn {
            _ngModelWarningConfig;
            callSetDisabledState;
            viewModel;
            form;
            set isDisabled(n) { }
            model;
            update = new ee;
            static _ngModelWarningSentOnce = !1;
            _ngModelWarningSent = !1;
            constructor(n, r, o, i, s) {
                super(),
                    this._ngModelWarningConfig = i,
                    this.callSetDisabledState = s,
                    this._setValidators(n),
                    this._setAsyncValidators(r),
                    this.valueAccessor = pD(this, o)
            }
            ngOnChanges(n) {
                if (this._isControlChanged(n)) {
                    let r = n.form.previousValue;
                    r && Kc(r, this, !1),
                        Rh(this.form, this, this.callSetDisabledState),
                        this.form.updateValueAndValidity({
                            emitEvent: !1
                        })
                }
                hD(n, this.viewModel) && (this.form.setValue(this.model),
                    this.viewModel = this.model)
            }
            ngOnDestroy() {
                this.form && Kc(this.form, this, !1)
            }
            get path() {
                return []
            }
            get control() {
                return this.form
            }
            viewToModelUpdate(n) {
                this.viewModel = n,
                    this.update.emit(n)
            }
            _isControlChanged(n) {
                return n.hasOwnProperty("form")
            }
            static \u0275fac = function (r) {
                return new (r || e)(F(Oh, 10), F(kh, 10), F(zi, 10), F(jh, 8), F(Ph, 8))
            }
                ;
            static \u0275dir = _e({
                type: e,
                selectors: [["", "formControl", ""]],
                inputs: {
                    form: [0, "formControl", "form"],
                    isDisabled: [0, "disabled", "isDisabled"],
                    model: [0, "ngModel", "model"]
                },
                outputs: {
                    update: "ngModelChange"
                },
                exportAs: ["ngForm"],
                standalone: !1,
                features: [Dn([LA]), Ct, jt]
            })
        }
        return e
    }
    )();
var FA = {
    provide: cn,
    useExisting: mt(() => Uh)
}
    , Uh = (() => {
        class e extends cn {
            _ngModelWarningConfig;
            _added = !1;
            viewModel;
            control;
            name = null;
            set isDisabled(n) { }
            model;
            update = new ee;
            static _ngModelWarningSentOnce = !1;
            _ngModelWarningSent = !1;
            constructor(n, r, o, i, s) {
                super(),
                    this._ngModelWarningConfig = s,
                    this._parent = n,
                    this._setValidators(r),
                    this._setAsyncValidators(o),
                    this.valueAccessor = pD(this, i)
            }
            ngOnChanges(n) {
                this._added || this._setUpControl(),
                    hD(n, this.viewModel) && (this.viewModel = this.model,
                        this.formDirective.updateModel(this, this.model))
            }
            ngOnDestroy() {
                this.formDirective && this.formDirective.removeControl(this)
            }
            viewToModelUpdate(n) {
                this.viewModel = n,
                    this.update.emit(n)
            }
            get path() {
                return wA(this.name == null ? this.name : this.name.toString(), this._parent)
            }
            get formDirective() {
                return this._parent ? this._parent.formDirective : null
            }
            _setUpControl() {
                this.control = this.formDirective.addControl(this),
                    this._added = !0
            }
            static \u0275fac = function (r) {
                return new (r || e)(F(Eo, 13), F(Oh, 10), F(kh, 10), F(zi, 10), F(jh, 8))
            }
                ;
            static \u0275dir = _e({
                type: e,
                selectors: [["", "formControlName", ""]],
                inputs: {
                    name: [0, "formControlName", "name"],
                    isDisabled: [0, "disabled", "isDisabled"],
                    model: [0, "ngModel", "model"]
                },
                outputs: {
                    update: "ngModelChange"
                },
                standalone: !1,
                features: [Dn([FA]), Ct, jt]
            })
        }
        return e
    }
    )();
var jA = {
    provide: Eo,
    useExisting: mt(() => Hh)
}
    , Hh = (() => {
        class e extends PA {
            form = null;
            ngSubmit = new ee;
            get control() {
                return this.form
            }
            static \u0275fac = (() => {
                let n;
                return function (o) {
                    return (n || (n = rr(e)))(o || e)
                }
            }
            )();
            static \u0275dir = _e({
                type: e,
                selectors: [["", "formGroup", ""]],
                hostBindings: function (r, o) {
                    r & 1 && Y("submit", function (s) {
                        return o.onSubmit(s)
                    })("reset", function () {
                        return o.onReset()
                    })
                },
                inputs: {
                    form: [0, "formGroup", "form"]
                },
                outputs: {
                    ngSubmit: "ngSubmit"
                },
                exportAs: ["ngForm"],
                standalone: !1,
                features: [Dn([jA]), Ct]
            })
        }
        return e
    }
    )();
var VA = (() => {
    class e {
        static \u0275fac = function (r) {
            return new (r || e)
        }
            ;
        static \u0275mod = ir({
            type: e
        });
        static \u0275inj = fn({})
    }
    return e
}
)();
var rl = (() => {
    class e {
        static withConfig(n) {
            return {
                ngModule: e,
                providers: [{
                    provide: jh,
                    useValue: n.warnOnNgModelWithFormControl ?? "always"
                }, {
                    provide: Ph,
                    useValue: n.callSetDisabledState ?? Lh
                }]
            }
        }
        static \u0275fac = function (r) {
            return new (r || e)
        }
            ;
        static \u0275mod = ir({
            type: e
        });
        static \u0275inj = fn({
            imports: [VA]
        })
    }
    return e
}
)();
var UA = ["btn", ""]
    , HA = ["*"]
    , Mn = class e {
        constructor(t) {
            this.router = t;
            this.currentPath = this.router.url
        }
        variant = "primary";
        size = "full";
        fill;
        type = "button";
        rounded = "true";
        routerLink = He("");
        active = He(!1);
        activeComputed = pe(() => this.active() || this.routerLink() && this.router.url.startsWith(this.routerLink()));
        onHostClick() {
            this.routerLink() && this.router.navigate([this.routerLink()])
        }
        currentPath;
        ngOnInit() {
            this.router.events.pipe(ze(t => t instanceof nt)).subscribe(t => {
                console.log(this.routerLink(), this.router.url),
                    this.currentPath = t.urlAfterRedirects
            }
            )
        }
        static \u0275fac = function (n) {
            return new (n || e)(F(Be))
        }
            ;
        static \u0275cmp = X({
            type: e,
            selectors: [["button", "btn", ""], ["a", "btn", ""]],
            hostAttrs: [1, "flex", "items-center", "justify-center", "data-[fill=true]:w-full", "data-[fill=false]:w-fit", "h-12", "data-[size=compact]:h-8", "px-3", "text-center", "cursor-pointer", "rounded-md", "text-white", "bg-primary", "data-[variant=secondary]:bg-secondary", "data-[variant=light]:bg-gray-50", "data-[variant=disabled]:bg-disabled", "data-[variant=icon]:bg-transparent", "transition-colors", "duration-500", "hover:bg-primary-darker", "data-[variant=secondary]:hover:bg-secondary-darker", "data-[variant=light]:hover:bg-gray-100", "data-[variant=disabled]:hover:bg-disabled/70", "data-[variant=icon]:hover:bg-gray-100", "data-[variant=black]:bg-black", "data-[variant=black]:hover:bg-black/80", "data-[variant=icon]:rounded-full", "data-[variant=icon]:aspect-square", "data-[variant=icon]:w-12", "data-[variant=icon]:text-current", "data-[variant=icon]:data-[rounded=false]:rounded-none", "data-[active=true]:bg-primary!", "data-[active=true]:text-white!"],
            hostVars: 7,
            hostBindings: function (n, r) {
                n & 1 && Y("click", function () {
                    return r.onHostClick()
                }),
                    n & 2 && en("data-variant", r.variant)("data-size", r.size)("data-fill", r.fill)("type", r.type)("data-active", r.activeComputed())("data-rounded", r.rounded)("routerLink", r.routerLink())
            },
            inputs: {
                variant: "variant",
                size: "size",
                fill: "fill",
                type: "type",
                rounded: "rounded",
                routerLink: [1, "routerLink"],
                active: [1, "active"]
            },
            features: [Dn([{
                provide: zi,
                useExisting: mt(() => e),
                multi: !0
            }])],
            attrs: UA,
            ngContentSelectors: HA,
            decls: 1,
            vars: 0,
            template: function (n, r) {
                n & 1 && (If(),
                    Df(0))
            },
            encapsulation: 2
        })
    }
    ;
function BA(e, t) {
    if (e & 1 && (se(0, "span", 2),
        _(1),
        ae()),
        e & 2) {
        let n = he();
        Z(),
            In(" ", n.errorMessage(), " ")
    }
}
var ol = class e {
    ngControl = p(cn, {
        optional: !0,
        self: !0
    });
    _statusChanges = $(0);
    constructor() {
        this.ngControl && (this.ngControl.valueAccessor = this)
    }
    ngOnInit() {
        this.ngControl && this.ngControl.control && this.ngControl.control.statusChanges.subscribe(() => {
            this._statusChanges.update(t => t + 1)
        }
        )
    }
    value = jf("");
    name = He("");
    type = He("text");
    isDisabled = He(!1);
    label = He("");
    touched = jf(!1);
    disabled = He(!1);
    readonly = He(!1);
    hidden = He(!1);
    invalid = He(!1);
    isInvalid = pe(() => this.invalid() ? !0 : !!this.errorMessage());
    onChange = () => { }
        ;
    onTouched = () => { }
        ;
    writeValue(t) {
        this.value.set(t || "")
    }
    registerOnChange(t) {
        this.onChange = t
    }
    registerOnTouched(t) {
        this.onTouched = t
    }
    _cvaDisabled = $(!1);
    setDisabledState(t) {
        this._cvaDisabled.set(t)
    }
    isInputDisabled = pe(() => this.isDisabled() || this._cvaDisabled());
    errorMessage = pe(() => {
        this._statusChanges();
        let t = this.touched()
            , n = this.ngControl?.control;
        if (!n || !n.touched && !t)
            return null;
        let r = n.errors;
        if (!r)
            return null;
        let o = Object.keys(r)[0];
        return o ? this.getErrorMessage(o, r[o]) : null
    }
    );
    getErrorMessage(t, n) {
        switch (t) {
            case "required":
                return "Este campo \xE9 obrigat\xF3rio";
            case "email":
                return "Email inv\xE1lido";
            case "minlength":
                return `M\xEDnimo de ${n.requiredLength} caracteres`;
            case "invalidCredentials":
                return "Usu\xE1rio ou senha inv\xE1lidos";
            case "invalid":
                return "Campo inv\xE1lido";
            default:
                return "Campo inv\xE1lido"
        }
    }
    handleInput(t) {
        let n = t.target.value;
        this.value.set(n),
            this.onChange(n),
            this.touched.set(!0)
    }
    handleBlur() {
        this.touched.set(!0),
            this.onTouched()
    }
    static \u0275fac = function (n) {
        return new (n || e)
    }
        ;
    static \u0275cmp = X({
        type: e,
        selectors: [["field"]],
        hostAttrs: [1, "relative", "w-full", "px-2", "pt-4", "pb-1", "rounded-sm", "border", "border-gray-300", "bg-gray-100", "data-[invalid=true]:border-red-500"],
        hostVars: 1,
        hostBindings: function (n, r) {
            n & 2 && en("data-invalid", r.isInvalid())
        },
        inputs: {
            value: [1, "value"],
            name: [1, "name"],
            type: [1, "type"],
            isDisabled: [1, "isDisabled"],
            label: [1, "label"],
            touched: [1, "touched"],
            disabled: [1, "disabled"],
            readonly: [1, "readonly"],
            hidden: [1, "hidden"],
            invalid: [1, "invalid"]
        },
        outputs: {
            value: "valueChange",
            touched: "touchedChange"
        },
        decls: 5,
        vars: 6,
        consts: [["autocomplete", "off", "placeholder", "", 1, "peer", "w-full", "outline-none", "border-none", "bg-transparent!", 3, "input", "blur", "id", "type", "value", "disabled"], [1, "absolute", "left-2", "top-px", "text-xs", "leading-normal", "pointer-events-none", "peer-placeholder-shown:peer-not-focus:top-3", "peer-placeholder-shown:peer-not-focus:text-base", "peer-placeholder-shown:peer-not-focus:text-gray-500", "transition-all", "duration-300"], [1, "text-xs", "text-red-500", "mt-1", "block", "px-2"]],
        template: function (n, r) {
            n & 1 && (se(0, "label")(1, "input", 0),
                Qa("input", function (i) {
                    return r.handleInput(i)
                })("blur", function () {
                    return r.handleBlur()
                }),
                ae(),
                se(2, "span", 1),
                _(3),
                ae()(),
                ut(4, BA, 2, 1, "span", 2)),
                n & 2 && (Z(),
                    Wa("id", r.name())("type", r.type())("value", r.value())("disabled", r.isInputDisabled()),
                    Z(2),
                    In(" ", r.label(), " "),
                    Z(),
                    dt(r.errorMessage() ? 4 : -1))
        },
        encapsulation: 2,
        changeDetection: 0
    })
}
    ;
function $A(e, t) {
    if (e & 1) {
        let n = ar();
        I(0, "div", 11),
            Y("click", function () {
                Pe(n);
                let o = he();
                return Le(o.closeModalOutside())
            }),
            I(1, "div", 12),
            Y("click", function (o) {
                return Pe(n),
                    Le(o.stopPropagation())
            }),
            I(2, "p", 13),
            _(3, "Seu login est\xE1 incorreto, quer continuar?"),
            T(),
            I(4, "button", 14),
            Y("click", function () {
                Pe(n);
                let o = he();
                return Le(o.closeModal())
            }),
            _(5, "Continuar"),
            T()()()
    }
}
var il = class e {
    router = p(Be);
    showModal = $(!1);
    loginForm = new Yc({
        email: new mr("", {
            nonNullable: !0,
            validators: [an.required, an.email]
        }),
        password: new mr("", {
            nonNullable: !0,
            validators: [an.required]
        })
    });
    onSubmit() {
        let { email: t, password: n } = this.loginForm.value;
        t === "qa@test.com" && n === "123456" ? this.showModal.set(!0) : (this.loginForm.setErrors({
            invalidCredentials: !0
        }),
            this.loginForm.markAllAsTouched(),
            this.loginForm.get("email")?.setErrors({
                invalidCredentials: !0
            }),
            this.loginForm.get("password")?.setErrors({
                invalidCredentials: !0
            }))
    }
    closeModal() {
        this.showModal.set(!1),
            this.router.navigate(["/dashboard"])
    }
    closeModalOutside() {
        this.showModal.set(!1)
    }
    createAccHandler() {
        alert("Conta criada! Email: qa@test.com, senha: 123456")
    }
    weNeverForget() {
        alert("N\xE3o esqueceu n\xE3o! Conte at\xE9 6 \u{1F9D8} para lembrar")
    }
    static \u0275fac = function (n) {
        return new (n || e)
    }
        ;
    static \u0275cmp = X({
        type: e,
        selectors: [["ng-component"]],
        decls: 14,
        vars: 2,
        consts: [[1, "w-full", "h-screen", "grid", "grid-cols-[1fr_1fr]", "bg-white"], [1, "p-16", "w-full", "max-w-lg", "mx-auto", "flex", "flex-col", "gap-4", "items-center"], ["src", "https://app.colmeia.me/assets/img/logo/logo-324x54-black.png", "width", "160", "height", "32", "alt", "Colmeia logo", "aria-hidden", "true", 1, "object-contain"], [1, "w-full", "flex", "flex-col", "gap-4", "items-center", 3, "ngSubmit", "formGroup"], [1, "block", "w-full", "text-lg", "text-start"], ["type", "email", "name", "email", "label", "Email", "formControlName", "email"], ["type", "password", "name", "password", "label", "Password", "formControlName", "password"], [1, "mt-4", "w-full", "text-primary", "text-start", "cursor-pointer"], ["btn", "", "type", "submit", "fill", "true", "size", "compact", "variant", "secondary"], ["alt", "", "aria-hidden", "true", "src", "https://app.colmeia.me/bg-1.d7074eeb82c8a601.webp", 1, "w-full", "h-full", "object-cover"], [1, "fixed", "inset-0", "bg-black/50", "flex", "items-center", "justify-center", "z-50"], [1, "fixed", "inset-0", "bg-black/50", "flex", "items-center", "justify-center", "z-50", 3, "click"], [1, "flex", "flex-col", "items-center", "gap-6", "p-8", "rounded-lg", "bg-white", "max-w-md", 3, "click"], [1, "text-lg", "text-center"], ["btn", "", "variant", "secondary", "size", "compact", "fill", "true", 3, "click"]],
        template: function (n, r) {
            n & 1 && (I(0, "article", 0)(1, "main", 1),
                H(2, "img", 2),
                I(3, "form", 3),
                Y("ngSubmit", function () {
                    return r.onSubmit()
                }),
                I(4, "span", 4),
                _(5, "Login"),
                T(),
                H(6, "field", 5)(7, "field", 6),
                I(8, "a", 7),
                _(9, "Esqueceu sua senha?"),
                T(),
                I(10, "button", 8),
                _(11, "Entrar"),
                T()()(),
                H(12, "img", 9),
                ut(13, $A, 6, 0, "div", 10),
                T()),
                n & 2 && (Z(3),
                    bt("formGroup", r.loginForm),
                    Z(10),
                    dt(r.showModal() ? 13 : -1))
        },
        dependencies: [Mn, ol, rl, gD, tl, lD, Hh, Uh],
        encapsulation: 2
    })
}
    ;
var sl = class e {
    static \u0275fac = function (n) {
        return new (n || e)
    }
        ;
    static \u0275cmp = X({
        type: e,
        selectors: [["ng-component"]],
        decls: 40,
        vars: 0,
        consts: [[1, "w-full", "h-screen", "bg-primary/10", "flex", "items-center", "justify-center"], [1, "flex", "flex-col", "items-center", "gap-4"], [1, "text-4xl", "font-bold"], [1, "text-lg"], [1, "list-"], [1, "ml-4", "list-decimal"], [1, "ml-4", "list-decimal", "[&>ul]:mt-2", "[&>ul_ul]:mb-2"]],
        template: function (n, r) {
            n & 1 && (se(0, "main", 0)(1, "div", 1)(2, "h1", 2),
                _(3, "Easter Eggs"),
                ae(),
                se(4, "p", 3),
                _(5, "Parab\xE9ns! Voc\xEA encontrou os Easter Eggs!"),
                ae(),
                se(6, "p"),
                _(7, "Lista de easter eggs no site:"),
                ae(),
                se(8, "ul", 4)(9, "li")(10, "b"),
                _(11, "Login"),
                ae(),
                _(12, ": "),
                se(13, "ul", 5)(14, "li"),
                _(15, 'Bot\xE3o "Esqueceu sua senha" n\xE3o funciona'),
                ae(),
                se(16, "li"),
                _(17, 'Ao usu\xE1rio se logar corretamente, aparece um popup dizendo que o login est\xE1 incorreto, mas ao clicar em "Continuar" o login ocorre normalmente'),
                ae()()(),
                se(18, "li")(19, "b"),
                _(20, "Banco de Dados"),
                ae(),
                _(21, ": "),
                se(22, "ul", 6)(23, "li"),
                _(24, "Bot\xE3o de lupa da pesquisa n\xE3o funciona, a pesquisa ocorre apenas digitando no campo de pesquisa, sem a necessidade de clicar na lupa para buscar itens"),
                ae(),
                se(25, "li"),
                _(26, "Quando removemos todos os itens n\xE3o volta a exibir o aviso de \u201CNenhum banco de dados encontrado\u201D"),
                ae(),
                se(27, "li"),
                _(28, "Bot\xE3o de refresh funciona como um f5 e ao clicado remove todos os itens da lista"),
                ae(),
                se(29, "li"),
                _(30, "Bot\xE3o para arquivar item est\xE1 com a mesma fun\xE7\xE3o de apagar item"),
                ae(),
                se(31, "li"),
                _(32, "O sistema permite incluir um item em branco se insistirmos com o campo em branco mesmo ap\xF3s receber o erro de campo inv\xE1lido"),
                ae()()(),
                se(33, "li")(34, "b"),
                _(35, "Colmeia Forms"),
                ae(),
                _(36, ": "),
                se(37, "ul", 6)(38, "li"),
                _(39, "P\xE1gina em branco"),
                ae()()()()()())
        },
        encapsulation: 2
    })
}
    ;
var al = class e {
    router = p(Be);
    currentUri = pe(() => this.router.url);
    static \u0275fac = function (n) {
        return new (n || e)
    }
        ;
    static \u0275cmp = X({
        type: e,
        selectors: [["ng-component"]],
        decls: 26,
        vars: 0,
        consts: [[1, "w-full", "h-screen", "overflow-hidden", "grid", "grid-rows-[auto_1fr]", "gap-4"], [1, "w-full", "h-16", "px-4", "flex", "items-center", "justify-between", "border-b", "border-b-gray-100"], [1, "flex", "items-center", "gap-2", "text-xl", "font-bold"], ["src", "/assets/img/colmeia-logo.png", "alt", "Colmeia", "width", "26", "height", "26", 1, "max-h-full", "object-contain"], [1, "flex", "items-center"], [1, "ml-3", "flex", "items-center", "gap-3"], [1, "rounded-full", "border-2", "border-primary"], ["xmlns", "http://www.w3.org/2000/svg", "enable-background", "new 0 0 24 24", "height", "24px", "viewBox", "0 0 24 24", "width", "24px", "fill", "currentColor"], ["fill", "none", "height", "24", "width", "24"], ["d", "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 6.14 2.12C16.43 19.18 14.03 20 12 20z"], [1, "flex", "items-center", "gap-1", "text-sm"], ["xmlns", "http://www.w3.org/2000/svg", "height", "20px", "viewBox", "0 0 24 24", "width", "20px", "fill", "currentColor"], ["d", "M0 0h24v24H0z", "fill", "none"], ["d", "M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"], [1, "flex", "gap-2", "h-full", "p-4"], [1, "flex", "flex-col", "gap-4", "p-2", "rounded-xl", "bg-white"], ["btn", "", "variant", "icon", "routerLink", "/dashboard/campanha"], ["xmlns", "http://www.w3.org/2000/svg", "height", "24px", "viewBox", "0 0 24 24", "width", "24px", "fill", "currentColor"], ["d", "M18 11v2h4v-2h-4zm-2 6.61c.96.71 2.21 1.65 3.2 2.39.4-.53.8-1.07 1.2-1.6-.99-.74-2.24-1.68-3.2-2.4-.4.54-.8 1.08-1.2 1.61zM20.4 5.6c-.4-.53-.8-1.07-1.2-1.6-.99.74-2.24 1.68-3.2 2.4.4.53.8 1.07 1.2 1.6.96-.72 2.21-1.65 3.2-2.4zM4 9c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1v4h2v-4h1l5 3V6L8 9H4zm11.5 3c0-1.33-.58-2.53-1.5-3.35v6.69c.92-.81 1.5-2.01 1.5-3.34z"]],
        template: function (n, r) {
            n & 1 && (I(0, "div", 0)(1, "header", 1)(2, "div", 2),
                H(3, "img", 3),
                I(4, "span"),
                _(5, "Colmeia"),
                T()(),
                I(6, "div", 4)(7, "button", 5)(8, "div", 6),
                je(),
                I(9, "svg", 7)(10, "g"),
                H(11, "rect", 8),
                T(),
                I(12, "g"),
                H(13, "path", 9),
                T()()(),
                at(),
                I(14, "span", 10),
                _(15, " Candidato "),
                je(),
                I(16, "svg", 11),
                H(17, "path", 12)(18, "path", 13),
                T()()()()(),
                at(),
                I(19, "div", 14)(20, "aside", 15)(21, "a", 16),
                je(),
                I(22, "svg", 17),
                H(23, "path", 12)(24, "path", 18),
                T()()(),
                at(),
                H(25, "router-outlet"),
                T()())
        },
        dependencies: [Mn, sn],
        encapsulation: 2
    })
}
    ;
var zA = ["inputField"];
function GA(e, t) {
    e & 1 && (I(0, "div", 18)(1, "h3"),
        _(2, "Itens Arquivados"),
        T()())
}
function qA(e, t) {
    if (e & 1) {
        let n = ar();
        I(0, "tr")(1, "td"),
            _(2),
            T(),
            I(3, "td"),
            _(4),
            T(),
            I(5, "td")(6, "div")(7, "button", 22),
            Y("click", function () {
                let o = Pe(n).$implicit
                    , i = he(3);
                return Le(i.removeItem(o.id))
            }),
            je(),
            I(8, "svg", 23),
            H(9, "path", 13)(10, "path", 24),
            T()(),
            at(),
            I(11, "button", 25),
            Y("click", function () {
                let o = Pe(n).$implicit
                    , i = he(3);
                return Le(i.removeItem(o.id))
            }),
            je(),
            I(12, "svg", 26),
            H(13, "path", 27),
            T()()()()()
    }
    if (e & 2) {
        let n = t.$implicit;
        Z(2),
            tn(n.nome),
            Z(2),
            tn(n.dataCriacao)
    }
}
function WA(e, t) {
    if (e & 1 && eo(0, qA, 14, 2, "tr", null, qa),
        e & 2) {
        let n = he(2);
        to(n.filteredItems())
    }
}
function QA(e, t) {
    if (e & 1 && _(0),
        e & 2) {
        let n = he(3);
        In(' Nenhum resultado encontrado para "', n.searchTerm(), '" ')
    }
}
function ZA(e, t) {
    e & 1 && _(0, " Nenhum banco de dados encontrado ")
}
function YA(e, t) {
    if (e & 1 && (I(0, "tr")(1, "td", 28),
        ut(2, QA, 1, 1)(3, ZA, 1, 0),
        T(),
        H(4, "td")(5, "td"),
        T()),
        e & 2) {
        let n = he(2);
        Z(2),
            dt(n.searchTerm() ? 2 : 3)
    }
}
function KA(e, t) {
    if (e & 1 && ut(0, WA, 2, 0)(1, YA, 6, 1, "tr"),
        e & 2) {
        let n = he();
        dt(n.filteredItems().length > 0 ? 0 : n.hasDeletedItems() ? -1 : 1)
    }
}
function JA(e, t) {
    if (e & 1) {
        let n = ar();
        I(0, "tr")(1, "td"),
            _(2),
            T(),
            I(3, "td"),
            _(4),
            T(),
            I(5, "td")(6, "div")(7, "button", 29),
            Y("click", function () {
                let o = Pe(n).$implicit
                    , i = he(2);
                return Le(i.removeItem(o.id))
            }),
            je(),
            I(8, "svg", 23),
            H(9, "path", 13)(10, "path", 24),
            T()()()()()
    }
    if (e & 2) {
        let n = t.$implicit;
        Z(2),
            tn(n.nome),
            Z(2),
            tn(n.dataCriacao)
    }
}
function XA(e, t) {
    if (e & 1 && eo(0, JA, 11, 2, "tr", null, qa),
        e & 2) {
        let n = he();
        to(n.archivedItems())
    }
}
function ex(e, t) {
    e & 1 && (I(0, "p", 35),
        _(1, "O nome do item \xE9 obrigat\xF3rio"),
        T())
}
function tx(e, t) {
    if (e & 1) {
        let n = ar();
        I(0, "div", 30),
            Y("click", function () {
                Pe(n);
                let o = he();
                return Le(o.closeModalOutside())
            }),
            I(1, "div", 31),
            Y("click", function (o) {
                return Pe(n),
                    Le(o.stopPropagation())
            }),
            I(2, "h2", 32),
            _(3, "Adicionar novo item"),
            T(),
            I(4, "div", 33)(5, "input", 34, 0),
            Y("keydown.enter", function () {
                Pe(n);
                let o = he();
                return Le(o.addItem())
            })("input", function () {
                Pe(n);
                let o = he();
                return Le(o.showError.set(!1))
            }),
            T(),
            ut(7, ex, 2, 0, "p", 35),
            T(),
            I(8, "button", 36),
            Y("click", function (o) {
                return Pe(n),
                    he().addItem(),
                    Le(o.stopPropagation())
            }),
            _(9, "Salvar"),
            T()()()
    }
    if (e & 2) {
        let n = he();
        Z(5),
            cr("border-red-500", n.showError())("border-gray-200", !n.showError()),
            bt("formControl", n.newItemControl),
            Z(2),
            dt(n.showError() ? 7 : -1)
    }
}
var cl = class e {
    router = p(Be);
    items = $([]);
    hasDeletedItems = $(!1);
    searchControl = new mr("");
    searchTerm = $("");
    filteredItems = pe(() => {
        let t = this.searchTerm().toLowerCase().trim();
        return t ? this.items().filter(n => n.nome.toLowerCase().includes(t)) : this.items()
    }
    );
    archivedItems = $([]);
    showArchived = $(!1);
    toggleArchived() {
        this.showArchived.update(t => !t),
            console.log("Mostrar itens arquivados:", this.showArchived())
    }
    newItemControl = new mr("", [an.required, an.minLength(1)]);
    showModal = $(!1);
    showError = $(!1);
    errorAttempts = $(0);
    inputField = TE("inputField");
    constructor() {
        zo(() => {
            this.searchControl.valueChanges.subscribe(t => {
                this.searchTerm.set(t || "")
            }
            )
        }
        ),
            zo(() => {
                this.showModal() && this.inputField() && setTimeout(() => {
                    this.inputField()?.nativeElement.focus()
                }
                    , 0)
            }
            )
    }
    closeModalOutside() {
        this.showModal.set(!1),
            this.showError.set(!1),
            this.errorAttempts.set(0),
            this.newItemControl.reset()
    }
    addItem() {
        let t = this.newItemControl.value?.trim() || "";
        if (!t && (this.errorAttempts.update(n => n + 1),
            this.errorAttempts() === 1)) {
            this.showError.set(!0);
            return
        }
        this.items.update(n => [...n, {
            id: this.items().length + 1,
            nome: t,
            dataCriacao: new Date().toISOString().split("T")[0],
            status: "Ativo"
        }]),
            this.showModal.set(!1),
            this.showError.set(!1),
            this.errorAttempts.set(0),
            this.newItemControl.reset()
    }
    removeItem(t) {
        this.items.update(n => n.filter(r => r.id !== t)),
            this.hasDeletedItems.update(n => !0)
    }
    reloadPage() {
        let t = this.router.url;
        this.router.navigateByUrl("/", {
            skipLocationChange: !0
        }).then(() => {
            this.router.navigate([t])
        }
        )
    }
    static \u0275fac = function (n) {
        return new (n || e)
    }
        ;
    static \u0275cmp = X({
        type: e,
        selectors: [["ng-component"]],
        viewQuery: function (n, r) {
            n & 1 && Ya(r.inputField, zA, 5),
                n & 2 && wf()
        },
        hostAttrs: [1, "grow", "h-full"],
        decls: 38,
        vars: 6,
        consts: [["inputField", ""], [1, "mb-4", "text-3xl"], [1, "w-full", "px-3", "py-1", "mb-4", "flex", "justify-between", "gap-4", "border-3", "border-gray-200", "bg-white"], [1, "flex", "items-center", "gap-2"], ["btn", "", "variant", "icon", 3, "click"], ["xmlns", "http://www.w3.org/2000/svg", "height", "24px", "viewBox", "0 0 24 24", "width", "24px", "fill", "currentColor"], ["d", "M0 0h24v24H0V0z", "fill", "none"], ["d", "M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-1-2-2-2zm-5 12H9v-2h6v2zm5-7H4V4l16-.02V7z"], [1, "w-px", "h-[80%]", "text-transparent", "bg-gray-200"], [1, "flex", "items-center", "gap-2", "py-2", "px-2", "border", "border-gray-200", "bg-gray-100", "rounded-sm"], ["type", "search", "placeholder", "Pesquisar", 1, "w-full", "outline-none", "border-none", "bg-transparent", 3, "formControl"], ["type", "button", 1, "flex-shrink-0", "cursor-pointer"], ["d", "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"], ["d", "M0 0h24v24H0z", "fill", "none"], ["d", "M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"], ["btn", "", "size", "compact", "variant", "black", 1, "flex", "items-center", "gap-2", 3, "click"], ["xmlns", "http://www.w3.org/2000/svg", "height", "20px", "viewBox", "0 0 24 24", "width", "20px", "fill", "#e3e3e3"], ["d", "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"], [1, "mb-3", "px-4"], [1, "w-full", "border-3", "border-gray-200", "bg-white", "[&_th]:p-4", "[&_td]:px-4"], [1, "text-left"], [1, "fixed", "inset-0", "bg-black/50", "flex", "items-center", "justify-center", "z-50"], ["title", "Apagar", 1, "cursor-pointer", "rounded-full", "aspect-square", "w-8", "text-red-100", "hover:text-red-400", "transition-colors", 3, "click"], ["xmlns", "http://www.w3.org/2000/svg", "height", "20px", "viewBox", "0 0 24 24", "width", "20px", "fill", "currentColor"], ["d", "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"], ["title", "Arquivar", 1, "cursor-pointer", "rounded-full", "aspect-square", "w-8", "text-blue-100", "hover:text-blue-400", "transition-colors", 3, "click"], ["xmlns", "http://www.w3.org/2000/svg", "width", "16", "height", "16", "fill", "currentColor", "viewBox", "0 0 16 16", 1, "bi", "bi-archive-fill"], ["d", "M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8z"], ["colspan", "3", 1, "text-center", "pb-2", 2, "padding-bottom", "20px", "padding-top", "10px"], [1, "cursor-pointer", "rounded-full", "aspect-square", "w-8", "text-red-100", "hover:text-red-400", "transition-colors", 3, "click"], [1, "fixed", "inset-0", "bg-black/50", "flex", "items-center", "justify-center", "z-50", 3, "click"], [1, "flex", "flex-col", "items-end", "gap-4", "p-4", "rounded-lg", "bg-white", 3, "click"], [1, "text-2xl"], [1, "w-full"], ["type", "text", "placeholder", "Nome do item", "autofocus", "", 1, "w-full", "outline-none", "border", "border-gray-200", "p-2", "rounded-sm", 3, "keydown.enter", "input", "formControl"], [1, "text-red-500", "text-sm", "mt-1"], ["btn", "", "variant", "black", "size", "compact", "fill", "false", 3, "click"]],
        template: function (n, r) {
            n & 1 && (I(0, "h2", 1),
                _(1, "Bancos de dados"),
                T(),
                I(2, "div", 2)(3, "div", 3)(4, "button", 4),
                Y("click", function (i) {
                    return r.toggleArchived(),
                        i.stopPropagation()
                }),
                je(),
                I(5, "svg", 5),
                H(6, "path", 6)(7, "path", 7),
                T()(),
                at(),
                H(8, "hr", 8),
                I(9, "div", 9),
                H(10, "input", 10),
                I(11, "button", 11),
                je(),
                I(12, "svg", 5),
                H(13, "path", 6)(14, "path", 12),
                T()()()(),
                at(),
                I(15, "div", 3)(16, "button", 4),
                Y("click", function () {
                    return r.reloadPage()
                }),
                je(),
                I(17, "svg", 5),
                H(18, "path", 13)(19, "path", 14),
                T()(),
                at(),
                I(20, "button", 15),
                Y("click", function () {
                    return r.showModal.set(!0)
                }),
                je(),
                I(21, "svg", 16),
                H(22, "path", 13)(23, "path", 17),
                T(),
                _(24, " Criar "),
                T()()(),
                ut(25, GA, 3, 0, "div", 18),
                at(),
                I(26, "table", 19)(27, "thead")(28, "tr")(29, "th", 20),
                _(30, "Nome do banco de dados"),
                T(),
                I(31, "th", 20),
                _(32, "Data de cria\xE7\xE3o"),
                T(),
                H(33, "th"),
                T()(),
                I(34, "tbody"),
                ut(35, KA, 2, 1)(36, XA, 2, 0),
                T()(),
                ut(37, tx, 10, 6, "div", 21)),
                n & 2 && (Z(5),
                    pi(r.showArchived() ? "text-red-300" : ""),
                    Z(5),
                    bt("formControl", r.searchControl),
                    Z(15),
                    dt(r.showArchived() ? 25 : -1),
                    Z(10),
                    dt(r.showArchived() ? 36 : 35),
                    Z(2),
                    dt(r.showModal() ? 37 : -1))
        },
        dependencies: [Mn, rl, el, tl, Vh],
        encapsulation: 2
    })
}
    ;
var ll = class e {
    static \u0275fac = function (n) {
        return new (n || e)
    }
        ;
    static \u0275cmp = X({
        type: e,
        selectors: [["ng-component"]],
        decls: 0,
        vars: 0,
        template: function (n, r) { },
        encapsulation: 2
    })
}
    ;
var nx = (e, t) => t.label;
function rx(e, t) {
    if (e & 1 && (I(0, "li", 2)(1, "a", 3),
        _(2),
        T()()),
        e & 2) {
        let n = t.$implicit;
        pi(`
                block
                py-2 pl-4 pr-16
                text-sm
                hover:bg-gray-100
                cursor-pointer
                transition-colors
                rounded-sm
            `),
            Z(),
            bt("routerLink", n.route),
            Z(),
            tn(n.label)
    }
}
var ul = class e {
    items = [];
    static \u0275fac = function (n) {
        return new (n || e)
    }
        ;
    static \u0275cmp = X({
        type: e,
        selectors: [["menu"]],
        inputs: {
            items: "items"
        },
        decls: 3,
        vars: 0,
        consts: [[1, "flex", "flex-col", "gap-2"], ["routerLinkActive", "bg-primary text-white hover:bg-primary-darker", "ariaCurrentWhenActive", "page", 3, "class"], ["routerLinkActive", "bg-primary text-white hover:bg-primary-darker", "ariaCurrentWhenActive", "page"], [3, "routerLink"]],
        template: function (n, r) {
            n & 1 && (I(0, "ul", 0),
                eo(1, rx, 3, 4, "li", 1, nx),
                T()),
                n & 2 && (Z(),
                    to(r.items))
        },
        dependencies: [Th, mo],
        encapsulation: 2
    })
}
    ;
var ox = () => ({
    label: "Bancos de dados",
    route: "/dashboard/campanha/bancos-de-dados"
})
    , ix = () => ({
        label: "Colmeia Forms",
        route: "/dashboard/campanha/colmeia-forms"
    })
    , sx = (e, t) => [e, t]
    , dl = class e {
        static \u0275fac = function (n) {
            return new (n || e)
        }
            ;
        static \u0275cmp = X({
            type: e,
            selectors: [["ng-component"]],
            hostAttrs: [1, "w-full", "h-full", "flex", "gap-4", "px-2", "py-4"],
            decls: 5,
            vars: 6,
            consts: [[1, "flex", "flex-col", "gap-4", "rounded-xl", "bg-white"], [1, "ml-4", "text-xl", "font-bold"], [3, "items"]],
            template: function (n, r) {
                n & 1 && (I(0, "div", 0)(1, "h3", 1),
                    _(2, "Campanha"),
                    T(),
                    H(3, "menu", 2),
                    T(),
                    H(4, "router-outlet")),
                    n & 2 && (Z(3),
                        bt("items", _f(3, sx, Ka(1, ox), Ka(2, ix))))
            },
            dependencies: [ul, sn],
            encapsulation: 2
        })
    }
    ;
var vD = [{
    path: "",
    component: il
}, {
    path: "dashboard",
    component: al,
    children: [{
        path: "campanha",
        component: dl,
        children: [{
            path: "bancos-de-dados",
            component: cl
        }, {
            path: "colmeia-forms",
            component: ll
        }]
    }]
}, {
    path: "easter-eggs",
    component: sl
}];
var yD = {
    providers: [$u(), Sh(vD), ZE(QE())]
};
var fl = class e {
    title = $("qa-teste-pratico");
    static \u0275fac = function (n) {
        return new (n || e)
    }
        ;
    static \u0275cmp = X({
        type: e,
        selectors: [["app-root"]],
        decls: 1,
        vars: 0,
        template: function (n, r) {
            n & 1 && H(0, "router-outlet")
        },
        dependencies: [sn],
        encapsulation: 2
    })
}
    ;
Qf(fl, yD).catch(e => console.error(e));
