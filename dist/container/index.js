function l(o, c, r) {
  return {
    asConstant(n) {
      const e = () => n;
      c.set(r.symbol, e);
    },
    asSingleton(n) {
      const e = { value: null }, s = () => (console.log("resolving singleton", e.value), e.value === null && (e.value = n(o)), e.value);
      c.set(r.symbol, s);
    },
    asFactory(n) {
      c.set(r.symbol, () => n(o));
    }
  };
}
function u() {
  const o = /* @__PURE__ */ new Map(), c = (n, e, s) => {
    console.log("Loading registry", s), Object.entries(s).forEach(([a, t]) => {
      const i = n.register(e[a]);
      if ("isConstant" in t && t.isConstant && t.value)
        return i.asConstant(t.value);
      if ("factory" in t && t.isSingleton && t.factory)
        return i.asSingleton(t.factory);
      if ("factory" in t && t.factory)
        return i.asFactory(t.factory);
      throw new Error("Unexpected dependency registry definition");
    });
  }, r = {
    get({ symbol: n }) {
      var e;
      if (o.has(n))
        return (e = o.get(n)) == null ? void 0 : e();
      throw new Error(
        `DependencyNotFound: The dependency [${n.description}] has not been provided`
      );
    },
    register(n) {
      return l(r, o, n);
    },
    registry({ registry: n, modules: e, tokens: s }) {
      c(r, s, n), Object.entries(e != null ? e : {}).forEach(
        ([a, t]) => c(
          r,
          s[a],
          t
        )
      ), console.log();
    }
  };
  return r;
}
function f(o) {
  return {
    get symbol() {
      return Symbol.for(o);
    }
  };
}
function g(o, { modules: c = {} } = {}) {
  const r = /* @__PURE__ */ new Map();
  return Object.entries(o).forEach(([n]) => {
    r.set(n, f(n));
  }), Object.entries(c).forEach(([n, e]) => {
    const s = /* @__PURE__ */ new Map();
    Object.entries(e).forEach(([a]) => {
      s.set(
        a,
        f(`${n}.${a}`)
      );
    }), r.set(n, Object.fromEntries(s.entries()));
  }), {
    registry: o,
    modules: c,
    tokens: Object.fromEntries(r.entries())
  };
}
export {
  u as createContainer,
  l as createDependency,
  g as createRegistry,
  f as createToken
};
