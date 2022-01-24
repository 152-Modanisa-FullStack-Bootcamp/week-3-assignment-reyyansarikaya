import Counter from "../../src/Counter";
import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuex from "vuex";
import {state, getters, mutations, actions} from "../../src/store";

function shallowMountComponent() {
    const localVue = createLocalVue()
    localVue.use(Vuex)
    return shallowMount(Counter, {
        localVue,
        store: new Vuex.Store({
            state, getters, mutations, actions
        })
    })
}

// Because  the buttons do not have an id,
// The following is how you can find button:
function returnButton(buttonFind, buttonValue) {
    for (let index = 0; index < buttonFind.length; index++) {
        if (buttonFind.at(index).text() === buttonValue) {
            return buttonFind.at(index);
        }
    }
}

describe("Counter.vue", () => {

    // 1. Component Exist Check
    it("should component exist", () => {
        let wrapper = shallowMountComponent()
        expect(wrapper.exists()).toBeTruthy()
    })

    // 2. Increase button exist check
    it('should the increase button exist', () => {
        let wrapper = shallowMountComponent()
        let buttonFind = wrapper.findAll("button") // return array
        expect(returnButton(buttonFind, "Increase").text()).toEqual("Increase")
    });

    // 3. Decrease button exist check
    it('should the decrease button exist', () => {
        let wrapper = shallowMountComponent()
        let buttonFind = wrapper.findAll("button") // return array
        expect(returnButton(buttonFind, "Decrease").text()).toEqual("Decrease")
    });

    // 4. Increase button functionality check
    it('should the increase button functionality check', () => {
        const mock = jest.fn()
        const wrapper = shallowMount(Counter, {
            mocks: {
                $store: {
                    dispatch: mock,
                    state
                },
            }
        })
        let increaseButton = returnButton(wrapper.findAll("button"), "Increase");
        increaseButton.trigger("click");
        expect(mock).toHaveBeenCalledWith("increment")
    });

    // 5. Decrease button functionality check
    it('should the decrease button functionality check', function () {
        const mock = jest.fn()
        const wrapper = shallowMount(Counter, {
            mocks: {
                $store: {
                    dispatch: mock,
                    state
                },
            }
        })
        let decreaseButton = returnButton(wrapper.findAll("button"), "Decrease");
        decreaseButton.trigger("click");
        expect(mock).toHaveBeenCalledWith("decrement")
    });

    // 6. 2 increase + decrease functionality check together
    it('should 2 increase and decrease functionality check together', () => {
        let wrapper = shallowMountComponent()
        let increaseButton = returnButton(wrapper.findAll("button"), "Increase");
        let decreaseButton = returnButton(wrapper.findAll("button"), "Decrease");
        increaseButton.trigger("click");
        increaseButton.trigger("click");
        decreaseButton.trigger("click");
        expect(wrapper.vm.$store.state.count).toEqual(1)
    });

    // 7. Count text show check
    it('should count text show check', () => {
        let wrapper = shallowMountComponent()
        const countValue = wrapper.vm.$store.state.count
        const countText = wrapper.find("span").text();
        expect(countText).toEqual(`${countValue}k`)
    });
})