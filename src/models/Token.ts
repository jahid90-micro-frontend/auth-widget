class Token {

    _value: string;

    constructor(value: string) {
        this._value = value;
    }

    get value() {
        return this._value;
    }

    toJSON = () => {
        return {
            value: 'REDACTED',
        }
    }
}

export default Token;
