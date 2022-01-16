import { createApp } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { createStore } from 'vuex'
import { shallowMount } from '@vue/test-utils'

import {
  State,
  Getter,
  Action,
  Mutation,
  namespace
} from '../src/bindings'

describe('binding helpers', () => {
  it('State: type', () => {
    const store = createStore({
      state: { value: 1}
    })

    @Options({
      template: 'Value: {{ foo }}',
    })
    class MyComp extends Vue {
      @State('value') foo: number;
    }

    const wrapper = shallowMount(MyComp, {
      global: {
        plugins: [store]
      }
    })

    expect(wrapper.vm.foo).toBe(1)
    expect(wrapper.text()).toBe("Value: 1")
  })

  it('State: function', () => {
    const store = createStore({
      state: { value: 1 }
    })

    @Options({ template: '<div/>' })
    class MyComp extends Vue {
      @State((state: { value: number }) => {
        return state.value + 10
      })
      foo: number
    }

    const wrapper = shallowMount(MyComp, {
      global: {
        plugins: [store]
      }
    })

    expect(wrapper.vm.foo).toBe(11)
  })

  it('State: implicit state name', () => {
    const store = createStore({
      state: { value: 1 }
    })

    @Options({ template: '<div/>' })
    class MyComp extends Vue {
      @State value: number
    }

    const c = shallowMount(MyComp, {
      global: {
        plugins: [store]
      }
    })

    expect(c.vm.value).toBe(1)
  })

  it('State: namespace', () => {
    const store = createStore({
      modules: {
        foo: {
          namespaced: true,
          state: { value: 1 }
        }
      }
    })

    const foo = namespace('foo')

    @Options({ template: '<div/>' })
    class MyComp extends Vue {
      @foo.State('value')
      bar: number

      @foo.State value: number
    }

    const c = shallowMount(MyComp, {
      global: {
        plugins: [store]
      }
    })
    expect(c.vm.bar).toBe(1)
    expect(c.vm.value).toBe(1)
  })

  it('Getter: type', () => {
    const store = createStore({
      state: { value: 1 },
      getters: {
        foo: state => state.value + 1
      }
    })

    @Options({ template: '<div/>' })
    class MyComp extends Vue {
      @Getter('foo')
      bar: number
    }

    const c = shallowMount(MyComp, {
      global: {
        plugins: [store]
      }
    })
    expect(c.vm.bar).toBe(2)
  })

  it('Getter: implicit getter type', () => {
    const store = createStore({
      state: { value: 1 },
      getters: {
        foo: state => state.value + 1
      }
    })

    @Options({ template: '<div/>' })
    class MyComp extends Vue {
      @Getter foo: number
    }

    const c = shallowMount(MyComp, {
      global: {
        plugins: [store]
      }
    })
    expect(c.vm.foo).toBe(2)
  })

  it('Getter: namespace', () => {
    const store = createStore({
      modules: {
        foo: {
          namespaced: true,
          state: { value: 1 },
          getters: {
            bar: state => state.value + 1
          }
        }
      }
    })

    const foo = namespace('foo')

    @Options({ template: '<div/>' })
    class MyComp extends Vue {
      @foo.Getter('bar')
      baz: number

      @foo.Getter bar: number
    }

    const c = shallowMount(MyComp, {
      global: {
        plugins: [store]
      }
    })
    expect(c.vm.baz).toBe(2)
    expect(c.vm.bar).toBe(2)
  })

  it('Action: type', () => {
    const spy = jest.fn()

    const store = createStore({
      actions: {
        foo: spy
      }
    })

    @Options({ template: '<div/>' })
    class MyComp extends Vue {
      @Action('foo')
      bar: (payload: { value: number }) => void
    }

    const c = shallowMount(MyComp, {
      global: {
        plugins: [store]
      }
    })
    c.vm.bar({ value: 1 })
    expect(spy.mock.calls[0][1]).toEqual({ value: 1 })
  })

  it('Action: implicity action type', () => {
    const spy = jest.fn()

    const store = createStore({
      actions: {
        foo: spy
      }
    })

    @Options({ template: '<div/>' })
    class MyComp extends Vue {
      @Action foo: () => void
    }

    const c = shallowMount(MyComp, {
      global: {
        plugins: [store]
      }
    })
    c.vm.foo()
    expect(spy).toHaveBeenCalled()
  })

  it('Action: namespace', () => {
    const spy = jest.fn()

    const store = createStore({
      modules: {
        foo: {
          namespaced: true,
          actions: {
            bar: spy
          }
        }
      }
    })

    const foo = namespace('foo')

    @Options({ template: '<div/>' })
    class MyComp extends Vue {
      @foo.Action('bar')
      baz: (payload: { value: number }) => void

      @foo.Action
      bar: (payload: { value: number }) => void
    }

    const c = shallowMount(MyComp, {
      global: {
        plugins: [store]
      }
    })
    c.vm.baz({ value: 1 })
    expect(spy.mock.calls[0][1]).toEqual({ value: 1 })
    c.vm.bar({ value: 2 })
    expect(spy.mock.calls[1][1]).toEqual({ value: 2 })
  })

  it('Mutation: type', () => {
    const spy = jest.fn()

    const store = createStore({
      mutations: {
        foo: spy
      }
    })

    @Options({ template: '<div/>' })
    class MyComp extends Vue {
      @Mutation('foo')
      bar: (payload: { value: number }) => void
    }

    const c = shallowMount(MyComp, {
      global: {
        plugins: [store]
      }
    })
    c.vm.bar({ value: 1 })
    expect(spy.mock.calls[0][1]).toEqual({ value: 1 })
  })

  it('Mutation: implicit mutation type', () => {
    const spy = jest.fn()

    const store = createStore({
      mutations: {
        foo: spy
      }
    })

    @Options({ template: '<div/>' })
    class MyComp extends Vue {
      @Mutation foo: () => void
    }

    const c = shallowMount(MyComp, {
      global: {
        plugins: [store]
      }
    })
    c.vm.foo()
    expect(spy).toHaveBeenCalled()
  })

  it('Mutation: namespace', () => {
    const spy = jest.fn()

    const store = createStore({
      modules: {
        foo: {
          namespaced: true,
          mutations: {
            bar: spy
          }
        }
      }
    })

    const foo = namespace('foo')

    @Options({ template: '<div/>' })
    class MyComp extends Vue {
      @foo.Mutation('bar')
      baz: (payload: { value: number }) => void

      @foo.Mutation
      bar: (payload: { value: number }) => void
    }

    const c = shallowMount(MyComp, {
      global: {
        plugins: [store]
      }
    })
    c.vm.baz({ value: 1 })
    expect(spy.mock.calls[0][1]).toEqual({ value: 1 })
    c.vm.bar({ value: 2 })
    expect(spy.mock.calls[1][1]).toEqual({ value: 2 })
  })
})
