<template>
    <div class="input-group">
        <select class="form-select rounded-left" v-model="CountryCode">
            <option
                :value="code.code"
                v-for="code in country_codes"
                :key="code.code"
            >
                {{ code.name }}
            </option>
        </select>

        <input
            type="text"
            v-model="PhoneNumber"
            class="p-2 border bg-light rounded-right form-control"
        />
    </div>
</template>
<script>
import countryCodes from "country-codes-list";
const formatter = (v, country_code) => {
    let number = v.replace(/\D+/gim, "").substr(0, 11);
    if ("+55" == country_code) {
        if (/^800/.test(number)) {
            number = number
                .replace(/^(\d{3})(\d{0,3})(\d{0,4})/gim, "$1 $2 $3")
                .replace(/\D+$/gim, "");
        } else if (number.length <= 10) {
            number = number
                .replace(/^(\d{2})(\d{0,4})(\d{0,4})/gim, "$1 $2-$3")
                .replace(/\D+$/gim, "");
        } else {
            number = number
                .replace(/^(\d{2})(\d{0,5})(\d{0,4})/gim, "$1 $2-$3")
                .replace(/\D+$/gim, "");
        }
    } else {
        if (8 >= number.length) {
            number = number
                .replace(/^(\d{0,4})(\d{0,4})/gim, "$1 $2")
                .replace(/\D+$/gim, "");
        } else {
            number = number
                .replace(/^(\d{0,3})(\d{0,3})(\d{0,3})/gim, "$1 $2 $3")
                .replace(/\D+$/gim, "");
        }
    }
    return number;
};
export default {
    props: ["modelValue"],
    data() {
        return {
            country_code: "",
            number: "",
        };
    },
    computed: {
        country_codes: {
            get() {
                let codes = countryCodes.customList(
                    "countryCallingCode",
                    "{flag} +{countryCallingCode}"
                );
                let Codes = [];
                for (let code in codes) {
                    Codes.push({
                        code: `+${code.replace(/\D+/,'')}`,
                        name: codes[code],
                    });
                }
                return Codes;
            },
        },
        CountryCode: {
            get() {
                if ('' === this.country_code){
                    return '+55';
                }
                return this.country_code;
            },
            set(v) {
                let celular = `${v} ${this.PhoneNumber}`;
                
                this.$emit("update:modelValue", celular);
            },
        },
        PhoneNumber: {
            get() {
                return this.number;
            },
            set(v) {
                this.number = "asdf";
                let number = formatter(v, this.CountryCode);

                let celular = `${this.CountryCode} ${number}`;
                this.number = number;
                
                this.$emit("update:modelValue", celular);
            },
        },
    },
    watch: {
        modelValue: {
            immediate: true,
            handler(v) {
                let [country_code = "", ...number] = (v || "").split(" ");
                this.country_code = country_code || "";
                this.number = formatter(number.join(" ") || "", country_code);                
            },
        },
    },
};
</script>
<style lang="less" scoped>
    .input-group > .form-select {
        width: 130px;
        flex: 0 1 auto!important;
    }
</style>