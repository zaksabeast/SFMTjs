'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function leftShift32bitSafe(base, bits) {
    var temp = (base & Math.pow(2, 32 - bits) - 1) * Math.pow(2, bits);
    return temp;
}

function nextState(seed, add) {
    var low = seed & 0xffff;
    var a = 0x6c07 * low + (seed >>> 16) * 0x8965;
    return 0x8965 * low + (a & 0xffff) * 0x10000 + add;
}

var SFMT = function () {
    function SFMT(seed) {
        _classCallCheck(this, SFMT);

        this.MEXP = 19937;
        this.POS1 = 122;
        this.SL1 = 18;
        this.SL2 = 1;
        this.SR1 = 11;
        this.SR2 = 1;
        this.MSK1 = 0xdfffffef;
        this.MSK2 = 0xddfecb7f;
        this.MSK3 = 0xbffaffff;
        this.MSK4 = 0xbffffff6;
        this.PARITY1 = 0x00000001;
        this.PARITY2 = 0x00000000;
        this.PARITY3 = 0x00000000;
        this.PARITY4 = 0x13c9e684;
        this.N = 156;
        this.N32 = 624;
        this.SL2_x8 = 8;
        this.SR2_x8 = 8;
        this.SL2_ix8 = 56;
        this.SR2_ix8 = 56;
        this.init_gen_rand(seed);
    }

    _createClass(SFMT, [{
        key: 'NextUInt64',
        value: function NextUInt64() {
            var lower = this.NextUInt32(),
                upper = this.NextUInt32();
            return [upper, lower];
        }
    }, {
        key: 'NextUInt32',
        value: function NextUInt32() {
            //Checks if current array has been used fully and needs reshuffle
            if (this.idx >= this.N32) {
                this.gen_rand_all_19937();
                this.idx = 0;
            }
            return this.sfmt[this.idx++];
        }
    }, {
        key: 'init_gen_rand',
        value: function init_gen_rand(seed) {
            var i;
            this.sfmt = new Uint32Array(this.N32);
            this.sfmt[0] = seed;
            //Initializes the SFMT array
            for (i = 1; i < this.N32; i++) {
                var temp = (this.sfmt[i - 1] ^ this.sfmt[i - 1] >>> 30) >>> 0;
                this.sfmt[i] = nextState(temp, i);
            }
            this.period_certification();
            this.idx = this.N32;
        }
    }, {
        key: 'period_certification',
        value: function period_certification() {
            var PARITY = new Uint32Array(4);
            PARITY[0] = this.PARITY1;
            PARITY[1] = this.PARITY2;
            PARITY[2] = this.PARITY3;
            PARITY[3] = this.PARITY4;
            var i, j;
            var work;

            for (i = 0; i < 4; i++) {
                work = 1;
                for (j = 0; j < 32; j++) {
                    if ((work & PARITY[i]) != 0) {
                        this.sfmt[i] = (this.sfmt[i] ^ work) >>> 0;
                        console.log(this.sfmt[i]);
                        return;
                    }
                    work = work << 1;
                }
            }
        }
    }, {
        key: 'gen_rand_all_19937',
        value: function gen_rand_all_19937() {
            var a, b, c, d;

            a = 0;
            b = 488;
            c = 616;
            d = 620;

            //Reshuffles the SFMT array
            do {
                this.sfmt[a + 3] = this.sfmt[a + 3] ^ leftShift32bitSafe(this.sfmt[a + 3], 8) ^ this.sfmt[a + 2] >>> 24 ^ this.sfmt[c + 3] >>> 8 ^ (this.sfmt[b + 3] >>> this.SR1 & this.MSK4) >>> 0 ^ leftShift32bitSafe(this.sfmt[d + 3], this.SL1);
                this.sfmt[a + 2] = this.sfmt[a + 2] ^ leftShift32bitSafe(this.sfmt[a + 2], 8) ^ this.sfmt[a + 1] >>> 24 ^ leftShift32bitSafe(this.sfmt[c + 3], 24) ^ this.sfmt[c + 2] >>> 8 ^ (this.sfmt[b + 2] >>> this.SR1 & this.MSK3) >>> 0 ^ leftShift32bitSafe(this.sfmt[d + 2], this.SL1);
                this.sfmt[a + 1] = this.sfmt[a + 1] ^ leftShift32bitSafe(this.sfmt[a + 1], 8) ^ this.sfmt[a + 0] >>> 24 ^ leftShift32bitSafe(this.sfmt[c + 2], 24) ^ this.sfmt[c + 1] >>> 8 ^ (this.sfmt[b + 1] >>> this.SR1 & this.MSK2) >>> 0 ^ leftShift32bitSafe(this.sfmt[d + 1], this.SL1);
                this.sfmt[a + 0] = this.sfmt[a + 0] ^ leftShift32bitSafe(this.sfmt[a + 0], 8) ^ leftShift32bitSafe(this.sfmt[c + 1], 24) ^ this.sfmt[c + 0] >>> 8 ^ (this.sfmt[b + 0] >>> this.SR1 & this.MSK1) >>> 0 ^ leftShift32bitSafe(this.sfmt[d + 0], this.SL1);
                c = d;
                d = a;
                a += 4;
                b += 4;
                if (b >= this.N32) b = 0;
            } while (a < this.N32);
        }
    }]);

    return SFMT;
}();

exports.default = SFMT;
