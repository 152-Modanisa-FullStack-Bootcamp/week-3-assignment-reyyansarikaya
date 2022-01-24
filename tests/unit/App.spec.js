import App from "../../src/App";
import Vuex from "vuex";
import {state, getters} from "../../src/store";
import {createLocalVue, shallowMount} from "@vue/test-utils";

function mountComponent() {
    const localVue = createLocalVue()
    localVue.use(Vuex)

    return shallowMount(App, {
        localVue,
        store: new Vuex.Store({
            state: JSON.parse(JSON.stringify(state)),
            getters
        })
    })
}

describe("App.vue", () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mountComponent()
    })
    // Component Exist Check
    it('component exist check', () => {
        expect(wrapper.exists()).toBeTruthy();
    })

    // 1. h1 exists
    it('should h1 element exist', () => {
        expect(wrapper.find("h1").exists()).toBeTruthy();
    })

    // 2. h1 text equals to Daily Corona Cases in Turkey check
    it("should h1's text equal to Daily Corona Cases in Turkey", () => {
        expect(wrapper.find("h1").text()).toEqual("Daily Corona Cases in Turkey")
    })
    // 3. notificationArea class check based on getCount value
    describe("notificationArea class check based on getCount value ", () => {
        const testCases = [
            {
                name: "when count value is 15",
                countValue: 15,
                expectedClass: "danger"
            },
            {
                name: "when count value is 7",
                countValue: 7,
                expectedClass: "normal"
            },
            {
                name: "when count value is 3",
                countValue: 3,
                expectedClass: "safe"
            }
        ];
        for (let caseValue of testCases) {
            it(caseValue.name, async () => {
                wrapper.vm.$store.state.count = caseValue.countValue;
                await wrapper.vm.$nextTick();
                expect(wrapper.find(".notificationArea").classes()).toContain(caseValue.expectedClass)
            });
        }
    })

    // 4. notificationArea text message check
    describe("notificationArea text message check", () => {
        const testCases = [
            {
                name: "when count value is 15",
                countValue: 15,
                message: "Danger!!! Case count is 15k"
            },
            {
                name: "when count value is 7",
                countValue: 7,
                message: "Life is normal. Case count is 7k"
            },
            {
                name: "when count value is 3",
                countValue: 3,
                message: "So safe. Case count is 3k"
            }
        ];
        for (let testcase of testCases) {
            it(testcase.name, async () => {
                wrapper.vm.$store.state.count = testcase.countValue
                await wrapper.vm.$nextTick();
                let message = wrapper.find(".notificationArea").text()
                expect(message).toEqual(testcase.message)
            });
        }
    })
})
