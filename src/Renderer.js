import Vue from 'vue/dist/vue.esm.js';
import EventEmitter from 'EventEmitter'

import { Uint8ToBase64, getDigits, nextTick } from 'Helpers'

import * as components from 'VueComponents'
import * as helpers from 'VueHelpers'
import * as directives from 'VueDirectives'

const vueResources = {
  components: {},
  helpers: Object.assign({}, helpers),
  directives: Object.assign({}, directives)
};
for (var componentKey in components) {
  if (components.hasOwnProperty(componentKey)) {
    const component = components[componentKey];
    vueResources.components[component.name] = component;
  }
}



export default class Renderer extends EventEmitter {
  constructor(componentModuleNameSpace) {

    super();

    this.__component = componentModuleNameSpace;
    this.__init();
    this.__initProxy();
  }
  __init() {
    const self = this;

    const TemplateComponentClass = Vue.extend(this.__component.default);
    const instance = new TemplateComponentClass();
    instance.$mount(); // pass nothing


    this.Vue = instance;
    this.context = instance.$el;

    if (this.Vue.__animate) {
      this.animations = this.Vue.__animate();
    }
    this.Vue.$forceUpdate();

  }
  listenForResources() {
    const images = new Array().concat(Array.from(this.context.getElementsByTagName("image")), Array.from(this.context.getElementsByTagName("img")));
    return Promise.all(images.map(image => {
      return new Promise(function(resolve, reject) {
        image.addEventListener("load", function() {
          resolve(true);
        });
      });
    }));
  }
  fixSVGIussues(key) {
    const emptyValues = {
      'string': ''
    };

    const value = this.data[key].__value;

    const dataType = typeof value;
    if (dataType in emptyValues) {
      this.data[key] = emptyValues[dataType];
      setTimeout(() => {
        this.data[key] = value;
      });
    }
    else {
      console.error("No empty value registered :(");
    }
  }
  __initProxy() {
    const self = this;

    this.fields = {};
    for (var fieldDescriptor of this.__component.fields) {
      this.fields[fieldDescriptor.key] = fieldDescriptor;
    }

    // Using a proxy to interact with the vue instance from outside
    // This is because we can serve a lot of information such as 'description' & 'type' ([Getter]) but keep the setting API easy ([Setter])
    this.data = new Proxy(this.Vue._data, {
      get(obj, propName, receiver) {
        if (propName === Symbol.iterator) {
          return obj[Symbol.iterator].bind(obj);
        }
        // Trying to get a field whose 'key' is the requested property name
        const field = self.fields[propName];

        if (!field) {
          //console.error("You requested a data property that has no related field ('" + propName + "')");
        }

        return {
          key: propName,
          //field: field,
          __value: obj[propName]
        };
      },
      has(target, key) {
        return key in target;
      },
      set(obj, propName, value) {
        // Trying to get a field whose 'key' is the requested property name
        const field = self.fields[propName];

        if (!field) {
          //console.error("You requested a data property that has no related field ('" + propName + "')");
        }

        self.listenForResources();

        // Set value to Vue instance
        self.Vue[propName] = value;

        self.emit("set", {
          key: propName,
          value: value
        });
        self.emit("update", {
          key: propName,
          value: value
        });

        return true;

      }
    });
  }
  restartAnimations() {

    if (this.animations) {
      for (let animation of this.animations) {
        animation.restart();
      }
    }

  }
  seekAnimations(timestamp) {

    return this.animations.map(animation => animation.seek(timestamp))

  }
  kill() {
    this.Vue.$destroy();
    this.emit("kill");
  }
  get dataset() {
    const baseObj = Object.assign({}, this.data);
    for (let key in baseObj) {
      if (baseObj.hasOwnProperty(key) && key != '_asyncComputed') {
        baseObj[key] = baseObj[key].__value;
      }
    }
    return baseObj;
  }
  set dataset(data) {
    for (let keyName in data) {
      try {
        this.data[keyName] = data[keyName];
      }
      catch (e) {}

    }
  }
}
